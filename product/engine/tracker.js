// Reading tracker
// ---------------------------------------------------------------------------
// Follows a reader through a page using a stream of speech-recognition
// transcripts. Recognisers revise their guesses, parents repeat words, talk to
// their child mid-page, and say "um". So on every update we re-align the whole
// spoken stream against the page (semi-global alignment: cheap insertions,
// costly skips) and only ever move *forward*: once a word is read, it stays read.
//
// The tracker also keeps the clock: how long the reader has been on the
// current word, which the UI turns into gentle, escalating hints.

import { normalizeWord } from './text.js';

const HOMOPHONES = [
  ['to', 'two', 'too'], ['there', 'their', 'theyre'], ['sea', 'see'], ['son', 'sun'], ['for', 'four', 'fore'],
  ['won', 'one'], ['night', 'knight'], ['red', 'read'], ['eight', 'ate'], ['right', 'write'], ['no', 'know'],
  ['by', 'buy', 'bye'], ['hear', 'here'], ['new', 'knew'], ['not', 'knot'], ['so', 'sew'], ['tail', 'tale'],
  ['be', 'bee'], ['dear', 'deer'], ['flour', 'flower'], ['hole', 'whole'], ['hi', 'high'], ['blew', 'blue'],
  ['pair', 'pear'], ['bear', 'bare'], ['mail', 'male'], ['meat', 'meet'], ['road', 'rode'], ['sail', 'sale'],
  ['week', 'weak'], ['wood', 'would'], ['its', "it's"], ['your', "you're"], ['ok', 'okay'], ['mom', 'mum', 'mam'],
  ['mama', 'momma'], ['grandma', 'grandmother'], ['dad', 'dada'], ['nap', 'knap'], ['hen', 'hand'],
];
const HOMO = new Map();
for (const group of HOMOPHONES) for (const w of group) HOMO.set(w, group[0]);
const NUMBERS = { 0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten' };

export function spokenTokens(transcript) {
  return transcript
    .split(/\s+/)
    .flatMap(t => (NUMBERS[t] ? [NUMBERS[t]] : [normalizeWord(t)]))
    .filter(Boolean);
}

function canon(w) { const b = w.replace(/'s$/, ''); return HOMO.get(b) || b; }

function lev(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

/** 0..1 similarity between a spoken token and an expected word. */
export function similarity(spoken, expected, { lenient = false } = {}) {
  const s = canon(spoken), e = canon(expected);
  if (s === e) return 1;
  if (lenient) return 0.9; // names: recognisers rarely spell them the family's way
  if (s.length <= 2 || e.length <= 2) return 0;
  const d = lev(s, e);
  const r = 1 - d / Math.max(s.length, e.length);
  if (d === 1 && e.length >= 4) return 0.75; // "frogs" for "frog", "jump" for "jumps"
  return r >= 0.75 ? r * 0.8 : 0;
}

const INSERT = -0.15; // spoken word not on the page (chatter, repeats, "um")
const SKIP = -0.7;    // page word never said
const MATCH_MIN = 0.6;

/**
 * Align spoken tokens to expected words. Returns, for each expected index,
 * the spoken index it matched (or -1), and the furthest expected index reached.
 */
export function alignSpoken(spoken, expected, lenientIdx = new Set()) {
  const m = spoken.length, n = expected.length;
  // score[i][j]: best score aligning spoken[0..i) with expected[0..j)
  const score = Array.from({ length: m + 1 }, () => new Float64Array(n + 1).fill(-Infinity));
  const back = Array.from({ length: m + 1 }, () => new Int8Array(n + 1));
  score[0][0] = 0;
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      const cur = score[i][j];
      if (cur === -Infinity) continue;
      if (i < m && cur + INSERT > score[i + 1][j]) { score[i + 1][j] = cur + INSERT; back[i + 1][j] = 1; }
      if (j < n && cur + SKIP > score[i][j + 1]) { score[i][j + 1] = cur + SKIP; back[i][j + 1] = 2; }
      if (i < m && j < n) {
        const sim = similarity(spoken[i], expected[j], { lenient: lenientIdx.has(j) });
        if (sim >= MATCH_MIN && cur + sim > score[i + 1][j + 1]) { score[i + 1][j + 1] = cur + sim; back[i + 1][j + 1] = 3; }
      }
    }
  }
  // semi-global: all spoken consumed, any prefix of expected
  let bestJ = 0, best = -Infinity;
  for (let j = 0; j <= n; j++) if (score[m][j] > best + 1e-9) { best = score[m][j]; bestJ = j; }
  const matchOf = new Array(n).fill(-1);
  let i = m, j = bestJ;
  while (i > 0 || j > 0) {
    const b = back[i][j];
    if (b === 3) { matchOf[j - 1] = i - 1; i--; j--; } else if (b === 2) j--; else if (b === 1) i--; else break;
  }
  // furthest expected word actually matched
  let furthest = -1;
  for (let k = n - 1; k >= 0; k--) if (matchOf[k] >= 0) { furthest = k; break; }
  return { matchOf, furthest };
}

/**
 * Stateful tracker for one page.
 * words: [{norm, lenient?}] in reading order.
 */
export class PageTracker {
  constructor(words, { now = () => Date.now() } = {}) {
    this.words = words;
    this.expected = words.map(w => w.norm.replace(/'s$/, ''));
    this.lenient = new Set(words.map((w, i) => (w.lenient ? i : -1)).filter(i => i >= 0));
    this.now = now;
    this.state = words.map(() => ({ status: 'unread', hint: 0, stuckMs: 0 }));
    this.cursor = 0;
    this.finalText = '';
    this.lastProgress = now();
    this.listening = false;
  }

  /** Feed the recogniser's view: everything final so far plus the current interim guess. */
  update(finalText, interimText = '') {
    this.finalText = finalText;
    const spoken = spokenTokens(`${finalText} ${interimText}`.trim());
    const { matchOf, furthest } = alignSpoken(spoken, this.expected, this.lenient);
    const events = [];
    for (let k = this.cursor; k <= furthest; k++) {
      const st = this.state[k];
      if (st.status !== 'unread') continue;
      if (matchOf[k] >= 0) {
        st.status = 'read';
        st.quality = st.hint >= 2 ? 'helped' : st.stuckMs > 2500 ? 'effortful' : 'fluent';
        if (st.hint >= 1 && st.quality === 'fluent') st.quality = 'effortful';
      } else {
        st.status = 'skipped';
        st.quality = 'skipped';
      }
      events.push({ type: st.status, index: k, quality: st.quality });
    }
    if (furthest + 1 > this.cursor) {
      this.cursor = furthest + 1;
      this.lastProgress = this.now();
    }
    return events;
  }

  /** Mark the current word read by hand (tap mode) or after the coach said it. */
  markCurrent(quality = 'helped') {
    if (this.cursor >= this.words.length) return null;
    const st = this.state[this.cursor];
    st.status = 'read'; st.quality = quality;
    const ev = { type: 'read', index: this.cursor, quality };
    this.cursor++;
    this.lastProgress = this.now();
    return ev;
  }

  /** Called on a timer. Returns the hint level the current word has earned (0–3). */
  tick({ thresholds = [3000, 6500, 11000] } = {}) {
    if (this.done || !this.listening) return 0;
    const st = this.state[this.cursor];
    const waited = this.now() - this.lastProgress;
    st.stuckMs = Math.max(st.stuckMs, waited);
    let level = 0;
    for (const t of thresholds) if (waited >= t) level++;
    if (this.lenient.has(this.cursor)) level = 0;
    if (level > st.hint) st.hint = level;
    return st.hint;
  }

  /** Reader asked for help on the current word. */
  escalate() {
    if (this.done) return 0;
    const st = this.state[this.cursor];
    st.hint = Math.min(3, st.hint + 1);
    return st.hint;
  }

  get done() { return this.cursor >= this.words.length; }
  get current() { return this.done ? -1 : this.cursor; }
  resetClock() { this.lastProgress = this.now(); }
  summary() {
    const q = { fluent: 0, effortful: 0, helped: 0, skipped: 0 };
    for (const s of this.state) if (s.quality) q[s.quality]++;
    return q;
  }
}

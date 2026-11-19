// Lexicon: word → pronunciations → best alignment → patterns → step.
// Works in the browser (data passed in after fetch) and in Node (tests, server).

import { alignWord, wordPatterns, stepFor } from './align.js';
import { HEART_WORD_STEP, isVowelPhoneme, stripStress } from './phonics.js';

// Two-letter words allowed as halves of a compound ("upon", "into", "itself").
const SHORT_HALVES = new Set(['up', 'in', 'on', 'it', 'at', 'an', 'us', 'to', 'be', 'my', 'no', 'go', 'so']);
const VOICELESS = new Set(['P', 'T', 'K', 'F', 'TH']);
const SIBILANT = new Set(['S', 'Z', 'SH', 'ZH', 'CH', 'JH']);

export class Lexicon {
  /** @param {Record<string, string|string[]>} data word → "PH ON EMES" (or several), in frequency order */
  constructor(data) {
    this.data = data;
    this.cache = new Map();
    this.ranked = Object.keys(data);
    this.rank = new Map(this.ranked.map((w, i) => [w, i]));
  }

  has(word) { return Object.prototype.hasOwnProperty.call(this.data, word.toLowerCase()); }

  /** Pronunciations from the dictionary, or derived from known parts for new words. */
  prons(word) {
    const w = word.toLowerCase();
    const v = this.data[w];
    if (v) return (Array.isArray(v) ? v : [v]).map(s => s.split(' '));
    const d = this.derive(w);
    return d ? [d] : [];
  }

  syllables(word) {
    const p = this.prons(word)[0];
    return p ? p.filter(isVowelPhoneme).length : 0;
  }

  /**
   * Derive a pronunciation for a word the dictionary lacks: inflections of a
   * known base (foxes, hopping, baked) or a compound of two known words
   * (catnap, moonbeam). Keeps AI-written stories analysable.
   */
  derive(w, depth = 0) {
    if (depth > 1) return null;
    const base = b => (this.data[b] ? this.prons(b)[0] : depth === 0 ? this.derive(b, depth + 1) : null);
    const last = p => stripStress(p[p.length - 1]);
    let m;
    if ((m = w.match(/^(.+?)(es)$/)) && base(m[1]) && SIBILANT.has(last(base(m[1])))) return [...base(m[1]), 'IH0', 'Z'];
    if ((m = w.match(/^(.+)s$/)) && base(m[1])) { const b = base(m[1]); return [...b, VOICELESS.has(last(b)) ? 'S' : 'Z']; }
    if ((m = w.match(/^(.+)ing$/))) {
      const cands = [m[1], m[1] + 'e', m[1].replace(/(.)\1$/, '$1')];
      for (const c of cands) if (c.length > 1 && base(c)) return [...base(c), 'IH0', 'NG'];
    }
    if ((m = w.match(/^(.+)ed$/))) {
      const cands = [m[1], m[1] + 'e', m[1].replace(/(.)\1$/, '$1'), m[1].replace(/i$/, 'y')];
      for (const c of cands) if (c.length > 1 && base(c)) {
        const b = base(c), l = last(b);
        return [...b, ...(l === 'T' || l === 'D' ? ['IH0', 'D'] : VOICELESS.has(l) || l === 'S' || l === 'SH' || l === 'CH' ? ['T'] : ['D'])];
      }
    }
    for (let k = 2; k <= w.length - 2; k++) {
      const a = w.slice(0, k), b = w.slice(k);
      if (this.data[a] && this.data[b] && this.okHalf(a) && this.okHalf(b)) return [...this.prons(a)[0], ...this.prons(b)[0]];
    }
    return null;
  }

  okHalf(w) {
    if (w.length < 2) return false;
    if (w.length === 2 && !SHORT_HALVES.has(w)) return false;
    const r = this.rank.get(w);
    return r !== undefined && r < 12000 && this.syllables(w) === 1;
  }

  /** True when the word really is two short words said one after the other. */
  isCompound(word, phones, segments) {
    const flat = phones.map(stripStress).join(' ');
    let pos = 0;
    const boundaries = new Set([0]);
    for (const s of segments) { pos += s.g.length; boundaries.add(pos); }
    for (let k = 2; k <= word.length - 2; k++) {
      if (!boundaries.has(k)) continue;
      const a = word.slice(0, k), b = word.slice(k);
      if (!this.okHalf(a) || !this.okHalf(b)) continue;
      for (const pa of this.prons(a)) for (const pb of this.prons(b)) {
        if ([...pa, ...pb].map(stripStress).join(' ') === flat) return true;
      }
    }
    return false;
  }

  /**
   * Full analysis of one word.
   * @returns {{word, known:boolean, phones:string[], segments:any[], patterns:string[], decodeStep:number, heartStep:number|null, step:number}}
   */
  analyze(raw) {
    const word = raw.toLowerCase().replace(/[’‘]/g, "'");
    if (this.cache.has(word)) return this.cache.get(word);
    const heartStep = HEART_WORD_STEP[word] ?? null;
    let best = null;
    for (const phones of this.prons(word)) {
      const al = alignWord(word, phones);
      if (!al) continue;
      const pats = wordPatterns(word, al.segments, { isCompound: (w, ph, seg) => this.isCompound(w, ph, seg) });
      const decodeStep = stepFor(pats);
      const cand = { phones, segments: al.segments, patterns: [...pats], decodeStep, cost: al.cost };
      if (!best || cand.decodeStep < best.decodeStep || (cand.decodeStep === best.decodeStep && cand.cost < best.cost)) best = cand;
    }
    // A word built from parts the reader already knows (some+one, friend+s)
    // is readable as soon as both parts are, even if a part is a heart word.
    const partsStep = best ? this.partsStep(word, best.phones) : Infinity;
    const res = best
      ? { word, known: true, ...best, heartStep, partsStep, step: Math.min(best.decodeStep, heartStep ?? Infinity, partsStep) }
      : { word, known: false, phones: [], segments: [...word].map(ch => ({ g: ch, ph: [], pat: 'irregular' })), patterns: ['irregular'], decodeStep: Infinity, heartStep, step: heartStep ?? Infinity, cost: Infinity };
    this.cache.set(word, res);
    return res;
  }

  /** Step at which a compound or inflection of known words becomes readable. */
  partsStep(word, phones) {
    if (this._partsDepth) return Infinity;
    this._partsDepth = true;
    try {
      const flat = phones.map(stripStress).join(' ');
      const same = (a, b) => a.map(stripStress).join(' ') === b;
      let bestStep = Infinity;
      // inflections
      const suffixes = [['s', ['S'], 1], ['s', ['Z'], 13], ['es', ['IH', 'Z'], 34], ['es', ['AH', 'Z'], 34], ['ed', ['D'], 34], ['ed', ['T'], 34], ['ed', ['IH', 'D'], 34], ['ing', ['IH', 'NG'], 34]];
      for (const [suf, ph, st] of suffixes) {
        if (!word.endsWith(suf) || word.length - suf.length < 2) continue;
        const b = word.slice(0, -suf.length);
        if (!this.has(b)) continue;
        for (const bp of this.prons(b)) if (same([...bp, ...ph], flat)) bestStep = Math.min(bestStep, Math.max(this.analyze(b).step, st));
      }
      // compounds
      for (let k = 2; k <= word.length - 2; k++) {
        const a = word.slice(0, k), b = word.slice(k);
        if (!this.okHalf(a) && !HEART_WORD_STEP[a]) continue;
        if (!this.okHalf(b) && !HEART_WORD_STEP[b]) continue;
        if (!this.has(a) || !this.has(b)) continue;
        let match = false;
        for (const pa of this.prons(a)) for (const pb of this.prons(b)) if (same([...pa, ...pb], flat)) match = true;
        if (match) bestStep = Math.min(bestStep, Math.max(this.analyze(a).step, this.analyze(b).step, 18));
      }
      return bestStep;
    } finally { this._partsDepth = false; }
  }

  /** How many of the `top` most frequent words a reader at `step` can read. */
  countReadable(step, { top = 5000 } = {}) {
    let n = 0;
    for (const w of this.ranked.slice(0, top)) if (this.analyze(w).step <= step) n++;
    return n;
  }
}

/** Load the lexicon JSON in Node (tests, tools, server). */
export async function loadLexiconNode(path) {
  const fs = await import('node:fs');
  return new Lexicon(JSON.parse(fs.readFileSync(path, 'utf8')));
}

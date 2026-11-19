// Decodability analysis: given a text and a reader, which words can they
// sound out, which are heart words, which use tonight's new sound, and which
// are still out of reach? Used to choose stories, validate AI-written ones,
// pick "watch words", and power the Studio x-ray.

import { tokenize, baseForm } from './text.js';
import { PATTERN_STEP, STEPS } from './phonics.js';

/**
 * @param {string} text already personalised
 * @param {import('./lexicon.js').Lexicon} lexicon
 * @param {{step:number, known?:string[]}} reader step = working step (its patterns count as taught)
 */
export function analyzeText(text, lexicon, { step, known = [] } = {}) {
  const knownSet = new Set(known.map(k => k.toLowerCase()));
  const tokens = tokenize(text);
  const newPatterns = new Set(STEPS[step - 1]?.patterns || []);
  const counts = { words: 0, decodable: 0, focus: 0, heart: 0, name: 0, tricky: 0 };
  for (const tok of tokens) {
    if (tok.t !== 'w') continue;
    counts.words++;
    const base = baseForm(tok.norm);
    if (knownSet.has(base) || knownSet.has(tok.norm)) { tok.status = 'name'; counts.name++; continue; }
    const a = lexicon.analyze(tok.norm);
    tok.a = a;
    if (a.decodeStep <= step || a.partsStep <= step) {
      const usesNew = a.decodeStep === step || a.patterns.some(p => newPatterns.has(p));
      tok.status = usesNew && a.decodeStep === step ? 'focus' : 'decodable';
      counts[tok.status]++;
    } else if (a.heartStep !== null && a.heartStep <= step) {
      tok.status = 'heart'; counts.heart++;
    } else {
      tok.status = 'tricky'; counts.tricky++;
    }
  }
  const readable = counts.words - counts.tricky;
  return {
    tokens,
    counts,
    decodablePct: counts.words ? (counts.decodable + counts.focus + counts.name) / counts.words : 1,
    readablePct: counts.words ? readable / counts.words : 1,
  };
}

/** Lowest step at which every word in the text is readable (names known). */
export function textStep(text, lexicon, known = []) {
  const knownSet = new Set(known.map(k => k.toLowerCase()));
  let max = 1;
  const offenders = [];
  for (const tok of tokenize(text)) {
    if (tok.t !== 'w') continue;
    const base = baseForm(tok.norm);
    if (knownSet.has(base)) continue;
    const s = lexicon.analyze(tok.norm).step;
    if (s === Infinity) offenders.push(tok.norm);
    else if (s > max) max = s;
  }
  return { step: offenders.length ? Infinity : max, offenders };
}

/**
 * Validate a whole story for a reader at `step`.
 * A story passes when every word is readable (decodable, heart word, or name)
 * — the strict standard we hold AI-written stories to.
 */
export function validateStory(story, lexicon, { step, known = [] }) {
  const problems = [];
  let words = 0, focus = 0, decodable = 0, heart = 0;
  const focusWords = new Map();
  story.pages.forEach((page, pi) => {
    const r = analyzeText(page.text, lexicon, { step, known });
    words += r.counts.words; focus += r.counts.focus; decodable += r.counts.decodable; heart += r.counts.heart;
    for (const t of r.tokens) {
      if (t.status === 'tricky') problems.push({ page: pi, word: t.text, needs: t.a?.decodeStep, patterns: t.a?.patterns });
      if (t.status === 'focus') focusWords.set(t.norm, (focusWords.get(t.norm) || 0) + 1);
    }
  });
  return {
    ok: problems.length === 0,
    problems,
    words,
    stats: { focus, decodable, heart },
    focusWords: [...focusWords.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w),
  };
}

/** Explain a word as chunks for hints: [{g:'sh', pat:'sh'}, {g:'i'}, {g:'p'}] with split digraphs linked. */
export function chunksFor(word, lexicon) {
  const a = lexicon.analyze(word);
  const chunks = [];
  let pos = 0;
  for (const seg of a.segments) {
    if (!seg.g) continue;
    chunks.push({ g: word.substr(pos, seg.g.length), pat: seg.pat, split: !!seg.split, close: !!seg.close, ph: seg.ph, step: PATTERN_STEP[seg.pat] ?? null });
    pos += seg.g.length;
  }
  if (pos < word.length) chunks.push({ g: word.slice(pos), pat: 'irregular' });
  return chunks;
}

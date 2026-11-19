// Learner model
// ---------------------------------------------------------------------------
// Bayesian Knowledge Tracing over letter-sound patterns. Every word a parent
// reads is evidence about the patterns inside it. Reading a word smoothly is
// evidence of knowing all of them; needing help is blamed on the pattern we
// were least sure of (the most likely culprit), not on everything at once.
//
// The model never shows a "level" to the parent. It drives three things:
//   1. which step's patterns tonight's story practises (the working step),
//   2. which words become "watch words" before story time,
//   3. the parent's private sky of stars (one per pattern).

import { STEPS, PATTERN_STEP, MAX_STEP } from './phonics.js';

export const BKT = { pInitKnown: 0.92, pInitWorking: 0.3, pInitFuture: 0.04, pLearn: 0.14, pSlip: 0.08, pGuess: 0.18, mastery: 0.88 };

const ALL_PATTERNS = STEPS.flatMap(s => s.patterns);

/** New learner placed so that steps ≤ `placedStep` are already known. */
export function createLearner(placedStep = 0) {
  const p = {};
  for (const pat of ALL_PATTERNS) {
    const st = PATTERN_STEP[pat];
    p[pat] = st <= placedStep ? BKT.pInitKnown : st === placedStep + 1 ? BKT.pInitWorking : BKT.pInitFuture;
  }
  return { version: 1, placedStep, p, seen: {}, log: [], createdAt: Date.now() };
}

function bktUpdate(pL, correct, weight = 1) {
  const { pSlip: s, pGuess: g, pLearn: t } = BKT;
  const post = correct ? (pL * (1 - s)) / (pL * (1 - s) + (1 - pL) * g) : (pL * s) / (pL * s + (1 - pL) * (1 - g));
  const blended = pL + (post - pL) * weight;
  return blended + (1 - blended) * t * weight;
}

/**
 * Record one word attempt.
 * @param outcome 'fluent' | 'effortful' | 'helped' | 'skipped'
 * @param analysis result of lexicon.analyze(word)
 */
export function observe(learner, analysis, outcome, { firstTimeToday = true } = {}) {
  if (!analysis || !analysis.known || analysis.decodeStep === Infinity) return learner;
  const pats = analysis.patterns.filter(p => PATTERN_STEP[p] !== undefined);
  if (!pats.length) return learner;
  // repeated reads of the same word within a session can be memorised by sight,
  // so they carry less evidence about decoding.
  const weight = firstTimeToday ? 1 : 0.35;
  if (outcome === 'fluent' || outcome === 'effortful') {
    const w = outcome === 'fluent' ? weight : weight * 0.6;
    for (const pat of pats) learner.p[pat] = bktUpdate(learner.p[pat], true, w);
  } else {
    const culprit = pats.reduce((a, b) => (learner.p[a] <= learner.p[b] ? a : b));
    learner.p[culprit] = bktUpdate(learner.p[culprit], false, weight);
  }
  learner.seen[analysis.word] = (learner.seen[analysis.word] || 0) + 1;
  return learner;
}

export const isMastered = (learner, pat) => (learner.p[pat] ?? 0) >= BKT.mastery;

/** The first step that still has a pattern below mastery. */
export function workingStep(learner) {
  for (const s of STEPS) if (!s.patterns.every(p => isMastered(learner, p))) return s.n;
  return MAX_STEP;
}

/** Progress for the parent's sky: one star per pattern. */
export function stars(learner) {
  const ws = workingStep(learner);
  return STEPS.flatMap(s => s.patterns.map(pat => ({
    pat, step: s.n,
    p: learner.p[pat] ?? 0,
    state: isMastered(learner, pat) ? 'lit' : s.n === ws ? 'glow' : s.n < ws ? 'lit' : 'dim',
  })));
}

/** Fraction of the working step learned so far (0..1), for a gentle progress ring. */
export function stepProgress(learner) {
  const s = STEPS[workingStep(learner) - 1];
  const vals = s.patterns.map(p => Math.min(1, (learner.p[p] ?? 0) / BKT.mastery));
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// ---- placement ------------------------------------------------------------

/** One clear, common, picturable word per probe step. */
export const PLACEMENT_LADDER = [
  { step: 1, word: 'mat' }, { step: 4, word: 'cap' }, { step: 8, word: 'bed' }, { step: 13, word: 'duck' },
  { step: 16, word: 'bath' }, { step: 18, word: 'frog' }, { step: 21, word: 'bone' }, { step: 25, word: 'boat' },
  { step: 29, word: 'bird' }, { step: 31, word: 'cloud' }, { step: 34, word: 'jumped' }, { step: 37, word: 'candle' },
  { step: 40, word: 'picture' },
];

/**
 * Adaptive placement: walk up the ladder, stop after two misses in a row.
 * Returns a controller the UI drives one word at a time.
 */
export function createPlacement() {
  let i = 0, misses = 0, passed = 0;
  const results = [];
  return {
    get done() { return i >= PLACEMENT_LADDER.length || misses >= 2; },
    get current() { return PLACEMENT_LADDER[i]; },
    get index() { return i; },
    get total() { return PLACEMENT_LADDER.length; },
    answer(correct) {
      const probe = PLACEMENT_LADDER[i];
      results.push({ ...probe, correct });
      if (correct) { passed = probe.step; misses = 0; } else misses++;
      i++;
    },
    get placedStep() { return passed; },
    results,
  };
}

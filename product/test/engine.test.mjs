import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLexiconNode } from '../engine/lexicon.js';
import { analyzeText, validateStory, chunksFor, textStep } from '../engine/decodable.js';
import { personalize, tokenize } from '../engine/text.js';
import { STEPS, PATTERN_STEP, PATTERN_INFO, HEART_WORD_STEP } from '../engine/phonics.js';

const lx = await loadLexiconNode(new URL('../data/lexicon.json', import.meta.url).pathname);
const seg = w => lx.analyze(w).segments.filter(s => s.g).map(s => s.g).join('·');

test('every pattern has a step and parent-facing info', () => {
  for (const s of STEPS) for (const p of s.patterns) {
    assert.ok(PATTERN_STEP[p] === s.n, `${p} step`);
    assert.ok(PATTERN_INFO[p], `${p} has info`);
  }
  assert.equal(STEPS.length, 40);
});

test('aligns digraphs, split digraphs, and soft letters', () => {
  assert.equal(seg('ship'), 'sh·i·p');
  assert.equal(seg('cake'), 'c·a·k·e');
  assert.deepEqual(lx.analyze('cake').patterns.sort(), ['a_e', 'c_k', 'k']);
  assert.equal(seg('night'), 'n·igh·t');
  assert.equal(seg('bridge'), 'b·r·i·dge');
  assert.ok(lx.analyze('page').patterns.includes('g_j'));
  assert.ok(lx.analyze('city').patterns.includes('c_s'));
  assert.equal(seg('catch'), 'c·a·tch');
});

test('steps follow the scope & sequence', () => {
  const step = w => lx.analyze(w).decodeStep;
  assert.equal(step('sat'), 1);
  assert.equal(step('cat'), 4);
  assert.equal(step('fox'), 12);
  assert.equal(step('ship'), 14);
  assert.equal(step('frog'), 18);   // blend
  assert.equal(step('cake'), 19);
  assert.equal(step('night'), 26);
  assert.equal(step('moon'), 30);
  assert.equal(step('jumped'), 34);
  assert.equal(step('rabbit'), 35);
  assert.equal(step('little'), 37);
  assert.equal(step('picture'), 40);
});

test('schwa is told apart from short u', () => {
  assert.ok(lx.analyze('sun').patterns.includes('u_short'));
  assert.ok(lx.analyze('basket').patterns.includes('schwa'));
});

test('heart words are readable before they are decodable', () => {
  const said = lx.analyze('said');
  assert.equal(said.decodeStep, Infinity);
  assert.equal(said.step, HEART_WORD_STEP.said);
  assert.equal(lx.analyze('the').step, 1);
});

test('compounds and inflections of known words', () => {
  assert.ok(lx.analyze('sunset').patterns.includes('compound'));
  assert.ok(!lx.analyze('kitten').patterns.includes('compound'), 'kit+ten is not a real compound');
  assert.equal(lx.analyze('catnap').decodeStep, 18, 'derived from cat + nap');
  assert.equal(lx.analyze('someone').step, 18, 'some + one are heart words');
  assert.equal(lx.analyze('cats').decodeStep, 4, 'plural s does not make a blend');
});

test('personalize + tokenize keep word indexes', () => {
  const t = personalize('{child} and {grownup} sat.', { childName: 'Rosa', grownup: 'Papa' });
  assert.equal(t, 'Rosa and Papa sat.');
  const toks = tokenize("Rosa's cat sat, Papa!").filter(x => x.t === 'w');
  assert.deepEqual(toks.map(x => x.wi), [0, 1, 2, 3]);
  assert.equal(toks[0].norm, "rosa's");
});

test('analyzeText classifies words for a reader', () => {
  const r = analyzeText('Rosa can see the cat.', lx, { step: 4, known: ['Rosa'] });
  const st = Object.fromEntries(r.tokens.filter(t => t.t === 'w').map(t => [t.norm, t.status]));
  assert.equal(st.rosa, 'name');
  assert.equal(st.the, 'heart');
  assert.equal(st.can, 'focus');   // uses this step's new letter c
  assert.equal(st.see, 'tricky');  // ee is step 23
});

test('validateStory flags words beyond the reader', () => {
  const story = { pages: [{ text: '{child} sat.' }, { text: 'The cat sat on a mat.' }] };
  const pages = story.pages.map(p => ({ text: personalize(p.text, { childName: 'Ana' }) }));
  const ok = validateStory({ pages }, lx, { step: 5, known: ['Ana'] });
  assert.ok(ok.ok, JSON.stringify(ok.problems));
  const bad = validateStory({ pages: [{ text: 'The cat sees the moon.' }] }, lx, { step: 5 });
  assert.equal(bad.ok, false);
  assert.deepEqual(bad.problems.map(p => p.word).sort(), ['moon', 'sees']);
});

test('chunksFor gives display chunks covering the word', () => {
  const ch = chunksFor('Ship', lx);
  assert.equal(ch.map(c => c.g).join(''), 'Ship');
  assert.equal(ch[0].g, 'Sh');
});

test('textStep reports the hardest word', () => {
  assert.equal(textStep('The fox sat.', lx).step, 12);
});

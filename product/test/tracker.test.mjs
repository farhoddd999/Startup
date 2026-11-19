import test from 'node:test';
import assert from 'node:assert/strict';
import { PageTracker, alignSpoken, similarity, spokenTokens } from '../engine/tracker.js';
import { simulatePage } from '../engine/simulate.js';
import { tokenize } from '../engine/text.js';
import { createLearner, observe, workingStep, createPlacement, stars, BKT } from '../engine/learner.js';
import { loadLexiconNode } from '../engine/lexicon.js';

const lx = await loadLexiconNode(new URL('../data/lexicon.json', import.meta.url).pathname);
const page = text => tokenize(text).filter(t => t.t === 'w').map(t => ({ norm: t.norm, text: t.text }));

test('similarity handles homophones, numbers and near misses', () => {
  assert.equal(similarity('two', 'to'), 1);
  assert.equal(similarity('sea', 'see'), 1);
  assert.deepEqual(spokenTokens('I see 2 cats'), ['i', 'see', 'two', 'cats']);
  assert.ok(similarity('frogs', 'frog') >= 0.6);
  assert.equal(similarity('ju', 'jumped'), 0);
});

test('tracks a clean read word by word', () => {
  let t = 0;
  const tr = new PageTracker(page('The fox sat on a log.'), { now: () => t });
  tr.listening = true;
  tr.update('', 'the fox');
  assert.equal(tr.cursor, 2);
  tr.update('the fox sat on a log');
  assert.ok(tr.done);
  assert.deepEqual(tr.summary(), { fluent: 6, effortful: 0, helped: 0, skipped: 0 });
});

test('ignores chatter and repeats, never moves backwards', () => {
  const tr = new PageTracker(page('Sam can see the big red bus.'));
  tr.update('sam can um sam can see');
  assert.equal(tr.cursor, 3);
  tr.update('sam can um sam can see look at that');   // talking to the child
  assert.equal(tr.cursor, 3);
  tr.update('sam can um sam can see look at that the big red bus');
  assert.ok(tr.done);
  assert.equal(tr.summary().skipped, 0);
});

test('a skipped word is recorded as skipped', () => {
  const tr = new PageTracker(page('The cat sat on the mat.'));
  tr.update('the cat on the mat');
  assert.ok(tr.done);
  assert.equal(tr.state[2].quality, 'skipped');
});

test('hesitation earns escalating hints and lowers quality', () => {
  let t = 0;
  const tr = new PageTracker(page('A frog can jump.'), { now: () => t });
  tr.listening = true;
  tr.update('a');
  t += 3500; assert.equal(tr.tick(), 1);
  t += 3500; assert.equal(tr.tick(), 2);
  tr.update('a frog');
  assert.equal(tr.state[1].quality, 'helped');
  t += 400; tr.update('a frog can jump');
  assert.equal(tr.state[3].quality, 'fluent');
});

test('names are matched leniently and never trigger hints', () => {
  let t = 0;
  const words = page('Xiomara can hop.'); words[0].lenient = true;
  const tr = new PageTracker(words, { now: () => t });
  tr.listening = true;
  t += 8000;
  assert.equal(tr.tick(), 0);
  tr.update('see oh mara can hop');
  assert.ok(tr.done);
});

test('simulated reader drives the tracker to the end with some struggle', () => {
  const words = page('The ship is big. Fish swim in the sea.').map((w, i) => ({ ...w, focus: ['ship', 'fish'].includes(w.norm) }));
  const tl = simulatePage(words, { seed: 3, struggle: 1 });
  let now = 0;
  const tr = new PageTracker(words, { now: () => now });
  tr.listening = true;
  let maxHint = 0;
  for (const snap of tl) {
    while (now < snap.at) { now += 250; maxHint = Math.max(maxHint, tr.tick()); }
    tr.update(snap.final, snap.interim);
  }
  assert.ok(tr.done);
  assert.ok(maxHint >= 1, 'struggle produced a hint');
});

test('placement walks the ladder and stops after two misses', () => {
  const p = createPlacement();
  p.answer(true); p.answer(true); p.answer(true); // mat cap bed
  p.answer(false); p.answer(false);               // duck bath
  assert.ok(p.done);
  assert.equal(p.placedStep, 8);
});

test('learner: fluent reading builds mastery, struggles are blamed narrowly', () => {
  const L = createLearner(13);
  assert.equal(workingStep(L), 14);
  const ship = lx.analyze('ship');
  for (let i = 0; i < 6; i++) observe(L, ship, 'fluent');
  assert.ok(L.p.sh >= BKT.mastery);
  const before = { ...L.p };
  observe(L, lx.analyze('chip'), 'helped');
  assert.notEqual(L.p.ch, before.ch, 'ch (least known) takes the evidence');
  assert.equal(L.p.p, before.p, 'p untouched');
  assert.equal(L.p.i_short, before.i_short, 'well-known short i untouched');
  assert.ok(stars(L).length > 100);
});

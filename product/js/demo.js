// A ready-made demo family so presenters can skip onboarding.
// Rosa reads to her son Mateo; she's three weeks in and working on "sh".

import { createLearner, observe } from '../engine/learner.js';
import { defaultState } from './store.js';
import { getLexicon } from './stories.js';

export function demoFamily() {
  const s = defaultState();
  s.onboarded = true;
  s.demo = true;
  s.family = {
    childName: 'Mateo', childAge: '4-5', grownup: 'Mama', interests: ['animals', 'space'], lang: 'en',
    look: { childSkin: 2, childHair: 'curls', childHairColor: 0, grownupSkin: 2, grownupHair: 'long', grownupHairColor: 0 },
  };
  s.settings.mic = 'demo';
  s.settings.program = 'RIVER-24';
  s.settings.share = true;
  // Placed through step 13 and now learning "sh": a few early sh words have gone well.
  const L = createLearner(13);
  const lx = getLexicon();
  if (lx) for (const w of ['ship', 'shop']) observe(L, lx.analyze(w), 'fluent');
  s.learner = L;
  const day = 86400000, now = Date.now();
  const readable = [180, 205, 233, 260, 291, 318, 344, 372, 388, 403, 418];
  s.history = readable.map((r, i) => ({ at: now - (readable.length - i) * 2 * day, id: 'x', mode: i % 2 ? 'story' : 'practice', words: 60, q: { fluent: 48, effortful: 7, helped: 4, skipped: 1 }, readable: r }));
  s.stats = { nights: 12, wordsAloud: 742, practiceMs: 12 * 6 * 60000 };
  for (const id of ['tap-tap-tap', 'pip-the-cat', 'dig-bob-dig', 'hen-and-the-hat', 'gus-the-mud-pup']) s.stories[id] = { practiced: 2, readTogether: 2, lastAt: now - day * 3, recorded: id === 'gus-the-mud-pup' };
  // a few words Rosa found tricky last time, due for a warm-up today
  // stickers Mateo picked on earlier nights, and the milestones already celebrated
  s.stickers = ['fox', 'moon', 'cat', 'hen', 'dog', 'pup', 'fish', 'owl'].map((id, k) => ({ id, story: 'x', at: now - (16 - k * 2) * day }));
  s.milestones = [1, 3, 7];
  s.wordbank = Object.fromEntries(['shop', 'dish', 'rush'].map((w, k) => [w, { word: w, box: 0, due: now - 3600e3 * (k + 1), misses: 1, added: now - 864e5 }]));
  return s;
}

// Validates every library story: each word must be readable at the story's step.
// Usage: node tools/validate-stories.mjs [--verbose]
import { loadLexiconNode } from '../engine/lexicon.js';
import { validateStory, textStep } from '../engine/decodable.js';
import { personalize } from '../engine/text.js';
import { STORIES } from '../data/stories.js';

const lx = await loadLexiconNode(new URL('../data/lexicon.json', import.meta.url).pathname);
const family = { childName: 'Maya', grownup: 'Mama' };
const known = ['maya', 'mama'];
let failures = 0;
for (const s of STORIES) {
  const pages = s.pages.map(p => ({ text: personalize(p.text, family) }));
  const title = personalize(s.title, family);
  const v = validateStory({ pages: [{ text: title }, ...pages] }, lx, { step: s.step, known });
  const minStep = Math.max(...pages.map(p => textStep(p.text, lx, known).step), textStep(title, lx, known).step);
  const status = v.ok ? 'ok ' : 'FAIL';
  if (!v.ok) failures++;
  console.log(`${status} ${s.id.padEnd(20)} step ${String(s.step).padStart(2)} (needs ${minStep})  words ${String(v.words).padStart(3)}  focus: ${v.focusWords.slice(0, 6).join(', ')}`);
  for (const p of v.problems) console.log(`      ✗ "${p.word}" needs step ${p.needs} [${(p.patterns || []).join(',')}]`);
}
process.exitCode = failures ? 1 : 0;

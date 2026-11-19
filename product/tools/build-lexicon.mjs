// Builds product/data/lexicon.json from two open datasets:
//   • CMU Pronouncing Dictionary (pronunciations)  — via npm "cmu-pronouncing-dictionary"
//   • SUBTLEX-US word frequencies (which words matter) — via npm "subtlex-word-frequencies"
//
// Usage:  node tools/build-lexicon.mjs <path-to-node_modules> [topN]
// The output keeps insertion order = frequency rank, which the app uses to
// report "you can sound out N of the 5,000 most common words".

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const nm = process.argv[2];
const TOP = Number(process.argv[3] || 20000);
if (!nm) { console.error('usage: node tools/build-lexicon.mjs <node_modules> [topN]'); process.exit(1); }

const { dictionary } = await import(pathToFileURL(path.join(nm, 'cmu-pronouncing-dictionary/index.js')).href);
const freq = JSON.parse(fs.readFileSync(path.join(nm, 'subtlex-word-frequencies/index.json'), 'utf8'));

// Words the stories and UI need even if rare in film subtitles.
const extra = fs.readFileSync(new URL('./extra-words.txt', import.meta.url), 'utf8').split(/\s+/).filter(Boolean);

const out = {};
const add = w => {
  const k = w.toLowerCase();
  if (out[k] || !/^[a-z']+$/.test(k)) return;
  const prons = [];
  for (const key of [k, `${k}(2)`, `${k}(3)`]) if (dictionary[key]) prons.push(dictionary[key]);
  if (!prons.length) return;
  out[k] = prons.length === 1 ? prons[0] : prons;
};

let n = 0;
for (const { word } of freq) {
  if (!/^[a-zA-Z]+$/.test(word)) continue;
  if (word.length === 1 && !/^[aI]$/.test(word)) continue;
  add(word);
  if (++n >= TOP) break;
}
for (const w of extra) add(w);

const dest = new URL('../data/lexicon.json', import.meta.url);
fs.writeFileSync(dest, JSON.stringify(out));
console.log(`lexicon: ${Object.keys(out).length} words → ${dest.pathname} (${(fs.statSync(dest).size / 1024).toFixed(0)} KB)`);

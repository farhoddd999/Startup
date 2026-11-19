// Renders the pitch deck locally from the same slide files the Slides artifact uses:
//   node pitch/build-deck.mjs  → pitch/Hearth-pitch-deck.html, pitch/Hearth-pitch-deck.pdf,
//                                pitch/speaker-notes.md, and an overflow check per slide.
// Uploaded image URLs (/_blob/<id>) are mapped back to the local files in pitch/assets.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const deckDir = path.join(HERE, 'deck/project');
const deck = JSON.parse(fs.readFileSync(path.join(deckDir, 'deck.json'), 'utf8'));
const css = fs.readFileSync(path.join(deckDir, 'deck.css'), 'utf8');
const blobs = JSON.parse(fs.readFileSync(path.join(HERE, 'assets/blobs.json'), 'utf8'));

const slides = deck.order.map(id => {
  let html = fs.readFileSync(path.join(deckDir, 'slides', `${id}.html`), 'utf8');
  for (const [blob, file] of Object.entries(blobs)) html = html.split(`/_blob/${blob}`).join(`assets/${file}`);
  const notes = (html.match(/<aside>([\s\S]*?)<\/aside>/) || [])[1] || '';
  return { id, html, notes: notes.trim() };
});

const fonts = Object.values(deck.faces).map(f => `<link rel="stylesheet" href="${f.href}">`).join('\n');
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${deck.title}</title>
${fonts}
<style>
${css}
html, body { margin: 0; background: #0E1424; }
section { width: 1920px; height: 1080px; position: relative; overflow: hidden; margin: 0 auto 24px; page-break-after: always; break-after: page; }
aside { display: none; }
x-shape { display: block; }
x-shape[kind="arrow-right"] { clip-path: polygon(0 30%, 60% 30%, 60% 0, 100% 50%, 60% 100%, 60% 70%, 0 70%); }
p, h1, h2, h3 { margin: 0; }
th { text-align: left; font-weight: 700; padding: .35em .6em; border-bottom: 2px solid currentColor; }
td { padding: .35em .6em; border-bottom: 1px solid rgba(127,127,127,.35); vertical-align: top; }
table { border-collapse: collapse; }
@media print { html, body { background: none; } section { margin: 0; } @page { size: 1920px 1080px; margin: 0; } }
</style></head><body>
${slides.map(s => s.html.replace(/<aside>[\s\S]*?<\/aside>/, '')).join('\n')}
</body></html>`;
fs.writeFileSync(path.join(HERE, 'Hearth-pitch-deck.html'), page);

const notesMd = `# Hearth pitch: speaker script\n\nRead aloud in about 10 minutes. Bracketed items are for the founder to fill in.\n\n` +
  slides.map((s, i) => `## ${i + 1}. ${s.id}\n\n${s.notes.replace(/&amp;/g, '&')}\n`).join('\n');
fs.writeFileSync(path.join(HERE, 'speaker-notes.md'), notesMd);

const { chromium } = require('playwright');
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await pg.goto('file://' + path.join(HERE, 'Hearth-pitch-deck.html'));
await pg.waitForTimeout(1500);
const report = await pg.evaluate(() => [...document.querySelectorAll('section')].map(sec => {
  const r = sec.getBoundingClientRect();
  const padB = parseFloat(getComputedStyle(sec).paddingBottom);
  let maxBottom = 0;
  for (const el of sec.querySelectorAll('*')) {
    if (el.closest('aside') || getComputedStyle(el).position === 'absolute') continue;
    const b = el.getBoundingClientRect();
    if (b.height === 0) continue;
    maxBottom = Math.max(maxBottom, b.bottom - r.top);
  }
  return { id: sec.id, contentBottom: Math.round(maxBottom), limit: Math.round(1080 - padB) };
}));
for (const r of report) console.log(`${r.contentBottom > r.limit ? 'OVERFLOW' : 'ok      '} ${r.id.padEnd(10)} content ends at ${r.contentBottom}px (limit ${r.limit})`);
await pg.pdf({ path: path.join(HERE, 'Hearth-pitch-deck.pdf'), width: '1920px', height: '1080px', printBackground: true, pageRanges: '' });
for (const [i, s] of slides.entries()) {
  if (process.argv.includes('--png')) await (await pg.$(`section#${s.id}`)).screenshot({ path: path.join(HERE, `png/${String(i + 1).padStart(2, '0')}-${s.id}.png`) });
}
await browser.close();
console.log('wrote Hearth-pitch-deck.html, Hearth-pitch-deck.pdf, speaker-notes.md');

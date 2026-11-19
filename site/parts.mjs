// Reusable page sections, rendered at build time from the product's real data.
import { renderScene } from '../product/js/art.js';
import { STORIES } from '../product/data/stories.js';

export const LOOK = { childSkin: 2, childHair: 'curls', childHairColor: 0, grownupSkin: 2, grownupHair: 'long', grownupHairColor: 0 };
export const scene = (sc, title = '') => renderScene(sc, LOOK, { title, className: 'art' });
export const story = id => STORIES.find(s => s.id === id);

// Real engine output: words a parent can read (of the 5,000 most common) at each step 0–40.
export const READABLE = [0, 10, 20, 39, 51, 77, 96, 124, 148, 197, 226, 262, 279, 403, 423, 448, 462, 489, 801, 898, 960, 1033, 1074, 1205, 1269, 1316, 1358, 1403, 1448, 1494, 1567, 1607, 1622, 1668, 1995, 3171, 3402, 3741, 3791, 4410, 4534];

export function growthChart() {
  const W = 720, H = 300, L = 54, R = 24, T = 18, B = 40, max = 5000;
  const x = s => L + (s / 40) * (W - L - R), y = v => T + (1 - v / max) * (H - T - B);
  const pts = READABLE.map((v, s) => `${x(s).toFixed(1)},${y(v).toFixed(1)}`);
  let grid = '';
  for (const v of [0, 1000, 2000, 3000, 4000, 5000]) grid += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="g"/><text x="${L - 10}" y="${y(v) + 4}" text-anchor="end">${v === 0 ? '0' : `${v / 1000}K`}</text>`;
  for (const s of [1, 10, 20, 30, 40]) grid += `<text x="${x(s)}" y="${H - B + 22}" text-anchor="middle">step ${s}</text>`;
  const marks = [[1, 'I am Mateo.', 8, -14, 'start'], [14, '“sh” as in ship', 8, 26, 'start'], [18, 'blends: frog, jump', -10, -16, 'end'], [34, 'endings: -ed, -ing', -12, -12, 'end'], [40, '4,534 words', -12, -10, 'end']];
  let notes = '';
  for (const [s, label, dx, dy, anchor] of marks) {
    const cx = x(s), cy = y(READABLE[s]);
    notes += `<circle cx="${cx}" cy="${cy}" r="5" class="dot"/><text x="${cx + dx}" y="${cy + dy}" text-anchor="${anchor}" class="note-t">${label}</text>`;
  }
  return `<div class="chart-card"><svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="gt"><title id="gt">Words a parent can read at each of Hearth's 40 steps, out of the 5,000 most common English words. Step 1: 10. Step 18: 801. Step 34: 1,995. Step 40: 4,534.</title>${grid}<polygon points="${L},${y(0)} ${pts.join(' ')} ${x(40)},${y(0)}" class="area"/><polyline points="${pts.join(' ')}" class="line"/>${notes}</svg><p class="chart-cap">Words a parent can sound out or knows by heart at each step, from the Hearth engine run on the 5,000 most frequent words in American English (SUBTLEX-US).</p></div>`;
}

export const hintLadder = (eyebrow = 'Try it') => `
<section class="band night" aria-labelledby="ladderTitle">
  <div class="wrap split">
    <div>
      <span class="eyebrow">${eyebrow}</span>
      <h2 id="ladderTitle" class="mt-s">Help that waits for you.</h2>
      <p class="lead mt">When a parent pauses on a word, Hearth gives the smallest hint that might work, so they do as much of the reading as they can.</p>
      <ol class="steps-list mt">
        <li><span><b>Chunks.</b> The word splits into its sounds and the tricky part lights up.</span></li>
        <li><span><b>Sounds.</b> Each chunk shows a picture and a key word to tap and hear.</span></li>
        <li><span><b>The word.</b> Only then does Hearth say it, so the parent can say it back.</span></li>
      </ol>
    </div>
    <div class="ladder-demo" data-ladder aria-live="polite">
      <div class="lw"><span class="bubble"><span><b>w</b>🕸️</span><span><b>i</b>🦟</span><span class="hot"><b>sh</b>🚢</span></span><span class="ch">w</span><span class="ch">i</span><span class="ch hot">sh</span></div>
      <div class="said"></div>
      <div class="seg-ctl" role="group" aria-label="Hint level">
        <button data-l="0" aria-pressed="true">Reading</button><button data-l="1" aria-pressed="false">Pause 3s</button><button data-l="2" aria-pressed="false">Pause 6s</button><button data-l="3" aria-pressed="false">Pause 10s</button>
      </div>
    </div>
  </div>
</section>`;

export const phonesHero = () => `
<div class="phones" aria-label="The Hearth app">
  <div class="phone back"><img src="/assets/img/app-storytime.png" alt="Story time in Hearth: a dimmed bedtime screen with the page text, read words underlined, and a question to ask the child." width="780" height="1688"></div>
  <div class="phone front"><img src="/assets/img/app-hint.png" alt="Practice in Hearth: the parent paused on the word fish, and a bubble shows its sounds f, i, sh with pictures." width="780" height="1688"></div>
</div>`;

export const phone = (src, alt) => `<div class="phone-solo"><div class="phone"><img src="/assets/img/${src}" alt="${alt}" width="780" height="1688" loading="lazy"></div></div>`;

const DEFAULT_BUTTONS = [['/app/', 'Try the app', 'lamp'], ['/pilot/', 'Start a pilot', 'line']];
export const ctaBand = (title = 'Every child deserves a bedtime story. Every parent deserves to be the one who reads it.', lead = 'Try the app with a demo family, or talk to us about a pilot with the families you serve.', buttons = DEFAULT_BUTTONS) => `
<section class="band night" style="position:relative;overflow:hidden">
  <div class="wrap center stack" style="align-items:center;position:relative">
    <h2 style="max-width:22ch">${title}</h2>
    <p class="lead">${lead}</p>
    <div class="cta-row" style="justify-content:center;margin-top:10px">${buttons.map(([href, label, kind]) => `<a class="btn ${kind}" href="${href}">${label}</a>`).join('')}</div>
  </div>
</section>`;

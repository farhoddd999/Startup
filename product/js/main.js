// Hearth — app entry: boot, routing, desktop demo rail.

import { Lexicon } from '../engine/lexicon.js';
import { setLang, t } from './i18n.js';
import { getState, update, reset, subscribe } from './store.js';
import { setLexicon } from './stories.js';
import { enableHoldToHear, h } from './ui.js';
import { stopSpeaking } from './voice.js';
import * as onboarding from './screens/onboarding.js';
import * as home from './screens/home.js';
import * as reader from './screens/reader.js';
import * as sky from './screens/sky.js';
import * as library from './screens/library.js';
import * as settings from './screens/settings.js';
import { demoFamily } from './demo.js';
import { go, current, onRoute, isFramed } from './router.js';

const app = document.getElementById('app');
let cleanup = null;

const routes = [
  [/^#\/welcome$/, () => onboarding.welcome],
  [/^#\/onboard\/(\w+)$/, m => onboarding.step(m[1])],
  [/^#\/place$/, () => onboarding.placement],
  [/^#\/home$/, () => home.render],
  [/^#\/read\/([\w-]+)\/(practice|story|listen)$/, m => p => reader.render(p, { id: m[1], mode: m[2] })],
  [/^#\/done\/([\w-]+)\/(practice|story)$/, m => p => reader.finish(p, { id: m[1], mode: m[2] })],
  [/^#\/sky$/, () => sky.render],
  [/^#\/library$/, () => library.render],
  [/^#\/settings$/, () => settings.render],
];

function route() {
  const st = getState();
  const hash = current() || '';
  let target = hash;
  if (!st.onboarded && !/^#\/(welcome|onboard|place)/.test(hash)) target = '#/welcome';
  if (st.onboarded && (!hash || hash === '#/' || hash === '#/welcome')) target = '#/home';
  if (target !== hash) { go(target, { replace: true }); return; }
  stopSpeaking();
  if (typeof cleanup === 'function') { try { cleanup(); } catch { /* ignore */ } }
  cleanup = null;
  app.classList.remove('bedtime');
  app.innerHTML = '';
  for (const [re, make] of routes) {
    const m = hash.match(re);
    if (m) { cleanup = make(m)(app) || null; app.scrollTop = 0; window.scrollTo(0, 0); return; }
  }
  go(st.onboarded ? '#/home' : '#/welcome', { replace: true });
}

export { go };

// ---- desktop rail: explains the prototype to visitors and offers demo shortcuts ----
function renderRail() {
  const rail = document.getElementById('rail');
  if (!rail) return;
  const st = getState();
  rail.innerHTML = '';
  rail.append(
    h('div.brand', h('img', { src: './assets/hearth-mark.svg', alt: '' }), h('b', 'hearth')),
    h('p', 'A private reading coach for parents who struggle to read. They practise tonight\'s bedtime story alone with a coach that listens, then read it aloud to their child.'),
    h('div.card',
      h('h3', 'Try it'),
      h('ol',
        h('li', 'Tap ', h('b', 'Practise first'), '. Read aloud. Hearth follows each word.'),
        h('li', 'Pause on a word to see the hints: chunks, then sounds, then the whole word.'),
        h('li', 'Then try ', h('b', 'Read with your child'), ': bedtime mode, quiet hints, conversation prompts.'),
        h('li', 'Open ', h('b', 'Your sky'), ' to see what the learner model has learned.'),
      ),
    ),
    h('div.card',
      h('h3', 'How Hearth follows you'),
      h('div.row',
        ...[['voice', 'My voice'], ['demo', 'Demo reader'], ['tap', 'Tap']].map(([id, label]) =>
          h(`button.chip${st.settings.mic === id ? '.on' : ''}`, { onclick: () => { update(s => { s.settings.mic = id; }); renderRail(); route(); } }, label)),
      ),
      h('p', { style: { marginTop: '10px', fontSize: '14px' } }, 'No microphone, or presenting to a room? The demo reader simulates a parent reading, including hesitations, so you can watch every hint fire.'),
    ),
    h('div.card',
      h('h3', 'Shortcuts'),
      h('div.row',
        h('button.chip', { onclick: () => { reset(); Object.assign(getState(), demoFamily()); update(() => {}); go('#/home'); renderRail(); } }, 'Load demo family'),
        h('button.chip', { onclick: () => { reset(); go('#/welcome'); renderRail(); } }, 'Start onboarding'),
      ),
      h('p', { style: { marginTop: '10px', fontSize: '14px' } }, h('a', { href: 'studio/index.html' }, 'Story Studio'), ' · ', h('a', { href: 'dashboard/index.html' }, 'Partner dashboard'), isFramed ? null : ' · ', isFramed ? null : h('a', { href: '../website/index.html' }, 'Website')),
    ),
  );
}

async function boot() {
  const st = getState();
  setLang(st.family.lang || 'en');
  enableHoldToHear(document);
  const res = await fetch('./data/lexicon.json');
  setLexicon(new Lexicon(await res.json()));
  if ((new URLSearchParams(location.search).has('demo') || location.hash === '#demo') && !st.onboarded) {
    Object.assign(st, demoFamily()); update(() => {});
  }
  onRoute(route);
  subscribe(() => document.documentElement.setAttribute('lang', getState().family.lang || 'en'));
  renderRail();
  route();
  if (!isFramed && 'serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(() => {});
}

boot().catch(err => {
  app.innerHTML = '';
  app.append(h('div.screen', h('h2', 'Hearth could not start'), h('p.muted', String(err))));
  console.error(err);
});

export { t };

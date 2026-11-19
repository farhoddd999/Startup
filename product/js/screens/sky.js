// Your sky: private progress as a night sky. One star per step of the scope &
// sequence; they light up as the learner model becomes confident. No levels,
// no percentiles — just a sky that keeps getting brighter.

import { h, icon, sayButton, fmt } from '../ui.js';
import { t } from '../i18n.js';
import { getState } from '../store.js';
import { speak } from '../voice.js';
import { STEPS, PATTERN_INFO } from '../../engine/phonics.js';
import { workingStep, BKT } from '../../engine/learner.js';
import { getLexicon } from '../stories.js';
import { tabbar } from './home.js';

/** Of the 5,000 most common English words, how many can this parent read now? */
export function readableCount(learner, top = 5000) {
  const lx = getLexicon();
  if (!lx) return 0;
  const ws = workingStep(learner);
  const ok = p => !!learner.mastered?.[p] || (learner.p[p] ?? 0) >= BKT.mastery * 0.8;
  let n = 0;
  for (const w of lx.ranked.slice(0, top)) {
    const a = lx.analyze(w);
    if (a.heartStep !== null && a.heartStep <= ws) { n++; continue; }
    if (a.partsStep !== undefined && a.partsStep < ws) { n++; continue; }
    if (a.decodeStep !== Infinity && a.patterns.every(ok)) n++;
  }
  return n;
}

function starPositions() {
  const pts = [];
  const rows = 5, perRow = 8;
  for (let i = 0; i < STEPS.length; i++) {
    const r = Math.floor(i / perRow), c = i % perRow;
    const cc = r % 2 === 0 ? c : perRow - 1 - c;
    const x = 34 + cc * 41 + Math.sin(i * 1.7) * 7;
    const y = 590 - r * 112 - Math.sin(cc * 0.9 + r) * 22 + Math.cos(i * 2.3) * 6;
    pts.push([x, y]);
  }
  return pts;
}

export function render(root) {
  const st = getState();
  const L = st.learner;
  const ws = workingStep(L);
  const readable = readableCount(L);
  const pts = starPositions();
  const stepState = s => {
    if (s.n < ws || s.patterns.every(p => L.mastered?.[p] || (L.p[p] ?? 0) >= BKT.mastery)) return 'lit';
    if (s.n === ws) return 'glow';
    return 'dim';
  };
  let lines = '';
  for (let i = 1; i < pts.length; i++) {
    const a = stepState(STEPS[i - 1]), b = stepState(STEPS[i]);
    const on = a === 'lit' && b !== 'dim';
    lines += `<line x1="${pts[i - 1][0]}" y1="${pts[i - 1][1]}" x2="${pts[i][0]}" y2="${pts[i][1]}" stroke="${on ? '#F2C14E' : '#3A4675'}" stroke-width="${on ? 1.6 : 1}" opacity="${on ? 0.55 : 0.5}" ${on ? '' : 'stroke-dasharray="2 5"'}/>`;
  }
  const starsSvg = STEPS.map((s, i) => {
    const [x, y] = pts[i];
    const state = stepState(s);
    const r = 3.5 + Math.min(s.patterns.length, 5) * 0.9;
    const fill = state === 'lit' ? '#F7E19A' : state === 'glow' ? '#FFB36B' : '#56628C';
    const glow = state === 'lit' ? `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="#F7E19A" opacity=".12"/>` : state === 'glow' ? `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="#FFB36B" opacity=".25"><animate attributeName="r" values="${r * 1.8};${r * 3};${r * 1.8}" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".35;.08;.35" dur="2.4s" repeatCount="indefinite"/></circle>` : '';
    const d = `M${x} ${y - r * 1.9} L${x + r * 0.5} ${y - r * 0.5} L${x + r * 1.9} ${y} L${x + r * 0.5} ${y + r * 0.5} L${x} ${y + r * 1.9} L${x - r * 0.5} ${y + r * 0.5} L${x - r * 1.9} ${y} L${x - r * 0.5} ${y - r * 0.5}Z`;
    return `<g class="star-btn" data-step="${s.n}" role="button" aria-label="${s.title}">${glow}<circle cx="${x}" cy="${y}" r="16" fill="transparent"/><path d="${d}" fill="${fill}"/></g>`;
  }).join('');
  const bg = Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 89) % 360}" cy="${(i * 53) % 640}" r="${(i % 3) * 0.4 + 0.5}" fill="#fff" opacity="${0.15 + (i % 5) * 0.06}"/>`).join('');
  const svg = `<svg viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg">${bg}${lines}${starsSvg}</svg>`;

  const skyEl = h('div.sky-wrap', { html: svg },
    h('div.cap', h('div.n', fmt(readable)), h('div.l', `${t('words_you_can_read')} — ${t('of_common')}`)));
  skyEl.addEventListener('click', e => { const g = e.target.closest('.star-btn'); if (g) openStep(+g.dataset.step, stepState(STEPS[+g.dataset.step - 1])); });

  // growth sparkline from history
  const hist = st.history.filter(x => typeof x.readable === 'number').slice(-30);
  let spark = null;
  if (hist.length >= 2) {
    const vals = hist.map(x => x.readable);
    const min = Math.min(...vals), max = Math.max(...vals, min + 1);
    const pts2 = vals.map((v, i) => [10 + (i / (vals.length - 1)) * 300, 60 - ((v - min) / (max - min)) * 46]);
    const path = pts2.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const last = pts2[pts2.length - 1];
    spark = h('div.mini', { style: { gridColumn: 'span 2' } },
      h('div.small', 'Words you can read, over time'),
      h('div', { html: `<svg class="spark" viewBox="0 0 320 70" preserveAspectRatio="none"><path d="${path} L310 66 L10 66Z" fill="#FCE6D3"/><path d="${path}" fill="none" stroke="#E8833A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0]}" cy="${last[1]}" r="4.5" fill="#E8833A"/></svg>` }),
      h('div.small', `${fmt(vals[0])} → ${fmt(vals[vals.length - 1])}`));
  }
  const fam = st.family;
  root.append(h('div.screen.with-tabs',
    h('div.q-head', h('h2', t('sky_title')), sayButton(t('sky_say'))),
    h('p.muted', { style: { marginBottom: '14px' } }, t('sky_body')),
    skyEl,
    h('div.mini-grid',
      h('div.mini', h('div.big', fmt(st.stats.nights)), h('div.small', t('nights'))),
      h('div.mini', h('div.big', fmt(st.stats.wordsAloud)), h('div.small', t('words_heard', { child: fam.childName }))),
      spark,
    ),
    tabbar('sky'),
  ));
}

function openStep(n, state) {
  const s = STEPS[n - 1];
  const close = () => back.remove();
  const status = state === 'lit' ? 'You can read these sounds.' : state === 'glow' ? 'You are learning these now.' : 'Coming up.';
  const back = h('div.sheet-backdrop', { onclick: e => { if (e.target === back) close(); } },
    h('div.sheet',
      h('div.grab'),
      h('div.row', h('h3', { style: { flex: 1 } }, s.title), h('button.icon-btn', { 'aria-label': t('close'), onclick: close }, icon('close'))),
      h('p.muted', status),
      h('div.sound-chips', s.patterns.map(p => {
        const info = PATTERN_INFO[p] || {};
        return h('button.sound-chip', { onclick: () => info.key && speak(info.key, { lang: 'en', rate: 0.8 }) }, h('span.e', info.pic || ''), h('span.g', info.label || p), info.key ? h('span.k', `as in ${info.key}`) : null);
      })),
      h('div.label', 'Words'),
      h('div.example-words', s.words.map(w => h('button', { onclick: () => speak(w, { lang: 'en', rate: 0.75 }) }, w))),
    ));
  document.body.append(back);
}

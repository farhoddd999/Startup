// Onboarding: voice-first, no reading required to get through it.
// welcome → promise → child → call → look → loves → mic → placement → home

import { h, icon, sayButton, toast } from '../ui.js';
import { t, setLang, LANGS, getLang } from '../i18n.js';
import { getState, update } from '../store.js';
import { speak, createRecognizer, recognitionAvailable, requestMic, createSimulatedReader } from '../voice.js';
import { renderScene, SKIN, HAIR, HAIR_STYLES } from '../art.js';
import { createPlacement, createLearner, PLACEMENT_LADDER } from '../../engine/learner.js';
import { spokenTokens, similarity } from '../../engine/tracker.js';
import { pickTonight } from '../stories.js';
import { demoFamily } from '../demo.js';
import { replaceState } from '../store.js';
import { go, back } from '../router.js';

const STEPS = ['promise', 'child', 'call', 'look', 'loves', 'mic'];
const narrate = text => { if (getState().settings.narrate) speak(text); };

function dots(i) { return h('div.dots', STEPS.map((_, k) => h(`i${k === i ? '.on' : ''}`))); }
function nextOf(name) { const i = STEPS.indexOf(name); return i < STEPS.length - 1 ? `#/onboard/${STEPS[i + 1]}` : '#/place'; }

export function welcome(root) {
  const st = getState();
  const look = st.family.look;
  const art = renderScene({ bg: 'night', items: [['moon', 82, 26, 0.9], ['stars', 26, 24, 1], ['bed', 50, 90, 1.25], ['grownup', 36, 84, 0.95, { pose: 'hug' }], ['child', 58, 84, 0.85, { pose: 'hug' }], ['heart', 47, 30, 0.6]] }, look);
  const scr = h('div.screen.welcome',
    h('div.logo', h('img', { src: './assets/hearth-mark.svg', alt: '' }), h('b', 'hearth')),
    h('div.hero-art', { html: art }),
    h('h1', t('tagline')),
    h('div.lang-row', LANGS.map(l => h(`button${getLang() === l.id ? '.on' : ''}`, {
      type: 'button', say: l.label,
      onclick: () => { setLang(l.id); update(s => { s.family.lang = l.id; }); welcomeRefresh(root); },
    }, l.label))),
    h('div.spacer'),
    h('button.btn.primary', { say: t('start'), onclick: () => { speak(t('welcome_say')); go('#/onboard/promise'); } }, h('span.grow', t('start')), icon('next')),
    h('p.muted', { style: { textAlign: 'center', fontSize: '15px' } }, t('hold_to_hear')),
    h('button.demo-link', { type: 'button', onclick: () => { replaceState(demoFamily()); go('#/home'); } }, 'Presenting Hearth? Explore with a demo family'),
  );
  root.append(scr);
}
function welcomeRefresh(root) { root.innerHTML = ''; welcome(root); }

export function step(name) {
  return root => {
    const i = STEPS.indexOf(name);
    const fn = { promise, child, call, look, loves, mic }[name];
    if (!fn) return go('#/welcome');
    return fn(root, i);
  };
}

function frame(i, titleKey, sayKey, body, { onNext, nextLabel, vars = {} } = {}) {
  const scr = h('div.screen',
    h('div.topbar', h('button.icon-btn', { 'aria-label': t('back'), say: t('back'), onclick: () => back() }, icon('back')), dots(i), h('span', { style: { width: '48px' } })),
    h('div.q-head', h('h2', t(titleKey, vars)), sayButton(t(sayKey, vars))),
    body,
    h('div.spacer', { style: { minHeight: '18px' } }),
    onNext !== false && h('button.btn.primary', { say: nextLabel || t('next'), onclick: onNext }, h('span.grow', nextLabel || t('next')), icon('next')),
  );
  return scr;
}

function promise(root, i) {
  narrate(t('privacy_say'));
  const line = (ic, text) => h('div.line', icon(ic), h('span', text));
  root.append(frame(i, 'privacy_title', 'privacy_say', h('div.promise',
    line('moon', t('privacy_body')),
    line('hand', t('hold_to_hear')),
  ), { onNext: () => go(nextOf('promise')), nextLabel: t('okay') }));
}

function child(root, i) {
  narrate(t('child_say'));
  const st = getState();
  const input = h('input', { type: 'text', value: st.family.childName, placeholder: t('child_name'), autocomplete: 'off', 'aria-label': t('child_name'), maxlength: 24 });
  const micBtn = h('button.icon-btn', { type: 'button', 'aria-label': t('say_it'), say: t('say_it') }, icon('mic'));
  micBtn.onclick = () => {
    if (!recognitionAvailable()) return toast(t('no_mic'));
    micBtn.classList.add('saying');
    const rec = createRecognizer({
      lang: getLang() === 'es' ? 'es-US' : 'en-US',
      onText: (fin, interim) => { const v = (fin || interim).trim().split(/\s+/).slice(-2).join(' '); if (v) input.value = v.replace(/^\w/, c => c.toUpperCase()); if (fin) { rec.stop(); micBtn.classList.remove('saying'); } },
      onError: () => micBtn.classList.remove('saying'),
    });
    rec?.start();
    setTimeout(() => { rec?.stop(); micBtn.classList.remove('saying'); }, 6000);
  };
  const ages = ['0-1', '2-3', '4-5', '6-8'];
  const ageRow = h('div.chips', ages.map(a => h(`button.chip-btn${st.family.childAge === a ? '.on' : ''}`, {
    type: 'button', say: a.replace('-', ' to '),
    onclick: e => { update(s => { s.family.childAge = a; }); [...ageRow.children].forEach(c => c.classList.toggle('on', c === e.currentTarget)); },
  }, a)));
  root.append(frame(i, 'child_q', 'child_say', h('div.stack',
    h('div.field', input, micBtn),
    h('div.label', t('child_age')), ageRow,
  ), {
    onNext: () => {
      const name = input.value.trim().replace(/[^\p{L}\p{M}' -]/gu, '').slice(0, 24);
      if (!name) { input.focus(); return speak(t('child_say')); }
      update(s => { s.family.childName = name.charAt(0).toUpperCase() + name.slice(1); });
      go(nextOf('child'));
    },
  }));
  setTimeout(() => input.focus(), 300);
}

function call(root, i) {
  const st = getState();
  const vars = { child: st.family.childName };
  narrate(t('call_say'));
  const opts = ['Mama', 'Mom', 'Mommy', 'Papa', 'Dad', 'Daddy', 'Grandma', 'Grandpa', 'Abuela', 'Abuelo', 'Nana', 'Auntie'];
  const custom = h('input', { type: 'text', placeholder: '…', value: opts.includes(st.family.grownup) ? '' : st.family.grownup, maxlength: 16, 'aria-label': 'Other' });
  const chips = h('div.chips', opts.map(o => h(`button.chip-btn${st.family.grownup === o ? '.on' : ''}`, {
    type: 'button', say: o,
    onclick: e => { update(s => { s.family.grownup = o; }); custom.value = ''; [...chips.children].forEach(c => c.classList.toggle('on', c === e.currentTarget)); speak(o, { lang: 'en' }); },
  }, o)));
  custom.oninput = () => { const v = custom.value.trim(); if (v) { update(s => { s.family.grownup = v.charAt(0).toUpperCase() + v.slice(1); }); [...chips.children].forEach(c => c.classList.remove('on')); } };
  root.append(frame(i, 'call_q', 'call_say', h('div.stack', chips, h('div.field', custom)), { vars, onNext: () => go(nextOf('call')) }));
}

function look(root, i) {
  narrate(t('look_say'));
  let who = 'child';
  const preview = h('div.hero-art');
  const controls = h('div');
  const draw = () => {
    const L = getState().family.look;
    preview.innerHTML = renderScene({ bg: 'room', items: [['grownup', 38, 88, 1.05], ['child', 62, 88, 0.95]] }, L);
    controls.innerHTML = '';
    const pre = who === 'child' ? 'child' : 'grownup';
    const sw = (arr, key) => h('div.swatches', arr.map((c, k) => h(`button.swatch${L[key] === k ? '.on' : ''}`, { type: 'button', style: { background: c }, 'aria-label': `${key} ${k + 1}`, onclick: () => { update(s => { s.family.look[key] = k; }); draw(); } })));
    controls.append(
      h('div.label', t('skin')), sw(SKIN, `${pre}Skin`),
      h('div.label', t('hair')),
      h('div.seg', HAIR_STYLES.map(hs => h(`button${L[`${pre}Hair`] === hs ? '.on' : ''}`, { type: 'button', onclick: () => { update(s => { s.family.look[`${pre}Hair`] = hs; }); draw(); } }, hs))),
      h('div.label', t('hair_colour')), sw(HAIR, `${pre}HairColor`),
    );
  };
  const tabs = h('div.tabs2', [['child', getState().family.childName || t('child_word')], ['grownup', t('grownup_word')]].map(([id, label]) => h(`button${who === id ? '.on' : ''}`, { type: 'button', onclick: e => { who = id; [...tabs.children].forEach(c => c.classList.toggle('on', c === e.currentTarget)); draw(); } }, label)));
  draw();
  root.append(frame(i, 'look_q', 'look_say', h('div.stack', preview, tabs, controls), { onNext: () => go(nextOf('look')) }));
}

function loves(root, i) {
  const st = getState();
  const vars = { child: st.family.childName };
  narrate(t('love_say'));
  const opts = [['animals', '🦊'], ['space', '🚀'], ['sea', '🐳'], ['trucks', '🚚'], ['food', '🍰'], ['music', '🎵'], ['snow', '⛄'], ['bedtime', '🌙']];
  const grid = h('div.pic-grid', opts.map(([id, emo]) => h(`button.pic-btn${st.family.interests.includes(id) ? '.on' : ''}`, {
    type: 'button', say: id,
    onclick: e => {
      update(s => { const k = s.family.interests.indexOf(id); if (k >= 0) s.family.interests.splice(k, 1); else s.family.interests.push(id); });
      e.currentTarget.classList.toggle('on'); speak(id, { lang: 'en' });
    },
  }, h('span.emo', emo), id)));
  root.append(frame(i, 'love_q', 'love_say', grid, { vars, onNext: () => go(nextOf('loves')) }));
}

function mic(root, i) {
  narrate(`${t('mic_say')} ${recognitionAvailable() ? t('mic_privacy') : ''}`);
  const choose = async mode => {
    if (mode === 'voice') {
      const ok = recognitionAvailable() && await requestMic();
      if (!ok) { toast(t('no_mic')); mode = 'tap'; }
    }
    update(s => { s.settings.mic = mode; });
    go('#/place');
  };
  const art = renderScene({ bg: 'room', items: [['grownup', 50, 88, 1.15, { pose: 'wave' }], ['notes', 70, 36, 1]] }, getState().family.look);
  root.append(frame(i, 'mic_q', 'mic_say', h('div.stack',
    h('div.hero-art', { html: art }),
    h('p', { style: { fontSize: '19px' } }, t('mic_body')),
    recognitionAvailable() ? h('p.note.mic-privacy', { say: t('mic_privacy') }, t('mic_privacy')) : null,
    h('button.btn.primary', { say: t('mic_allow'), onclick: () => choose('voice') }, icon('mic'), h('span.grow', t('mic_allow'))),
    h('button.btn.ghost', { say: t('mic_tap'), onclick: () => choose('tap') }, icon('hand'), h('span.grow', t('mic_tap'))),
    h('button.btn.ghost', { say: t('mic_demo'), onclick: () => choose('demo') }, icon('play'), h('span.grow', t('mic_demo'))),
  ), { onNext: false }));
}

// ---- placement --------------------------------------------------------------
export function placement(root) {
  const st = getState();
  const P = createPlacement();
  let rec = null, timer = null, answered = false;
  narrate(t('place_say'));
  const wordEl = h('div.probe-word');
  const status = h('div.listening');
  const bar = h('i', { style: { width: '0%' } });
  const skipBtn = h('button.btn.ghost', { say: t('skip'), onclick: () => answer(false) }, h('span.grow', t('skip')), icon('next'));
  const scr = h('div.screen',
    h('div.topbar', h('button.icon-btn', { 'aria-label': t('back'), onclick: () => back() }, icon('back')), h('div.progress-thin', { style: { flex: 1 } }, bar), h('span', { style: { width: '48px' } })),
    h('div.q-head', h('h2', t('place_title')), sayButton(t('place_say'))),
    h('p.muted', t('place_body')),
    h('div.probe', wordEl, status),
    skipBtn,
  );
  root.append(scr);

  const finish = () => {
    stopAll();
    update(s => { s.learner = createLearner(P.placedStep); s.onboarded = true; s.tonight = pickTonight(s).id; });
    status.innerHTML = ''; status.append(t('place_done'));
    wordEl.textContent = '✓'; wordEl.classList.add('ok');
    speak(t('place_done')).then(() => setTimeout(() => go('#/home'), 400));
    skipBtn.remove();
  };
  const stopAll = () => { clearTimeout(timer); rec?.stop(); rec = null; };

  function answer(correct) {
    if (answered) return;
    answered = true; stopAll();
    if (correct) { wordEl.classList.add('ok'); status.innerHTML = ''; status.append(icon('check'), t('place_got_it')); }
    P.answer(correct);
    bar.style.width = `${Math.round((P.index / P.total) * 100)}%`;
    setTimeout(() => (P.done ? finish() : show()), correct ? 700 : 150);
  }

  function show() {
    answered = false;
    const probe = P.current;
    wordEl.classList.remove('ok');
    wordEl.textContent = probe.word;
    status.innerHTML = '';
    const mode = getState().settings.mic;
    const listenFor = (fin, interim) => {
      const toks = spokenTokens(`${fin} ${interim}`);
      if (toks.some(tk => similarity(tk, probe.word) >= 0.75)) answer(true);
    };
    if (mode === 'voice' && recognitionAvailable()) {
      status.append(h('span.pulse'), t('place_listening'));
      rec = createRecognizer({ onText: listenFor, onError: () => { status.innerHTML = ''; } });
      rec?.start();
      timer = setTimeout(() => skipBtn.classList.add('primary'), 7000);
    } else if (mode === 'demo') {
      // The demo parent knows the early steps and starts to struggle around "sh".
      status.append(h('span.pulse'), t('place_listening'));
      const knows = probe.step <= 13;
      rec = createSimulatedReader({ words: [{ text: probe.word, norm: knows ? probe.word : probe.word.slice(0, 2) }], onText: listenFor, seed: probe.step });
      rec.start();
      if (!knows) timer = setTimeout(() => answer(false), 2600);
    } else {
      // tap mode: the parent tells us honestly
      status.append(
        h('button.chip-btn', { onclick: () => answer(true) }, icon('check'), ' ', t('yes')),
        h('button.chip-btn', { onclick: () => answer(false) }, t('skip')),
      );
    }
  }
  show();
  return stopAll;
}

export { PLACEMENT_LADDER };

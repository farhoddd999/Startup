// Quick warm-up: a few words that were tricky last time, one at a time.
// The parent tries each word out loud, can ask for the sounds or the word,
// and says honestly whether they read it. No score, just a kind summary.

import { h, icon, sayButton } from '../ui.js';
import { t } from '../i18n.js';
import { getState } from '../store.js';
import { speak, sayWord, stopSpeaking } from '../voice.js';
import { chunksFor } from '../../engine/decodable.js';
import { PATTERN_INFO } from '../../engine/phonics.js';
import { getLexicon } from '../stories.js';
import { dueWords, markWord } from '../wordbank.js';
import { go } from '../router.js';

export function render(root) {
  const st = getState();
  const words = dueWords();
  const narrate = text => { if (st.settings.narrate) speak(text); };
  const lx = getLexicon();
  let i = 0, eased = 0;

  const top = h('div.topbar', h('button.icon-btn', { type: 'button', 'aria-label': t('close'), onclick: () => go('#/home') }, icon('close')), h('span.mode-chip', h('span.dot'), t('warm_chip')), sayButton(t('warm_say')));
  const body = h('div.warm-body');
  const scr = h('div.screen.warmup', top, body);
  root.append(scr);

  if (!words.length) {
    body.append(h('h1', t('warm_none')), h('div.spacer'), h('button.btn.primary', { type: 'button', onclick: () => go('#/home') }, h('span.grow', t('warm_back')), icon('next')));
    return;
  }
  narrate(t('warm_say'));

  function show() {
    stopSpeaking();
    body.innerHTML = '';
    if (i >= words.length) return finish();
    const w = words[i];
    const chunks = lx ? chunksFor(w.word, lx) : [{ g: w.word, pat: '' }];
    const L = st.learner;
    let hot = -1, best = 2;
    chunks.forEach((c, k) => { const p = L.p?.[c.pat]; if (p !== undefined && p < best && !c.close) { best = p; hot = k; } });
    const wordEl = h('div.warm-word', { 'aria-label': w.word }, chunks.map((c, k) => h(`span.wc${k === hot ? '.hot' : ''}`, c.g)));
    const sounds = h('div.warm-sounds', { hidden: true }, chunks.map(c => {
      const info = PATTERN_INFO[c.pat] || {};
      return h('button.sound-chip', { type: 'button', onclick: () => info.key && speak(info.key, { lang: 'en', rate: 0.8 }) },
        h('span.e', info.pic || ''), h('span.g', c.g), info.key ? h('span.k', t('as_in', { word: info.key })) : null);
    }));
    const answer = readIt => {
      if (readIt) eased++;
      markWord(w.norm, readIt);
      i++;
      show();
    };
    body.append(
      h('div.dots', words.map((_, k) => h(`i${k === i ? '.on' : ''}`))),
      h('p.muted.warm-q', t('warm_q')),
      wordEl,
      sounds,
      h('div.warm-help',
        h('button.btn.ghost', { type: 'button', say: t('warm_sound'), onclick: () => { sounds.hidden = false; wordEl.classList.add('split'); } }, icon('sparkle'), h('span.grow', t('warm_sound'))),
        h('button.btn.ghost', { type: 'button', say: t('warm_hear'), onclick: () => sayWord(w.word, { twice: true }) }, icon('speaker'), h('span.grow', t('warm_hear')))),
      h('div.spacer'),
      h('div.warm-answer',
        h('button.btn.ghost', { type: 'button', say: t('warm_notyet'), onclick: () => answer(false) }, h('span.grow', t('warm_notyet'))),
        h('button.btn.primary', { type: 'button', say: t('warm_got'), onclick: () => answer(true) }, icon('check'), h('span.grow', t('warm_got')))),
    );
  }

  function finish() {
    const text = eased === words.length ? t('warm_done_all') : t('warm_done_body', { n: eased, total: words.length });
    narrate(`${t('warm_done_title')}. ${text}`);
    body.append(
      h('div.stars-burst', icon('star'), icon('star'), icon('star')),
      h('h1', { style: { textAlign: 'center' } }, t('warm_done_title')),
      h('p.summary', text),
      h('div.spacer'),
      h('button.btn.primary', { type: 'button', onclick: () => go('#/home') }, h('span.grow', t('warm_back')), icon('next')),
    );
  }

  show();
  return () => stopSpeaking();
}

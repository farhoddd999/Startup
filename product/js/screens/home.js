// Home: tonight's story, practise-first nudge, and a quiet sense of progress.

import { h, icon, sayButton, fmt, toast } from '../ui.js';
import { t, getLang } from '../i18n.js';
import { getState, update } from '../store.js';
import { speak } from '../voice.js';
import { renderScene } from '../art.js';
import { pickTonight, findStory, requestNewStory, prepare, getLexicon, storyEngineAvailable } from '../stories.js';
import { workingStep, stepProgress } from '../../engine/learner.js';
import { STEPS, PATTERN_INFO } from '../../engine/phonics.js';
import { personalize } from '../../engine/text.js';
import { readableCount } from './sky.js';
import { go, back } from '../router.js';
import { installCard } from '../install-sheet.js';

export function tabbar(active) {
  const tab = (id, ic, label, hash) => h(`button${active === id ? '.on' : ''}`, { say: label, onclick: () => { go(hash); } }, icon(ic), label);
  return h('nav.tabbar', tab('home', 'home', t('home'), '#/home'), tab('library', 'book', t('library'), '#/library'), tab('sky', 'star', t('sky'), '#/sky'), tab('settings', 'gear', t('settings'), '#/settings'));
}

function greeting() {
  const hr = new Date().getHours();
  if (hr < 12) return t('greet_morning');
  if (hr < 17) return t('greet_afternoon');
  return t('greet_evening');
}

export function render(root) {
  const st = getState();
  const fam = st.family;
  let story = (st.tonight && findStory(st.tonight)) || pickTonight();
  // move on once tonight's story has been read together
  if (st.stories[story.id]?.readTogether && pickTonight().id !== story.id) story = pickTonight();
  if (st.tonight !== story.id) update(s => { s.tonight = story.id; });

  const rec = st.stories[story.id] || {};
  const ws = workingStep(st.learner);
  const step = STEPS[ws - 1];
  const pat = step.patterns.find(p => PATTERN_INFO[p]?.key) || step.patterns[0];
  const info = PATTERN_INFO[pat] || {};
  const prog = stepProgress(st.learner);
  const readable = readableCount(st.learner);
  const vars = { child: fam.childName };
  const title = personalize(story.title, fam);

  const ringC = 2 * Math.PI * 24;
  const ring = `<svg class="ring" viewBox="0 0 58 58"><circle cx="29" cy="29" r="24" fill="none" stroke="#F3E6D3" stroke-width="7"/><circle cx="29" cy="29" r="24" fill="none" stroke="#E8833A" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(ringC * prog).toFixed(1)} ${ringC.toFixed(1)}" transform="rotate(-90 29 29)"/></svg>`;

  const writeNew = h('button.btn.ghost', {
    say: t('new_story'),
    onclick: async () => {
      writeNew.disabled = true;
      writeNew.querySelector('.grow').textContent = t('writing_story', vars);
      const s = await requestNewStory();
      if (s) {
        update(x => { x.generated.push(s); x.tonight = s.id; });
        render(clear(root));
      } else {
        toast(t('story_engine_offline'), 3600);
        writeNew.disabled = false;
        writeNew.querySelector('.grow').textContent = t('new_story');
      }
    },
  }, icon('pen'), h('span.grow', t('new_story')));

  const scr = h('div.screen.with-tabs',
    h('div.greet', h('div', h('div.date', new Date().toLocaleDateString(getLang() === 'es' ? 'es' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })), h('div.hello', `${greeting()}`)), sayButton(t('home_say'))),
    h('div.tonight',
      h('div.art', { html: renderScene(story.cover, fam.look) }, h('span.badge', icon('moon'), t('tonight_for', vars))),
      h('div.body',
        h('h2', title),
        h('div.ready',
          rec.practiced ? h('span.pill.sage', icon('check'), t('pill_practised')) : null,
          rec.readTogether ? h('span.pill', icon('star'), t('pill_read_together', { n: rec.readTogether })) : null,
          story.generated ? h('span.pill', icon('sparkle'), t('pill_written')) : null,
        ),
        h('button.btn.primary', { say: `${t('practice')}. ${t('practice_sub')}`, onclick: () => { go(`#/read/${story.id}/practice`); } },
          icon('mic'), h('span.grow', t('practice'), h('span.sub', t('practice_sub'))), icon('next')),
        h('button.btn.ghost', { say: t('read_with', vars), onclick: () => { go(`#/read/${story.id}/story`); } },
          icon('moon'), h('span.grow', t('read_with', vars), h('span.sub', t('read_with_sub'))), icon('next')),
        rec.recorded ? h('button.btn.ghost', { say: t('play_recording', { grownup: fam.grownup }), onclick: () => { go(`#/read/${story.id}/listen`); } },
          icon('play'), h('span.grow', t('play_recording', { grownup: fam.grownup }))) : null,
      ),
    ),
    h('div.mini-grid',
      h('button.mini.learning', { say: `${t('learning_now')}: ${info.key}`, onclick: () => { go('#/sky'); } },
        h('div.emo', info.pic || '⭐'),
        h('div', { style: { flex: 1 } }, h('div.small', t('learning_now')), h('div.grapheme', info.label || step.title), h('div.small', info.key ? t('as_in', { word: info.key }) : '')),
        h('span', { html: ring })),
      h('button.mini', { onclick: () => { go('#/sky'); } }, h('div.big', fmt(readable)), h('div.small', t('words_you_can_read'))),
      h('button.mini', { onclick: () => { go('#/sky'); } }, h('div.big', fmt(st.stats.nights)), h('div.small', t('nights'))),
    ),
    h('div.write-new', { style: { marginTop: '14px' }, hidden: true }, writeNew),
    installCard({ dismissKey: 'hearth.install.later' }),
    tabbar('home'),
  );
  root.append(scr);
  // Only offer a new story when the story writer can actually be reached.
  storyEngineAvailable().then(ok => { const box = scr.querySelector('.write-new'); if (box) box.hidden = !ok; });
  if (st.settings.narrate && !sessionStorage.getItem('hearth.homeSaid')) {
    try { sessionStorage.setItem('hearth.homeSaid', '1'); } catch { /* ignore */ }
  }
}

function clear(root) { root.innerHTML = ''; return root; }
export { prepare, getLexicon, speak };

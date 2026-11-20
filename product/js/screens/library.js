// Story library: everything the parent is ready for, plus what's coming.

import { h, icon } from '../ui.js';
import { t } from '../i18n.js';
import { getState } from '../store.js';
import { renderScene } from '../art.js';
import { allStories } from '../stories.js';
import { workingStep } from '../../engine/learner.js';
import { personalize } from '../../engine/text.js';
import { tabbar } from './home.js';
import { go } from '../router.js';

export function render(root) {
  const st = getState();
  const ws = workingStep(st.learner);
  const stories = allStories().slice().sort((a, b) => a.step - b.step);
  const ready = stories.filter(s => s.step <= ws).reverse();
  const later = stories.filter(s => s.step > ws);
  const card = (s, isLater) => {
    const r = st.stories[s.id] || {};
    return h(`button.lib-card${isLater ? '.later' : ''}`, { disabled: isLater ? true : null, onclick: () => !isLater && openStory(s) },
      h('div.art', { html: renderScene(s.cover, st.family.look) }),
      h('div.t', personalize(s.title, st.family)),
      h('div.s',
        r.practiced ? h('span.pill.sage', icon('check'), t('pill_practised')) : null,
        r.readTogether ? h('span.pill', icon('moon'), `×${r.readTogether}`) : null,
        r.recorded ? h('span.pill', icon('record'), st.family.grownup) : null,
        s.generated ? h('span.pill', icon('sparkle'), t('pill_new')) : null,
      ));
  };
  root.append(h('div.screen.with-tabs',
    h('h2', { style: { margin: '8px 0 4px' } }, t('library')),
    h('div.section-title', h('h3', t('lib_ready'))),
    h('div.lib-grid', ready.map(s => card(s, false))),
    later.length ? h('div.section-title', h('h3', t('lib_later'))) : null,
    later.length ? h('div.lib-grid', later.map(s => card(s, true))) : null,
    tabbar('library'),
  ));
}

function openStory(s) {
  const st = getState();
  const r = st.stories[s.id] || {};
  const vars = { child: st.family.childName, grownup: st.family.grownup };
  const close = () => back.remove();
  const nav = hash => { close(); go(hash); };
  const back = h('div.sheet-backdrop', { onclick: e => { if (e.target === back) close(); } },
    h('div.sheet',
      h('div.grab'),
      h('div.hero-art', { html: renderScene(s.cover, st.family.look) }),
      h('h2', { style: { fontFamily: 'var(--story)' } }, personalize(s.title, st.family)),
      h('button.btn.primary', { onclick: () => nav(`#/read/${s.id}/practice`) }, icon('mic'), h('span.grow', t('practice'), h('span.sub', t('practice_sub')))),
      h('button.btn.ghost', { onclick: () => nav(`#/read/${s.id}/story`) }, icon('moon'), h('span.grow', t('read_with', vars))),
      r.recorded ? h('button.btn.ghost', { onclick: () => nav(`#/read/${s.id}/listen`) }, icon('play'), h('span.grow', t('play_recording', vars))) : null,
    ));
  document.body.append(back);
}

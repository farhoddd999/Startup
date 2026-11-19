// Settings: language, how Hearth follows you, quiet hints, program sharing, privacy.

import { h, icon, toast } from '../ui.js';
import { t, LANGS, setLang } from '../i18n.js';
import { getState, update, reset } from '../store.js';
import { recognitionAvailable, requestMic } from '../voice.js';
import { tabbar } from './home.js';

const PROGRAMS = { 'RIVER-24': 'Riverside Family Center (demo)', 'LIB-OAK': 'Oakwood Public Library (demo)', 'HS-NORTH': 'Northside Head Start (demo)' };

export function render(root) {
  const st = getState();
  const toggle = (on, fn) => { const b = h(`button.toggle${on ? '.on' : ''}`, { role: 'switch', 'aria-checked': on ? 'true' : 'false', onclick: () => { fn(); b.classList.toggle('on'); b.setAttribute('aria-checked', b.classList.contains('on')); } }); return b; };
  const radio = h('div.radio', [['voice', t('mic_mode_voice')], ['tap', t('mic_mode_tap')], ['demo', t('mic_mode_demo')]].map(([id, label]) =>
    h(`button${st.settings.mic === id ? '.on' : ''}`, {
      onclick: async e => {
        if (id === 'voice' && !(recognitionAvailable() && await requestMic())) { toast(t('no_mic')); return; }
        update(s => { s.settings.mic = id; });
        [...radio.children].forEach(c => c.classList.toggle('on', c === e.currentTarget));
      },
    }, label)));
  const code = h('input.small-input', { value: st.settings.program, placeholder: 'RIVER-24', maxlength: 12 });
  const joined = h('small');
  const showJoined = () => { const name = PROGRAMS[code.value.trim().toUpperCase()]; joined.textContent = name ? `${t('joined')}: ${name}` : t('settings_program_sub'); };
  code.oninput = () => { update(s => { s.settings.program = code.value.trim().toUpperCase(); }); showJoined(); };
  showJoined();

  root.append(h('div.screen.with-tabs',
    h('h2', { style: { margin: '8px 0 16px' } }, t('settings')),
    h('div.set-group',
      h('div.set-row', h('div.txt', t('settings_lang')), h('div.seg', LANGS.map(l => h(`button${st.family.lang === l.id ? '.on' : ''}`, { onclick: () => { setLang(l.id); update(s => { s.family.lang = l.id; }); root.innerHTML = ''; render(root); } }, l.label)))),
      h('div.set-row', h('div.txt', t('settings_narrate')), toggle(st.settings.narrate, () => update(s => { s.settings.narrate = !s.settings.narrate; }))),
    ),
    h('div.set-group', h('div.set-row', { style: { flexDirection: 'column', alignItems: 'stretch' } }, h('div.txt', t('settings_mic')), radio)),
    h('div.set-group',
      h('div.set-row', h('div.txt', t('settings_whisper'), h('small', t('settings_whisper_sub'))), toggle(st.settings.whisperHints, () => update(s => { s.settings.whisperHints = !s.settings.whisperHints; }))),
    ),
    h('div.set-group',
      h('div.set-row', { style: { flexDirection: 'column', alignItems: 'stretch', gap: '8px' } }, h('div.txt', t('settings_program'), joined), code),
      h('div.set-row', h('div.txt', t('settings_share'), h('small', t('settings_share_sub'))), toggle(st.settings.share, () => update(s => { s.settings.share = !s.settings.share; }))),
    ),
    h('div.label', t('settings_privacy')),
    h('p.note', t('privacy_note')),
    h('div', { style: { height: '14px' } }),
    h('button.btn.ghost', { onclick: () => { if (confirm(t('settings_reset') + '?')) { reset(); location.hash = '#/welcome'; } } }, icon('back'), h('span.grow', t('settings_reset'))),
    tabbar('settings'),
  ));
}

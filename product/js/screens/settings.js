// Settings: language, how Hearth follows you, quiet hints, program sharing, privacy.

import { h, icon, toast } from '../ui.js';
import { t, LANGS, setLang } from '../i18n.js';
import { getState, update, reset } from '../store.js';
import { recognitionAvailable, requestMic } from '../voice.js';
import { tabbar } from './home.js';
import { go, back } from '../router.js';
import { openFeedback } from '../feedback.js';
import { canPrompt, isStandalone, onInstallChange } from '../install.js';
import { openInstall, isPhone } from '../install-sheet.js';
import { BUILD } from '../config.js';
import { applyComfort, downloadReminder, googleCalendarLink, saveBackup, chooseBackup } from '../household.js';

const PROGRAMS = { 'RIVER-24': 'Riverside Family Center (demo)', 'LIB-OAK': 'Oakwood Public Library (demo)', 'HS-NORTH': 'Northside Head Start (demo)' };

export function render(root) {
  const st = getState();
  const toggle = (on, fn, label = '') => { const b = h(`button.toggle${on ? '.on' : ''}`, { type: 'button', role: 'switch', 'aria-label': label, 'aria-checked': on ? 'true' : 'false', onclick: () => { fn(); b.classList.toggle('on'); b.setAttribute('aria-checked', b.classList.contains('on')); } }); return b; };
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

  // home-screen install: shown on phones (and where the browser offers it) until Hearth is installed
  const install = h('div.set-group', { hidden: true });
  const drawInstall = () => {
    install.innerHTML = '';
    install.hidden = isStandalone() || !(isPhone() || canPrompt());
    if (install.hidden) return;
    install.append(h('div.set-row',
      h('div.txt', t('install'), h('small', t('install_sub'))),
      h('button.btn.dark.small-btn', { type: 'button', say: t('inst_btn'), onclick: () => openInstall() }, t('inst_btn')),
    ));
  };
  drawInstall();
  const offInstall = onInstallChange(drawInstall);

  // reading comfort: bigger story text, slower read-aloud voice
  const choice = (cls, key, opts) => h(`div.seg.${cls}`, { role: 'group' }, opts.map(([id, label]) => {
    const on = (st.settings[key] || opts[0][0]) === id;
    return h(`button${on ? '.on' : ''}`, { type: 'button', 'aria-pressed': String(on), onclick: e => {
      update(s => { s.settings[key] = id; });
      applyComfort();
      [...e.currentTarget.parentNode.children].forEach(c => { const me = c === e.currentTarget; c.classList.toggle('on', me); c.setAttribute('aria-pressed', String(me)); });
    } }, label);
  }));
  const comfort = h('div.set-group',
    h('div.set-row.col', h('div.txt', t('text_size')), choice('size-choice', 'textSize', [['m', t('size_m')], ['l', t('size_l')], ['xl', t('size_xl')]])),
    h('div.set-row.col', h('div.txt', t('voice_speed')), choice('pace-choice', 'speechPace', [['normal', t('speed_normal')], ['slow', t('speed_slow')]])));

  // bedtime reminder in the phone's own calendar
  const time = h('input.small-input', { id: 'remindTime', type: 'time', value: st.settings.remindTime || '19:30' });
  const gLink = h('a.btn.ghost.remind-google', { href: googleCalendarLink(time.value), target: '_blank', rel: 'noopener' }, h('span.grow', t('remind_add_g')));
  time.addEventListener('input', () => { update(s => { s.settings.remindTime = time.value; }); gLink.href = googleCalendarLink(time.value); });
  const remind = h('div.set-group', h('div.set-row.col',
    h('div.txt', t('remind'), h('small', t('remind_sub'))),
    h('label.remind-time', { for: 'remindTime' }, t('remind_time'), time),
    h('div.two', gLink, h('button.btn.ghost', { type: 'button', onclick: () => downloadReminder(time.value) }, h('span.grow', t('remind_add_file'))))));

  // moving to another phone
  const move = h('div.set-group', h('div.set-row.col',
    h('div.txt', t('backup'), h('small', t('backup_sub'))),
    h('div.two', h('button.btn.ghost', { type: 'button', onclick: saveBackup }, h('span.grow', t('backup_save'))), h('button.btn.ghost', { type: 'button', onclick: chooseBackup }, h('span.grow', t('backup_load'))))));

  root.append(h('div.screen.with-tabs',
    h('h2', { style: { margin: '8px 0 16px' } }, t('settings')),
    h('button.btn.ghost.fb-open', { type: 'button', say: t('feedback'), onclick: () => openFeedback({ where: 'settings' }) },
      icon('chat'), h('span.grow', t('feedback'), h('span.sub', t('feedback_sub'))), icon('next')),
    install,
    h('div.set-group',
      h('div.set-row', h('div.txt', t('settings_lang')), h('div.seg', LANGS.map(l => h(`button${st.family.lang === l.id ? '.on' : ''}`, { onclick: () => { setLang(l.id); update(s => { s.family.lang = l.id; }); root.innerHTML = ''; render(root); } }, l.label)))),
      h('div.set-row', h('div.txt', t('settings_narrate')), toggle(st.settings.narrate, () => update(s => { s.settings.narrate = !s.settings.narrate; }), t('settings_narrate'))),
    ),
    h('div.set-group', h('div.set-row', { style: { flexDirection: 'column', alignItems: 'stretch' } }, h('div.txt', t('settings_mic')), radio)),
    h('div.set-group',
      h('div.set-row', h('div.txt', t('settings_whisper'), h('small', t('settings_whisper_sub'))), toggle(st.settings.whisperHints, () => update(s => { s.settings.whisperHints = !s.settings.whisperHints; }), t('settings_whisper'))),
    ),
    h('div.label', t('comfort')),
    comfort,
    remind,
    h('div.set-group',
      h('div.set-row', { style: { flexDirection: 'column', alignItems: 'stretch', gap: '8px' } }, h('div.txt', t('settings_program'), joined), code),
      h('div.set-row', h('div.txt', t('settings_share'), h('small', t('settings_share_sub'))), toggle(st.settings.share, () => update(s => { s.settings.share = !s.settings.share; }), t('settings_share'))),
    ),
    move,
    h('div.label', t('settings_privacy')),
    h('p.note', t('privacy_note')),
    h('div', { style: { height: '14px' } }),
    h('button.btn.ghost', { onclick: () => { if (confirm(t('reset_confirm'))) { reset(); go('#/welcome'); } } }, icon('back'), h('span.grow', t('settings_reset'))),
    h('p.fb-build', `${t('test_version')} · Hearth ${BUILD.version} · build ${BUILD.build} · ${BUILD.date}`),
    tabbar('settings'),
  ));
  return offInstall;
}

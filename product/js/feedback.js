// Tester feedback. Hearth has no server and sends nothing by itself: the tester
// picks a face, a few words or a voice message, sees exactly what will be sent,
// then shares it through their phone's own share sheet, email, or copy/paste.

import { h, icon, toast } from './ui.js';
import { t, getLang } from './i18n.js';
import { getState } from './store.js';
import { speak, stopSpeaking, recognitionAvailable } from './voice.js';
import { workingStep } from '../engine/learner.js';
import { BUILD, FEEDBACK_TO } from './config.js';

const FACES = [['good', '😊'], ['okay', '😐'], ['hard', '😟']];
const CHIPS = ['helped', 'hear', 'hard', 'easy', 'child', 'confusing', 'broke'];
const MAX_VOICE_MS = 120000;

/** A short, non-identifying description of the device: platform and browser. */
export function deviceLabel(ua = navigator.userAgent) {
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad|Macintosh.*Mobile/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android'
    : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac' : /CrOS/.test(ua) ? 'ChromeOS' : /Linux/.test(ua) ? 'Linux' : 'Other';
  const v = re => (re.exec(ua) || [])[1];
  const br = v(/SamsungBrowser\/(\d+)/) ? `Samsung Internet ${v(/SamsungBrowser\/(\d+)/)}`
    : v(/EdgA?\/(\d+)/) ? `Edge ${v(/EdgA?\/(\d+)/)}`
    : v(/(?:CriOS|Chrome)\/(\d+)/) ? `Chrome ${v(/(?:CriOS|Chrome)\/(\d+)/)}`
    : v(/(?:FxiOS|Firefox)\/(\d+)/) ? `Firefox ${v(/(?:FxiOS|Firefox)\/(\d+)/)}`
    : v(/Version\/(\d+)[^]*Safari/) ? `Safari ${v(/Version\/(\d+)[^]*Safari/)}` : 'other browser';
  const standalone = matchMedia?.('(display-mode: standalone)').matches || navigator.standalone ? ', home-screen app' : '';
  return `${os} · ${br}${standalone}`;
}

/** Practice summary a tester can choose to add. Counts only: no names, no audio, no words. */
export function practiceSummary(st = getState()) {
  const hist = st.history || [];
  const practice = hist.filter(x => x.mode === 'practice').length;
  const story = hist.filter(x => x.mode === 'story').length;
  const helped = hist.reduce((n, x) => n + (x.q?.helped || 0), 0);
  const words = hist.reduce((n, x) => n + (x.words || 0), 0);
  const days = new Set(hist.map(x => new Date(x.at).toDateString())).size;
  return `Practice sessions: ${practice} · Story times: ${story} · Days used: ${days} · Words read: ${words} · Words with a hint: ${helped} · Working on step ${workingStep(st.learner)} of 40`;
}

export function composeFeedback({ face, chips = [], text = '', voice = false, summary = false, where = '' }, st = getState()) {
  const lines = ['Hearth tester feedback', ''];
  if (face) lines.push(`Feeling: ${t(`fb_${face}`)}`);
  if (chips.length) lines.push(`Notes: ${chips.map(c => t(`fb_c_${c}`)).join('; ')}`);
  if (text.trim()) lines.push('', text.trim().slice(0, 4000), '');
  if (voice) lines.push('Voice message: attached');
  if (summary) lines.push(practiceSummary(st));
  lines.push('', '—',
    `App: Hearth ${BUILD.version} · build ${BUILD.build} (${BUILD.date})`,
    `Screen: ${where || 'settings'} · Language: ${getLang()} · Follows by: ${st.settings.mic}${recognitionAvailable() ? '' : ' (no speech recognition in this browser)'}`,
    `Device: ${deviceLabel()}`);
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

export function openFeedback({ where = '' } = {}) {
  stopSpeaking();
  const st = getState();
  const sel = { face: null, chips: new Set(), summary: false };
  let voiceBlob = null, recorder = null, recTimer = null, voiceUrl = null;

  const close = () => { stopVoice(); stopSpeaking(); if (voiceUrl) URL.revokeObjectURL(voiceUrl); back.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);

  const faces = h('div.fb-faces', { role: 'group', 'aria-label': t('fb_title') }, FACES.map(([id, emo]) =>
    h('button.fb-face', { type: 'button', 'aria-pressed': 'false', say: t(`fb_${id}`), 'data-face': id, onclick: e => {
      sel.face = sel.face === id ? null : id;
      [...faces.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.face === sel.face)));
      refresh();
    } }, h('span.e', { 'aria-hidden': 'true' }, emo), h('span', t(`fb_${id}`)))));

  const chips = h('div.chips', CHIPS.map(id => h('button.chip-btn', { type: 'button', 'aria-pressed': 'false', 'data-chip': id, onclick: e => {
    sel.chips.has(id) ? sel.chips.delete(id) : sel.chips.add(id);
    e.currentTarget.classList.toggle('on', sel.chips.has(id));
    e.currentTarget.setAttribute('aria-pressed', String(sel.chips.has(id)));
    refresh();
  } }, t(`fb_c_${id}`))));

  // voice message, for testers who would rather talk than write
  const canRecord = 'MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia;
  const voiceBox = h('div.fb-voice');
  function drawVoice(state = voiceBlob ? 'done' : 'idle') {
    voiceBox.innerHTML = '';
    if (state === 'rec') {
      voiceBox.append(h('button.btn.primary.fb-rec.live', { type: 'button', onclick: stopVoice }, icon('record'), h('span.grow', t('fb_stop'))));
      return;
    }
    if (state === 'done') {
      voiceUrl && URL.revokeObjectURL(voiceUrl);
      voiceUrl = URL.createObjectURL(voiceBlob);
      voiceBox.append(
        h('div.fb-recorded', icon('check'), h('span', t('fb_recorded'))),
        h('audio', { controls: true, src: voiceUrl, preload: 'metadata' }),
        h('button.btn.ghost', { type: 'button', onclick: startVoice }, icon('record'), h('span.grow', t('fb_again'))),
      );
      return;
    }
    voiceBox.append(h('button.btn.ghost.fb-rec', { type: 'button', say: t('fb_voice'), onclick: startVoice }, icon('mic'), h('span.grow', t('fb_voice'), h('span.sub', t('fb_voice_sub')))));
  }
  async function startVoice() {
    stopSpeaking();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach(tr => tr.stop());
        clearTimeout(recTimer);
        if (chunks.length) voiceBlob = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' });
        recorder = null;
        drawVoice();
        refresh();
      };
      recorder.start();
      recTimer = setTimeout(stopVoice, MAX_VOICE_MS);
      drawVoice('rec');
    } catch { toast(t('no_mic')); drawVoice(); }
  }
  function stopVoice() { try { if (recorder && recorder.state !== 'inactive') recorder.stop(); } catch { /* ignore */ } }
  if (canRecord) drawVoice();

  const more = h('textarea.fb-text', { rows: 3, maxlength: 4000, placeholder: t('fb_more'), 'aria-label': t('fb_more'), oninput: () => refresh() });
  const sumToggle = h('button.toggle', { type: 'button', role: 'switch', 'aria-checked': 'false', 'aria-label': t('fb_summary'), onclick: () => {
    sel.summary = !sel.summary;
    sumToggle.classList.toggle('on', sel.summary);
    sumToggle.setAttribute('aria-checked', String(sel.summary));
    refresh();
  } });
  const preview = h('textarea.fb-preview', { readonly: true, rows: 8, 'aria-label': t('fb_preview') });
  const thanks = h('p.fb-thanks', { hidden: true }, t('fb_thanks'));

  const current = () => ({ face: sel.face, chips: [...sel.chips], text: more.value, voice: !!voiceBlob, summary: sel.summary, where });
  const hasContent = () => !!(sel.face || sel.chips.size || more.value.trim() || voiceBlob);
  function refresh() { preview.value = composeFeedback(current(), st); }

  const ext = () => ((voiceBlob?.type || '').includes('mp4') ? 'm4a' : (voiceBlob?.type || '').includes('ogg') ? 'ogg' : 'webm');
  const voiceFile = () => voiceBlob && new File([voiceBlob], `hearth-feedback-${new Date().toISOString().slice(0, 10)}.${ext()}`, { type: voiceBlob.type || 'audio/webm' });
  const subject = () => `Hearth feedback${sel.face ? ` (${t(`fb_${sel.face}`)})` : ''}`;
  const done = () => { thanks.hidden = false; speak(t('fb_thanks')); };

  async function send() {
    if (!hasContent()) { toast(t('fb_empty')); return; }
    const text = composeFeedback(current(), st);
    const file = voiceFile();
    const withTo = `${text}\n\nTo: ${FEEDBACK_TO}`;
    try {
      if (file && navigator.canShare?.({ files: [file] })) { await navigator.share({ title: subject(), text: withTo, files: [file] }); return done(); }
      if (navigator.share) { await navigator.share({ title: subject(), text: withTo }); if (file) offerVoiceDownload(); return done(); }
    } catch (err) { if (err?.name === 'AbortError') return; }
    email();
  }
  function email() {
    if (!hasContent()) { toast(t('fb_empty')); return; }
    const text = composeFeedback(current(), st);
    if (voiceBlob) offerVoiceDownload();
    location.href = `mailto:${FEEDBACK_TO}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(text + (voiceBlob ? '\n\n(Please attach the voice message you saved.)' : ''))}`;
    done();
  }
  async function copy(btn) {
    if (!hasContent()) { toast(t('fb_empty')); return; }
    const text = composeFeedback(current(), st);
    try { await navigator.clipboard.writeText(`${text}\n\nTo: ${FEEDBACK_TO}`); btn.querySelector('.grow').textContent = t('fb_copied'); setTimeout(() => { btn.querySelector('.grow').textContent = t('fb_copy'); }, 1800); }
    catch { preview.select(); }
    if (voiceBlob) offerVoiceDownload();
  }
  const dl = h('div.fb-dl');
  function offerVoiceDownload() {
    if (!voiceBlob || dl.firstChild) return;
    const f = voiceFile();
    dl.append(h('a.btn.ghost', { href: voiceUrl || URL.createObjectURL(voiceBlob), download: f.name }, icon('record'), h('span.grow', t('fb_save_voice'))));
  }

  const copyBtn = h('button.btn.ghost', { type: 'button', onclick: () => copy(copyBtn) }, h('span.grow', t('fb_copy')));
  const back = h('div.sheet-backdrop', { onclick: e => { if (e.target === back) close(); } },
    h('div.sheet.fb-sheet', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fbTitle' },
      h('div.grab'),
      h('div.row', h('h3', { id: 'fbTitle', style: { flex: 1 } }, t('fb_title')),
        h('button.icon-btn', { type: 'button', 'aria-label': t('listen'), onclick: () => speak(t('fb_say')) }, icon('speaker')),
        h('button.icon-btn', { type: 'button', 'aria-label': t('close'), onclick: close }, icon('close'))),
      faces,
      chips,
      canRecord ? voiceBox : null,
      more,
      h('div.set-row.fb-sum', h('div.txt', t('fb_summary'), h('small', t('fb_summary_sub'))), sumToggle),
      h('details.fb-details', h('summary', t('fb_preview')), preview),
      h('button.btn.primary.fb-send', { type: 'button', onclick: send }, h('span.grow', t('fb_send')), icon('next')),
      h('div.fb-row', h('button.btn.ghost', { type: 'button', onclick: email }, h('span.grow', t('fb_email'))), copyBtn),
      dl,
      thanks,
      h('p.note', t('fb_note'), ' ', FEEDBACK_TO),
      h('p.fb-build', `${t('test_version')} · ${BUILD.version} · ${BUILD.build}`),
    ));
  refresh();
  document.body.append(back);
  if (st.settings.narrate) speak(t('fb_say'));
  back.querySelector('.fb-face')?.focus();
  return close;
}

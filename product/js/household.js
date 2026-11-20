// Everyday helpers for the family: a bedtime reminder in the phone's own
// calendar, a backup file for moving to another phone, and reading comfort.
// No servers and no notification permissions: everything stays with the family.

import { toast, h } from './ui.js';
import { t, getLang, setLang } from './i18n.js';
import { getState, restoreFrom } from './store.js';
import { setSpeechPace } from './voice.js';
import { BUILD } from './config.js';

// ---- reading comfort ----
const SCALE = { m: 1, l: 1.2, xl: 1.42 };
export function applyComfort(st = getState()) {
  document.documentElement.style.setProperty('--text-scale', String(SCALE[st.settings.textSize] || 1));
  setSpeechPace(st.settings.speechPace);
}

// ---- bedtime reminder ----
const pad = n => String(n).padStart(2, '0');
function nextAt(hhmm) {
  const [hh, mm] = (/^\d{1,2}:\d{2}$/.test(hhmm) ? hhmm : '19:30').split(':').map(Number);
  const d = new Date();
  d.setHours(Math.min(hh, 23), Math.min(mm, 59), 0, 0);
  if (d < new Date()) d.setDate(d.getDate() + 1);
  return d;
}
const stamp = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const icsText = s => s.replace(/[\\;,]/g, m => `\\${m}`).replace(/\n/g, '\\n');

/** A calendar file with a daily event at story time and a nudge 20 minutes before to practise. No names in it. */
export function reminderFile(hhmm) {
  const start = nextAt(hhmm);
  const end = new Date(start.getTime() + 20 * 60e3);
  const now = new Date();
  const utc = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hearth//Bedtime reminder//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:hearth-bedtime-${now.getTime().toString(36)}@hearth.app`,
    `DTSTAMP:${utc}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${icsText(t('remind_event'))}`,
    `DESCRIPTION:${icsText(t('remind_note'))}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(t('remind_note'))}`, 'TRIGGER:-PT20M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

export function downloadReminder(hhmm) {
  const blob = new Blob([reminderFile(hhmm)], { type: 'text/calendar' });
  saveFile(blob, 'hearth-bedtime.ics');
  toast(t('remind_done'), 4200);
}

/** Opens Google Calendar with the event filled in (Android phones). */
export function googleCalendarLink(hhmm) {
  const start = nextAt(hhmm);
  const end = new Date(start.getTime() + 20 * 60e3);
  const q = new URLSearchParams({ action: 'TEMPLATE', text: t('remind_event'), details: t('remind_note'), dates: `${stamp(start)}/${stamp(end)}`, recur: 'RRULE:FREQ=DAILY' });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

// ---- moving to another phone ----
export function saveBackup() {
  const data = { app: 'hearth', kind: 'backup', v: 1, savedAt: new Date().toISOString(), build: BUILD.build, state: getState() };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  saveFile(blob, `hearth-backup-${new Date().toISOString().slice(0, 10)}.json`, { share: true });
  toast(t('backup_saved'), 4600);
}

/** Ask for a backup file, check it, and restore it after the parent agrees. */
export function chooseBackup() {
  const input = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' } });
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    input.remove();
    if (!file) return;
    if (file.size > 2e6) { toast(t('backup_bad')); return; }
    let data;
    try { data = JSON.parse(await file.text()); } catch { data = null; }
    const st = data?.state;
    if (data?.app !== 'hearth' || !st || typeof st !== 'object' || !st.family || typeof st.family !== 'object') { toast(t('backup_bad'), 4200); return; }
    const when = new Date(data.savedAt);
    const date = Number.isNaN(when.getTime()) ? '' : when.toLocaleDateString(getLang() === 'es' ? 'es' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (!confirm(t('backup_confirm', { date }))) return;
    restoreFrom(st);
    setLang(getState().family.lang || 'en');
    toast(t('backup_done'));
    setTimeout(() => { location.hash = '#/home'; location.reload(); }, 700);
  });
  document.body.append(input);
  input.click();
}

// Share sheet on phones when it can take files, otherwise a normal download.
async function saveFile(blob, name, { share = false } = {}) {
  const file = new File([blob], name, { type: blob.type });
  if (share) {
    try { if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: name }); return; } } catch (e) { if (e?.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name, style: { display: 'none' } });
  document.body.append(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 4000);
}

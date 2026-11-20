// Voice: text-to-speech for help and narration, speech recognition for
// following the reader, and a simulated reader for demos. All three expose
// the same small surface so screens never care which one is running.

import { getLang } from './i18n.js';
import { simulatePage } from '../engine/simulate.js';

// ---- text to speech ---------------------------------------------------------
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voices = [];
function loadVoices() { voices = synth ? synth.getVoices() : []; }
if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

const PREFERRED = {
  en: [/Samantha/i, /Google US English/i, /Aria.*Natural/i, /Jenny.*Natural/i, /Natural/i, /en-US/i],
  es: [/Paulina/i, /Monica/i, /Google español de Estados Unidos/i, /Google español/i, /Natural/i, /es-(US|MX)/i, /es-/i],
};
function pickVoice(lang) {
  const list = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(lang));
  for (const re of PREFERRED[lang] || []) { const v = list.find(x => re.test(x.name) || re.test(x.lang)); if (v) return v; }
  return list[0] || null;
}

export const ttsAvailable = () => !!synth;
export function stopSpeaking() { try { synth && synth.cancel(); } catch { /* ignore */ } }

/**
 * Speak text. Resolves when finished (or immediately if TTS is unavailable).
 * opts: {lang, rate, onWord(charIndex)} — onWord fires on word boundaries where supported.
 */
// "Read-aloud speed" in Settings: 'slow' makes every spoken line a little slower.
let rateScale = 1;
export const setSpeechPace = pace => { rateScale = pace === 'slow' ? 0.8 : 1; };

export function speak(text, { lang = getLang(), rate: baseRate = 0.92, pitch = 1, onWord, interrupt = true } = {}) {
  const rate = baseRate * rateScale;
  return new Promise(resolve => {
    if (!synth || !text) return resolve();
    if (interrupt) stopSpeaking();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.lang = v?.lang || (lang === 'es' ? 'es-US' : 'en-US');
    u.rate = rate; u.pitch = pitch;
    if (onWord) u.onboundary = e => { if (e.name === 'word' || e.name === undefined) onWord(e.charIndex); };
    u.onend = () => resolve();
    u.onerror = () => resolve();
    synth.speak(u);
    // Some engines never fire onend if interrupted; don't hang the UI.
    setTimeout(resolve, Math.max(2500, text.length * 140 / rate));
  });
}

/** Say a story word clearly: once slowly, once at normal speed. */
export async function sayWord(word, { twice = false } = {}) {
  await speak(word, { lang: 'en', rate: 0.7 });
  if (twice) await speak(word, { lang: 'en', rate: 0.95, interrupt: false });
}

/**
 * Read a page aloud with word-by-word highlighting (the "Listen" model read).
 * Uses boundary events when the engine provides them; otherwise paces
 * highlights by word length so the experience is the same everywhere.
 */
export function readAloud(words, { onWord, rate = 0.85 } = {}) {
  let cancelled = false;
  const text = words.map(w => w.text).join(' ');
  const starts = [];
  let pos = 0;
  for (const w of words) { starts.push(pos); pos += w.text.length + 1; }
  let gotBoundary = false;
  const promise = new Promise(async resolve => {
    if (!synth) {
      for (let i = 0; i < words.length && !cancelled; i++) { onWord?.(i); await wait(260 + words[i].text.length * 70); }
      return resolve();
    }
    let timerIdx = 0;
    const timer = setInterval(() => {
      if (gotBoundary || cancelled) return clearInterval(timer);
      if (timerIdx < words.length) onWord?.(timerIdx++);
    }, 420 / (rate * rateScale));
    await speak(text, {
      lang: 'en', rate,
      onWord: ci => { gotBoundary = true; const i = starts.findLastIndex(s => s <= ci); if (i >= 0) onWord?.(i); },
    });
    clearInterval(timer);
    resolve();
  });
  return { promise, cancel() { cancelled = true; stopSpeaking(); } };
}

const wait = ms => new Promise(r => setTimeout(r, ms));

// ---- speech recognition -----------------------------------------------------
const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
export const recognitionAvailable = () => !!SR;

/**
 * Continuous recogniser that survives the browser's habit of stopping after
 * silence. onText(finalSoFar, interim) receives the whole session so far.
 */
export function createRecognizer({ onText, onState, onError, lang = 'en-US' } = {}) {
  if (!SR) return null;
  let rec = null, wanted = false, carried = '', sessionFinal = '';
  const begin = () => {
    rec = new SR();
    rec.lang = lang; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
    sessionFinal = '';
    rec.onresult = e => {
      let fin = '', interim = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) fin += ' ' + r[0].transcript; else interim += ' ' + r[0].transcript;
      }
      sessionFinal = fin;
      onText?.(`${carried} ${fin}`.trim(), interim.trim());
    };
    rec.onstart = () => onState?.('listening');
    rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { wanted = false; onError?.(e.error); } };
    rec.onend = () => {
      carried = `${carried} ${sessionFinal}`.trim();
      if (wanted) { try { begin(); } catch { onState?.('stopped'); } } else onState?.('stopped');
    };
    try { rec.start(); } catch (err) { onError?.(String(err)); }
  };
  return {
    start() { if (wanted) return; wanted = true; carried = ''; begin(); },
    stop() { wanted = false; try { rec && rec.stop(); } catch { /* ignore */ } },
    reset() { carried = ''; sessionFinal = ''; },
    get active() { return wanted; },
  };
}

/** Ask for the microphone up front so the permission prompt happens in onboarding, not mid-story. */
export async function requestMic() {
  try {
    if (!navigator.mediaDevices?.getUserMedia) return !!SR;
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    s.getTracks().forEach(t => t.stop());
    return true;
  } catch { return false; }
}

// ---- simulated reader (demo mode) ----------------------------------------
/** Same interface as createRecognizer, but "reads" the given words aloud-in-spirit. */
export function createSimulatedReader({ words, onText, onState, seed = 11, struggle = 0.6, speakAlong = false }) {
  let timers = [], running = false;
  return {
    start() {
      if (running) return;
      running = true; onState?.('listening');
      const tl = simulatePage(words, { seed, struggle });
      let lastFinal = '';
      tl.forEach(snap => timers.push(setTimeout(() => {
        onText?.(snap.final, snap.interim);
        if (speakAlong && snap.interim && snap.final !== lastFinal) speak(snap.interim, { lang: 'en', rate: 1.05 });
        lastFinal = snap.final;
      }, snap.at)));
      timers.push(setTimeout(() => { running = false; onState?.('stopped'); }, tl[tl.length - 1].at + 400));
    },
    stop() { timers.forEach(clearTimeout); timers = []; running = false; onState?.('stopped'); },
    reset() {},
    get active() { return running; },
  };
}

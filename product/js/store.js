// Local-first state. Everything lives on the parent's phone. Nothing about
// their reading leaves the device unless they opt in to share a summary with
// their program (and even then: nights read and sounds learned, never audio).

import { createLearner } from '../engine/learner.js';

const KEY = 'hearth.v1';

export function defaultState() {
  return {
    v: 1,
    onboarded: false,
    family: {
      childName: '', childAge: '4-5', grownup: 'Mama', interests: [], lang: 'en',
      look: { childSkin: 2, childHair: 'puffs', childHairColor: 0, grownupSkin: 2, grownupHair: 'bun', grownupHairColor: 0 },
    },
    learner: createLearner(0),
    settings: { mic: 'voice', whisperHints: false, narrate: true, program: '', share: false },
    stories: {},           // id → {practiced, readTogether, lastAt, recorded}
    generated: [],         // stories written by the story engine
    history: [],           // [{at, id, mode, words, q:{fluent,effortful,helped,skipped}, readable}]
    stats: { nights: 0, wordsAloud: 0, practiceMs: 0 },
    tonight: null,
  };
}

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(defaultState(), JSON.parse(raw));
  } catch { /* private mode or blocked storage: run in memory */ }
  return defaultState();
}

// Saved data from an older version keeps working: new settings get their defaults,
// and anything of the wrong shape is ignored rather than breaking the app.
function merge(base, saved) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return base;
  const out = { ...base };
  for (const [k, v] of Object.entries(saved)) {
    const b = base[k];
    if (b && typeof b === 'object' && !Array.isArray(b) && v && typeof v === 'object' && !Array.isArray(v) && k !== 'learner' && k !== 'stories') out[k] = { ...b, ...v };
    else if (b === undefined || b === null || typeof b === typeof v) out[k] = v;
  }
  if (!Array.isArray(out.history)) out.history = [];
  if (!Array.isArray(out.generated)) out.generated = [];
  if (!Array.isArray(out.family.interests)) out.family.interests = [];
  return out;
}

export const getState = () => state;
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach(fn => fn(state));
}
export function update(fn) { fn(state); save(); }
export function replaceState(next) { state = next; save(); }
export function reset() { state = defaultState(); save(); clearRecordings(); }
export const subscribe = fn => (listeners.add(fn), () => listeners.delete(fn));

export function storyRecord(id) {
  return (state.stories[id] ||= { practiced: 0, readTogether: 0, lastAt: 0, recorded: false });
}

// ---- recordings (IndexedDB): the parent's own voice, for night-shift bedtimes ----
const DB = 'hearth-recordings';
function db() {
  return new Promise((res, rej) => {
    if (!('indexedDB' in window)) return rej(new Error('no idb'));
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('pages');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function saveRecording(storyId, page, blob) {
  try {
    const d = await db();
    await new Promise((res, rej) => { const tx = d.transaction('pages', 'readwrite'); tx.objectStore('pages').put(blob, `${storyId}:${page}`); tx.oncomplete = res; tx.onerror = rej; });
    update(s => { storyRecord(storyId).recorded = true; });
  } catch { /* storage unavailable: recording simply isn't kept */ }
}
export async function getRecording(storyId, page) {
  try {
    const d = await db();
    return await new Promise(res => { const r = d.transaction('pages').objectStore('pages').get(`${storyId}:${page}`); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); });
  } catch { return null; }
}
async function clearRecordings() {
  try { const d = await db(); d.transaction('pages', 'readwrite').objectStore('pages').clear(); } catch { /* ignore */ }
}

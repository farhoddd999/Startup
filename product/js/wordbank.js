// Tricky words, brought back at the right time (spaced review).
// A word that needed help comes back for a warm-up the next day. Each time it's
// read easily it rests longer (3, 7, then 14 days); after that it's learned and
// leaves the bank. If it's still tricky, it comes back tomorrow. All on the phone.

import { getState, update } from './store.js';

const DAY = 864e5;
const REST_DAYS = [1, 3, 7, 14];
const MAX_WORDS = 60;
const dayStart = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

const bank = (st = getState()) => (st.wordbank && typeof st.wordbank === 'object' ? st.wordbank : {});

/** Words that needed help in a session go into the bank (or back to the start). */
export function addTricky(words, now = Date.now()) {
  if (!words?.length) return;
  update(s => {
    s.wordbank = bank(s);
    for (const w of words) {
      const norm = String(w.norm || w.text || '').toLowerCase();
      if (!/^[a-z']{2,20}$/.test(norm)) continue;
      const prev = s.wordbank[norm];
      s.wordbank[norm] = { word: String(w.text || norm), box: 0, due: dayStart(now) + DAY, misses: (prev?.misses || 0) + 1, added: prev?.added || now };
    }
    const keys = Object.keys(s.wordbank);
    if (keys.length > MAX_WORDS) keys.sort((a, b) => s.wordbank[a].added - s.wordbank[b].added).slice(0, keys.length - MAX_WORDS).forEach(k => delete s.wordbank[k]);
  });
}

/** Words due for a warm-up today, oldest first. */
export function dueWords(now = Date.now(), max = 5) {
  return Object.entries(bank()).filter(([, e]) => e.due <= now).sort((a, b) => a[1].due - b[1].due).slice(0, max).map(([norm, e]) => ({ norm, ...e }));
}

/** After trying a word: easy → rests longer (or is learned); still tricky → back tomorrow. */
export function markWord(norm, readIt, now = Date.now()) {
  let learned = false;
  update(s => {
    s.wordbank = bank(s);
    const e = s.wordbank[norm];
    if (!e) return;
    if (readIt) {
      e.box += 1;
      if (e.box >= REST_DAYS.length) { delete s.wordbank[norm]; learned = true; return; }
      e.due = dayStart(now) + REST_DAYS[e.box] * DAY;
    } else {
      e.box = 0;
      e.misses += 1;
      e.due = dayStart(now) + DAY;
    }
  });
  return learned;
}

/** A word from the bank read smoothly inside a story counts as a good review too. */
export function noteFluent(norms, now = Date.now()) {
  const b = bank();
  for (const n of new Set(norms)) if (b[n] && b[n].due <= now) markWord(n, true, now);
}

export const bankCount = () => Object.keys(bank()).length;

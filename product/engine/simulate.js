// Simulated reader for demo mode: produces the same transcript stream a real
// speech recogniser would, so the whole pipeline (tracker → hints → learner)
// runs exactly as it does with a live voice. Deterministic per seed.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a reading timeline for one page.
 * @param words [{text, norm, focus?:boolean, hard?:boolean}]
 * @returns [{at:ms, final:string, interim:string}] cumulative transcript snapshots
 */
export function simulatePage(words, { seed = 7, pace = 1, struggle = 0.5 } = {}) {
  const rnd = mulberry32(seed);
  const timeline = [];
  let t = 600 / pace;
  const said = [];
  words.forEach((w, i) => {
    const hard = w.hard || (w.focus && rnd() < struggle);
    if (hard) {
      // hesitate long enough to earn a hint, sometimes try a near-miss first
      t += (3400 + rnd() * 4200) / pace;
      if (w.norm.length > 2 && rnd() < 0.5) {
        const miss = nearMiss(w.norm, rnd);
        timeline.push({ at: t, final: said.join(' '), interim: miss });
        t += 900 / pace;
      }
    } else {
      t += (380 + rnd() * 380 + w.norm.length * 30) / pace;
    }
    timeline.push({ at: t, final: said.join(' '), interim: w.norm });
    said.push(w.norm);
    // punctuation pause
    if (/[.!?]$/.test(w.text) || w.endsSentence) t += 500 / pace;
  });
  timeline.push({ at: t + 300 / pace, final: said.join(' '), interim: '' });
  return timeline;
}

function nearMiss(word, rnd) {
  const swaps = { a: 'u', e: 'i', i: 'e', o: 'a', u: 'o' };
  // Long words: the reader gets the start ("ju…"). Short words: a vowel slip ("bud" for "bed").
  if (word.length >= 4) return word.slice(0, Math.max(1, Math.floor(word.length / 2)));
  const idx = [...word].findIndex(ch => swaps[ch]);
  if (idx < 0) return word.slice(0, 1);
  return rnd() < 0.7 ? word.slice(0, idx) + swaps[word[idx]] + word.slice(idx + 1) : word.slice(0, 1);
}

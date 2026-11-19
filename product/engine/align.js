// Grapheme ↔ phoneme alignment
// ---------------------------------------------------------------------------
// Given a spelling ("cake") and its pronunciation from the CMU dictionary
// ("K EY1 K"), find the cheapest way to explain the spelling with our GPC
// rules: c→K · a_e→EY · k→K · (e silent, closing the split digraph).
//
// Dynamic programming over (letter index, phoneme index, open-split flag).
// Rules carry costs so common correspondences win; anything we cannot
// explain falls back to an expensive "irregular" step, which is exactly the
// part of a heart word we teach by sight.

import { RULES_BY_LETTER, PATTERN_STEP, isVowelPhoneme, stripStress } from './phonics.js';

const IRREGULAR_COST = 12;

function phonemeMatches(rulePh, wordPh) {
  if (/[0-9]$/.test(rulePh)) return rulePh === wordPh;
  return rulePh === stripStress(wordPh);
}

/**
 * @param {string} word lowercase letters (apostrophes allowed)
 * @param {string[]} phones CMU phonemes with stress, e.g. ['K','EY1','K']
 * @returns {{cost:number, segments:Array<{g:string, ph:string[], pat:string, split?:boolean, close?:boolean}>}}
 */
export function alignWord(word, phones) {
  const L = word.length, P = phones.length;
  // best[i][j][s] = {cost, prev:[i,j,s], seg}
  const best = Array.from({ length: L + 1 }, () => Array.from({ length: P + 1 }, () => [null, null]));
  best[0][0][0] = { cost: 0, prev: null, seg: null };

  for (let i = 0; i <= L; i++) {
    for (let j = 0; j <= P; j++) {
      for (let s = 0; s < 2; s++) {
        const cur = best[i][j][s];
        if (!cur) continue;
        const relax = (ni, nj, ns, cost, seg) => {
          const c = cur.cost + cost;
          const t = best[ni][nj][ns];
          if (!t || c < t.cost - 1e-9) best[ni][nj][ns] = { cost: c, prev: [i, j, s], seg };
        };
        if (i < L) {
          for (const r of RULES_BY_LETTER[word[i]] || []) {
            const len = r.g.length;
            if (word.substr(i, len) !== r.g) continue;
            if (r.ctx && !r.ctx(word, i, len)) continue;
            const k = r.ph.length;
            if (j + k > P) continue;
            let ok = true;
            for (let q = 0; q < k; q++) if (!phonemeMatches(r.ph[q], phones[j + q])) { ok = false; break; }
            if (!ok) continue;
            if (r.flag === 'split') { if (s === 1) continue; relax(i + len, j + k, 1, r.cost, { g: r.g, ph: phones.slice(j, j + k), pat: r.pat, split: true }); continue; }
            if (r.flag === 'close') { if (s === 0 || i !== lastE(word)) continue; relax(i + len, j, 0, r.cost, { g: r.g, ph: [], pat: 'close', close: true }); continue; }
            relax(i + len, j + k, s, r.cost, { g: r.g, ph: phones.slice(j, j + k), pat: r.pat });
          }
          // irregular fallbacks: letter→phoneme, letter→silent
          if (j < P) relax(i + 1, j + 1, s, IRREGULAR_COST, { g: word[i], ph: [phones[j]], pat: 'irregular' });
          relax(i + 1, j, s, IRREGULAR_COST, { g: word[i], ph: [], pat: 'irregular' });
        }
        // a sound with no letter (rare: "one" W AH N)
        if (j < P) relax(i, j + 1, s, IRREGULAR_COST, { g: '', ph: [phones[j]], pat: 'irregular' });
      }
    }
  }
  const end = best[L][P][0];
  if (!end) return null;
  const segments = [];
  let node = end, at = [L, P, 0];
  while (node && node.prev) {
    segments.push(node.seg);
    at = node.prev;
    node = best[at[0]][at[1]][at[2]];
  }
  segments.reverse();
  // Give the closing silent e the pattern of the vowel that opened it.
  let open = null;
  for (const seg of segments) {
    if (seg.split) open = seg;
    if (seg.close && open) { seg.pat = open.pat; open = null; }
  }
  return { cost: end.cost, segments };
}

/** Index of the final 'e' that may close a split digraph (before an optional suffix). */
function lastE(word) {
  const m = word.match(/e(s|d|r|ly|ful|less|ness|ment|st)?$/);
  return m ? m.index : -1;
}

const CONSONANT = p => !isVowelPhoneme(p);

/**
 * Turn an alignment into the set of patterns a reader must know, adding the
 * word-shape patterns (blends, endings, longer words) that are about the
 * word as a whole rather than a single letter-sound.
 */
export function wordPatterns(word, segments, { isCompound } = {}) {
  const pats = new Set();
  for (const s of segments) if (s.pat !== 'close' && s.pat !== 'apostrophe') pats.add(s.pat);

  const phones = segments.flatMap(s => s.ph);
  const vowels = phones.filter(isVowelPhoneme).length;

  // Endings: -ed (2 syl "planted"), -es, -ing. Detected on the spelling.
  const endsIng = /ing$/.test(word) && segments.length >= 2 && segments[segments.length - 1].g === 'ng';
  if (endsIng && vowels >= 2) pats.add('ing');

  // Blends: two consonant sounds from separate graphemes at the word's edges.
  const core = trimInflection(segments);
  const onsetCons = [], codaCons = [];
  for (const s of core) { if (s.ph.length === 0) continue; if (s.ph.some(isVowelPhoneme)) break; onsetCons.push(s); }
  for (let q = core.length - 1; q >= 0; q--) { const s = core[q]; if (s.ph.length === 0) continue; if (s.ph.some(isVowelPhoneme)) break; codaCons.push(s); }
  const clusterSize = arr => arr.reduce((n, s) => n + s.ph.filter(CONSONANT).length, 0);
  const isSingleUnit = arr => arr.length === 1; // x = /ks/ or qu = /kw/ are taught as one unit
  if ((clusterSize(onsetCons) >= 2 && !isSingleUnit(onsetCons)) || (clusterSize(codaCons) >= 2 && !isSingleUnit(codaCons))) pats.add('blend');

  // Longer words. Compounds of two short known words are easier than true
  // multisyllable words, so they get their own (earlier) pattern.
  const inflectional = pats.has('ing') || pats.has('es') || (pats.has('ed') && vowels === 2 && /[td]ed$/.test(word));
  if (vowels >= 2 && !(inflectional && vowels === 2)) {
    if (isCompound && isCompound(word, phones, segments)) pats.add('compound');
    else pats.add('multi');
  }
  return pats;
}

function trimInflection(segments) {
  const s = segments.slice();
  const last = s[s.length - 1];
  if (last && (last.pat === 's' || last.pat === 's_z') && last.g === 's' && s.length > 2) s.pop();
  else if (last && last.pat === 'ed') s.pop();
  return s;
}


/** Highest step needed by a set of patterns (Infinity if any part is irregular). */
export function stepFor(patterns) {
  let max = 0;
  for (const p of patterns) {
    if (p === 'irregular') return Infinity;
    const st = PATTERN_STEP[p];
    if (st === undefined) return Infinity;
    if (st > max) max = st;
  }
  return max;
}

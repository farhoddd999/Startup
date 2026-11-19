// Hearth phonics model
// ---------------------------------------------------------------------------
// A structured-literacy scope & sequence (40 steps) plus the grapheme→phoneme
// correspondence (GPC) rules used to explain how any English word is spelled.
//
// Phonemes use ARPAbet as in the CMU Pronouncing Dictionary. A rule phoneme
// written without a stress digit ("AH") matches any stress; with a digit
// ("AH0") it matches only that stress. This lets us tell a stressed short-u
// ("sun" S AH1 N) apart from an unstressed schwa ("basket" … K AH0 T).
//
// Every rule belongs to a *pattern* (e.g. "sh", "a_e", "schwa"), and every
// pattern is introduced at one *step*. A word is decodable for a reader once
// every pattern it needs has been introduced. That simple contract powers
// story generation, story validation, hints, and the learner model.

/** The 40-step scope & sequence. `sounds` are pattern ids introduced at that step. */
export const STEPS = [
  { n: 1, title: 'm · s · t · short a', patterns: ['m', 's', 't', 'a_short'], words: ['am', 'at', 'sat', 'mat', 'Sam'] },
  { n: 2, title: 'p · n', patterns: ['p', 'n'], words: ['pan', 'nap', 'tap', 'man', 'pat'] },
  { n: 3, title: 'short i', patterns: ['i_short'], words: ['it', 'sit', 'pin', 'tip', 'in'] },
  { n: 4, title: 'c · d', patterns: ['c_k', 'd'], words: ['cat', 'can', 'dad', 'did', 'cap'] },
  { n: 5, title: 'short o', patterns: ['o_short'], words: ['on', 'not', 'pot', 'top', 'dot'] },
  { n: 6, title: 'g · b', patterns: ['g', 'b'], words: ['big', 'bag', 'dog', 'bat', 'dig'] },
  { n: 7, title: 'h · f', patterns: ['h', 'f'], words: ['hat', 'fan', 'hop', 'fit', 'fog'] },
  { n: 8, title: 'short e', patterns: ['e_short'], words: ['bed', 'ten', 'hen', 'pet', 'get'] },
  { n: 9, title: 'r · l', patterns: ['r', 'l'], words: ['red', 'rat', 'leg', 'lip', 'log'] },
  { n: 10, title: 'short u', patterns: ['u_short'], words: ['up', 'sun', 'cup', 'bug', 'fun'] },
  { n: 11, title: 'w · j · k · v', patterns: ['w', 'j', 'k', 'v'], words: ['wet', 'jet', 'kid', 'van', 'win'] },
  { n: 12, title: 'x · y · z · qu', patterns: ['x', 'y_cons', 'z', 'qu'], words: ['fox', 'box', 'yes', 'zip', 'quit'] },
  { n: 13, title: 'ff · ll · ss · ck · s as z', patterns: ['floss', 'ck', 's_z'], words: ['off', 'hill', 'kiss', 'duck', 'his'] },
  { n: 14, title: 'sh', patterns: ['sh'], words: ['ship', 'fish', 'shop', 'wish', 'shut'] },
  { n: 15, title: 'ch · tch', patterns: ['ch', 'tch'], words: ['chip', 'chop', 'much', 'catch', 'rich'] },
  { n: 16, title: 'th', patterns: ['th'], words: ['this', 'that', 'with', 'bath', 'moth'] },
  { n: 17, title: 'wh · ng · nk', patterns: ['wh', 'ng'], words: ['when', 'sing', 'ring', 'pink', 'think'] },
  { n: 18, title: 'blends & little compounds', patterns: ['blend', 'compound'], words: ['stop', 'frog', 'hand', 'jump', 'sunset'] },
  { n: 19, title: 'a_e (magic e)', patterns: ['a_e'], words: ['make', 'cake', 'name', 'game', 'gave'] },
  { n: 20, title: 'i_e', patterns: ['i_e'], words: ['time', 'bike', 'like', 'kite', 'ride'] },
  { n: 21, title: 'o_e · u_e · e_e · ve', patterns: ['o_e', 'u_e', 'e_e', 've'], words: ['home', 'bone', 'cute', 'these', 'have'] },
  { n: 22, title: 'open vowels (go · me · hi)', patterns: ['open'], words: ['go', 'me', 'she', 'hi', 'no'] },
  { n: 23, title: 'ee · ea', patterns: ['ee', 'ea'], words: ['see', 'tree', 'sea', 'eat', 'sleep'] },
  { n: 24, title: 'ai · ay', patterns: ['ai', 'ay'], words: ['rain', 'day', 'play', 'wait', 'tail'] },
  { n: 25, title: 'oa · ow · oe', patterns: ['oa', 'ow_long', 'oe'], words: ['boat', 'snow', 'toe', 'grow', 'coat'] },
  { n: 26, title: 'igh · y · ie', patterns: ['igh', 'y_long_i', 'ie'], words: ['night', 'light', 'my', 'fly', 'pie'] },
  { n: 27, title: 'ar', patterns: ['ar'], words: ['car', 'star', 'dark', 'far', 'park'] },
  { n: 28, title: 'or · ore', patterns: ['or'], words: ['for', 'horn', 'more', 'store', 'storm'] },
  { n: 29, title: 'er · ir · ur', patterns: ['er', 'ir', 'ur'], words: ['her', 'bird', 'fur', 'turn', 'girl'] },
  { n: 30, title: 'oo · ew · ue', patterns: ['oo_long', 'oo_short', 'ew', 'ue', 'u_oo'], words: ['moon', 'book', 'new', 'blue', 'look'] },
  { n: 31, title: 'ou · ow', patterns: ['ou', 'ow_out'], words: ['out', 'cloud', 'now', 'down', 'house'] },
  { n: 32, title: 'oi · oy', patterns: ['oi', 'oy'], words: ['coin', 'boy', 'toy', 'join', 'point'] },
  { n: 33, title: 'aw · au · all', patterns: ['aw', 'au', 'al'], words: ['saw', 'draw', 'ball', 'call', 'talk'] },
  { n: 34, title: 'endings: -ed · -es · -ing', patterns: ['ed', 'es', 'ing', 'doubling'], words: ['jumped', 'wishes', 'running', 'hopped', 'played'] },
  { n: 35, title: 'longer words & the lazy vowel', patterns: ['multi', 'schwa'], words: ['rabbit', 'basket', 'picnic', 'kitten', 'under'] },
  { n: 36, title: 'soft c · soft g · dge', patterns: ['c_s', 'g_j', 'dge', 'ce', 'ge'], words: ['city', 'face', 'page', 'bridge', 'large'] },
  { n: 37, title: '-le · y as in happy', patterns: ['le', 'y_long_e'], words: ['little', 'apple', 'happy', 'baby', 'candle'] },
  { n: 38, title: 'silent letters: kn · wr · mb', patterns: ['kn', 'wr', 'mb', 'gn', 'silent'], words: ['knee', 'know', 'write', 'lamb', 'sign'] },
  { n: 39, title: 'more vowel spellings', patterns: ['ph', 'ch_k', 'ea_short', 'o_as_u', 'wa', 'wor', 'are', 'ear', 'air', 'ere', 'ire', 'our', 'ou_alt', 'ey', 'eigh', 'ui', 'oul', 'ie_ee', 'y_i', 'i_ee', 'augh', 'ough', 'o_oo', 'se', 'gh', 'wh_h', 'oar', 'ure'], words: ['phone', 'head', 'son', 'want', 'bear'] },
  { n: 40, title: '-tion · -sion · -ture', patterns: ['tion', 'sion', 'ture'], words: ['nation', 'picture', 'vision', 'nature', 'action'] },
];

/** pattern id → step number */
export const PATTERN_STEP = Object.fromEntries(STEPS.flatMap(s => s.patterns.map(p => [p, s.n])));
export const MAX_STEP = STEPS.length;

/**
 * Parent-facing meaning of each pattern: a key word (spoken by text-to-speech)
 * and an emoji picture so the hint works for someone who cannot yet read it.
 */
export const PATTERN_INFO = {
  m: { key: 'moon', pic: '🌙', label: 'm' }, s: { key: 'sun', pic: '☀️', label: 's' }, t: { key: 'tent', pic: '⛺', label: 't' },
  a_short: { key: 'apple', pic: '🍎', label: 'a' }, p: { key: 'pig', pic: '🐷', label: 'p' }, n: { key: 'nest', pic: '🪺', label: 'n' },
  i_short: { key: 'itch', pic: '🦟', label: 'i' }, c_k: { key: 'cat', pic: '🐱', label: 'c' }, d: { key: 'dog', pic: '🐶', label: 'd' },
  o_short: { key: 'octopus', pic: '🐙', label: 'o' }, g: { key: 'goat', pic: '🐐', label: 'g' }, b: { key: 'bus', pic: '🚌', label: 'b' },
  h: { key: 'hat', pic: '🎩', label: 'h' }, f: { key: 'fish', pic: '🐟', label: 'f' }, e_short: { key: 'egg', pic: '🥚', label: 'e' },
  r: { key: 'rain', pic: '🌧️', label: 'r' }, l: { key: 'leaf', pic: '🍃', label: 'l' }, u_short: { key: 'umbrella', pic: '☂️', label: 'u' },
  w: { key: 'web', pic: '🕸️', label: 'w' }, j: { key: 'jam', pic: '🫙', label: 'j' }, k: { key: 'kite', pic: '🪁', label: 'k' },
  v: { key: 'van', pic: '🚐', label: 'v' }, x: { key: 'box', pic: '📦', label: 'x' }, y_cons: { key: 'yo-yo', pic: '🪀', label: 'y' },
  z: { key: 'zebra', pic: '🦓', label: 'z' }, qu: { key: 'queen', pic: '👑', label: 'qu' }, floss: { key: 'bell', pic: '🔔', label: 'll · ff · ss' },
  ck: { key: 'duck', pic: '🦆', label: 'ck' }, s_z: { key: 'his', pic: '👦', label: 's = z' }, sh: { key: 'ship', pic: '🚢', label: 'sh' },
  ch: { key: 'chair', pic: '🪑', label: 'ch' }, tch: { key: 'watch', pic: '⌚', label: 'tch' }, th: { key: 'thumb', pic: '👍', label: 'th' },
  wh: { key: 'whale', pic: '🐋', label: 'wh' }, ng: { key: 'ring', pic: '💍', label: 'ng' }, blend: { key: 'frog', pic: '🐸', label: 'blend' },
  compound: { key: 'sunset', pic: '🌅', label: 'two little words' }, a_e: { key: 'cake', pic: '🎂', label: 'a_e' }, i_e: { key: 'kite', pic: '🪁', label: 'i_e' },
  o_e: { key: 'bone', pic: '🦴', label: 'o_e' }, u_e: { key: 'cube', pic: '🧊', label: 'u_e' }, e_e: { key: 'these', pic: '👉', label: 'e_e' },
  ve: { key: 'five', pic: '🖐️', label: 've' }, open: { key: 'go', pic: '🟢', label: 'long vowel' }, ee: { key: 'tree', pic: '🌳', label: 'ee' },
  ea: { key: 'leaf', pic: '🍃', label: 'ea' }, ai: { key: 'rain', pic: '🌧️', label: 'ai' }, ay: { key: 'play', pic: '🛝', label: 'ay' },
  oa: { key: 'boat', pic: '⛵', label: 'oa' }, ow_long: { key: 'snow', pic: '❄️', label: 'ow' }, oe: { key: 'toe', pic: '🦶', label: 'oe' },
  igh: { key: 'night', pic: '🌃', label: 'igh' }, y_long_i: { key: 'fly', pic: '🪰', label: 'y' }, ie: { key: 'pie', pic: '🥧', label: 'ie' },
  ar: { key: 'star', pic: '⭐', label: 'ar' }, or: { key: 'corn', pic: '🌽', label: 'or' }, er: { key: 'her', pic: '👩', label: 'er' },
  ir: { key: 'bird', pic: '🐦', label: 'ir' }, ur: { key: 'turtle', pic: '🐢', label: 'ur' }, oo_long: { key: 'moon', pic: '🌙', label: 'oo' },
  oo_short: { key: 'book', pic: '📖', label: 'oo' }, ew: { key: 'new', pic: '✨', label: 'ew' }, ue: { key: 'blue', pic: '🔵', label: 'ue' },
  u_oo: { key: 'push', pic: '🫸', label: 'u' }, ou: { key: 'cloud', pic: '☁️', label: 'ou' }, ow_out: { key: 'cow', pic: '🐄', label: 'ow' },
  oi: { key: 'coin', pic: '🪙', label: 'oi' }, oy: { key: 'boy', pic: '👦', label: 'oy' }, aw: { key: 'saw', pic: '🪚', label: 'aw' },
  au: { key: 'autumn', pic: '🍂', label: 'au' }, al: { key: 'ball', pic: '⚽', label: 'al' }, ed: { key: 'jumped', pic: '🦘', label: '-ed' },
  es: { key: 'wishes', pic: '🌠', label: '-es' }, ing: { key: 'sing', pic: '🎤', label: '-ing' }, doubling: { key: 'running', pic: '🏃', label: 'double letter' },
  multi: { key: 'rabbit', pic: '🐇', label: 'longer word' }, schwa: { key: 'banana', pic: '🍌', label: 'lazy vowel' }, c_s: { key: 'city', pic: '🏙️', label: 'soft c' },
  g_j: { key: 'giraffe', pic: '🦒', label: 'soft g' }, dge: { key: 'bridge', pic: '🌉', label: 'dge' }, ce: { key: 'dance', pic: '💃', label: 'ce' },
  ge: { key: 'orange', pic: '🍊', label: 'ge' }, le: { key: 'apple', pic: '🍎', label: '-le' }, y_long_e: { key: 'baby', pic: '👶', label: 'y' },
  kn: { key: 'knee', pic: '🦵', label: 'kn' }, wr: { key: 'write', pic: '✍️', label: 'wr' }, mb: { key: 'lamb', pic: '🐑', label: 'mb' },
  gn: { key: 'sign', pic: '🪧', label: 'gn' }, silent: { key: 'listen', pic: '👂', label: 'quiet letter' }, ph: { key: 'phone', pic: '📱', label: 'ph' }, ch_k: { key: 'school', pic: '🏫', label: 'ch' },
  ea_short: { key: 'bread', pic: '🍞', label: 'ea' }, o_as_u: { key: 'mother', pic: '🤱', label: 'o' }, wa: { key: 'water', pic: '💧', label: 'wa' },
  wor: { key: 'worm', pic: '🪱', label: 'or' }, are: { key: 'square', pic: '🟥', label: 'are' }, ear: { key: 'ear', pic: '👂', label: 'ear' },
  air: { key: 'chair', pic: '🪑', label: 'air' }, ere: { key: 'here', pic: '📍', label: 'ere' }, ire: { key: 'fire', pic: '🔥', label: 'ire' },
  our: { key: 'four', pic: '4️⃣', label: 'our' }, ou_alt: { key: 'soup', pic: '🍲', label: 'ou' }, ey: { key: 'key', pic: '🔑', label: 'ey' },
  eigh: { key: 'eight', pic: '8️⃣', label: 'eigh' }, ui: { key: 'fruit', pic: '🍉', label: 'ui' }, oul: { key: 'could', pic: '🤔', label: 'oul' },
  ie_ee: { key: 'field', pic: '🌾', label: 'ie' }, y_i: { key: 'gym', pic: '🏋️', label: 'y' }, i_ee: { key: 'pizza', pic: '🍕', label: 'i' },
  augh: { key: 'caught', pic: '🧤', label: 'augh' }, ough: { key: 'thought', pic: '💭', label: 'ough' }, o_oo: { key: 'to', pic: '➡️', label: 'o' },
  se: { key: 'house', pic: '🏠', label: 'se' }, gh: { key: 'ghost', pic: '👻', label: 'gh' }, wh_h: { key: 'who', pic: '❓', label: 'wh' },
  oar: { key: 'roar', pic: '🦁', label: 'oar' }, ure: { key: 'sure', pic: '👌', label: 'ure' }, tion: { key: 'station', pic: '🚉', label: '-tion' },
  sion: { key: 'vision', pic: '👓', label: '-sion' }, ture: { key: 'picture', pic: '🖼️', label: '-ture' }, irregular: { key: '', pic: '💛', label: 'heart part' },
};

const VOWEL_LETTERS = new Set(['a', 'e', 'i', 'o', 'u']);
const isVowelLetter = ch => VOWEL_LETTERS.has(ch);
const SPLIT_SUFFIXES = new Set(['', 's', 'd', 'r', 'ly', 'ful', 'less', 'ness', 'ment', 'st']);

// ---- context predicates -----------------------------------------------------
const nextIsSoftener = (w, i, len) => /[eiy]/.test(w[i + len] || '');
const atEnd = (w, i, len) => i + len === w.length;
const atEndOrSuffix = (w, i, len) => /^(s|d|r|ly)?$/.test(w.slice(i + len));
const notStart = (w, i) => i > 0;
const beforeVowelLetter = (w, i, len) => isVowelLetter(w[i + len] || '');
const prevIsW = (w, i) => w[i - 1] === 'w' || (w[i - 1] === 'u' && w[i - 2] === 'q');
const nextIsL = (w, i, len) => w[i + len] === 'l';
const nextIsKG = (w, i, len) => /[kgcq]/.test(w[i + len] || '') || w.substr(i + len, 1) === 'x';
const afterConsonantAtEnd = (w, i, len) => i > 0 && !isVowelLetter(w[i - 1]) && atEndOrSuffix(w, i, len);

/** Is the vowel at i the first half of a split digraph (a_e, i_e …)? */
function splitAhead(w, i) {
  let k = i + 1;
  let cons = 0;
  while (k < w.length && !isVowelLetter(w[k]) && w[k] !== 'y' && cons < 2) { k++; cons++; }
  if (cons === 0 || w[k] !== 'e') return false;
  return SPLIT_SUFFIXES.has(w.slice(k + 1));
}

/**
 * GPC rules: [grapheme, phonemes, pattern, cost, context?, flags?]
 * flags: 'split' (opens a split digraph), 'close' (the silent e of one).
 */
const R = [
  // single consonants
  ['b', 'B', 'b', 1], ['c', 'K', 'c_k', 1], ['c', 'S', 'c_s', 1.2, nextIsSoftener], ['d', 'D', 'd', 1],
  ['f', 'F', 'f', 1], ['g', 'G', 'g', 1], ['g', 'JH', 'g_j', 1.2, nextIsSoftener], ['h', 'HH', 'h', 1],
  ['j', 'JH', 'j', 1], ['k', 'K', 'k', 1], ['l', 'L', 'l', 1], ['m', 'M', 'm', 1], ['n', 'N', 'n', 1],
  ['n', 'NG', 'ng', 1.2, nextIsKG], ['p', 'P', 'p', 1], ['r', 'R', 'r', 1], ['s', 'S', 's', 1],
  ['s', 'Z', 's_z', 1.1], ['t', 'T', 't', 1], ['v', 'V', 'v', 1], ['w', 'W', 'w', 1],
  ['x', 'K S', 'x', 1], ['x', 'G Z', 'x', 1.5], ['x', 'K SH', 'x', 2], ['y', 'Y', 'y_cons', 1, beforeVowelLetter], ['z', 'Z', 'z', 1],
  ['qu', 'K W', 'qu', 1], ['q', 'K', 'qu', 1.5],
  // doubles
  ['ff', 'F', 'floss', 1], ['ll', 'L', 'floss', 1], ['ss', 'S', 'floss', 1], ['zz', 'Z', 'floss', 1], ['ss', 'Z', 'floss', 1.5],
  ['ck', 'K', 'ck', 1], ['bb', 'B', 'doubling', 1], ['dd', 'D', 'doubling', 1], ['gg', 'G', 'doubling', 1],
  ['mm', 'M', 'doubling', 1], ['nn', 'N', 'doubling', 1], ['pp', 'P', 'doubling', 1], ['rr', 'R', 'doubling', 1],
  ['tt', 'T', 'doubling', 1], ['cc', 'K', 'doubling', 1.5], ['cc', 'K S', 'doubling', 2],
  // digraphs & trigraphs
  ['sh', 'SH', 'sh', 1], ['ch', 'CH', 'ch', 1], ['tch', 'CH', 'tch', 1], ['th', 'TH', 'th', 1], ['th', 'DH', 'th', 1],
  ['wh', 'W', 'wh', 1], ['wh', 'HH', 'wh_h', 3], ['ng', 'NG', 'ng', 1], ['ng', 'NG G', 'ng', 1.5], ['ph', 'F', 'ph', 1],
  ['ch', 'K', 'ch_k', 2], ['ch', 'SH', 'ch_k', 3], ['gh', 'G', 'gh', 2], ['gh', 'F', 'gh', 3], ['kn', 'N', 'kn', 1],
  ['wr', 'R', 'wr', 1], ['mb', 'M', 'mb', 1, atEndOrSuffix], ['gn', 'N', 'gn', 1.5], ['dge', 'JH', 'dge', 1],
  ['ce', 'S', 'ce', 1.3, atEndOrSuffix], ['ge', 'JH', 'ge', 1.3, atEndOrSuffix], ['se', 'S', 'se', 2, atEndOrSuffix],
  ['se', 'Z', 'se', 2, atEndOrSuffix], ['ve', 'V', 've', 1.3, atEndOrSuffix],
  // short vowels (stressed u only, so schwa is told apart)
  ['a', 'AE', 'a_short', 1], ['e', 'EH', 'e_short', 1], ['i', 'IH', 'i_short', 1], ['o', 'AA', 'o_short', 1],
  ['o', 'AO', 'o_short', 1], ['u', 'AH1', 'u_short', 1], ['u', 'AH2', 'u_short', 1], ['y', 'IH', 'y_i', 2.5, notStart],
  // the lazy vowel (schwa) in unstressed syllables
  ['a', 'AH0', 'schwa', 1.2], ['e', 'AH0', 'schwa', 1.2], ['e', 'IH0', 'schwa', 1.4], ['i', 'AH0', 'schwa', 1.2],
  ['o', 'AH0', 'schwa', 1.2], ['u', 'AH0', 'schwa', 1.2], ['a', 'IH0', 'schwa', 2], ['ar', 'ER0', 'schwa', 1.6], ['or', 'ER0', 'schwa', 1.6],
  ['el', 'AH0 L', 'schwa', 1.6],
  // split digraphs: vowel opens, final e closes
  ['a', 'EY', 'a_e', 1, splitAhead, 'split'], ['e', 'IY', 'e_e', 1, splitAhead, 'split'], ['i', 'AY', 'i_e', 1, splitAhead, 'split'],
  ['o', 'OW', 'o_e', 1, splitAhead, 'split'], ['u', 'UW', 'u_e', 1, splitAhead, 'split'], ['u', 'Y UW', 'u_e', 1, splitAhead, 'split'],
  ['e', '', 'close', 0, null, 'close'],
  // open-syllable long vowels (go, me, hi, baby, music)
  ['a', 'EY', 'open', 1.6], ['e', 'IY', 'open', 1.6], ['i', 'AY', 'open', 1.6], ['o', 'OW', 'open', 1.6],
  ['u', 'UW', 'open', 1.6], ['u', 'Y UW', 'open', 1.6],
  // vowel teams
  ['ee', 'IY', 'ee', 1], ['ea', 'IY', 'ea', 1], ['ea', 'EH', 'ea_short', 2], ['ea', 'EY', 'ea_short', 4],
  ['ai', 'EY', 'ai', 1], ['ay', 'EY', 'ay', 1], ['oa', 'OW', 'oa', 1], ['ow', 'OW', 'ow_long', 1], ['oe', 'OW', 'oe', 1],
  ['oe', 'UW', 'oe', 3], ['igh', 'AY', 'igh', 1], ['y', 'AY', 'y_long_i', 1.2, notStart], ['ie', 'AY', 'ie', 1], ['ie', 'IY', 'ie_ee', 2],
  ['oo', 'UW', 'oo_long', 1], ['oo', 'UH', 'oo_short', 1], ['ew', 'UW', 'ew', 1], ['ew', 'Y UW', 'ew', 1], ['ue', 'UW', 'ue', 1],
  ['ue', 'Y UW', 'ue', 1], ['u', 'UH', 'u_oo', 2], ['ou', 'AW', 'ou', 1], ['ow', 'AW', 'ow_out', 1], ['ou', 'UW', 'ou_alt', 2],
  ['ou', 'AH', 'ou_alt', 2.5], ['oi', 'OY', 'oi', 1], ['oy', 'OY', 'oy', 1], ['aw', 'AO', 'aw', 1], ['aw', 'AA', 'aw', 1],
  ['au', 'AO', 'au', 1], ['au', 'AA', 'au', 1], ['a', 'AO', 'al', 1.2, nextIsL], ['a', 'AA', 'al', 1.4, nextIsL],
  ['alk', 'AO K', 'al', 1], ['y', 'IY', 'y_long_e', 1.2, notStart], ['ey', 'IY', 'y_long_e', 1.5], ['ey', 'EY', 'ey', 2],
  ['ei', 'EY', 'ey', 2.5], ['ei', 'IY', 'ie_ee', 2.5], ['eigh', 'EY', 'eigh', 2], ['ui', 'UW', 'ui', 2], ['oul', 'UH', 'oul', 2],
  ['augh', 'AO', 'augh', 2], ['augh', 'AA', 'augh', 2], ['ough', 'AO', 'ough', 2.5], ['ough', 'AA', 'ough', 2.5],
  ['ough', 'OW', 'ough', 3], ['ough', 'UW', 'ough', 3], ['ough', 'AH F', 'ough', 3], ['ough', 'AW', 'ough', 3],
  ['i', 'IY', 'i_ee', 3], ['o', 'AH1', 'o_as_u', 2], ['o', 'AH2', 'o_as_u', 2], ['o', 'UW', 'o_oo', 3], ['o', 'UH', 'o_oo', 3],
  ['a', 'AA', 'wa', 1.5, prevIsW], ['a', 'AO', 'wa', 1.5, prevIsW], ['a', 'AH1', 'wa', 1.8, prevIsW],
  // r-controlled
  ['ar', 'AA R', 'ar', 1], ['or', 'AO R', 'or', 1], ['ore', 'AO R', 'or', 1, atEndOrSuffix], ['oar', 'AO R', 'oar', 1.5],
  ['our', 'AO R', 'our', 2], ['our', 'AW ER', 'our', 2], ['our', 'AW R', 'our', 2], ['er', 'ER', 'er', 1], ['ir', 'ER', 'ir', 1],
  ['ur', 'ER', 'ur', 1], ['or', 'ER', 'wor', 1.5, prevIsW], ['ear', 'ER', 'ear', 2], ['are', 'EH R', 'are', 1.5],
  ['ar', 'EH R', 'are', 2.5], ['air', 'EH R', 'air', 1.5], ['ear', 'EH R', 'ear', 2], ['ear', 'IY R', 'ear', 1.5], ['ear', 'IH R', 'ear', 1.5],
  ['eer', 'IY R', 'ear', 1.5], ['eer', 'IH R', 'ear', 1.5], ['ere', 'IY R', 'ere', 1.5], ['ere', 'IH R', 'ere', 1.5], ['ere', 'EH R', 'ere', 1.5],
  ['ire', 'AY ER', 'ire', 1.5], ['ire', 'AY R', 'ire', 1.5], ['ure', 'Y UH R', 'ure', 2], ['ure', 'UH R', 'ure', 2], ['ure', 'ER', 'ure', 2],
  ['ure', 'Y ER', 'ure', 2], ['ere', 'ER', 'ere', 2], ['eir', 'EH R', 'air', 2], ['oor', 'AO R', 'oar', 1.5], ['oor', 'UH R', 'oar', 2],
  ['urr', 'ER', 'ur', 1.2], ['err', 'ER', 'er', 1.3], ['irr', 'ER', 'ir', 1.3],
  // silent letters
  ['st', 'S', 'silent', 2], ['alf', 'AE F', 'silent', 2], ['alm', 'AA M', 'silent', 2], ['ould', 'UH D', 'oul', 2], ['bt', 'T', 'silent', 2],
  // endings & suffixes
  ['ed', 'D', 'ed', 1, atEnd], ['ed', 'T', 'ed', 1, atEnd], ['ed', 'IH D', 'ed', 1, atEnd], ['ed', 'AH D', 'ed', 1, atEnd],
  ['es', 'IH Z', 'es', 1, atEnd], ['es', 'AH Z', 'es', 1, atEnd], ['le', 'AH L', 'le', 1, afterConsonantAtEnd],
  ['tion', 'SH AH N', 'tion', 1], ['sion', 'ZH AH N', 'sion', 1], ['sion', 'SH AH N', 'sion', 1], ['ture', 'CH ER', 'ture', 1],
  ['ci', 'SH', 'tion', 2], ['ti', 'SH', 'tion', 2], ['s', 'ZH', 'sion', 2.5], ['s', 'SH', 'irregular', 6],
  ["'", '', 'apostrophe', 0],
].map(([g, p, pat, cost, ctx, flag]) => ({
  g, ph: p ? p.split(' ') : [], pat, cost, ctx: ctx || null, flag: flag || null,
}));

/** Rules indexed by first letter for speed. */
export const RULES_BY_LETTER = R.reduce((m, r) => { (m[r.g[0]] ||= []).push(r); return m; }, {});
export const RULES = R;

export const VOWEL_PHONEMES = new Set(['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW']);
export const stripStress = p => p.replace(/[0-9]/g, '');
export const isVowelPhoneme = p => VOWEL_PHONEMES.has(stripStress(p));

/**
 * Heart words: high-frequency words with a tricky part, taught by sight
 * before the reader has every pattern they need. `step` = when we introduce it.
 */
export const HEART_WORDS = {
  1: ['a', 'the', 'I', 'and', 'is', 'to'],
  3: ['was', 'his', 'has', 'of', 'said', 'as'],
  5: ['you', 'he', 'she', 'we', 'me', 'be', 'go', 'no', 'so', 'do'],
  7: ['my', 'by', 'are', 'they', 'what', 'here', 'there', 'where', 'for', 'or'],
  9: ['one', 'two', 'come', 'some', 'your', 'have', 'give', 'love', 'live', 'put', 'want', 'who', 'all', 'from'],
  11: ['look', 'good', 'could', 'would', 'should', 'again', 'does', 'goes', 'very', 'every', 'only', 'once', 'friend', 'now', 'how', 'down', 'too'],
  13: ['little', 'people', 'any', 'many', 'water', 'over', 'after', 'been', 'into', 'our', 'out', 'night', 'day', 'oh', 'yes'],
};
export const HEART_WORD_STEP = Object.fromEntries(
  Object.entries(HEART_WORDS).flatMap(([step, ws]) => ws.map(w => [w.toLowerCase(), Number(step)])),
);

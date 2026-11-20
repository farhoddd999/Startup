// Decodability checker: the Hearth phonics engine, running in the browser.
import { Lexicon } from '/product/engine/lexicon.js';
import { analyzeText, chunksFor } from '/product/engine/decodable.js';
import { STEPS, PATTERN_INFO, PATTERN_STEP, stripStress } from '/product/engine/phonics.js';

const root = document.querySelector('[data-checker]');
const $ = s => root.querySelector(s);
const ck = k => root.querySelector(`[data-ck="${k}"]`);
const IPA = { AA: 'ɑ', AE: 'æ', AH: 'ʌ', AO: 'ɔ', AW: 'aʊ', AY: 'aɪ', B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', EH: 'ɛ', ER: 'ɝ', EY: 'eɪ', F: 'f', G: 'g', HH: 'h', IH: 'ɪ', IY: 'i', JH: 'dʒ', K: 'k', L: 'l', M: 'm', N: 'n', NG: 'ŋ', OW: 'oʊ', OY: 'ɔɪ', P: 'p', R: 'r', S: 's', SH: 'ʃ', T: 't', TH: 'θ', UH: 'ʊ', UW: 'u', V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ' };
const ipa = ph => ph.map(p => (p === 'AH0' ? 'ə' : p === 'ER0' ? 'ɚ' : IPA[stripStress(p)] || p)).join('');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SAMPLES = {
  hearth: 'A fish pops up. It is a red fish. "I am a wish fish," said the fish. "You get a wish!"',
  note: 'Dear families, picture day is next Thursday. Please return the permission slip and send a healthy snack with your child.',
  label: 'Take one tablet by mouth twice daily with food. Do not exceed the recommended dose.',
  classic: 'The very hungry caterpillar ate through one piece of chocolate cake, one ice-cream cone, one pickle, and one slice of Swiss cheese.',
};

let lx = null;
const text = $('#ckText'), step = $('#ckStep'), names = $('#ckNames');
text.value = SAMPLES.hearth;
root.querySelectorAll('[data-sample]').forEach(b => b.addEventListener('click', () => { text.value = SAMPLES[b.dataset.sample]; run(); }));
[text, step, names].forEach(i => i.addEventListener('input', run));

function known() { return names.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).flatMap(s => s.split(/\s+/)); }

function run() {
  const st = +step.value;
  ck('stepNum').textContent = st;
  ck('stepTitle').textContent = `step ${st}: ${STEPS[st - 1].title}`;
  if (!lx) return;
  const r = analyzeText(text.value.slice(0, 4000), lx, { step: st, known: known() });
  const out = ck('out');
  out.innerHTML = '';
  for (const tok of r.tokens) {
    if (tok.t !== 'w') { out.append(tok.text); continue; }
    const b = document.createElement('button');
    b.className = `xw ${tok.status}`;
    b.textContent = tok.text;
    b.title = { decodable: 'They can sound this out', focus: 'Uses the new sound', heart: 'Heart word', name: 'Family word', tricky: 'Not yet' }[tok.status];
    b.addEventListener('click', () => detail(tok, st));
    out.append(b);
  }
  const c = r.counts;
  const pct = c.words ? Math.round(((c.words - c.tricky) / c.words) * 100) : 100;
  ck('stats').innerHTML = `<div><b>${pct}%</b><span>they could read</span></div><div><b>${c.decodable + c.focus}</b><span>they can sound out</span></div><div><b>${c.heart}</b><span>heart words</span></div><div><b>${c.tricky}</b><span>not yet</span></div>`;
}

function detail(tok, st) {
  const d = ck('detail');
  if (tok.status === 'name') { d.innerHTML = `<h3 style="font-family:var(--story)">${esc(tok.text)}</h3><p class="muted">A family word. The parent already knows it, so it always counts as readable.</p>`; return; }
  const a = lx.analyze(tok.norm);
  const chunks = chunksFor(tok.text, lx);
  const rows = a.segments.filter(s => s.g || s.ph.length).map(s => {
    const info = PATTERN_INFO[s.pat] || {};
    const ps = PATTERN_STEP[s.pat];
    const cls = s.pat === 'irregular' ? 'irr' : ps && ps > st ? 'late' : '';
    return `<tr class="${cls}"><td class="g">${esc(s.g || '·')}</td><td class="p">/${ipa(s.ph) || '∅'}/</td><td>${esc(info.label || s.pat)} ${info.pic || ''}</td><td>${s.pat === 'irregular' ? 'by heart' : s.pat === 'close' ? '' : `step ${ps}`}</td></tr>`;
  }).join('');
  const verdict = tok.status === 'tricky'
    ? (a.decodeStep === Infinity ? 'Not yet. Part of this word doesn’t follow the usual rules, so Hearth teaches it as a heart word instead.' : `Not yet. They’ll be able to sound it out at step ${a.decodeStep} (${STEPS[a.decodeStep - 1]?.title}).`)
    : tok.status === 'heart' ? `A heart word. They learn this one by sight, at step ${a.heartStep}.`
    : tok.status === 'focus' ? 'This one uses the new sound they’re learning right now.'
    : 'They can sound this one out.';
  d.innerHTML = `<h3 style="font-family:var(--story);font-size:32px">${chunks.map(c => `<span class="chunk">${esc(c.g)}</span>`).join('')}</h3>
    <p class="muted small" style="margin:6px 0 10px">/${ipa(a.phones)}/</p>
    <div class="table-wrap"><table class="seg-table"><thead><tr><th>Letters</th><th>Sound</th><th>Pattern</th><th>Taught</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="verdict">${verdict}</p>`;
}

run();
fetch('/product/data/lexicon.json').then(r => r.json()).then(data => { lx = new Lexicon(data); run(); }).catch(() => {
  ck('stats').innerHTML = '<div><b>!</b><span>The dictionary didn’t load. Please check your connection and refresh the page.</span></div>';
});

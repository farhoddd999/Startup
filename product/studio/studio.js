import { Lexicon } from '../engine/lexicon.js';
import { analyzeText, validateStory, chunksFor } from '../engine/decodable.js';
import { personalize } from '../engine/text.js';
import { STEPS, PATTERN_INFO, PATTERN_STEP, stripStress } from '../engine/phonics.js';
import { STORIES } from '../data/stories.js';
import { renderScene } from '../js/art.js';

const $ = s => document.querySelector(s);
const IPA = { AA: 'ɑ', AE: 'æ', AH: 'ʌ', AO: 'ɔ', AW: 'aʊ', AY: 'aɪ', B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', EH: 'ɛ', ER: 'ɝ', EY: 'eɪ', F: 'f', G: 'g', HH: 'h', IH: 'ɪ', IY: 'i', JH: 'dʒ', K: 'k', L: 'l', M: 'm', N: 'n', NG: 'ŋ', OW: 'oʊ', OY: 'ɔɪ', P: 'p', R: 'r', S: 's', SH: 'ʃ', T: 't', TH: 'θ', UH: 'ʊ', UW: 'u', V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ' };
const ipa = ph => ph.map(p => (p === 'AH0' ? 'ə' : p === 'ER0' ? 'ɚ' : IPA[stripStress(p)] || p)).join('');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const SAMPLES = {
  classic: 'The very hungry caterpillar ate through one piece of chocolate cake, one ice-cream cone, one pickle, and one slice of Swiss cheese.',
  hearth: 'A fish pops up. It is a red fish. "I am a wish fish," said the fish. "You get a wish!"',
  note: 'Dear families, picture day is next Thursday. Please return the permission slip and send a healthy snack with your child.',
  label: 'Take one tablet by mouth twice daily with food. Do not exceed the recommended dose.',
};

let lx;
async function boot() {
  lx = new Lexicon(await (await fetch('../data/lexicon.json')).json());
  // tabs
  document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.id === b.dataset.tab));
    if (b.dataset.tab === 'library') renderLibrary();
  });
  $('#text').value = SAMPLES.hearth;
  document.querySelectorAll('[data-sample]').forEach(b => b.onclick = () => { $('#text').value = SAMPLES[b.dataset.sample]; xray(); });
  ['#step', '#names', '#text'].forEach(s => $(s).addEventListener('input', xray));
  xray();
  setupWriter();
}

function names() { return $('#names').value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).flatMap(s => s.split(/\s+/)); }

function xray() {
  const step = +$('#step').value;
  $('#stepNum').textContent = step;
  $('#stepTitle').textContent = `step ${step}: ${STEPS[step - 1].title}`;
  const r = analyzeText($('#text').value, lx, { step, known: names() });
  const out = $('#xrayText');
  out.innerHTML = '';
  for (const tok of r.tokens) {
    if (tok.t !== 'w') { out.append(tok.text); continue; }
    const span = document.createElement('button');
    span.className = `xw ${tok.status}`;
    span.textContent = tok.text;
    span.title = tok.status;
    span.onclick = () => detail(tok, step);
    out.append(span);
  }
  const c = r.counts;
  const pct = c.words ? Math.round(((c.words - c.tricky) / c.words) * 100) : 100;
  $('#stats').innerHTML = `<div class="stat"><b>${pct}%</b><span>readable for this parent</span></div><div class="stat"><b>${c.decodable + c.focus}</b><span>can sound out</span></div><div class="stat"><b>${c.heart}</b><span>heart words</span></div><div class="stat"><b>${c.tricky}</b><span>not yet</span></div>`;
}

function detail(tok, step) {
  const d = $('#detail');
  if (tok.status === 'name') { d.innerHTML = `<h3>${esc(tok.text)}</h3><p>A family word. The parent knows it, so it is always readable and never hinted.</p>`; return; }
  const a = lx.analyze(tok.norm);
  const chunks = chunksFor(tok.text, lx);
  const rows = a.segments.filter(s => s.g || s.ph.length).map(s => {
    const info = PATTERN_INFO[s.pat] || {};
    const st = PATTERN_STEP[s.pat];
    const late = st && st > step;
    return `<tr class="${s.pat === 'irregular' ? 'irr' : late ? 'late' : ''}"><td class="g">${esc(s.g || '·')}</td><td class="p">/${ipa(s.ph) || '∅'}/</td><td>${esc(info.label || s.pat)} ${info.pic || ''}</td><td>${s.pat === 'irregular' ? 'learned by heart' : s.pat === 'close' ? '' : `step ${st}`}</td></tr>`;
  }).join('');
  const shape = a.patterns.filter(p => ['blend', 'compound', 'multi', 'ing'].includes(p));
  const verdict = tok.status === 'tricky'
    ? `Not readable yet. ${a.decodeStep === Infinity ? 'It has an irregular part, so Hearth teaches it as a heart word.' : `It becomes decodable at step ${a.decodeStep}: ${STEPS[a.decodeStep - 1]?.title}.`}`
    : tok.status === 'heart' ? `A heart word, taught by sight at step ${a.heartStep}. It is fully decodable from step ${a.decodeStep === Infinity ? 'never (irregular)' : a.decodeStep}.`
    : tok.status === 'focus' ? 'Uses the sound this parent is learning now. Tonight\'s practice will include words like this.'
    : 'This parent can sound it out.';
  d.innerHTML = `<h3>${chunks.map(c => `<span class="chunk">${esc(c.g)}</span>`).join('')}</h3>
    <p class="muted">/${ipa(a.phones)}/ · ${a.patterns.length} patterns${shape.length ? ` · word shape: ${shape.join(', ')}` : ''}</p>
    <table class="seg"><thead><tr><th>letters</th><th>sound</th><th>pattern</th><th>taught</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="verdict ${tok.status}">${verdict}</p>`;
}

function renderLibrary() {
  const fam = { childName: 'Maya', grownup: 'Mama' };
  const rows = STORIES.slice().sort((a, b) => a.step - b.step).map(s => {
    const pages = [{ text: personalize(s.title, fam) }, ...s.pages.map(p => ({ text: personalize(p.text, fam) }))];
    const v = validateStory({ pages }, lx, { step: s.step, known: ['maya', 'mama'] });
    const total = v.words;
    const readable = total - v.problems.length;
    return `<tr><td><div class="mini-art">${renderScene(s.cover, {})}</div></td><td><b>${esc(personalize(s.title, fam))}</b><br><span class="muted small">${s.pages.length} pages · ${s.theme.join(', ')}</span></td><td>${s.step}<br><span class="muted small">${esc(STEPS[s.step - 1].title)}</span></td><td>${total}</td><td>${v.ok ? '<span class="ok">✓ 100%</span>' : `<span class="bad">${Math.round((readable / total) * 100)}%</span>`}</td><td class="small">${esc(v.focusWords.slice(0, 6).join(', '))}</td></tr>`;
  }).join('');
  $('#libTable').innerHTML = `<thead><tr><th></th><th>Story</th><th>Step</th><th>Words</th><th>Readable at step</th><th>Practises</th></tr></thead><tbody>${rows}</tbody>`;
}

async function setupWriter() {
  const sel = $('#wStep');
  sel.innerHTML = STEPS.map(s => `<option value="${s.n}" ${s.n === 14 ? 'selected' : ''}>Step ${s.n}: ${esc(s.title)}</option>`).join('');
  let ready = false;
  try { ready = (await (await fetch('../api/story')).json()).ready; } catch { /* static hosting */ }
  $('#engineState').textContent = ready ? 'Story engine: connected (Claude).' : 'Story engine offline. Run the Hearth server with ANTHROPIC_API_KEY set to write live stories.';
  $('#writeForm').onsubmit = async e => {
    e.preventDefault();
    const out = $('#writeOut');
    const body = { step: +sel.value, childName: $('#wChild').value.trim(), grownup: $('#wGrown').value.trim(), interests: $('#wLoves').value.split(',').map(s => s.trim()).filter(Boolean), avoid: STORIES.map(s => s.title) };
    out.innerHTML = '<p class="muted">Writing… Claude drafts, Hearth checks every word, Claude revises.</p>';
    try {
      const res = await fetch('../api/story', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      showStory(await res.json(), body);
    } catch (err) {
      out.innerHTML = `<p class="bad">${esc(err.message)}</p>`;
    }
  };
}

function showStory(story, body) {
  const fam = { childName: body.childName, grownup: body.grownup };
  const known = [body.childName, body.grownup].map(x => x.toLowerCase());
  const v = validateStory({ pages: story.pages.map(p => ({ text: personalize(p.text, fam) })) }, lx, { step: story.step, known });
  $('#writeOut').innerHTML = `<h2>${esc(personalize(story.title, fam))}</h2><p class="${v.ok ? 'ok' : 'bad'}">${v.ok ? '✓ Every word readable at step ' + story.step : v.problems.length + ' words need attention'} · ${v.words} words · practises: ${esc(v.focusWords.slice(0, 6).join(', '))}</p>` +
    story.pages.map((p, i) => `<div class="gen-page"><div class="mini-art wide">${renderScene({ bg: p.scene.bg, items: p.scene.items }, {})}</div><div><p class="gen-text">${esc(personalize(p.text, fam))}</p><p class="muted small">💬 ${esc(personalize(p.talk, fam))}</p></div></div>`).join('');
}

boot();

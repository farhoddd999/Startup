// Story library with a page-by-page reader. Stories and art come straight from the app.
import { STORIES } from '/product/data/stories.js';
import { renderScene } from '/product/js/art.js';
import { personalize, tokenize } from '/product/engine/text.js';

const LOOK = { childSkin: 2, childHair: 'curls', childHairColor: 0, grownupSkin: 2, grownupHair: 'long', grownupHairColor: 0 };
const grid = document.querySelector('[data-stories]');
const dlg = document.querySelector('dialog.reader');
const r = k => dlg.querySelector(`[data-r="${k}"]`);
const childIn = document.getElementById('stChild'), grownIn = document.getElementById('stGrown');
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };
childIn.value = store.get('hearth.site.child') || childIn.value;
grownIn.value = store.get('hearth.site.grownup') || grownIn.value;
const clean = s => s.replace(/[^\p{L}\p{M}' -]/gu, '').trim();
const fam = () => ({ childName: clean(childIn.value) || 'Mateo', grownup: clean(grownIn.value) || 'Mama' });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sorted = STORIES.slice().sort((a, b) => a.step - b.step);
const stepLabel = s => ({ 2: 'first words', 4: 'c, d', 6: 'g, b', 8: 'short e', 10: 'short u', 13: 'ck, ll', 14: 'sh', 16: 'th, ch', 18: 'blends', 21: 'magic e', 25: 'vowel teams', 30: 'oo, ar, er', 34: 'endings', 37: 'longer words' }[s] || '');

function renderGrid() {
  const f = fam();
  grid.innerHTML = sorted.map(s => `<button class="story-card" data-id="${s.id}" aria-label="Read ${esc(personalize(s.title, f))}"><div class="art">${renderScene(s.cover, LOOK)}</div><div class="body"><h2>${esc(personalize(s.title, f))}</h2><div class="pills"><span class="pill ember">Step ${s.step}${stepLabel(s.step) ? ` · ${stepLabel(s.step)}` : ''}</span><span class="pill">${s.pages.length} pages</span></div></div></button>`).join('');
  grid.querySelectorAll('.story-card').forEach(b => b.addEventListener('click', () => open(b.dataset.id)));
}

let cur = null, pageIdx = 0;
function open(id, at = 0) {
  cur = STORIES.find(s => s.id === id);
  if (!cur) return;
  pageIdx = at;
  show();
  if (!dlg.open) dlg.showModal();
  history.replaceState(null, '', `#${id}`);
}
function show() {
  const f = fam();
  const p = cur.pages[pageIdx];
  r('title').textContent = personalize(cur.title, f);
  r('art').innerHTML = renderScene(p.scene, LOOK, { title: personalize(p.text, f) });
  const words = tokenize(personalize(p.text, f));
  r('text').innerHTML = words.map(t => (t.t === 'w' ? `<span class="rw" data-wi="${t.wi}">${esc(t.text)}</span>` : esc(t.text))).join('');
  r('talk').innerHTML = `<b>Ask together</b>${esc(personalize(p.talk || '', f))}`;
  r('dots').innerHTML = cur.pages.map((_, i) => `<i class="${i === pageIdx ? 'on' : ''}"></i>`).join('');
  r('prev').disabled = pageIdx === 0;
  r('next').textContent = pageIdx === cur.pages.length - 1 ? 'The end' : '→';
  r('meta').textContent = `Page ${pageIdx + 1} of ${cur.pages.length}. Written for step ${cur.step}, so a parent at that step can read every word.`;
}
function go(d) {
  speechSynthesis?.cancel();
  if (pageIdx + d >= cur.pages.length) { dlg.close(); return; }
  pageIdx = Math.max(0, pageIdx + d);
  show();
}
r('prev').addEventListener('click', () => go(-1));
r('next').addEventListener('click', () => go(1));
r('close').addEventListener('click', () => dlg.close());
dlg.addEventListener('close', () => { try { speechSynthesis.cancel(); } catch { /* ignore */ } history.replaceState(null, '', location.pathname); });
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
r('listen').addEventListener('click', () => {
  try {
    speechSynthesis.cancel();
    const spans = [...r('text').querySelectorAll('.rw')];
    const text = spans.map(s => s.textContent).join(' ');
    const starts = []; let pos = 0; spans.forEach(s => { starts.push(pos); pos += s.textContent.length + 1; });
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85;
    u.onboundary = e => { const i = starts.findLastIndex(st => st <= e.charIndex); spans.forEach((s, k) => s.classList.toggle('on', k === i)); };
    u.onend = () => spans.forEach(s => s.classList.remove('on'));
    speechSynthesis.speak(u);
  } catch { /* speech not available */ }
});

[childIn, grownIn].forEach(i => i.addEventListener('input', () => { store.set('hearth.site.child', childIn.value); store.set('hearth.site.grownup', grownIn.value); renderGrid(); }));
renderGrid();
const hash = location.hash.slice(1);
if (hash && STORIES.some(s => s.id === hash)) open(hash);

/* The 40-step sequence explorer on /science/. */
(() => {
  const dataEl = document.getElementById('seq-data');
  if (!dataEl) return;
  const steps = JSON.parse(dataEl.textContent);
  const q = k => document.querySelector(`[data-seq="${k}"]`);
  const btns = [...document.querySelectorAll('.seq button')];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const say = t => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = 0.75; speechSynthesis.speak(u); } catch { /* no speech */ } };
  function show(n) {
    const s = steps[n - 1];
    btns.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.step === n)));
    q('title').textContent = `Step ${s.n}: ${s.title}`;
    q('readable').textContent = s.readable.toLocaleString('en-US');
    q('sounds').innerHTML = s.sounds.slice(0, 12).map(x => `<button class="sound-chip" data-say="${esc(x.key)}">${x.pic} <b>${esc(x.label)}</b>${x.key ? ` as in ${esc(x.key)}` : ''}</button>`).join('') + (s.sounds.length > 12 ? `<span class="sound-chip" style="cursor:default">+${s.sounds.length - 12} more</span>` : '');
    q('words').innerHTML = s.words.map(w => `<button data-say="${esc(w)}">${esc(w)}</button>`).join('');
    document.querySelectorAll('.seq-detail [data-say]').forEach(b => b.addEventListener('click', () => b.dataset.say && say(b.dataset.say)));
  }
  btns.forEach(b => b.addEventListener('click', () => show(+b.dataset.step)));
  show(14);
})();

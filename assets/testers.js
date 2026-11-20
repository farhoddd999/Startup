/* Tester guide: QR code to the app, copy link, saved checklist, print modes. */
(() => {
  const appUrl = `${location.origin}/app/`;
  document.querySelectorAll('[data-app-url]').forEach(n => { n.textContent = appUrl.replace(/^https?:\/\//, ''); });

  const qrBox = document.querySelector('[data-qr]');
  if (qrBox && typeof window.qrcode === 'function') {
    try {
      const q = window.qrcode(0, 'M');
      q.addData(appUrl);
      q.make();
      qrBox.innerHTML = q.createSvgTag({ cellSize: 8, margin: 2, scalable: true, title: 'Scan to open Hearth' });
      qrBox.dataset.url = appUrl;
    } catch { qrBox.hidden = true; }
  }

  document.querySelectorAll('[data-copy-url]').forEach(b => b.addEventListener('click', async () => {
    const label = b.querySelector('[data-lang]:not([hidden])') || b;
    const old = label.textContent;
    try { await navigator.clipboard.writeText(appUrl); label.textContent = document.documentElement.lang === 'es' ? 'Copiado' : 'Copied'; }
    catch { window.prompt('Copy this link', appUrl); }
    setTimeout(() => { label.textContent = old; }, 1600);
  }));

  // checklist, saved on this device only
  const KEY = 'hearth.testers.done';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const write = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode */ } };
  const boxes = [...document.querySelectorAll('[data-check]')];
  const count = document.querySelector('[data-check-count]');
  const done = new Set(read());
  const paint = () => {
    const n = boxes.filter(b => b.checked).length;
    if (count) count.textContent = document.documentElement.lang === 'es' ? `${n} de ${boxes.length} hechos` : `${n} of ${boxes.length} done`;
  };
  boxes.forEach(b => {
    b.checked = done.has(b.dataset.check);
    b.addEventListener('change', () => { b.checked ? done.add(b.dataset.check) : done.delete(b.dataset.check); write([...done]); paint(); });
  });
  document.querySelectorAll('[data-set-lang]').forEach(b => b.addEventListener('click', paint));
  paint();

  // print just the QR card, or just the facilitator guide
  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => {
    const cls = `print-${b.dataset.print}`;
    document.body.classList.add(cls);
    const off = () => { document.body.classList.remove(cls); window.removeEventListener('afterprint', off); };
    window.addEventListener('afterprint', off);
    window.print();
    setTimeout(off, 1000);
  }));
})();

/* Hearth website: shared behaviour. No tracking, no cookies. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // range sliders: paint the filled part of the track
  const paint = r => r.style.setProperty('--fill', `${((r.value - r.min) / (r.max - r.min || 1)) * 100}%`);
  $$('input[type="range"]').forEach(r => { paint(r); r.addEventListener('input', () => paint(r)); });

  // year
  $$('[data-year]').forEach(n => { n.textContent = new Date().getFullYear(); });

  // iOS only shows pressed (:active) styles when the page listens for touches
  document.addEventListener('touchstart', () => {}, { passive: true });

  // Instant pressed state: a control shrinks the moment a finger lands on it
  // (phones apply :active late or not at all) and lets go if the finger scrolls.
  const PRESSABLE = '.btn, .menu-btn, .nav a, .story-card, .card.link, .lang-switch button, .seg-ctl button, [role="tab"], .seq button, .sound-chip, .xw, .todo label, .faq summary, .site-footer a, .link-arrow';
  let pressed = null, px = 0, py = 0;
  const unpress = () => { pressed?.classList.remove('is-pressed'); pressed = null; };
  document.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    const el = e.target.closest?.(PRESSABLE);
    if (!el || el.disabled) return;
    unpress();
    pressed = el; px = e.clientX; py = e.clientY;
    el.classList.add('is-pressed');
  }, { passive: true });
  document.addEventListener('pointermove', e => { if (pressed && Math.hypot(e.clientX - px, e.clientY - py) > 10) unpress(); }, { passive: true });
  ['pointerup', 'pointercancel', 'dragstart'].forEach(ev => document.addEventListener(ev, () => setTimeout(unpress, 90), { passive: true }));
  window.addEventListener('scroll', unpress, { passive: true, capture: true });
  window.addEventListener('pagehide', unpress);

  // mobile menu: opens and closes on tap, closes when a link is chosen, Escape, or a tap outside
  const header = $('.site-header'), menuBtn = $('.menu-btn');
  const setMenu = open => {
    if (!header || !menuBtn) return;
    header.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn?.addEventListener('click', () => setMenu(!header.classList.contains('open')));
  $('#site-nav')?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => { if (header?.classList.contains('open') && !header.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && header?.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener('pageshow', () => setMenu(false)); // coming back with the Back button

  // hero: the headline is "read" word by word, with a short pause on "bedtime"
  const line = $('#heroLine');
  if (line && !reduce) {
    let t = 500;
    const rules = [];
    $$('.w', line).forEach((w, i) => {
      w.dataset.i = i;
      const pause = w.classList.contains('pause');
      $$('.ch', w).forEach(c => { c.style.animationDelay = `${t}ms`; });
      rules.push(`#heroLine .w[data-i="${i}"]::after{animation-delay:${pause ? t + 1500 : t}ms}`);
      t += pause ? 1700 : 330;
    });
    const st = document.createElement('style'); st.textContent = rules.join(''); document.head.append(st);
  }

  // speech helper
  const say = (text, lang = 'en-US', rate = 0.9) => {
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = rate; speechSynthesis.speak(u); return u; } catch { return null; }
  };
  window.hearthSay = say;

  // hint ladder demo
  $$('[data-ladder]').forEach(box => {
    const lw = $('.lw', box), said = $('.said', box), btns = $$('button[data-l]', box);
    const set = l => {
      lw.className = 'lw' + (l ? ` l${Math.min(l, 2)}` : '') + (l === 3 ? ' l3' : '');
      btns.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.l === l)));
      said.textContent = l === 3 ? '🔊 Hearth says “wish”, and you say it back.' : l === 2 ? 'Each sound gets a picture: web, itch, ship. Tap one to hear it.' : l === 1 ? 'The word breaks into parts, and the tricky bit lights up.' : '';
      if (l === 3) say('wish', 'en-US', 0.75);
    };
    btns.forEach(b => b.addEventListener('click', () => set(+b.dataset.l)));
  });

  // tabs (keyboard accessible)
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    const activate = (tab, focus) => {
      tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; const p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activate(t));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') activate(tabs[(i + 1) % tabs.length], true);
        if (e.key === 'ArrowLeft') activate(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
  });

  // pricing calculator
  $$('[data-calc]').forEach(c => {
    const fam = $('#calcFamilies', c), sites = $('#calcSites', c), nights = $('#calcNights', c);
    const out = k => $(`[data-out="${k}"]`, c);
    const money = n => '$' + Math.round(n).toLocaleString('en-US');
    const PRICE = 60, MIN_PER_SITE = 3000, WORDS_PER_STORY = 60;
    const run = () => {
      const f = +fam.value, s = +sites.value, n = +nights.value;
      const cost = Math.max(f * PRICE, s * MIN_PER_SITE);
      out('families').textContent = f.toLocaleString('en-US');
      out('sites').textContent = s;
      out('nights').textContent = n;
      out('cost').textContent = money(cost);
      out('perMonth').textContent = '$' + (cost / f / 12).toFixed(2);
      out('storyNights').textContent = Math.round(f * n * 52).toLocaleString('en-US');
      out('words').textContent = Math.round(f * n * 52 * WORDS_PER_STORY).toLocaleString('en-US');
    };
    [fam, sites, nights].forEach(i => i.addEventListener('input', run));
    run();
  });

  // copy buttons
  const copy = async (text, btn) => {
    try { await navigator.clipboard.writeText(text); if (btn) { const o = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = o; }, 1600); } return true; } catch { return false; }
  };
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => copy(b.dataset.copy, b)));

  // pilot request form: composes an email (no server, nothing stored)
  const form = $('[data-pilot-form]');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = ['name', 'organization', 'email'];
    let ok = true;
    fields.forEach(n => { const i = form.elements[n]; const bad = !i.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute('aria-invalid', bad ? 'true' : 'false'); if (bad && ok) { i.focus(); ok = false; } });
    const msg = $('[data-form-msg]', form);
    if (!ok) { msg.hidden = false; msg.style.background = '#FBE3DF'; msg.style.color = '#8E2A1F'; msg.textContent = 'We just need your name, your organization and an email address we can reply to.'; return; }
    const d = Object.fromEntries(new FormData(form));
    const to = document.querySelector('a[href^="mailto:"]')?.getAttribute('href').replace('mailto:', '') || '';
    const body = `Pilot request\n\nName: ${d.name}\nRole: ${d.role || '-'}\nOrganization: ${d.organization}\nEmail: ${d.email}\nProgram type: ${d.type}\nFamilies served: ${d.families || '-'}\nLocation: ${d.location || '-'}\n\n${d.message || ''}`;
    const href = `mailto:${to}?subject=${encodeURIComponent('Hearth pilot request: ' + d.organization)}&body=${encodeURIComponent(body)}`;
    msg.hidden = false; msg.style.background = ''; msg.style.color = '';
    msg.innerHTML = '';
    const p = document.createElement('p'); p.textContent = `Thank you! Your email app should open now with everything filled in, ready to send to ${to}. If it doesn’t open, copy the details below and email them to us.`;
    const pre = document.createElement('textarea'); pre.readOnly = true; pre.rows = 7; pre.value = body; pre.style.cssText = 'width:100%;margin-top:10px;border-radius:10px;border:1px solid #cfe3d6;padding:10px;font:14px var(--body)';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn ink sm'; btn.style.marginTop = '10px'; btn.textContent = 'Copy details';
    btn.addEventListener('click', () => copy(`To: ${to}\n\n${body}`, btn));
    msg.append(p, pre, btn);
    window.location.href = href;
  });

  // bilingual family page
  const langBtns = $$('[data-set-lang]');
  if (langBtns.length) {
    const setLang = l => {
      $$('[data-lang]').forEach(n => { n.hidden = n.dataset.lang !== l; });
      langBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
      document.documentElement.lang = l;
      store.set('hearth.site.lang', l);
      updateNote();
    };
    langBtns.forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang)));
    const listen = $('[data-listen]');
    let speaking = false;
    listen?.addEventListener('click', () => {
      if (speaking) { speechSynthesis.cancel(); speaking = false; return; }
      const l = document.documentElement.lang === 'es' ? 'es' : 'en';
      const text = $$('[data-read]').map(sec => $$(`[data-lang="${l}"]`, sec).map(n => n.innerText).join('. ')).join('. ');
      const head = $$(`.page-hero [data-lang="${l}"]`).map(n => n.innerText).join('. ');
      const u = say(`${head}. ${text}`, l === 'es' ? 'es-US' : 'en-US', 0.95);
      if (u) { speaking = true; u.onend = () => { speaking = false; }; }
    });
    const prog = $('#progName'), note = $('#noteText');
    function updateNote() {
      if (!note) return;
      const l = document.documentElement.lang === 'es' ? 'es' : 'en';
      const name = prog.value.trim();
      note.value = l === 'es'
        ? `Hola${name ? `, equipo de ${name}` : ''}:\n\nA nuestra familia le encantaría usar Hearth, una aplicación gratis de cuentos para la hora de dormir. ¿Es algo que nuestro programa podría ofrecer? Aquí hay información para programas: ${location.origin}/programs/\n\n¡Muchas gracias!`
        : `Hello${name ? ` ${name} team` : ''},\n\nOur family would love to use Hearth, a free bedtime story app for parents and children. Is it something our program could offer? There’s information for programs here: ${location.origin}/programs/\n\nThank you so much!`;
    }
    prog?.addEventListener('input', updateNote);
    $('[data-copy-note]')?.addEventListener('click', async e => { if (await copy(note.value, null)) $$('[data-copied]').forEach(n => { n.hidden = false; }); else { note.select(); } });
    $('[data-print-note]')?.addEventListener('click', () => {
      const w = window.open('', '_blank', 'width=600,height=500');
      if (!w) return;
      w.document.write(`<pre style="font:18px/1.6 Georgia,serif;white-space:pre-wrap;padding:40px">${note.value.replace(/</g, '&lt;')}</pre>`);
      w.document.close(); w.focus(); w.print();
    });
    const initial = location.hash === '#es' || location.hash === '#es-faq' ? 'es' : (store.get('hearth.site.lang') || 'en');
    setLang(initial === 'es' ? 'es' : 'en');
  }
})();

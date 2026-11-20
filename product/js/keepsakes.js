// Keepsakes for the family: a sticker the child picks after each bedtime story,
// and a little celebration (with a certificate) at milestone nights.
// Everything is kept and drawn on the phone.

import { h, icon, toast } from './ui.js';
import { t, getLang } from './i18n.js';
import { getState, update } from './store.js';
import { renderScene, renderSticker, STICKERS } from './art.js';
import { speak, stopSpeaking } from './voice.js';
import { MARK_SVG } from './brand.js';

export const MILESTONES = [1, 3, 7, 14, 30, 50, 100, 150, 200, 365];
const today = () => new Date().toDateString();

/** Three stickers to choose from, taken from tonight's story pictures. */
export function stickerChoices(story) {
  const counts = new Map();
  for (const sc of [story.cover, ...story.pages.map(p => p.scene)]) for (const it of sc?.items || []) if (STICKERS.includes(it[0])) counts.set(it[0], (counts.get(it[0]) || 0) + 1);
  const picks = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n);
  for (const extra of ['moon', 'heart', 'sun', 'owl']) if (picks.length < 3 && !picks.includes(extra)) picks.push(extra);
  return picks.slice(0, 3);
}

export const tonightsSticker = (st = getState()) => (st.stickers || []).find(s => new Date(s.at).toDateString() === today());

export function saveSticker(id, storyId) {
  update(s => {
    s.stickers = Array.isArray(s.stickers) ? s.stickers : [];
    s.stickers = s.stickers.filter(x => new Date(x.at).toDateString() !== today());
    s.stickers.push({ id, story: storyId, at: Date.now() });
    if (s.stickers.length > 400) s.stickers.shift();
  });
}

/** The milestone reached tonight, if it hasn't been celebrated yet. */
export function newMilestone(st = getState()) {
  const n = st.stats?.nights || 0;
  if (!MILESTONES.includes(n) || (st.milestones || []).includes(n)) return 0;
  update(s => { s.milestones = [...new Set([...(s.milestones || []), n])]; });
  return n;
}

/** Sticker picker for the goodnight screen. */
export function stickerPicker(story) {
  const st = getState();
  const vars = { child: st.family.childName };
  const look = st.family.look;
  const box = h('div.sticker-pick');
  const draw = () => {
    box.innerHTML = '';
    const chosen = tonightsSticker();
    if (chosen) {
      box.append(h('div.saved', h('span.sticker.big', { html: renderSticker(chosen.id, look, { title: chosen.id }) }), h('p', t('sticker_saved', vars))));
      return;
    }
    box.append(h('p.sticker-q', t('sticker_q')), h('div.sticker-row', stickerChoices(story).map(id =>
      h('button.sticker', { type: 'button', 'aria-label': id, html: renderSticker(id, look), onclick: () => { saveSticker(id, story.id); draw(); } }))));
  };
  draw();
  if (!tonightsSticker()) setTimeout(() => speak(t('sticker_say', vars)), 2600);
  return box;
}

/** Celebration card for a milestone night, with a certificate to keep. */
export function milestoneCard(n) {
  const st = getState();
  const vars = { child: st.family.childName, grownup: st.family.grownup, n };
  return h('div.milestone', { role: 'status' },
    h('div.ms-stars', icon('star'), icon('star'), icon('star')),
    h('h2', n === 1 ? t('milestone_first') : t('milestone_title', vars)),
    h('p', t('milestone_body', vars)),
    h('button.btn.ghost', { type: 'button', onclick: () => openCertificate(n) }, icon('sparkle'), h('span.grow', t('cert_make'))));
}

// ---- certificate: drawn on a canvas on the phone ----
const svgImage = svg => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
});

function fitText(ctx, text, maxWidth, size, font) {
  let s = size;
  do { ctx.font = `${font.replace('{s}', s)}`; s -= 2; } while (ctx.measureText(text).width > maxWidth && s > 24);
}

export async function makeCertificate(n, st = getState()) {
  const W = 1080, H = 1350;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx.roundRect) ctx.roundRect = (x, y, w, h) => ctx.rect(x, y, w, h); // older browsers: square corners
  await Promise.all(['600 60px Fraunces', '700 40px "Atkinson Hyperlegible"', '400 30px "Atkinson Hyperlegible"'].map(f => document.fonts?.load(f).catch(() => null)));
  ctx.fillStyle = '#FFF8EE'; ctx.fillRect(0, 0, W, H);
  const frame = (inset, color, width) => { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.roundRect(inset, inset, W - inset * 2, H - inset * 2, 40); ctx.stroke(); };
  frame(34, '#E8833A', 8); frame(54, '#F2C14E', 3);
  try { ctx.drawImage(await svgImage(MARK_SVG), W / 2 - 55, 90, 110, 110); } catch { /* the mark is decoration */ }
  ctx.textAlign = 'center'; ctx.fillStyle = '#5E6579';
  ctx.font = '700 34px "Atkinson Hyperlegible", sans-serif';
  ctx.fillText(t('cert_title').toUpperCase(), W / 2, 260);
  const names = `${st.family.childName || ''} & ${st.family.grownup || ''}`.trim();
  ctx.fillStyle = '#1E2A47';
  fitText(ctx, names, 900, 96, '600 {s}px Fraunces, Georgia, serif');
  ctx.fillText(names, W / 2, 370);
  ctx.fillStyle = '#9C4210';
  ctx.font = '700 46px "Atkinson Hyperlegible", sans-serif';
  ctx.fillText(n === 1 ? t('cert_line_1') : t('cert_line', { n }), W / 2, 445);
  try {
    const scene = renderScene({ bg: 'night', items: [['moon', 82, 26, 0.9], ['stars', 26, 24, 1], ['bed', 50, 90, 1.25], ['grownup', 36, 84, 0.95, { pose: 'hug' }], ['child', 58, 84, 0.85, { pose: 'hug' }], ['heart', 47, 30, 0.6]] }, st.family.look);
    const art = await svgImage(scene.replace('<svg ', '<svg width="900" height="585" '));
    ctx.save(); ctx.beginPath(); ctx.roundRect(90, 510, 900, 585, 36); ctx.clip(); ctx.drawImage(art, 90, 510, 900, 585); ctx.restore();
  } catch { /* the picture is decoration */ }
  ctx.fillStyle = '#5E6579';
  ctx.font = '400 32px "Atkinson Hyperlegible", sans-serif';
  ctx.fillText(new Date().toLocaleDateString(getLang() === 'es' ? 'es' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }), W / 2, 1170);
  ctx.font = '600 40px Fraunces, Georgia, serif'; ctx.fillStyle = '#1E2A47';
  ctx.fillText('hearth', W / 2, 1240);
  return new Promise(res => c.toBlob(res, 'image/png'));
}

export async function openCertificate(n) {
  stopSpeaking();
  const blob = await makeCertificate(n);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const file = new File([blob], `hearth-${n}-nights.png`, { type: 'image/png' });
  const close = () => { URL.revokeObjectURL(url); back.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const share = async () => {
    try { if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: t('cert_title') }); return; } } catch (e) { if (e?.name === 'AbortError') return; }
    const a = h('a', { href: url, download: file.name }); document.body.append(a); a.click(); a.remove(); toast(t('cert_saved'));
  };
  const back = h('div.sheet-backdrop', { onclick: e => { if (e.target === back) close(); } },
    h('div.sheet.cert-sheet', { role: 'dialog', 'aria-modal': 'true', 'aria-label': t('cert_ready') },
      h('div.grab'),
      h('div.row', h('h3', { style: { flex: 1 } }, t('cert_ready')), h('button.icon-btn', { type: 'button', 'aria-label': t('close'), onclick: close }, icon('close'))),
      h('img', { src: url, alt: t('cert_title'), width: 1080, height: 1350 }),
      h('button.btn.primary', { type: 'button', onclick: share }, h('span.grow', t('cert_share')), icon('next'))));
  document.addEventListener('keydown', onKey);
  document.body.append(back);
}

// Tiny UI toolkit: element builder, icons, press-and-hold-to-hear, toasts.

import { speak } from './voice.js';

/** h('button.primary', {onclick}, 'Text', child…) */
export function h(sel, attrs = {}, ...kids) {
  const [tag, ...classes] = sel.split('.');
  const el = document.createElement(tag || 'div');
  if (classes.length) el.className = classes.join(' ');
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = {}; }
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'say') { el.dataset.say = v; }
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

const P = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
export const ICONS = {
  speaker: `<svg viewBox="0 0 24 24" ${P}><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" ${P}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>`,
  next: `<svg viewBox="0 0 24 24" ${P}><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  back: `<svg viewBox="0 0 24 24" ${P}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`,
  close: `<svg viewBox="0 0 24 24" ${P}><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" ${P}><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5zM12 6v14"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" ${P}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
  home: `<svg viewBox="0 0 24 24" ${P}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" ${P}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" ${P}><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.8 4.6 3.4 7.2 8 8-4.6.8-7.2 3.4-8 8-.8-4.6-3.4-7.2-8-8 4.6-.8 7.2-3.4 8-8z"/></svg>`,
  record: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" ${P}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>`,
  help: `<svg viewBox="0 0 24 24" ${P}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></svg>`,
  hand: `<svg viewBox="0 0 24 24" ${P}><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5-2.7L3 15.5a1.6 1.6 0 0 1 2.6-1.8L8 16"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" ${P}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  pen: `<svg viewBox="0 0 24 24" ${P}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`,
};
export const icon = (name, cls = 'ic') => h(`span.${cls}`, { html: ICONS[name] || '', 'aria-hidden': 'true' });

/** Press and hold anything with data-say to hear it (voice-first UI for non-readers). */
export function enableHoldToHear(root = document) {
  let timer = null, target = null;
  const start = e => {
    const el = e.target.closest?.('[data-say]');
    if (!el) return;
    target = el;
    timer = setTimeout(() => { el.classList.add('saying'); speak(el.dataset.say).then(() => el.classList.remove('saying')); el.dataset.held = '1'; }, 550);
  };
  const end = () => { clearTimeout(timer); if (target) setTimeout(() => target && delete target.dataset.held, 30); };
  root.addEventListener('pointerdown', start);
  root.addEventListener('pointerup', end);
  root.addEventListener('pointerleave', end, true);
  root.addEventListener('pointercancel', end);
  // swallow the click that ends a long press
  root.addEventListener('click', e => { const el = e.target.closest?.('[data-say]'); if (el?.dataset.held) { e.stopPropagation(); e.preventDefault(); delete el.dataset.held; } }, true);
}

export function toast(msg, ms = 2600) {
  const el = h('div.toast', { role: 'status' }, msg);
  document.body.append(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, ms);
}

/** A round "hear this screen" button. */
export function sayButton(text, label = 'Listen') {
  return h('button.say-btn', { type: 'button', 'aria-label': label, onclick: () => speak(text) }, icon('speaker'));
}

export function fmt(n) { return Number(n).toLocaleString(); }

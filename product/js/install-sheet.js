// "Put Hearth on your phone": one sheet that knows which phone and browser it
// is in. Android and desktop Chrome get a real one-tap install; iPhone gets
// Safari's three steps with pictures; in-app browsers are asked to open the
// page in the phone's browser; computers get a QR code for the phone.

import { h, icon, toast } from './ui.js';
import { t } from './i18n.js';
import { getState } from './store.js';
import { speak, stopSpeaking } from './voice.js';
import { canPrompt, promptInstall, isStandalone, isIOS, onInstallChange } from './install.js';
import { isFramed } from './router.js';

const UA = () => navigator.userAgent;
export const isAndroid = () => /Android/i.test(UA());
export const isPhone = () => isIOS() || isAndroid() || /Mobi/i.test(UA());
// Facebook, Instagram, Messenger, LINE, Snapchat, TikTok, Telegram and Android WebViews can't install apps.
export const inAppBrowser = () => /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|musical_ly|BytedanceWebview|Telegram|; wv\)/i.test(UA());
const iosSafari = () => isIOS() && /Safari/.test(UA()) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(UA()) && !inAppBrowser();
const appUrl = () => new URL('./', location.href).href;

// Pictures of the iPhone buttons, so parents can match what they see.
const SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5"/><path d="M8 10H6.5A1.5 1.5 0 0 0 5 11.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H16"/></svg>';
const ADD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/></svg>';
const PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>';

/** Which way of installing applies here. */
export function installPath() {
  if (isStandalone()) return 'installed';
  if (inAppBrowser()) return 'inapp';
  if (canPrompt()) return 'prompt';
  if (isIOS()) return iosSafari() ? 'ios' : 'ios-other';
  if (isPhone()) return 'android';
  return 'desktop';
}

export function openInstall() {
  stopSpeaking();
  const back = h('div.sheet-backdrop', { onclick: e => { if (e.target === back) close(); } });
  const sheet = h('div.sheet.inst-sheet', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'instTitle' });
  back.append(sheet);
  let off = null;
  const onKey = e => { if (e.key === 'Escape') close(); };
  function close() { off?.(); stopSpeaking(); back.remove(); document.removeEventListener('keydown', onKey); }
  document.addEventListener('keydown', onKey);

  const step = (n, svg, title, sub) => h('li.inst-step', h('span.inst-num', String(n)), h('div.inst-txt', h('b', title), h('span', sub)), svg ? h('span.inst-ico', { html: svg, 'aria-hidden': 'true' }) : null);
  const copyBtn = () => {
    const b = h('button.btn.ghost', { type: 'button', onclick: async () => {
      try { await navigator.clipboard.writeText(appUrl()); toast(t('inst_copied')); } catch { window.prompt(t('inst_copy'), appUrl()); }
    } }, h('span.grow', t('inst_copy')));
    return b;
  };

  function draw() {
    const path = installPath();
    sheet.innerHTML = '';
    let body = [], say = `${t('inst_title')}. ${t('inst_sub')}`;
    if (path === 'installed') {
      body = [h('p.inst-ok', icon('check'), t('inst_done'))];
      say = t('inst_done');
    } else if (path === 'prompt') {
      const btn = h('button.btn.primary.inst-go', { type: 'button', onclick: async () => {
        btn.disabled = true;
        btn.querySelector('.grow').textContent = t('inst_opening');
        const ok = await promptInstall();
        if (ok) { sheet.querySelector('.inst-body').replaceChildren(h('p.inst-ok', icon('check'), t('inst_done'))); speak(t('inst_done')); }
        else { btn.disabled = false; btn.querySelector('.grow').textContent = t('inst_btn'); }
      } }, h('span.inst-app', { html: '<img src="./assets/icon-192.png" alt="">' }), h('span.grow', t('inst_btn')), icon('next'));
      body = [btn];
    } else if (path === 'ios') {
      body = [
        h('ol.inst-steps',
          step(1, SHARE, t('inst_ios_1'), t('inst_ios_1_sub')),
          step(2, ADD, t('inst_ios_2'), t('inst_ios_2_sub')),
          step(3, null, t('inst_ios_3'), t('inst_ios_3_sub'))),
        h('p.note', t('inst_ios_note')),
      ];
      say += ` ${t('inst_ios_1')}. ${t('inst_ios_2')}. ${t('inst_ios_3')}.`;
    } else if (path === 'ios-other') {
      body = [h('p.inst-tip', { html: `<span class="inst-ico">${SHARE}</span>` }, t('inst_ios_other')), copyBtn()];
      say += ` ${t('inst_ios_other')}`;
    } else if (path === 'inapp') {
      body = [h('p.inst-tip', t('inst_inapp')), copyBtn()];
      say += ` ${t('inst_inapp')}`;
    } else if (path === 'android') {
      body = [h('p.inst-tip', { html: `<span class="inst-ico">${PHONE}</span>` }, t('inst_android'))];
      say += ` ${t('inst_android')}`;
    } else {
      const qr = h('div.inst-qr', { role: 'img', 'aria-label': 'QR code' });
      body = [h('p.inst-tip', t('inst_desktop')), qr, h('p.inst-url', appUrl().replace(/^https?:\/\//, ''))];
      drawQR(qr);
    }
    sheet.append(
      h('div.grab'),
      h('div.row', h('h3', { id: 'instTitle', style: { flex: 1 } }, t('inst_title')),
        h('button.icon-btn', { type: 'button', 'aria-label': t('listen'), onclick: () => speak(say) }, icon('speaker')),
        h('button.icon-btn', { type: 'button', 'aria-label': t('close'), onclick: close }, icon('close'))),
      path === 'installed' ? null : h('p.muted.inst-sub', t('inst_sub')),
      h('div.inst-body', body),
      h('button.btn.ghost.inst-later', { type: 'button', onclick: close }, h('span.grow', path === 'desktop' ? t('inst_here') : t('inst_later'))),
    );
    return say;
  }
  const say = draw();
  off = onInstallChange(() => { if (document.body.contains(back)) draw(); });
  document.body.append(back);
  if (getState().settings.narrate) speak(say);
  return close;
}

// QR code for computers: the library is only loaded when this is shown.
function drawQR(box) {
  const render = () => {
    try {
      const q = window.qrcode(0, 'M');
      q.addData(appUrl());
      q.make();
      box.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true, title: 'Scan to open Hearth' });
    } catch { box.remove(); }
  };
  if (window.qrcode) return render();
  const s = document.createElement('script');
  s.src = '/assets/vendor/qrcode.js';
  s.onload = render;
  s.onerror = () => box.remove();
  document.head.append(s);
}

/** Small card offering install, for the welcome and home screens. Null when it doesn't apply. */
export function installCard({ dismissKey = '' } = {}) {
  if (isStandalone() || !isPhone() || isFramed) return null;
  if (dismissKey) { try { if (Number(localStorage.getItem(dismissKey) || 0) > Date.now()) return null; } catch { /* ignore */ } }
  const card = h('div.install-card',
    h('button.install-main', { type: 'button', say: t('inst_card'), onclick: () => openInstall() },
      h('span.inst-app', { html: '<img src="./assets/icon-192.png" alt="">' }),
      h('span.grow', h('b', t('inst_card')), h('span', t('inst_card_sub'))),
      icon('next')),
    dismissKey ? h('button.install-x', { type: 'button', 'aria-label': t('inst_later'), onclick: () => {
      try { localStorage.setItem(dismissKey, String(Date.now() + 7 * 864e5)); } catch { /* ignore */ }
      card.remove();
    } }, icon('close')) : null,
  );
  return card;
}

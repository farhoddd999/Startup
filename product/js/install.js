// "Put Hearth on your home screen": Android/desktop Chrome offer an install
// prompt we can trigger from a button; iPhone and iPad need Safari's Share menu.

let deferred = null;
const listeners = new Set();

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; listeners.forEach(fn => fn()); });
window.addEventListener('appinstalled', () => { deferred = null; listeners.forEach(fn => fn()); });

export const isStandalone = () => !!(matchMedia?.('(display-mode: standalone)').matches || navigator.standalone);
export const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
export const canPrompt = () => !!deferred && !isStandalone();
export const onInstallChange = fn => (listeners.add(fn), () => listeners.delete(fn));

export async function promptInstall() {
  if (!deferred) return false;
  const e = deferred;
  deferred = null;
  e.prompt();
  const { outcome } = await e.userChoice.catch(() => ({ outcome: 'dismissed' }));
  listeners.forEach(fn => fn());
  return outcome === 'accepted';
}

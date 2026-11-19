// Tiny router. Uses the URL hash when Hearth runs as a normal page, and keeps
// the route in memory when it runs inside a sandboxed frame (where hash paths
// with slashes are not reliably passed through).

const framed = (() => { try { return window.self !== window.top; } catch { return true; } })();
let memory = '';
const stack = [];
const listeners = new Set();

export const current = () => (framed ? memory : location.hash);

export function go(hash, { replace = false } = {}) {
  if (framed) {
    if (!replace && memory) stack.push(memory);
    memory = hash;
    listeners.forEach(fn => fn());
    return;
  }
  if (replace) { history.replaceState(null, '', hash); listeners.forEach(fn => fn()); return; }
  if (location.hash === hash) listeners.forEach(fn => fn());
  else location.hash = hash;
}

export function back() {
  if (framed) { memory = stack.pop() || '#/home'; listeners.forEach(fn => fn()); }
  else history.back();
}

export function onRoute(fn) {
  listeners.add(fn);
  if (!framed) window.addEventListener('hashchange', fn);
}

export const isFramed = framed;

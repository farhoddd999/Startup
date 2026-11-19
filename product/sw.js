// Offline-first: the app shell, stories, lexicon and fonts are cached so a
// parent can practise with no data plan. (Story generation needs a connection.)
const CACHE = 'hearth-v2';
const SHELL = [
  './', './css/app.css', './manifest.webmanifest', './data/lexicon.json', './data/stories.js',
  './js/main.js', './js/i18n.js', './js/voice.js', './js/store.js', './js/ui.js', './js/stories.js', './js/art.js', './js/demo.js',
  './js/screens/onboarding.js', './js/screens/home.js', './js/screens/reader.js', './js/screens/sky.js', './js/screens/library.js', './js/screens/settings.js',
  './engine/phonics.js', './engine/align.js', './engine/lexicon.js', './engine/decodable.js', './engine/learner.js', './engine/tracker.js', './engine/text.js', './engine/simulate.js',
  './assets/hearth-mark.svg', './assets/fonts/fonts.css', './assets/fonts/Andika-400-normal.woff2', './assets/fonts/Andika-700-normal.woff2',
  './assets/fonts/AtkinsonHyperlegible-400-normal.woff2', './assets/fonts/AtkinsonHyperlegible-700-normal.woff2', './assets/fonts/Fraunces-var.woff2',
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.includes('/api/')) return;
  e.respondWith(
    fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request)),
  );
});

// Shared page chrome for the Hearth website.
export const SITE = {
  name: 'Hearth',
  contact: process.env.HEARTH_CONTACT || 'hello@hearth.example',
  url: (process.env.HEARTH_SITE_URL || '').replace(/\/$/, ''),
};

export const MARK = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4c5.5 7 10 11.5 9.2 18.4-.6 5-4.4 8.1-9.2 8.1s-8.6-3.1-9.2-8.1C22 15.5 26.5 11 32 4z" fill="#F2C14E"/><path d="M32 14.5c2.8 3.6 5 6 4.6 9.6-.3 2.6-2.2 4.2-4.6 4.2s-4.3-1.6-4.6-4.2c-.4-3.6 1.8-6 4.6-9.6z" fill="#E8833A"/><path d="M32 33c-6.5-4.8-15.2-6.3-25-4.6v24.3c9.8-1.7 18.5-.2 25 4.6z" fill="#E8833A"/><path d="M32 33c6.5-4.8 15.2-6.3 25-4.6v24.3c-9.8-1.7-18.5-.2-25 4.6z" fill="#C9622A"/></svg>`;

const NAV = [
  ['/how-it-works/', 'How it works'],
  ['/families/', 'For families'],
  ['/programs/', 'For programs'],
  ['/science/', 'Science'],
  ['/stories/', 'Stories'],
  ['/about/', 'About'],
];

export const ICON = {
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5zM12 6v14"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5-2.7L3 15.5a1.6 1.6 0 0 1 2.6-1.8L8 16"/></svg>',
};

export const stars = (n = 70, w = 1200, h = 700) => `<svg class="stars" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<circle cx="${(i * 173) % w}" cy="${(i * 97) % h}" r="${(i % 3) * 0.5 + 0.6}" fill="#F6E7B4" opacity="${(0.15 + (i % 5) * 0.09).toFixed(2)}"/>`).join('')}</svg>`;

export function page({ path, title, description, body, scripts = [], modules = [], bodyClass = '', noindex = false }) {
  const fullTitle = path === '/' ? 'Hearth · Be the one who reads the bedtime story' : `${title} · Hearth`;
  const nav = NAV.map(([href, label]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const abs = p => (SITE.url ? SITE.url + p : p);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#131A2E">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
${SITE.url ? `<link rel="canonical" href="${abs(path)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Hearth">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${abs('/assets/og-image.png')}">
${SITE.url ? `<meta property="og:url" content="${abs(path)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/product/assets/fonts/Fraunces-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script type="speculationrules">{"prefetch":[{"where":{"href_matches":"/*"},"eagerness":"conservative"}]}</script>
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="/" aria-label="Hearth home">${MARK}<b>hearth</b></a>
    <nav class="nav" id="site-nav" aria-label="Main">${nav}<div class="nav-cta"><a class="btn line sm" href="/install">Get the app</a><a class="btn lamp sm" href="/pilot/">Start a pilot</a></div></nav>
    <div class="header-cta"><a class="btn line sm" href="/install">Get the app</a><a class="btn lamp sm" href="/pilot/">Start a pilot</a></div>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><svg class="i-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="stack">
        <a class="logo" href="/">${MARK}<b>hearth</b></a>
        <p>A private reading coach for parents, built around the bedtime story. Every night, two people get better at reading.</p>
        <p>Pilots and partnerships: <a href="mailto:${SITE.contact}">${SITE.contact}</a></p>
      </div>
      <div><h4>Product</h4><ul><li><a href="/how-it-works/">How it works</a></li><li><a href="/install">Get the app</a></li><li><a href="/app/">Try it in the browser</a></li><li><a href="/stories/">Story library</a></li><li><a href="/check/">Decodability checker</a></li><li><a href="/dashboard/">Partner dashboard demo</a></li></ul></div>
      <div><h4>Who it's for</h4><ul><li><a href="/families/">Families</a></li><li><a href="/families/#es">Familias (español)</a></li><li><a href="/programs/">Programs and partners</a></li><li><a href="/pilot/">Start a pilot</a></li></ul></div>
      <div><h4>Learn more</h4><ul><li><a href="/science/">The science</a></li><li><a href="/research/">Research and sources</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/about/">About Hearth</a></li></ul></div>
    </div>
    <div class="footer-base"><span>© <span data-year>2026</span> Hearth. Working prototype; pilots next.</span><span>Families never pay. No ads. No data sales.</span></div>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
${scripts.map(s => `<script src="${s}" defer></script>`).join('\n')}
${modules.map(s => `<script type="module" src="${s}"></script>`).join('\n')}
</body>
</html>
`;
}

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

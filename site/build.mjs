// Builds the Hearth website into the repository root, ready for static hosting
// (Cloudflare Workers static assets or Cloudflare Pages, output directory "/").
//
//   node site/build.mjs            pages, app build stamp, host config (Cloudflare and Vercel), favicon, sitemap
//   node site/build.mjs --images   also renders apple-touch-icon.png and og-image.png (needs Playwright)
//
// Page sources live in site/pages/*.mjs. Static files (CSS, JS, images) live
// in /assets and are served as-is. Everything a page shows about the product
// (stories, art, phonics numbers) is rendered from the product's real code.

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARK, SITE } from './layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (p, data) => mkdir(path.dirname(path.join(ROOT, p)), { recursive: true }).then(() => writeFile(path.join(ROOT, p), data));

export const PAGES = [
  ['home', '/'],
  ['how', '/how-it-works/'],
  ['families', '/families/'],
  ['programs', '/programs/'],
  ['science', '/science/'],
  ['check', '/check/'],
  ['stories', '/stories/'],
  ['research', '/research/'],
  ['about', '/about/'],
  ['privacy', '/privacy/'],
  ['pilot', '/pilot/'],
  ['testers', '/testers/'],
  ['notfound', '/404.html'],
];
// Pages shared by link only: left out of the sitemap and search results.
export const UNLISTED = ['/testers/', '/404.html'];

// Short, memorable addresses for the product surfaces.
export const SHORTCUTS = [
  ['/app', '/product/'],
  ['/install', '/product/?install'],
  ['/test', '/testers/'],
  ['/studio', '/product/studio/'],
  ['/dashboard', '/product/dashboard/'],
  ['/demo', '/product/?demo'],
  ['/website', '/'],
];

// Working files that live in the repository but are not part of the public site.
// Hosts that support an ignore file never upload them; every host also
// redirects these paths to the home page, in case they are uploaded anyway.
const PRIVATE_DIRS = ['/docs', '/pitch', '/site', '/product/server', '/product/test', '/product/tools', '/.git', '/.github', '/.wrangler', '/.vercel'];
const PRIVATE_FILES = ['/README.md', '/product/package.json', '/product/package-lock.json', '/product/artifact.html', '/wrangler.jsonc', '/vercel.json', '/.gitignore', '/.assetsignore', '/.vercelignore', '/_redirects', '/_headers'];
export const PRIVATE = [...PRIVATE_DIRS, ...PRIVATE_FILES];
const IGNORE = ['.git', '.github', '.gitignore', 'node_modules', '.DS_Store', '*.log', '.env*', '.wrangler', '.vercel', 'README.md', 'docs', 'pitch', 'site',
  'product/server', 'product/test', 'product/tools', 'product/node_modules', 'product/package.json', 'product/package-lock.json', 'product/artifact.html'];

// One list of redirects and one of headers, written out for each host:
// _redirects and _headers (Cloudflare Workers and Pages) and vercel.json (Vercel).
const REDIRECTS = [
  ...SHORTCUTS.flatMap(([from, to]) => [{ from, to, status: 302 }, { from: `${from}/`, to, status: 302 }]),
  { from: '/website/*', to: '/', status: 301 },
  ...PRIVATE_DIRS.flatMap(d => [{ from: d, to: '/', status: 302 }, { from: `${d}/*`, to: '/', status: 302 }]),
  ...PRIVATE_FILES.map(f => ({ from: f, to: '/', status: 302 })),
];
// Scripts only from our own files: no inline scripts, no eval, no third parties.
// (The one inline block is the link-preloading rules, which browsers treat as data.)
const CSP = [
  "default-src 'self'", "script-src 'self' 'inline-speculation-rules'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
  "media-src 'self' blob:", "font-src 'self'", "connect-src 'self'", "frame-src 'self'", "frame-ancestors 'self'",
  "worker-src 'self'", "manifest-src 'self'", "base-uri 'self'", "form-action 'self' mailto:", "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');
const HEADERS = [
  ['/*', {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'microphone=(self), camera=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), bluetooth=(), display-capture=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Content-Security-Policy': CSP,
    'Strict-Transport-Security': 'max-age=31536000',
  }],
  ['/assets/*', { 'Cache-Control': 'public, max-age=3600, must-revalidate' }],
  ['/assets/img/*', { 'Cache-Control': 'public, max-age=86400' }],
  ['/product/assets/fonts/*', { 'Cache-Control': 'public, max-age=31536000, immutable' }],
  ['/product/sw.js', { 'Cache-Control': 'no-cache' }],
  ['/product/api/story', { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' }],
];

const fileFor = p => (p.endsWith('/') ? `${p}index.html` : p);

// The app's build stamp and offline file list. The build id is a hash of the
// app's own files, so it changes exactly when the app does; testers quote it
// in feedback, and the service worker uses it to refresh its cache.
async function appBuild() {
  const { readdir } = await import('node:fs/promises');
  const { createHash } = await import('node:crypto');
  const APP = path.join(ROOT, 'product');
  async function walk(dir) {
    const found = [];
    for (const d of await readdir(path.join(APP, dir), { withFileTypes: true })) {
      const rel = `${dir}/${d.name}`;
      if (d.isDirectory()) found.push(...(await walk(rel)));
      else found.push(rel);
    }
    return found;
  }
  const files = (await Promise.all(['js', 'engine', 'css', 'data', 'assets'].map(walk))).flat()
    .filter(f => !/\.DS_Store$/.test(f)).sort();
  const hash = createHash('sha256');
  hash.update(SITE.contact); // config.js isn't hashed (it holds the hash), so hash what goes into it
  for (const f of ['index.html', 'manifest.webmanifest', ...files.filter(f => f !== 'js/config.js')]) hash.update(f).update(await readFile(path.join(APP, f)));
  const build = hash.digest('hex').slice(0, 7);
  const cfgPath = path.join(APP, 'js/config.js');
  const prev = await readFile(cfgPath, 'utf8').catch(() => '');
  const date = prev.includes(`build: '${build}'`) ? /date: '([\d-]+)'/.exec(prev)[1] : new Date().toISOString().slice(0, 10);
  await writeFile(cfgPath, `// Generated by site/build.mjs. Set HEARTH_CONTACT before building to change where feedback goes.
export const BUILD = { version: '0.1', build: '${build}', date: '${date}' };
export const FEEDBACK_TO = String.fromCharCode(${[...SITE.contact].map(c => c.charCodeAt(0)).join(', ')}); // the contact address, kept out of plain text
`);
  const shell = ['./', './manifest.webmanifest', ...files.filter(f => !f.endsWith('.png') || f.includes('icon-192')).map(f => `./${f}`)];
  const swPath = path.join(APP, 'sw.js');
  const sw = await readFile(swPath, 'utf8');
  const generated = `// BEGIN GENERATED by site/build.mjs: the cache name changes with every build.
const CACHE = 'hearth-${build}';
const SHELL = [
${shell.map(f => `  '${f}',`).join('\n')}
];
// END GENERATED`;
  await writeFile(swPath, sw.replace(/\/\/ BEGIN GENERATED[^]*?\/\/ END GENERATED/, generated));
  console.log(`  app build ${build} (${date}), ${shell.length} files cached for offline use`);
}

async function pages() {
  for (const [mod, p] of PAGES) {
    const html = (await import(`./pages/${mod}.mjs`)).default;
    await out(fileFor(p), html);
  }
  console.log(`  ${PAGES.length} pages`);
}

// A tiny page at each shortcut, for hosts or local servers that skip _redirects.
async function shortcuts() {
  for (const [from, to] of SHORTCUTS) {
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Hearth</title>
<meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}">
</head><body style="background:#131A2E;color:#FBF2E4;font:18px system-ui;padding:40px"><a style="color:#F4B860" href="${to}">Continue to Hearth</a></body></html>\n`;
    await out(`${from}/index.html`, html);
  }
}

// Cloudflare (Workers static assets and Pages): _redirects, _headers, .assetsignore
async function cloudflare() {
  const lines = ['# Generated by site/build.mjs: short addresses, the old website path, and private working files.'];
  for (const r of REDIRECTS) lines.push(`${r.from} ${r.to} ${r.status}`);
  await out('/_redirects', lines.join('\n') + '\n');
  await out('/_headers', ['# Generated by site/build.mjs', ...HEADERS.map(([p, hs]) => [p, ...Object.entries(hs).map(([k, v]) => `  ${k}: ${v}`)].join('\n'))].join('\n\n') + '\n');
  await out('/.assetsignore', ['# Generated by site/build.mjs: files Cloudflare does not upload.', ...IGNORE, '.assetsignore', '.vercelignore', 'wrangler.jsonc', 'vercel.json'].join('\n') + '\n');
}

// Vercel: vercel.json (redirects run before files are served) and .vercelignore (CLI uploads)
async function vercel() {
  const pattern = p => p.replace(/\/\*$/, '/:path*');
  const config = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: null,
    // Only main deploys. Work branches would otherwise create a preview deployment on every push.
    git: { deploymentEnabled: { 'ccr-*': false, 'claude/*': false } },
    redirects: REDIRECTS.map(r => ({ source: pattern(r.from), destination: r.to, statusCode: r.status })),
    headers: HEADERS.map(([p, hs]) => ({ source: p.replace(/\*$/, '(.*)'), headers: Object.entries(hs).map(([key, value]) => ({ key, value })) })),
  };
  await out('/vercel.json', JSON.stringify(config, null, 2) + '\n');
  await out('/.vercelignore', ['# Generated by site/build.mjs: files Vercel CLI does not upload.', ...IGNORE, '.assetsignore', 'wrangler.jsonc'].join('\n') + '\n');
}

async function meta() {
  const favicon = MARK.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(' aria-hidden="true"', '');
  await out('/assets/favicon.svg', favicon + '\n');
  const robots = ['User-agent: *', 'Allow: /', ...['/docs/', '/pitch/', '/site/', '/product/server/'].map(p => `Disallow: ${p}`)];
  if (SITE.url) {
    robots.push('', `Sitemap: ${SITE.url}/sitemap.xml`);
    const urls = PAGES.filter(([, p]) => p.endsWith('/') && !UNLISTED.includes(p)).map(([, p]) => `  <url><loc>${SITE.url}${p}</loc></url>`).join('\n');
    await out('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  }
  await out('/robots.txt', robots.join('\n') + '\n');
}

// Social card and touch icon, drawn in the browser so they use the real fonts.
async function images() {
  const { createRequire } = await import('node:module');
  const { chromium } = createRequire(import.meta.url)('playwright');
  const fontDir = path.join(ROOT, 'product/assets/fonts');
  let fontCss = await readFile(path.join(fontDir, 'fonts.css'), 'utf8');
  for (const m of [...fontCss.matchAll(/url\('\.\/([^']+)'\)/g)]) fontCss = fontCss.replace(m[0], `url(data:font/woff2;base64,${(await readFile(path.join(fontDir, m[1]))).toString('base64')})`);
  const { scene } = await import('./parts.mjs');
  const art = scene({ bg: 'night', items: [['moon', 82, 24, 0.9], ['stars', 24, 22, 1], ['bed', 50, 90, 1.25], ['grownup', 36, 84, 0.95, { pose: 'hug' }], ['child', 58, 84, 0.85, { pose: 'hug' }], ['heart', 47, 30, 0.6]] });
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const stars = Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 173) % 1200}" cy="${(i * 97) % 630}" r="${(i % 3) * 0.6 + 0.7}" fill="#F6E7B4" opacity="${(0.15 + (i % 5) * 0.1).toFixed(2)}"/>`).join('');
  await pg.setContent(`<!doctype html><html><head><style>${fontCss}
    body{margin:0;width:1200px;height:630px;background:#131A2E;color:#FBF2E4;font-family:'Atkinson Hyperlegible',system-ui;overflow:hidden;position:relative}
    .glow{position:absolute;width:900px;height:900px;right:-300px;top:-330px;background:radial-gradient(circle,rgba(244,184,96,.32),rgba(244,184,96,0) 62%)}
    svg.s{position:absolute;inset:0}
    .in{position:absolute;left:84px;top:78px;width:560px}
    .logo{display:flex;align-items:center;gap:16px}.logo svg{width:64px;height:64px}.logo b{font-family:Fraunces,serif;font-size:50px;font-weight:600;letter-spacing:-.02em}
    h1{font-family:Fraunces,serif;font-weight:560;font-size:64px;line-height:1.05;letter-spacing:-.02em;margin:48px 0 24px;max-width:11ch}
    h1 em{font-style:italic;color:#F4B860}
    p{font-size:28px;line-height:1.35;color:#C9CFE0;margin:0}
    .pic{position:absolute;right:64px;top:150px;width:440px;padding:12px;background:#1E2A47;border-radius:30px;box-shadow:0 30px 70px rgba(0,0,0,.45)}
    .pic svg{display:block;width:100%;height:auto;border-radius:20px;position:static}
  </style></head><body><div class="glow"></div><svg class="s" viewBox="0 0 1200 630">${stars}</svg>
  <div class="in"><div class="logo">${MARK}<b>hearth</b></div><h1>Be the one who reads the <em>bedtime story.</em></h1><p>A private reading coach for parents,<br>built around the bedtime story.</p></div><div class="pic">${art}</div></body></html>`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(ROOT, 'assets/og-image.png') });
  await pg.setViewportSize({ width: 180, height: 180 });
  await pg.setContent(`<body style="margin:0;width:180px;height:180px;background:#131A2E;display:grid;place-items:center">${MARK.replace('<svg ', '<svg width="124" height="124" ')}</body>`);
  await pg.screenshot({ path: path.join(ROOT, 'assets/apple-touch-icon.png') });
  await browser.close();
  console.log('  og-image.png, apple-touch-icon.png');
}

console.log('Building the Hearth website…');
if (/\.example$/.test(SITE.contact)) console.warn(`  ⚠ The contact address is a placeholder (${SITE.contact}). Set HEARTH_CONTACT=you@yourdomain and rebuild.`);
await appBuild();
await pages();
await shortcuts();
await cloudflare();
await vercel();
await meta();
if (process.argv.includes('--images')) await images();
console.log('Done. Serve locally with: node product/server/server.mjs');

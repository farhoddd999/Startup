// Hearth dev/demo server — zero dependencies.
//   node product/server/server.mjs            → http://localhost:8787/
// Serves the repository the way Cloudflare does in production: the website at /,
// the app at /product/, _redirects and _headers applied, 404.html for misses.
// Also exposes the story engine at …/api/story (needs ANTHROPIC_API_KEY).

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateStory, storyEngineReady } from './storygen.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PORT = Number(process.env.PORT || 8787);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.ico': 'image/x-icon',
};

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};


// ---- _redirects and _headers (the subset of Cloudflare's syntax the site uses) ----
function readRules(name) {
  try { return fs.readFileSync(path.join(ROOT, name), 'utf8').split('\n'); } catch { return []; }
}
const REDIRECTS = readRules('_redirects').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => {
  const [from, to, status = '302'] = l.split(/\s+/);
  return { from, to, status: Number(status) };
});
function matchRedirect(p) {
  for (const r of REDIRECTS) {
    if (r.from.endsWith('/*') ? p.startsWith(r.from.slice(0, -1)) : p === r.from) {
      const splat = r.from.endsWith('/*') ? p.slice(r.from.length - 1) : '';
      return { to: r.to.replace(':splat', splat), status: r.status };
    }
  }
  return null;
}
const HEADER_RULES = [];
for (const line of readRules('_headers')) {
  if (!line.trim() || line.trim().startsWith('#')) continue;
  if (!/^\s/.test(line)) HEADER_RULES.push({ pattern: line.trim(), headers: {} });
  else if (HEADER_RULES.length) { const i = line.indexOf(':'); HEADER_RULES.at(-1).headers[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim(); }
}
function headersFor(p) {
  const out = {};
  for (const r of HEADER_RULES) if (r.pattern.endsWith('*') ? p.startsWith(r.pattern.slice(0, -1)) : p === r.pattern) Object.assign(out, r.headers);
  return out;
}

// A few stories per visitor every 10 minutes, and a ceiling per hour for everyone.
const hits = new Map();
let hourStart = Date.now(), hourCount = 0;
function rateLimited(ip, now = Date.now()) {
  if (now - hourStart > 3600e3) { hourStart = now; hourCount = 0; }
  if (hourCount >= 60) return Math.ceil((hourStart + 3600e3 - now) / 1000);
  const recent = (hits.get(ip) || []).filter(t => now - t < 600e3);
  if (recent.length >= 5) return Math.ceil((recent[0] + 600e3 - now) / 1000);
  recent.push(now); hits.set(ip, recent); hourCount++;
  if (hits.size > 5000) hits.clear();
  return 0;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.endsWith('/api/story')) {
    if (req.method === 'GET') return send(res, 200, { ready: storyEngineReady() });
    if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
    // Only Hearth's own pages may ask for stories, and not too often: each one costs money.
    const origin = req.headers.origin;
    const sameSite = (() => { try { return !origin || new URL(origin).host === req.headers.host; } catch { return false; } })();
    if (!sameSite) return send(res, 403, { error: 'Not allowed' });
    if (!(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, { error: 'JSON only' });
    const wait = rateLimited(req.socket.remoteAddress || 'unknown');
    if (wait) { res.setHeader('retry-after', String(wait)); return send(res, 429, { error: 'Too many stories at once. Please try again a little later.' }); }
    if (!storyEngineReady()) return send(res, 503, { error: 'Story engine offline: set ANTHROPIC_API_KEY' });
    try {
      const body = JSON.parse(await readBody(req) || '{}');
      const story = await generateStory(body);
      return send(res, 200, story);
    } catch (err) {
      console.error('[story]', err.message);
      return send(res, 500, { error: 'Story generation failed' });
    }
  }
  // static files, with Cloudflare-style redirects, headers and trailing slashes
  let p;
  try { p = decodeURIComponent(url.pathname); } catch { return send(res, 400, 'bad request', 'text/plain'); }
  const rd = matchRedirect(p);
  if (rd) { res.writeHead(rd.status, { location: rd.to + (rd.to.includes('?') ? '' : url.search) }); return res.end(); }
  const extra = headersFor(p);
  let file = path.normalize(path.join(ROOT, p));
  if ((file !== ROOT && !file.startsWith(ROOT + path.sep)) || /(^|[\\/])\.(git|env|wrangler|vercel)\b/.test(p) || p.includes('\0')) return send(res, 403, 'forbidden', 'text/plain');
  try {
    let st = fs.statSync(file);
    if (st.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { location: `${p}/${url.search}` }); return res.end(); }
      file = path.join(file, 'index.html'); st = fs.statSync(file);
    }
    res.writeHead(200, { ...extra, 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'content-length': st.size });
    fs.createReadStream(file).pipe(res);
  } catch {
    const nf = path.join(ROOT, '404.html');
    if (fs.existsSync(nf)) { res.writeHead(404, { ...headersFor('/404.html'), 'content-type': TYPES['.html'] }); return fs.createReadStream(nf).pipe(res); }
    send(res, 404, 'not found', 'text/plain');
  }
});

server.listen(PORT, () => {
  console.log(`Hearth running:  http://localhost:${PORT}/   (app: /app/ → /product/, studio: /studio/, dashboard: /dashboard/)`);
  console.log(`Story engine: ${storyEngineReady() ? 'ready (Claude)' : 'offline — set ANTHROPIC_API_KEY to enable live story writing'}`);
});

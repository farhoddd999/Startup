// Hearth dev/demo server — zero dependencies.
//   node product/server/server.mjs            → http://localhost:8787/product/
// Serves the whole repository (app, studio, dashboard, website, pitch) and
// exposes the story engine at …/api/story (needs ANTHROPIC_API_KEY).

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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.endsWith('/api/story')) {
    if (req.method === 'GET') return send(res, 200, { ready: storyEngineReady() });
    if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
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
  // static files
  let p = decodeURIComponent(url.pathname);
  if (p === '/') { res.writeHead(302, { location: '/website/' }); return res.end(); }
  let file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) return send(res, 403, 'forbidden', 'text/plain');
  try {
    let st = fs.statSync(file);
    if (st.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { location: `${p}/` }); return res.end(); }
      file = path.join(file, 'index.html'); st = fs.statSync(file);
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'content-length': st.size });
    fs.createReadStream(file).pipe(res);
  } catch {
    send(res, 404, 'not found', 'text/plain');
  }
});

server.listen(PORT, () => {
  console.log(`Hearth running:  http://localhost:${PORT}/product/   (website: /website/, studio: /product/studio/, dashboard: /product/dashboard/)`);
  console.log(`Story engine: ${storyEngineReady() ? 'ready (Claude)' : 'offline — set ANTHROPIC_API_KEY to enable live story writing'}`);
});

// Partner dashboard — synthetic cohort, deterministic so screenshots are stable.
import { mulberry32 } from '../engine/simulate.js';

const $ = s => document.querySelector(s);
const css = v => getComputedStyle(document.querySelector('.viz-root')).getPropertyValue(v).trim();
const fmt = n => Number(n).toLocaleString();
const WEEKS = 12;

// ---- synthetic cohort -----------------------------------------------------
const FIRST = ['Rosa M.', 'Dee T.', 'Amir K.', 'Lupe G.', 'Tasha W.', 'Marco R.', 'Keisha B.', 'Ana P.', 'Jamal H.', 'Nora L.', 'Yesenia C.', 'Darnell J.', 'Mai N.', 'Carmen S.', 'Tyrone D.', 'Fatima A.', 'Luis O.', 'Brenda F.', 'Kim V.', 'Hector Q.', 'Shonda E.', 'Ivan Z.', 'Grace U.', 'Pedro I.', 'Latoya Y.', 'Sam X.', 'Maria D.', 'Andre C.', 'Leticia R.', 'Joe B.', 'Aisha M.', 'Ramon T.', 'Crystal N.', 'Hung P.', 'Destiny K.', 'Omar S.', 'Paula G.', 'Victor L.', 'Jada H.', 'Elena W.', 'Mike R.', 'Sofia A.', 'Trina J.', 'Ali F.', 'Rocio V.', 'Dana O.', 'Kofi E.', 'Lin Q.'];
const rnd = mulberry32(2026);
const families = FIRST.map((name, i) => {
  const joined = Math.floor(rnd() * 5);                 // joined during the first 5 weeks
  const engagement = 0.2 + rnd() * 0.75;                // chance of reading in a given week
  const dropsAt = rnd() < 0.22 ? joined + 3 + Math.floor(rnd() * 5) : Infinity; // some families drift away
  const startStep = Math.max(0, Math.round(rnd() * rnd() * 22));
  const weeks = [];
  let step = startStep;
  for (let w = 0; w < WEEKS; w++) {
    if (w < joined) { weeks.push(null); continue; }
    const p = w >= dropsAt ? engagement * 0.15 : engagement;
    const reads = rnd() < p;
    const nights = reads ? Math.max(1, Math.min(7, Math.round(2 + engagement * 4 + (rnd() - 0.5) * 2))) : 0;
    const practice = Math.round(nights * (5 + rnd() * 5));
    step = Math.min(40, step + nights * (0.09 + rnd() * 0.07));
    weeks.push({ nights, practice, step: Math.floor(step), readable: readableAt(step), words: nights * Math.round(55 + step * 4) });
  }
  const lastNight = (() => { for (let w = WEEKS - 1; w >= 0; w--) if (weeks[w]?.nights) return (WEEKS - 1 - w) * 7 + Math.floor(rnd() * 6); return 99; })();
  return { id: `F-${String(101 + i)}`, name, joined, startStep, weeks, lastNight };
});

// words-you-can-read curve by step (fit to the engine's real counts at each step)
function readableAt(step) {
  const pts = [[0, 0], [1, 10], [4, 51], [8, 148], [10, 226], [13, 403], [16, 462], [18, 801], [21, 1033], [25, 1316], [30, 1567], [34, 1995], [37, 3741], [40, 4534]];
  for (let k = 1; k < pts.length; k++) if (step <= pts[k][0]) { const [x0, y0] = pts[k - 1], [x1, y1] = pts[k]; return Math.round(y0 + (y1 - y0) * ((step - x0) / (x1 - x0))); }
  return 4534;
}

// ---- tooltip --------------------------------------------------------------
const tip = $('#tip');
function showTip(e, html) { tip.innerHTML = html; tip.classList.add('show'); const x = Math.min(window.innerWidth - 250, e.clientX + 14); tip.style.left = `${x}px`; tip.style.top = `${e.clientY + 14}px`; }
const hideTip = () => tip.classList.remove('show');

// ---- charts -----------------------------------------------------------------
function niceMax(v) { const p = 10 ** Math.floor(Math.log10(Math.max(v, 1))); return Math.ceil(v / p) * p; }

function lineChart(el, { series, labels, yMax, yFmt = fmt, height = 220, width = 640, xTitle }) {
  const W = width, H = height, L = 40, R = 70, T = 10, B = xTitle ? 38 : 26;
  const max = yMax || niceMax(Math.max(...series.flatMap(s => s.values.filter(v => v != null))));
  const x = i => L + (i / (labels.length - 1)) * (W - L - R);
  const y = v => T + (1 - v / max) * (H - T - B);
  let g = '';
  for (let k = 0; k <= 4; k++) { const v = (max / 4) * k; g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="${css('--grid')}" stroke-width="1"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${yFmt(v)}</text>`; }
  labels.forEach((lb, i) => { if (labels.length <= 13 || i % 2 === 0) g += `<text x="${x(i)}" y="${H - B + 16}" text-anchor="middle">${lb}</text>`; });
  if (xTitle) g += `<text x="${(L + W - R) / 2}" y="${H - 4}" text-anchor="middle">${xTitle}</text>`;
  series.forEach((s, si) => {
    const pts = s.values.map((v, i) => (v == null ? null : [x(i), y(v)])).filter(Boolean);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    if (s.area) g += `<path d="${d} L${pts[pts.length - 1][0]} ${y(0)} L${pts[0][0]} ${y(0)}Z" fill="${css('--series-1-wash')}"/>`;
    g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    const last = pts[pts.length - 1], lv = s.values.filter(v => v != null).slice(-1)[0];
    g += `<circle cx="${last[0]}" cy="${last[1]}" r="4.5" fill="${s.color}" stroke="${css('--surface-1')}" stroke-width="2"/>`;
    g += `<text class="lbl-strong" x="${last[0] + 9}" y="${last[1] + 4 + (series.length > 1 && si === 1 ? 2 : 0)}">${yFmt(lv)}${series.length > 1 ? ` ${s.short || ''}` : ''}</text>`;
  });
  g += `<line class="xhair" x1="0" x2="0" y1="${T}" y2="${H - B}" stroke="${css('--text-muted')}" stroke-width="1" opacity="0"/>`;
  g += `<rect class="hit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent"/>`;
  el.innerHTML = (series.length > 1 ? `<div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}</div>` : '') + `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${series.map(s => s.name).join(', ')}">${g}</svg>`;
  const svg = el.querySelector('svg'), hair = svg.querySelector('.xhair');
  svg.querySelector('.hit').addEventListener('mousemove', e => {
    const r = svg.getBoundingClientRect(); const sx = ((e.clientX - r.left) / r.width) * W;
    const i = Math.max(0, Math.min(labels.length - 1, Math.round(((sx - L) / (W - L - R)) * (labels.length - 1))));
    hair.setAttribute('x1', x(i)); hair.setAttribute('x2', x(i)); hair.setAttribute('opacity', '.5');
    showTip(e, `<b>${labels[i]}</b>${series.map(s => `${s.name}: ${s.values[i] == null ? '—' : yFmt(s.values[i])}`).join('<br>')}`);
  });
  svg.querySelector('.hit').addEventListener('mouseleave', () => { hair.setAttribute('opacity', '0'); hideTip(); });
}

function columnChart(el, { values, labels, color, height = 200, unit = 'families', horizontal = false }) {
  const W = 640, H = horizontal ? 34 * values.length + 16 : height;
  const max = niceMax(Math.max(...values));
  let g = '';
  if (horizontal) {
    const L = 120, R = 40;
    values.forEach((v, i) => {
      const w = (v / max) * (W - L - R), yy = 8 + i * 34;
      g += `<text x="${L - 10}" y="${yy + 15}" text-anchor="end">${labels[i]}</text>`;
      g += `<path d="M${L} ${yy + 4} h${Math.max(0, w - 4)} a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-${Math.max(0, w - 4)}z" fill="${color}"/>`;
      g += `<text class="lbl-strong" x="${L + w + 8}" y="${yy + 16}">${v}</text>`;
      g += `<rect class="hit" data-i="${i}" x="0" y="${yy}" width="${W}" height="28" fill="transparent"/>`;
    });
  } else {
    const L = 34, R = 10, T = 14, B = 26, band = (W - L - R) / values.length, bw = Math.min(24, band * 0.6);
    for (let k = 0; k <= 4; k++) { const v = (max / 4) * k, yy = T + (1 - v / max) * (H - T - B); g += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="${css('--grid')}"/><text x="${L - 6}" y="${yy + 4}" text-anchor="end">${fmt(v)}</text>`; }
    values.forEach((v, i) => {
      const cx = L + band * i + band / 2, hgt = (v / max) * (H - T - B), y0 = H - B;
      if (hgt > 0) g += `<path d="M${cx - bw / 2} ${y0} v-${Math.max(0, hgt - 4)} a4 4 0 0 1 4 -4 h${bw - 8} a4 4 0 0 1 4 4 v${Math.max(0, hgt - 4)}z" fill="${color}"/>`;
      g += `<text x="${cx}" y="${H - 8}" text-anchor="middle">${labels[i]}</text>`;
      g += `<rect class="hit" data-i="${i}" x="${cx - band / 2}" y="${T}" width="${band}" height="${H - T - B}" fill="transparent"/>`;
    });
  }
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
  el.querySelectorAll('.hit').forEach(r => {
    r.addEventListener('mousemove', e => { const i = +r.dataset.i; showTip(e, `<b>${labels[i]}</b>${values[i]} ${unit}`); });
    r.addEventListener('mouseleave', hideTip);
  });
}

function spark(values, color, w = 90, h = 24) {
  const v = values.filter(x => x != null);
  if (v.length < 2) return '';
  const max = Math.max(...v, 1), min = Math.min(...v, 0);
  const pts = v.map((x, i) => `${(i / (v.length - 1)) * (w - 6) + 3},${h - 3 - ((x - min) / (max - min || 1)) * (h - 6)}`).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

// ---- render ---------------------------------------------------------------
let range = 12;
function render() {
  const from = WEEKS - range;
  const weekLabels = Array.from({ length: WEEKS }, (_, i) => `Wk ${i + 1}`);
  const inRange = (f, w) => w >= from && f.weeks[w];
  const activeByWeek = weekLabels.map((_, w) => families.filter(f => f.weeks[w]?.nights > 0).length);
  const enrolledByWeek = weekLabels.map((_, w) => families.filter(f => f.weeks[w]).length);
  const nights = families.reduce((n, f) => n + f.weeks.reduce((m, wk, w) => m + (inRange(f, w) ? wk.nights : 0), 0), 0);
  const words = families.reduce((n, f) => n + f.weeks.reduce((m, wk, w) => m + (inRange(f, w) ? wk.words : 0), 0), 0);
  const gains = families.map(f => { const ws = f.weeks.filter(Boolean); return ws.length ? ws[ws.length - 1].step - f.startStep : 0; }).sort((a, b) => a - b);
  const median = a => a[Math.floor(a.length / 2)];
  const readableGain = families.map(f => { const ws = f.weeks.filter(Boolean); return ws.length ? ws[ws.length - 1].readable - readableAt(f.startStep) : 0; }).sort((a, b) => a - b);
  const activeNow = activeByWeek[WEEKS - 1];
  const tiles = [
    { label: 'Families enrolled', value: fmt(families.length), delta: `${enrolledByWeek[WEEKS - 1]} active accounts`, trend: enrolledByWeek },
    { label: 'Reading together this week', value: fmt(activeNow), delta: `${Math.round((activeNow / families.length) * 100)}% of families`, trend: activeByWeek },
    { label: 'Story-time nights', value: fmt(nights), delta: `last ${range === 12 ? '12' : range} weeks` },
    { label: 'Words read aloud to children', value: words >= 10000 ? `${(words / 1000).toFixed(1)}K` : fmt(words), delta: `last ${range === 12 ? '12' : range} weeks` },
    { label: 'Median sounds gained', value: `+${median(gains)} steps`, delta: `+${fmt(median(readableGain))} readable words` },
  ];
  $('#tiles').innerHTML = tiles.map(t => `<div class="tile"><div class="label">${t.label}</div><div class="value">${t.value}</div><div class="delta">${t.delta}</div>${t.trend ? spark(t.trend.slice(from), css('--series-1'), 200, 26).replace('width="200"', 'width="100%"').replace('<svg ', '<svg preserveAspectRatio="none" ') : ''}</div>`).join('');

  lineChart($('#cActive'), { series: [{ name: 'Families reading together', values: activeByWeek.map((v, i) => (i < from ? null : v)), color: css('--series-1'), area: true }], labels: weekLabels, yMax: niceMax(families.length), width: 1100, height: 230 });

  // growth by weeks since joining, two halves of the cohort by starting point
  const since = Array.from({ length: 9 }, (_, k) => k);
  const med = (group, k) => { const vals = group.map(f => f.weeks[f.joined + k]?.readable).filter(v => v != null).sort((a, b) => a - b); return vals.length >= 3 ? median(vals) : null; };
  const full = families.filter(f => f.joined <= 3); // same families in every week of the chart
  const early = full.filter(f => f.startStep < 8), later = full.filter(f => f.startStep >= 8);
  lineChart($('#cGrowth'), {
    series: [
      { name: 'Started at steps 0–7', short: '', values: since.map(k => med(early, k)), color: css('--series-2') },
      { name: 'Started at step 8+', short: '', values: since.map(k => med(later, k)), color: css('--series-3') },
    ],
    labels: since.map(k => `${k}`), xTitle: 'weeks since joining',
  });

  const bands = [[0, 6, 'Steps 1–6'], [7, 13, 'Steps 7–13'], [14, 18, 'Steps 14–18'], [19, 25, 'Steps 19–25'], [26, 33, 'Steps 26–33'], [34, 40, 'Steps 34–40']];
  const cur = f => { const ws = f.weeks.filter(Boolean); return ws.length ? ws[ws.length - 1].step : f.startStep; };
  columnChart($('#cSteps'), { values: bands.map(([a, b]) => families.filter(f => cur(f) >= a && cur(f) <= b).length), labels: bands.map(b => b[2]), color: css('--series-2'), horizontal: true });

  const avgNights = families.map(f => { const ws = f.weeks.filter((wk, w) => inRange(f, w)); return ws.length ? ws.reduce((n, wk) => n + wk.nights, 0) / ws.length : 0; });
  const buckets = ['0', '1', '2', '3', '4', '5', '6–7'];
  columnChart($('#cNights'), { values: buckets.map((_, k) => avgNights.filter(a => (k === 6 ? a >= 5.5 : Math.round(a) === k)).length), labels: buckets, color: css('--series-1') });

  const quiet = families.filter(f => f.lastNight >= 7).sort((a, b) => b.lastNight - a.lastNight);
  $('#tCheck').innerHTML = `<thead><tr><th>Family</th><th>Last story time</th><th>Nights (last 4 wks)</th><th>Joined</th><th></th></tr></thead><tbody>${quiet.map(f => `<tr><td>${f.name}</td><td>${f.lastNight >= 99 ? 'not yet' : `${f.lastNight} days ago`}</td><td class="num">${f.weeks.slice(-4).reduce((n, w) => n + (w?.nights || 0), 0)}</td><td>Week ${f.joined + 1}</td><td><span class="pill warn">⚑ check in</span></td></tr>`).join('') || '<tr><td colspan="5">Everyone has read this week.</td></tr>'}</tbody>`;

  $('#tAll').innerHTML = `<thead><tr><th>Family</th><th>ID</th><th>Current step</th><th>Words they can read</th><th>Nights / week</th><th>Weekly nights</th></tr></thead><tbody>${families.map((f, i) => {
    const ws = f.weeks.filter(Boolean); const last = ws[ws.length - 1];
    return `<tr><td>${f.name}</td><td class="num">${f.id}</td><td class="num">${last ? last.step : f.startStep}</td><td class="num">${fmt(last ? last.readable : 0)} <span style="color:var(--text-muted)">(+${fmt((last ? last.readable : 0) - readableAt(f.startStep))})</span></td><td class="num">${avgNights[i].toFixed(1)}</td><td>${spark(f.weeks.map(w => w?.nights ?? null), css('--series-1'))}</td></tr>`;
  }).join('')}</tbody>`;
}

document.querySelectorAll('[data-range]').forEach(b => b.onclick = () => {
  range = +b.dataset.range;
  document.querySelectorAll('[data-range]').forEach(x => x.classList.toggle('on', x === b));
  render();
});
$('#export').onclick = () => {
  const rows = [['family_id', 'display_name', 'joined_week', 'start_step', 'current_step', 'readable_words_start', 'readable_words_now', 'nights_total', 'practice_minutes_total', 'words_read_aloud']];
  for (const f of families) {
    const ws = f.weeks.filter(Boolean), last = ws[ws.length - 1];
    rows.push([f.id, f.name, f.joined + 1, f.startStep, last?.step ?? f.startStep, readableAt(f.startStep), last?.readable ?? 0, ws.reduce((n, w) => n + w.nights, 0), ws.reduce((n, w) => n + w.practice, 0), ws.reduce((n, w) => n + w.words, 0)]);
  }
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([`# Hearth partner report (DEMO DATA, synthetic)\n${csv}`], { type: 'text/csv' }));
  a.download = 'hearth-riverside-fall-2026-DEMO.csv';
  a.click();
};
render();
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', render);

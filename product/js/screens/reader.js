// The reader: practice (just the parent, a coach that listens) and story time
// (the parent reads to their child; hints are quiet; talk prompts appear).
//
// Pipeline per page:  voice/demo transcript → PageTracker → word states + hint
// level → UI; on page end → learner.observe() for every word.

import { h, icon, sayButton, fmt } from '../ui.js';
import { t } from '../i18n.js';
import { getState, update, storyRecord, saveRecording, getRecording } from '../store.js';
import { speak, sayWord, readAloud, stopSpeaking, createRecognizer, createSimulatedReader, recognitionAvailable } from '../voice.js';
import { renderScene } from '../art.js';
import { findStory, prepare, watchWords, storyWordCount, getLexicon } from '../stories.js';
import { PageTracker, spokenTokens } from '../../engine/tracker.js';
import { observe, workingStep } from '../../engine/learner.js';
import { chunksFor } from '../../engine/decodable.js';
import { PATTERN_INFO, STEPS } from '../../engine/phonics.js';
import { readableCount } from './sky.js';

let lastSession = null;   // handed to the finish screen

export function render(root, { id, mode }) {
  const st = getState();
  const story = findStory(id);
  if (!story) { location.hash = '#/home'; return; }
  const P = prepare(story);
  const fam = st.family;
  const story_mode = mode === 'story';
  if (mode === 'listen') return renderListen(root, P);
  if (story_mode) root.classList.add('bedtime');

  const micMode = st.settings.mic === 'voice' && !recognitionAvailable() ? 'tap' : st.settings.mic;
  const results = P.pages.map(() => null);
  const seenToday = new Set();
  const started = Date.now();
  let pageIdx = 0, tracker = null, sim = null, tickTimer = null, speaking = false, listening = false;
  let rec = null, baseCount = 0, lastTokens = 0, modelRead = null, hintFor = -1, spokeLevel3 = -1;
  let recorder = null, recordOn = false, recChunks = [];

  // ---- persistent voice recogniser (offset per page) ----
  if (micMode === 'voice') {
    rec = createRecognizer({
      onText: (fin, interim) => {
        const toks = spokenTokens(`${fin} ${interim}`);
        lastTokens = toks.length;
        if (speaking || !tracker) { baseCount = toks.length; return; }
        handleEvents(tracker.update(toks.slice(baseCount).join(' ')));
      },
      onState: s => { listening = s === 'listening'; if (tracker) tracker.listening = listening; paintMic(); },
      onError: () => { listening = false; paintMic(); },
    });
  }

  // ---- layout ----
  const art = h('div.page-art');
  const textEl = h('div.page-text', { 'aria-live': 'polite' });
  const talkSlot = h('div');
  const dotsEl = h('div.pagedots');
  const modeChip = h('span.mode-chip', h('span.dot'), story_mode ? t('mode_story') : t('mode_practice'));
  const micBtn = h('button.mic', { 'aria-label': t('read'), say: t('read'), onclick: () => toggleListen() }, icon(micMode === 'tap' ? 'hand' : micMode === 'demo' ? 'play' : 'mic'));
  const micLabel = h('div.mic-label');
  const nextBtn = h('button.ctl.next', { say: t('next'), onclick: () => nextPage() }, h('span', t('next')), icon('next'));
  const leftBtn = story_mode
    ? h('button.ctl', { say: t('talk'), onclick: () => showTalk(true) }, icon('chat'), h('span', t('talk_btn')))
    : h('button.ctl', { say: t('listen'), onclick: () => listenModel() }, icon('speaker'), h('span', t('listen')));
  const recBtn = story_mode && 'MediaRecorder' in window
    ? h('button.icon-btn.rec-btn', { 'aria-label': t('record'), say: t('record'), onclick: () => { recordOn = !recordOn; recBtn.classList.toggle('saying', recordOn); if (recordOn) startRecording(); else stopRecording(); } }, icon('record'))
    : h('span', { style: { width: '48px' } });

  const scr = h('div.screen.reader',
    h('div.topbar',
      h('button.icon-btn', { 'aria-label': t('close'), say: t('close'), onclick: () => { location.hash = '#/home'; } }, icon('close')),
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 } }, modeChip, dotsEl),
      recBtn,
    ),
    art, textEl, talkSlot,
    h('div.controls', leftBtn, h('div', micBtn, micLabel), nextBtn),
  );
  root.append(scr);

  // ---- page rendering ----
  function showPage(i) {
    stopPageActivity();
    pageIdx = i;
    const page = P.pages[i];
    hintFor = -1; spokeLevel3 = -1;
    art.innerHTML = renderScene(page.scene, fam.look, { title: page.text });
    if (recordOn) art.append(h('span.rec', icon('record'), t('recording')));
    dotsEl.innerHTML = '';
    P.pages.forEach((_, k) => dotsEl.append(h(`i${k === i ? '.on' : k < i ? '.done' : ''}`)));
    textEl.innerHTML = '';
    for (const tok of page.tokens) {
      if (tok.t === 'w') {
        const w = page.words[tok.wi];
        const span = h(`span.w${w.lenient ? '.name' : ''}`, { 'data-wi': tok.wi, role: 'button', tabindex: 0, 'aria-label': w.text }, w.text);
        span.addEventListener('click', e => { if (e.target.closest('.hint')) return; wordTapped(tok.wi); });
        textEl.append(span);
      } else textEl.append(tok.text);
    }
    talkSlot.innerHTML = '';
    tracker = new PageTracker(page.words.map(w => ({ norm: w.norm, text: w.text, lenient: w.lenient })));
    tracker.listening = listening || micMode === 'demo';
    baseCount = lastTokens;
    nextBtn.classList.remove('ready');
    paintWords();
    if (recordOn) startRecording();
    // start following the reader
    if (micMode === 'voice' && rec && !rec.active) { rec.start(); }
    if (micMode === 'demo') setTimeout(() => { if (pageIdx === i && !tracker.done) startDemo(); }, 900);
    tickTimer = setInterval(tick, 200);
    paintMic();
  }

  function stopPageActivity() {
    clearInterval(tickTimer);
    sim?.stop(); sim = null;
    modelRead?.cancel(); modelRead = null;
    stopRecording();
    closeHint();
  }

  function startDemo() {
    const page = P.pages[pageIdx];
    // The demo parent stumbles where a real one would: the page's hardest words for this learner.
    const L = getState().learner;
    const difficulty = w => (w.lenient || !w.a || w.text.length < 3) ? 0 : (1 - Math.min(...w.a.patterns.map(p => L.p[p] ?? 1))) + w.a.decodeStep / 100;
    const ranked = page.words.map((w, k) => [k, difficulty(w)]).sort((a, b) => b[1] - a[1]);
    const hardSet = new Set(ranked.slice(0, story_mode ? 0 : 1).filter(([, d]) => d > 0).map(([k]) => k));
    const words = page.words.map((w, k) => ({ ...w, hard: hardSet.has(k) && (pageIdx % 2 === 0 || w.focus) }));
    tracker.listening = true;
    sim = createSimulatedReader({
      words, seed: 31 + pageIdx * 7 + (story_mode ? 101 : 0), struggle: story_mode ? 0.25 : 0.85,
      onText: (fin, interim) => handleEvents(tracker.update(fin, interim)),
      onState: s => { listening = s === 'listening'; paintMic(); },
    });
    tracker.resetClock();
    sim.start();
    paintMic();
  }

  function toggleListen() {
    if (micMode === 'tap') { markPageRead(); return; }
    if (micMode === 'demo') { if (sim?.active) { sim.stop(); } else if (!tracker.done) startDemo(); return; }
    if (!rec) return;
    if (rec.active) { rec.stop(); listening = false; } else { baseCount = lastTokens; rec.start(); }
    tracker.listening = rec.active;
    tracker.resetClock();
    paintMic();
  }

  function paintMic() {
    const live = micMode === 'demo' ? !!sim?.active : listening;
    micBtn.classList.toggle('live', live);
    modeChip.classList.toggle('live', live);
    micLabel.textContent = micMode === 'tap' ? t('done') : micMode === 'demo' ? (live ? 'Demo reader' : t('read')) : (live ? t('place_listening') : t('read'));
  }

  // ---- tracker events → words, learner ----
  function handleEvents(events) {
    if (!events?.length) return;
    paintWords();
    if (tracker.done) pageDone();
  }

  function paintWords() {
    const page = P.pages[pageIdx];
    const cur = tracker.current;
    textEl.querySelectorAll('.w').forEach(span => {
      const wi = +span.dataset.wi;
      const s = tracker.state[wi];
      span.classList.toggle('read', s.status === 'read');
      span.classList.toggle('skipped', s.status === 'skipped');
      span.classList.toggle('helped', s.quality === 'helped');
      span.classList.toggle('current', wi === cur && (listening || micMode === 'demo'));
      if (s.status !== 'unread' && span.classList.contains('chunked')) unchunk(span, page.words[wi]);
    });
    if (hintFor >= 0 && tracker.state[hintFor].status !== 'unread') closeHint();
  }

  function tick() {
    if (!tracker || tracker.done || speaking) return;
    const level = tracker.tick();
    const cur = tracker.current;
    if (cur < 0) return;
    const w = P.pages[pageIdx].words[cur];
    const span = textEl.querySelector(`.w[data-wi="${cur}"]`);
    if (!span || w.lenient) return;
    if (level >= 1 && !span.classList.contains('chunked')) chunk(span, w);
    if (level >= 2 && hintFor !== cur) openHint(cur, span, w);
    if (level >= 3 && spokeLevel3 !== cur) {
      spokeLevel3 = cur;
      if (!story_mode || st.settings.whisperHints) say(() => sayWord(w.text));
      // In demo, the "parent" repeats after the coach; with a real voice the tracker hears them.
    }
  }

  function chunk(span, w) {
    const chunks = chunksFor(w.text, getLexicon());
    const hot = hottestChunk(chunks);
    span.innerHTML = '';
    chunks.forEach((c, k) => span.append(h(`span.ch${k === hot ? '.hot' : ''}${c.split || c.close ? '.split' : ''}`, c.g)));
    span.classList.add('chunked');
  }
  function unchunk(span, w) { span.classList.remove('chunked'); span.textContent = w.text; }

  /** The chunk most likely to be the sticking point: least-known pattern for this learner. */
  function hottestChunk(chunks) {
    const L = getState().learner;
    let best = -1, bestP = 2;
    chunks.forEach((c, k) => { const p = L.p[c.pat]; if (p !== undefined && p < bestP && !c.close) { bestP = p; best = k; } });
    return best;
  }

  function openHint(wi, span, w) {
    closeHint();
    hintFor = wi;
    const chunks = chunksFor(w.text, getLexicon());
    const hot = hottestChunk(chunks);
    const box = h('div.hint', { role: 'dialog', 'aria-label': t('hint_sounds') },
      h('div.chunks', chunks.filter(c => !c.close).map(c => {
        const info = PATTERN_INFO[c.pat] || {};
        const k = chunks.indexOf(c);
        return h(`button.chunk${k === hot ? '.hot' : ''}`, {
          type: 'button', 'aria-label': info.key || c.g,
          onclick: e => { e.stopPropagation(); if (info.key) say(() => speak(info.key, { lang: 'en', rate: 0.8 })); },
        }, h('span.g', displayChunk(c, chunks)), h('span.e', info.pic || '💛'));
      })),
      h('div.actions',
        h('button', { type: 'button', onclick: e => { e.stopPropagation(); giveWord(wi, w); } }, icon('speaker'), t('hint_hear')),
        micMode === 'tap' || story_mode ? h('button.alt', { type: 'button', onclick: e => { e.stopPropagation(); acceptWord(wi); } }, icon('check')) : null,
      ),
    );
    span.append(box);
    // keep the bubble on screen
    const r = span.getBoundingClientRect(), pr = textEl.getBoundingClientRect();
    if (r.left - pr.left < 110) box.classList.add('edge-l');
    else if (pr.right - r.right < 110) box.classList.add('edge-r');
    if (r.top - art.getBoundingClientRect().top < 60) box.classList.add('low');
  }
  function closeHint() { textEl.querySelectorAll('.hint').forEach(n => n.remove()); hintFor = -1; }
  function displayChunk(c, chunks) {
    if (c.split) { const close = chunks.find(x => x.close); return close ? `${c.g}_${close.g}` : c.g; }
    return c.g;
  }

  function wordTapped(wi) {
    const page = P.pages[pageIdx];
    const w = page.words[wi];
    const span = textEl.querySelector(`.w[data-wi="${wi}"]`);
    if (w.lenient) { say(() => speak(w.text, { lang: 'en' })); return; }
    if (wi === tracker.current) { tracker.escalate(); tracker.escalate(); }
    if (!span.classList.contains('chunked') && tracker.state[wi].status === 'unread') chunk(span, w);
    openHint(wi, span, w);
  }

  function giveWord(wi, w) {
    if (wi === tracker.current) { tracker.state[wi].hint = 3; }
    say(() => sayWord(w.text, { twice: !story_mode }));
    if (micMode === 'tap') acceptWord(wi, 'helped');
  }

  function acceptWord(wi, quality) {
    if (wi !== tracker.current) { closeHint(); return; }
    const q = quality || (tracker.state[wi].hint >= 2 ? 'helped' : 'effortful');
    tracker.markCurrent(q);
    closeHint();
    paintWords();
    if (tracker.done) pageDone();
  }

  function markPageRead() {
    // tap mode: the parent tells us they finished the page; words they didn't ask about count as read
    while (!tracker.done) tracker.markCurrent(tracker.state[tracker.current].hint >= 2 ? 'helped' : 'effortful');
    paintWords();
    pageDone();
  }

  async function say(fn) {
    speaking = true;
    try { await fn(); } finally { setTimeout(() => { speaking = false; tracker?.resetClock(); }, 250); }
  }

  // ---- end of page ----
  function pageDone() {
    if (results[pageIdx]) return;
    const page = P.pages[pageIdx];
    results[pageIdx] = tracker.state.map(s => s.quality);
    const lx = getLexicon();
    update(s => {
      page.words.forEach((w, wi) => {
        if (w.lenient || !w.a || results[pageIdx][wi] === 'unreached') return;
        const first = !seenToday.has(w.norm);
        seenToday.add(w.norm);
        observe(s.learner, lx.analyze(w.norm), results[pageIdx][wi], { firstTimeToday: first && !story_mode });
      });
    });
    nextBtn.classList.add('ready');
    paintMic();
    if (story_mode || page.talk) showTalk(story_mode);
    if (recordOn) setTimeout(stopRecording, 600);
  }

  function showTalk(sayIt) {
    const page = P.pages[pageIdx];
    if (!page.talk) return;
    talkSlot.innerHTML = '';
    talkSlot.append(h('div.talk', icon('chat', 'ic ic-chat'), h('div', { style: { flex: 1 } }, h('b', story_mode ? t('talk') : 'Tonight you can ask'), page.talk), sayButton(page.talk)));
    if (sayIt && st.settings.whisperHints) speak(page.talk, { lang: 'en', rate: 0.95 });
  }

  function listenModel() {
    if (modelRead) { modelRead.cancel(); modelRead = null; return; }
    const page = P.pages[pageIdx];
    const spans = [...textEl.querySelectorAll('.w')];
    speaking = true;
    modelRead = readAloud(page.words, { onWord: i => spans.forEach((s, k) => s.classList.toggle('model', k === i)) });
    modelRead.promise.then(() => { spans.forEach(s => s.classList.remove('model')); modelRead = null; setTimeout(() => { speaking = false; baseCount = lastTokens; tracker?.resetClock(); }, 300); });
  }

  function nextPage() {
    if (!results[pageIdx]) {
      // Turning the page early (a sleepy child, a busy night) is not evidence about reading:
      // words never reached are recorded as 'unreached' and left out of the learner model.
      while (!tracker.done) tracker.markCurrent('unreached');
      pageDone();
    }
    if (pageIdx < P.pages.length - 1) showPage(pageIdx + 1);
    else finishSession();
  }

  function finishSession() {
    stopPageActivity();
    rec?.stop();
    const q = { fluent: 0, effortful: 0, helped: 0, skipped: 0 };
    results.forEach(r => r?.forEach(x => { if (x && x in q) q[x]++; }));
    const words = storyWordCount(P);
    const watch = watchWords(P, results);
    const today = new Date().toDateString();
    update(s => {
      const r = storyRecord(story.id);
      r.lastAt = Date.now();
      if (story_mode) {
        r.readTogether++;
        s.stats.nightDates ||= [];
        if (!s.stats.nightDates.includes(today)) { s.stats.nightDates.push(today); s.stats.nights += 1; }
        s.stats.wordsAloud += words;
      } else {
        r.practiced++;
        s.stats.practiceMs += Date.now() - started;
      }
      s.history.push({ at: Date.now(), id: story.id, mode, words, q, readable: readableCount(s.learner) });
      if (s.history.length > 400) s.history.shift();
    });
    lastSession = { id: story.id, mode, q, words, watch, step: workingStep(getState().learner) };
    location.hash = `#/done/${story.id}/${mode}`;
  }

  // ---- recording the parent's voice (story time) ----
  async function startRecording() {
    if (recorder) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recChunks = [];
      recorder = new MediaRecorder(stream);
      const forPage = pageIdx;
      recorder.ondataavailable = e => recChunks.push(e.data);
      recorder.onstop = () => { stream.getTracks().forEach(tr => tr.stop()); if (recChunks.length) saveRecording(story.id, forPage, new Blob(recChunks, { type: recorder?.mimeType || 'audio/webm' })); recorder = null; };
      recorder.start();
      if (!art.querySelector('.rec')) art.append(h('span.rec', icon('record'), t('recording')));
    } catch { recordOn = false; recBtn.classList?.remove('saying'); }
  }
  function stopRecording() { try { if (recorder && recorder.state !== 'inactive') recorder.stop(); } catch { /* ignore */ } art.querySelector('.rec')?.remove(); }

  showPage(0);
  return () => { stopPageActivity(); rec?.stop(); stopSpeaking(); };
}

// ---- playback of the parent's recorded reading (for nights they work late) ----
function renderListen(root, P) {
  root.classList.add('bedtime');
  const fam = getState().family;
  let i = 0, audio = null, stopped = false;
  const art = h('div.page-art');
  const text = h('div.page-text');
  const dotsEl = h('div.pagedots');
  const scr = h('div.screen.reader',
    h('div.topbar', h('button.icon-btn', { 'aria-label': t('close'), onclick: () => { location.hash = '#/home'; } }, icon('close')),
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 } }, h('span.mode-chip.live', h('span.dot'), t('recorded_by', { grownup: fam.grownup })), dotsEl), h('span', { style: { width: '48px' } })),
    art, text);
  root.append(scr);
  async function play(k) {
    if (stopped) return;
    if (k >= P.pages.length) { location.hash = '#/home'; return; }
    i = k;
    const page = P.pages[k];
    art.innerHTML = renderScene(page.scene, fam.look);
    text.textContent = page.text;
    dotsEl.innerHTML = ''; P.pages.forEach((_, n) => dotsEl.append(h(`i${n === k ? '.on' : n < k ? '.done' : ''}`)));
    const blob = await getRecording(P.id, k);
    if (!blob) { setTimeout(() => play(k + 1), 2500); return; }
    audio = new Audio(URL.createObjectURL(blob));
    audio.onended = () => setTimeout(() => play(k + 1), 1200);
    audio.play().catch(() => setTimeout(() => play(k + 1), 2500));
  }
  play(0);
  return () => { stopped = true; audio?.pause(); };
}

// ---- finish screens ----------------------------------------------------------
export function finish(root, { id, mode }) {
  const st = getState();
  const fam = st.family;
  const story = findStory(id);
  const s = lastSession && lastSession.id === id ? lastSession : null;
  const vars = { child: fam.childName, n: st.stats.nights };
  if (mode === 'story') {
    root.classList.add('bedtime');
    speak(t('goodnight_say', vars));
    root.append(h('div.screen.goodnight',
      h('div.moon', { html: `<svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="66" fill="#F7E7A8" opacity=".12"/><circle cx="70" cy="70" r="50" fill="#F7E7A8" opacity=".18"/><circle cx="70" cy="70" r="36" fill="#F8EBC3"/><circle cx="60" cy="62" r="6" fill="#EADBA6"/><circle cx="80" cy="80" r="8" fill="#EADBA6"/></svg>` }),
      h('h1', t('goodnight', vars)),
      h('p', { style: { fontSize: '20px', opacity: .85 } }, t('goodnight_sub', vars)),
      s ? h('p', { style: { opacity: .7 } }, `${fmt(s.words)} words read aloud tonight.`) : null,
      h('div', { style: { height: '20px' } }),
      h('button.btn.primary', { onclick: () => { location.hash = '#/home'; } }, h('span.grow', t('done')), icon('check')),
    ));
    return;
  }
  // practice finish
  speak(t('finish_practice_say'));
  const lx = getLexicon();
  const watch = s?.watch || [];
  const ws = workingStep(st.learner);
  const step = STEPS[ws - 1];
  const newPat = step.patterns.find(p => PATTERN_INFO[p]) || step.patterns[0];
  const info = PATTERN_INFO[newPat] || {};
  const q = s?.q || { fluent: 0, effortful: 0, helped: 0, skipped: 0 };
  const total = q.fluent + q.effortful + q.helped + q.skipped;
  const onOwn = q.fluent + q.effortful;
  root.append(h('div.screen.finish',
    h('div.topbar', h('button.icon-btn', { 'aria-label': t('close'), onclick: () => { location.hash = '#/home'; } }, icon('close')), h('span'), sayButton(t('finish_practice_say'))),
    h('div.stars-burst', icon('star'), icon('star'), icon('star')),
    h('h1', { style: { textAlign: 'center' } }, t('finish_practice_title')),
    h('div.summary', total
      ? `You read ${fmt(onOwn)} of ${fmt(total)} words on your own${q.helped ? `, and ${q.helped} with a hand from Hearth` : ''}. That's exactly how reading grows.`
      : 'Practice done.'),
    watch.length ? h('div.label', t('watch_words')) : null,
    watch.length ? h('div.watch', watch.map(w => {
      const chunks = chunksFor(w.text, lx);
      const L = st.learner;
      let hot = -1, bp = 2; chunks.forEach((c, k) => { const p = L.p[c.pat]; if (p !== undefined && p < bp && !c.close) { bp = p; hot = k; } });
      return h('button', { onclick: () => sayWord(w.text, { twice: true }) },
        h('span.wd', chunks.map((c, k) => h(`span${k === hot ? '.hot' : ''}`, c.g))),
        h('span.hear', icon('speaker'), t('hint_hear')));
    })) : null,
    h('div.newsound', h('span.emo', info.pic || '⭐'), h('div', h('div.small.muted', t('new_sound')), h('span.g', info.label || ''), h('span.muted', info.key ? `  as in “${info.key}”` : '')), h('span.spacer'), sayButton(info.key || '')),
    h('div.spacer'),
    h('button.btn.primary', { onclick: () => { location.hash = `#/read/${id}/story`; } }, icon('moon'), h('span.grow', t('read_now', { child: fam.childName })), icon('next')),
    h('button.btn.ghost', { onclick: () => { location.hash = '#/home'; } }, h('span.grow', t('later'))),
  ));
  void story;
}

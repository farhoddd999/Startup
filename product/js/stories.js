// Story selection & preparation for one family.

import { STORIES } from '../data/stories.js';
import { TALK_ES } from '../data/talk-es.js';
import { personalize, tokenize, baseForm } from '../engine/text.js';
import { analyzeText, validateStory } from '../engine/decodable.js';
import { isBlocked } from '../engine/safety.js';
import { workingStep } from '../engine/learner.js';
import { getState } from './store.js';

let lexicon = null;
export const setLexicon = lx => { lexicon = lx; };
export const getLexicon = () => lexicon;

export function allStories() {
  return [...STORIES, ...(getState().generated || [])];
}
export const findStory = id => allStories().find(s => s.id === id);

export function familyWords(family) {
  const w = [family.childName, family.grownup].filter(Boolean).map(x => x.toLowerCase());
  return [...new Set(w.flatMap(x => x.split(/\s+/)))];
}

/** Tonight's story: the hardest story the parent is ready for that they haven't read together yet. */
export function pickTonight(state = getState()) {
  const ws = workingStep(state.learner);
  const ready = allStories().filter(s => s.step <= ws).sort((a, b) => b.step - a.step);
  const fresh = ready.find(s => !(state.stories[s.id]?.readTogether));
  if (fresh) return fresh;
  const byLeastRecent = [...ready].sort((a, b) => (state.stories[a.id]?.lastAt || 0) - (state.stories[b.id]?.lastAt || 0));
  return byLeastRecent[0] || allStories()[0];
}

/**
 * Prepare a story for reading: personalise, tokenise, analyse each page for
 * this reader, and mark which words are worth a look ("watch words").
 */
export function prepare(story, state = getState()) {
  const family = state.family;
  const known = familyWords(family);
  const step = Math.max(workingStep(state.learner), story.step);
  const pages = story.pages.map((p, pi) => {
    const text = personalize(p.text, family);
    const an = analyzeText(text, lexicon, { step, known });
    const tokens = an.tokens;
    const words = tokens.filter(t => t.t === 'w').map(t => ({
      text: t.text, norm: t.norm, wi: t.wi, status: t.status, a: t.a || null,
      lenient: t.status === 'name' || known.includes(baseForm(t.norm)),
      focus: t.status === 'focus',
    }));
    const talkEs = TALK_ES[story.id]?.[pi];
    return { ...p, index: pi, text, tokens, words, talk: personalize(p.talk || '', family), talkEs: talkEs ? personalize(talkEs, family) : '' };
  });
  return { ...story, title: personalize(story.title, family), pages, step };
}

/** Words to look at once more after practice: the ones that needed help, plus tonight's new-sound words. */
export function watchWords(prepared, results) {
  const needHelp = new Map();
  results.forEach((pageRes, pi) => pageRes?.forEach((q, wi) => {
    if (q === 'helped' || q === 'skipped') {
      const w = prepared.pages[pi].words[wi];
      if (w && !w.lenient) needHelp.set(w.norm, w);
    }
  }));
  const list = [...needHelp.values()];
  if (list.length < 3) {
    for (const p of prepared.pages) for (const w of p.words) {
      if (list.length >= 3) break;
      if (w.focus && !list.some(x => x.norm === w.norm)) list.push(w);
    }
  }
  return list.slice(0, 4);
}

export const storyWordCount = prepared => prepared.pages.reduce((n, p) => n + p.words.length, 0);

/**
 * Is the story writer reachable? Asked at most once a day per phone (the
 * answer is remembered), so the home screen never shows a button that can't work.
 */
let engineCheck = null;
export function storyEngineAvailable() {
  if (engineCheck) return engineCheck;
  const KEY = 'hearth.engine';
  try { const c = JSON.parse(localStorage.getItem(KEY) || 'null'); if (c && Date.now() - c.at < 864e5) return (engineCheck = Promise.resolve(c.ok)); } catch { /* ignore */ }
  engineCheck = fetch('./api/story', { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : { ready: false })).then(j => j?.ready === true).catch(() => false)
    .then(ok => { try { localStorage.setItem(KEY, JSON.stringify({ ok, at: Date.now() })); } catch { /* ignore */ } return ok; });
  return engineCheck;
}

/** Ask the story engine (server) for a brand-new story at this parent's step. */
export async function requestNewStory(state = getState(), { timeout = 45000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch('./api/story', {
      method: 'POST', headers: { 'content-type': 'application/json' }, signal: ctrl.signal,
      // No names leave the phone: stories come back with {child} and {grownup} placeholders.
      body: JSON.stringify({ step: workingStep(state.learner), interests: state.family.interests, avoid: allStories().map(s => s.title) }),
    });
    if (!res.ok) return null;
    return acceptGeneratedStory(await res.json(), state);
  } catch { return null; } finally { clearTimeout(timer); }
}

/**
 * A story from the story engine is checked again on the phone before it is kept:
 * plain text only, sensible lengths, and every word readable for this parent.
 */
export function acceptGeneratedStory(raw, state = getState()) {
  const str = (v, max) => (typeof v === 'string' ? v.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '');
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.pages)) return null;
  const pages = raw.pages.slice(0, 12).map(p => ({
    text: str(p?.text, 300),
    talk: str(p?.talk, 200),
    scene: p?.scene && typeof p.scene === 'object' ? { bg: p.scene.bg, items: Array.isArray(p.scene.items) ? p.scene.items.slice(0, 12) : [] } : { bg: 'room', items: [] },
  })).filter(p => p.text);
  const title = str(raw.title, 80);
  if (!title || pages.length < 4) return null;
  const step = workingStep(state.learner);
  const story = { id: `gen-${Date.now().toString(36)}`, title, step, generated: true, cover: pages[0].scene, pages };
  const lx = getLexicon();
  if (lx) {
    // the family's names are always readable for them, so the placeholders count as known words
    const known = ['childname', 'grownupname'];
    const named = p => p.text.replace(/\{child\}/g, 'childname').replace(/\{[Gg]rownup\}/g, 'grownupname');
    const check = validateStory({ pages: pages.map(p => ({ text: named(p) })) }, lx, { step: Math.max(step, 2), known });
    if (!check.ok) return null;
  }
  const words = pages.flatMap(p => `${p.text} ${p.talk}`.toLowerCase().match(/[a-z']+/g) || []);
  if (words.some(isBlocked)) return null;
  return story;
}

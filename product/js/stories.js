// Story selection & preparation for one family.

import { STORIES } from '../data/stories.js';
import { personalize, tokenize, baseForm } from '../engine/text.js';
import { analyzeText } from '../engine/decodable.js';
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
    return { ...p, index: pi, text, tokens, words, talk: personalize(p.talk || '', family) };
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

/** Ask the story engine (server) for a brand-new story at this parent's step. */
export async function requestNewStory(state = getState(), { timeout = 45000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch('./api/story', {
      method: 'POST', headers: { 'content-type': 'application/json' }, signal: ctrl.signal,
      body: JSON.stringify({ step: workingStep(state.learner), childName: state.family.childName, grownup: state.family.grownup, interests: state.family.interests, avoid: allStories().map(s => s.title) }),
    });
    if (!res.ok) return null;
    const story = await res.json();
    if (!story?.pages?.length) return null;
    story.id = story.id || `gen-${Date.now()}`;
    story.generated = true;
    return story;
  } catch { return null; } finally { clearTimeout(timer); }
}

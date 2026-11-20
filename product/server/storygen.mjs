// Story engine: Claude writes a bedtime story for one family at one parent's
// exact reading step, and the Hearth phonics engine checks every word.
// Words the parent can't decode yet go back to Claude for revision until the
// story is fully readable — the same strict standard the library is held to.
//
//   generate (structured JSON) → validate (engine) → revise (≤ 3 rounds) → return

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLexiconNode } from '../engine/lexicon.js';
import { validateStory } from '../engine/decodable.js';
import { personalize, tokenize, baseForm } from '../engine/text.js';
import { STEPS, HEART_WORD_STEP } from '../engine/phonics.js';
import { ELEMENTS, BACKGROUNDS } from '../js/art.js';
import { isBlocked } from '../engine/safety.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MODEL = 'claude-opus-5-5';
const MAX_ROUNDS = 3;

let lexiconPromise = null;
const lexicon = () => (lexiconPromise ||= loadLexiconNode(path.join(HERE, '../data/lexicon.json')));

let clientPromise = null;
async function client() {
  if (!clientPromise) {
    clientPromise = import('@anthropic-ai/sdk').then(({ default: Anthropic }) => new Anthropic());
  }
  return clientPromise;
}

export function storyEngineReady() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

const ITEM_ELEMENTS = ELEMENTS.filter(e => !['towel'].includes(e));

const STORY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'pages'],
  properties: {
    title: { type: 'string', description: 'Short title, also decodable.' },
    pages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'talk', 'scene'],
        properties: {
          text: { type: 'string', description: 'The words the parent reads aloud on this page.' },
          talk: { type: 'string', description: 'A dialogic-reading prompt for the parent to ask the child (any vocabulary).' },
          scene: {
            type: 'object',
            additionalProperties: false,
            required: ['bg', 'items'],
            properties: {
              bg: { type: 'string', enum: BACKGROUNDS },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['el', 'x', 'y', 'scale'],
                  properties: {
                    el: { type: 'string', enum: ITEM_ELEMENTS },
                    x: { type: 'number', description: '0-100, horizontal centre' },
                    y: { type: 'number', description: '0-100, where the element stands (ground ≈ 86; sky items ≈ 20-40)' },
                    scale: { type: 'number', description: '0.5-1.8' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

/** Decodable vocabulary the writer can lean on: the most common words this parent can read. */
function vocabularyFor(lx, step, n = 450) {
  const out = [];
  for (const w of lx.ranked) {
    if (out.length >= n) break;
    if ((w.length < 2 && w !== 'a' && w !== 'i') || isBlocked(w)) continue;
    const a = lx.analyze(w);
    if (a.decodeStep <= step && a.heartStep === null) out.push(w);
  }
  return out;
}

function newestWords(lx, step, n = 60) {
  const out = [];
  for (const w of lx.ranked) {
    if (out.length >= n) break;
    if (!isBlocked(w) && lx.analyze(w).decodeStep === step) out.push(w);
  }
  return out;
}

function systemPrompt() {
  return `You write bedtime picture books for Hearth, an app that helps parents who are still learning to read become the one who reads the bedtime story.

The reader is an adult. Every word they read must be one they can sound out with the letter-sound patterns they have learned so far, or a "heart word" they have already been taught. You will be given the exact list of patterns, heart words, and a vocabulary of safe words. The words on the page must come from those, plus the placeholders {child} (the child's name) and {grownup} (what the child calls the parent, e.g. Mama). Write {child} and {grownup} literally; the app fills them in. Use {Grownup} at the start of a sentence.

What makes a good Hearth story:
- Warm, calm, and a little funny; ends gently, fit for bedtime. Never scary, never sad endings, no violence.
- Respectful of the adult: never babyish in tone toward the parent, never mentions reading tests or school.
- Short sentences. Repetition with small changes ("Is it a cap? It is not a cap.") is good. Every page is part of one simple story with a beginning, a small problem or surprise, and a cozy ending.
- Puts the child ({child}) and the family into the story when it fits.
- Uses this step's newest patterns several times so tonight's practice is useful.
- "talk" is a question or invitation for the parent to say to the child after the page (dialogic reading: predict, recall, connect to the child's life, act it out). It is spoken by the app, so it can use any words.
- Scenes are drawn from a fixed set of picture elements and backgrounds. Choose ones that show what the page says. Put characters on the ground (y about 86), sky things up high (y 20-40).

Output only the JSON object the schema asks for.`;
}

function userPrompt({ step, interests, avoid }, lx) {
  const steps = STEPS.slice(0, step);
  const patterns = steps.map(s => `${s.n}. ${s.title} (e.g. ${s.words.join(', ')})`).join('\n');
  const hearts = Object.entries(HEART_WORD_STEP).filter(([, st]) => st <= step).map(([w]) => w).join(', ');
  const vocab = vocabularyFor(lx, step).join(' ');
  const newest = newestWords(lx, step).join(', ');
  const wordsPerPage = step <= 6 ? '3 to 7' : step <= 13 ? '5 to 10' : step <= 25 ? '7 to 14' : '9 to 20';
  return `Write a new 7-page Hearth story.

Family: a young child (always write {child} for their name) and their parent (always write {grownup} for what the child calls them). For privacy you are not told their real names.
The child loves: ${(interests || []).join(', ') || 'animals'}.
Avoid these titles (already in the library): ${(avoid || []).slice(0, 40).join('; ')}.

The parent is working on step ${step}: "${STEPS[step - 1].title}". Patterns learned so far:
${patterns}

Heart words already taught (allowed even if irregular): ${hearts}

Words using this step's newest pattern (use several): ${newest}

Safe vocabulary (all decodable for this parent; prefer these): ${vocab}

Rules: ${wordsPerPage} words per page. Plurals and -s endings of safe words are fine when the safe word ends in a consonant sound like t, p, k (cats, naps); avoid other endings unless they appear in the vocabulary. No numbers written as digits. Names other than {child}/{grownup} must themselves be decodable (like Pip, Bob, Gus).`;
}

function toLibraryShape(json, step) {
  const clamp = (v, lo, hi, d) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d);
  const pages = json.pages.slice(0, 9).map(p => ({
    text: p.text.trim(),
    talk: p.talk.trim(),
    scene: {
      bg: BACKGROUNDS.includes(p.scene?.bg) ? p.scene.bg : 'room',
      items: (p.scene?.items || []).slice(0, 5).filter(it => ITEM_ELEMENTS.includes(it.el))
        .map(it => [it.el, clamp(it.x, 5, 95, 50), clamp(it.y, 15, 95, 86), clamp(it.scale, 0.4, 2, 1)]),
    },
  }));
  return { title: json.title.trim(), step, theme: ['generated'], cover: pages[0]?.scene || { bg: 'night', items: [] }, pages };
}

function knownWords(body) {
  return [body.childName, body.grownup].filter(Boolean).flatMap(x => x.toLowerCase().split(/\s+/));
}

function check(story, lx, body) {
  const fam = { childName: body.childName || 'Maya', grownup: body.grownup || 'Mama' };
  const known = knownWords(fam);
  const pages = [{ text: personalize(story.title, fam) }, ...story.pages.map(p => ({ text: personalize(p.text, fam) }))];
  const report = validateStory({ pages }, lx, { step: story.step, known });
  pages.forEach((p, pi) => tokenize(p.text).forEach(t => { if (t.t === 'w' && isBlocked(t.norm)) report.problems.push({ page: pi, word: t.text, needs: Infinity, patterns: ['blocked'] }); }));
  report.ok = report.problems.length === 0;
  return report;
}

/** Last resort: drop sentences that still contain unreadable words, keeping pages non-empty. */
function pruneUnreadable(story, problems, lx, body) {
  const bad = new Set(problems.map(p => p.word.toLowerCase()));
  for (const p of story.pages) {
    const sentences = p.text.match(/[^.!?]+[.!?]*["”]?\s*/g) || [p.text];
    const kept = sentences.filter(s => !tokenize(s).some(t => t.t === 'w' && bad.has(t.text.toLowerCase())));
    if (kept.length) p.text = kept.join('').trim();
  }
  story.pages = story.pages.filter(p => !tokenize(p.text).some(t => t.t === 'w' && bad.has(t.text.toLowerCase())));
  return check(story, lx, body);
}

async function ask(messages) {
  const anthropic = await client();
  const response = await anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: STORY_SCHEMA } },
    system: systemPrompt(),
    messages,
  });
  if (response.stop_reason === 'refusal') throw new Error(`model declined (${response.stop_details?.category ?? 'unknown'})`);
  if (response.stop_reason === 'max_tokens') throw new Error('story was cut off');
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
  return { response, json: JSON.parse(text) };
}

// The request comes from the internet, so only known values reach the prompt:
// interests from the app's own list, short plain titles, a step number in range.
const INTERESTS = new Set(['animals', 'space', 'sea', 'trucks', 'food', 'music', 'snow', 'bedtime']);
export function cleanRequest(body = {}) {
  const step = Math.min(Math.max(Math.round(Number(body.step)) || 4, 2), STEPS.length);
  const interests = [...new Set((Array.isArray(body.interests) ? body.interests : []).filter(x => INTERESTS.has(x)))];
  const avoid = (Array.isArray(body.avoid) ? body.avoid : [])
    .filter(x => typeof x === 'string')
    .map(x => x.replace(/[^\p{L}\p{N} '’!?,.-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 60))
    .filter(Boolean).slice(0, 40);
  return { step, interests, avoid };
}

export async function generateStory(raw) {
  const body = cleanRequest(raw);
  const lx = await lexicon();
  const step = body.step;
  const messages = [{ role: 'user', content: userPrompt(body, lx) }];
  let story = null, report = null;
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const { response, json } = await ask(messages);
    story = toLibraryShape(json, step);
    report = check(story, lx, body);
    if (report.ok) break;
    // Send the exact words back. Append the whole assistant turn (content blocks unchanged).
    const offenders = [...new Set(report.problems.map(p => p.word))];
    messages.push({ role: 'assistant', content: response.content });
    messages.push({
      role: 'user',
      content: `These words are not readable yet for this parent: ${offenders.join(', ')}. Rewrite the story so none of them appear, using only the safe vocabulary, heart words, {child} and {grownup}. Keep the same story and scenes where possible. Return the full JSON again.`,
    });
  }
  if (!report.ok) report = pruneUnreadable(story, report.problems, lx, body);
  if (!report.ok || story.pages.length < 4) throw new Error('could not produce a fully decodable story');
  return {
    ...story,
    id: `gen-${Date.now().toString(36)}`,
    generated: true,
    validation: { words: report.words, focusWords: report.focusWords.slice(0, 8) },
  };
}

// exported for tests and the Studio
export { STORY_SCHEMA, vocabularyFor, systemPrompt, userPrompt, toLibraryShape, check, knownWords, baseForm };

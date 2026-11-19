# Technical architecture

## Overview

```
                ┌──────────────────────────── Parent's phone ────────────────────────────┐
                │  App shell (PWA today → native Android/iOS next)                         │
                │   screens: onboarding · tonight · reader · sky · library · settings      │
                │                                                                          │
   speech  ───► │  Recognizer (browser API now; on-device model in production)             │
                │      │ transcript (final + interim)                                      │
                │      ▼                                                                   │
                │  PageTracker ── hint level ──► Hint ladder (chunks → sounds → word)      │
                │      │ word outcomes (fluent / effortful / helped / skipped)             │
                │      ▼                                                                   │
                │  Learner model (BKT per pattern) ──► tonight's story, sky, watch words   │
                │      ▲                                                                   │
                │  Phonics engine: lexicon (19.5K words) · aligner · decodability          │
                │  Story library (14 stories) · SVG illustration system                    │
                │  Local storage: state (localStorage) · recordings (IndexedDB)            │
                └───────────────┬──────────────────────────────────────┬───────────────────┘
                                │ new story request                    │ opt-in summary
                                ▼                                      ▼
                     Story engine (Node)                     Partner dashboard
                     Claude → validate → revise              (nights, steps, words; no audio)
```

## Repository layout

| Path | What it is |
|---|---|
| `product/engine/` | Pure ES modules shared by the app, the server and tests |
| `phonics.js` | 40-step scope and sequence, 120 patterns, 214 grapheme→phoneme rules, heart words |
| `align.js` | Dynamic-programming aligner from spelling to CMU phonemes, split-digraph state, word-shape patterns |
| `lexicon.js` | Lexicon wrapper: analysis cache, pronunciation derivation for unknown words (inflections, compounds), parts-based readability |
| `decodable.js` | Text analysis per reader, story validation, chunking for hints |
| `learner.js` | Knowledge tracing, two-day mastery with hysteresis, placement ladder |
| `tracker.js` | Speech-to-page alignment (semi-global DP), homophones, hint timing |
| `simulate.js` | Deterministic simulated reader for demos and tests |
| `safety.js` | Word blocklist for the story writer's vocabulary and outputs |
| `product/js/` | App: router, store, voice (TTS, recognition, simulated reader), art, screens |
| `product/data/` | `lexicon.json` (built), `stories.js` (library) |
| `product/server/` | Zero-dependency static server plus `/api/story` (Anthropic SDK) |
| `product/studio/` | Decodability x-ray, library audit, Claude writer UI |
| `product/dashboard/` | Partner dashboard (synthetic demo data) |
| `product/test/` | Node test runner suites |
| `website/` | Marketing site generated from the product's art |
| `pitch/` | Deck source, renderer, PDF, one-pager |

## Key algorithms

### Grapheme–phoneme alignment
State = (letter index, phoneme index, open-split flag). Each rule matches a grapheme (1–4 letters) to 0–3 phonemes, with a cost; stress-specific rules distinguish short *u* (AH1) from schwa (AH0). Split digraphs (*a_e*) open on the vowel and close on the final *e* (before an optional suffix). Anything unexplainable uses an irregular step (cost 12), which marks the part of a heart word. The cheapest path wins; among a word's pronunciations, the one with the lowest decode step wins.

### Reading tracker
On every recognizer update, the whole page-so-far transcript is re-aligned against the page words: insertions (repeats, "um", talking to the child) cost −0.15, skipped page words −0.7, matches score by similarity (exact, homophone, one-letter variants for longer words, lenient for names). The tracker only moves forward and freezes word states once decided. It owns the clock for hints and never hints on names.

### Story engine
1. Build a prompt with the parent's step, all patterns so far, heart words taught, words using the newest pattern, and ~450 safe high-frequency words (blocklist-filtered), the child's name and interests (placeholders `{child}`, `{grownup}`).
2. Call **Claude Opus 5.5** through the official Anthropic SDK with a strict JSON schema output (title, pages: text, talk prompt, scene from a fixed element vocabulary), effort `medium`, and server-side refusal fallback (`fallbacks: "default"`).
3. Validate every word with the engine plus the blocklist. Send offending words back for revision (up to 3 rounds, appending the full assistant turn).
4. Last resort: drop unreadable sentences; reject the story if fewer than 4 pages remain.
5. Return the story; the app stores it locally and can reuse it for other families at the same step.

### Illustrations
`js/art.js` composes SVG scenes from 13 backgrounds and ~50 elements (people, animals, objects). People take the family's chosen skin tone and hair, so pictures look like the family. No image generation is needed, scenes are tiny, and the story writer can only pick from safe elements.

## Data model (on device)

```
family: { childName, childAge, grownup, interests[], lang, look{...} }
learner: { p{pattern→prob}, mastered{pattern→bool}, days{pattern→[dates]}, placedStep }
settings: { mic: voice|tap|demo, whisperHints, narrate, program, share }
stories: { id → {practiced, readTogether, lastAt, recorded} }
generated: [story]   history: [{at, id, mode, words, q, readable}]   stats: {nights, wordsAloud, practiceMs}
recordings (IndexedDB): "storyId:page" → audio blob
```

## Production plan

| Area | Prototype | Production |
|---|---|---|
| Speech recognition | Browser Web Speech API (may send audio to the browser vendor) | On-device model (Android SpeechRecognizer on-device mode / a small Whisper-class model), audio never leaves the phone |
| App | PWA | Native Android first, then iOS; same engine modules |
| Sync | None | Optional encrypted backup; partner summary sync with consent |
| Story engine | Single Node endpoint | Queue + cache keyed by (step, interests); reuse across families |
| Lexicon | 19.5K words, built from CMUdict + SUBTLEX-US | Larger lexicon; Spanish lexicon with grapheme rules (highly regular) |
| Observability | — | Privacy-preserving aggregate metrics only |

## Running it

```bash
cd product
npm install                 # Anthropic SDK (+ dictionaries for rebuilding the lexicon)
npm test                    # 22 engine, tracker and learner tests + story validation
npm start                   # http://localhost:8787/product/  (website at /website/)
ANTHROPIC_API_KEY=… npm start   # enables "Write a new story" and the Studio writer
```

# Hearth

**Be the one who reads the bedtime story.**

Hearth is a private reading coach for parents who struggle to read. A parent practises tonight's picture book alone for about five minutes, with a coach that listens and helps the moment they pause, then reads it aloud to their child. Every night, two people get better at reading.

- 28% of U.S. adults score at or below the lowest literacy level measured (PIAAC 2023), and 77% of adults at the lowest levels are parents.
- Every reading app listens to the child. Hearth listens to the parent, at the moment that matters most to them: their own child at bedtime.
- Families never pay. Head Start programs, libraries, adult education, pediatric networks and health plans do.

## What's in this repository

| Folder | What it is |
|---|---|
| [`product/`](product/) | The working product: phone web app (PWA), phonics engine, learner model, speech tracker, 14 decodable stories, illustration system, Story Studio, partner dashboard, story engine server (Claude), tests |
| [`website/`](website/) | Marketing website, built from the product's own illustrations and screenshots |
| [`pitch/`](pitch/) | Investor deck (19 slides, PDF and source), speaker script, one-pager |
| [`docs/`](docs/) | Data room: evidence base, product requirements, pedagogy, architecture, privacy, impact plan, go-to-market, pilot proposal, financial model (xlsx), risks and investor Q&A, brand guide, customer discovery, company setup |
| [`brand/`](brand/) | Logo and mark (SVG) |

## Try it

```bash
cd product
npm install
npm test          # engine, tracker, learner and story-validation tests
npm start         # http://localhost:8787/product/   (website: http://localhost:8787/website/)
```

On the first screen choose **"Explore with a demo family"** (or open `/product/?demo`). Tap **Practise first**: the demo reader reads aloud in text, pauses on a word, and you can watch the hints arrive (chunks, then sounds, then the word). Then try **Read with Mateo** for story time, and **Your sky** for progress. On a desktop, the side panel switches between your voice, the demo reader and tap mode.

To let Hearth write new stories live, set `ANTHROPIC_API_KEY` before `npm start`. Every generated story is checked word by word and revised until every word is readable for that parent.

## How it works

1. **Phonics engine** (`product/engine/`): maps every word to its sounds using the CMU Pronouncing Dictionary and a 40-step sequence of 120 letter-sound patterns, so Hearth knows exactly which words a parent can read.
2. **Stories**: written for one step and validated in CI; new ones are written by Claude for one family and checked by the engine.
3. **Reading coach**: follows the parent's voice word by word; gives the smallest hint that helps.
4. **Learner model**: Bayesian knowledge tracing per sound; a sound counts as learned only after good reading on two different days.

Details: [`docs/technical-architecture.md`](docs/technical-architecture.md), [`docs/pedagogy.md`](docs/pedagogy.md).

## Status

Working prototype. No users yet. Next: a 12-week pilot with three partner programs (about 150 families), an Android app with on-device speech recognition, and the first Spanish stories.

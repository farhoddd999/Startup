import { page, ICON, stars, esc } from '../layout.mjs';
import { growthChart, READABLE, ctaBand } from '../parts.mjs';
import { STEPS, PATTERN_INFO } from '../../product/engine/phonics.js';

const seqData = STEPS.map(s => ({
  n: s.n, title: s.title, words: s.words, readable: READABLE[s.n],
  sounds: s.patterns.map(p => ({ label: PATTERN_INFO[p]?.label || p, key: PATTERN_INFO[p]?.key || '', pic: PATTERN_INFO[p]?.pic || '' })),
}));
const short = t => t.split(' ')[0].replace('·', '');

export default page({
  path: '/science/',
  title: 'The science',
  description: 'The learning science behind Hearth: a 40-step phonics sequence, decodable stories checked word by word, a hint ladder, dialogic reading, and a learner model per sound.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">The science</span>
    <h1>Built on how reading is learned.</h1>
    <p class="lead">Hearth combines structured phonics, decodable text, dialogic reading and family literacy, and adapts them for adults who may carry years of shame about reading.</p>
    <div class="cta-row"><a class="btn lamp" href="/check/">Try the decodability checker</a><a class="btn line" href="/research/">Research and sources</a></div>
  </div>
</section>

<section class="band paper" aria-labelledby="pTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Principles</span><h2 id="pTitle">Six ideas behind every screen.</h2></div>
    <div class="grid3">
      <div class="card"><h3>Structured phonics</h3><p>Forty steps from m, s, t and short a to endings like -tion. Each step adds a few letter-sound patterns and practises them in real words.</p></div>
      <div class="card"><h3>Every word decodable</h3><p>A story only reaches a parent when every word is one they can sound out, a heart word they know by sight, or their family’s own name.</p></div>
      <div class="card"><h3>The smallest hint first</h3><p>Chunks, then sounds with pictures, then the word. The reader does as much of the work as they can, which is how decoding grows.</p></div>
      <div class="card"><h3>Rehearse, then perform</h3><p>Repeated reading builds fluency. Practising first, then reading the same story at bedtime, gives the repetition a purpose the adult cares about.</p></div>
      <div class="card"><h3>Dialogic reading</h3><p>A question on every page turns reading into conversation. In a meta-analysis, this kind of reading had a moderate effect on children’s expressive vocabulary (d = 0.59).<sup><a href="/research/#s7">7</a></sup></p></div>
      <div class="card"><h3>Dignity as design</h3><p>No levels, scores or red marks. The words “illiterate” and “beginner” never appear. Shame is the main barrier, so the design removes every sign of being tested.</p></div>
    </div>
  </div>
</section>

<section class="band night-2" aria-labelledby="seqTitle" id="sequence">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">The sequence</span><h2 id="seqTitle">Forty steps, one sound at a time.</h2><p class="lead">Tap a step to see its sounds, key words, and how many of the 5,000 most common English words a parent can read once they reach it.</p></div>
    <div class="seq" role="group" aria-label="The 40 steps">${seqData.map(s => `<button data-step="${s.n}" aria-pressed="${s.n === 14}" title="Step ${s.n}: ${esc(s.title)}">${s.n}<small>${esc(short(s.title))}</small></button>`).join('')}</div>
    <div class="seq-detail" aria-live="polite">
      <div><h3 data-seq="title">Step 14: sh</h3><div class="sound-chips" data-seq="sounds"></div><p class="small mt" style="color:var(--on-night-3)">Example words (tap to hear)</p><div class="word-chips" data-seq="words"></div></div>
      <div class="seq-count"><b data-seq="readable">423</b><span style="color:var(--on-night-2)">of the 5,000 most common English words are readable at this step</span></div>
    </div>
    <script type="application/json" id="seq-data">${JSON.stringify(seqData).replace(/</g, '\\u003c')}</script>
  </div>
</section>

<section class="band paper" aria-labelledby="decTitle">
  <div class="wrap split top">
    <div class="stack">
      <span class="eyebrow">What “decodable” means</span>
      <h2 id="decTitle">Every word, explained as sounds.</h2>
      <p class="lead">Hearth’s engine lines up each word’s spelling with its pronunciation from the CMU Pronouncing Dictionary, using 214 spelling rules, and finds the simplest explanation. That tells it exactly which patterns a reader needs.</p>
      <p><a class="link-arrow" href="/check/">Check any text yourself</a></p>
    </div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th>Word</th><th>How it splits</th><th>Readable at</th></tr></thead>
      <tbody>
        <tr><td style="font-family:var(--story);font-size:22px">ship</td><td>sh · i · p</td><td>Step 14</td></tr>
        <tr><td style="font-family:var(--story);font-size:22px">cake</td><td>c · a_e · k (the silent e makes a say its name)</td><td>Step 19</td></tr>
        <tr><td style="font-family:var(--story);font-size:22px">night</td><td>n · igh · t</td><td>Step 26</td></tr>
        <tr><td style="font-family:var(--story);font-size:22px">page</td><td>p · a_e · g (soft g)</td><td>Step 36</td></tr>
        <tr><td style="font-family:var(--story);font-size:22px">said</td><td>s · (heart part) · d</td><td>Learned by heart at step 3</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

<section class="band night" aria-labelledby="growTitle">
  <div class="wrap split wide-left">
    <div class="min0">${growthChart()}</div>
    <div class="stack"><span class="eyebrow">Why it adds up</span><h2 id="growTitle">Small steps, big unlocks.</h2><p class="lead">Blends at step 18 unlock more than 300 common words at once. Endings and longer words at steps 34–35 unlock over a thousand. Hearth shows parents this number instead of a level.</p></div>
  </div>
</section>

<section class="band paper" aria-labelledby="lmTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">The learner model</span><h2 id="lmTitle">Knowing what each parent knows.</h2><p class="lead">Hearth keeps a private estimate for each of the 120 sound patterns, for each parent, on their phone. It uses Bayesian knowledge tracing, adjusted for adult readers.</p></div>
    <div class="grid4">
      <div class="card"><div class="glyph">${ICON.check}</div><h3>Evidence from reading</h3><p>A word read smoothly counts for every sound in it. A word that needed help counts against only the least-known sound.</p></div>
      <div class="card"><div class="glyph">${ICON.moon}</div><h3>Learned over days</h3><p>A sound counts as learned only after good reading on two different days, so one good evening isn’t mistaken for learning.</p></div>
      <div class="card"><div class="glyph">${ICON.heart}</div><h3>Forgiving</h3><p>One tired night doesn’t undo progress. Skipped pages never count against anyone.</p></div>
      <div class="card"><div class="glyph">${ICON.book}</div><h3>It picks tonight’s story</h3><p>The first step with a sound still being learned decides tonight’s story and the new sound to practise.</p></div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="evalTitle" id="evaluation">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">Evaluation</span><h2 id="evalTitle">We will measure two learners, not one.</h2><p class="lead">Hearth is a working prototype. Our first pilot is designed to test what it does for parents and for their children, with results shared even if they disappoint.</p></div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th>Who</th><th>What we measure</th></tr></thead>
      <tbody>
        <tr><td>The parent</td><td>Words they can read and steps gained (from the engine); pre and post scores on the assessments partners already use</td></tr>
        <tr><td>The child</td><td>Nights read together, words heard, and an expressive vocabulary measure with a research partner</td></tr>
        <tr><td>The family</td><td>How often they read together, and the parent’s confidence reading aloud</td></tr>
        <tr><td>Design</td><td>12 weeks, 3 sites, about 150 families, compared with a waitlist group that gets Hearth afterwards</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

${ctaBand('See which words a parent can really read.', 'Paste any text into the checker: a school note, a medicine label, a picture book.', [['/check/', 'Open the checker', 'lamp'], ['/research/', 'Read the sources', 'line']])}
`,
  scripts: ['/assets/science.js'],
});

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
  description: 'The thinking behind Hearth: 40 small phonics steps, stories checked word by word, help that comes in stages, questions that turn reading into conversation, and progress tracked sound by sound.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">The science</span>
    <h1>Built on how people really learn to read.</h1>
    <p class="lead">Nothing in Hearth is new science. It brings together methods with good evidence behind them (phonics, stories made only of words you can read, talking about the story together) and shapes them for grown-ups, many of whom have felt embarrassed about reading for years.</p>
    <div class="cta-row"><a class="btn lamp" href="/check/">Try the word checker</a><a class="btn line" href="/research/">Research and sources</a></div>
  </div>
</section>

<section class="band paper" aria-labelledby="pTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Principles</span><h2 id="pTitle">Six ideas we keep coming back to.</h2></div>
    <div class="grid3">
      <div class="card"><h3>One sound at a time</h3><p>Forty small steps, starting with m, s, t and the short a in “cat”, and ending with longer word endings like -tion. Each step adds a few new letter sounds and practises them in real words. This is called structured phonics.</p></div>
      <div class="card"><h3>Every word is readable</h3><p>A parent only gets a story if every word in it is one they can sound out, a heart word they already know by sight, or their own family’s names. Reading people call this “decodable” text.</p></div>
      <div class="card"><h3>The smallest bit of help first</h3><p>First the parts of the word, then the sounds with pictures, and only then the word itself. The reader does as much of the work as they can, because that’s how sounding out gets easier.</p></div>
      <div class="card"><h3>Practise, then read for real</h3><p>Reading the same text more than once is one of the best ways to become a smoother reader. Practising first and then reading the same story at bedtime gives that repetition a reason the parent really cares about.</p></div>
      <div class="card"><h3>Talking about the story</h3><p>A question on every page turns the story into a conversation. When researchers pooled studies of this kind of shared reading (“dialogic reading”), they found a moderate boost to the words children use (d = 0.59).<sup><a href="/research/#s7">7</a></sup></p></div>
      <div class="card"><h3>No one should feel tested</h3><p>There are no levels, scores or red marks, and you’ll never see words like “illiterate” or “beginner”. Embarrassment is what keeps most adults from getting help, so we’ve taken out anything that feels like a test.</p></div>
    </div>
  </div>
</section>

<section class="band night-2" aria-labelledby="seqTitle" id="sequence">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">The sequence</span><h2 id="seqTitle">Forty steps, one sound at a time.</h2><p class="lead">Tap any step to see its sounds and example words, and how many of the 5,000 most common English words a parent can read by the time they get there.</p></div>
    <div class="seq" role="group" aria-label="The 40 steps">${seqData.map(s => `<button data-step="${s.n}" aria-pressed="${s.n === 14}" title="Step ${s.n}: ${esc(s.title)}">${s.n}<small>${esc(short(s.title))}</small></button>`).join('')}</div>
    <div class="seq-detail" aria-live="polite">
      <div><h3 data-seq="title">Step 14: sh</h3><div class="sound-chips" data-seq="sounds"></div><p class="small mt" style="color:var(--on-night-3)">Example words (tap one to hear it)</p><div class="word-chips" data-seq="words"></div></div>
      <div class="seq-count"><b data-seq="readable">423</b><span style="color:var(--on-night-2)">of the 5,000 most common English words are readable at this step</span></div>
    </div>
    <script type="application/json" id="seq-data">${JSON.stringify(seqData).replace(/</g, '\\u003c')}</script>
  </div>
</section>

<section class="band paper" aria-labelledby="decTitle">
  <div class="wrap split top">
    <div class="stack">
      <span class="eyebrow">How we know a word is readable</span>
      <h2 id="decTitle">Every word, broken into its sounds.</h2>
      <p class="lead">For each word, Hearth looks up how it’s said (in the CMU Pronouncing Dictionary) and matches the letters to the sounds using 214 spelling rules, picking the simplest match. That tells us exactly which letter sounds someone needs to know to read it.</p>
      <p><a class="link-arrow" href="/check/">Try it on any text</a></p>
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
    <div class="stack"><span class="eyebrow">Why it adds up</span><h2 id="growTitle">Small steps, big jumps.</h2><p class="lead">Learning blends like “fr” and “st” at step 18 opens up more than 300 common words in one go. Word endings and longer words at steps 34 and 35 open up over a thousand. This is the number Hearth shows parents, instead of a level.</p></div>
  </div>
</section>

<section class="band paper" aria-labelledby="lmTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Keeping track of progress</span><h2 id="lmTitle">Knowing what each parent already knows.</h2><p class="lead">For every parent, Hearth keeps a private guess at how well they know each of the 120 letter-sound patterns. That guess lives on their phone and nowhere else. (For the technically minded: it’s Bayesian knowledge tracing, adjusted for adults.)</p></div>
    <div class="grid4">
      <div class="card"><div class="glyph">${ICON.check}</div><h3>It learns from your reading</h3><p>A word read smoothly counts in favour of every sound in it. A word that needed help only counts against the sound you know least.</p></div>
      <div class="card"><div class="glyph">${ICON.moon}</div><h3>Learned over days, not minutes</h3><p>A sound only counts as learned after you’ve read it well on two different days, so one good evening isn’t mistaken for the real thing.</p></div>
      <div class="card"><div class="glyph">${ICON.heart}</div><h3>Forgiving</h3><p>One tired night doesn’t undo your progress, and skipping a page never counts against you.</p></div>
      <div class="card"><div class="glyph">${ICON.book}</div><h3>It picks tonight’s story</h3><p>The first sound you’re still learning decides which story you get tonight, and which new sound it practises.</p></div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="evalTitle" id="evaluation">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">Finding out if it works</span><h2 id="evalTitle">We’ll measure two learners, not one.</h2><p class="lead">Hearth works, but we don’t yet know how much it helps. Our first pilot is set up to find out what it does for parents and for their children, and we’ll share the results even if they’re not what we hoped.</p></div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th>Who</th><th>What we measure</th></tr></thead>
      <tbody>
        <tr><td>The parent</td><td>How many words they can read and how many steps they move up (from the app), plus before-and-after scores on the tests our partners already use</td></tr>
        <tr><td>The child</td><td>Nights read together, words heard, and a measure of the words they use, run by a research partner</td></tr>
        <tr><td>The family</td><td>How often they read together, and the parent’s confidence reading aloud</td></tr>
        <tr><td>How</td><td>12 weeks at 3 sites with about 150 families, compared with a group who start later and get Hearth afterwards</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

${ctaBand('See which words a parent can really read.', 'Paste in any text, like a note from school, a medicine label or a picture book, and see it the way a parent at each step would.', [['/check/', 'Open the word checker', 'lamp'], ['/research/', 'Read the sources', 'line']])}
`,
  scripts: ['/assets/science.js'],
});

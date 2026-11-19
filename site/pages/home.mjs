import { page, ICON, stars } from '../layout.mjs';
import { scene, story, growthChart, hintLadder, phonesHero, ctaBand } from '../parts.mjs';
import { STORIES } from '../../product/data/stories.js';
import { personalize } from '../../product/engine/text.js';

const fam = { childName: 'Mateo', grownup: 'Mama' };
const wish = story('the-wish-fish');
const featured = ['the-wish-fish', 'fox-and-the-moon', 'little-owl', 'snow-day'].map(id => story(id));

export default page({
  path: '/',
  title: 'Home',
  description: 'Hearth is a private reading coach for parents who struggle to read. Practise tonight’s bedtime story alone, then read it to your child.',
  body: `
<section class="hero night">
  ${stars()}
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">A private reading coach for parents</span>
      <h1 class="reading" id="heroLine" aria-label="Be the one who reads the bedtime story."><span class="w">Be</span> <span class="w">the</span> <span class="w">one</span> <span class="w">who</span> <span class="w">reads</span> <span class="w">the</span> <span class="w pause"><span class="ch">bed</span><span class="ch hot">time</span></span> <span class="w">story.</span></h1>
      <p class="lead">Hearth helps parents who struggle to read practise tonight’s picture book on their own, with a coach that listens. Then they read it aloud to their child. Every night, two people get better at reading.</p>
      <div class="cta-row"><a class="btn lamp" href="/app/">Try the app</a><a class="btn line" href="/programs/">Bring Hearth to your families</a></div>
      <p class="fine">Free for families. Paid for by the programs that serve them.</p>
    </div>
    ${phonesHero()}
  </div>
  <div class="wrap"><div class="trust"><span><i></i>Structured phonics, 40 steps</span><span><i></i>Every word checked before you see it</span><span><i></i>English and Spanish</span><span><i></i>Works offline</span></div></div>
</section>

<section class="band paper" aria-labelledby="problem">
  <div class="wrap">
    <div class="split top">
      <div class="stack">
        <span class="eyebrow">The quiet problem</span>
        <h2 id="problem">Bedtime is where it shows.</h2>
        <p class="lead">Millions of parents can’t comfortably read a picture book aloud. Many have spent years hiding it. The moment a child holds out a book can be the hardest moment of their day.</p>
      </div>
      <div class="quote-list" aria-label="Things parents say at bedtime">
        <span>“Let’s just look at the pictures tonight.”</span>
        <span>“Ask your sister to read it to you.”</span>
        <span>“I’m too tired, baby. Tomorrow.”</span>
        <small>What many parents say at bedtime, when the real reason is harder to say.</small>
      </div>
    </div>
    <div class="grid3 mt-l">
      <div class="stat"><b>28%</b><p>of U.S. adults scored at or below the lowest literacy level measured in 2023, up from 19% in 2017.<sup><a href="/research/#s1">1</a></sup></p></div>
      <div class="stat"><b>77%</b><p>of U.S. adults at the lowest literacy levels have children.<sup><a href="/research/#s2">2</a></sup></p></div>
      <div class="stat"><b>739M</b><p>adults worldwide lack basic literacy skills. Two in three are women.<sup><a href="/research/#s3">3</a></sup></p></div>
    </div>
    <p class="mt"><a class="link-arrow" href="/research/">Read the research and sources</a></p>
  </div>
</section>

<section class="band night-2" aria-labelledby="insight">
  <div class="wrap">
    <span class="eyebrow">Our idea</span>
    <h2 id="insight" class="mt-s" style="max-width:20ch">Every reading app listens to the child. Hearth listens to <em style="color:var(--lamp)">the parent.</em></h2>
    <p class="lead mt">AI reading tutors for children are now common. None of them help the adult holding the book. A child at bedtime is the strongest reason an adult has to learn to read, and it comes back every night.</p>
    <div class="grid2 mt-l">
      <div class="card dark"><p class="tag">Alone, first</p><h3>Practise in private</h3><p>Five quiet minutes with tonight’s story. A coach follows every word and helps the moment you pause. No one watches. No score is kept.</p></div>
      <div class="card dark"><p class="tag">Together, after</p><h3>Read with pride</h3><p>Then the same story at bedtime, with your child on your lap. You know every word because you just practised it. Your child hears you read.</p></div>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="howTitle">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">How it works</span>
      <h2 id="howTitle">One story a night, three small steps.</h2>
    </div>
    <div class="grid3">
      <div class="card"><div class="book" style="padding:8px;box-shadow:none">${scene(wish.pages[1].scene, 'A fish pops up next to Mateo.')}</div><p class="tag mt">1 · Tonight’s story</p><h3>Written for you, and for them</h3><p>Your child is the hero, and every word is one you can read, plus the new sound you’re learning.</p></div>
      <div class="card"><div class="book" style="padding:8px;box-shadow:none"><div class="words" style="font-size:24px"><span class="k d">A</span> <span class="k f">fish</span> <span class="k d">pops</span> <span class="k d">up</span>.</div></div><p class="tag mt">2 · Practise alone</p><h3>A coach that listens</h3><p>Read aloud. If you pause, help comes in small steps. About five minutes, any time of day.</p></div>
      <div class="card"><div class="book" style="padding:8px;box-shadow:none;background:var(--night)"><div class="words" style="font-size:24px;color:var(--on-night)">“What would you wish for?”</div></div><p class="tag mt">3 · Read together</p><h3>Story time, in your voice</h3><p>Bedtime mode, silent hints only you can see, and a question to ask after each page.</p></div>
    </div>
    <p class="mt"><a class="link-arrow" href="/how-it-works/">See every step, and try the live demo</a></p>
  </div>
</section>

${hintLadder()}

<section class="band paper" aria-labelledby="whoTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Who it’s for</span><h2 id="whoTitle">Free for families. Funded by the programs that serve them.</h2></div>
    <div class="grid2">
      <a class="card link" href="/families/"><div class="glyph">${ICON.heart}</div><p class="tag">For families</p><h3>Read the bedtime story with confidence</h3><p>Private, free, no reading needed to use it, English or Spanish. Your child sees a storybook, never a test.</p><span class="link-arrow">For families · Para familias</span></a>
      <a class="card link" href="/programs/"><div class="glyph">${ICON.users}</div><p class="tag">For programs</p><h3>Reach the parents your program can’t</h3><p>Head Start, libraries, adult education, clinics and health plans. A dashboard and reports, without exposing anything private.</p><span class="link-arrow">For programs</span></a>
    </div>
  </div>
</section>

<section class="band night" aria-labelledby="growthTitle">
  <div class="wrap split wide-left">
    <div class="min0">${growthChart()}</div>
    <div class="stack">
      <span class="eyebrow">Progress you can feel</span>
      <h2 id="growthTitle">From ten words to thousands.</h2>
      <p class="lead">Each new sound unlocks hundreds of everyday words. Hearth counts them: the words you can now read, out of the 5,000 most common in English.</p>
      <p><a class="link-arrow" href="/check/">Check which words a reader can read</a></p>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="storiesTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">The library</span><h2 id="storiesTitle">Stories worth reading twice.</h2><p class="lead">Fourteen illustrated bedtime stories, from “I am Mateo.” to owls counting stars. Each one is checked word by word for the step it’s written for.</p></div>
    <div class="story-grid">
      ${featured.slice(0, 3).map(s => `<a class="story-card" href="/stories/#${s.id}"><div class="art">${scene(s.cover, personalize(s.title, fam))}</div><div class="body"><h3>${personalize(s.title, fam)}</h3><div class="pills"><span class="pill ember">Step ${s.step}</span><span class="pill">${s.pages.length} pages</span></div></div></a>`).join('')}
    </div>
    <p class="mt"><a class="link-arrow" href="/stories/">Open the story library (${STORIES.length} stories)</a></p>
  </div>
</section>

${ctaBand()}
`,
});

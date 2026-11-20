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
  description: 'Hearth is a reading coach for parents who find reading hard. Practise tonight’s bedtime story on your own first, then read it to your child.',
  body: `
<section class="hero night">
  ${stars()}
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">For parents who find reading hard</span>
      <h1 class="reading" id="heroLine" aria-label="Be the one who reads the bedtime story."><span class="w">Be</span> <span class="w">the</span> <span class="w">one</span> <span class="w">who</span> <span class="w">reads</span> <span class="w">the</span> <span class="w pause"><span class="ch">bed</span><span class="ch hot">time</span></span> <span class="w">story.</span></h1>
      <p class="lead">Lots of parents find reading hard, and bedtime is when it shows. Hearth lets you practise tonight’s story on your own first, with a coach that listens and helps when you get stuck. Then you read it to your child.</p>
      <div class="cta-row"><a class="btn lamp" href="/install">Get the app</a><a class="btn line" href="/programs/">Bring Hearth to your families</a></div>
      <p class="fine">Free for families. The schools, libraries and family programs that work with them pay for it.</p>
    </div>
    ${phonesHero()}
  </div>
  <div class="wrap"><div class="trust"><span><i></i>40 small steps, one sound at a time</span><span><i></i>Every word checked before you see it</span><span><i></i>English and Spanish</span><span><i></i>Works without internet</span></div></div>
</section>

<section class="band paper" aria-labelledby="problem">
  <div class="wrap">
    <div class="split top">
      <div class="stack">
        <span class="eyebrow">Why we’re building this</span>
        <h2 id="problem">Bedtime is when it shows.</h2>
        <p class="lead">Far more parents struggle with reading than most people realise, and many have spent years keeping it to themselves. So when a child climbs into bed holding a book, it can be the hardest moment of the day.</p>
      </div>
      <div class="quote-list" aria-label="Things parents say at bedtime">
        <span>“Let’s just look at the pictures tonight.”</span>
        <span>“Ask your sister to read it to you.”</span>
        <span>“I’m too tired, baby. Tomorrow.”</span>
        <small>Things a lot of parents say at bedtime, when the real reason is harder to say.</small>
      </div>
    </div>
    <div class="grid3 mt-l">
      <div class="stat"><b>28%</b><p>of U.S. adults read at or below the lowest level measured in 2023. In 2017 it was 19%.<sup><a href="/research/#s1">1</a></sup></p></div>
      <div class="stat"><b>77%</b><p>of U.S. adults at the lowest reading levels have children.<sup><a href="/research/#s2">2</a></sup></p></div>
      <div class="stat"><b>739M</b><p>adults around the world don’t have basic reading and writing skills. Two in three of them are women.<sup><a href="/research/#s3">3</a></sup></p></div>
    </div>
    <p class="mt"><a class="link-arrow" href="/research/">Where these numbers come from</a></p>
  </div>
</section>

<section class="band night-2" aria-labelledby="insight">
  <div class="wrap">
    <span class="eyebrow">What’s different about Hearth</span>
    <h2 id="insight" class="mt-s" style="max-width:20ch">Most reading apps are for children. Hearth is for <em style="color:var(--lamp)">the grown-up holding the book.</em></h2>
    <p class="lead mt">There are plenty of reading apps for kids now. We couldn’t find one for the parent. And a child at bedtime might be the best reason a grown-up ever has to keep learning, because it comes round again every single night.</p>
    <div class="grid2 mt-l">
      <div class="card dark"><p class="tag">First, on your own</p><h3>Practise in private</h3><p>Spend about five minutes with tonight’s story. Hearth follows along as you read out loud and helps when you get stuck. Nobody is watching, and nothing is scored.</p></div>
      <div class="card dark"><p class="tag">Then, together</p><h3>Read it to your child</h3><p>At bedtime you read the same story, and you already know the words because you’ve just practised them. Your child gets to hear you read.</p></div>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="howTitle">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">How it works</span>
      <h2 id="howTitle">How a night with Hearth goes.</h2>
    </div>
    <div class="grid3">
      <div class="card"><div class="book" style="padding:8px;box-shadow:none">${scene(wish.pages[1].scene, 'A fish pops up next to Mateo.')}</div><p class="tag mt">1 · Tonight’s story</p><h3>A story you can really read</h3><p>Your child is in the story, and every word in it is one you can read already, plus the new sound you’re working on.</p></div>
      <div class="card"><div class="book" style="padding:8px;box-shadow:none"><div class="words" style="font-size:24px"><span class="k d">A</span> <span class="k f">fish</span> <span class="k d">pops</span> <span class="k d">up</span>.</div></div><p class="tag mt">2 · Practise on your own</p><h3>Help when you get stuck</h3><p>Read out loud. If you stop on a word, Hearth helps a little at a time. It takes about five minutes, whenever suits you.</p></div>
      <div class="card"><div class="book" style="padding:8px;box-shadow:none;background:var(--night)"><div class="words" style="font-size:24px;color:var(--on-night)">“What would you wish for?”</div></div><p class="tag mt">3 · Read together</p><h3>Story time, in your voice</h3><p>The screen dims for bed. Any help shows up quietly where only you can see it, and each page has a question to ask your child.</p></div>
    </div>
    <p class="mt"><a class="link-arrow" href="/how-it-works/">See it step by step, and try it</a></p>
  </div>
</section>

${hintLadder()}

<section class="band paper" aria-labelledby="whoTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Who it’s for</span><h2 id="whoTitle">Free for families. Paid for by the programs that already help them.</h2></div>
    <div class="grid2">
      <a class="card link" href="/families/"><div class="glyph">${ICON.heart}</div><p class="tag">For families</p><h3>Read the bedtime story with confidence</h3><p>It’s free and private, and you don’t need to read well to use it, because Hearth can read every screen out loud. It works in English and Spanish.</p><span class="link-arrow">For families · Para familias</span></a>
      <a class="card link" href="/programs/"><div class="glyph">${ICON.users}</div><p class="tag">For programs</p><h3>Reach the parents who don’t come forward</h3><p>For Head Start, libraries, adult education, clinics and health plans. You can see how families are getting on, but never anything private.</p><span class="link-arrow">For programs</span></a>
    </div>
  </div>
</section>

<section class="band night" aria-labelledby="growthTitle">
  <div class="wrap split wide-left">
    <div class="min0">${growthChart()}</div>
    <div class="stack">
      <span class="eyebrow">Progress you can see</span>
      <h2 id="growthTitle">From ten words to thousands.</h2>
      <p class="lead">Each new sound opens up a lot of everyday words. Hearth keeps count of how many of the 5,000 most common English words you can read, so you can watch yourself getting there.</p>
      <p><a class="link-arrow" href="/check/">Try it on any piece of text</a></p>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="storiesTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">The stories</span><h2 id="storiesTitle">Stories worth reading twice.</h2><p class="lead">There are ${STORIES.length} illustrated bedtime stories so far, from a first book with just a few words to two owls counting stars. We check every word in each one against the step it’s written for.</p></div>
    <div class="story-grid">
      ${featured.slice(0, 3).map(s => `<a class="story-card" href="/stories/#${s.id}"><div class="art">${scene(s.cover, personalize(s.title, fam))}</div><div class="body"><h3>${personalize(s.title, fam)}</h3><div class="pills"><span class="pill ember">Step ${s.step}</span><span class="pill">${s.pages.length} pages</span></div></div></a>`).join('')}
    </div>
    <p class="mt"><a class="link-arrow" href="/stories/">See all ${STORIES.length} stories</a></p>
  </div>
</section>

${ctaBand()}
`,
});

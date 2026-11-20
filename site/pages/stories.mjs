import { page, stars } from '../layout.mjs';
import { STORIES } from '../../product/data/stories.js';

export default page({
  path: '/stories/',
  title: 'Story library',
  description: `Read Hearth’s ${STORIES.length} illustrated bedtime stories. Each one is written for one of our 40 steps, so the parent holding it can read every word.`,
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">Story library</span>
    <h1>Stories worth reading twice.</h1>
    <p class="lead">Here are all ${STORIES.length} of our bedtime stories, from a first book with just a few words to two owls counting stars. Each one is written for a particular step, so a parent at that step can read every word. Type your child’s name below and they’ll be in the stories.</p>
  </div>
</section>

<section class="band paper" aria-label="Stories">
  <div class="wrap">
    <div class="personalise">
      <div class="field"><label for="stChild">Child’s name</label><input id="stChild" type="text" value="Mateo" maxlength="20" autocomplete="off"></div>
      <div class="field"><label for="stGrown">What they call you</label><input id="stGrown" type="text" value="Mama" maxlength="16" autocomplete="off"></div>
      <p class="small muted" style="max-width:36ch">Names stay in your browser and aren’t sent anywhere. In the app, the pictures look like your family too.</p>
    </div>
    <div class="story-grid" data-stories aria-live="polite"><p class="muted">Getting the stories…</p></div>
  </div>
</section>

<dialog class="reader" aria-labelledby="readerTitle">
  <div class="reader-inner">
    <div class="reader-art" data-r="art"></div>
    <div class="reader-text">
      <div class="reader-top"><span class="reader-title" id="readerTitle" data-r="title"></span><button class="reader-close" data-r="close" aria-label="Close">×</button></div>
      <p class="reader-page" data-r="text"></p>
      <div class="reader-talk" data-r="talk"></div>
      <div class="reader-nav">
        <button class="btn line sm" data-r="prev" aria-label="Previous page">←</button>
        <div class="dots" data-r="dots"></div>
        <button class="btn line sm" data-r="listen">Read it to me</button>
        <button class="btn lamp sm" data-r="next" aria-label="Next page">→</button>
      </div>
      <p class="small" style="color:var(--on-night-3)" data-r="meta"></p>
    </div>
  </div>
</dialog>

<section class="band night" aria-labelledby="howStories">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">How we make the stories</span><h2 id="howStories">Written for one step, then checked word by word.</h2></div>
    <div class="stack">
      <p class="lead">We wrote each story for one step. Then a computer check goes over every word, every time we change anything: each word has to be one you can sound out at that step, a heart word you’ve already learned, or a family name. The question on each page is there to get you and your child talking.</p>
      <p class="lead">When the app is connected to our story writer, it can also write a brand-new story for one family. That story gets exactly the same check, and is rewritten until every word passes.</p>
      <p><a class="link-arrow" href="/check/">Check a story’s words yourself</a></p>
    </div>
  </div>
</section>
`,
  modules: ['/assets/stories.js'],
});

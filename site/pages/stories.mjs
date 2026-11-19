import { page, stars } from '../layout.mjs';
import { STORIES } from '../../product/data/stories.js';

export default page({
  path: '/stories/',
  title: 'Story library',
  description: `Read Hearth’s ${STORIES.length} illustrated bedtime stories. Each is written for one step of a 40-step phonics sequence, so every word is readable for the parent holding it.`,
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">Story library</span>
    <h1>Stories worth reading twice.</h1>
    <p class="lead">${STORIES.length} illustrated bedtime stories, from a first book with a handful of words to owls counting stars. Each is written for one step, so every word is one the parent can read. Put your own child in them.</p>
  </div>
</section>

<section class="band paper" aria-label="Stories">
  <div class="wrap">
    <div class="personalise">
      <div class="field"><label for="stChild">Child’s name</label><input id="stChild" type="text" value="Mateo" maxlength="20" autocomplete="off"></div>
      <div class="field"><label for="stGrown">What they call you</label><input id="stGrown" type="text" value="Mama" maxlength="16" autocomplete="off"></div>
      <p class="small muted" style="max-width:36ch">Names stay in your browser. In the app, pictures also take on your family’s look.</p>
    </div>
    <div class="story-grid" data-stories aria-live="polite"><p class="muted">Loading stories…</p></div>
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
        <button class="btn line sm" data-r="listen">Read aloud</button>
        <button class="btn lamp sm" data-r="next" aria-label="Next page">→</button>
      </div>
      <p class="small" style="color:var(--on-night-3)" data-r="meta"></p>
    </div>
  </div>
</dialog>

<section class="band night" aria-labelledby="howStories">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">How the stories are made</span><h2 id="howStories">Written for a step, checked word by word.</h2></div>
    <div class="stack">
      <p class="lead">Each library story was written for one step of the sequence and passes the same automated check in our test suite: every word decodable, a heart word already taught, or a family word. The question on each page follows dialogic reading.</p>
      <p class="lead">In the app, Hearth can also write a new story for one family at one parent’s exact step. It is checked the same way, and rewritten until it passes.</p>
      <p><a class="link-arrow" href="/check/">Check a story’s words yourself</a></p>
    </div>
  </div>
</section>
`,
  modules: ['/assets/stories.js'],
});

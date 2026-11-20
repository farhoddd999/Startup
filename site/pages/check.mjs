import { page, stars } from '../layout.mjs';

export default page({
  path: '/check/',
  title: 'Word checker',
  description: 'Paste in any text and see which words a parent at each of Hearth’s 40 steps can really read, which they know by heart, and which are still out of reach.',
  body: `
<section class="page-hero night">
  ${stars(40)}
  <div class="wrap">
    <span class="eyebrow">Word checker</span>
    <h1>Which of these words could they really read?</h1>
    <p class="lead">Paste in any text and slide to where a reader is on Hearth’s 40 steps. Each word gets broken into its sounds and sorted by whether they could read it. It’s the same checker that goes over every Hearth story before a parent sees it.</p>
  </div>
</section>

<section class="band paper" aria-label="Checker">
  <div class="wrap">
    <div class="checker" data-checker>
      <div class="card stack">
        <div class="field"><label for="ckStep">Reader is working on <span data-ck="stepTitle">step 14: sh</span></label><input id="ckStep" type="range" min="1" max="40" value="14"><div class="small muted" style="display:flex;justify-content:space-between"><span>step 1</span><b data-ck="stepNum" style="color:var(--ember-deep)">14</b><span>step 40</span></div></div>
        <div class="field"><label for="ckNames">Family words (always readable)</label><input id="ckNames" type="text" value="Mateo, Mama"><span class="hint">The child’s name, and what they call the parent. A parent always knows these.</span></div>
        <div class="field"><label for="ckText">Your text</label><textarea id="ckText" rows="8"></textarea></div>
        <div class="chip-row"><span>Or try:</span><button data-sample="hearth">A page from Hearth</button><button data-sample="note">A note from school</button><button data-sample="label">A medicine label</button><button data-sample="classic">A well-known picture book</button></div>
      </div>
      <div class="card stack min0">
        <div class="mini-stats" data-ck="stats"><div><b>…</b><span>getting the dictionary ready</span></div></div>
        <div class="legend"><span><i class="sw decodable"></i>Can sound out</span><span><i class="sw focus"></i>Uses the new sound</span><span><i class="sw heart"></i>Heart word</span><span><i class="sw name"></i>Family word</span><span><i class="sw tricky"></i>Not yet</span></div>
        <div class="xray" data-ck="out" aria-live="polite"></div>
        <div data-ck="detail" style="border-top:1px solid var(--paper-3);padding-top:14px"><p class="muted">Tap any word to see the sounds it’s made of.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="whyTitle">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">Why it matters</span><h2 id="whyTitle">Most writing isn’t made for new readers.</h2><p class="lead">A parent who’s learning “sh” can read only about 30% of a typical note home from school. Ordinary children’s books aren’t much better. That’s why every Hearth story is checked word by word before it reaches a parent.</p></div>
    <div class="stack">
      <h3>How the checker works</h3>
      <ul class="checklist">
        <li><span>It looks up how each word is said in the CMU Pronouncing Dictionary. About 19,500 common words are included here.</span></li>
        <li><span>214 spelling rules match the letters to the sounds, and the simplest match wins.</span></li>
        <li><span>Every letter sound belongs to one of the 40 steps. A word counts as readable once all its sounds have been taught, or if it’s a heart word the reader has already learned.</span></li>
        <li><span>It all happens in your browser. Nothing you paste in is sent anywhere.</span></li>
      </ul>
      <p><a class="link-arrow" href="/science/#sequence">See all 40 steps</a></p>
    </div>
  </div>
</section>
`,
  modules: ['/assets/check.js'],
});

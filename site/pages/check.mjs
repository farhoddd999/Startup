import { page, stars } from '../layout.mjs';

export default page({
  path: '/check/',
  title: 'Decodability checker',
  description: 'Paste any text and see which words a parent at each step of Hearth’s phonics sequence can actually read: decodable words, heart words, and words not yet in reach.',
  body: `
<section class="page-hero night">
  ${stars(40)}
  <div class="wrap">
    <span class="eyebrow">Decodability checker</span>
    <h1>Which words can this reader actually read?</h1>
    <p class="lead">Paste any text and choose where a reader is on Hearth’s 40-step path. Every word is explained as sounds, then sorted. It’s the same engine that checks every Hearth story before a parent sees it.</p>
  </div>
</section>

<section class="band paper" aria-label="Checker">
  <div class="wrap">
    <div class="checker" data-checker>
      <div class="card stack">
        <div class="field"><label for="ckStep">Reader is working on <span data-ck="stepTitle">step 14: sh</span></label><input id="ckStep" type="range" min="1" max="40" value="14"><div class="small muted" style="display:flex;justify-content:space-between"><span>step 1</span><b data-ck="stepNum" style="color:var(--ember-deep)">14</b><span>step 40</span></div></div>
        <div class="field"><label for="ckNames">Family words (always readable)</label><input id="ckNames" type="text" value="Mateo, Mama"><span class="hint">The child’s name and what they call the parent.</span></div>
        <div class="field"><label for="ckText">Text</label><textarea id="ckText" rows="8"></textarea></div>
        <div class="chip-row"><span>Try:</span><button data-sample="hearth">A Hearth page</button><button data-sample="note">A note from school</button><button data-sample="label">A medicine label</button><button data-sample="classic">A classic picture book line</button></div>
      </div>
      <div class="card stack min0">
        <div class="mini-stats" data-ck="stats"><div><b>…</b><span>loading the dictionary</span></div></div>
        <div class="legend"><span><i class="sw decodable"></i>Can sound out</span><span><i class="sw focus"></i>Uses the new sound</span><span><i class="sw heart"></i>Heart word</span><span><i class="sw name"></i>Family word</span><span><i class="sw tricky"></i>Not yet</span></div>
        <div class="xray" data-ck="out" aria-live="polite"></div>
        <div data-ck="detail" style="border-top:1px solid var(--paper-3);padding-top:14px"><p class="muted">Click any word to see how it splits into sounds.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="whyTitle">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">Why it matters</span><h2 id="whyTitle">Most text isn’t written for new readers.</h2><p class="lead">A typical note home from school is only about 30% readable for a parent learning “sh”. That’s why generic content fails these parents, and why every Hearth story is checked word by word before it reaches them.</p></div>
    <div class="stack">
      <h3>How it works</h3>
      <ul class="checklist">
        <li><span>Each word’s pronunciation comes from the CMU Pronouncing Dictionary (about 19,500 common words are included here).</span></li>
        <li><span>214 spelling rules map letters to sounds; the simplest explanation wins.</span></li>
        <li><span>Each sound pattern belongs to one of 40 steps. A word is readable once all its patterns are taught, or if it’s a heart word already learned.</span></li>
        <li><span>Everything runs in your browser. Nothing you paste is sent anywhere.</span></li>
      </ul>
      <p><a class="link-arrow" href="/science/#sequence">See all 40 steps</a></p>
    </div>
  </div>
</section>
`,
  modules: ['/assets/check.js'],
});

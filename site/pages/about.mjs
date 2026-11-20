import { page, ICON, stars, SITE } from '../layout.mjs';
import { scene } from '../parts.mjs';

export default page({
  path: '/about/',
  title: 'About',
  description: 'Why Hearth exists: to help grown-ups who find reading hard become confident readers by reading with their children. What we believe, where we are, and how to reach us.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">About Hearth</span>
    <h1>Any parent can be the one who reads the bedtime story.</h1>
    <p class="lead">We started Hearth to help grown-ups who find reading hard become confident readers, by reading with their children. We’re starting in the United States, in English and Spanish. But this isn’t only an American problem: around the world, 739 million adults don’t have basic reading and writing skills.</p>
  </div>
</section>

<section class="band paper" aria-labelledby="nameTitle">
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">The name</span>
      <h2 id="nameTitle">Why we called it Hearth.</h2>
      <p class="lead">A hearth is the warm heart of a home, the place where stories have always been told and passed down. Our little logo is a flame rising out of an open book, because that’s where we think the warmth is.</p>
    </div>
    <div class="book">${scene({ bg: 'night', items: [['moon', 82, 26, 0.9], ['stars', 26, 24, 1], ['bed', 50, 90, 1.25], ['grownup', 36, 84, 0.95, { pose: 'hug' }], ['child', 58, 84, 0.85, { pose: 'hug' }], ['heart', 47, 30, 0.6]] }, 'A parent and child hugging at bedtime.')}</div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="valuesTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">What we believe</span><h2 id="valuesTitle">The promises we make.</h2></div>
    <div class="grid4">
      <div class="card"><div class="glyph">${ICON.heart}</div><h3>Respect, always</h3><p>No levels, no scores, no red marks. The parents we build for are capable adults, and we never talk down to them.</p></div>
      <div class="card"><div class="glyph">${ICON.lock}</div><h3>Private from the start</h3><p>Your practice stays on your phone. We don’t show ads and we don’t sell data. Not now, not ever.</p></div>
      <div class="card"><div class="glyph">${ICON.flask}</div><h3>Honest about results</h3><p>We say where our numbers come from, we measure what Hearth really does, and we’ll publish what we find, even if it’s disappointing.</p></div>
      <div class="card"><div class="glyph">${ICON.users}</div><h3>Families never pay</h3><p>The programs that work with families pay for Hearth, so money is never the reason a parent goes without.</p></div>
    </div>
    <p class="note mt">We plan to set Hearth up as a <b>public benefit corporation</b>, so this purpose is written into the company’s legal charter, not just into a web page.</p>
  </div>
</section>

<section class="band night" aria-labelledby="nowTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Where we are</span><h2 id="nowTitle">It works. Now we need to find out how much it helps.</h2></div>
    <div class="grid3">
      <div class="card dark"><p class="tag">Today</p><h3>Built and working</h3><p>The app you can put on your phone, the 40-step reading engine, ${'14'} checked stories, the story writer, a dashboard for programs, and the word checker on this site.</p></div>
      <div class="card dark"><p class="tag">The next 6 months</p><h3>First pilots</h3><p>Three pilot sites with about 150 families, speech recognition that runs on the phone itself, and our first Spanish stories.</p></div>
      <div class="card dark"><p class="tag">After that</p><h3>Proof, then growth</h3><p>Publishing what the pilots show us, and working with paying programs to reach around 3,000 families.</p></div>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="joinTitle">
  <div class="wrap grid2">
    <div class="card stack">
      <span class="eyebrow">Work with us</span>
      <h2 id="joinTitle" style="font-size:34px">We’re looking for our first teammates.</h2>
      <ul class="checklist">
        <li><span><b>A learning scientist in early literacy</b>, to look after the steps, the stories and the evidence.</span></li>
        <li><span><b>A mobile engineer</b>, to move speech recognition onto the phone, so voices never leave it.</span></li>
        <li><span><b>A partnerships lead</b> who has worked inside Head Start, a library system or adult education.</span></li>
      </ul>
      <p>If one of these sounds like you, write to <a href="mailto:${SITE.contact}">${SITE.contact}</a> and tell us why this matters to you.</p>
    </div>
    <div class="card stack">
      <span class="eyebrow">Investors and funders</span>
      <h2 style="font-size:34px">Help us find out if it works.</h2>
      <p>We’re raising a small first round to run our pilots, build the app further and publish the results. We’d love to hear from foundations and grant-makers in literacy and early childhood, too.</p>
      <p>Ask us for our deck and supporting documents at <a href="mailto:${SITE.contact}">${SITE.contact}</a>.</p>
      <div class="copy-box"><code>${SITE.contact}</code><button class="btn ink sm" data-copy="${SITE.contact}">Copy email</button></div>
    </div>
  </div>
</section>
`,
});

import { page, ICON, stars, SITE } from '../layout.mjs';
import { scene } from '../parts.mjs';

export default page({
  path: '/about/',
  title: 'About',
  description: 'Hearth’s mission: help adults who struggle to read become confident readers by reading with their children. Our values, where we are, and how to reach us.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">About Hearth</span>
    <h1>Every parent can be the one who reads the bedtime story.</h1>
    <p class="lead">Hearth exists to help adults who struggle to read become confident readers, by reading with their children. We start in the United States, in English and Spanish, and we’re building for the 739 million adults worldwide who lack basic literacy.</p>
  </div>
</section>

<section class="band paper" aria-labelledby="nameTitle">
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">The name</span>
      <h2 id="nameTitle">Why “Hearth”.</h2>
      <p class="lead">The hearth is the warm centre of a home, where stories have always been told and passed down. Our mark is a small flame rising from the spine of an open book: stories are where the warmth is.</p>
    </div>
    <div class="book">${scene({ bg: 'night', items: [['moon', 82, 26, 0.9], ['stars', 26, 24, 1], ['bed', 50, 90, 1.25], ['grownup', 36, 84, 0.95, { pose: 'hug' }], ['child', 58, 84, 0.85, { pose: 'hug' }], ['heart', 47, 30, 0.6]] }, 'A parent and child hugging at bedtime.')}</div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="valuesTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">What we believe</span><h2 id="valuesTitle">Our commitments.</h2></div>
    <div class="grid4">
      <div class="card"><div class="glyph">${ICON.heart}</div><h3>Dignity first</h3><p>No levels, scores or red marks. We design for proud adults, never down to them.</p></div>
      <div class="card"><div class="glyph">${ICON.lock}</div><h3>Private by default</h3><p>Practice stays on the phone. No ads, no data sales, ever.</p></div>
      <div class="card"><div class="glyph">${ICON.flask}</div><h3>Evidence over hype</h3><p>We cite our sources, measure outcomes, and publish what we find, including results that disappoint.</p></div>
      <div class="card"><div class="glyph">${ICON.users}</div><h3>Families never pay</h3><p>Programs that serve families fund Hearth, so cost is never the reason a parent goes without.</p></div>
    </div>
    <p class="note mt">Hearth plans to incorporate as a <b>public benefit corporation</b>, so the mission is written into the company’s charter.</p>
  </div>
</section>

<section class="band night" aria-labelledby="nowTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Where we are</span><h2 id="nowTitle">A working prototype. Pilots next.</h2></div>
    <div class="grid3">
      <div class="card dark"><p class="tag">Today</p><h3>Built and working</h3><p>The phone app, a 40-step phonics engine, ${'14'} decodable stories, the story writer, a partner dashboard and the decodability checker on this site.</p></div>
      <div class="card dark"><p class="tag">Next 6 months</p><h3>Pilots and the phone app</h3><p>Three pilot sites with about 150 families. An Android app with speech recognition on the phone. First Spanish stories.</p></div>
      <div class="card dark"><p class="tag">Months 7–18</p><h3>Evidence and scale</h3><p>Published pilot results, an iOS app, and paid partnerships reaching about 3,000 families.</p></div>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="joinTitle">
  <div class="wrap grid2">
    <div class="card stack">
      <span class="eyebrow">Join us</span>
      <h2 id="joinTitle" style="font-size:34px">We’re hiring our first team.</h2>
      <ul class="checklist">
        <li><span><b>Learning scientist, early literacy.</b> Own the sequence, the stories and the evidence.</span></li>
        <li><span><b>Mobile engineer.</b> Bring speech recognition onto the phone, privately.</span></li>
        <li><span><b>Partnerships lead.</b> Someone who has worked inside Head Start, a library system or adult education.</span></li>
      </ul>
      <p>Write to <a href="mailto:${SITE.contact}">${SITE.contact}</a> and tell us why this matters to you.</p>
    </div>
    <div class="card stack">
      <span class="eyebrow">Investors and funders</span>
      <h2 style="font-size:34px">Help us prove it works.</h2>
      <p>We’re raising a pre-seed round to run our first pilots, build the phone app and publish the results. Foundations and grant-makers in literacy and early childhood are welcome too.</p>
      <p>Ask for our deck and data room at <a href="mailto:${SITE.contact}">${SITE.contact}</a>.</p>
      <div class="copy-box"><code>${SITE.contact}</code><button class="btn ink sm" data-copy="${SITE.contact}">Copy email</button></div>
    </div>
  </div>
</section>
`,
});

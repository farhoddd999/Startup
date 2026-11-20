import { page, stars, SITE } from '../layout.mjs';

export default page({
  path: '/pilot/',
  title: 'Start a pilot',
  description: 'Bring Hearth to the families you work with in a free 12-week pilot. We bring the launch materials, staff training, a dashboard and a report on how it went.',
  body: `
<section class="page-hero night">
  ${stars(40)}
  <div class="wrap">
    <span class="eyebrow">Start a pilot</span>
    <h1>Bring Hearth to your families.</h1>
    <p class="lead">We’re offering free 12-week pilots to Head Start programs, libraries, adult education programs, clinics and health plans. We’ll bring the materials, the training and the evaluation, and families never pay anything.</p>
  </div>
</section>

<section class="band paper" aria-labelledby="formTitle">
  <div class="wrap split top">
    <div class="stack-lg">
      <div class="stack">
        <span class="eyebrow">What’s included</span>
        <h2 id="formTitle">Everything you need to get going.</h2>
      </div>
      <ul class="checklist">
        <li><span><b>A launch night kit:</b> printed code cards and guides for families, in English and Spanish</span></li>
        <li><span><b>Staff training:</b> 45 minutes online, plus a one-page guide to keep</span></li>
        <li><span><b>The partner dashboard:</b> who’s reading each week, how it’s growing, and who might like a check-in</span></li>
        <li><span><b>An evaluation</b> run with a research partner, and a report you can share with funders</span></li>
        <li><span><b>One person at Hearth</b> you can call on for the whole pilot</span></li>
      </ul>
      <div class="note"><b>What we’d ask of you:</b> 30 to 60 families with a child aged 0 to 8, one launch evening, and about 30 minutes a week from a family advocate.</div>
    </div>
    <div class="card">
      <form class="form" data-pilot-form novalidate>
        <div class="field"><label for="pName">Your name</label><input id="pName" name="name" autocomplete="name" required></div>
        <div class="field"><label for="pRole">Your role</label><input id="pRole" name="role" autocomplete="organization-title" placeholder="Family services manager"></div>
        <div class="field full"><label for="pOrg">Organization</label><input id="pOrg" name="organization" autocomplete="organization" required></div>
        <div class="field"><label for="pEmail">Email</label><input id="pEmail" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="pType">Type of program</label><select id="pType" name="type"><option>Head Start / Early Head Start</option><option>Public library</option><option>Adult education</option><option>Pediatric clinic</option><option>Health plan</option><option>School or district</option><option>Other</option></select></div>
        <div class="field"><label for="pFamilies">Roughly how many families you work with</label><input id="pFamilies" name="families" inputmode="numeric" placeholder="200"></div>
        <div class="field"><label for="pState">State or country</label><input id="pState" name="location" autocomplete="address-level1"></div>
        <div class="field full"><label for="pMsg">Anything else we should know?</label><textarea id="pMsg" name="message" placeholder="For example: the languages your families speak, when you’d like to start, or what you’d hope to learn"></textarea></div>
        <div class="full cta-row"><button class="btn ember" type="submit">Send my request</button><span class="small muted">This opens your email app with everything filled in. Nothing is sent until you press send there.</span></div>
        <div class="full form-msg" data-form-msg hidden role="status"></div>
      </form>
    </div>
  </div>
</section>

<section class="band night" aria-labelledby="pfaq">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Before you ask</span><h2 id="pfaq">Questions about pilots.</h2></div>
    <div class="faq">
      <details><summary>Does a pilot cost anything?</summary><p>No, pilots are free. If you’d like to carry on afterwards, the price we’re proposing is $60 per family per year, with a minimum of $3,000 per site.</p></details>
      <details><summary>Which families should we invite?</summary><p>Every family with a child aged 0 to 8. Offer it to everyone as a bedtime story app. Parents who’d like help with their reading will find it there, privately, without anyone singling them out.</p></details>
      <details><summary>What do families need?</summary><p>Just a smartphone. Once Hearth is on their phone it works without internet, and they don’t need an email address or an account.</p></details>
      <details><summary>Who runs the evaluation?</summary><p>An independent research partner. Families start in two waves, so everyone gets Hearth and the later group gives us a fair comparison. Families agree to the research separately, and can stop whenever they like.</p></details>
    </div>
    <p class="mt" style="color:var(--on-night-2)">Would you rather just email us? Write to <a href="mailto:${SITE.contact}" style="color:var(--lamp)">${SITE.contact}</a>.</p>
  </div>
</section>
`,
  bodyClass: 'pilot-page',
});

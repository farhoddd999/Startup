import { page, stars, SITE } from '../layout.mjs';

export default page({
  path: '/pilot/',
  title: 'Start a pilot',
  description: 'Bring Hearth to the families you serve with a free 12-week pilot: launch materials, staff training, a partner dashboard and an outcomes report.',
  body: `
<section class="page-hero night">
  ${stars(40)}
  <div class="wrap">
    <span class="eyebrow">Start a pilot</span>
    <h1>Bring Hearth to your families.</h1>
    <p class="lead">A free 12-week pilot for Head Start programs, libraries, adult education programs, clinics and health plans. We bring the materials, the training and the evaluation. Families never pay.</p>
  </div>
</section>

<section class="band paper" aria-labelledby="formTitle">
  <div class="wrap split top">
    <div class="stack-lg">
      <div class="stack">
        <span class="eyebrow">What’s included</span>
        <h2 id="formTitle">Everything you need to start.</h2>
      </div>
      <ul class="checklist">
        <li><span><b>Family launch night kit:</b> printed code cards and guides in English and Spanish</span></li>
        <li><span><b>Staff training:</b> 45 minutes online, plus a one-page guide</span></li>
        <li><span><b>Partner dashboard:</b> weekly reading, growth, and a check-in list</span></li>
        <li><span><b>Evaluation:</b> with a research partner, and a report you can share with funders</span></li>
        <li><span><b>A contact person at Hearth</b> for the whole pilot</span></li>
      </ul>
      <div class="note"><b>What we ask:</b> 30–60 families with a child aged 0–8, one launch evening, and about 30 minutes a week from a family advocate.</div>
    </div>
    <div class="card">
      <form class="form" data-pilot-form novalidate>
        <div class="field"><label for="pName">Your name</label><input id="pName" name="name" autocomplete="name" required></div>
        <div class="field"><label for="pRole">Role</label><input id="pRole" name="role" autocomplete="organization-title" placeholder="Family services manager"></div>
        <div class="field full"><label for="pOrg">Organization</label><input id="pOrg" name="organization" autocomplete="organization" required></div>
        <div class="field"><label for="pEmail">Email</label><input id="pEmail" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="pType">Type of program</label><select id="pType" name="type"><option>Head Start / Early Head Start</option><option>Public library</option><option>Adult education</option><option>Pediatric clinic</option><option>Health plan</option><option>School or district</option><option>Other</option></select></div>
        <div class="field"><label for="pFamilies">Families you serve (about)</label><input id="pFamilies" name="families" inputmode="numeric" placeholder="200"></div>
        <div class="field"><label for="pState">State or country</label><input id="pState" name="location" autocomplete="address-level1"></div>
        <div class="field full"><label for="pMsg">Anything we should know?</label><textarea id="pMsg" name="message" placeholder="Languages your families speak, timing, what you’d like to learn from a pilot"></textarea></div>
        <div class="full cta-row"><button class="btn ember" type="submit">Send pilot request</button><span class="small muted">Opens your email app with the details filled in.</span></div>
        <div class="full form-msg" data-form-msg hidden role="status"></div>
      </form>
    </div>
  </div>
</section>

<section class="band night" aria-labelledby="pfaq">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Before you ask</span><h2 id="pfaq">Pilot questions.</h2></div>
    <div class="faq">
      <details><summary>Does a pilot cost anything?</summary><p>No. Pilots are free. If you continue afterwards, our proposed price is $60 per enrolled family per year, with a $3,000 minimum per site.</p></details>
      <details><summary>Which families should we invite?</summary><p>Every family with a child aged 0–8. Offer Hearth as a bedtime story app. Parents who want help with reading will find it privately.</p></details>
      <details><summary>What do families need?</summary><p>A smartphone. Hearth works offline after the first use and needs no email address.</p></details>
      <details><summary>Who runs the evaluation?</summary><p>A research partner, with a waitlist comparison so every family gets Hearth. Families consent separately, and can stop at any time.</p></details>
    </div>
    <p class="mt" style="color:var(--on-night-2)">Prefer email? Write to <a href="mailto:${SITE.contact}" style="color:var(--lamp)">${SITE.contact}</a>.</p>
  </div>
</section>
`,
  bodyClass: 'pilot-page',
});

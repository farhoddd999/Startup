import { page, ICON, stars } from '../layout.mjs';
import { ctaBand } from '../parts.mjs';

const TABS = [
  ['headstart', 'Head Start', 'Head Start and Early Head Start',
    'Family engagement and parent literacy are already part of what you’re asked to deliver, and some of your parents find reading hard. Hearth gives them a private way to read to their children every night, and gives you something to show for it.',
    ['Evidence for the “Families as Lifelong Learners” and family engagement outcomes', 'Nights read together and how parents’ reading is growing, for each family and for the whole program', 'Easy to start at a parent night. Family advocates can see who might like a friendly check-in']],
  ['libraries', 'Libraries', 'Public libraries',
    'Story time reaches the families who already come through your doors. Hearth can reach the ones who don’t, and it supports your adult literacy and early literacy work at the same time.',
    ['A code card at the front desk, in the children’s area, or tucked inside a take-home book', 'Works well alongside adult literacy tutoring and English classes', 'Reports for your board and funders: families reached and nights read']],
  ['adulted', 'Adult education', 'Adult education programs',
    'Your learners get to practise between classes with something they really care about: their own child’s bedtime story. And you get to see progress between the formal assessments.',
    ['A little practice every day, around work and childcare', 'Ongoing progress, so you can step in before the post-test, not after', 'A strong reason to keep going for parents who want to read with their kids']],
  ['clinics', 'Clinics', 'Pediatric clinics',
    'Many clinics give a free book at well-child visits. Some of the parents taking that book home can’t read it. A Hearth card inside the book can change what happens when they get there.',
    ['A simple referral: a code card goes in with the book', 'No changes to how your clinic runs', 'Summary reports on how many families you’ve reached']],
  ['health', 'Health plans', 'Medicaid and health plans',
    'Low health literacy costs the U.S. somewhere between $106 billion and $238 billion a year. Hearth builds everyday reading confidence in a way members actually enjoy using.',
    ['A member benefit for families with young children', 'Outcome reports that are summarised and can’t identify anyone', 'Volume pricing for programs across a whole plan']],
];

export default page({
  path: '/programs/',
  title: 'For programs',
  description: 'Hearth for Head Start, libraries, adult education, clinics and health plans. Reach parents who find reading hard, with clear reports and nothing private shared.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">For programs and partners</span>
    <h1>Reach the parents who don’t come forward.</h1>
    <p class="lead">In most groups of families you work with, some parents find reading hard and would rather nobody knew. Hearth gives them a private way to read to their children every night. You get clear reports on how families are doing, and families never pay a thing.</p>
    <div class="cta-row"><a class="btn lamp" href="/pilot/">Start a free pilot</a><a class="btn line" href="/dashboard/">See the dashboard demo</a></div>
  </div>
</section>

<section class="band night-2" aria-labelledby="fitTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Who we work with</span><h2 id="fitTitle">Made for the people who already help these families.</h2></div>
    <div class="tabs" role="tablist" aria-label="Partner types">
      ${TABS.map(([id, label], i) => `<button role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('')}
    </div>
    ${TABS.map(([id, , title, text, points], i) => `<div role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}"${i ? ' hidden' : ''}><div class="split top"><div class="stack"><h3 style="font-size:30px">${title}</h3><p class="lead">${text}</p></div><ul class="checklist">${points.map(p => `<li><span>${p}</span></li>`).join('')}</ul></div></div>`).join('')}
  </div>
</section>

<section class="band paper" aria-labelledby="dashTitle">
  <div class="wrap split wide-left">
    <div class="min0"><a href="/dashboard/" aria-label="Open the partner dashboard demo"><img src="/assets/img/dashboard.png" alt="Hearth partner dashboard with weekly reading, growth charts and a check-in list (demo data)." width="2560" height="1720" style="border-radius:18px;box-shadow:0 24px 60px rgba(30,42,71,.18)"></a></div>
    <div class="stack">
      <span class="eyebrow">Partner dashboard</span>
      <h2 id="dashTitle">See how families are doing, without seeing anything private.</h2>
      <ul class="checklist">
        <li><span>How many families read together each week</span></li>
        <li><span>How many words parents can read, and how that’s growing</span></li>
        <li><span>Which families might welcome a friendly check-in</span></li>
        <li><span>One click to export it all for funders and reports</span></li>
      </ul>
      <p class="note"><b>What you’ll never see:</b> recordings, the words a parent found hard, the help they asked for, or anything a child said. Families also decide whether to share a summary with you at all.</p>
      <div><a class="btn ink" href="/dashboard/">Open the demo dashboard</a></div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="priceTitle" id="pricing">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Pricing</span><h2 id="priceTitle">Free for families. Simple for programs.</h2><p class="lead">This is the pricing we’re proposing for our first partners. We’ll settle final prices together with the programs in our pilots.</p></div>
    <div class="grid3">
      <div class="card stack"><p class="tag">Pilot</p><h3 style="font-size:38px">Free</h3><p>12 weeks, 2 or 3 sites, 30 to 60 families at each.</p><ul class="checklist"><li><span>Everything for a launch night, including printed code cards</span></li><li><span>Training for your staff</span></li><li><span>The dashboard, and a report on how it went</span></li></ul></div>
      <div class="card stack" style="border:2px solid var(--ember)"><p class="tag">Program</p><h3 style="font-size:38px">$60 <span style="font-size:18px;font-family:var(--body);font-weight:400">per family, per year</span></h3><p>With a minimum of $3,000 per site.</p><ul class="checklist"><li><span>Codes for your families, and the partner dashboard</span></li><li><span>Reports you can give to funders</span></li><li><span>A support line for families</span></li></ul></div>
      <div class="card stack"><p class="tag">Network, state or health plan</p><h3 style="font-size:38px">Volume</h3><p>For networks of sites, states and health plans.</p><ul class="checklist"><li><span>Everything in Program</span></li><li><span>Connecting to your data systems, with outcome reports</span></li><li><span>One person at Hearth who looks after your partnership</span></li></ul></div>
    </div>

    <div class="calc mt-l" data-calc>
      <div class="card stack">
        <h3>What would it cost you?</h3>
        <div class="field"><label for="calcFamilies">Families taking part: <span class="range-val" data-out="families">150</span></label><input id="calcFamilies" type="range" min="20" max="3000" step="10" value="150"></div>
        <div class="field"><label for="calcSites">Sites: <span class="range-val" data-out="sites">2</span></label><input id="calcSites" type="range" min="1" max="40" step="1" value="2"></div>
        <div class="field"><label for="calcNights">Story nights per family each week (in our pilots we’re aiming for 2): <span class="range-val" data-out="nights">2</span></label><input id="calcNights" type="range" min="1" max="7" step="1" value="2"></div>
        <p class="small muted">These are estimates. We assume about 60 words per story, which is the average in our library.</p>
      </div>
      <div class="calc-out" aria-live="polite">
        <span class="eyebrow">Your estimate</span>
        <div><div class="big" data-out="cost">$9,000</div><div style="color:var(--on-night-2)">a year, after a free pilot</div></div>
        <div class="row"><span>Per family, per month</span><b data-out="perMonth">$5.00</b></div>
        <div class="row"><span>Bedtime stories read in a year</span><b data-out="storyNights">15,600</b></div>
        <div class="row"><span>Words read aloud to children in a year</span><b data-out="words">936,000</b></div>
        <a class="btn lamp" href="/pilot/">Start with a free pilot</a>
      </div>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="pilotTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">How a pilot runs</span><h2 id="pilotTitle">Twelve weeks, from start to finish.</h2></div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th style="width:18%">When</th><th>What happens</th><th style="width:30%">Time from your team</th></tr></thead>
      <tbody>
        <tr><td>4 weeks before</td><td>We sign a partnership and data agreement, and prepare consent forms for the evaluation</td><td>A couple of meetings</td></tr>
        <tr><td>2 weeks before</td><td>A 45-minute online training for staff, and printed code cards in English and Spanish</td><td>45 minutes for each staff member</td></tr>
        <tr><td>Week 0</td><td>A launch night for families: food, a short demo, and help putting Hearth on their phones</td><td>One evening</td></tr>
        <tr><td>Weeks 1 to 12</td><td>Families read at home. Your family advocate checks the dashboard and reaches out to families who’ve gone quiet</td><td>About 30 minutes a week</td></tr>
        <tr><td>Week 12</td><td>Final measures, conversations with families, and a report you can share with funders</td><td>One meeting to go over the results</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

<section class="band night" aria-labelledby="pfaqTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Questions programs ask us</span><h2 id="pfaqTitle">Good questions, honest answers.</h2></div>
    <div class="faq">
      <details><summary>How do we know which parents need Hearth?</summary><p>You don’t need to. Offer it to every family as a bedtime story app. Parents who’d like help with their reading get it privately, and nobody is singled out.</p></details>
      <details><summary>What data do we get, and what stays private?</summary><p>Only with each family’s permission: nights read, minutes of practice, sounds learned, and how many words they can read. Recordings, the words they found hard, the help they asked for and the stories themselves never leave the family’s phone.</p></details>
      <details><summary>Does Hearth replace our classes or home visits?</summary><p>No. Hearth is a few minutes of practice at home each day. It sits alongside your classes and visits, and it often gives staff a natural, kind way to start talking about reading.</p></details>
      <details><summary>What languages does it support?</summary><p>Every button and instruction works in English and Spanish, and can be read out loud. The stories are in English for now. Spanish stories are next.</p></details>
      <details><summary>How will you know if it works?</summary><p>We’ll run the evaluation with a research partner. Families start in two waves, so everyone gets Hearth, and the later group gives us a fair comparison. We’ll look at how parents’ reading grows, how many nights families read together, and children’s vocabulary. <a href="/science/#evaluation">Here’s the plan.</a></p></details>
    </div>
  </div>
</section>

${ctaBand('Bring Hearth to your families.', 'Start with a free 12-week pilot. We’ll bring the materials, the training and the evaluation.')}
`,
});

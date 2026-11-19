import { page, ICON, stars } from '../layout.mjs';
import { ctaBand } from '../parts.mjs';

const TABS = [
  ['headstart', 'Head Start', 'Head Start and Early Head Start',
    'Family engagement and parent literacy are required outcomes, and many of your families include a parent who finds reading hard. Hearth gives those parents a private way to read to their children every night.',
    ['Evidence for “Families as Lifelong Learners” and family engagement outcomes', 'Nights read together and parent reading growth, per family and for your program', 'Launch at a parent night; family advocates see who might welcome a check-in']],
  ['libraries', 'Libraries', 'Public libraries',
    'Story time reaches families who already come in. Hearth reaches the ones who don’t, and supports your adult literacy and early literacy goals at the same time.',
    ['A code card at the desk, in the children’s area, or inside a take-home book', 'Pairs well with adult literacy tutoring and English classes', 'Reports for library boards and funders with families reached and nights read']],
  ['adulted', 'Adult education', 'Adult education programs',
    'Your learners practise between classes with material they care about: their own child’s bedtime story. You see progress between formal assessments.',
    ['Daily practice that fits around work and childcare', 'Continuous progress data to target support before the post-test', 'A strong motivator for parents who want to read with their children']],
  ['clinics', 'Clinics', 'Pediatric clinics',
    'Clinics that give a book at well-child visits put a book in the hands of parents who may not be able to read it. A Hearth card in that book changes what happens at home.',
    ['A simple referral: a code card with the book', 'No clinical workflow changes', 'Aggregate reports on families reached']],
  ['health', 'Health plans', 'Medicaid and health plans',
    'Low health literacy costs the U.S. between $106 billion and $238 billion a year. Hearth builds everyday reading confidence in a way members actually want to use.',
    ['A member benefit built around families with young children', 'De-identified, aggregate outcome reporting', 'Volume pricing for plan-wide programs']],
];

export default page({
  path: '/programs/',
  title: 'For programs',
  description: 'Hearth for Head Start, libraries, adult education, clinics and health plans: reach parents who struggle to read, with a dashboard and reports, and no private data exposed.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">For programs and partners</span>
    <h1>Reach the parents your program can’t.</h1>
    <p class="lead">Many of the families you serve include a parent who finds reading hard and won’t say so. Hearth gives them a private way to read to their children every night. You get engagement data and reports, and families never pay.</p>
    <div class="cta-row"><a class="btn lamp" href="/pilot/">Start a free pilot</a><a class="btn line" href="/dashboard/">See the dashboard demo</a></div>
  </div>
</section>

<section class="band night-2" aria-labelledby="fitTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Who we work with</span><h2 id="fitTitle">Built for the people who already serve these families.</h2></div>
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
      <h2 id="dashTitle">See who’s reading, without seeing anything private.</h2>
      <ul class="checklist">
        <li><span>Families reading together each week</span></li>
        <li><span>How many words parents can read, and how that grows</span></li>
        <li><span>Families who might welcome a friendly check-in</span></li>
        <li><span>One-click export for funder and program reports</span></li>
      </ul>
      <p class="note"><b>Never shown to partners:</b> recordings, the words a parent stumbled on, hints, or anything a child said. Families choose whether to share a summary at all.</p>
      <div><a class="btn ink" href="/dashboard/">Open the live demo</a></div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="priceTitle" id="pricing">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Pricing</span><h2 id="priceTitle">Free for families. Simple for programs.</h2><p class="lead">Our proposed pricing for the first partners. We’ll set final prices with pilot partners.</p></div>
    <div class="grid3">
      <div class="card stack"><p class="tag">Pilot</p><h3 style="font-size:38px">Free</h3><p>12 weeks, 2–3 sites, 30–60 families each.</p><ul class="checklist"><li><span>Launch night kit and printed code cards</span></li><li><span>Staff training</span></li><li><span>Dashboard and an outcomes report</span></li></ul></div>
      <div class="card stack" style="border:2px solid var(--ember)"><p class="tag">Program</p><h3 style="font-size:38px">$60 <span style="font-size:18px;font-family:var(--body);font-weight:400">per family / year</span></h3><p>$3,000 minimum per site.</p><ul class="checklist"><li><span>Family codes and the partner dashboard</span></li><li><span>Reports for funders</span></li><li><span>Family support line</span></li></ul></div>
      <div class="card stack"><p class="tag">Network, state or health plan</p><h3 style="font-size:38px">Volume</h3><p>For networks of sites, states and health plans.</p><ul class="checklist"><li><span>Everything in Program</span></li><li><span>Data integration and outcome reporting</span></li><li><span>Dedicated partnership lead</span></li></ul></div>
    </div>

    <div class="calc mt-l" data-calc>
      <div class="card stack">
        <h3>Estimate your program’s cost</h3>
        <div class="field"><label for="calcFamilies">Families enrolled: <span class="range-val" data-out="families">150</span></label><input id="calcFamilies" type="range" min="20" max="3000" step="10" value="150"></div>
        <div class="field"><label for="calcSites">Sites: <span class="range-val" data-out="sites">2</span></label><input id="calcSites" type="range" min="1" max="40" step="1" value="2"></div>
        <div class="field"><label for="calcNights">Nights read together per family per week (our pilot goal is 2): <span class="range-val" data-out="nights">2</span></label><input id="calcNights" type="range" min="1" max="7" step="1" value="2"></div>
        <p class="small muted">Estimates only. Words per story assume about 60, the average across our library.</p>
      </div>
      <div class="calc-out" aria-live="polite">
        <span class="eyebrow">Your estimate</span>
        <div><div class="big" data-out="cost">$9,000</div><div style="color:var(--on-night-2)">per year, after a free pilot</div></div>
        <div class="row"><span>Cost per family per month</span><b data-out="perMonth">$5.00</b></div>
        <div class="row"><span>Story-time nights per year</span><b data-out="storyNights">15,600</b></div>
        <div class="row"><span>Words read aloud to children per year</span><b data-out="words">1,014,000</b></div>
        <a class="btn lamp" href="/pilot/">Start with a free pilot</a>
      </div>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="pilotTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">How a pilot runs</span><h2 id="pilotTitle">Twelve weeks, start to finish.</h2></div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th style="width:18%">When</th><th>What happens</th><th style="width:30%">Your team’s time</th></tr></thead>
      <tbody>
        <tr><td>4 weeks before</td><td>Partner and data-sharing agreements; consent materials for the evaluation</td><td>A couple of meetings</td></tr>
        <tr><td>2 weeks before</td><td>Staff training (45 minutes, online); printed code cards in English and Spanish</td><td>45 minutes per staff member</td></tr>
        <tr><td>Week 0</td><td>Family launch night: food, a short demo, help installing Hearth</td><td>One evening</td></tr>
        <tr><td>Weeks 1–12</td><td>Families read at home; your family advocate checks the dashboard and reaches out to quiet families</td><td>About 30 minutes a week</td></tr>
        <tr><td>Week 12</td><td>Final measures, family interviews, and a report you can share with funders</td><td>One results meeting</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

<section class="band night" aria-labelledby="pfaqTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Questions from partners</span><h2 id="pfaqTitle">What programs ask us.</h2></div>
    <div class="faq">
      <details><summary>How do we know which parents need Hearth?</summary><p>You don’t have to. Offer Hearth to every family as a bedtime story app. Parents who want help with reading get it privately; nobody is singled out.</p></details>
      <details><summary>What data do we get, and what stays private?</summary><p>With each family’s consent: nights read, practice minutes, sounds learned and words-you-can-read counts. Recordings, mistakes, hints and story text never leave the family’s phone.</p></details>
      <details><summary>Does Hearth replace our classes or home visits?</summary><p>No. Hearth is daily practice at home. It works alongside classes and home visits, and gives your staff a reason to start a warm conversation about reading.</p></details>
      <details><summary>What languages does it support?</summary><p>The interface speaks and reads in English and Spanish. Stories are in English today, with Spanish stories next.</p></details>
      <details><summary>How is the evaluation run?</summary><p>With a research partner, using a waitlist comparison so every family gets Hearth. We measure parent reading growth, nights read together and child vocabulary. See <a href="/science/#evaluation">the evaluation plan</a>.</p></details>
    </div>
  </div>
</section>

${ctaBand('Bring Hearth to your families.', 'Start with a free 12-week pilot. We bring the materials, the training and the evaluation.')}
`,
});

import { page, stars, SITE } from '../layout.mjs';

export default page({
  path: '/privacy/',
  title: 'Privacy',
  description: 'Hearth’s privacy commitments: practice stays on the phone, voice stays on the device, programs see only a consented summary, and we never sell data or show ads.',
  body: `
<section class="page-hero night">
  ${stars(40)}
  <div class="wrap">
    <span class="eyebrow">Privacy</span>
    <h1>This is just for you.</h1>
    <p class="lead">Many of the parents who use Hearth have kept their reading private for years. We built Hearth so it stays that way. These are commitments, not settings.</p>
  </div>
</section>

<section class="band paper" aria-labelledby="promTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Our promises</span><h2 id="promTitle">Six things we will always do.</h2></div>
    <div class="grid3">
      <div class="card"><h3>Practice stays on your phone</h3><p>Nobody sees which words you found hard: not your child, not your program, not Hearth staff.</p></div>
      <div class="card"><h3>Your voice stays on your phone</h3><p>In the Hearth app, speech recognition runs on the device. Recordings you make for your child are stored only on your phone and deleted with one tap.</p></div>
      <div class="card"><h3>No ads. No data sales.</h3><p>Ever. No tracking pixels or advertising networks, in the app or on this website.</p></div>
      <div class="card"><h3>Programs see a summary, only if you agree</h3><p>Nights read, practice minutes, sounds learned and your words-you-can-read count. You can stop sharing at any time; the app keeps working.</p></div>
      <div class="card"><h3>Children are not users</h3><p>We don’t collect information from children. Your child’s first name stays on your phone and is used only to put them in the story.</p></div>
      <div class="card"><h3>No names sent to AI</h3><p>When Hearth writes a new story, it sends only your reading step and your child’s interests. Names are placeholders, filled in on your phone.</p></div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="invTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">In detail</span><h2 id="invTitle">What we keep, where, and for how long.</h2></div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th>Information</th><th>Where it lives</th><th>Who can see it</th><th>How long</th></tr></thead>
      <tbody>
        <tr><td>Child’s first name, age range, and what they call you; your family’s look; interests</td><td>Your phone</td><td>You</td><td>Until you reset the app</td></tr>
        <tr><td>Which sounds you know; your reading history</td><td>Your phone</td><td>You</td><td>Until you reset the app</td></tr>
        <tr><td>Your voice while practising</td><td>Processed on the phone, not stored</td><td>Nobody</td><td>Not kept</td></tr>
        <tr><td>Recordings you make for your child</td><td>Your phone</td><td>You</td><td>Until you delete them</td></tr>
        <tr><td>Stories written for you</td><td>Your phone; reusable story text (no names) on our server</td><td>You</td><td>Story text may be reused for other families at the same step</td></tr>
        <tr><td>Program summary, if you agree to share</td><td>Hearth server</td><td>Staff at your program</td><td>Length of the program’s contract plus one year</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

<section class="band paper" aria-labelledby="protoTitle">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">About this prototype</span><h2 id="protoTitle">One honest note.</h2></div>
    <div class="stack prose">
      <p>The prototype on this website runs in your web browser and uses the browser’s own speech recognition. In some browsers, that sends audio to the browser maker. The app tells you this in Settings, and you can use tap mode or the demo reader instead. The Hearth app used in pilots replaces it with recognition on the phone before any family uses it.</p>
      <p>This website doesn’t use cookies or analytics. The demo app saves its progress only in your browser.</p>
      <p>This page summarises our commitments. A full privacy policy and partner data agreements will be published before our first pilot. Questions: <a href="mailto:${SITE.contact}">${SITE.contact}</a>.</p>
      <p class="small muted">Last updated November 2026.</p>
    </div>
  </div>
</section>
`,
});

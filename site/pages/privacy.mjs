import { page, stars, SITE } from '../layout.mjs';

export default page({
  path: '/privacy/',
  title: 'Privacy',
  description: 'How Hearth handles your information, in plain words: practice stays on your phone, nothing is sent without you choosing to, no ads, no selling data, and what this test version does differently.',
  body: `
<section class="page-hero night">
  ${stars(40)}
  <div class="wrap">
    <span class="eyebrow">Privacy</span>
    <h1>Your reading is your business.</h1>
    <p class="lead">Many parents who use Hearth have kept their reading to themselves for years. We built Hearth so it stays that way. Here’s exactly what happens to your information, including the parts of this early test version that aren’t finished yet.</p>
  </div>
</section>

<section class="band paper" aria-labelledby="promTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Our promises</span><h2 id="promTitle">Six things we’ll always do.</h2></div>
    <div class="grid3">
      <div class="card"><h3>Your practice stays on your phone</h3><p>Nobody sees which words you found hard. Not your child, not your program, not anyone at Hearth.</p></div>
      <div class="card"><h3>No ads, and we never sell data</h3><p>Not now, not ever. There are no tracking pixels and no advertising networks, in the app or on this website.</p></div>
      <div class="card"><h3>Nothing is sent without you</h3><p>Hearth doesn’t send anything about you on its own. Feedback only goes where you send it, and you see exactly what’s in it first.</p></div>
      <div class="card"><h3>Programs only see what you agree to</h3><p>Later, if you join through a program, you’ll be able to share a short summary with them: nights read, minutes practised and sounds learned. You can stop at any time and the app keeps working. In this test version nothing is shared at all.</p></div>
      <div class="card"><h3>Children aren’t users</h3><p>We don’t collect information from children. Your child’s first name stays on your phone and is only used to put them in the stories.</p></div>
      <div class="card"><h3>We never send names to AI</h3><p>When Hearth writes a new story, it only sends your reading step and the things your child loves. The story comes back with blanks where the names go, and your phone fills them in.</p></div>
    </div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="invTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">In detail</span><h2 id="invTitle">What’s kept, where, and for how long.</h2><p class="lead">This is how the test version works today.</p></div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th>Information</th><th>Where it lives</th><th>Who can see it</th><th>How long</th></tr></thead>
      <tbody>
        <tr><td>Your child’s first name and age, what they call you, how your family looks in the pictures, and what your child loves</td><td>Your phone</td><td>You</td><td>Until you choose “Start over”</td></tr>
        <tr><td>Which sounds you know, what you’ve read, words to warm up with, your child’s stickers, and your reading settings</td><td>Your phone</td><td>You</td><td>Until you choose “Start over”</td></tr>
        <tr><td>A backup file, if you save one to move phones</td><td>Wherever you save it. It includes your child’s name and your progress, but not recordings.</td><td>Whoever has the file</td><td>Until you delete it</td></tr>
        <tr><td>A bedtime reminder, if you add one</td><td>Your phone’s calendar (no names are in it)</td><td>You, and your calendar provider</td><td>Until you delete it</td></tr>
        <tr><td>Your voice while you practise</td><td>Your browser’s speech service listens and turns it into text (see the note below). Hearth doesn’t record or keep it.</td><td>Hearth: nobody. The browser company: see their policy.</td><td>Hearth keeps nothing</td></tr>
        <tr><td>Recordings you make for your child</td><td>Your phone</td><td>You</td><td>Until you delete them or start over</td></tr>
        <tr><td>Stories written for you</td><td>Your phone. To write one, your step and your child’s interests (never names) go to our story writer, which uses an AI model from Anthropic.</td><td>You</td><td>We don’t keep them on our side</td></tr>
        <tr><td>Feedback you choose to send</td><td>Wherever you send it: your email, a message app, or a copy you paste somewhere</td><td>The person you send it to</td><td>As long as they keep it</td></tr>
        <tr><td>Basic technical details when you open the website or app, like your IP address</td><td>Our hosting provider’s normal server logs</td><td>Our hosting provider</td><td>Their standard log period</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

<section class="band paper" aria-labelledby="protoTitle">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">About this test version</span><h2 id="protoTitle">One thing we want to be upfront about.</h2></div>
    <div class="stack prose">
      <p>Right now, Hearth runs in your web browser and uses the browser’s own speech service to follow your reading. In some browsers, that means the sound of your voice goes to the company that makes the browser (Google for Chrome, Apple for Safari). Hearth tells you this before you turn the microphone on, and again in Settings. If you’d rather it didn’t, tap mode works without listening at all.</p>
      <p>Before any family uses Hearth in a pilot, we’ll replace this with speech recognition that runs on the phone itself, so your voice never leaves it.</p>
      <p>This website doesn’t use cookies or analytics. The app saves its progress only on your device, and “Start over” in Settings deletes all of it.</p>
      <p>This page is a plain summary of our promises. We’ll publish a full privacy policy and our data agreements with programs before the first pilot starts. If you have any questions, write to us at <a href="mailto:${SITE.contact}">${SITE.contact}</a>.</p>
      <p class="small muted">Last updated November 2026.</p>
    </div>
  </div>
</section>
`,
});

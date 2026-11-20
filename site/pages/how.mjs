import { page, ICON, stars } from '../layout.mjs';
import { phone, ctaBand } from '../parts.mjs';

export default page({
  path: '/how-it-works/',
  title: 'How it works',
  description: 'How Hearth works, step by step: a private setup, a story written for this parent, about five minutes of practice with a coach that listens, then story time at bedtime.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">How it works</span>
    <h1>Here’s how Hearth works.</h1>
    <p class="lead">Hearth turns tonight’s bedtime story into a short, private practice for the parent. Then it steps back, so the child gets to hear their parent read. Below is every step, and you can try the real app right on this page.</p>
  </div>
</section>

<section class="band night-2" aria-labelledby="liveTitle">
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">Try it</span>
      <h2 id="liveTitle">The real app, right here.</h2>
      <p class="lead">This is the working app with a demo family: Rosa, who is learning the “sh” sound, and her son Mateo. Tap <b>Practise first</b> and a pretend reader starts reading out loud. Watch what happens when it gets stuck on a word.</p>
      <ul class="checklist">
        <li><span>Each word gets underlined as it’s read.</span></li>
        <li><span>When the reader stops, help comes in stages: the parts of the word, then the sounds with pictures, then the word.</span></li>
        <li><span>“Read it with Mateo” switches to bedtime mode, with a question to ask on each page.</span></li>
        <li><span>“Your sky” shows progress, with no scores anywhere.</span></li>
      </ul>
      <div class="cta-row mt-s"><a class="btn lamp" href="/install">Get the app</a></div>
    </div>
    <div>
      <div class="live-phone"><iframe src="/product/?demo" title="Hearth app demo" loading="lazy" allow="microphone; autoplay"></iframe></div>
      <p class="live-note">Anything you do here is saved only in this browser.</p>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="stepsTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Step by step</span><h2 id="stepsTitle">From the first tap to “Goodnight”.</h2></div>

    <div class="feature">
      <div><span class="num">1 · Getting started</span><h3>Setting up, no reading needed</h3>
        <p>Hearth talks you through setup, in English or Spanish. If you’re not sure what a button says, press and hold it and Hearth reads it out. The first thing it tells you is that this part is just for you.</p>
        <ul class="checklist"><li><span>Your child’s name, and what they call you</span></li><li><span>Pictures that look like your family, with skin tone and hair for you both</span></li><li><span>A quick check of up to 13 words to find a good first story. Skipping is fine, and you never see a level.</span></li></ul></div>
      <div class="media">${phone('app-look.png', 'Setup: choosing skin tone and hair so the pictures look like the family.')}</div>
    </div>

    <div class="feature flip">
      <div><span class="num">2 · Tonight’s story</span><h3>Written for you, with your child in it</h3>
        <p>Each night Hearth picks a story you’re ready for. Every word in it is either one you can sound out with what you’ve learned, a “heart word” you know by sight, or your own family’s names. Tonight’s new sound shows up a few times.</p>
        <p class="mt-s">When it’s connected to our story writer, Hearth can also write a brand-new story for your family. It checks every word first, and sends back anything you can’t read yet to be rewritten.</p></div>
      <div class="media">${phone('app-home.png', 'Tonight’s story: The Wish Fish, with Practise first and Read with Mateo.')}</div>
    </div>

    <div class="feature">
      <div><span class="num">3 · Practise on your own</span><h3>A coach that listens and never judges</h3>
        <p>You read out loud, and Hearth follows along word by word. It doesn’t mind if you repeat yourself or stop to talk. If you get stuck, help comes in small steps: after 3 seconds it shows the parts of the word, after about 6 the sounds with pictures, and only after 10 does it say the word.</p>
        <ul class="checklist"><li><span>“Listen” reads the page out loud and lights up each word</span></li><li><span>You can tap any word for help whenever you like</span></li><li><span>Heart words have a 💛, so you know not to sound them out</span></li></ul></div>
      <div class="media">${phone('app-hint.png', 'Practice: the parent paused on fish, and the bubble shows f, i, sh with pictures.')}</div>
    </div>

    <div class="feature flip">
      <div><span class="num">4 · Ready for tonight</span><h3>A few words to look at once more</h3>
        <p>When you finish, Hearth tells you how many words you read on your own and how many with a little help. There’s no percentage. It picks up to four words you might look at again, and reminds you of tonight’s new sound.</p></div>
      <div class="media">${phone('app-ready.png', 'You’re ready for tonight: words read on your own, words to look at once more, and the new sound sh.')}</div>
    </div>

    <div class="feature">
      <div><span class="num">5 · Story time</span><h3>Bedtime mode, so your child hears only you</h3>
        <p>The screen dims and the words get bigger. If you need help, it shows up quietly where only you can see it, with no sound unless you switch that on. After each page there’s a little question to ask, which turns the story into a chat. Those chats are what grow a young child’s vocabulary.</p>
        <ul class="checklist"><li><span>Turning a page early never counts against you</span></li><li><span>Working late some nights? Record yourself reading, and your child can still hear your voice. The recording stays on your phone.</span></li></ul></div>
      <div class="media">${phone('app-storytime.png', 'Story time: dimmed screen, read words underlined, and a question: what colour is the fish?')}</div>
    </div>

    <div class="feature flip">
      <div><span class="num">6 · Your sky</span><h3>Progress, with no scores</h3>
        <p>Each sound you can read is a star in your sky. There’s one number that grows over time: how many of the 5,000 most common English words you can read. Hearth also counts your nights of stories and the words your child has heard.</p></div>
      <div class="media">${phone('app-sky.png', 'Your sky: words you can read, and a constellation of learned sounds.')}</div>
    </div>
  </div>
</section>

<section class="band night" aria-labelledby="hoodTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Under the hood</span><h2 id="hoodTitle">The four pieces that make it work.</h2></div>
    <div class="grid4">
      <div class="card dark"><div class="glyph">${ICON.book}</div><p class="tag">Write</p><h3>Story writer</h3><p>An AI model (Claude) writes a story for one family at exactly the right step. We never send names. The story comes back with a blank for your child’s name, and your phone fills it in.</p></div>
      <div class="card dark"><div class="glyph">${ICON.check}</div><p class="tag">Check</p><h3>Reading engine</h3><p>It works out the sounds in every word and checks them against our 40 steps. A word you can’t read yet never reaches you.</p></div>
      <div class="card dark"><div class="glyph">${ICON.speaker}</div><p class="tag">Listen</p><h3>Reading coach</h3><p>It follows your voice, doesn’t mind repeats or chatter, and gives the smallest bit of help that does the job.</p></div>
      <div class="card dark"><div class="glyph">${ICON.chart}</div><p class="tag">Learn</p><h3>Learning tracker</h3><p>It keeps track of each sound for each parent. A sound only counts as learned once you’ve read it well on two different days.</p></div>
    </div>
    <p class="mt"><a class="link-arrow" href="/science/">The thinking behind it</a></p>
  </div>
</section>

<section class="band paper" aria-labelledby="everyTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">For every family</span><h2 id="everyTitle">Made for the phones and the lives families really have.</h2></div>
    <div class="grid3">
      <div class="card"><div class="glyph">${ICON.globe}</div><h3>English and Spanish</h3><p>Every button and every instruction works in either language, and can be read out loud. The stories are in English for now. Spanish stories are next.</p></div>
      <div class="card"><div class="glyph">${ICON.phone}</div><h3>Any phone, even offline</h3><p>After the first time, the stories and practice are saved on your phone, so they don’t use up your data.</p></div>
      <div class="card"><div class="glyph">${ICON.hand}</div><h3>No microphone? That’s fine</h3><p>In tap mode you just tap any word you’d like help with. There’s also a demo reader that shows how it all works.</p></div>
    </div>
  </div>
</section>

${ctaBand('Want to try it with your families?', 'Programs can start with a free 12-week pilot. Families never pay.')}
`,
});

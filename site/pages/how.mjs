import { page, ICON, stars } from '../layout.mjs';
import { phone, ctaBand } from '../parts.mjs';

export default page({
  path: '/how-it-works/',
  title: 'How it works',
  description: 'How Hearth works: a private start, a story written for this parent, five minutes of practice with a coach that listens, and story time at bedtime.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <span class="eyebrow">How it works</span>
    <h1>Practise in private. Read with pride.</h1>
    <p class="lead">Hearth turns tonight’s bedtime story into a short private lesson for the parent, then gets out of the way so the child hears their parent read. Here is every step, and a live demo you can tap.</p>
  </div>
</section>

<section class="band night-2" aria-labelledby="liveTitle">
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">Live demo</span>
      <h2 id="liveTitle">Try the real app, right here.</h2>
      <p class="lead">This is the working prototype with a demo family: Rosa, who is learning the sound “sh”, and her son Mateo. Tap <b>Practise first</b> and the demo reader starts reading aloud. Watch what happens when it pauses on a word.</p>
      <ul class="checklist">
        <li><span>Hearth underlines each word as it’s read.</span></li>
        <li><span>A pause brings chunks, then sounds with pictures, then the word.</span></li>
        <li><span>“Read with Mateo” switches to bedtime mode with a question per page.</span></li>
        <li><span>“Your sky” shows progress without a single score.</span></li>
      </ul>
      <div class="cta-row mt-s"><a class="btn lamp" href="/app/">Open the full app</a></div>
    </div>
    <div>
      <div class="live-phone"><iframe src="/product/index.html#demo" title="Hearth app demo" loading="lazy" allow="microphone; autoplay"></iframe></div>
      <p class="live-note">Your demo progress is saved only in this browser.</p>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="stepsTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Step by step</span><h2 id="stepsTitle">From the first tap to “Goodnight”.</h2></div>

    <div class="feature">
      <div><span class="num">1 · Getting started</span><h3>A private start, no reading needed</h3>
        <p>Hearth talks the parent through setup in English or Spanish. Every button can be heard by pressing and holding it. The first screen after the welcome is a promise: this is just for you.</p>
        <ul class="checklist"><li><span>The child’s name, and what the child calls the parent</span></li><li><span>Pictures that look like the family: skin tone and hair for both</span></li><li><span>A short private check of up to 13 words finds the right first story. Skipping is fine, and no level is ever shown.</span></li></ul></div>
      <div class="media">${phone('app-look.png', 'Setup: choosing skin tone and hair so the pictures look like the family.')}</div>
    </div>

    <div class="feature flip">
      <div><span class="num">2 · Tonight’s story</span><h3>Written for this parent, starring their child</h3>
        <p>Each night Hearth picks the story the parent is ready for: every word is one they can sound out with the sounds they’ve learned, a “heart word” they know by sight, or their family’s own name. Tonight’s new sound appears several times.</p>
        <p class="mt-s">With a connection, Hearth can write a brand-new story for the family. The engine checks every word, and anything the parent can’t read yet goes back for a rewrite.</p></div>
      <div class="media">${phone('app-home.png', 'Tonight’s story: The Wish Fish, with Practise first and Read with Mateo.')}</div>
    </div>

    <div class="feature">
      <div><span class="num">3 · Practise alone</span><h3>A coach that listens, and never judges</h3>
        <p>The parent reads aloud. Hearth follows along word by word, ignores repeats and talking, and moves only forward. If the parent pauses, help comes in small steps: chunks after 3 seconds, sounds with pictures after about 6, and the word itself only after 10.</p>
        <ul class="checklist"><li><span>“Listen” reads the page aloud with each word lit up</span></li><li><span>Tap any word for help at any time</span></li><li><span>Heart words show a 💛 and are never sounded out wrongly</span></li></ul></div>
      <div class="media">${phone('app-hint.png', 'Practice: the parent paused on fish, and the bubble shows f, i, sh with pictures.')}</div>
    </div>

    <div class="feature flip">
      <div><span class="num">4 · Ready for tonight</span><h3>A few words to look at once more</h3>
        <p>At the end, Hearth counts the words read on their own and with a hand, without a percentage, and shows up to four words to look at again. Tonight’s new sound comes with its picture and key word.</p></div>
      <div class="media">${phone('app-ready.png', 'You’re ready for tonight: words read on your own, words to look at once more, and the new sound sh.')}</div>
    </div>

    <div class="feature">
      <div><span class="num">5 · Story time</span><h3>Bedtime mode: your child hears only you</h3>
        <p>The screen dims and the text grows. Hints become quiet marks only the parent notices, with no sound unless they turn it on. After each page a short question turns the story into a conversation, which is what builds a young child’s vocabulary.</p>
        <ul class="checklist"><li><span>Turning pages early never counts against the parent</span></li><li><span>Record tonight’s reading for nights you work late; it stays on the phone</span></li></ul></div>
      <div class="media">${phone('app-storytime.png', 'Story time: dimmed screen, read words underlined, and a question: what colour is the fish?')}</div>
    </div>

    <div class="feature flip">
      <div><span class="num">6 · Your sky</span><h3>Progress without a single score</h3>
        <p>Each sound the parent can read is a star. One honest number grows over time: the words you can read out of the 5,000 most common in English. Nights together and words your child heard are counted too.</p></div>
      <div class="media">${phone('app-sky.png', 'Your sky: words you can read, and a constellation of learned sounds.')}</div>
    </div>
  </div>
</section>

<section class="band night" aria-labelledby="hoodTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Under the hood</span><h2 id="hoodTitle">Four parts, all working today.</h2></div>
    <div class="grid4">
      <div class="card dark"><div class="glyph">${ICON.book}</div><p class="tag">Write</p><h3>Story writer</h3><p>Claude writes a story for one family at one parent’s exact step. No names are sent: the child is a placeholder filled in on the phone.</p></div>
      <div class="card dark"><div class="glyph">${ICON.check}</div><p class="tag">Check</p><h3>Phonics engine</h3><p>Every word mapped to its sounds against a 40-step, 120-pattern sequence. Unreadable words never reach the parent.</p></div>
      <div class="card dark"><div class="glyph">${ICON.speaker}</div><p class="tag">Listen</p><h3>Reading coach</h3><p>Follows the reader’s voice, tolerates repeats and chatter, and gives the smallest hint that helps.</p></div>
      <div class="card dark"><div class="glyph">${ICON.chart}</div><p class="tag">Learn</p><h3>Learner model</h3><p>Tracks each sound per parent. A sound counts as learned only after good reading on two different days.</p></div>
    </div>
    <p class="mt"><a class="link-arrow" href="/science/">Read the science behind it</a></p>
  </div>
</section>

<section class="band paper" aria-labelledby="everyTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Built for every family</span><h2 id="everyTitle">Designed for the phones and lives families actually have.</h2></div>
    <div class="grid3">
      <div class="card"><div class="glyph">${ICON.globe}</div><h3>English and Spanish</h3><p>The whole interface speaks and reads in either language. Stories are in English today; Spanish stories are next.</p></div>
      <div class="card"><div class="glyph">${ICON.phone}</div><h3>Any phone, even offline</h3><p>Stories and lessons are saved on the phone after the first visit, so practice doesn’t use your data plan.</p></div>
      <div class="card"><div class="glyph">${ICON.hand}</div><h3>No microphone? No problem</h3><p>Tap mode lets a parent tap any word they’d like help with. A demo reader shows how it all works.</p></div>
    </div>
  </div>
</section>

${ctaBand('See it with your own families.', 'Programs can start with a free 12-week pilot. Families never pay.')}
`,
});

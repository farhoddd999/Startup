import { page, stars } from '../layout.mjs';
import { scene } from '../parts.mjs';

export default page({
  path: '/404.html',
  title: 'Page not found',
  description: 'This page is fast asleep.',
  body: `
<section class="page-hero night" style="min-height:70vh">
  ${stars(50)}
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">404</span>
      <h1>This page is fast asleep.</h1>
      <p class="lead">Sorry, we couldn’t find that page. It may have moved, or the link might have a typo in it. Here are a couple of places to start instead.</p>
      <div class="cta-row"><a class="btn lamp" href="/">Go to the home page</a><a class="btn line" href="/stories/">Read a story</a></div>
    </div>
    <div class="book" style="background:var(--night-2)">${scene({ bg: 'night', items: [['branch', 50, 74, 1.5], ['owl', 50, 64, 1.3, { snuggle: true, pose: 'sleep' }], ['moon', 82, 24, 0.8], ['stars', 24, 24, 1]] }, 'Two owls asleep on a branch under the moon.')}</div>
  </div>
</section>
`,
});

# Hearth pitch: speaker script

Read aloud in about 10 minutes. Bracketed items are for the founder to fill in.

## 1. cover

Hi, I’m [name]. This is Hearth. Tonight, millions of parents will be handed a picture book and will quietly make an excuse, because they can’t read it well enough. Hearth is a private reading coach on the phone that helps those parents practise tonight’s story on their own, and then read it aloud to their child. Every night, two people get better at reading.

## 2. moment

Think about the last time someone handed you something to read and you couldn’t. Now imagine it’s your four-year-old, every night, with a picture book. Parents in this situation become experts at excuses. The lines on the right are illustrative of what parents describe; they are not quotes from Hearth users, since we have none yet. The point: this is a private, recurring, emotionally loaded moment, and nothing on the market is built for it.

## 3. scale

Twenty-eight percent of American adults now score at or below the lowest literacy level PIAAC measures, about 59 million people, and that share went up from 19 percent in 2017. Seventy-seven percent of adults at those levels are parents. Worldwide it’s 739 million adults, mostly women. Two things make this worse. Shame: in one study, two thirds of people who admitted reading problems had never told their spouse, and half had never told their kids. And it passes down: a child read just one book a day hears nearly 300,000 more words before kindergarten. The parent’s problem becomes the child’s.

## 4. misses

Here’s what exists. Adult education reaches about 1.2 million people a year, a small fraction of the 59 million who need it, and it asks parents to show up at a fixed time, find childcare, and say out loud that they can’t read. AI reading tutors like Ello and Amira are great, but they listen to the child. Some campaigns have even used voice cloning so a parent can “read” a bedtime story without reading: it shows how strong the bedtime emotion is, but nobody learns. And the federal family literacy program, Even Start, was defunded in 2011. No one is helping the parent with the book in their hands.

## 5. insight

This is the insight. Every AI reading product listens to the child. We flip it and listen to the parent. And we attach learning to the most motivating moment an adult has: their own child at bedtime. Research on adult learners keeps finding the same top motivation for learning to read, which is helping their children. We don’t ask parents to sign up for a literacy class. We help them do something they already want to do tonight.

## 6. product

Here’s the product, and it’s working today. First, tonight’s story is written for this parent and this child. Mateo is the hero, and every word is one Rosa can sound out with what she’s learned, plus the new sound she’s working on, “sh”. Second, she practises alone for about five minutes. Hearth listens as she reads aloud and helps the moment she pauses. Third, story time. The screen dims, hints become silent marks only she sees, and after each page there’s a question to ask Mateo. That conversation is what builds a young child’s vocabulary.

## 7. ladder

This is the part people remember from the demo. When a parent pauses, Hearth doesn’t just read the word for them. After three seconds the word splits into chunks and the tricky part lights up. After six, a small bubble shows each sound with a picture and a key word, so even the help doesn’t require reading. Only after ten seconds does Hearth say the word, and the parent says it back. At story time with the child, all of this stays silent and visual. The child just hears their parent reading.

## 8. engine

Four pieces make this work, and they’re all built. One: a story writer, using Claude, writes for a specific family at a specific parent’s level. Two: our phonics engine maps every word to its sounds using the CMU Pronouncing Dictionary and checks it against a 40-step sequence; words the parent can’t decode go back for a rewrite, up to three rounds, and the story is rejected if it still fails. Three: a reading coach that follows a parent’s voice and tolerates repeats and talking to the child. Four: a learner model that tracks each sound for each parent and only counts a sound as learned after success on two separate days. To make it concrete: run a school letter through our engine for a parent at step 14 and only 30 percent of it is readable. That’s why generic content fails these parents, and why every Hearth story is checked.

## 9. built

Where we are. This isn’t a mockup. The app runs in a phone browser and works offline. It includes 14 bedtime stories spanning the whole sequence, a 40-step scope and sequence with 120 letter-sound patterns and 78 heart words, a lexicon of almost 20,000 words, a speech tracker, a learner model, a partner dashboard, and the Story Studio you see on the right, which x-rays any text for any parent. It has an automated test suite. And to be clear: zero users so far. The next step is a pilot with partner programs, and that’s what this round funds.

## 10. whynow

Why now? Four things. First, language models can now write a warm, personal story to a strict spec, and our engine can verify every word, which makes per-family decodable stories practical for the first time. Second, speech recognition good enough to follow a reader runs on ordinary phones, so we can keep a parent’s voice on the device. Third, the science of reading is mainstream: 43 states plus DC have passed evidence-based reading laws, so Head Start programs and schools already speak phonics. Fourth, the need is getting worse, from 19 to 28 percent of adults in six years, while federal adult-education funding has been proposed for elimination. Programs need something that works at low cost.

## 11. market

Who pays? Never the family. The buyers are programs that already serve these families and are measured on outcomes they can’t currently move. Head Start: $12.3 billion a year and over 700,000 funded slots, with required family-engagement and parent-literacy outcomes. Reach Out and Read reaches 4.6 million children through pediatricians, each with a new book. That book is exactly the moment Hearth helps with, so they’re a referral partner. Adult education serves 1.2 million people and needs progress data between assessments. And health plans: low health literacy costs between 106 and 238 billion dollars a year, which gives Medicaid plans a reason to fund family reading.

## 12. model

The model: families never pay. Programs pay 60 dollars per enrolled family per year, with a minimum per site, and get codes, the dashboard and reports. Our estimated cost to serve a family is about five dollars a year: Claude writes new stories, but most nights use the shared library, and a story written for one family at step 14 can be reused by every family at step 14 with the names filled in. Speech recognition runs on the phone, so audio costs us nothing. A typical Head Start grantee with 300 families is an 18,000-dollar contract. These prices are our starting proposal, and we’ll test them in the pilot. The 10.7 million figure is an illustration of scale, not a forecast.

## 13. gtm

Go to market. We start where families already are: Head Start parent nights, library story times, adult-ed classes. A family advocate hands out a code, the parent installs Hearth in two minutes, no email needed. Months zero to six: three pilot sites, about 150 families, free, with a research partner measuring outcomes. Months six to eighteen: convert pilots to paid contracts and add pediatric clinics in the Reach Out and Read network, aiming for 3,000 families. After that: state contracts and health plans. Spanish stories are next on the roadmap. Spanish spelling is very regular, which suits decodable stories, and it opens Latin America.

## 14. landscape

How we compare. Children’s reading tutors like Ello and Amira are well funded and work, but the learner is the child. Adult literacy apps, including Learning Upgrade, which co-won the Adult Literacy XPRIZE, teach adults, but as self-study, disconnected from their kids. Read-aloud tools do the reading for the parent. Hearth is the only one where the parent learns, with their own child, at the moment that matters, with text written for their exact level. Our moat is the combination: the decodability engine, the learner model, and a dignified experience built around bedtime, plus the partner relationships we build in pilots.

## 15. impact

We’ll be judged on outcomes, so we’re designing for evidence from day one. Two learners, not one. For the parent: the engine already measures the words they can read and steps gained, and we’ll add pre and post scores on the assessments partners already use. For the child: nights read, words heard, and a standard expressive-vocabulary measure with a university partner. For the family: reading frequency and parent confidence. The first pilot is 12 weeks, three sites, about 150 families, with a waitlist comparison group.

## 16. roadmap

The roadmap. Today we have a working prototype that runs in a phone browser and offline. In the next six months: a native Android app with speech recognition on the device for privacy; three pilot sites; and the first Spanish stories. From month seven to eighteen: iOS, published pilot results, 3,000 families on paid contracts, and a first state or health-plan agreement.

## 17. team

[Introduce yourself: your background and why this matters to you.] The first three hires are a literacy scientist to own the curriculum and the evidence, a mobile engineer to move speech recognition onto the phone, and a partnerships lead who has worked inside Head Start or a library system. We’re recruiting advisors who represent every side of the bedtime moment, including a parent who learned to read as an adult. And we’ll be a public benefit corporation.

## 18. ask

We’re raising [1.5 million dollars] pre-seed for about 18 months. Forty-five percent goes to product and engineering, mainly the native app and on-device speech. Twenty-five percent goes to pilots and partnerships, twenty to learning science and new stories including Spanish, and ten to operations. What it buys: three pilot sites and about a thousand families reading, real outcome data for parents and children, the native app, and first paid contracts, which set up a seed round. [Adjust the amount and split to your plan.]

## 19. close

Every parent can be the one who reads the bedtime story. That’s what we’re building. If you try the prototype, choose the demo family on the first screen, tap “Practise first”, and watch the demo reader pause on a word. Thank you.

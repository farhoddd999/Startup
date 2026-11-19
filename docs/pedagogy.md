# Pedagogy

How Hearth teaches an adult to read while they read to their child. The design draws on structured literacy (systematic phonics), decodable text, dialogic reading and family literacy, adapted for adults who carry shame about reading.

## 1. Who we are teaching

Adults at the lowest literacy levels are not beginners in life. They have large spoken vocabularies, years of coping strategies (guessing from context, memorising whole words), and often a history of being made to feel stupid at school. Three consequences shape everything:

1. **Spoken vocabulary is not the problem; decoding is.** So stories can be rich in meaning while staying simple in spelling.
2. **Guessing is a habit.** Text where every word is decodable lets the reader succeed by sounding out, which is the habit we want to build.
3. **Shame is the main barrier.** The design removes every signal of being tested.

## 2. The scope and sequence

Forty steps from single letters to `-tion`. Each step adds one to five letter-sound patterns (graphemes mapped to phonemes). The order follows common structured-literacy progressions: frequent, regular, high-utility patterns first; short vowels before long; single letters before digraphs; consonant blends after single consonants are secure; vowel teams and r-controlled vowels before multisyllable words and rare spellings.

Generated from `product/engine/phonics.js`:

| Step | Sounds | Patterns | Example words |
|---:|---|---:|---|
| 1 | m · s · t · short a | 4 | am, at, sat, mat, Sam |
| 2 | p · n | 2 | pan, nap, tap, man, pat |
| 3 | short i | 1 | it, sit, pin, tip, in |
| 4 | c · d | 2 | cat, can, dad, did, cap |
| 5 | short o | 1 | on, not, pot, top, dot |
| 6 | g · b | 2 | big, bag, dog, bat, dig |
| 7 | h · f | 2 | hat, fan, hop, fit, fog |
| 8 | short e | 1 | bed, ten, hen, pet, get |
| 9 | r · l | 2 | red, rat, leg, lip, log |
| 10 | short u | 1 | up, sun, cup, bug, fun |
| 11 | w · j · k · v | 4 | wet, jet, kid, van, win |
| 12 | x · y · z · qu | 4 | fox, box, yes, zip, quit |
| 13 | ff · ll · ss · ck · s as z | 3 | off, hill, kiss, duck, his |
| 14 | sh | 1 | ship, fish, shop, wish, shut |
| 15 | ch · tch | 2 | chip, chop, much, catch, rich |
| 16 | th | 1 | this, that, with, bath, moth |
| 17 | wh · ng · nk | 2 | when, sing, ring, pink, think |
| 18 | blends & little compounds | 2 | stop, frog, hand, jump, sunset |
| 19 | a_e (magic e) | 1 | make, cake, name, game, gave |
| 20 | i_e | 1 | time, bike, like, kite, ride |
| 21 | o_e · u_e · e_e · ve | 4 | home, bone, cute, these, have |
| 22 | open vowels (go · me · hi) | 1 | go, me, she, hi, no |
| 23 | ee · ea | 2 | see, tree, sea, eat, sleep |
| 24 | ai · ay | 2 | rain, day, play, wait, tail |
| 25 | oa · ow · oe | 3 | boat, snow, toe, grow, coat |
| 26 | igh · y · ie | 3 | night, light, my, fly, pie |
| 27 | ar | 1 | car, star, dark, far, park |
| 28 | or · ore | 1 | for, horn, more, store, storm |
| 29 | er · ir · ur | 3 | her, bird, fur, turn, girl |
| 30 | oo · ew · ue | 5 | moon, book, new, blue, look |
| 31 | ou · ow | 2 | out, cloud, now, down, house |
| 32 | oi · oy | 2 | coin, boy, toy, join, point |
| 33 | aw · au · all | 3 | saw, draw, ball, call, talk |
| 34 | endings: -ed · -es · -ing | 4 | jumped, wishes, running, hopped, played |
| 35 | longer words & the lazy vowel | 2 | rabbit, basket, picnic, kitten, under |
| 36 | soft c · soft g · dge | 5 | city, face, page, bridge, large |
| 37 | -le · y as in happy | 2 | little, apple, happy, baby, candle |
| 38 | silent letters: kn · wr · mb | 5 | knee, know, write, lamb, sign |
| 39 | more vowel spellings | 28 | phone, head, son, want, bear |
| 40 | -tion · -sion · -ture | 3 | nation, picture, vision, nature, action |

| Introduced at step | Heart words |
|---:|---|
| 1 | a, the, I, and, is, to |
| 3 | was, his, has, of, said, as |
| 5 | you, he, she, we, me, be, go, no, so, do |
| 7 | my, by, are, they, what, here, there, where, for, or |
| 9 | one, two, come, some, your, have, give, love, live, put, want, who, all, from |
| 11 | look, good, could, would, should, again, does, goes, very, every, only, once, friend, now, how, down, too |
| 13 | little, people, any, many, water, over, after, been, into, our, out, night, day, oh, yes |

### Heart words

High-frequency words with an irregular part (*the, said, was, you, one*) are taught by sight before the reader has every pattern they need. The heart marks the part that has to be learned by heart. In Hearth, a heart word’s hint shows 💛 and the whole word, never misleading phonics chunks. A heart word becomes decodable later when its patterns are taught (*have* at step 21, *for* at step 28).

### Word shape

Some difficulty belongs to the whole word rather than to a letter: consonant **blends** at the edges of a word (*frog, jump*), **compounds** of two known words (*sunset, catnap*), **inflected endings** (*-ed, -es, -ing*), and **multisyllable** words with an unstressed “lazy vowel” (schwa: *basket, rabbit*). The engine adds these as patterns of their own so they are introduced at the right time. Plural *-s* after a voiceless sound does not create a blend (*cats* is readable at step 4).

## 3. What “decodable” means in Hearth

The engine aligns each word’s spelling to its pronunciation (CMU Pronouncing Dictionary) with a dynamic-programming search over 214 spelling rules, choosing the cheapest explanation. Example:

| Word | Alignment | Patterns | Step |
|---|---|---|---|
| ship | sh · i · p | sh, short i, p | 14 |
| cake | c · a_e · k (silent e closes the split digraph) | c, a_e, k | 19 |
| page | p · a_e · g = /dʒ/ | p, a_e, soft g | 36 |
| night | n · igh · t | n, igh, t | 26 |
| said | s · (irregular) · d | heart word | 3 (by heart) |

A word is **readable** for a parent at step *S* when its decode step is ≤ *S*, it is a heart word introduced by *S*, it is built from readable parts (*someone* = *some* + *one*), or it is the family’s own word (the child’s name, *Mama*). **Every word in a Hearth story must be readable.** The library is tested against this rule in CI, and AI-written stories are revised until they pass, or rejected.

The research on decodable text supports it as a short-term scaffold alongside explicit phonics, not as a permanent diet (Pugh, Kearns & Hiebert, 2023). Hearth uses it the same way: stories get richer as the parent progresses, and from step 30 onward most everyday text becomes readable.

## 4. The hint ladder

When the reader pauses on a word, Hearth gives the **least help that might work**, in steps:

1. **Chunks (after 3 s).** The word splits into its graphemes; the chunk this parent is least confident about (lowest knowledge estimate) is highlighted.
2. **Sounds (after about 6.5 s).** A bubble shows each chunk with a picture and a key word (“sh as in ship 🚢”); tapping plays the key word. The help itself needs no reading.
3. **The word (after 11 s).** In practice, Hearth says the word slowly and the parent repeats it. At story time this stays silent unless the parent turns spoken hints on.

The thresholds are tuned to adult reading pace and will be calibrated in pilots. A word that needed level 2 or 3 is recorded as *helped*; a pause alone is *effortful*; neither is ever shown to the parent as an error.

## 5. Rehearsal, then performance

Practice first, then the same story at bedtime. Repeated reading of the same text is one of the best-supported ways to build fluency; here the second reading also has a purpose the adult cares about. The practice summary shows up to four “words to look at once more”, drawn from words that needed help, then from tonight’s new-sound words.

## 6. Dialogic reading for the child

Each page carries a short prompt for the parent to use with the child, following the PEER sequence and CROWD prompt types used in dialogic reading (Whitehurst): completion, recall, open-ended, wh- questions and distancing (“Where do *you* like to sit?”). Prompts are spoken by the app, so they can use any words. The meta-analytic evidence for dialogic reading is moderate (expressive vocabulary d = 0.59) and weaker for children at risk (Mol et al., 2008), which is why the pilot measures child vocabulary directly.

## 7. The learner model

Bayesian Knowledge Tracing per pattern (120 patterns):

- **Priors from placement:** patterns up to the placed step start at p = 0.92; the next step at 0.30; later steps at 0.04.
- **Evidence:** a word read without help counts as correct for every pattern in it; an *effortful* read counts with lower weight; a *helped* or *skipped* word is blamed only on the least-known pattern in the word (skips at half weight, since recognizers miss words too). Repeat readings of the same word in one session count at a third of the weight, because they may be remembered by sight.
- **Parameters:** slip 0.12, guess 0.25 (adults use context), learn 0.12.
- **Mastery:** p ≥ 0.90 and success on at least **two different days** (spaced practice). A mastered pattern is only lost if p falls below 0.55, so one tired evening does not undo progress.
- **Working step:** the first step with an unmastered pattern. It picks tonight’s story and the “new sound” shown to the parent.

## 8. Progress without levels

Progress is a night sky (a star per step) and one number: **words you can read** out of the 5,000 most common English words (SUBTLEX-US). The count is honest, because it is computed from the same engine, and motivating, because each new sound unlocks dozens to hundreds of everyday words (10 words at step 1; 801 at step 18; 1,995 at step 34; 4,534 at step 40).

## 9. What we will validate in pilots

- Hint timings and how often each level is reached.
- Whether two-day mastery tracks independent measures (pre/post decoding assessments).
- Story difficulty: target 75–90% of practice words read without help.
- Whether parents of very low skill (placed at step 0–2) stay engaged with the earliest stories.

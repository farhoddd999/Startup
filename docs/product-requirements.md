# Product requirements: Hearth v1

## Summary

Hearth is a phone app that helps a parent who struggles to read practise tonight’s bedtime story in private, then read it aloud to their child. Programs that serve families pay for it; families never do.

## Users

| User | Who | What they need | What they fear |
|---|---|---|---|
| **Parent (primary)** | An adult caregiver (parent, grandparent, older sibling, foster parent) with limited reading skills, usually PIAAC Level 1 or below. Often works shifts. Has a smartphone, sometimes a prepaid plan. About 1 in 3 learned English as an adult. | To read the bedtime story without hesitating; to feel like a good parent; to get better at reading without anyone finding out. | Being found out. Being tested. Looking foolish in front of their child. Apps that assume they can read the instructions. |
| **Child** | Ages 0–8. Never a user of the app. | A parent who reads to them and talks about the story. | — |
| **Program staff** | Head Start family advocates, librarians, adult-ed instructors, clinic staff. | To get families reading at home and to report outcomes to funders without extra paperwork. | Another tool nobody uses. Privacy complaints. |

## Jobs to be done

1. “When my child hands me a book at bedtime, help me read it without stumbling.”
2. “Help me get better at reading, privately, in the time I have.”
3. “Show me I’m making progress, without making me feel graded.”
4. (Staff) “Show me which families are reading, and give me something to put in my report.”

## Principles

1. **Dignity first.** No scores, levels, grades or red marks. The words “illiterate”, “low-level” and “beginner” never appear.
2. **No reading required to use the app.** Every control can be heard (press and hold); every screen can narrate itself; icons and pictures carry meaning.
3. **The child sees a storybook.** Help during story time is silent and visual unless the parent opts in.
4. **Private by default.** Practice data stays on the phone. Programs see only what the parent agrees to share.
5. **Every word is readable.** A story only reaches a parent when every word is decodable for them, a heart word they know, or their family’s own word.
6. **Bedtime-sized.** About 5 minutes of practice; about 5–10 minutes of story time.

## The core loop

```
Tonight's story (picked or written for this parent's step)
   → Practise alone (~5 min): the coach listens, hints in steps, then shows words to look at once more
   → Read together (bedtime mode): silent hints, a question per page
   → Goodnight: nights together +1, the learner model updates, the sky gets brighter
```

## Functional requirements (v1)

### Onboarding
- Language choice (English, Spanish) on the first screen; all UI text spoken in that language.
- Privacy promise screen before any question.
- Child’s name (type or say it), age band; what the child calls the parent; the family’s look (skin and hair for the child and the parent); the child’s interests.
- Microphone choice: voice, tap mode (no microphone), or demo reader.
- Private placement check: up to 13 words of rising difficulty, stops after two misses, skipping is fine. Result is never shown as a level.
- Optional program code (e.g., `RIVER-24`) and consent to share a summary.

### Tonight
- One story chosen automatically: the hardest library story at or below the parent’s working step that they haven’t read together; otherwise the least recently read.
- “Write a new story” calls the story engine (needs a connection); falls back to the library.
- Shows: practised, read together ×N, recorded in the parent’s voice.

### Practice
- Page = illustration + text in Andika, large type.
- Listening: the reading tracker aligns speech to the page, only moves forward, tolerates repeats, filler and talking to the child, treats names leniently.
- Hint ladder for the current word: 3 s → chunks (hardest part highlighted); 6.5 s → sound bubble (chunks with picture and key word, tap to hear); 11 s → the word is spoken (practice only). Heart words show a 💛 and are never split into sounds.
- Tap any word for the same help. “Listen” reads the page aloud with word highlighting.
- End of practice: words read on their own vs. with a hand (no percentage), up to 4 words to look at once more, tonight’s new sound with its key word.

### Story time
- Bedtime theme (dim, dark), larger text, no spoken hints by default.
- Talk prompt after each page (dialogic reading), with a speaker button.
- Optional recording of the parent’s voice, page by page, stored on the phone; “Play Mama’s reading” plays it back for nights the parent works.
- Turning pages early never counts against the parent.

### Progress (“Your sky”)
- One star per step; lit, glowing (learning now) or dim.
- Words you can read, of the 5,000 most common English words.
- Nights together; words the child heard; growth over time.

### Partner dashboard
- Families enrolled, reading together this week, nights, words read aloud, median sounds gained.
- Weekly active families, growth by starting point, families by step band, nights per week.
- “Families who might welcome a check-in” (no story time in 7+ days).
- CSV export for reporting. Only consented summary data.

## Non-functional requirements

- Works on low-end Android phones and iPhones; offline after first load (PWA today, native apps next).
- First screen in under 2 seconds on a mid-range phone on 4G.
- WCAG 2.2 AA for contrast and touch targets (≥ 48 px).
- Speech recognition on the device in production (the prototype uses the browser’s recognizer).

## Out of scope for v1

Child-facing games; social features; ads; in-app purchases; grading; any data sale; non-English story languages (Spanish stories come in v1.1).

## Success metrics

| Level | Metric | Pilot target (12 weeks) |
|---|---|---|
| North star | **Nights read together per enrolled family per week** | ≥ 2.0 |
| Parent learning | Median steps gained; words you can read | +4 steps; +250 words |
| Engagement | Share of enrolled families active in week 8 | ≥ 50% |
| Quality | Share of practice words read without help | 75–90% (stories at the right level) |
| Partner | Staff time per family per month | ≤ 10 minutes |
| Trust | Parents who say they’d recommend Hearth to a friend in the same situation | ≥ 80% |

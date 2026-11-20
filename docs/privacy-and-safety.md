# Privacy, safety and trust

Hearth's users are adults who have often hidden their reading difficulty for years, and their young children. A single privacy failure would end the trust Hearth depends on. These are commitments, not settings.

## Commitments

1. **Private by default.** Practice happens on the phone. No one, including program staff and Hearth employees, sees which words a parent struggled with.
2. **Voice stays on the phone** in the production app. Speech recognition runs on the device. Recordings of the parent reading are stored only on the phone, are never uploaded, and are deleted with one tap.
3. **No ads, no data sales, no tracking pixels.** Ever. Written into our terms and into our public benefit corporation charter.
4. **Programs see a summary, with consent.** Nights read, practice minutes, sounds learned (step), words-you-can-read count. Never recordings, mistakes, hints or story text. Families can stop sharing at any time; the app keeps working.
5. **Children are not users.** Hearth does not collect information from children. The child's name and look are entered by the parent, stay on the device, and are used only to personalise stories.
6. **No reading required to understand privacy.** The privacy promise is spoken, short, and shown before any question is asked.

## Data inventory

| Data | Where it lives | Who can see it | Retention |
|---|---|---|---|
| Child's first name, age band, look; what child calls parent; interests | Phone | Parent | Until reset |
| Learner model (per-pattern estimates), reading history | Phone | Parent | Until reset |
| Voice during practice | Processed on device (production); not stored | Nobody | Not retained |
| Parent's recordings for playback | Phone (IndexedDB) | Parent | Until deleted |
| Generated stories | Phone; story cache on server keyed by step and interests, **without names** (placeholders) | Parent | Cache: reusable content only |
| Program summary (if consented) | Hearth server | Program staff for that program | Duration of contract + 1 year, then deleted |
| Program code | Phone, server | Program | Contract |

**Prototype note:** the prototype uses the browser's speech recognition, which in some browsers sends audio to the browser maker. The app says so on the microphone screen during setup (spoken and on screen, before the microphone is allowed) and again in Settings. The production app replaces it with on-device recognition before any pilot with real families.

**Tester feedback:** the prototype has no server and no analytics. Feedback is composed on the phone and shown in full before the tester shares it through their own share sheet, email or copy/paste. It contains what the tester chose (a face, quick notes, free text, an optional voice message), the build number, the browser and platform, and, only if switched on, a practice summary of counts (sessions, words read, hints, current step). It never includes the child's name or the parent's story recordings.

## Regulatory map (to confirm with counsel)

- **COPPA:** the child is not a user and provides no information; the parent is the user. We will still follow COPPA-style practices for anything that references a child (minimisation, parental control, no third-party sharing).
- **FERPA:** Head Start programs and schools may treat shared summaries as education records. Partner agreements will include FERPA-compliant terms (school official exception, purpose limitation, deletion).
- **State student privacy laws** (e.g., SOPIPA-style laws): applies to school-adjacent deployments; no targeted advertising, no profiling, no sale.
- **Health plans:** if a Medicaid plan funds Hearth, only aggregate, de-identified outcome data is shared unless the member explicitly consents. No protected health information is needed.
- **Recordings:** never leave the device, which avoids biometric and voice-data obligations; to be reviewed per state (e.g., Illinois BIPA does not apply to data we never collect, but counsel should confirm).

## AI and content safety

- The story writer can only use: the parent's safe vocabulary, taught heart words, and placeholders for names. A blocklist removes profanity and violent or adult words from the vocabulary it is given, and any story containing a blocked word is rejected.
- The writer's instructions require calm, warm, bedtime-appropriate stories with no scary or sad endings.
- Scenes can only use a fixed set of friendly illustration elements; the model cannot generate images.
- Generated stories carry a "written for you" tag. In pilots, every generated story is reviewed by a person before release; later, a sample is reviewed weekly.
- Requests to the model contain no names: the child and parent appear only as the placeholders `{child}` and `{grownup}`, filled in on the phone. Only interests and the reading step are sent.
- Refusals are handled: the engine falls back server-side, and if no story is produced, the app uses the library.

## Security basics (pre-pilot checklist)

- [ ] On-device speech recognition; remove the browser recognizer from production builds
- [ ] Encrypted local storage for the learner model and recordings
- [ ] Partner dashboard behind SSO / magic links; role-based access per program
- [ ] Program summaries encrypted at rest; data processing agreement with every partner
- [ ] Data deletion on request within 30 days; self-serve reset on the phone
- [ ] Third-party privacy review before the first pilot; annual thereafter
- [ ] Incident response plan and notification process

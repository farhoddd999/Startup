# Evidence base

What we know about the problem, the people Hearth serves, and the methods it uses. Every number in the pitch, website and one-pager comes from this page. Where a figure is weak, we say so.

## 1. How many adults struggle to read

| Claim | Figure | Source | Strength |
|---|---|---|---|
| U.S. adults (16–65) at or below PIAAC Level 1 in literacy, 2023 | **28%**, up from 19% in 2017 | NCES, U.S. PIAAC 2023 results (Dec 2024) | Strong: national assessment |
| Same, as a count | **~58.9 million** | ProLiteracy, citing PIAAC 2023 | Strong (derived) |
| Adults at the lowest levels (Below Level 1 and Level 1) who have children | **77%** | IES/NCER blog, M. Larson, “Family, work, and education: a balancing act for millions of U.S. adults” (PIAAC) | Medium: likely based on an earlier PIAAC cycle (“over 40 million adults”), so we apply it to 2023 counts as an estimate |
| Share of low-literacy U.S. adults who were born outside the U.S. | ~1 in 3 | LEO PIAAC 2023 country brief; Migration Policy Institute | Medium |
| Adults worldwide lacking basic literacy skills | **739 million**, two-thirds women | UNESCO, International Literacy Day 2024 | Strong |

**Caution:** the often-quoted “54% of U.S. adults read below a sixth-grade level” mixes PIAAC levels with grade levels, and several outlets have withdrawn it. We do not use it. The “72% of children of low-literacy parents end up at the lowest reading levels” figure is also widely repeated without a clear primary source, so we do not use it either.

## 2. Why the parent hides it

- **Shame and secrecy.** Among 58 patients with low functional health literacy who admitted reading difficulty, **67.2%** had never told their spouse and **53.4%** had never told their children; about 40% reported shame. Parikh et al. (1996), *Patient Education and Counseling* 27(1):33–39. *Small, clinical sample: we present it as one study, not a national rate.*
- **Children are the motivation.** Studies of adult literacy learners in the UK, the U.S. and Cambodia name helping one’s children and being a role model among the main reasons adults return to learning (e.g., Duncan 2009; Kent State OLRC interviews; a Cambodian survey of 256 learners). *Qualitative and self-reported, but consistent across settings.*

## 3. Why it matters for the child

- **Reading aloud and vocabulary.** Using 60 commonly read picture books, Logan et al. (2019) estimate that by kindergarten a child read **one book a day hears ~296,660 words** in books, against **4,662** for a child never read to (five books a day: ~1.48 million). *J Dev Behav Pediatr* 40(5):383–386. This is book vocabulary, distinct from the disputed “30-million word gap.”
- **Dialogic reading.** Meta-analysis of 16 studies: interactive (dialogic) shared reading improved children’s **expressive vocabulary, d = 0.59** compared with typical shared reading; effects were **smaller for children at risk** and for 4–5-year-olds. Mol, Bus, de Jong & Smeets (2008), *Early Education and Development* 19(1):7–26. Hearth’s talk prompts follow this method; we do not claim this effect size for Hearth itself.
- **Shared reading and later reading.** Bus, van IJzendoorn & Pellegrini (1995) found parent–preschooler book reading related to language growth, emergent literacy and reading achievement. Bergen et al. (2017) show part of the parent–child link reflects shared genetics, which is one reason we will measure outcomes rather than assume them.
- **Global health.** Each extra year of maternal schooling is associated with about a **3% lower under-5 mortality** in a global meta-analysis (Lancet, CHAIN/IHME, 2021); causal estimates in single countries are larger. Relevant to Hearth’s long-term mission in low-income countries, not to its current U.S. market claims.

## 4. Why existing help misses parents

| Option | Evidence |
|---|---|
| Federally funded adult education | ~**1.2 million** people served in program year 2023, about half in English-language programs (Migration Policy Institute). Budget proposals for FY2026 and FY2027 proposed eliminating federal WIOA Title II funding. |
| Federal family literacy (Even Start) | ~$67M program eliminated in FY2011 after weak national evaluations (Education Week, March 2011). Some states continue family literacy with other funds. |
| Children’s AI reading tutors | Ello ($15M Series A, 2023) and Amira (state contracts in Iowa, Louisiana, North Dakota) listen to children reading. Neither targets the adult. |
| Adult literacy apps | The $7M Barbara Bush Foundation Adult Literacy XPRIZE (2019) was won jointly by Learning Upgrade and People ForWords, measured over 12 months with ~12,000 adult learners. These are self-study apps, not built around a parent’s child. |
| Read-aloud substitutes | Tools that read books aloud for the family, and a ProLiteracy and Respeecher campaign (“The Impossible Bedtime Story”) that used voice cloning so a mother who cannot read could “narrate” books. These show how strong the bedtime emotion is; nobody learns to read. |

## 5. Buyers and channels

| Channel | Size | Source |
|---|---|---|
| Head Start and Early Head Start | **$12.27B** federal funding, **715,873** funded slots (FY2024) | HHS Head Start Program Facts FY2024; ASPE |
| Reach Out and Read | **4.6M** children, **39,000** clinicians, 7.7M books, 9.3M well-child visits (FY2024); 4.8M children in FY2025 | Reach Out and Read annual reports |
| Adult education (WIOA Title II) | ~1.2M people (PY2023) | Migration Policy Institute |
| Health plans | Low health literacy costs the U.S. **$106–238B** a year | Vernon et al. (2007), *Low Health Literacy: Implications for National Health Policy* |
| Economy-wide | Raising all adults to PIAAC Level 3 is associated with **$2.2 trillion** a year in additional income | Rothwell, Gallup and Barbara Bush Foundation (2020) |

## 6. Why now

- **Science of reading policy:** 43 states and DC have passed laws or policies on evidence-based reading instruction since 2013 (Education Week tracker, Aug 2026).
- **Phones:** 15% of U.S. adults are “smartphone dependent” for internet, rising to roughly 28% of adults in households under $30,000 (Pew Research Center, 2024). Hearth is built phone-first and works offline.
- **AI:** language models can write to a strict specification, and an engine can verify every word, which makes per-family decodable stories practical.

## 7. Datasets used by the product

- **CMU Pronouncing Dictionary** (BSD-style license; npm `cmu-pronouncing-dictionary`) for pronunciations.
- **SUBTLEX-US** word frequencies (Brysbaert & New, 2009; npm `subtlex-word-frequencies`) to rank the 5,000 most common words used in “words you can read”.

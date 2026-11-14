# ECHOES — Content Review

Reviewer notes for the four chapter modules in `src/chapters/` and the data in `src/content/`. Facts checked **2026-11-14**. For the per-claim sources, see `docs/SCIENCE_SOURCES.md`.

## 1. Known approximations

| Where | Approximation | How it is labeled |
|---|---|---|
| Apollo 11 experiment | Average Earth–Moon distance 384,400 km and round trip ≈ 2.56 s. The real distance changes during each orbit. | "often-used average… The real distance changes during each orbit." |
| Apollo 11 experiment | The light-speed formula ignores atmosphere delays, station position and relativity. | Badge: "Educational calculation — not real-time laser data." |
| Apollo 11 experiment | The slider offers 100,000–500,000 km, an illustrative range rather than real orbital limits. | "Illustrative distance to the reflector" |
| Apollo 11 game, step 1 | "Bare ground scatters light in every direction, so far less of it comes straight back." This is general optics (diffuse vs retro-reflection), simplified. | Feedback text |
| Apollo 11 game, step 3 | The learner's chosen formula is applied to their own illustrative measurement; the ÷2 result reproduces the distance they set. | Badge: "Educational calculation… not live laser data"; table caption "educational values" |
| Apollo 11 reveal diagram | Generic ranging station (dome, beam, clock). Not a specific observatory. | Caption |
| Apollo 11 diagrams | Earth–Moon diagram is not to scale. The corner reflector is drawn in 2-D with two mirrors; real corner-cubes use three. | Caption text inside the SVG and below it. |
| Apollo 11 art | The panel shows 30 reflector dots, not 100. | "Illustration… The real array holds 100 reflectors." |
| Opportunity | "Almost 15 years". The NASA article also says "more than 15 years from 2004 to 2019", counting until the mission was declared over. | We use "almost 15 years", the headline wording. |
| Opportunity map | Sample marker positions are story positions on an illustrative landscape, not coordinates. | Caption: "approximate story positions, not real coordinates" |
| InSight | "Four years of listening" (Nov. 2018 to Dec. 2022). | Narrative rounding. |
| InSight interior diagram | Layer thicknesses and wave paths are not to scale. | "Simplified diagram — layers and wave paths are not to scale." |
| InSight layer explorer | Crust/mantle/core descriptions are general seismology (waves change speed at boundaries; some reflect off the core) without Mars-specific numbers, because the cited pages give none. | Plain-language text; no numbers |
| InSight signal table | "Biggest wiggle" percentages are computed from the synthetic traces; "sudden start" and "second arrival" are authored descriptions of those traces. | Caption: "the same three synthetic traces as a table" |
| Voyager | "Radio message takes a whole day to arrive" at one light-day. This is true by definition. NASA's milestone date was Nov. 18, 2026 and had not yet passed when we checked. | Worded as "NASA is counting down to…". |

## 2. Speculative narrative devices

- **Imagined first-person narration** appears in three hook scenes: the Apollo mirror, Opportunity and InSight. Each one is wrapped in a `<figure>` captioned **"Imagined narration based on NASA mission records"** (`IMAGINED_NARRATION_LABEL` in `src/content/scripts.ts`). None of it is presented as a quotation or transmission.
- Phrases such as "waited for Mars to shiver" and "the signal goes on" are metaphors. They are not science claims.
- The Voyager future question is open-ended and reflective. The learner doesn't type anything and nothing is stored.

## 3. Illustrative vs real data

| Element | Real or illustrative |
|---|---|
| Laser pulse animation and round-trip timer | **Illustrative calculation.** The timing is computed from the formula. It is not laser data. |
| Opportunity "Follow the Water" samples | **Real findings** with source links (hematite, jarosite, Endeavour). The spheres card is real but deliberately "not decisive on its own" (NASA listed several origins in 2004). Eagle crater is a true fact used as a non-water clue. |
| Opportunity dust slider and sunlight meter | **Conceptual simulation.** The 0–10 scale, the exponential fade and the 25% "just enough energy" line are invented for teaching. It is labeled "not Opportunity telemetry". |
| InSight Traces A/B/C and the P/S marker plot | **Synthetic**, generated deterministically in `syntheticWaveform()`. They are labeled "Synthetic illustrative seismograms — not real NASA measurements or recordings", and the chapter credits repeat this. |
| InSight 1,319 marsquakes | **Real**, from the JPL release. |
| Voyager status matching | **Real statuses** as of 2026-11-14. |
| Golden Record explorer | **Real facts** from NASA's Golden Record page. No images or sounds from the record are reproduced. |
| All artwork | **Original CSS/SVG illustrations**. No NASA photos, no NASA logos, no AI-generated imagery. Each one is captioned "Illustration, not a NASA photograph/image". |

## 4. Factual checkpoints (recheck before each release)

1. Voyager 1 status on https://science.nasa.gov/mission/voyager/ still reads "Extended Mission". If NASA ends the mission, update `MISSIONS.voyager.status`, `statusDetail`, the epilogue copy and `MATCH_ITEMS`.
2. Voyager 1's operating science instruments are still two (Apr. 17, 2026 blog). The Voyager 1 page still says "four", which is outdated.
3. Voyager 1's one-light-day milestone (countdown to Nov. 18, 2026). After that date, change the epilogue to past tense ("In November 2026, Voyager 1 reached…") once NASA confirms it.
4. Opportunity dates: July 7, 2003 / Jan. 24, 2004 PST (Jan. 25 UTC) / June 10, 2018 / Feb. 13, 2019.
5. Opportunity design life and distance: 90 sols, about 1,000 m, 28.06 mi (45.16 km).
6. InSight dates: May 5, 2018 / Nov. 26, 2018 / Dec. 15, 2022 (last contact) / Dec. 21, 2022 (announcement).
7. InSight marsquake total: 1,319.
8. Apollo 11 array: 100 cubes, 3.8 cm each, 46 cm panel, Sea of Tranquility.
9. Moon recession: "about an inch a year" (NASA Moon Facts).
10. Mars sol: 24.6 hours (NASA Mars Facts).
11. Every URL in `SOURCES` still resolves. The integrity script checks only that each is an https NASA URL. It does not check live links.
12. Wording audit: Opportunity is never said to have found life, the "battery is low" quote is never used, Voyager is never called dead, abandoned or landed, and the Apollo reflector is never said to transmit radio.

## 5. Accessibility review notes

- A global **Display & accessibility** dialog (text size, high contrast, reduced motion, simplified interface, reading-friendly text) writes data attributes on `<html>`; chapter CSS responds to all of them. Chapters read the reduced-motion setting as well as the OS preference.
- Every game step is a native radio group, button, switch or select. The Opportunity map markers are mouse/touch shortcuts only; the evidence list is the keyboard and screen-reader path. Graphs always have a text description and a data table.

- Every control is a native `button`, `input[type=range|radio|checkbox]` or `select`, with a visible label and a minimum touch target of 44 px.
- Focus moves to the scene heading when the learner changes step. Focus rings use `:focus-visible`.
- Feedback regions use `aria-live="polite"`. The progress bar exposes "Step N of M" text and `aria-current="step"`.
- `prefers-reduced-motion`: CSS animations and transitions are turned off, and the Apollo pulse result appears instantly.
- There is no audio. The SVG art has `role="img"` with text alternatives. The InSight traces are hidden from assistive tech because each radio label already describes its trace in words.
- The layout was checked at 360 px with no horizontal overflow.

## 6. Translations (ru, kk, es)

- Science content is translated in `src/content/locales/`; English data remains the source of truth for IDs, answers and sources.
- Automated checks (`integrity.ts → checkTranslations`): every mission, claim, chronology entry, scene, choice, sample, wave case, match item and Golden Record item is translated; paragraph and list counts match; no empty strings; scenes ≤ 110 words; and the multiset of numbers in each translated claim, date, scene, sample observation and record fact equals the English one.
- Units: inches/miles are given metric-first in Russian and Kazakh (e.g. "2,5 см (около дюйма)", "45 км (28 миль)"); the 12-inch record keeps "12-дюймовая / 12 дюймдік / 12 pulgadas".
- Terminology choices to review with native speakers: marsquake = марсотрясение / марс сілкінісі / martemoto; retroreflector = ретрорефлектор (уголковый отражатель) / ретрорефлектор (бұрыштық шағылыстырғыш) / retrorreflector; Golden Record = Золотая пластинка / Алтын пластинка / Disco de Oro.
- Release checkpoint: a fluent reviewer for each language (Kazakh first) should read every chapter and the game feedback before publication.

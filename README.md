# ECHOES — The Machines That Changed Our Universe

Their signals may fade. Their discoveries never will.

An independent, English-language educational space archive for curious minds, especially ages 10–15. Explore an original illustrated atlas, visit four spacecraft exhibits, and collect three science discoveries in a device-local journal. No account, backend, API keys, runtime API requests, or remote media are needed.

## Setup

Use Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite. Production and verification commands:

```sh
npm run build
npm run preview
npm run lint
npm test
```

`dist/` is a static site. Upload its contents to Netlify, Vercel, or GitHub Pages. Relative asset paths and hash routes support a repository subdirectory without a server rewrite. If a chapter module is ever missing, the shell shows a preparation state that does not award discoveries.

Content integrity checks (sources, word limits, game completability) also run standalone with Node 22.18+: `node src/content/integrity.check.mjs`.

## Mini-games

Each exhibit follows the same five stages: **mission briefing → the science → interactive experiment → real NASA connection → discovery card**. Wrong answers always explain why and give a hint; there are no timers, scores to lose or rankings.

| Exhibit | Game | What the player does | Labelled as |
|---|---|---|---|
| Apollo 11 | Measure the Distance to the Moon | Aim the telescope at the reflector, fire a laser pulse, time the round trip, choose the calculation (`distance = c × t ÷ 2`). Measurement log table and a text-only (non-animated) view. | Educational calculation, not live laser data |
| Opportunity | Follow the Water | Inspect five samples from a map or a structured evidence list, read the rover's sourced observation, decide whether each supports ancient water, compare on an evidence board; then a dust-vs-sunlight model. | Real findings with sources; dust model is conceptual, not telemetry |
| InSight | Marsquake Investigator | Pick the likely marsquake among three seismograms (also described in words and in a data table), reason about P/S wave arrivals, explore crust/mantle/core. | Synthetic seismograms, not NASA recordings |
| Voyager 1 (epilogue) | Match the Machines + Golden Record | Match four machines to their status; explore verified Golden Record facts. | Statuses as of November 2026 |

Game logic is pure TypeScript in `src/content/experiments.ts`; the chapters in `src/chapters/` render it.

## Architecture and integration

- `src/App.tsx`: layout, navigation, page titles, route focus, and completion coordination.
- `src/app/navigation.ts`: hash routing with browser back/forward and refresh support.
- `src/app/progress.ts`: versioned, validated localStorage, cross-tab synchronization, and an in-memory fallback when storage is blocked.
- `src/app/missions.ts`: navigation metadata and NASA source links, not story scripts.
- `src/app/ChapterHost.tsx`: Vite glob-based asynchronous chapter loading, preparation/loading/error states, retry, and completion guard.
- `src/components/`: landing, interactive atlas, journal, and original SVG artwork.
- `src/styles/global.css`: shell styles, theme variables, mobile layouts, reduced-motion and high-contrast support.
- `src/chapters/`, `src/content/`, `docs/SCIENCE_SOURCES.md`, and `docs/CONTENT_REVIEW.md`: Agent 2 ownership; this branch does not create or modify them.

### Frozen chapter contract

Agent 2 provides these four files:

```text
src/chapters/apollo11.tsx
src/chapters/opportunity.tsx
src/chapters/insight.tsx
src/chapters/voyager.tsx
```

Each file default-exports a React component with exactly these props:

```tsx
type ChapterProps = {
  onComplete: () => void;
  onBack: () => void;
};
```

`src/app/ChapterHost.tsx` uses `import.meta.glob('../chapters/*.tsx')`. Keys resolve to `../chapters/<id>.tsx`. A missing module receives the preparation view; merged modules load automatically after the development server updates or the site is rebuilt. A rejected import or render error shows retry and return actions. No static chapter import or placeholder story file is required.

A chapter calls `onComplete()` once after its educational interaction is finished. The host guards duplicate calls, records completion, and navigates to the journal. `onBack()` returns to the atlas. Apollo 11, Opportunity, and InSight count toward 3/3; Voyager records a separate epilogue visit. Replay does not erase discoveries. Keep chapter CSS scoped to `.echoes-chapter` or another unique prefix. All seven specified theme custom properties are available on `:root`.

The shell does not implement chapter experiments, narration, scientific explanations, or the content team's comprehension check. Agent 2 must supply those experiences in its owned files. The missing-module view disappears automatically when the files are integrated; no shell integration edit is needed.

### Routes and progress

```text
#/                         Opening
#/atlas                    Illustrated navigation atlas
#/chapter/apollo11         Moon reflector exhibit
#/chapter/opportunity      Mars rover exhibit
#/chapter/insight          Mars seismic lander exhibit
#/chapter/voyager          Interstellar epilogue
#/journal                  Discovery journal
```

Unknown addresses show a route recovery page. Progress uses `echoes.discovery-journal.v1` with `{ "version": 1, "completed": ["apollo11"] }`. Unknown IDs and duplicates are removed; malformed and unsupported records recover to an empty journal. Clearing browser storage removes progress. The journal's confirmed reset removes all discovery and epilogue progress while preserving unrelated browser storage. No progress is transmitted.

## Science references and artwork credits

Every mission entry and journal card links to its factual source:

- [NASA / ILRS: Apollo and Luna reflector information](https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html): lunar laser ranging and Apollo reflector hardware.
- [NASA: Opportunity](https://science.nasa.gov/mission/mer-opportunity/): rover mission, ended status, and evidence of ancient water.
- [NASA: InSight](https://science.nasa.gov/mission/insight/): ended lander mission and investigation of Mars's interior.
- [NASA: Voyager](https://science.nasa.gov/mission/voyager/): active extended mission and interstellar spacecraft. The status label is referenced to November 2026, not live telemetry; review before future submissions.

All planets, orbital paths, spacecraft schematics, iconography, and the ECHOES wordmark are original CSS/SVG illustrations created for this project with AI assistance. They are not NASA images, engineering diagrams, geodetic maps, spacecraft positions, or telemetry. The atlas is illustrative and not to scale. No external image, font, audio, or icon asset is used. No NASA logo is used.

Detailed scientific references and review records live in `docs/SCIENCE_SOURCES.md` (claim → source matrix) and `docs/CONTENT_REVIEW.md` (approximations, illustrative vs real data, release checkpoints). Additional sources used by the games include the [JPL 2004 Opportunity release](https://www.jpl.nasa.gov/news/opportunity-rover-finds-strong-evidence-meridiani-planum-was-wet) and [NASA's Golden Record contents](https://science.nasa.gov/mission/voyager/golden-record-contents/).

## Accessibility and verification

A **Display & accessibility** button in the header of every page opens a native modal dialog (focus moves in, Escape closes, focus returns to the button). Settings apply instantly to every page, including lazy-loaded chapters, are saved in `localStorage` (`echoes.preferences.v1`) and can be reset to default:

- **Text size**: Normal, Large (~20% larger), Extra large (~40% larger). All type uses `rem`; at larger sizes the atlas switches to a list and rigid rows wrap.
- **High contrast**: pure black background, brighter text, 2px outlines and a yellow focus ring.
- **Reduce motion**: disables decorative and transition animation; the operating-system `prefers-reduced-motion` setting is always respected as well. The laser experiment then resolves instantly and stays fully explained in text.
- **Simplified interface**: hides decorative artwork and starfields, uses plain backgrounds, enlarges reading text and actions, and shows the atlas as a list.
- **Reading-friendly text**: a plain, open system typeface with extra letter, word and line spacing. Some readers find this easier; it is not presented as a treatment for dyslexia.

Built into the components: semantic landmarks and headings, a skip link, visible focus, route and step focus management, live-region announcements for results and setting changes, feedback that never relies on color alone (icon + word + explanation), minimum 44px touch targets, keyboard-operable radio groups, switches, selects and buttons for every game step, list/table alternatives to the map and graphs, no drag-and-drop, no time limits, no flashing and no audio.

Automated checks: `npm run build`, `npm run lint`, `npm test` (Vitest: routing, storage, preferences, settings dialog, game logic, integrity checks and full keyboard-style play-throughs of all four chapters). Browser QA (headless Chromium) also played every game end to end, checked keyboard-only paths, settings persistence, and no horizontal overflow at 360px with extra-large text, high contrast, simplified and reading-font combinations. Automated checks do not guarantee WCAG conformance; test with real assistive technology before submission.

Manual smoke-test checklist:

1. Desktop: open the landing page, start Apollo in one click, then explore all four atlas stops.
2. Mobile: check at 360px and 390px; verify readable text, touch targets, no horizontal overflow, and that all four nodes remain reachable.
3. Hash links: load each chapter URL directly, refresh, and use browser back/forward. Check an unknown URL returns a useful recovery page.
4. Keyboard: Tab through header, atlas, and journal; use Enter to open links. Check visible focus and focus moving to main content on route changes. Activate the skip link.
5. Play each experiment to the end; check the journal redirect, the “New discovery unlocked” card, replay and reload persistence.
6. With three core completions: confirm 3/3. Voyager alone must remain 0/3. Cancel reset once; confirm it once; check reload.
7. Block storage and preload malformed storage: the shell still works with a clear session-only notice when storage is unavailable.
8. Open Display & accessibility: try every setting, reload to confirm persistence, reset to default. Check dialog focus, Escape and return focus with an actual browser and assistive technology.

## Screenshot and demo instructions

Run `npm run dev` or the production preview. Use a 1440×1000 desktop viewport and a 390×844 mobile viewport for screenshots. Capture the opening, atlas, empty/collected journal, and an integrated chapter. Use browser captures; the SVG artwork does not depend on network media. Avoid staging completed discoveries as real experiment results in a submission recording. Complete the actual integrated experiments for the demo.

An informal demo flow is opening → Apollo → Opportunity → InSight → journal → Voyager. Verify the event's actual required media length and eligibility rules before recording or submitting. See [Space Apps legal and participation terms](https://www.spaceappschallenge.org/legal/) and [NASA images and media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/). This repository is preparation material, not a statement that a submission has been accepted or all event terms have been reviewed.

## AI assistance and independence

AI assisted the application code, interaction design, original SVG/CSS artwork, navigation summaries, documentation, and automated checks. Humans should review scientific claims, content accessibility, asset rights, and applicable event rules before submission. ECHOES is an independent educational project and is not affiliated with or endorsed by NASA. Source links identify scientific references, not endorsement. NASA resources retain their own applicable terms.

## License

Original ECHOES code, prose, and original CSS/SVG artwork contributed on this branch are provided under the MIT License. Third-party dependencies retain their respective licenses. NASA source pages are linked references and are not relicensed by this project.

MIT License

Copyright (c) 2026 ECHOES contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

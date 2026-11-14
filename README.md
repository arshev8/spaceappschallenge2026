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

`dist/` is a static site. Upload its contents to Netlify, Vercel, or GitHub Pages. Relative asset paths and hash routes support a repository subdirectory without a server rewrite. This branch implements the UI shell; missing chapter modules intentionally show a preparation state. That state does not award discoveries.

The repository initially contained project instructions only. With authorization to complete setup, the React/TypeScript/Vite scaffold was created on `feat/atlas-ui`, keeping `main` untouched. Integrate that tooling before expecting the separate content branch to build in this checkout.

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

Detailed scientific references and review records are owned by the content branch in `docs/SCIENCE_SOURCES.md` and `docs/CONTENT_REVIEW.md` when integrated. Chapter experiments must label synthetic signals and conceptual models clearly.

## Accessibility and verification

The shell uses semantic links/buttons, a skip link, visible keyboard focus, route-change focus management, descriptive titles, labelled progress, non-color status text, large touch controls, and a native confirmation dialog. It requires no audio. Animations and transitions are disabled for reduced motion; chapter authors must honor that preference too. System fonts avoid external font requests.

The UI handoff passed `npm run build`, `npm run lint`, and all 34 tests. Browser QA covered desktop and 360px layouts, keyboard activation, route focus, chapter reload, browser back, and missing-module views; no console warnings or errors were observed. Automated tests cover hash parsing, invalid routes, deep links, storage corruption, duplicate completions, denied storage, cross-tab changes, journal counts, confirmation, and missing chapters. Completion boundary tests use a test-only mock inside `src/app/`; actual chapter experiments still require QA after integration. Run the commands above after merging content and review any failures in the owning branch.

Manual smoke-test checklist:

1. Desktop: open the landing page, start Apollo in one click, then explore all four atlas stops.
2. Mobile: check at 360px and 390px; verify readable text, touch targets, no horizontal overflow, and that all four nodes remain reachable.
3. Hash links: load each chapter URL directly, refresh, and use browser back/forward. Check an unknown URL returns a useful recovery page.
4. Keyboard: Tab through header, atlas, and journal; use Enter to open links. Check visible focus and focus moving to main content on route changes. Activate the skip link.
5. Before content integration: every chapter shows preparation; no discovery is awarded. After integration: check loading, each completed experiment, journal redirect, replay, and reload persistence.
6. With three core completions: confirm 3/3. Voyager alone must remain 0/3. Cancel reset once; confirm it once; check reload.
7. Block storage and preload malformed storage: the shell still works with a clear session-only notice when storage is unavailable.
8. Enable reduced motion and high contrast. Check reset dialog focus, Escape cancellation, and return focus with an actual browser and assistive technology.

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

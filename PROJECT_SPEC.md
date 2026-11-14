# ECHOES — The Machines That Changed Our Universe

**Tagline:** Their signals may fade. Their discoveries never will.

## Purpose
Build a polished, English-language, story-led educational web experience for NASA Space Apps Challenge. Target audience: ages 10–15 plus casual enthusiasts. The user visits human-made space artifacts, performs simple science-inspired interactions, and learns how the machines' engineering produced lasting scientific knowledge. The project is independent and is not endorsed by NASA.

## Experience arc
1. **Opening — The Archive Awakes.** A quiet starfield and an invitation to recover three discoveries from humanity's off-world machines. Start the story within one click; no login.
2. **Moon / Apollo 11 laser retroreflector — The Mirror That Never Went Silent.** A passive reflector left in 1969. Point and fire an *illustrative* laser pulse; learn how round-trip travel time can measure Earth–Moon distance. Mission takeaway: a piece of hardware can be scientifically useful without electronics or radio transmission.
3. **Mars / Opportunity — The Rover That Outlived Its Mission.** A rover designed for 90 sols, operational almost 15 years. Investigate geological clues to ancient water. Show a **clearly labeled conceptual** solar-power/dust experiment; avoid passing simulated power values off as mission telemetry.
4. **Mars / InSight — Listening to the Heart of Mars.** A stationary lander with a seismometer that explored Mars's interior. Identify a signal on an **illustrative, synthetic** seismogram and explain why waveforms can reveal internal structure.
5. **Epilogue / Voyager 1 — Beyond the Last Planet.** Contrast three different hardware states: Apollo 11 reflector passive and still scientifically useful, Opportunity and InSight ended, Voyager 1 still on an extended mission as of November 2026. Voyager is NOT a 'dead rover' or an object resting on another world's surface.
6. **Discovery Journal and ending.** Show three discoveries collected, short explanations, and citations to original NASA resources. Provide a 3-question comprehension check and replay links. Progress is stored locally.

## Product principles
- **Story first, data second:** short scenes with a child-friendly narrator. A rover may speak in a fictionalized voice, clearly marked as creative narration, never a real mission transmission.
- **Each chapter:** question → reveal a tool → user experiment → explain real observation → discovery card → factual source.
- **Science-aware UI:** no invented coordinates, quotes, exact final messages, live telemetry, synthetic NASA imagery, or exact map labels lacking support. The atlas is an **illustrative navigation map**, not a geodetic map.
- **Accessibility:** responsive at 360px and desktop; keyboard navigable controls; proper labels; visible focus; reduced-motion fallback; high contrast; no required audio; accessible transcripts for any recorded sounds.
- **Speed/reliability:** static data, no backend, no accounts, no external APIs required at runtime; design and text must survive external image failure.
- **Attribution:** NASA sources linked per claim and per image. Do not use NASA's logo as the ECHOES brand, and do not imply agency endorsement. Disclose AI-assisted code/content. Check official event rules before submission.

## Stack
React + TypeScript + Vite, plain CSS with CSS variables, CSS/SVG illustrations and interactions, localStorage. No three.js, no map SDK, no server or database, no paid services. Hosting: static website on Netlify / Vercel / GitHub Pages.

## Fixed integration contract
Four chapter IDs (file basenames) **must not be changed**:

- `apollo11` → `src/chapters/apollo11.tsx`
- `opportunity` → `src/chapters/opportunity.tsx`
- `insight` → `src/chapters/insight.tsx`
- `voyager` → `src/chapters/voyager.tsx`

Every file **default-exports** a React component receiving only:

```ts
type ChapterProps = {
  onComplete: () => void;
  onBack: () => void;
};
```

The shell loads them using `import.meta.glob('../chapters/*.tsx')` **relative to** `src/app/ChapterHost.tsx` (or an equivalent correctly calculated glob), so the shell builds before story files exist and the content branch builds independently. The shell owns navigation, overall layout and progress. A chapter may call `onComplete` exactly once when the educational interaction is complete; `onBack` returns to the atlas. Do not change this interface without explicit agreement from BOTH humans.

## Filesystem boundaries
**Agent 1 (shell/UI) owns:**
`src/App.tsx`, `src/main.tsx`, `src/app/**`, `src/components/**`, `src/styles/**`, `public/**`, `index.html`, `package.json`, lockfile, `vite.config.*`, `tsconfig*`, `eslint.config.*`, `README.md`.

**Agent 2 (stories/science) owns:**
`src/chapters/**`, `src/content/**`, `docs/SCIENCE_SOURCES.md`, `docs/CONTENT_REVIEW.md`.

Neither may edit the other's files. Agent 2 must use existing dependencies. Both can add tests inside their own paths. Avoid any global CSS selectors from Agent 2; prefix all chapter styling with `.echoes-chapter` or similarly unique names.

## Theme contract
Global CSS variables provided by Agent 1 on `:root`:

```css
--color-bg: #070b18;
--color-surface: #121b30;
--color-text: #f4f7ff;
--color-muted: #aab8d4;
--color-accent: #8ee7dd;
--color-mars: #ef9876;
--color-border: rgba(255,255,255,.15);
```

Agent 2 should consume these variables and provide graceful fallbacks when needed.

## Acceptance criteria
- `npm run build` succeeds on the merged main branch.
- Core chapters Apollo 11, Opportunity and InSight each contain 1 functional experiment, 1 plain-English finding, and at least 1 trustworthy factual source; Voyager is a complete epilogue, not a 'coming soon' placeholder.
- On an initial visit, user can start a chapter in one click; after completion the journal updates and persists across refreshes.
- All chapter routes are keyboard-accessible; browser back/reload/hash direct links work.
- All features work without account, API keys, backend, or credentials.
- Every central numerical claim, status and scientific outcome has a NASA reference and nuanced wording.
- README includes setup, architecture, data sources, license/attribution, AI assistance disclosure, screenshot/demo instructions, and disclaimers.

## NASA/official sources
- Apollo lunar reflectors: https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html
- NASA human artifacts on Moon: https://www.nasa.gov/wp-content/uploads/static/history/humanartifacts.html
- Opportunity: https://science.nasa.gov/mission/mer-opportunity/
- Mars Exploration Rovers: https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/
- InSight: https://science.nasa.gov/mission/insight/
- Voyager: https://science.nasa.gov/mission/voyager/
- NASA images/media rules: https://www.nasa.gov/nasa-brand-center/images-and-media/
- Space Apps 2026 participation terms: https://www.spaceappschallenge.org/legal/

# PROMPT FOR AI AGENT 1 — UI / EXPERIENCE ENGINEER

You are the lead UI engineer and design-system developer for **ECHOES — The Machines That Changed Our Universe**, an English-language narrative science exhibit for NASA Space Apps Challenge, built by a two-person team with two autonomous coding agents.

## FIRST ACTION: CREATE AND SWITCH TO YOUR OWN BRANCH

Before modifying any file:
1. Inspect `git status`, `git branch --show-current`, and the repository structure.
2. Ensure the Vite + React + TypeScript starter has been committed on `main`. If not, stop and report the missing shared scaffold rather than changing `main`.
3. Create/switch to **`feat/atlas-ui`** from the current `main` (`git switch -c feat/atlas-ui`), and verify the branch name.
4. NEVER work, commit, merge, reset, or rebase directly on `main`. Do not switch to the other agent's branch.
5. Do not overwrite work you did not create. If a task requires a file owned by Agent 2, report the required change to the human and continue within your own scope.

## YOUR EXCLUSIVE FILE OWNERSHIP

You may edit only:
- `src/App.tsx`, `src/main.tsx`, `src/app/**`, `src/components/**`, `src/styles/**`
- `public/**`, `index.html`, `README.md`
- Tooling/configuration: `package.json`, lockfile, Vite/TypeScript/ESLint config files.

**ABSOLUTELY FORBIDDEN:** Editing, renaming, deleting, or formatting any file in `src/chapters/**`, `src/content/**`, `docs/SCIENCE_SOURCES.md`, or `docs/CONTENT_REVIEW.md`. Do not create a stub in the other agent's directories. Do not bulk-format the entire repository. Do not resolve the other agent's tasks on their behalf.

## PRODUCT GOAL

Build an award-worthy, responsive, cinematic-but-fast interactive museum **shell** for ages 10–15. Provide:

1. **Landing page**: ECHOES brand (custom wordmark, no NASA logo), dark space palette, compelling one-sentence hook, prominent "Begin the Journey" call-to-action, accessible motion/particle details, concise NASA-data attribution.
2. **Interactive Atlas**: an original illustrated starfield with accessible stops for Moon / Mars / deep space; navigational artifact nodes for Apollo 11, Opportunity, InSight and Voyager 1. Distinguish inactive, passive-but-useful and active craft accurately. Clearly mark the atlas as **illustrative, not to scale**.
3. **Chapter navigation & host**: four chapter IDs, routed through URL hash (`#/atlas`, `#/chapter/apollo11`, `#/chapter/opportunity`, `#/chapter/insight`, `#/chapter/voyager`, `#/journal`). Ensure deep-linking and browser navigation work with static hosting.
4. **Discovery Journal**: completion cards for the 3 science chapters, visually distinct Voyager epilogue, progress tracker (3/3 core discoveries), reset with confirmation, localStorage persistence and safe handling of malformed storage.
5. **Shared layout**: small, accessible header, navigation, footer, source/credit styling, consistent typography and CSS variables. Navigation state and progression must work even if story code hasn't been merged yet.
6. **Accessibility**: keyboard nav, proper semantics, focus management, `prefers-reduced-motion`, text contrast, no flashing effects, smooth mobile responsive design (360px+).
7. **Graceful fallback**: ChapterHost displays an attractive "Exhibit is being prepared" state when a chapter file is unavailable (as it will be in your own branch), with a return-to-atlas action. This fallback must disappear automatically after integration.

## FROZEN CROSS-AGENT CONTRACT

Agent 2 will create exactly:
`src/chapters/apollo11.tsx`, `src/chapters/opportunity.tsx`, `src/chapters/insight.tsx`, `src/chapters/voyager.tsx`.

Each default export accepts `{ onComplete: () => void; onBack: () => void }` and calls onComplete only when finished. Do **not** import those filenames statically, because they do not yet exist on your branch. Implement a loader inside `src/app/ChapterHost.tsx` via Vite `import.meta.glob('../chapters/*.tsx')`, resolve by chapter ID, load asynchronously, show loading/error/fallback views. Verify the relative glob is correct. The host wraps chapters and persists completion on callback. Do not duplicate chapter story content in your components.

Use these chapter IDs unchanged: `apollo11`, `opportunity`, `insight`, `voyager`. `voyager` is an epilogue and is not included in the 3/3 science completion requirement. Journal should include fixed, **noncontroversial, lightweight summaries** for navigation:
- Apollo 11: A Moon reflector enables Earth–Moon laser distance measurements.
- Opportunity: Mars rocks preserved evidence of an ancient watery environment.
- InSight: Marsquakes revealed information about Mars's interior.
- Voyager 1: Active interstellar spacecraft, an epilogue rather than an abandoned surface object.

Expose CSS custom properties:
```
--color-bg: #070b18;
--color-surface: #121b30;
--color-text: #f4f7ff;
--color-muted: #aab8d4;
--color-accent: #8ee7dd;
--color-mars: #ef9876;
--color-border: rgba(255,255,255,.15);
```
Do not use global CSS selectors likely to break chapter-level markup. No dependency on a backend, LLM, API key, 3D engine or external media. Small client-side icon packages are fine only if the visual value warrants their cost; prefer CSS/SVG.

## IMPLEMENTATION EXPECTATIONS

- Work autonomously, make pragmatic choices, and implement the whole shell, not a mockup. Avoid lengthy planning without code.
- Take care with errors, loading state, document titles, touch sizing, mobile UI, and empty journal states.
- Source artwork from CSS/SVG or appropriately attributed NASA assets; do not imply NASA endorses ECHOES. Avoid NASA logos as ECHOES branding.
- Use semantic buttons/links, not unclickable decorative controls.
- Do not ask for credentials. Never edit another agent's files, even to fix an integration bug: leave an explicit handoff note.
- Run `npm run build` and any existing lint checks. Fix errors **only in owned files**.
- Commit your work with a descriptive message on `feat/atlas-ui` and push the branch if a remote exists (never force-push).

## HANDOFF (MANDATORY)

At the end, report:
1. Current branch and commit hash.
2. Features implemented and files changed.
3. Commands run and their results.
4. The exact chapter export/props/import contract, with any caveats.
5. Any integration changes needed from Agent 2, without making those changes yourself.
6. A short manual smoke-test checklist (desktop/mobile, hash links, journal persistence, missing chapter fallback).

You own the museum shell and overall visual polish. Agent 2 owns science, chapter narration, experiments and content. Respect the boundary without exception.

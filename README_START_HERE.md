# ECHOES — Starting and integrating two AI agents

## 0 — One-time shared repo initialization (by either human, before both agents)

Requirements: Node.js 20.19+ or 22.12+ (check your installed Vite version), Git, npm.

```bash
npm create vite@latest echoes -- --template react-ts
cd echoes
npm install
npm run build
git init -b main
git add .
git commit -m "chore: initial React TypeScript Vite scaffold"
```

Create a remote repository, configure `origin`, and push `main` if you want both agents on different devices. The shared starter must be the same commit for both.

## 1 — Give each person their own checkout

Run each AI agent in a separate clone or independent Git worktree. **Never launch two agents in the same working tree.** They will switch their own branch as their FIRST action.

Person A: give `PROMPT_AGENT_1_UI.md` and `PROJECT_SPEC.md` to the agent.

Person B: give `PROMPT_AGENT_2_STORY.md` and `PROJECT_SPEC.md` to the agent.

Both agents MUST create their named branch themselves. Do NOT pre-switch the branch for them unless troubleshooting.

## 2 — Ownership and automatic integration

A owns shell/app/layout/config. B owns chapters/content/science docs. Neither edits other's files.

The shell must NOT directly import story files. It lazy-loads modules using Vite's `import.meta.glob` to allow two agents to develop from the original starter simultaneously. This is deliberate: both individual branches remain buildable, and story modules automatically appear when merged.

## 3 — Recommended merge procedure

When both branches pass review:

```bash
git switch main
git pull --ff-only  # only if you have a remote and upstream configured
git merge --no-ff feat/atlas-ui
git merge --no-ff feat/science-stories
npm ci
npm run build
npm run lint
npm run dev
```

If any merge or build fails, STOP. Do not force the merge or let an agent edit the other person's files. Share the error with the owner of the affected files and fix in their branch, then integrate again.

### Manual integration QA

- Landing page appears and first action starts the atlas.
- Four chapter nodes work; each loads its full module, not the shell fallback.
- Three core experiments are functional and science conclusions can be reached.
- Voyager chapter clearly shows active extended mission and calls completion.
- Journal shows 3/3 core completions (Voyager optional epilogue) and persists on reload.
- Hash direct links and browser back/forward work on static hosting.
- Tab/Enter/Space keyboard navigation; reduced motion; 360px smartphone width.
- Every claim/asset has source and credit. Real photos distinguished from illustrations and simulated data.
- README/attribution/license/AI disclosure completed; deploy URL publicly accessible without authentication.

## 4 — Demo script (~90 seconds, adjust to CURRENT competition submission rules)

1. **0–15s**: Hook — "Some spacecraft no longer call Earth. But they keep teaching us."
2. **15–35s**: Moon reflector experiment: light pulse → round trip → distance inference.
3. **35–60s**: Opportunity evidence → ancient Mars had water.
4. **60–75s**: InSight illustrative marsquake → planetary interior.
5. **75–90s**: Journal + Voyager epilogue, NASA sources, explain ages/accessibility.

Check the **2026 challenge's actual media duration and slide rules** before exporting the final submission. The above is an informal presentation script, not a statement of the event's accepted video length.

## 5 — Submission and rights

- Submit a working publicly reachable link, GitHub repo, description and credited NASA references.
- Original project content must be distributed under a valid open-source license per 2026 participant terms; check third-party permissions and document them.
- Declare AI-assisted work in appropriate submission materials. If using AI-generated images/audio, label them appropriately and check current challenge-specific requirements.
- Do not use official NASA logos/identifiers as ECHOES brand; do not claim affiliation or endorsement.

Sources: https://www.spaceappschallenge.org/legal/ and https://www.nasa.gov/nasa-brand-center/images-and-media/

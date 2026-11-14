// Content integrity runner. Requires Node 22.18+ / 23.6+ (built-in TypeScript type stripping).
// Usage: node src/content/integrity.check.mjs
// Not imported by the app; Vite/tsc ignore this file.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runIntegrityChecks } from './integrity.ts';
import { CHAPTER_IDS } from './missions.ts';

const here = dirname(fileURLToPath(import.meta.url));
const chaptersDir = join(here, '..', 'chapters');

const results = runIntegrityChecks();

for (const id of CHAPTER_IDS) {
  const file = join(chaptersDir, `${id}.tsx`);
  const exists = existsSync(file);
  const src = exists ? readFileSync(file, 'utf8') : '';
  results.push({ name: `chapter file exists: ${id}.tsx`, ok: exists });
  results.push({ name: `chapter default export: ${id}.tsx`, ok: /export\s+default\s+function\s+\w+/.test(src) });
  results.push({
    name: `chapter uses ChapterProps contract: ${id}.tsx`,
    ok: /onComplete/.test(src) && /onBack/.test(src),
  });
  results.push({
    name: `chapter avoids localStorage / location.hash: ${id}.tsx`,
    ok: !/localStorage|location\.hash|history\.(push|replace)State/.test(src),
  });
}

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);

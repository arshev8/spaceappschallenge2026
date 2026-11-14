/**
 * Pure content-integrity checks (no DOM, no Node APIs).
 * Run with: node src/content/integrity.check.mjs
 */
import {
  CHAPTER_IDS,
  MISSIONS,
  SOURCES,
  getSource,
  type ChapterId,
  type SourceRef,
} from './missions.ts';
import {
  APOLLO_TARGETS,
  AVERAGE_EARTH_MOON_KM,
  DUST_SCALE,
  EVENT_CASE_ID,
  FORMULA_CHOICES,
  GAP_CHOICES,
  GOLDEN_RECORD_ITEMS,
  LAYER_CHOICES,
  REFERENCE_MATCHES,
  REFERENCE_VERDICTS,
  SAMPLES,
  apolloGatePassed,
  computeWithFormula,
  evaluateMatches,
  evaluateSample,
  evidenceSolved,
  insightGatePassed,
  opportunityGatePassed,
  roundTripSeconds,
  syntheticWaveform,
} from './experiments.ts';
import { MAX_SCENE_WORDS, SCRIPTS, sceneWordCount, type GateId } from './scripts.ts';

export type CheckResult = { name: string; ok: boolean; detail?: string };

/** Reference solutions run through the SAME evaluators the chapters use. */
export const GATE_SOLVERS: Record<GateId, () => boolean> = {
  'apollo-ranging': () => {
    const target = APOLLO_TARGETS.find((c) => c.correct);
    const formula = FORMULA_CHOICES.find((c) => c.correct);
    return Boolean(target && formula) && apolloGatePassed(target!.id, 1, formula!.id);
  },
  'opportunity-evidence': () => opportunityGatePassed(evidenceSolved(REFERENCE_VERDICTS), DUST_SCALE.max),
  'insight-seismogram': () => {
    const gap = GAP_CHOICES.find((g) => g.correct);
    const layer = LAYER_CHOICES.find((g) => g.correct);
    return Boolean(gap && layer) && insightGatePassed(EVENT_CASE_ID, gap!.id, layer!.id);
  },
  'voyager-matching': () => evaluateMatches(REFERENCE_MATCHES).correct,
};

function isOfficialUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && (u.hostname.endsWith('nasa.gov'));
  } catch {
    return false;
  }
}

/** Simulates a learner walking forward through a chapter, solving each gate. */
export function simulateChapter(id: ChapterId): { reachedEnd: boolean; steps: number } {
  const scenes = SCRIPTS[id];
  let index = 0;
  let steps = 0;
  while (index < scenes.length - 1 && steps < 50) {
    const gate = scenes[index].gate;
    if (gate && !GATE_SOLVERS[gate]()) break;
    index++;
    steps++;
  }
  return { reachedEnd: index === scenes.length - 1 && scenes[index].kind === 'discovery', steps };
}

export function runIntegrityChecks(): CheckResult[] {
  const results: CheckResult[] = [];
  const add = (name: string, ok: boolean, detail?: string) => results.push({ name, ok, detail });

  add('exactly 4 chapter ids', CHAPTER_IDS.length === 4 && new Set(CHAPTER_IDS).size === 4);
  for (const id of ['apollo11', 'opportunity', 'insight', 'voyager'] as const) {
    add(`mission + script exist: ${id}`, MISSIONS[id]?.id === id && Array.isArray(SCRIPTS[id]));
  }

  for (const s of Object.values(SOURCES) as SourceRef[]) {
    add(`source URL is https NASA: ${s.id}`, isOfficialUrl(s.url), s.url);
  }

  for (const id of CHAPTER_IDS) {
    const m = MISSIONS[id];
    add(`${id}: primary source resolves`, Boolean(getSource(m.primarySourceId)));
    add(`${id}: has 2+ claims`, m.claims.length >= 2);
    for (const c of m.claims) {
      add(
        `${id}: claim ${c.id} has resolvable sources`,
        c.sourceIds.length > 0 && c.sourceIds.every((s) => Boolean(getSource(s))),
      );
    }
    for (const e of m.chronology) {
      add(`${id}: chronology "${e.date}" source resolves`, Boolean(getSource(e.sourceId)));
    }
    add(`${id}: statusAsOf is ISO date`, /^\d{4}-\d{2}-\d{2}$/.test(m.statusAsOf));

    const scenes = SCRIPTS[id];
    add(`${id}: first scene is a hook`, scenes[0]?.kind === 'hook');
    add(`${id}: last scene is a discovery`, scenes[scenes.length - 1]?.kind === 'discovery');
    add(`${id}: exactly one gated experiment`, scenes.filter((s) => s.gate).length === 1);
    add(`${id}: scene ids unique`, new Set(scenes.map((s) => s.id)).size === scenes.length);
    for (const s of scenes) {
      const words = sceneWordCount(s);
      add(`${id}/${s.id}: ≤ ${MAX_SCENE_WORDS} words`, words <= MAX_SCENE_WORDS, `${words} words`);
    }
    const sim = simulateChapter(id);
    add(`${id}: experiment can reach completion step`, sim.reachedEnd, `${sim.steps} steps`);
  }

  // Science sanity checks.
  const rt = roundTripSeconds(AVERAGE_EARTH_MOON_KM);
  add('Earth–Moon round trip ≈ 2.56 s', Math.abs(rt - 2.56) < 0.01, `${rt.toFixed(3)} s`);
  add('Voyager status is extended mission (not ended)', MISSIONS.voyager.status === 'extended-mission');
  add('Opportunity and InSight marked ended', MISSIONS.opportunity.status === 'mission-ended' && MISSIONS.insight.status === 'mission-ended');
  add('No evidence card claims proof of life', !/proof of life|found life/i.test(JSON.stringify(MISSIONS.opportunity)) || /not proof of life/i.test(MISSIONS.opportunity.result));
  const banned = /battery is low and it'?s getting dark/i;
  add('No fabricated “battery is low” quote', !banned.test(JSON.stringify(SCRIPTS)));
  for (const kind of ['quiet', 'event', 'wind'] as const) {
    const w = syntheticWaveform(kind);
    add(`synthetic waveform ${kind} is deterministic and bounded`,
      w.length > 0 && w.every((v) => v >= -1 && v <= 1) && JSON.stringify(w) === JSON.stringify(syntheticWaveform(kind)));
  }

  // Game-design checks: every choice list has exactly one right answer and every wrong answer teaches.
  for (const [name, list] of [['apollo targets', APOLLO_TARGETS], ['apollo formulas', FORMULA_CHOICES], ['insight gap', GAP_CHOICES], ['insight layers', LAYER_CHOICES]] as const) {
    add(`${name}: exactly one correct choice`, list.filter((c) => c.correct).length === 1);
    add(`${name}: every choice has feedback`, list.every((c) => c.feedback.length > 20));
  }
  const ct2 = computeWithFormula('ct2', 2.564);
  add('formula ÷2 recovers ~384,400 km from 2.564 s', ct2 !== null && Math.abs(ct2 - AVERAGE_EARTH_MOON_KM) < 200);
  add('every Opportunity sample has a resolvable source', SAMPLES.every((s) => Boolean(getSource(s.sourceId))));
  add('Opportunity has water and non-water samples', SAMPLES.some((s) => s.verdict === 'water') && SAMPLES.some((s) => s.verdict === 'not-clear'));
  add('wrong verdicts return a hint (never a dead end)', SAMPLES.every((s) => {
    const wrong = evaluateSample(s.id, s.verdict === 'water' ? 'not-clear' : 'water');
    return !wrong.correct && wrong.message === s.hint && s.hint.length > 10;
  }));
  add('Golden Record items present', GOLDEN_RECORD_ITEMS.length >= 4);

  return results;
}

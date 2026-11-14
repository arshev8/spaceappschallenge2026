/**
 * Pure, framework-free logic for every chapter experiment.
 * Chapters call these evaluators; integrity checks call the same evaluators
 * with the reference answers to prove each experiment can be completed.
 */
import type { MissionStatus } from './missions.ts';

/* ------------------------------------------------------------------ */
/* Apollo 11 — round-trip light timing (educational calculation)       */
/* ------------------------------------------------------------------ */

/** Speed of light in vacuum, km/s (exact by definition of the metre). */
export const SPEED_OF_LIGHT_KM_S = 299_792.458;

/** Often-quoted average Earth–Moon distance, km (approximate). */
export const AVERAGE_EARTH_MOON_KM = 384_400;

export const DISTANCE_SLIDER = { min: 100_000, max: 500_000, step: 100 } as const;

export function roundTripSeconds(distanceKm: number): number {
  return (2 * distanceKm) / SPEED_OF_LIGHT_KM_S;
}

export function distanceFromRoundTrip(roundTripS: number): number {
  return (SPEED_OF_LIGHT_KM_S * roundTripS) / 2;
}

/** The inverse puzzle: a pulse returns after this many seconds. */
export const APOLLO_PUZZLE_SECONDS = 2.56;

export type ApolloChoice = { id: string; km: number; label: string; feedback: string };

export const APOLLO_PUZZLE_CHOICES: ApolloChoice[] = [
  {
    id: 'half',
    km: 192_000,
    label: 'About 192,000 km',
    feedback: 'That divides by 2 twice. Light covers about 767,000 km in 2.56 s; half of that is the one-way distance.',
  },
  {
    id: 'correct',
    km: 384_000,
    label: 'About 384,000 km',
    feedback:
      'Yes! 299,792 km/s × 2.56 s ≈ 767,000 km for the whole trip. Halve it for one way: about 384,000 km.',
  },
  {
    id: 'double',
    km: 767_000,
    label: 'About 767,000 km',
    feedback: 'Close — but that is the there-and-back path. The pulse traveled to the Moon and back, so divide by 2.',
  },
];

export function evaluateApolloPuzzle(choiceId: string): { correct: boolean; feedback: string } {
  const choice = APOLLO_PUZZLE_CHOICES.find((c) => c.id === choiceId);
  if (!choice) return { correct: false, feedback: 'Pick one of the answers.' };
  const expected = distanceFromRoundTrip(APOLLO_PUZZLE_SECONDS);
  // Accept within 1% of the computed value.
  const correct = Math.abs(choice.km - expected) / expected < 0.01;
  return { correct, feedback: choice.feedback };
}

export function apolloGatePassed(pulsesFired: number, puzzleChoiceId: string | null): boolean {
  return pulsesFired > 0 && puzzleChoiceId !== null && evaluateApolloPuzzle(puzzleChoiceId).correct;
}

/* ------------------------------------------------------------------ */
/* Opportunity — evidence cards + conceptual dust/solar model           */
/* ------------------------------------------------------------------ */

export type EvidenceCard = {
  id: string;
  title: string;
  caption: string;
  supportsWater: boolean;
  explanation: string;
  sourceId: string;
};

export const EVIDENCE_CARDS: EvidenceCard[] = [
  {
    id: 'hematite',
    title: 'Hematite at the landing site',
    caption: 'Opportunity found hematite, a mineral that forms in water, where it landed.',
    supportsWater: true,
    explanation: 'Hematite of this kind forms in water, so finding it is a clue that water was once there.',
    sourceId: 'opportunityEnd',
  },
  {
    id: 'endeavour',
    title: 'Water-altered rocks at Endeavour Crater',
    caption: 'At Endeavour Crater, rocks showed strong indications of the action of ancient water.',
    supportsWater: true,
    explanation: 'Rocks changed by water keep a record of that water long after it has gone.',
    sourceId: 'opportunityEnd',
  },
  {
    id: 'eagle',
    title: 'Landing inside a small crater',
    caption: 'Opportunity came to rest inside a small impact crater called Eagle.',
    supportsWater: false,
    explanation:
      'True, and lucky — but a crater only tells us where the rover landed. On its own it is not a clue about water.',
    sourceId: 'merOpportunity',
  },
];

export function evaluateEvidence(selectedIds: Iterable<string>): {
  correct: boolean;
  missing: string[];
  wrong: string[];
} {
  const selected = new Set(selectedIds);
  const missing = EVIDENCE_CARDS.filter((c) => c.supportsWater && !selected.has(c.id)).map((c) => c.id);
  const wrong = EVIDENCE_CARDS.filter((c) => !c.supportsWater && selected.has(c.id)).map((c) => c.id);
  return { correct: selected.size > 0 && missing.length === 0 && wrong.length === 0, missing, wrong };
}

export const SUPPORTING_EVIDENCE_IDS = EVIDENCE_CARDS.filter((c) => c.supportsWater).map((c) => c.id);

/**
 * CONCEPTUAL MODEL ONLY — not Opportunity telemetry.
 * Sky dustiness on an invented 0–10 scale → share of clear-sky sunlight
 * reaching the panels, using a simple exponential fade.
 */
export const DUST_SCALE = { min: 0, max: 10, step: 1 } as const;
export const SURVIVAL_THRESHOLD_PERCENT = 25;

export function illustrativeSunlightPercent(dustLevel: number): number {
  const clamped = Math.min(DUST_SCALE.max, Math.max(DUST_SCALE.min, dustLevel));
  return Math.round(100 * Math.exp(-0.32 * clamped));
}

export function belowSurvivalThreshold(dustLevel: number): boolean {
  return illustrativeSunlightPercent(dustLevel) < SURVIVAL_THRESHOLD_PERCENT;
}

/** Gate: evidence solved AND the learner has explored a dust level where the model loses power. */
export function opportunityGatePassed(evidenceCorrect: boolean, maxDustSeen: number): boolean {
  return evidenceCorrect && belowSurvivalThreshold(maxDustSeen);
}

/* ------------------------------------------------------------------ */
/* InSight — synthetic illustrative seismograms                         */
/* ------------------------------------------------------------------ */

export type WaveCaseId = 'quiet' | 'event' | 'wind';

export type WaveCase = {
  id: WaveCaseId;
  label: string;
  description: string;
  feedback: string;
};

export const WAVE_CASES: WaveCase[] = [
  {
    id: 'quiet',
    label: 'Trace A',
    description: 'A thin, steady line with only tiny wiggles the whole time.',
    feedback: 'This trace stays calm the whole time — a quiet stretch with nothing much happening.',
  },
  {
    id: 'event',
    label: 'Trace B',
    description: 'Calm, then a sudden first jolt, then a second, bigger arrival that slowly fades.',
    feedback:
      'Yes! A sharp start, a second arrival and a slow fade are the pattern seismologists look for in a quake or impact.',
  },
  {
    id: 'wind',
    label: 'Trace C',
    description: 'Messy bursts of shaking scattered across the whole record, with no clear start.',
    feedback:
      'Lots of shaking, but no clear start and no second arrival. Messy bursts like this are more like wind or other noise.',
  },
];

export const EVENT_CASE_ID: WaveCaseId = 'event';

/** Where the two arrivals start in the synthetic event trace (fraction of trace width). */
export const EVENT_ARRIVALS = { p: 0.28, s: 0.52 } as const;

export function evaluateWaveChoice(id: string): { correct: boolean; feedback: string } {
  const c = WAVE_CASES.find((w) => w.id === id);
  if (!c) return { correct: false, feedback: 'Choose one of the traces.' };
  return { correct: c.id === EVENT_CASE_ID, feedback: c.feedback };
}

export type GapChoice = { id: 'farther' | 'closer'; label: string; correct: boolean; feedback: string };

export const GAP_CHOICES: GapChoice[] = [
  {
    id: 'farther',
    label: 'Farther away',
    correct: true,
    feedback:
      'Right. The first (P) wave is faster than the second (S) wave, so the longer they travel, the bigger the gap grows.',
  },
  {
    id: 'closer',
    label: 'Closer',
    correct: false,
    feedback:
      'Think of two runners at different speeds: the longer the race, the bigger the gap at the finish. The same is true for the two waves.',
  },
];

export function evaluateGapChoice(id: string): { correct: boolean; feedback: string } {
  const c = GAP_CHOICES.find((g) => g.id === id);
  return c ? { correct: c.correct, feedback: c.feedback } : { correct: false, feedback: 'Choose an answer.' };
}

export function insightGatePassed(waveChoice: string | null, gapChoice: string | null): boolean {
  return (
    waveChoice !== null &&
    gapChoice !== null &&
    evaluateWaveChoice(waveChoice).correct &&
    evaluateGapChoice(gapChoice).correct
  );
}

/** Deterministic pseudo-random generator so synthetic traces never change between renders. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * SYNTHETIC illustrative trace, values in [-1, 1]. Not a NASA recording.
 */
export function syntheticWaveform(kind: WaveCaseId, samples = 240): number[] {
  const rand = mulberry32(kind === 'quiet' ? 11 : kind === 'event' ? 23 : 37);
  const noise = () => rand() * 2 - 1;
  const out: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    let v = 0.04 * noise();
    if (kind === 'event') {
      const { p, s } = EVENT_ARRIVALS;
      if (t >= p) v += 0.35 * Math.exp(-(t - p) * 9) * Math.sin((t - p) * 220);
      if (t >= s) v += 0.85 * Math.exp(-(t - s) * 6) * Math.sin((t - s) * 140 + 0.6) * (0.8 + 0.2 * noise());
    } else if (kind === 'wind') {
      const gust = Math.max(0, Math.sin(t * 19 + 1.3) * Math.sin(t * 7.1));
      v += 0.55 * gust * noise() + 0.12 * noise();
    }
    out.push(Math.max(-1, Math.min(1, v)));
  }
  return out;
}

/** Converts a waveform to an SVG path string inside a width × height box. */
export function waveformPath(values: number[], width: number, height: number): string {
  if (values.length === 0) return '';
  const mid = height / 2;
  const dx = width / Math.max(1, values.length - 1);
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * dx).toFixed(1)},${(mid - v * mid * 0.9).toFixed(1)}`)
    .join(' ');
}

/* ------------------------------------------------------------------ */
/* Voyager — status matching                                            */
/* ------------------------------------------------------------------ */

export type MatchItem = { id: string; label: string; answer: MissionStatus; explanation: string };

export const MATCH_ITEMS: MatchItem[] = [
  {
    id: 'apollo11',
    label: 'Apollo 11 laser reflector',
    answer: 'passive-still-useful',
    explanation: 'No power and no radio — yet it still returns laser light that scientists can time.',
  },
  {
    id: 'opportunity',
    label: 'Opportunity rover',
    answer: 'mission-ended',
    explanation: 'Fell silent in the 2018 dust storm; NASA ended the mission in February 2019.',
  },
  {
    id: 'insight',
    label: 'InSight lander',
    answer: 'mission-ended',
    explanation: 'Ran out of power; last contact on Dec. 15, 2022.',
  },
  {
    id: 'voyager',
    label: 'Voyager 1',
    answer: 'extended-mission',
    explanation: 'Still traveling through interstellar space and still sending data home.',
  },
];

export const MATCH_OPTIONS: MissionStatus[] = ['passive-still-useful', 'mission-ended', 'extended-mission'];

export function evaluateMatches(answers: Record<string, string | undefined>): {
  correct: boolean;
  results: Record<string, boolean>;
  score: number;
} {
  const results: Record<string, boolean> = {};
  let score = 0;
  for (const item of MATCH_ITEMS) {
    const ok = answers[item.id] === item.answer;
    results[item.id] = ok;
    if (ok) score++;
  }
  return { correct: score === MATCH_ITEMS.length, results, score };
}

export const REFERENCE_MATCHES: Record<string, MissionStatus> = Object.fromEntries(
  MATCH_ITEMS.map((m) => [m.id, m.answer]),
);

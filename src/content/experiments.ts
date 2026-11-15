/**
 * Pure, framework-free logic for every chapter experiment (the ECHOES mini-games).
 * Chapters call these evaluators; integrity checks call the same evaluators
 * with the reference answers to prove each game can be completed.
 */
import type { MissionStatus } from './missions.ts';

/* ------------------------------------------------------------------ */
/* Apollo 11 — "Measure the Distance to the Moon"                       */
/* Educational calculation: values are illustrative, physics is real.  */
/* ------------------------------------------------------------------ */

/** Speed of light in vacuum, km/s (exact by definition of the meter). */
export const SPEED_OF_LIGHT_KM_S = 299_792.458;

/** Often-quoted average Earth–Moon distance, km (approximate). */
export const AVERAGE_EARTH_MOON_KM = 384_400;

export const DISTANCE_SLIDER = { min: 100_000, max: 500_000, step: 100 } as const;

export function roundTripSeconds(distanceKm: number): number {
  return (2 * distanceKm) / SPEED_OF_LIGHT_KM_S;
}

function distanceFromRoundTrip(roundTripS: number): number {
  return (SPEED_OF_LIGHT_KM_S * roundTripS) / 2;
}

export type Choice = { id: string; label: string; correct: boolean; feedback: string };

/** Step 1 — aim the telescope. */
export const APOLLO_TARGETS: Choice[] = [
  {
    id: 'reflector',
    label: 'The Apollo 11 reflector array',
    correct: true,
    feedback: 'Locked on. Each corner-cube sends light back toward where it came from, so some of the pulse can return to the telescope.',
  },
  {
    id: 'ground',
    label: 'Bare lunar ground beside it',
    correct: false,
    feedback: 'Bare ground scatters light in every direction, so far less of it comes straight back. Try the target that is built to send light home.',
  },
];

/** Step 3 — choose the calculation. */
export const FORMULA_CHOICES: Choice[] = [
  {
    id: 'ct',
    label: 'distance = speed of light × time',
    correct: false,
    feedback: 'That gives the length of the whole trip — there AND back. Hint: the light crossed the gap twice.',
  },
  {
    id: 'ct2',
    label: 'distance = speed of light × time ÷ 2',
    correct: true,
    feedback: 'Exactly! The pulse traveled to the Moon and back, so half of the total path is the one-way distance.',
  },
  {
    id: 'c_t',
    label: 'distance = speed of light ÷ time',
    correct: false,
    feedback: 'Dividing a speed by a time does not give a distance. Hint: speed × time = distance traveled.',
  },
];

export function evaluateChoice(choices: Choice[], id: string | null): { correct: boolean; feedback: string } {
  const c = choices.find(x => x.id === id);
  return c ? { correct: c.correct, feedback: c.feedback } : { correct: false, feedback: 'Choose one of the options.' };
}

export type Measurement = { shot: number; distanceKm: number; roundTripS: number };

/** Applies a formula choice to a measured round-trip time. */
export function computeWithFormula(formulaId: string, roundTripS: number): number | null {
  if (formulaId === 'ct') return SPEED_OF_LIGHT_KM_S * roundTripS;
  if (formulaId === 'ct2') return distanceFromRoundTrip(roundTripS);
  if (formulaId === 'c_t') return roundTripS === 0 ? null : SPEED_OF_LIGHT_KM_S / roundTripS;
  return null;
}

export function apolloGatePassed(targetId: string | null, pulsesFired: number, formulaId: string | null): boolean {
  return evaluateChoice(APOLLO_TARGETS, targetId).correct && pulsesFired > 0 && evaluateChoice(FORMULA_CHOICES, formulaId).correct;
}

/* ------------------------------------------------------------------ */
/* Opportunity — "Follow the Water" + conceptual dust/solar model       */
/* ------------------------------------------------------------------ */

export type Verdict = 'water' | 'not-clear';

export const VERDICT_LABELS: Record<Verdict, string> = {
  water: 'Supports ancient water',
  'not-clear': 'Not a water clue on its own',
};

export type Sample = {
  id: string;
  name: string;
  location: string;
  observation: string;
  properties: string[];
  verdict: Verdict;
  explanation: string;
  hint: string;
  sourceId: string;
  /** Marker position on the illustrative landscape, in percent. */
  position: { x: number; y: number };
};

export const SAMPLES: Sample[] = [
  {
    id: 'hematite',
    name: 'Hematite at the landing site',
    location: 'Meridiani Planum, where Opportunity landed',
    observation: 'Opportunity found hematite, a mineral that forms in water, at its landing site.',
    properties: ['Type: mineral (an iron oxide)', 'How NASA describes it: “a mineral that forms in water”'],
    verdict: 'water',
    explanation: 'This mineral forms in water, so finding it is a strong clue that water was once there.',
    hint: 'Read the observation again: what does NASA say this mineral needs in order to form?',
    sourceId: 'opportunityEnd',
    position: { x: 14, y: 62 },
  },
  {
    id: 'jarosite',
    name: 'Jarosite in the “El Capitan” rock',
    location: 'A layered outcrop inside Eagle crater (2004)',
    observation: 'Instruments found sulfate salts, including jarosite — a hydrated iron sulfate mineral.',
    properties: ['Type: salt mineral', '“Hydrated” means water is part of the mineral itself'],
    verdict: 'water',
    explanation: 'Water is built into jarosite. In 2004 the science team concluded that liquid water once flowed through these rocks, changing their texture and chemistry.',
    hint: 'Look at the word “hydrated”. What is built into this mineral?',
    sourceId: 'jpl2004',
    position: { x: 45, y: 50 },
  },
  {
    id: 'spherules',
    name: 'Tiny round spheres',
    location: 'Embedded in the same outcrop (first seen in 2004)',
    observation: 'Round particles about the size of BBs (small pellets) are embedded in the outcrop. At first, only their shape was known.',
    properties: ['Shape: round, a few millimeters across', 'When first seen, NASA listed several possible origins'],
    verdict: 'not-clear',
    explanation: 'Good scientific caution! When the spheres were first seen, shape alone could not settle it: NASA listed volcanic eruptions, molten droplets from a meteor impact, or minerals coming out of water. Weeks later, tests showed they are rich in hematite, and scientists concluded they grew inside water-soaked rock. Careful steps made the final answer stronger.',
    hint: 'When the spheres were first seen, NASA listed more than one way they could form. Is their shape alone enough to prove water?',
    sourceId: 'jpl2004',
    position: { x: 58, y: 74 },
  },
  {
    id: 'endeavour',
    name: 'Rocks at Endeavour Crater',
    location: 'Endeavour Crater, about 22 km (13 miles) wide',
    observation: 'Opportunity discovered strong indications at Endeavour Crater of the action of ancient water.',
    properties: ['Reached after years of driving', 'Older rocks than those near the landing site'],
    verdict: 'water',
    explanation: 'These rocks were changed by water long ago, and they keep a record of that water today.',
    hint: 'What does NASA say these rocks show signs of?',
    sourceId: 'opportunityEnd',
    position: { x: 82, y: 40 },
  },
  {
    id: 'eagle',
    name: 'The small crater where it landed',
    location: 'Eagle crater, Meridiani Planum',
    observation: 'Opportunity came to rest inside a small impact crater called Eagle.',
    properties: ['Type: impact crater (made when something struck the ground)', 'Its walls exposed bedrock to study'],
    verdict: 'not-clear',
    explanation: 'True, and lucky! The crater walls gave the rover rocks to study. But the crater itself only tells us where it landed, not whether water was there.',
    hint: 'A crater is made by an impact. Does an impact need water?',
    sourceId: 'merOpportunity',
    position: { x: 34, y: 82 },
  },
];

export function evaluateSample(id: string, verdict: Verdict): { correct: boolean; message: string } {
  const s = SAMPLES.find(x => x.id === id);
  if (!s) return { correct: false, message: 'Pick a sample first.' };
  return s.verdict === verdict ? { correct: true, message: s.explanation } : { correct: false, message: s.hint };
}

/** All samples classified correctly? `decisions` holds the learner's latest verdict for each sample. */
export function evidenceSolved(decisions: Record<string, Verdict | undefined>): boolean {
  return SAMPLES.every(s => decisions[s.id] === s.verdict);
}

export const REFERENCE_VERDICTS: Record<string, Verdict> = Object.fromEntries(SAMPLES.map(s => [s.id, s.verdict]));

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
/* InSight — "Listen to the Heart of Mars" (synthetic seismograms)      */
/* ------------------------------------------------------------------ */

export type WaveCaseId = 'quiet' | 'event' | 'wind';

export type WaveCase = {
  id: WaveCaseId;
  label: string;
  description: string;
  suddenStart: boolean;
  secondArrival: boolean;
  shape: string;
  feedback: string;
};

export const WAVE_CASES: WaveCase[] = [
  {
    id: 'quiet',
    label: 'Trace A',
    description: 'A thin, steady line with only tiny wiggles the whole time.',
    suddenStart: false,
    secondArrival: false,
    shape: 'Flat and calm throughout',
    feedback: 'This trace stays calm the whole time: a quiet stretch with nothing much happening. Look for a trace with a clear beginning.',
  },
  {
    id: 'event',
    label: 'Trace B',
    description: 'Calm, then a sudden first jolt, then a second, bigger arrival that slowly fades.',
    suddenStart: true,
    secondArrival: true,
    shape: 'Calm → sharp start → bigger second arrival → slow fade',
    feedback: 'Yes! A sharp start, a second arrival and a slow fade are the pattern seismologists look for in a quake or impact.',
  },
  {
    id: 'wind',
    label: 'Trace C',
    description: 'Messy bursts of shaking scattered across the whole record, with no clear start.',
    suddenStart: false,
    secondArrival: false,
    shape: 'Irregular bursts that come and go',
    feedback: 'Lots of shaking, but no clear start and no second arrival. Bursts like this look more like wind or other noise. Hint: a quake begins suddenly.',
  },
];

export const EVENT_CASE_ID: WaveCaseId = 'event';

/** Where the two arrivals start in the synthetic event trace (fraction of trace width). */
export const EVENT_ARRIVALS = { p: 0.28, s: 0.52 } as const;

function evaluateWaveChoice(id: string | null): { correct: boolean; feedback: string } {
  const c = WAVE_CASES.find(w => w.id === id);
  if (!c) return { correct: false, feedback: 'Choose one of the traces.' };
  return { correct: c.id === EVENT_CASE_ID, feedback: c.feedback };
}

export const GAP_CHOICES: Choice[] = [
  {
    id: 'farther',
    label: 'Farther away',
    correct: true,
    feedback: 'Right. The first (P) wave is faster than the second (S) wave, so the longer they travel, the bigger the gap grows.',
  },
  {
    id: 'closer',
    label: 'Closer',
    correct: false,
    feedback: 'Not quite. Think of two runners at different speeds: the longer the race, the bigger the gap at the finish. The same is true for the two waves.',
  },
];

export const LAYER_CHOICES: Choice[] = [
  {
    id: 'layers',
    label: 'Where the boundaries between layers are, and how deep they lie',
    correct: true,
    feedback: 'Yes! Waves speed up, slow down, bend and bounce at boundaries. Timing many of them lets scientists map layers they can never see.',
  },
  {
    id: 'color',
    label: 'What color the rocks are deep inside',
    correct: false,
    feedback: 'Seismic waves do not carry color. They carry timing: when they arrive and how they change. Hint: think about what changes when a wave meets a new layer.',
  },
  {
    id: 'weather',
    label: 'What the weather was like during the quake',
    correct: false,
    feedback: 'Wind can add noise to a seismometer, but scientists try to remove it. Hint: the useful signal traveled through the planet, not the air.',
  },
];

export function insightGatePassed(waveChoice: string | null, gapChoice: string | null, layerChoice: string | null): boolean {
  return evaluateWaveChoice(waveChoice).correct && evaluateChoice(GAP_CHOICES, gapChoice).correct && evaluateChoice(LAYER_CHOICES, layerChoice).correct;
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

/** SYNTHETIC illustrative trace, values in [-1, 1]. Not a NASA recording. */
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

/** Largest absolute value in a synthetic trace, as a whole percentage of full scale. */
export function peakPercent(values: number[]): number {
  return Math.round(100 * values.reduce((m, v) => Math.max(m, Math.abs(v)), 0));
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
/* Voyager — status matching + Golden Record explorer                   */
/* ------------------------------------------------------------------ */

export type MatchItem = { id: string; label: string; answer: MissionStatus; explanation: string; hint: string };

export const MATCH_ITEMS: MatchItem[] = [
  {
    id: 'apollo11',
    label: 'Apollo 11 laser reflector',
    answer: 'passive-still-useful',
    explanation: 'No power and no radio, yet it still returns laser light that scientists can time.',
    hint: 'Does this one need power to do its job?',
  },
  {
    id: 'opportunity',
    label: 'Opportunity rover',
    answer: 'mission-ended',
    explanation: 'Fell silent in the 2018 dust storm; NASA ended the mission in February 2019.',
    hint: 'Remember what the 2018 dust storm did to its solar panels.',
  },
  {
    id: 'insight',
    label: 'InSight lander',
    answer: 'mission-ended',
    explanation: 'Ran out of power; last contact on Dec. 15, 2022.',
    hint: 'When did InSight last call home?',
  },
  {
    id: 'voyager',
    label: 'Voyager 1',
    answer: 'extended-mission',
    explanation: 'Still traveling through interstellar space and still sending data home.',
    hint: 'Is this machine still sending data to Earth today?',
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
  MATCH_ITEMS.map(m => [m.id, m.answer]),
);

export type RecordItem = { id: string; title: string; fact: string };

/** Verified against https://science.nasa.gov/mission/voyager/golden-record-contents/ */
export const GOLDEN_RECORD_ITEMS: RecordItem[] = [
  { id: 'images', title: 'Pictures', fact: '115 images, assembled by Carl Sagan and his associates, showing life and science on Earth.' },
  { id: 'greetings', title: 'Greetings', fact: 'Spoken greetings from people on Earth in fifty-five languages.' },
  { id: 'sounds', title: 'Sounds of Earth', fact: 'Natural sounds such as surf, wind and thunder, birds and whales.' },
  { id: 'music', title: 'Music', fact: 'An eclectic 90-minute selection of music.' },
  { id: 'cover', title: 'The cover', fact: 'Instructions in symbolic language explain where the spacecraft came from and how to play the record.' },
];

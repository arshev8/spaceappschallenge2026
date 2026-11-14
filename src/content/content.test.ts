import { describe, expect, it } from 'vitest';
import {
  APOLLO_TARGETS,
  AVERAGE_EARTH_MOON_KM,
  FORMULA_CHOICES,
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
} from './experiments.ts';
import { runIntegrityChecks, simulateChapter } from './integrity.ts';
import { CHAPTER_IDS } from './missions.ts';

describe('content integrity', () => {
  it('passes every pure integrity check', () => {
    const failed = runIntegrityChecks().filter(r => !r.ok);
    expect(failed).toEqual([]);
  });
  it.each(CHAPTER_IDS)('%s can be played through to its discovery', id => {
    expect(simulateChapter(id).reachedEnd).toBe(true);
  });
});

describe('Apollo 11: Measure the Distance to the Moon', () => {
  it('uses the real round-trip relationship', () => {
    expect(roundTripSeconds(AVERAGE_EARTH_MOON_KM)).toBeCloseTo(2.564, 3);
    expect(computeWithFormula('ct2', roundTripSeconds(250_000))).toBeCloseTo(250_000, 3);
    expect(computeWithFormula('ct', roundTripSeconds(250_000))).toBeCloseTo(500_000, 3);
  });
  it('requires aiming at the reflector, a pulse and the ÷2 formula', () => {
    expect(apolloGatePassed('ground', 1, 'ct2')).toBe(false);
    expect(apolloGatePassed('reflector', 0, 'ct2')).toBe(false);
    expect(apolloGatePassed('reflector', 1, 'ct')).toBe(false);
    expect(apolloGatePassed('reflector', 1, 'ct2')).toBe(true);
  });
  it('has exactly one correct option per step, each wrong option with a hint', () => {
    for (const list of [APOLLO_TARGETS, FORMULA_CHOICES]) {
      expect(list.filter(c => c.correct)).toHaveLength(1);
      list.filter(c => !c.correct).forEach(c => expect(c.feedback).toMatch(/hint|try/i));
    }
  });
});

describe('Opportunity: Follow the Water', () => {
  it('is solved only when every sample has the right verdict', () => {
    expect(evidenceSolved({})).toBe(false);
    expect(evidenceSolved({ ...REFERENCE_VERDICTS, spherules: 'water' })).toBe(false);
    expect(evidenceSolved(REFERENCE_VERDICTS)).toBe(true);
  });
  it('explains correct verdicts and gives hints for wrong ones', () => {
    for (const s of SAMPLES) {
      expect(evaluateSample(s.id, s.verdict)).toEqual({ correct: true, message: s.explanation });
      const wrong = s.verdict === 'water' ? 'not-clear' : 'water';
      expect(evaluateSample(s.id, wrong)).toEqual({ correct: false, message: s.hint });
    }
  });
  it('needs the dust model explored too', () => {
    expect(opportunityGatePassed(true, 0)).toBe(false);
    expect(opportunityGatePassed(true, 10)).toBe(true);
  });
});

describe('InSight: Marsquake Investigator', () => {
  it('needs the event trace, the gap reasoning and the layer reasoning', () => {
    expect(insightGatePassed('wind', 'farther', 'layers')).toBe(false);
    expect(insightGatePassed('event', 'closer', 'layers')).toBe(false);
    expect(insightGatePassed('event', 'farther', 'color')).toBe(false);
    expect(insightGatePassed('event', 'farther', 'layers')).toBe(true);
  });
});

describe('Voyager: status matching', () => {
  it('scores partial answers', () => {
    const r = evaluateMatches({ apollo11: 'passive-still-useful', opportunity: 'mission-ended', insight: 'extended-mission', voyager: 'extended-mission' });
    expect(r.score).toBe(3);
    expect(r.correct).toBe(false);
  });
});

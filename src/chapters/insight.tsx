import { useMemo, useState } from 'react';
import {
  EVENT_ARRIVALS,
  EVENT_CASE_ID,
  GAP_CHOICES,
  WAVE_CASES,
  evaluateGapChoice,
  evaluateWaveChoice,
  insightGatePassed,
  syntheticWaveform,
  waveformPath,
} from '../content/experiments.ts';
import { MISSIONS } from '../content/missions.ts';
import { ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

const TRACE_W = 400;
const TRACE_H = 70;

export default function InSightChapter({ onComplete, onBack }: ChapterProps) {
  const [waveChoice, setWaveChoice] = useState<string | null>(null);
  const [gapChoice, setGapChoice] = useState<string | null>(null);
  const solved = insightGatePassed(waveChoice, gapChoice);
  const flow = useChapterFlow('insight', () => solved);
  const waveCorrect = waveChoice !== null && evaluateWaveChoice(waveChoice).correct;

  return (
    <ChapterFrame
      id="insight"
      kicker="Chapter 3 · Mars"
      theme="mars"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint={waveCorrect ? 'Answer the wave-gap question to continue.' : 'Pick the trace that shows an event.'}
    >
      {flow.scene.kind === 'hook' && <LanderArt />}
      {flow.scene.kind === 'experiment' && (
        <>
          <IllustrativeBadge>Synthetic illustrative seismograms — not real NASA measurements or recordings.</IllustrativeBadge>
          <TracePicker choice={waveChoice} onChoose={setWaveChoice} />
          {waveCorrect && <GapQuestion choice={gapChoice} onChoose={setGapChoice} />}
        </>
      )}
      {flow.scene.kind === 'reveal' && (
        <>
          <InteriorArt />
          <Timeline entries={MISSIONS.insight.chronology} />
          <p className="ec-muted ec-small">
            Marsquake count and interior science: <SourceLink id="insightRetired" />.
          </p>
        </>
      )}
    </ChapterFrame>
  );
}

function TracePicker({ choice, onChoose }: { choice: string | null; onChoose: (id: string) => void }) {
  const paths = useMemo(
    () => Object.fromEntries(WAVE_CASES.map((w) => [w.id, waveformPath(syntheticWaveform(w.id), TRACE_W, TRACE_H)])),
    [],
  );
  const result = choice ? evaluateWaveChoice(choice) : null;

  return (
    <div className="ec-panel">
      <fieldset>
        <legend>1 · Which trace most likely shows a marsquake or an impact?</legend>
        <ul className="ec-choice-list">
          {WAVE_CASES.map((w) => (
            <li key={w.id}>
              <label className="ec-choice">
                <input
                  type="radio"
                  name="insight-trace"
                  value={w.id}
                  checked={choice === w.id}
                  onChange={() => onChoose(w.id)}
                />
                <span className="ec-choice-text">
                  <strong>{w.label}</strong>
                  <span>{w.description}</span>
                  <svg
                    className="ec-trace"
                    viewBox={`0 0 ${TRACE_W} ${TRACE_H}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={paths[w.id]} />
                  </svg>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div aria-live="polite">
        {result && (
          <p className={`ec-feedback ${result.correct ? 'ec-feedback--ok' : 'ec-feedback--try'}`}>
            {result.correct ? '✓ ' : 'Not quite: '}
            {result.feedback}
          </p>
        )}
      </div>
    </div>
  );
}

function GapQuestion({ choice, onChoose }: { choice: string | null; onChoose: (id: string) => void }) {
  const path = useMemo(() => waveformPath(syntheticWaveform(EVENT_CASE_ID), TRACE_W, 140), []);
  const pX = EVENT_ARRIVALS.p * TRACE_W;
  const sX = EVENT_ARRIVALS.s * TRACE_W;
  const result = choice ? evaluateGapChoice(choice) : null;

  return (
    <div className="ec-panel">
      <h4>2 · Two arrivals</h4>
      <p className="ec-body">
        A quake sends out different kinds of waves. <strong>P waves</strong> (primary) travel fastest and arrive first.{' '}
        <strong>S waves</strong> (secondary) are slower and arrive later.
      </p>
      <svg
        className="ec-trace ec-trace--large"
        viewBox={`0 0 ${TRACE_W} 140`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Synthetic seismogram of Trace B with the first arrival (P wave) and second arrival (S wave) marked, and the time gap between them."
      >
        <path d={path} />
        <line x1={pX} y1="8" x2={pX} y2="132" stroke="var(--ec-accent)" strokeDasharray="4 4" />
        <line x1={sX} y1="8" x2={sX} y2="132" stroke="var(--ec-warn)" strokeDasharray="4 4" />
        <line x1={pX} y1="14" x2={sX} y2="14" stroke="currentColor" />
      </svg>
      <p className="ec-small ec-muted">
        <span style={{ color: 'var(--ec-accent)' }}>Teal line:</span> P wave arrives ·{' '}
        <span style={{ color: 'var(--ec-warn)' }}>Yellow line:</span> S wave arrives · The bar on top is the gap
        between them.
      </p>
      <fieldset>
        <legend>If the gap between the P and S arrivals were bigger, the event happened…</legend>
        <ul className="ec-choice-list">
          {GAP_CHOICES.map((g) => (
            <li key={g.id}>
              <label className="ec-choice">
                <input
                  type="radio"
                  name="insight-gap"
                  value={g.id}
                  checked={choice === g.id}
                  onChange={() => onChoose(g.id)}
                />
                <span className="ec-choice-text">
                  <strong>{g.label}</strong>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div aria-live="polite">
        {result && (
          <p className={`ec-feedback ${result.correct ? 'ec-feedback--ok' : 'ec-feedback--try'}`}>
            {result.correct ? '✓ ' : 'Try again: '}
            {result.feedback}
          </p>
        )}
      </div>
    </div>
  );
}

function LanderArt() {
  return (
    <>
      <svg
        className="ec-art"
        viewBox="0 0 400 200"
        role="img"
        aria-label="Illustration: a lander with two round solar panels; a dome-covered seismometer sits on the ground beside it."
      >
        <rect width="400" height="200" fill="#d8a27a" />
        <path d="M0 140 Q120 132 220 138 T400 134 V200 H0Z" fill="#b06a45" />
        <g transform="translate(120 90)">
          <circle cx="0" cy="20" r="30" fill="#2a3d6b" stroke="#9fb4e6" />
          <circle cx="140" cy="20" r="30" fill="#2a3d6b" stroke="#9fb4e6" />
          <rect x="35" y="5" width="70" height="35" rx="4" fill="#e8e0d2" />
          <line x1="45" y1="40" x2="38" y2="55" stroke="#ccc" strokeWidth="3" />
          <line x1="95" y1="40" x2="102" y2="55" stroke="#ccc" strokeWidth="3" />
        </g>
        <path d="M285 140 a20 18 0 0 1 40 0 Z" fill="#cfcfcf" stroke="#999" />
        <text x="305" y="165" textAnchor="middle" fill="#3a1f12" fontSize="11">
          seismometer
        </text>
      </svg>
      <p className="ec-art-caption">Illustration, not a NASA photograph.</p>
    </>
  );
}

function InteriorArt() {
  return (
    <>
      <svg
        className="ec-art"
        viewBox="0 0 400 220"
        role="img"
        aria-label="Simplified diagram: Mars cut open showing a thin crust, a thick mantle and a central core, with curved wave paths from a quake to a lander."
      >
        <circle cx="200" cy="110" r="100" fill="#b65a3a" />
        <circle cx="200" cy="110" r="92" fill="#d9844f" />
        <circle cx="200" cy="110" r="50" fill="#f2c36b" />
        <path d="M120 50 Q200 140 285 60" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 4" />
        <path d="M120 50 Q190 100 245 30" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 4" />
        <text x="320" y="40" fill="currentColor" fontSize="12">
          crust
        </text>
        <text x="320" y="110" fill="currentColor" fontSize="12">
          mantle
        </text>
        <text x="200" y="115" textAnchor="middle" fill="#3a1f12" fontSize="12">
          core
        </text>
      </svg>
      <p className="ec-art-caption">Simplified diagram — layers and wave paths are not to scale.</p>
    </>
  );
}

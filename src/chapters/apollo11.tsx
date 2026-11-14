import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import {
  APOLLO_PUZZLE_CHOICES,
  APOLLO_PUZZLE_SECONDS,
  AVERAGE_EARTH_MOON_KM,
  DISTANCE_SLIDER,
  SPEED_OF_LIGHT_KM_S,
  apolloGatePassed,
  evaluateApolloPuzzle,
  roundTripSeconds,
} from '../content/experiments.ts';
import { MISSIONS } from '../content/missions.ts';
import { ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { prefersReducedMotion, useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

const nf = new Intl.NumberFormat('en-US');

export default function Apollo11Chapter({ onComplete, onBack }: ChapterProps) {
  const [pulses, setPulses] = useState(0);
  const [puzzleChoice, setPuzzleChoice] = useState<string | null>(null);
  const solved = apolloGatePassed(pulses, puzzleChoice);
  const flow = useChapterFlow('apollo11', () => solved);

  return (
    <ChapterFrame
      id="apollo11"
      kicker="Chapter 1 · The Moon"
      theme="moon"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint="Fire at least one pulse and solve the puzzle to continue."
    >
      {flow.scene.kind === 'hook' && <ReflectorArt />}
      {flow.scene.kind === 'problem' && <CornerCubeArt />}
      {flow.scene.kind === 'experiment' && (
        <RangingExperiment
          pulses={pulses}
          onPulse={() => setPulses((n) => n + 1)}
          puzzleChoice={puzzleChoice}
          onPuzzleChoice={setPuzzleChoice}
        />
      )}
      {flow.scene.kind === 'reveal' && (
        <>
          <Timeline entries={MISSIONS.apollo11.chronology} />
          <p className="ec-muted ec-small">
            Reflector details: <SourceLink id="ilrsAp11" />. Moon drift: <SourceLink id="nasaMoonFacts" />.
          </p>
        </>
      )}
    </ChapterFrame>
  );
}

function RangingExperiment({
  pulses,
  onPulse,
  puzzleChoice,
  onPuzzleChoice,
}: {
  pulses: number;
  onPulse: () => void;
  puzzleChoice: string | null;
  onPuzzleChoice: (id: string) => void;
}) {
  const sliderId = useId();
  const [distanceKm, setDistanceKm] = useState(AVERAGE_EARTH_MOON_KM);
  const [firing, setFiring] = useState(false);
  const [lastResult, setLastResult] = useState<{ km: number; seconds: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const rt = roundTripSeconds(distanceKm);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const fire = () => {
    if (firing) return;
    const seconds = rt;
    const km = distanceKm;
    setFiring(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        setFiring(false);
        setLastResult({ km, seconds });
        onPulse();
      },
      prefersReducedMotion() ? 0 : seconds * 1000,
    );
  };

  const puzzle = puzzleChoice ? evaluateApolloPuzzle(puzzleChoice) : null;
  const pulseStyle = { '--ec-duration': `${rt}s`, '--ec-travel': '282px' } as CSSProperties;

  return (
    <>
      <IllustrativeBadge>Educational calculation — not real-time laser data.</IllustrativeBadge>

      <div className="ec-panel">
        <h4>1 · Fire a laser pulse</h4>
        <svg
          className="ec-art"
          viewBox="0 0 400 120"
          role="img"
          aria-label="Diagram: a laser pulse travels from Earth to a reflector on the Moon and back. Not to scale."
        >
          <circle cx="40" cy="60" r="30" fill="#2f6fd6" />
          <path d="M22 50 q10 -12 22 -4 q8 6 18 0" fill="none" stroke="#5fbf6a" strokeWidth="6" strokeLinecap="round" />
          <line x1="70" y1="60" x2="352" y2="60" className="ec-laser-track" strokeWidth="2" />
          <circle cx="372" cy="60" r="20" fill="#cfd3dc" />
          <rect x="352" y="54" width="6" height="12" fill="var(--ec-accent)" />
          {firing && <circle key={pulses} cx="70" cy="60" r="5" className="ec-pulse is-firing" style={pulseStyle} />}
          <text x="40" y="112" textAnchor="middle" fill="currentColor" fontSize="11">
            Earth
          </text>
          <text x="372" y="112" textAnchor="middle" fill="currentColor" fontSize="11">
            Moon
          </text>
          <text x="200" y="20" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.7">
            Not to scale
          </text>
        </svg>

        <label htmlFor={sliderId}>
          Illustrative distance to the reflector: <span className="ec-readout">{nf.format(distanceKm)} km</span>
        </label>
        <input
          id={sliderId}
          className="ec-range"
          type="range"
          min={DISTANCE_SLIDER.min}
          max={DISTANCE_SLIDER.max}
          step={DISTANCE_SLIDER.step}
          value={distanceKm}
          disabled={firing}
          aria-valuetext={`${nf.format(distanceKm)} kilometers`}
          onChange={(e) => setDistanceKm(Number(e.target.value))}
        />
        <div className="ec-row">
          <button type="button" className="ec-btn ec-btn--primary" onClick={fire} disabled={firing}>
            {firing ? 'Pulse traveling…' : 'Fire laser pulse'}
          </button>
          <button
            type="button"
            className="ec-btn"
            onClick={() => setDistanceKm(AVERAGE_EARTH_MOON_KM)}
            disabled={firing}
          >
            Use average Moon distance
          </button>
        </div>
        <p className="ec-formula" aria-label="Formula">
          round-trip time = 2 × distance ÷ c = 2 × {nf.format(distanceKm)} km ÷ {nf.format(SPEED_OF_LIGHT_KM_S)} km/s ≈{' '}
          {rt.toFixed(2)} s
        </p>
        <p aria-live="polite" className={lastResult ? 'ec-feedback ec-feedback--ok' : 'ec-hint'}>
          {lastResult
            ? `The pulse came back after ${lastResult.seconds.toFixed(2)} seconds for ${nf.format(lastResult.km)} km. Longer distance, longer wait!`
            : 'Press “Fire laser pulse” to start.'}
        </p>
        <p className="ec-muted ec-small">
          The often-used average Earth–Moon distance is about {nf.format(AVERAGE_EARTH_MOON_KM)} km, so a round trip takes
          about 2.56 seconds. The real distance changes during each orbit.
        </p>
      </div>

      <div className="ec-panel">
        <fieldset>
          <legend>
            2 · Puzzle: a pulse returns after {APOLLO_PUZZLE_SECONDS} seconds. About how far away is the reflector?
          </legend>
          <ul className="ec-choice-list">
            {APOLLO_PUZZLE_CHOICES.map((c) => (
              <li key={c.id}>
                <label className="ec-choice">
                  <input
                    type="radio"
                    name="apollo-puzzle"
                    value={c.id}
                    checked={puzzleChoice === c.id}
                    onChange={() => onPuzzleChoice(c.id)}
                  />
                  <span className="ec-choice-text">
                    <strong>{c.label}</strong>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <div aria-live="polite">
          {puzzle && (
            <p className={`ec-feedback ${puzzle.correct ? 'ec-feedback--ok' : 'ec-feedback--try'}`}>
              {puzzle.correct ? '✓ ' : 'Try again: '}
              {puzzle.feedback}
            </p>
          )}
          {puzzle?.correct && pulses === 0 && (
            <p className="ec-hint">Now fire at least one pulse above to see the timing for yourself.</p>
          )}
        </div>
      </div>
    </>
  );
}

function ReflectorArt() {
  return (
    <>
      <svg
        className="ec-art"
        viewBox="0 0 400 200"
        role="img"
        aria-label="Illustration: a flat panel of round reflectors tilted toward Earth, sitting on the grey lunar surface."
      >
        <rect width="400" height="200" fill="#0b1226" />
        <circle cx="330" cy="45" r="22" fill="#2f6fd6" />
        <path d="M0 150 Q100 130 200 145 T400 140 V200 H0Z" fill="#8a8f99" />
        <g transform="translate(140 95) rotate(-12)">
          <rect width="120" height="60" rx="4" fill="#6d7380" stroke="#c9ced8" />
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={10 + (i % 10) * 11} cy={12 + Math.floor(i / 10) * 18} r="4.5" fill="#bfe9ff" opacity="0.85" />
          ))}
        </g>
        <line x1="200" y1="140" x2="200" y2="160" stroke="#c9ced8" strokeWidth="3" />
      </svg>
      <p className="ec-art-caption">Illustration, not a photograph. The real array holds 100 reflectors.</p>
    </>
  );
}

function CornerCubeArt() {
  return (
    <>
      <svg
        className="ec-art"
        viewBox="0 0 400 180"
        role="img"
        aria-label="Diagram: a light ray enters a corner of three mirrors, bounces, and leaves parallel to how it arrived."
      >
        <path d="M120 50 L200 130 L280 50" fill="none" stroke="var(--ec-accent)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M170 10 L170 100 L230 100" fill="none" stroke="#ff6b6b" strokeWidth="3" />
        <path d="M230 100 L230 10" fill="none" stroke="#ff9c9c" strokeWidth="3" strokeDasharray="6 5" />
        <path d="M164 30 L170 42 L176 30" fill="none" stroke="#ff6b6b" strokeWidth="3" />
        <path d="M224 42 L230 30 L236 42" fill="none" stroke="#ff9c9c" strokeWidth="3" />
        <text x="160" y="24" textAnchor="end" fill="currentColor" fontSize="12">
          light in
        </text>
        <text x="240" y="24" fill="currentColor" fontSize="12">
          light out, back the way it came
        </text>
        <text x="200" y="160" textAnchor="middle" fill="currentColor" fontSize="11" opacity="0.8">
          two mirrors at a right angle (real corner-cubes use three)
        </text>
      </svg>
      <p className="ec-art-caption">Simplified 2-D diagram of a corner reflector.</p>
    </>
  );
}

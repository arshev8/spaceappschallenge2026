import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import {
  APOLLO_TARGETS,
  AVERAGE_EARTH_MOON_KM,
  DISTANCE_SLIDER,
  FORMULA_CHOICES,
  SPEED_OF_LIGHT_KM_S,
  apolloGatePassed,
  computeWithFormula,
  evaluateChoice,
  roundTripSeconds,
  type Measurement,
} from '../content/experiments.ts';
import { MISSIONS } from '../content/missions.ts';
import { Art, ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { ChoiceList, Feedback, Stage } from './shared/GameParts.tsx';
import { prefersReducedMotion, useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

const nf = new Intl.NumberFormat('en-US');
const km = (n: number) => `${nf.format(Math.round(n))} km`;

export default function Apollo11Chapter({ onComplete, onBack }: ChapterProps) {
  const [target, setTarget] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [formula, setFormula] = useState<string | null>(null);
  const solved = apolloGatePassed(target, measurements.length, formula);
  const flow = useChapterFlow('apollo11', () => solved);
  const kind = flow.scene.kind;

  return (
    <ChapterFrame
      id="apollo11"
      kicker="Chapter 01 · The Moon"
      theme="moon"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint="Aim, fire at least one pulse and choose the right calculation to continue."
      visual={kind === 'hook' ? <ReflectorArt /> : kind === 'problem' ? <CornerCubeArt /> : kind === 'reveal' ? <RangingStationArt /> : undefined}
    >
      {kind === 'experiment' && (
        <LaserGame
          target={target}
          onTarget={setTarget}
          measurements={measurements}
          onMeasure={(m) => setMeasurements((list) => [...list, { ...m, shot: list.length + 1 }])}
          formula={formula}
          onFormula={setFormula}
        />
      )}
      {kind === 'reveal' && (
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

function LaserGame({
  target,
  onTarget,
  measurements,
  onMeasure,
  formula,
  onFormula,
}: {
  target: string | null;
  onTarget: (id: string) => void;
  measurements: Measurement[];
  onMeasure: (m: Omit<Measurement, 'shot'>) => void;
  formula: string | null;
  onFormula: (id: string) => void;
}) {
  const aimed = evaluateChoice(APOLLO_TARGETS, target).correct;
  const formulaResult = formula ? evaluateChoice(FORMULA_CHOICES, formula) : null;
  const last = measurements[measurements.length - 1];

  return (
    <div className="ec-game">
      <IllustrativeBadge>Educational calculation: the physics is real, the distances are values you choose. This is not live laser data.</IllustrativeBadge>

      <Stage number={1} title="Aim the telescope" done={aimed}>
        <ChoiceList
          name="apollo-target"
          legend="Where should the laser point?"
          choices={APOLLO_TARGETS}
          value={target}
          onChange={onTarget}
        />
        <Feedback ok={aimed}>{target && evaluateChoice(APOLLO_TARGETS, target).feedback}</Feedback>
      </Stage>

      <Stage number={2} title="Fire a pulse and time it" done={measurements.length > 0} locked={!aimed} lockedText="Aim at the reflector first.">
        <FireControl disabled={!aimed} onMeasure={onMeasure} lastMeasurement={last} />
      </Stage>

      <Stage number={3} title="Turn time into distance" done={Boolean(formulaResult?.correct)} locked={!last} lockedText="Fire at least one pulse first.">
        <ChoiceList
          name="apollo-formula"
          legend={last ? `Your pulse took ${last.roundTripS.toFixed(3)} seconds there and back. Which calculation gives the distance to the reflector?` : 'Which calculation gives the distance?'}
          choices={FORMULA_CHOICES}
          value={formula}
          onChange={onFormula}
          disabled={!last}
          mono
        />
        <Feedback ok={Boolean(formulaResult?.correct)}>
          {formula && last && formulaResult && (<>
            <span className="ec-formula-line">
              {FORMULA_CHOICES.find((c) => c.id === formula)?.label.replace('distance = ', '')} →{' '}
              <strong>{formatResult(computeWithFormula(formula, last.roundTripS), formula)}</strong>
            </span>
            {formulaResult.feedback}
            {formulaResult.correct && ` Your answer matches the ${km(last.distanceKm)} you set.`}
          </>)}
        </Feedback>
      </Stage>

      {measurements.length > 0 && <MeasurementLog measurements={measurements} showDistance={Boolean(formulaResult?.correct)} />}
    </div>
  );
}

function formatResult(value: number | null, formula: string): string {
  if (value === null) return '—';
  if (formula === 'c_t') return `${nf.format(Math.round(value))} (not a distance)`;
  return km(value);
}

function FireControl({
  disabled,
  onMeasure,
  lastMeasurement,
}: {
  disabled: boolean;
  onMeasure: (m: Omit<Measurement, 'shot'>) => void;
  lastMeasurement?: Measurement;
}) {
  const sliderId = useId();
  const [distanceKm, setDistanceKm] = useState(AVERAGE_EARTH_MOON_KM);
  const [firing, setFiring] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [textView, setTextView] = useState(() => prefersReducedMotion());
  const timer = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);
  const rt = roundTripSeconds(distanceKm);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const fire = () => {
    if (firing || disabled) return;
    const seconds = rt;
    const dist = distanceKm;
    const instant = textView || prefersReducedMotion();
    const finish = () => {
      setFiring(false);
      setElapsed(seconds);
      onMeasure({ distanceKm: dist, roundTripS: seconds });
    };
    if (instant) {
      finish();
      return;
    }
    setFiring(true);
    setElapsed(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1000, seconds);
      setElapsed(t);
      if (t < seconds) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    timer.current = window.setTimeout(finish, seconds * 1000);
  };

  const pulseStyle = { '--ec-duration': `${rt}s`, '--ec-travel': '262px' } as CSSProperties;
  const phase = !firing ? 'idle' : elapsed < rt / 2 ? 'outbound' : 'return';

  return (
    <>
      <div className="ec-row ec-row--between">
        <label htmlFor={sliderId} className="ec-label">
          Distance to the reflector (your choice): <span className="ec-readout">{km(distanceKm)}</span>
        </label>
        <button type="button" className="ec-btn ec-btn--small" aria-pressed={textView} onClick={() => setTextView((v) => !v)}>
          {textView ? 'Show animated diagram' : 'Show text-only view'}
        </button>
      </div>
      <input
        id={sliderId}
        className="ec-range"
        type="range"
        min={DISTANCE_SLIDER.min}
        max={DISTANCE_SLIDER.max}
        step={DISTANCE_SLIDER.step}
        value={distanceKm}
        disabled={firing || disabled}
        aria-valuetext={`${nf.format(distanceKm)} kilometers`}
        onChange={(e) => setDistanceKm(Number(e.target.value))}
      />
      <div className="ec-row">
        <button type="button" className="ec-btn ec-btn--primary" onClick={fire} disabled={firing || disabled}>
          {firing ? 'Pulse traveling…' : 'Fire laser pulse'}
        </button>
        <button type="button" className="ec-btn" onClick={() => setDistanceKm(AVERAGE_EARTH_MOON_KM)} disabled={firing || disabled}>
          Use average Moon distance (384,400 km)
        </button>
      </div>

      {textView ? (
        <ol className="ec-sequence" aria-label="Measurement sequence">
          <li>Laser fires toward the reflector at <strong>0.000 s</strong>.</li>
          <li>Light reaches the reflector after <strong>{(rt / 2).toFixed(3)} s</strong> ({km(distanceKm)} one way).</li>
          <li>Corner-cubes send it straight back toward the telescope.</li>
          <li>Detector catches the returning light at <strong>{rt.toFixed(3)} s</strong>.</li>
        </ol>
      ) : (
        <svg className="ec-art ec-laser" viewBox="0 0 400 130" role="img" aria-label={`Diagram, not to scale: Earth on the left, the Moon on the right. ${firing ? (phase === 'outbound' ? 'The pulse is traveling to the Moon.' : 'The pulse is returning to Earth.') : 'Ready to fire.'}`}>
          <circle cx="48" cy="62" r="32" className="ec-earth" />
          <path d="M28 52q10-10 20-4t22-2M30 76q12 6 26-2" className="ec-earth-land" />
          <line x1="80" y1="62" x2="342" y2="62" className="ec-laser-track" />
          <circle cx="360" cy="62" r="22" className="ec-moon" />
          <rect x="336" y="55" width="7" height="14" rx="1" className="ec-reflector" />
          {firing && <circle key={String(lastMeasurement?.shot ?? 0) + distanceKm} cx="80" cy="62" r="5" className="ec-pulse is-firing" style={pulseStyle} />}
          <text x="48" y="116" textAnchor="middle" className="ec-svg-label">EARTH</text>
          <text x="360" y="116" textAnchor="middle" className="ec-svg-label">MOON</text>
          <text x="211" y="20" textAnchor="middle" className="ec-svg-note">not to scale</text>
        </svg>
      )}

      <div className="ec-readouts">
        <div>
          <span className="ec-readout-label">Stopwatch</span>
          <span className="ec-readout-big" aria-hidden="true">{(firing ? elapsed : lastMeasurement?.roundTripS ?? 0).toFixed(3)} s</span>
        </div>
        <div>
          <span className="ec-readout-label">Prediction</span>
          <span className="ec-readout-big">{rt.toFixed(3)} s</span>
        </div>
      </div>
      <p aria-live="polite" className="ec-status-line">
        {firing
          ? 'Pulse fired. Waiting for the light to come back…'
          : lastMeasurement
            ? `Return detected! Shot ${lastMeasurement.shot}: the light came back after ${lastMeasurement.roundTripS.toFixed(3)} seconds for ${km(lastMeasurement.distanceKm)}.`
            : 'Ready. Choose a distance and fire.'}
      </p>
    </>
  );
}

function MeasurementLog({ measurements, showDistance }: { measurements: Measurement[]; showDistance: boolean }) {
  return (
    <div className="ec-table-wrap" role="region" aria-label="Measurement log (scrolls sideways on small screens)" tabIndex={0}>
      <table className="ec-table">
        <caption>Measurement log (educational values)</caption>
        <thead>
          <tr>
            <th scope="col">Shot</th>
            <th scope="col">Distance you set</th>
            <th scope="col">Round-trip time</th>
            <th scope="col">Calculated distance (c × t ÷ 2)</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m) => (
            <tr key={m.shot}>
              <th scope="row">{m.shot}</th>
              <td>{km(m.distanceKm)}</td>
              <td>{m.roundTripS.toFixed(3)} s</td>
              <td>{showDistance ? km((SPEED_OF_LIGHT_KM_S * m.roundTripS) / 2) : 'Solve step 3'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReflectorArt() {
  return (
    <Art caption="Illustration, not a photograph. The real array holds 100 reflectors." decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label="Line illustration: a flat panel of round reflectors tilted toward a distant Earth, on the grey lunar surface.">
        <circle cx="262" cy="46" r="18" className="ec-earth" />
        <path d="M0 168q70-16 150-6t170-8v66H0Z" className="ec-ground" />
        <g transform="translate(78 92) rotate(-14)">
          <rect width="150" height="72" rx="3" className="ec-panel-shape" />
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={10 + (i % 10) * 14.5} cy={12 + Math.floor(i / 10) * 16} r="5" className="ec-cube" />
          ))}
        </g>
        <path d="M150 162v16m-30-4 30-14 30 14" className="ec-leg" />
        <path d="M150 104 255 54" className="ec-beam" />
      </svg>
    </Art>
  );
}

function CornerCubeArt() {
  return (
    <Art caption="Simplified 2-D diagram of a corner reflector.">
      <svg className="ec-art ec-lineart" viewBox="0 0 400 180" role="img" aria-label="Diagram: a light ray enters a corner of two mirrors at a right angle, bounces twice, and leaves parallel to how it arrived.">
        <path d="M120 50 L200 130 L280 50" className="ec-mirror" />
        <path d="M170 10 L170 100 L230 100" className="ec-ray" />
        <path d="M230 100 L230 10" className="ec-ray ec-ray--out" />
        <path d="M164 30 L170 42 L176 30" className="ec-ray" />
        <path d="M224 42 L230 30 L236 42" className="ec-ray ec-ray--out" />
        <text x="160" y="24" textAnchor="end" className="ec-svg-label">LIGHT IN</text>
        <text x="240" y="24" className="ec-svg-label">LIGHT OUT, SAME DIRECTION BACK</text>
        <text x="200" y="162" textAnchor="middle" className="ec-svg-note">two mirrors at a right angle (real corner-cubes use three)</text>
      </svg>
    </Art>
  );
}

function RangingStationArt() {
  return (
    <Art caption="Simplified diagram of a laser ranging station, not a specific observatory.">
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label="Diagram: a telescope dome on Earth sends a laser beam up toward the Moon, with a clock and detector beside it.">
        <path d="M30 190h260" className="ec-leg" />
        <path d="M70 190v-40a50 50 0 0 1 100 0v40Z" className="ec-panel-shape" />
        <path d="M120 140 250 40" className="ec-beam" />
        <circle cx="262" cy="34" r="20" className="ec-moon" />
        <rect x="196" y="150" width="70" height="40" rx="4" className="ec-panel-shape" />
        <text x="231" y="175" textAnchor="middle" className="ec-svg-label">2.564 s</text>
        <text x="120" y="210" textAnchor="middle" className="ec-svg-note">telescope + laser</text>
        <text x="231" y="210" textAnchor="middle" className="ec-svg-note">precise clock</text>
      </svg>
    </Art>
  );
}

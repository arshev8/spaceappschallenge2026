import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import {
  AVERAGE_EARTH_MOON_KM,
  DISTANCE_SLIDER,
  SPEED_OF_LIGHT_KM_S,
  apolloGatePassed,
  computeWithFormula,
  evaluateChoice,
  roundTripSeconds,
  type Measurement,
} from '../content/experiments.ts';
import { useContent } from '../content/useContent.ts';
import { formatNumber, useT, type Locale, type T } from '../i18n';
import { Art, ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { ChoiceList, Feedback, Stage } from './shared/GameParts.tsx';
import { prefersReducedMotion, useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

const kmText = (n: number, t: T, locale: Locale) => `${formatNumber(Math.round(n), locale)} ${t('common.km')}`;
const sec = (s: number, locale: Locale) => formatNumber(s, locale, 3);

export default function Apollo11Chapter({ onComplete, onBack }: ChapterProps) {
  const { t } = useT();
  const content = useContent();
  const [target, setTarget] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [formula, setFormula] = useState<string | null>(null);
  const solved = apolloGatePassed(target, measurements.length, formula);
  const flow = useChapterFlow(content.scripts.apollo11, () => solved);
  const kind = flow.scene.kind;

  return (
    <ChapterFrame
      id="apollo11"
      kicker={t('apollo.kicker')}
      theme="moon"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint={t('apollo.gate')}
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
          <Timeline entries={content.missions.apollo11.chronology} />
          <p className="ec-muted ec-small">
            {t('apollo.reflectorDetails')} <SourceLink id="ilrsAp11" />. {t('apollo.moonDrift')} <SourceLink id="nasaMoonFacts" />.
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
  const { t, locale } = useT();
  const content = useContent();
  const aim = evaluateChoice(content.targets, target);
  const formulaResult = formula ? evaluateChoice(content.formulas, formula) : null;
  const last = measurements[measurements.length - 1];

  const formatResult = (value: number | null, id: string) => {
    if (value === null) return '—';
    if (id === 'c_t') return t('apollo.notDistance', { value: formatNumber(Math.round(value), locale) });
    return kmText(value, t, locale);
  };

  return (
    <div className="ec-game">
      <IllustrativeBadge>{t('apollo.badge')}</IllustrativeBadge>

      <Stage number={1} title={t('apollo.stage1')} done={aim.correct}>
        <ChoiceList name="apollo-target" legend={t('apollo.aimLegend')} choices={content.targets} value={target} onChange={onTarget} />
        <Feedback ok={aim.correct}>{target && aim.feedback}</Feedback>
      </Stage>

      <Stage number={2} title={t('apollo.stage2')} done={measurements.length > 0} locked={!aim.correct} lockedText={t('apollo.lockAim')}>
        <FireControl disabled={!aim.correct} onMeasure={onMeasure} lastMeasurement={last} />
      </Stage>

      <Stage number={3} title={t('apollo.stage3')} done={Boolean(formulaResult?.correct)} locked={!last} lockedText={t('apollo.lockFire')}>
        <ChoiceList
          name="apollo-formula"
          legend={last ? t('apollo.formulaLegend', { seconds: sec(last.roundTripS, locale) }) : t('apollo.formulaLegendEmpty')}
          choices={content.formulas}
          value={formula}
          onChange={onFormula}
          disabled={!last}
          mono
        />
        <Feedback ok={Boolean(formulaResult?.correct)}>
          {formula && last && formulaResult && (
            <>
              <span className="ec-formula-line">
                {content.formulas.find((c) => c.id === formula)?.label} → <strong>{formatResult(computeWithFormula(formula, last.roundTripS), formula)}</strong>
              </span>
              {formulaResult.feedback}
              {formulaResult.correct && ` ${t('apollo.matches', { distance: kmText(last.distanceKm, t, locale) })}`}
            </>
          )}
        </Feedback>
      </Stage>

      {measurements.length > 0 && <MeasurementLog measurements={measurements} showDistance={Boolean(formulaResult?.correct)} />}
    </div>
  );
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
  const { t, locale } = useT();
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
    const finish = () => {
      setFiring(false);
      setElapsed(seconds);
      onMeasure({ distanceKm: dist, roundTripS: seconds });
    };
    if (textView || prefersReducedMotion()) {
      finish();
      return;
    }
    setFiring(true);
    setElapsed(0);
    const start = performance.now();
    const tick = (now: number) => {
      const tt = Math.min((now - start) / 1000, seconds);
      setElapsed(tt);
      if (tt < seconds) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    timer.current = window.setTimeout(finish, seconds * 1000);
  };

  const pulseStyle = { '--ec-duration': `${rt}s`, '--ec-travel': '262px' } as CSSProperties;
  const phase = !firing ? 'idle' : elapsed < rt / 2 ? 'outbound' : 'return';
  const secT = (s: number) => t('apollo.seconds', { t: sec(s, locale) });

  return (
    <>
      <div className="ec-row ec-row--between">
        <label htmlFor={sliderId} className="ec-label">
          {t('apollo.distanceLabel')} <span className="ec-readout">{kmText(distanceKm, t, locale)}</span>
        </label>
        <button type="button" className="ec-btn ec-btn--small" aria-pressed={textView} onClick={() => setTextView((v) => !v)}>
          {textView ? t('apollo.showAnimated') : t('apollo.showText')}
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
        aria-valuetext={t('apollo.kmValue', { n: formatNumber(distanceKm, locale) })}
        onChange={(e) => setDistanceKm(Number(e.target.value))}
      />
      <div className="ec-row">
        <button type="button" className="ec-btn ec-btn--primary" onClick={fire} disabled={firing || disabled}>
          {firing ? t('apollo.traveling') : t('apollo.fire')}
        </button>
        <button type="button" className="ec-btn" onClick={() => setDistanceKm(AVERAGE_EARTH_MOON_KM)} disabled={firing || disabled}>
          {t('apollo.useAverage', { distance: kmText(AVERAGE_EARTH_MOON_KM, t, locale) })}
        </button>
      </div>

      {textView ? (
        <ol className="ec-sequence" aria-label={t('apollo.sequence')}>
          <li>{t('apollo.seq1', { t: secT(0) })}</li>
          <li>{t('apollo.seq2', { t: secT(rt / 2), distance: kmText(distanceKm, t, locale) })}</li>
          <li>{t('apollo.seq3')}</li>
          <li>{t('apollo.seq4', { t: secT(rt) })}</li>
        </ol>
      ) : (
        <svg className="ec-art ec-laser" viewBox="0 0 400 130" role="img" aria-label={`${t('apollo.diagram')} ${firing ? (phase === 'outbound' ? t('apollo.outbound') : t('apollo.inbound')) : t('apollo.ready')}`}>
          <circle cx="48" cy="62" r="32" className="ec-earth" />
          <path d="M28 52q10-10 20-4t22-2M30 76q12 6 26-2" className="ec-earth-land" />
          <line x1="80" y1="62" x2="342" y2="62" className="ec-laser-track" />
          <circle cx="360" cy="62" r="22" className="ec-moon" />
          <rect x="336" y="55" width="7" height="14" rx="1" className="ec-reflector" />
          {firing && <circle key={String(lastMeasurement?.shot ?? 0) + distanceKm} cx="80" cy="62" r="5" className="ec-pulse is-firing" style={pulseStyle} />}
          <text x="48" y="116" textAnchor="middle" className="ec-svg-label">{t('apollo.svgEarth')}</text>
          <text x="360" y="116" textAnchor="middle" className="ec-svg-label">{t('apollo.svgMoon')}</text>
          <text x="211" y="20" textAnchor="middle" className="ec-svg-note">{t('apollo.notToScale')}</text>
        </svg>
      )}

      <div className="ec-readouts">
        <div>
          <span className="ec-readout-label">{t('apollo.stopwatch')}</span>
          <span className="ec-readout-big" aria-hidden="true">{secT(firing ? elapsed : lastMeasurement?.roundTripS ?? 0)}</span>
        </div>
        <div>
          <span className="ec-readout-label">{t('apollo.prediction')}</span>
          <span className="ec-readout-big">{secT(rt)}</span>
        </div>
      </div>
      <p aria-live="polite" className="ec-status-line">
        {firing
          ? t('apollo.waiting')
          : lastMeasurement
            ? t('apollo.detected', { shot: lastMeasurement.shot, seconds: sec(lastMeasurement.roundTripS, locale), distance: kmText(lastMeasurement.distanceKm, t, locale) })
            : t('apollo.readyStatus')}
      </p>
    </>
  );
}

function MeasurementLog({ measurements, showDistance }: { measurements: Measurement[]; showDistance: boolean }) {
  const { t, locale } = useT();
  return (
    <div className="ec-table-wrap" role="region" aria-label={t('apollo.logRegion')} tabIndex={0}>
      <table className="ec-table">
        <caption>{t('apollo.logCaption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('apollo.colShot')}</th>
            <th scope="col">{t('apollo.colSet')}</th>
            <th scope="col">{t('apollo.colTime')}</th>
            <th scope="col">{t('apollo.colCalc')}</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m) => (
            <tr key={m.shot}>
              <th scope="row">{m.shot}</th>
              <td>{kmText(m.distanceKm, t, locale)}</td>
              <td>{t('apollo.seconds', { t: sec(m.roundTripS, locale) })}</td>
              <td>{showDistance ? kmText((SPEED_OF_LIGHT_KM_S * m.roundTripS) / 2, t, locale) : t('apollo.solveStep3')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReflectorArt() {
  const { t } = useT();
  return (
    <Art caption={t('apollo.artReflector')} decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label={t('apollo.artReflectorAria')}>
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
  const { t } = useT();
  return (
    <Art caption={t('apollo.artCube')}>
      <svg className="ec-art ec-lineart" viewBox="0 0 400 180" role="img" aria-label={t('apollo.artCubeAria')}>
        <path d="M120 50 L200 130 L280 50" className="ec-mirror" />
        <path d="M170 10 L170 100 L230 100" className="ec-ray" />
        <path d="M230 100 L230 10" className="ec-ray ec-ray--out" />
        <path d="M164 30 L170 42 L176 30" className="ec-ray" />
        <path d="M224 42 L230 30 L236 42" className="ec-ray ec-ray--out" />
        <text x="160" y="24" textAnchor="end" className="ec-svg-label">{t('apollo.lightIn')}</text>
        <text x="240" y="24" className="ec-svg-label">{t('apollo.lightOut')}</text>
        <text x="200" y="162" textAnchor="middle" className="ec-svg-note">{t('apollo.twoMirrors')}</text>
      </svg>
    </Art>
  );
}

function RangingStationArt() {
  const { t, locale } = useT();
  return (
    <Art caption={t('apollo.artStation')}>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label={t('apollo.artStationAria')}>
        <path d="M30 190h260" className="ec-leg" />
        <path d="M70 190v-40a50 50 0 0 1 100 0v40Z" className="ec-panel-shape" />
        <path d="M120 140 250 40" className="ec-beam" />
        <circle cx="262" cy="34" r="20" className="ec-moon" />
        <rect x="196" y="150" width="70" height="40" rx="4" className="ec-panel-shape" />
        <text x="231" y="175" textAnchor="middle" className="ec-svg-label">{t('apollo.seconds', { t: sec(2.564, locale) })}</text>
        <text x="120" y="210" textAnchor="middle" className="ec-svg-note">{t('apollo.telescope')}</text>
        <text x="231" y="210" textAnchor="middle" className="ec-svg-note">{t('apollo.clock')}</text>
      </svg>
    </Art>
  );
}

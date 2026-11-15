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
import { MEDIA } from '../app/media.ts';
import { Art, ChapterFrame, IllustrativeBadge, ScenePhoto, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { ChoiceList, Feedback, Stage } from './shared/GameParts.tsx';
import { prefersReducedMotion, useChapterFlow } from './shared/useChapterFlow.ts';
import { GlowFilter } from './shared/DiagramDefs.tsx';
import { fillUrl, useSvgId } from './shared/svg.ts';

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
      visual={kind === 'hook' ? <ScenePhoto media={MEDIA.a11LrrrDeploy} /> : kind === 'problem' ? <CornerCubeArt /> : kind === 'reveal' ? <ScenePhoto media={MEDIA.laserRanging} /> : undefined}
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
            {/* The formula stays hidden until step 3 is answered, so the table doesn't give it away. */}
            <th scope="col">{t(showDistance ? 'apollo.colCalc' : 'apollo.colCalcPending')}</th>
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

function CornerCubeArt() {
  const { t } = useT();
  const id = useSvgId('cube');
  return (
    <Art caption={t('apollo.artCube')}>
      <svg className="ec-art ec-diagram" viewBox="0 0 400 180" role="img" aria-label={t('apollo.artCubeAria')}>
        <defs>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8ee7dd" stopOpacity="0.02" /><stop offset="1" stopColor="#8ee7dd" stopOpacity="0.24" />
          </linearGradient>
          <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f4f7fb" /><stop offset="0.5" stopColor="#8d99ab" /><stop offset="1" stopColor="#f4f7fb" />
          </linearGradient>
          <GlowFilter id={id} />
        </defs>
        <path d="M120 50 L200 130 L280 50 Z" style={fillUrl(id, 'glass')} />
        <path d="M120 50 L200 130 L280 50" className="ec-mirror" style={{ stroke: `url(#${id}-silver)` }} />
        <path d="M191 121 L200 112 L209 121" className="ec-angle" />
        <g filter={`url(#${id}-glow)`}>
          <path d="M170 10 L170 100 L230 100" className="ec-ray" />
          <path d="M230 100 L230 10" className="ec-ray ec-ray--out" />
          <path d="M164 30 L170 42 L176 30" className="ec-ray" />
          <path d="M224 42 L230 30 L236 42" className="ec-ray ec-ray--out" />
          <circle cx="170" cy="100" r="3" className="ec-hit" /><circle cx="230" cy="100" r="3" className="ec-hit" />
        </g>
        <text x="200" y="162" textAnchor="middle" className="ec-svg-note">{t('apollo.twoMirrors')}</text>
      </svg>
      <p className="ec-trace-legend ec-cube-legend">
        <span><i className="ec-key-in" aria-hidden="true" />{t('apollo.lightIn')}</span>
        <span><i className="ec-key-out" aria-hidden="true" />{t('apollo.lightOut')}</span>
      </p>
    </Art>
  );
}


import { useId, useRef, useState } from 'react';
import {
  DUST_SCALE,
  SAMPLES,
  SURVIVAL_THRESHOLD_PERCENT,
  VERDICT_LABELS,
  belowSurvivalThreshold,
  evaluateSample,
  evidenceSolved,
  illustrativeSunlightPercent,
  opportunityGatePassed,
  type Sample,
  type Verdict,
} from '../content/experiments.ts';
import { MISSIONS } from '../content/missions.ts';
import { Art, ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { Feedback, Stage } from './shared/GameParts.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };
type Decisions = Record<string, Verdict | undefined>;

export default function OpportunityChapter({ onComplete, onBack }: ChapterProps) {
  const [decisions, setDecisions] = useState<Decisions>({});
  const [maxDust, setMaxDust] = useState(0);
  const evidenceDone = evidenceSolved(decisions);
  const solved = opportunityGatePassed(evidenceDone, maxDust);
  const flow = useChapterFlow('opportunity', () => solved);
  const kind = flow.scene.kind;

  return (
    <ChapterFrame
      id="opportunity"
      kicker="Chapter 02 · Mars"
      theme="mars"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint={evidenceDone ? 'Turn the dust up until the panels run short of energy.' : 'Sort every sample correctly to continue.'}
      visual={kind === 'hook' ? <RoverArt /> : kind === 'problem' ? <LayersArt /> : undefined}
    >
      {kind === 'experiment' && (
        <div className="ec-game">
          <Stage number={1} title="Follow the water: inspect and sort the evidence" done={evidenceDone}>
            <EvidenceGame decisions={decisions} onDecide={(id, v) => setDecisions((d) => ({ ...d, [id]: v }))} />
          </Stage>
          <Stage number={2} title="Why the sunlight mattered" done={belowSurvivalThreshold(maxDust)} locked={!evidenceDone} lockedText="Sort all five samples first.">
            <DustModel onDust={(level) => setMaxDust((m) => Math.max(m, level))} />
          </Stage>
        </div>
      )}
      {kind === 'reveal' && <Timeline entries={MISSIONS.opportunity.chronology} />}
    </ChapterFrame>
  );
}

function statusOf(sample: Sample, decisions: Decisions): 'unsorted' | 'right' | 'retry' {
  const d = decisions[sample.id];
  if (!d) return 'unsorted';
  return d === sample.verdict ? 'right' : 'retry';
}

const STATUS_TEXT = { unsorted: 'Not sorted yet', right: 'Sorted correctly', retry: 'Try again' } as const;
const STATUS_ICON = { unsorted: '?', right: '✓', retry: '↻' } as const;

function EvidenceGame({ decisions, onDecide }: { decisions: Decisions; onDecide: (id: string, v: Verdict) => void }) {
  const [selected, setSelected] = useState<string>(SAMPLES[0].id);
  const inspectorHeading = useRef<HTMLHeadingElement>(null);
  const sample = SAMPLES.find((s) => s.id === selected) ?? SAMPLES[0];
  const correctCount = SAMPLES.filter((s) => statusOf(s, decisions) === 'right').length;
  const decision = decisions[sample.id];
  const result = decision ? evaluateSample(sample.id, decision) : null;

  const select = (id: string, moveFocus: boolean) => {
    setSelected(id);
    if (moveFocus) requestAnimationFrame(() => inspectorHeading.current?.focus());
  };

  const nextUnsorted = SAMPLES.find((s) => statusOf(s, decisions) !== 'right' && s.id !== sample.id);

  return (
    <>
      <p className="ec-body">
        Choose a sample from the map or the list. Read what the rover observed, then decide. You can change any answer.
      </p>
      <div className="ec-evidence-layout">
        <div className="ec-map-wrap ec-decor-map">
          <div className="ec-map-stage">
          <svg className="ec-map" viewBox="0 0 400 240" aria-hidden="true">
            <rect width="400" height="240" className="ec-map-sky" />
            <path d="M0 110q60-14 120-6t130 2 150-14v148H0Z" className="ec-map-ground" />
            <path d="M260 120q40-40 90-30t50 20" className="ec-map-rim" />
            <ellipse cx="135" cy="190" rx="70" ry="22" className="ec-map-crater" />
            <path d="M120 150h40m-38 8h36m-34 8h32" className="ec-map-layers" />
            <g transform="translate(176 120)" className="ec-map-rover">
              <rect x="-18" y="-6" width="36" height="5" />
              <rect x="-7" y="-1" width="14" height="8" />
              <circle cx="-12" cy="11" r="3.5" /><circle cx="0" cy="11" r="3.5" /><circle cx="12" cy="11" r="3.5" />
            </g>
            <text x="135" y="226" textAnchor="middle" className="ec-svg-note">EAGLE CRATER</text>
            <text x="330" y="80" textAnchor="middle" className="ec-svg-note">TOWARD ENDEAVOUR</text>
          </svg>
          {SAMPLES.map((s, i) => {
            const st = statusOf(s, decisions);
            return (
              <button
                key={s.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className={`ec-map-marker is-${st}${s.id === sample.id ? ' is-selected' : ''}`}
                style={{ left: `${s.position.x}%`, top: `${s.position.y}%` }}
                onClick={() => select(s.id, false)}
              >
                <span>{st === 'unsorted' ? i + 1 : STATUS_ICON[st]}</span>
              </button>
            );
          })}
          </div>
          <p className="ec-art-caption">Illustrative map, not to scale. Sample spots are approximate story positions, not real coordinates.</p>
        </div>

        <div className="ec-evidence-list">
          <h5 className="ec-mini-heading">Evidence list ({correctCount} of {SAMPLES.length} sorted correctly)</h5>
          <ul>
            {SAMPLES.map((s, i) => {
              const st = statusOf(s, decisions);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`ec-evidence-item is-${st}`}
                    aria-pressed={s.id === sample.id}
                    onClick={() => select(s.id, true)}
                  >
                    <span className="ec-evidence-num" aria-hidden="true">{i + 1}</span>
                    <span className="ec-evidence-name">{s.name}</span>
                    <span className="ec-evidence-status">
                      <span aria-hidden="true">{STATUS_ICON[st]} </span>
                      {STATUS_TEXT[st]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <section className="ec-inspector" aria-labelledby="ec-inspector-title">
        <p className="ec-mini-heading">Inspecting sample {SAMPLES.indexOf(sample) + 1} of {SAMPLES.length}</p>
        <h5 id="ec-inspector-title" ref={inspectorHeading} tabIndex={-1} className="ec-inspector-title">{sample.name}</h5>
        <p className="ec-muted ec-small">{sample.location}</p>
        <blockquote className="ec-observation">
          <span className="ec-observation-label">What the rover observed</span>
          {sample.observation} <SourceLink id={sample.sourceId}>Source</SourceLink>
        </blockquote>
        <ul className="ec-props">
          {sample.properties.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="ec-decide" role="group" aria-label={`Your verdict for ${sample.name}`}>
          {(Object.keys(VERDICT_LABELS) as Verdict[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`ec-btn${decision === v ? ' ec-btn--selected' : ''}`}
              aria-pressed={decision === v}
              onClick={() => onDecide(sample.id, v)}
            >
              {VERDICT_LABELS[v]}
            </button>
          ))}
        </div>
        <Feedback ok={Boolean(result?.correct)} okTag="Good reasoning" tryTag="Not quite — here is a hint">
          {result?.message}
        </Feedback>
        {result?.correct && nextUnsorted && (
          <button type="button" className="ec-btn ec-btn--small" onClick={() => select(nextUnsorted.id, true)}>
            Next sample: {nextUnsorted.name} <span aria-hidden="true">›</span>
          </button>
        )}
      </section>

      <div className="ec-table-wrap" role="region" aria-label="Evidence board (scrolls sideways on small screens)" tabIndex={0}>
        <table className="ec-table">
          <caption>Evidence board</caption>
          <thead>
            <tr><th scope="col">Sample</th><th scope="col">Your verdict</th><th scope="col">Check</th></tr>
          </thead>
          <tbody>
            {SAMPLES.map((s) => {
              const st = statusOf(s, decisions);
              const d = decisions[s.id];
              return (
                <tr key={s.id}>
                  <th scope="row">{s.name}</th>
                  <td>{d ? VERDICT_LABELS[d] : '—'}</td>
                  <td className={`ec-check is-${st}`}><span aria-hidden="true">{STATUS_ICON[st]} </span>{STATUS_TEXT[st]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {evidenceSolved(decisions) && (
        <p className="ec-feedback ec-feedback--ok ec-feedback--big">
          <span className="ec-feedback-tag"><span aria-hidden="true">✓ </span>Case closed</span>
          Three independent clues point the same way: minerals that need water to form, and rocks changed by water. The spheres and the crater were not enough on their own. Scientists trust a conclusion more when several separate clues agree.
        </p>
      )}
    </>
  );
}

function DustModel({ onDust }: { onDust: (level: number) => void }) {
  const sliderId = useId();
  const [dust, setDust] = useState(0);
  const sunlight = illustrativeSunlightPercent(dust);
  const low = belowSurvivalThreshold(dust);

  return (
    <>
      <IllustrativeBadge>Conceptual model: an invented 0–10 scale, not Opportunity telemetry.</IllustrativeBadge>
      <svg className="ec-art ec-lineart ec-dust" viewBox="0 0 400 150" role="img" aria-label={`Illustration: the Sun above a solar-powered rover. Dust haze level ${dust} of 10; about ${sunlight}% of clear-day sunlight reaches the panels in this model.`}>
        <circle cx="320" cy="40" r="20" className="ec-sun" style={{ opacity: 0.25 + 0.75 * (sunlight / 100) }} />
        <rect width="400" height="150" className="ec-haze" style={{ opacity: dust / 12 }} />
        <path d="M0 118q120-14 220-4t180-6v42H0Z" className="ec-ground" />
        <g transform="translate(140 84)" className="ec-map-rover">
          <rect x="0" y="0" width="110" height="8" />
          <rect x="44" y="8" width="22" height="14" />
          <circle cx="16" cy="28" r="7" /><circle cx="55" cy="28" r="7" /><circle cx="94" cy="28" r="7" />
        </g>
      </svg>
      <label htmlFor={sliderId} className="ec-label">
        How dusty is the sky? <span className="ec-readout">{dust} / 10</span>
      </label>
      <input
        id={sliderId}
        className="ec-range"
        type="range"
        min={DUST_SCALE.min}
        max={DUST_SCALE.max}
        step={DUST_SCALE.step}
        value={dust}
        aria-valuetext={`Dust level ${dust} of 10, about ${sunlight} percent of clear-day sunlight`}
        onChange={(e) => {
          const level = Number(e.target.value);
          setDust(level);
          onDust(level);
        }}
      />
      <p id={`${sliderId}-meter`} className="ec-label">
        Sunlight reaching the panels (model): <span className="ec-readout">{sunlight}%</span> of a clear day
      </p>
      <div className="ec-meter" role="meter" aria-labelledby={`${sliderId}-meter`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={sunlight}>
        <div className={`ec-meter-fill${low ? ' is-low' : ''}`} style={{ width: `${sunlight}%` }} />
        <div className="ec-meter-threshold" style={{ left: `${SURVIVAL_THRESHOLD_PERCENT}%` }} />
      </div>
      <p className="ec-small ec-muted">The marked line is an imaginary “just enough energy” level for this model.</p>
      <p aria-live="polite" className={`ec-feedback ${low ? 'ec-feedback--try' : 'ec-feedback--ok'}`}>
        <span className="ec-feedback-tag">{low ? 'Below the line' : dust === 0 ? 'Clear sky' : 'Still enough'}</span>
        {low
          ? 'In this model the panels can no longer collect enough energy to keep working and talk to Earth. In June 2018, a real planet-wide dust storm blocked sunlight over Opportunity, and it fell silent.'
          : dust === 0
            ? 'Plenty of sunlight. Slide the dust up and watch what happens.'
            : 'Less light is getting through, but the panels can still keep up — for now.'}
      </p>
    </>
  );
}

function RoverArt() {
  return (
    <Art caption="Line illustration, not a NASA photograph." decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label="Line illustration: a six-wheeled solar-powered rover with a camera mast on a rocky plain.">
        <path d="M0 170q80-18 160-6t160-10v66H0Z" className="ec-ground" />
        <circle cx="40" cy="186" r="5" className="ec-rock" /><circle cx="270" cy="194" r="8" className="ec-rock" />
        <g transform="translate(80 92)" className="ec-rover-line">
          <path d="M-6 30h172l-12 10H6Z" />
          <rect x="50" y="40" width="64" height="24" />
          <path d="M110 40V6m-10 0h24v12h-24Z" />
          {[16, 82, 148].map((x) => <circle key={x} cx={x} cy="78" r="12" />)}
          <path d="M16 78 50 60m32 18v-14m66 14-34-18" />
        </g>
      </svg>
    </Art>
  );
}

function LayersArt() {
  return (
    <Art caption="Simplified diagram of layered rock, not a specific outcrop.">
      <svg className="ec-art ec-lineart" viewBox="0 0 320 200" role="img" aria-label="Diagram: a cut-away of layered rock with tiny round grains and small holes, labeled as clues that geologists read.">
        {[40, 70, 100, 130, 160].map((y, i) => <path key={y} d={`M20 ${y}q70 ${i % 2 ? -8 : 8} 140 0t140 0`} className="ec-layer-line" />)}
        {[[70, 85], [130, 115], [210, 90], [250, 145], [100, 150]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" className="ec-cube" />)}
        <path d="M180 120l8-6 6 8-8 5Z" className="ec-vug" />
        <text x="160" y="192" textAnchor="middle" className="ec-svg-note">layers, grains and minerals record past environments</text>
      </svg>
    </Art>
  );
}

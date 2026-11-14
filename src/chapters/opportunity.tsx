import { useId, useState } from 'react';
import {
  DUST_SCALE,
  EVIDENCE_CARDS,
  SUPPORTING_EVIDENCE_IDS,
  SURVIVAL_THRESHOLD_PERCENT,
  belowSurvivalThreshold,
  evaluateEvidence,
  illustrativeSunlightPercent,
  opportunityGatePassed,
} from '../content/experiments.ts';
import { MISSIONS } from '../content/missions.ts';
import { ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

export default function OpportunityChapter({ onComplete, onBack }: ChapterProps) {
  const [evidenceSolved, setEvidenceSolved] = useState(false);
  const [maxDust, setMaxDust] = useState(0);
  const solved = opportunityGatePassed(evidenceSolved, maxDust);
  const flow = useChapterFlow('opportunity', () => solved);

  return (
    <ChapterFrame
      id="opportunity"
      kicker="Chapter 2 · Mars"
      theme="mars"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint={evidenceSolved ? 'Turn the dust up until the panels run short of energy.' : 'Pick the right evidence to continue.'}
    >
      {flow.scene.kind === 'hook' && <RoverArt />}
      {flow.scene.kind === 'experiment' && (
        <>
          <EvidenceSorter solved={evidenceSolved} onSolved={() => setEvidenceSolved(true)} />
          {evidenceSolved && <DustModel onDust={(level) => setMaxDust((m) => Math.max(m, level))} />}
        </>
      )}
      {flow.scene.kind === 'reveal' && <Timeline entries={MISSIONS.opportunity.chronology} />}
    </ChapterFrame>
  );
}

function EvidenceSorter({ solved, onSolved }: { solved: boolean; onSolved: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(solved ? SUPPORTING_EVIDENCE_IDS : []));
  const [checked, setChecked] = useState<ReturnType<typeof evaluateEvidence> | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setChecked(null);
  };

  const check = () => {
    const result = evaluateEvidence(selected);
    setChecked(result);
    if (result.correct) onSolved();
  };

  return (
    <div className="ec-panel">
      <fieldset>
        <legend>1 · Which clues support the idea that Mars once had liquid water? Choose all that apply.</legend>
        <ul className="ec-choice-list">
          {EVIDENCE_CARDS.map((card) => {
            const isSelected = selected.has(card.id);
            const showResult = checked !== null || solved;
            const right = card.supportsWater === isSelected;
            return (
              <li key={card.id}>
                <label className="ec-choice">
                  <input type="checkbox" checked={isSelected} onChange={() => toggle(card.id)} disabled={solved} />
                  <span className="ec-choice-text">
                    <strong>{card.title}</strong>
                    <span>
                      {card.caption} <SourceLink id={card.sourceId}>(source)</SourceLink>
                    </span>
                    {showResult && (isSelected || card.supportsWater) && (
                      <span className="ec-small">
                        {' '}
                        <span className={right ? 'ec-mark-ok' : 'ec-mark-bad'}>{right ? '✓' : '✗'}</span> {card.explanation}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      {!solved && (
        <div className="ec-row" style={{ marginTop: '0.8rem' }}>
          <button type="button" className="ec-btn ec-btn--primary" onClick={check} disabled={selected.size === 0}>
            Check my evidence
          </button>
        </div>
      )}
      <div aria-live="polite">
        {checked && !checked.correct && (
          <p className="ec-feedback ec-feedback--try">
            {checked.wrong.length > 0
              ? 'One of your clues tells us where the rover is, not what the rocks say about water. '
              : ''}
            {checked.missing.length > 0 ? 'There is at least one more water clue to find. ' : ''}
            Adjust your choices and check again.
          </p>
        )}
        {solved && (
          <p className="ec-feedback ec-feedback--ok">
            ✓ Great geology! Minerals that form in water, and rocks changed by water, are both clues to a wetter past.
          </p>
        )}
      </div>
    </div>
  );
}

function DustModel({ onDust }: { onDust: (level: number) => void }) {
  const sliderId = useId();
  const [dust, setDust] = useState(0);
  const sunlight = illustrativeSunlightPercent(dust);
  const low = belowSurvivalThreshold(dust);

  return (
    <div className="ec-panel">
      <h4>2 · Dust and sunlight</h4>
      <IllustrativeBadge>Conceptual simulation — invented scale, not Opportunity telemetry.</IllustrativeBadge>
      <svg
        className="ec-art"
        viewBox="0 0 400 160"
        role="img"
        aria-label={`Illustration: the Sun over a rover with solar panels. Dust haze is at level ${dust} of 10.`}
      >
        <rect width="400" height="160" fill="#c98a5f" />
        <circle cx="320" cy="40" r="22" fill="#fff3c4" />
        <rect width="400" height="160" fill="#5a3422" opacity={dust / 11} />
        <path d="M0 125 Q120 110 220 122 T400 118 V160 H0Z" fill="#8c4a2f" />
        <g transform="translate(130 92)">
          <rect x="0" y="0" width="110" height="10" fill="#2a3d6b" stroke="#9fb4e6" />
          <rect x="45" y="10" width="22" height="16" fill="#d9d2c5" />
          <circle cx="15" cy="32" r="7" fill="#333" />
          <circle cx="55" cy="32" r="7" fill="#333" />
          <circle cx="95" cy="32" r="7" fill="#333" />
        </g>
      </svg>
      <label htmlFor={sliderId}>
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
        aria-valuetext={`Dust level ${dust} of 10, about ${sunlight} percent of clear-sky sunlight`}
        onChange={(e) => {
          const level = Number(e.target.value);
          setDust(level);
          onDust(level);
        }}
      />
      <p id={`${sliderId}-meter`} className="ec-small ec-muted" style={{ margin: '0.4rem 0 0.2rem' }}>
        Sunlight reaching the panels (illustrative): <span className="ec-readout">{sunlight}%</span> of a clear day
      </p>
      <div
        className="ec-meter"
        role="meter"
        aria-labelledby={`${sliderId}-meter`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={sunlight}
      >
        <div className={`ec-meter-fill${low ? ' is-low' : ''}`} style={{ width: `${sunlight}%` }} />
        <div className="ec-meter-threshold" style={{ left: `${SURVIVAL_THRESHOLD_PERCENT}%` }} />
      </div>
      <p className="ec-small ec-muted">The white line marks an imaginary “just enough energy” level for this model.</p>
      <p aria-live="polite" className={`ec-feedback ${low ? 'ec-feedback--try' : 'ec-feedback--ok'}`}>
        {low
          ? 'In this model the panels can no longer collect enough energy to keep working and talk to Earth. In June 2018, a real planet-wide dust storm blocked sunlight over Opportunity, and it fell silent.'
          : dust === 0
            ? 'Clear sky: plenty of sunlight. Now slide the dust up and watch what happens.'
            : 'Less light is getting through, but the panels can still keep up — for now.'}
      </p>
    </div>
  );
}

function RoverArt() {
  return (
    <>
      <svg
        className="ec-art"
        viewBox="0 0 400 200"
        role="img"
        aria-label="Illustration: a six-wheeled solar-powered rover on a rocky orange plain."
      >
        <rect width="400" height="200" fill="#d79a6c" />
        <path d="M0 140 Q90 120 200 135 T400 128 V200 H0Z" fill="#a85a37" />
        <circle cx="60" cy="160" r="6" fill="#7a3f27" />
        <circle cx="330" cy="170" r="9" fill="#7a3f27" />
        <g transform="translate(140 80)">
          <rect x="-10" y="20" width="140" height="10" fill="#2a3d6b" stroke="#9fb4e6" />
          <rect x="30" y="30" width="60" height="22" fill="#e8e0d2" />
          <rect x="80" y="-6" width="4" height="28" fill="#e8e0d2" />
          <rect x="72" y="-14" width="22" height="10" rx="2" fill="#e8e0d2" />
          {[10, 60, 110].map((x) => (
            <circle key={x} cx={x} cy="62" r="10" fill="#333" stroke="#777" />
          ))}
        </g>
      </svg>
      <p className="ec-art-caption">Illustration, not a NASA photograph.</p>
    </>
  );
}

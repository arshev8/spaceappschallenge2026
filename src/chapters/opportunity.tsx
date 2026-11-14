import { useId, useRef, useState } from 'react';
import {
  DUST_SCALE,
  SURVIVAL_THRESHOLD_PERCENT,
  belowSurvivalThreshold,
  evidenceSolved,
  illustrativeSunlightPercent,
  opportunityGatePassed,
  type Sample,
  type Verdict,
} from '../content/experiments.ts';
import { useContent } from '../content/useContent.ts';
import { useT, type MessageKey } from '../i18n';
import { Art, ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { Feedback, Stage } from './shared/GameParts.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };
type Decisions = Record<string, Verdict | undefined>;
type SortStatus = 'unsorted' | 'right' | 'retry';

const VERDICTS: Verdict[] = ['water', 'not-clear'];
const STATUS_KEY: Record<SortStatus, MessageKey> = { unsorted: 'opp.statusUnsorted', right: 'opp.statusRight', retry: 'opp.statusRetry' };
const STATUS_ICON: Record<SortStatus, string> = { unsorted: '?', right: '✓', retry: '↻' };

function statusOf(sample: Sample, decisions: Decisions): SortStatus {
  const d = decisions[sample.id];
  if (!d) return 'unsorted';
  return d === sample.verdict ? 'right' : 'retry';
}

export default function OpportunityChapter({ onComplete, onBack }: ChapterProps) {
  const { t } = useT();
  const content = useContent();
  const [decisions, setDecisions] = useState<Decisions>({});
  const [maxDust, setMaxDust] = useState(0);
  const evidenceDone = evidenceSolved(decisions);
  const solved = opportunityGatePassed(evidenceDone, maxDust);
  const flow = useChapterFlow(content.scripts.opportunity, () => solved);
  const kind = flow.scene.kind;

  return (
    <ChapterFrame
      id="opportunity"
      kicker={t('opp.kicker')}
      theme="mars"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint={evidenceDone ? t('opp.gateDust') : t('opp.gateEvidence')}
      visual={kind === 'hook' ? <RoverArt /> : kind === 'problem' ? <LayersArt /> : undefined}
    >
      {kind === 'experiment' && (
        <div className="ec-game">
          <Stage number={1} title={t('opp.stage1')} done={evidenceDone}>
            <EvidenceGame decisions={decisions} onDecide={(id, v) => setDecisions((d) => ({ ...d, [id]: v }))} />
          </Stage>
          <Stage number={2} title={t('opp.stage2')} done={belowSurvivalThreshold(maxDust)} locked={!evidenceDone} lockedText={t('opp.lockDust')}>
            <DustModel onDust={(level) => setMaxDust((m) => Math.max(m, level))} />
          </Stage>
        </div>
      )}
      {kind === 'reveal' && <Timeline entries={content.missions.opportunity.chronology} />}
    </ChapterFrame>
  );
}

function EvidenceGame({ decisions, onDecide }: { decisions: Decisions; onDecide: (id: string, v: Verdict) => void }) {
  const { t } = useT();
  const content = useContent();
  const samples = content.samples;
  const [selected, setSelected] = useState<string>(samples[0].id);
  const inspectorHeading = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const sample = samples.find((s) => s.id === selected) ?? samples[0];
  const correctCount = samples.filter((s) => statusOf(s, decisions) === 'right').length;
  const decision = decisions[sample.id];
  const result = decision ? { correct: decision === sample.verdict, message: decision === sample.verdict ? sample.explanation : sample.hint } : null;

  const select = (id: string, moveFocus: boolean) => {
    setSelected(id);
    if (moveFocus) requestAnimationFrame(() => inspectorHeading.current?.focus());
  };

  const nextUnsorted = samples.find((s) => statusOf(s, decisions) !== 'right' && s.id !== sample.id);

  return (
    <>
      <p className="ec-body">{t('opp.intro')}</p>
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
              <text x="135" y="226" textAnchor="middle" className="ec-svg-note">{t('opp.eagle')}</text>
              <text x="330" y="80" textAnchor="middle" className="ec-svg-note">{t('opp.toEndeavour')}</text>
            </svg>
            {samples.map((s, i) => {
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
          <p className="ec-art-caption">{t('opp.mapCaption')}</p>
        </div>

        <div className="ec-evidence-list">
          <h5 className="ec-mini-heading">{t('opp.list', { n: correctCount, total: samples.length })}</h5>
          <ul>
            {samples.map((s, i) => {
              const st = statusOf(s, decisions);
              return (
                <li key={s.id}>
                  <button type="button" className={`ec-evidence-item is-${st}`} aria-pressed={s.id === sample.id} onClick={() => select(s.id, true)}>
                    <span className="ec-evidence-num" aria-hidden="true">{i + 1}</span>
                    <span className="ec-evidence-name">{s.name}</span>
                    <span className="ec-evidence-status"><span aria-hidden="true">{STATUS_ICON[st]} </span>{t(STATUS_KEY[st])}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <section className="ec-inspector" aria-labelledby={titleId}>
        <p className="ec-mini-heading">{t('opp.inspecting', { n: samples.indexOf(sample) + 1, total: samples.length })}</p>
        <h5 id={titleId} ref={inspectorHeading} tabIndex={-1} className="ec-inspector-title">{sample.name}</h5>
        <p className="ec-muted ec-small">{sample.location}</p>
        <blockquote className="ec-observation">
          <span className="ec-observation-label">{t('opp.observed')}</span>
          {sample.observation} <SourceLink id={sample.sourceId}>{t('common.source')}</SourceLink>
        </blockquote>
        <ul className="ec-props">
          {sample.properties.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="ec-decide" role="group" aria-label={t('opp.verdictFor', { name: sample.name })}>
          {VERDICTS.map((v) => (
            <button key={v} type="button" className={`ec-btn${decision === v ? ' ec-btn--selected' : ''}`} aria-pressed={decision === v} onClick={() => onDecide(sample.id, v)}>
              {content.verdicts[v]}
            </button>
          ))}
        </div>
        <Feedback ok={Boolean(result?.correct)} okTag={t('opp.goodReasoning')} tryTag={t('opp.hint')}>
          {result?.message}
        </Feedback>
        {result?.correct && nextUnsorted && (
          <button type="button" className="ec-btn ec-btn--small" onClick={() => select(nextUnsorted.id, true)}>
            {t('opp.nextSample', { name: nextUnsorted.name })} <span aria-hidden="true">›</span>
          </button>
        )}
      </section>

      <div className="ec-table-wrap" role="region" aria-label={t('opp.boardRegion')} tabIndex={0}>
        <table className="ec-table">
          <caption>{t('opp.board')}</caption>
          <thead>
            <tr><th scope="col">{t('opp.colSample')}</th><th scope="col">{t('opp.colVerdict')}</th><th scope="col">{t('opp.colCheck')}</th></tr>
          </thead>
          <tbody>
            {samples.map((s) => {
              const st = statusOf(s, decisions);
              const d = decisions[s.id];
              return (
                <tr key={s.id}>
                  <th scope="row">{s.name}</th>
                  <td>{d ? content.verdicts[d] : '—'}</td>
                  <td className={`ec-check is-${st}`}><span aria-hidden="true">{STATUS_ICON[st]} </span>{t(STATUS_KEY[st])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {evidenceSolved(decisions) && (
        <p className="ec-feedback ec-feedback--ok ec-feedback--big">
          <span className="ec-feedback-tag"><span aria-hidden="true">✓ </span>{t('opp.caseClosed')}</span>
          {t('opp.caseClosedText')}
        </p>
      )}
    </>
  );
}

function DustModel({ onDust }: { onDust: (level: number) => void }) {
  const { t } = useT();
  const sliderId = useId();
  const [dust, setDust] = useState(0);
  const sun = illustrativeSunlightPercent(dust);
  const low = belowSurvivalThreshold(dust);

  return (
    <>
      <IllustrativeBadge>{t('opp.dustBadge')}</IllustrativeBadge>
      <svg className="ec-art ec-lineart ec-dust" viewBox="0 0 400 150" role="img" aria-label={t('opp.dustAria', { dust, sun })}>
        <circle cx="320" cy="40" r="20" className="ec-sun" style={{ opacity: 0.25 + 0.75 * (sun / 100) }} />
        <rect width="400" height="150" className="ec-haze" style={{ opacity: dust / 12 }} />
        <path d="M0 118q120-14 220-4t180-6v42H0Z" className="ec-ground" />
        <g transform="translate(140 84)" className="ec-map-rover">
          <rect x="0" y="0" width="110" height="8" />
          <rect x="44" y="8" width="22" height="14" />
          <circle cx="16" cy="28" r="7" /><circle cx="55" cy="28" r="7" /><circle cx="94" cy="28" r="7" />
        </g>
      </svg>
      <label htmlFor={sliderId} className="ec-label">
        {t('opp.dustLabel')} <span className="ec-readout">{dust} / 10</span>
      </label>
      <input
        id={sliderId}
        className="ec-range"
        type="range"
        min={DUST_SCALE.min}
        max={DUST_SCALE.max}
        step={DUST_SCALE.step}
        value={dust}
        aria-valuetext={t('opp.dustValue', { dust, sun })}
        onChange={(e) => {
          const level = Number(e.target.value);
          setDust(level);
          onDust(level);
        }}
      />
      <p id={`${sliderId}-meter`} className="ec-label">
        {t('opp.sunLabel')} <span className="ec-readout">{sun}%</span> {t('opp.ofClearDay')}
      </p>
      <div className="ec-meter" role="meter" aria-labelledby={`${sliderId}-meter`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={sun}>
        <div className={`ec-meter-fill${low ? ' is-low' : ''}`} style={{ width: `${sun}%` }} />
        <div className="ec-meter-threshold" style={{ left: `${SURVIVAL_THRESHOLD_PERCENT}%` }} />
      </div>
      <p className="ec-small ec-muted">{t('opp.thresholdNote')}</p>
      <p aria-live="polite" className={`ec-feedback ${low ? 'ec-feedback--try' : 'ec-feedback--ok'}`}>
        <span className="ec-feedback-tag">{low ? t('opp.tagLow') : dust === 0 ? t('opp.tagClear') : t('opp.tagEnough')}</span>
        {low ? t('opp.textLow') : dust === 0 ? t('opp.textClear') : t('opp.textEnough')}
      </p>
    </>
  );
}

function RoverArt() {
  const { t } = useT();
  return (
    <Art caption={t('opp.artRover')} decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label={t('opp.artRoverAria')}>
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
  const { t } = useT();
  return (
    <Art caption={t('opp.artLayers')}>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 200" role="img" aria-label={t('opp.artLayersAria')}>
        {[40, 70, 100, 130, 160].map((y, i) => <path key={y} d={`M20 ${y}q70 ${i % 2 ? -8 : 8} 140 0t140 0`} className="ec-layer-line" />)}
        {[[70, 85], [130, 115], [210, 90], [250, 145], [100, 150]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" className="ec-cube" />)}
        <path d="M180 120l8-6 6 8-8 5Z" className="ec-vug" />
        <text x="160" y="192" textAnchor="middle" className="ec-svg-note">{t('opp.layersNote')}</text>
      </svg>
    </Art>
  );
}

import { useMemo, useState } from 'react';
import {
  EVENT_ARRIVALS,
  EVENT_CASE_ID,
  evaluateChoice,
  insightGatePassed,
  peakPercent,
  syntheticWaveform,
  waveformPath,
} from '../content/experiments.ts';
import { useContent } from '../content/useContent.ts';
import { useT, type MessageKey } from '../i18n';
import { MEDIA } from '../app/media.ts';
import { Art, ChapterFrame, IllustrativeBadge, ScenePhoto, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { ChoiceList, Feedback, Stage } from './shared/GameParts.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';
import { GlowFilter, MarsLayerGradients } from './shared/DiagramDefs.tsx';
import { fillUrl, useSvgId } from './shared/svg.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

const TRACE_W = 400;
const TRACE_H = 70;

const LAYERS: { id: 'crust' | 'mantle' | 'core'; name: MessageKey; text: MessageKey }[] = [
  { id: 'crust', name: 'ins.crust', text: 'ins.crustText' },
  { id: 'mantle', name: 'ins.mantle', text: 'ins.mantleText' },
  { id: 'core', name: 'ins.core', text: 'ins.coreText' },
];

export default function InSightChapter({ onComplete, onBack }: ChapterProps) {
  const { t } = useT();
  const content = useContent();
  const [waveChoice, setWaveChoice] = useState<string | null>(null);
  const [gapChoice, setGapChoice] = useState<string | null>(null);
  const [layerChoice, setLayerChoice] = useState<string | null>(null);
  const solved = insightGatePassed(waveChoice, gapChoice, layerChoice);
  const flow = useChapterFlow(content.scripts.insight, () => solved);
  const kind = flow.scene.kind;
  const waveCorrect = waveChoice === EVENT_CASE_ID;
  const gapCorrect = evaluateChoice(content.gap, gapChoice).correct;
  const layerCorrect = evaluateChoice(content.layers, layerChoice).correct;

  return (
    <ChapterFrame
      id="insight"
      kicker={t('ins.kicker')}
      theme="mars"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint={t('ins.gate')}
      visual={kind === 'hook' ? <ScenePhoto media={MEDIA.insightWts} /> : kind === 'problem' ? <SeismometerArt /> : kind === 'reveal' ? <InteriorArt /> : undefined}
    >
      {kind === 'experiment' && (
        <div className="ec-game">
          <IllustrativeBadge>{t('ins.badge')}</IllustrativeBadge>
          <Stage number={1} title={t('ins.stage1')} done={waveCorrect}>
            <TracePicker choice={waveChoice} onChoose={setWaveChoice} />
          </Stage>
          <Stage number={2} title={t('ins.stage2')} done={gapCorrect} locked={!waveCorrect} lockedText={t('ins.lockTrace')}>
            <GapQuestion choice={gapChoice} onChoose={setGapChoice} />
          </Stage>
          <Stage number={3} title={t('ins.stage3')} done={layerCorrect} locked={!gapCorrect} lockedText={t('ins.lockGap')}>
            <LayerExplorer choice={layerChoice} onChoose={setLayerChoice} />
          </Stage>
        </div>
      )}
      {kind === 'reveal' && (
        <>
          <Timeline entries={content.missions.insight.chronology} />
          <p className="ec-muted ec-small">
            {t('ins.revealLink')} <SourceLink id="insightRetired" />.
          </p>
        </>
      )}
    </ChapterFrame>
  );
}

function TracePicker({ choice, onChoose }: { choice: string | null; onChoose: (id: string) => void }) {
  const { t } = useT();
  const content = useContent();
  const data = useMemo(
    () => Object.fromEntries(content.waves.map((w) => {
      const values = syntheticWaveform(w.id);
      return [w.id, { path: waveformPath(values, TRACE_W, TRACE_H), peak: peakPercent(values) }];
    })),
    [content.waves],
  );
  const selected = content.waves.find((w) => w.id === choice);

  return (
    <>
      <fieldset className="ec-fieldset">
        <legend>{t('ins.traceLegend')}</legend>
        <ul className="ec-choice-list">
          {content.waves.map((w) => (
            <li key={w.id}>
              <label className="ec-choice ec-choice--trace">
                <input type="radio" name="insight-trace" value={w.id} checked={choice === w.id} onChange={() => onChoose(w.id)} />
                <span className="ec-choice-text">
                  <strong>{w.label}</strong>
                  <span>{w.description}</span>
                  <svg className="ec-trace" viewBox={`0 0 ${TRACE_W} ${TRACE_H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <line x1="0" y1={TRACE_H / 2} x2={TRACE_W} y2={TRACE_H / 2} className="ec-trace-axis" />
                    <path d={data[w.id].path} />
                  </svg>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <Feedback ok={selected?.id === EVENT_CASE_ID}>{selected?.feedback}</Feedback>
      <div className="ec-table-wrap" role="region" aria-label={t('ins.tableRegion')} tabIndex={0}>
        <table className="ec-table">
          <caption>{t('ins.tableCaption')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('ins.colTrace')}</th>
              <th scope="col">{t('ins.colPeak')}</th>
              <th scope="col">{t('ins.colStart')}</th>
              <th scope="col">{t('ins.colSecond')}</th>
              <th scope="col">{t('ins.colShape')}</th>
            </tr>
          </thead>
          <tbody>
            {content.waves.map((w) => (
              <tr key={w.id}>
                <th scope="row">{w.label}</th>
                <td>{t('ins.peak', { n: data[w.id].peak })}</td>
                <td>{w.suddenStart ? t('common.yes') : t('common.no')}</td>
                <td>{w.secondArrival ? t('common.yes') : t('common.no')}</td>
                <td>{w.shape}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ec-small ec-muted">{t('ins.tip')}</p>
    </>
  );
}

function GapQuestion({ choice, onChoose }: { choice: string | null; onChoose: (id: string) => void }) {
  const { t } = useT();
  const content = useContent();
  const path = useMemo(() => waveformPath(syntheticWaveform(EVENT_CASE_ID), TRACE_W, 140), []);
  const pX = EVENT_ARRIVALS.p * TRACE_W;
  const sX = EVENT_ARRIVALS.s * TRACE_W;
  const result = choice ? evaluateChoice(content.gap, choice) : null;

  return (
    <>
      <p className="ec-body">
        {t('ins.wavesIntro')} <strong>{t('ins.pWaves')}</strong> {t('ins.pText')} <strong>{t('ins.sWaves')}</strong> {t('ins.sText')}
      </p>
      <svg className="ec-trace ec-trace--large" viewBox={`0 0 ${TRACE_W} 140`} preserveAspectRatio="none" role="img" aria-label={t('ins.bigTraceAria')}>
        <path d={path} />
        <line x1={pX} y1="16" x2={pX} y2="132" className="ec-marker-p" />
        <line x1={sX} y1="16" x2={sX} y2="132" className="ec-marker-s" />
        <line x1={pX} y1="12" x2={sX} y2="12" className="ec-gap-bar" />
      </svg>
      <div className="ec-trace-legend" aria-hidden="true">
        <span><i className="ec-key-p" /> {t('ins.keyP')}</span>
        <span><i className="ec-key-s" /> {t('ins.keyS')}</span>
        <span><i className="ec-key-gap" /> {t('ins.keyGap')}</span>
      </div>
      <ChoiceList name="insight-gap" legend={t('ins.gapLegend')} choices={content.gap} value={choice} onChange={onChoose} />
      <Feedback ok={Boolean(result?.correct)}>{result?.feedback}</Feedback>
    </>
  );
}

function LayerExplorer({ choice, onChoose }: { choice: string | null; onChoose: (id: string) => void }) {
  const { t } = useT();
  const content = useContent();
  const [layer, setLayer] = useState<(typeof LAYERS)[number]['id']>('crust');
  const active = LAYERS.find((l) => l.id === layer) ?? LAYERS[0];
  const gid = useSvgId('cut');
  const result = choice ? evaluateChoice(content.layers, choice) : null;

  return (
    <>
      <div className="ec-layer-explorer">
        <svg className="ec-art ec-diagram ec-cutaway" viewBox="0 0 220 220" role="img" aria-label={t('ins.cutawayAria', { layer: t(active.name) })}>
          <defs><MarsLayerGradients id={gid} /><GlowFilter id={gid} blur={1.6} /></defs>
          <circle cx="110" cy="110" r="100" className={`ec-layer${layer === 'crust' ? ' is-active' : ''}`} style={fillUrl(gid, 'crust')} />
          <circle cx="110" cy="110" r="90" className={`ec-layer${layer === 'mantle' ? ' is-active' : ''}`} style={fillUrl(gid, 'mantle')} />
          <circle cx="110" cy="110" r="46" className={`ec-layer${layer === 'core' ? ' is-active' : ''}`} style={fillUrl(gid, 'core')} />
          <circle cx="110" cy="110" r="100" style={fillUrl(gid, 'shine')} pointerEvents="none" />
          <g filter={`url(#${gid}-glow)`}>
            <path d="M40 46Q110 150 186 52" className="ec-wave-path" />
            <path d="M40 46Q100 80 130 66" className="ec-wave-path" />
          </g>
          <text x="110" y="214" textAnchor="middle" className="ec-svg-note">{t('ins.notToScale')}</text>
        </svg>
        <div>
          <div className="ec-segmented" role="group" aria-label={t('ins.chooseLayer')}>
            {LAYERS.map((l) => (
              <button key={l.id} type="button" className={`ec-btn ec-btn--small${layer === l.id ? ' ec-btn--selected' : ''}`} aria-pressed={layer === l.id} onClick={() => setLayer(l.id)}>
                {t(l.name)}
              </button>
            ))}
          </div>
          <p className="ec-layer-text" aria-live="polite">
            <strong>{t(active.name)}: </strong>
            {t(active.text)}
          </p>
        </div>
      </div>
      <ChoiceList name="insight-layer" legend={t('ins.layerLegend')} choices={content.layers} value={choice} onChange={onChoose} />
      <Feedback ok={Boolean(result?.correct)}>{result?.feedback}</Feedback>
    </>
  );
}

function SeismometerArt() {
  const { t } = useT();
  const id = useSvgId('seis');
  const path = useMemo(() => waveformPath(syntheticWaveform('event', 160), 260, 60), []);
  return (
    <Art caption={t('ins.artSeis')}>
      <svg className="ec-art ec-diagram" viewBox="0 0 320 200" role="img" aria-label={t('ins.artSeisAria')}>
        <defs>
          <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9a4a2c" /><stop offset="1" stopColor="#2a110b" />
          </linearGradient>
          <radialGradient id={`${id}-dome`} cx="35%" cy="25%" r="80%">
            <stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#c3cad4" /><stop offset="1" stopColor="#6b7480" />
          </radialGradient>
          <clipPath id={`${id}-under`}><rect x="0" y="120" width="320" height="80" /></clipPath>
          <GlowFilter id={id} />
        </defs>
        <rect x="0" y="120" width="320" height="80" style={fillUrl(id, 'ground')} />
        <path d="M0 148q80-6 160 0t160 0M0 174q80 6 160 0t160 0" className="ec-strata" />
        <g clipPath={`url(#${id}-under)`}>
          {[14, 28, 42, 56].map((r) => <circle key={r} cx="50" cy="158" r={r} className="ec-wave-ring" style={{ opacity: 1 - r / 70 }} />)}
        </g>
        <path d="M0 120h320" className="ec-surface" />
        <path d="M50 158q70-26 140-30t76-8" className="ec-wave-path" filter={`url(#${id}-glow)`} />
        <circle cx="50" cy="158" r="5" className="ec-quake-core" filter={`url(#${id}-glow)`} />
        <path d="M248 120a18 14 0 0 1 36 0Z" style={fillUrl(id, 'dome')} />
        <rect x="24" y="8" width="272" height="84" rx="6" className="ec-screen" />
        <path d="M24 50h272M92 8v84M160 8v84M228 8v84" className="ec-screen-grid" />
        <g transform="translate(30 20)"><path d={path} className="ec-trace-line" filter={`url(#${id}-glow)`} /></g>
        <text x="34" y="22" className="ec-svg-note">{t('ins.seismogram')}</text>
        <text x="50" y="190" textAnchor="middle" className="ec-svg-note">{t('ins.quake')}</text>
        <text x="266" y="110" textAnchor="middle" className="ec-svg-note">{t('ins.seismometer')}</text>
      </svg>
    </Art>
  );
}

function InteriorArt() {
  const { t } = useT();
  const id = useSvgId('interior');
  return (
    <Art caption={t('ins.artInterior')}>
      <svg className="ec-art ec-diagram" viewBox="0 0 240 240" role="img" aria-label={t('ins.artInteriorAria')}>
        <defs><MarsLayerGradients id={id} /><GlowFilter id={id} blur={1.8} /></defs>
        <circle cx="120" cy="120" r="100" className="ec-layer" style={fillUrl(id, 'crust')} />
        <circle cx="120" cy="120" r="90" className="ec-layer" style={fillUrl(id, 'mantle')} />
        <circle cx="120" cy="120" r="46" className="ec-layer" style={fillUrl(id, 'core')} />
        <circle cx="120" cy="120" r="100" style={fillUrl(id, 'shine')} />
        <g filter={`url(#${id}-glow)`}>
          <path d="M50 56Q120 160 196 62" className="ec-wave-path" />
          <path d="M50 56Q110 90 140 76" className="ec-wave-path" />
        </g>
        <text x="120" y="124" textAnchor="middle" className="ec-svg-label">{t('ins.svgCore')}</text>
        <text x="120" y="190" textAnchor="middle" className="ec-svg-label">{t('ins.svgMantle')}</text>
        <text x="120" y="14" textAnchor="middle" className="ec-svg-label">{t('ins.svgCrust')}</text>
      </svg>
    </Art>
  );
}

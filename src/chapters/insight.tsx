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
import { Art, ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { ChoiceList, Feedback, Stage } from './shared/GameParts.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

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
      visual={kind === 'hook' ? <LanderArt /> : kind === 'problem' ? <SeismometerArt /> : kind === 'reveal' ? <InteriorArt /> : undefined}
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
  const result = choice ? evaluateChoice(content.layers, choice) : null;

  return (
    <>
      <div className="ec-layer-explorer">
        <svg className="ec-art ec-lineart ec-cutaway" viewBox="0 0 220 220" role="img" aria-label={t('ins.cutawayAria', { layer: t(active.name) })}>
          <circle cx="110" cy="110" r="100" className={`ec-layer ec-layer--crust${layer === 'crust' ? ' is-active' : ''}`} />
          <circle cx="110" cy="110" r="90" className={`ec-layer ec-layer--mantle${layer === 'mantle' ? ' is-active' : ''}`} />
          <circle cx="110" cy="110" r="46" className={`ec-layer ec-layer--core${layer === 'core' ? ' is-active' : ''}`} />
          <path d="M40 46Q110 150 186 52" className="ec-wave-path" />
          <path d="M40 46Q100 80 130 66" className="ec-wave-path" />
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

function LanderArt() {
  const { t } = useT();
  return (
    <Art caption={t('ins.artLander')} decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label={t('ins.artLanderAria')}>
        <path d="M0 168q100-10 180-4t140-6v62H0Z" className="ec-ground" />
        <g transform="translate(58 108)" className="ec-rover-line">
          <ellipse cx="0" cy="18" rx="36" ry="14" />
          <ellipse cx="150" cy="18" rx="36" ry="14" />
          <path d="M-36 18h72M114 18h72M0 4v28M150 4v28" />
          <path d="M40 4h70v30H40Z" />
          <path d="M50 34l-8 22m58-22 8 22" />
        </g>
        <path d="M228 168a20 16 0 0 1 40 0Z" className="ec-dome" />
        <path d="M248 152v-6" className="ec-leg" />
        <text x="248" y="190" textAnchor="middle" className="ec-svg-note">{t('ins.domeNote')}</text>
      </svg>
    </Art>
  );
}

function SeismometerArt() {
  const { t } = useT();
  const path = useMemo(() => waveformPath(syntheticWaveform('event', 160), 260, 60), []);
  return (
    <Art caption={t('ins.artSeis')}>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 200" role="img" aria-label={t('ins.artSeisAria')}>
        <path d="M10 120h300" className="ec-leg" />
        <circle cx="50" cy="150" r="6" className="ec-quake" />
        <path d="M50 150q60-20 120-28t96-2" className="ec-wave-path" />
        <path d="M250 120a16 12 0 0 1 32 0Z" className="ec-dome" />
        <g transform="translate(30 20)"><path d={path} className="ec-trace-line" /></g>
        <text x="50" y="176" textAnchor="middle" className="ec-svg-note">{t('ins.quake')}</text>
        <text x="266" y="140" textAnchor="middle" className="ec-svg-note">{t('ins.seismometer')}</text>
        <text x="160" y="96" textAnchor="middle" className="ec-svg-note">{t('ins.seismogram')}</text>
      </svg>
    </Art>
  );
}

function InteriorArt() {
  const { t } = useT();
  return (
    <Art caption={t('ins.artInterior')}>
      <svg className="ec-art ec-lineart" viewBox="0 0 240 240" role="img" aria-label={t('ins.artInteriorAria')}>
        <circle cx="120" cy="120" r="100" className="ec-layer ec-layer--crust" />
        <circle cx="120" cy="120" r="90" className="ec-layer ec-layer--mantle" />
        <circle cx="120" cy="120" r="46" className="ec-layer ec-layer--core" />
        <path d="M50 56Q120 160 196 62" className="ec-wave-path" />
        <path d="M50 56Q110 90 140 76" className="ec-wave-path" />
        <text x="120" y="124" textAnchor="middle" className="ec-svg-label">{t('ins.svgCore')}</text>
        <text x="120" y="190" textAnchor="middle" className="ec-svg-label">{t('ins.svgMantle')}</text>
        <text x="120" y="14" textAnchor="middle" className="ec-svg-label">{t('ins.svgCrust')}</text>
      </svg>
    </Art>
  );
}

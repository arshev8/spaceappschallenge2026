import { useMemo, useState } from 'react';
import {
  EVENT_ARRIVALS,
  EVENT_CASE_ID,
  GAP_CHOICES,
  LAYER_CHOICES,
  WAVE_CASES,
  evaluateChoice,
  evaluateWaveChoice,
  insightGatePassed,
  peakPercent,
  syntheticWaveform,
  waveformPath,
} from '../content/experiments.ts';
import { MISSIONS } from '../content/missions.ts';
import { Art, ChapterFrame, IllustrativeBadge, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { ChoiceList, Feedback, Stage } from './shared/GameParts.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

const TRACE_W = 400;
const TRACE_H = 70;

const LAYERS = [
  { id: 'crust', name: 'Crust', text: 'The thin, rocky outer shell. When waves cross from the crust into the layer below, they change speed — and that change shows up in the recording.' },
  { id: 'mantle', name: 'Mantle', text: 'A thick layer of rock beneath the crust. Most of a quake’s waves spend their journey here, and their timing reveals how this layer behaves.' },
  { id: 'core', name: 'Core', text: 'The center of the planet. Some waves bounce off its edge. Those echoes give scientists a way to study a place no one can ever visit.' },
] as const;

export default function InSightChapter({ onComplete, onBack }: ChapterProps) {
  const [waveChoice, setWaveChoice] = useState<string | null>(null);
  const [gapChoice, setGapChoice] = useState<string | null>(null);
  const [layerChoice, setLayerChoice] = useState<string | null>(null);
  const solved = insightGatePassed(waveChoice, gapChoice, layerChoice);
  const flow = useChapterFlow('insight', () => solved);
  const kind = flow.scene.kind;
  const waveCorrect = evaluateWaveChoice(waveChoice).correct;
  const gapCorrect = evaluateChoice(GAP_CHOICES, gapChoice).correct;
  const layerCorrect = evaluateChoice(LAYER_CHOICES, layerChoice).correct;

  return (
    <ChapterFrame
      id="insight"
      kicker="Chapter 03 · Mars"
      theme="mars"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint="Finish all three investigation steps to continue."
      visual={kind === 'hook' ? <LanderArt /> : kind === 'problem' ? <SeismometerArt /> : kind === 'reveal' ? <InteriorArt /> : undefined}
    >
      {kind === 'experiment' && (
        <div className="ec-game">
          <IllustrativeBadge>Synthetic illustrative seismograms, made for this lesson. Not real NASA measurements or recordings.</IllustrativeBadge>
          <Stage number={1} title="Find the likely marsquake" done={waveCorrect}>
            <TracePicker choice={waveChoice} onChoose={setWaveChoice} />
          </Stage>
          <Stage number={2} title="Read the two arrivals" done={gapCorrect} locked={!waveCorrect} lockedText="Find the marsquake trace first.">
            <GapQuestion choice={gapChoice} onChoose={setGapChoice} />
          </Stage>
          <Stage number={3} title="Look inside Mars" done={layerCorrect} locked={!gapCorrect} lockedText="Answer the arrival question first.">
            <LayerExplorer choice={layerChoice} onChoose={setLayerChoice} />
          </Stage>
        </div>
      )}
      {kind === 'reveal' && (
        <>
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
  const data = useMemo(
    () => Object.fromEntries(WAVE_CASES.map((w) => {
      const values = syntheticWaveform(w.id);
      return [w.id, { path: waveformPath(values, TRACE_W, TRACE_H), peak: peakPercent(values) }];
    })),
    [],
  );
  const result = choice ? evaluateWaveChoice(choice) : null;

  return (
    <>
      <fieldset className="ec-fieldset">
        <legend>Which trace most likely shows a marsquake or an impact? Each trace is described in words as well.</legend>
        <ul className="ec-choice-list">
          {WAVE_CASES.map((w) => (
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
      <Feedback ok={Boolean(result?.correct)}>{result?.feedback}</Feedback>
      <div className="ec-table-wrap" role="region" aria-label="Signal summary table (scrolls sideways on small screens)" tabIndex={0}>
        <table className="ec-table">
          <caption>Signal summary: the same three synthetic traces as a table</caption>
          <thead>
            <tr>
              <th scope="col">Trace</th>
              <th scope="col">Biggest wiggle</th>
              <th scope="col">Sudden start?</th>
              <th scope="col">Second, later arrival?</th>
              <th scope="col">Overall shape</th>
            </tr>
          </thead>
          <tbody>
            {WAVE_CASES.map((w) => (
              <tr key={w.id}>
                <th scope="row">{w.label}</th>
                <td>{data[w.id].peak}% of full scale</td>
                <td>{w.suddenStart ? 'Yes' : 'No'}</td>
                <td>{w.secondArrival ? 'Yes' : 'No'}</td>
                <td>{w.shape}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ec-small ec-muted">
        Tip: noise (like wind) can be big, too. What gives a quake away is its pattern — a sudden start, then a second arrival.
      </p>
    </>
  );
}

function GapQuestion({ choice, onChoose }: { choice: string | null; onChoose: (id: string) => void }) {
  const path = useMemo(() => waveformPath(syntheticWaveform(EVENT_CASE_ID), TRACE_W, 140), []);
  const pX = EVENT_ARRIVALS.p * TRACE_W;
  const sX = EVENT_ARRIVALS.s * TRACE_W;
  const result = choice ? evaluateChoice(GAP_CHOICES, choice) : null;

  return (
    <>
      <p className="ec-body">
        A quake sends out different kinds of waves. <strong>P waves</strong> (primary) travel fastest and arrive first. <strong>S waves</strong> (secondary) are slower and arrive later.
      </p>
      <svg className="ec-trace ec-trace--large" viewBox={`0 0 ${TRACE_W} 140`} preserveAspectRatio="none" role="img" aria-label="Trace B, synthetic seismogram, with the P-wave arrival marked by a dashed line labeled P, the S-wave arrival by a dashed line labeled S, and a bar showing the gap between them.">
        <path d={path} />
        <line x1={pX} y1="16" x2={pX} y2="132" className="ec-marker-p" />
        <line x1={sX} y1="16" x2={sX} y2="132" className="ec-marker-s" />
        <line x1={pX} y1="12" x2={sX} y2="12" className="ec-gap-bar" />
      </svg>
      <div className="ec-trace-legend" aria-hidden="true">
        <span><i className="ec-key-p" /> P · first arrival (solid teal line)</span>
        <span><i className="ec-key-s" /> S · second arrival (dashed amber line)</span>
        <span><i className="ec-key-gap" /> gap between them</span>
      </div>
      <ChoiceList name="insight-gap" legend="If the gap between the P and S arrivals were bigger, the event happened…" choices={GAP_CHOICES} value={choice} onChange={onChoose} />
      <Feedback ok={Boolean(result?.correct)}>{result?.feedback}</Feedback>
    </>
  );
}

function LayerExplorer({ choice, onChoose }: { choice: string | null; onChoose: (id: string) => void }) {
  const [layer, setLayer] = useState<(typeof LAYERS)[number]['id']>('crust');
  const active = LAYERS.find((l) => l.id === layer) ?? LAYERS[0];
  const result = choice ? evaluateChoice(LAYER_CHOICES, choice) : null;

  return (
    <>
      <div className="ec-layer-explorer">
        <svg className="ec-art ec-lineart ec-cutaway" viewBox="0 0 220 220" role="img" aria-label={`Simplified cut-away of Mars with three layers. ${active.name} highlighted.`}>
          <circle cx="110" cy="110" r="100" className={`ec-layer ec-layer--crust${layer === 'crust' ? ' is-active' : ''}`} />
          <circle cx="110" cy="110" r="90" className={`ec-layer ec-layer--mantle${layer === 'mantle' ? ' is-active' : ''}`} />
          <circle cx="110" cy="110" r="46" className={`ec-layer ec-layer--core${layer === 'core' ? ' is-active' : ''}`} />
          <path d="M40 46Q110 150 186 52" className="ec-wave-path" />
          <path d="M40 46Q100 80 130 66" className="ec-wave-path" />
          <text x="110" y="214" textAnchor="middle" className="ec-svg-note">not to scale</text>
        </svg>
        <div>
          <div className="ec-segmented" role="group" aria-label="Choose a layer to explore">
            {LAYERS.map((l) => (
              <button key={l.id} type="button" className={`ec-btn ec-btn--small${layer === l.id ? ' ec-btn--selected' : ''}`} aria-pressed={layer === l.id} onClick={() => setLayer(l.id)}>
                {l.name}
              </button>
            ))}
          </div>
          <p className="ec-layer-text" aria-live="polite">
            <strong>{active.name}: </strong>
            {active.text}
          </p>
        </div>
      </div>
      <ChoiceList name="insight-layer" legend="Waves change speed and direction when they reach a new layer. What can that tell scientists?" choices={LAYER_CHOICES} value={choice} onChange={onChoose} />
      <Feedback ok={Boolean(result?.correct)}>{result?.feedback}</Feedback>
    </>
  );
}

function LanderArt() {
  return (
    <Art caption="Line illustration, not a NASA photograph." decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label="Line illustration: a lander with two round solar panels; a dome-covered seismometer sits on the ground beside it.">
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
        <text x="248" y="190" textAnchor="middle" className="ec-svg-note">seismometer under its dome</text>
      </svg>
    </Art>
  );
}

function SeismometerArt() {
  const path = useMemo(() => waveformPath(syntheticWaveform('event', 160), 260, 60), []);
  return (
    <Art caption="Simplified diagram. The trace is a synthetic illustration.">
      <svg className="ec-art ec-lineart" viewBox="0 0 320 200" role="img" aria-label="Diagram: waves travel from a marsquake through the ground to a seismometer, which draws a wiggly line called a seismogram.">
        <path d="M10 120h300" className="ec-leg" />
        <circle cx="50" cy="150" r="6" className="ec-quake" />
        <path d="M50 150q60-20 120-28t96-2" className="ec-wave-path" />
        <path d="M250 120a16 12 0 0 1 32 0Z" className="ec-dome" />
        <g transform="translate(30 20)"><path d={path} className="ec-trace-line" /></g>
        <text x="50" y="176" textAnchor="middle" className="ec-svg-note">quake</text>
        <text x="266" y="140" textAnchor="middle" className="ec-svg-note">seismometer</text>
        <text x="160" y="96" textAnchor="middle" className="ec-svg-note">seismogram (synthetic)</text>
      </svg>
    </Art>
  );
}

function InteriorArt() {
  return (
    <Art caption="Simplified diagram — layers and wave paths are not to scale.">
      <svg className="ec-art ec-lineart" viewBox="0 0 240 240" role="img" aria-label="Simplified diagram: Mars cut open showing a thin crust, a thick mantle and a central core, with curved wave paths from a quake to a lander.">
        <circle cx="120" cy="120" r="100" className="ec-layer ec-layer--crust" />
        <circle cx="120" cy="120" r="90" className="ec-layer ec-layer--mantle" />
        <circle cx="120" cy="120" r="46" className="ec-layer ec-layer--core" />
        <path d="M50 56Q120 160 196 62" className="ec-wave-path" />
        <path d="M50 56Q110 90 140 76" className="ec-wave-path" />
        <text x="120" y="124" textAnchor="middle" className="ec-svg-label">CORE</text>
        <text x="120" y="190" textAnchor="middle" className="ec-svg-label">MANTLE</text>
        <text x="120" y="14" textAnchor="middle" className="ec-svg-label">CRUST</text>
      </svg>
    </Art>
  );
}

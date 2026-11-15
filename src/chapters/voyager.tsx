import { useId, useState } from 'react';
import { MATCH_OPTIONS, evaluateMatches } from '../content/experiments.ts';
import { useContent } from '../content/useContent.ts';
import { useT } from '../i18n';
import { MEDIA } from '../app/media.ts';
import { Art, ChapterFrame, ScenePhoto, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { GlowFilter } from './shared/DiagramDefs.tsx';
import { fillUrl, useSvgId } from './shared/svg.ts';
import { Feedback } from './shared/GameParts.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

export default function VoyagerChapter({ onComplete, onBack }: ChapterProps) {
  const { t } = useT();
  const content = useContent();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, string> | null>(null);
  const solved = checkedAnswers !== null && evaluateMatches(checkedAnswers).correct;
  const flow = useChapterFlow(content.scripts.voyager, () => solved);
  const kind = flow.scene.kind;

  return (
    <ChapterFrame
      id="voyager"
      kicker={t('voy.kicker')}
      theme="deep"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint={t('voy.gate')}
      visual={kind === 'hook' ? <ScenePhoto media={MEDIA.voyager2Jpl} /> : kind === 'problem' ? <HeliosphereArt /> : flow.scene.id === 'golden-record' ? <ScenePhoto media={MEDIA.goldenRecord} /> : undefined}
      discoveryExtra={
        <>
          <p className="ec-question">
            <span className="ec-visually-hidden">{t('voy.thinkAbout')}</span>
            {content.futureQuestion}
          </p>
          <p className="ec-muted ec-small">
            {t('voy.noNeed')} <SourceLink id="voyager" />.
          </p>
        </>
      }
    >
      {kind === 'problem' && (
        <>
          <Timeline entries={content.missions.voyager.chronology} />
          <p className="ec-muted ec-small">
            {t('voy.power')} <SourceLink id="voyagerLecp" />.
          </p>
        </>
      )}
      {kind === 'experiment' && (
        <StatusMatcher
          answers={answers}
          checked={checkedAnswers}
          onChange={(id, value) => {
            setAnswers((a) => ({ ...a, [id]: value }));
            setCheckedAnswers(null);
          }}
          onCheck={() => setCheckedAnswers({ ...answers })}
        />
      )}
      {flow.scene.id === 'golden-record' && <GoldenRecord />}
    </ChapterFrame>
  );
}

function StatusMatcher({
  answers,
  checked,
  onChange,
  onCheck,
}: {
  answers: Record<string, string>;
  checked: Record<string, string> | null;
  onChange: (id: string, value: string) => void;
  onCheck: () => void;
}) {
  const { t } = useT();
  const content = useContent();
  const baseId = useId();
  const result = checked ? evaluateMatches(checked) : null;
  const allAnswered = content.matches.every((m) => answers[m.id]);

  return (
    <div className="ec-game">
      <div className="ec-stage">
        <ul className="ec-match">
          {content.matches.map((item) => {
            const selectId = `${baseId}-${item.id}`;
            const ok = result?.results[item.id];
            return (
              <li key={item.id} className={result ? (ok ? 'is-right' : 'is-retry') : undefined}>
                <label htmlFor={selectId}><strong>{item.label}</strong></label>
                <select id={selectId} value={answers[item.id] ?? ''} onChange={(e) => onChange(item.id, e.target.value)}>
                  <option value="" disabled>{t('voy.choose')}</option>
                  {MATCH_OPTIONS.map((opt) => <option key={opt} value={opt}>{content.statusLabels[opt]}</option>)}
                </select>
                {result && (
                  <p className="ec-match-result">
                    <span className={ok ? 'ec-mark-ok' : 'ec-mark-bad'}>{ok ? t('voy.correct') : t('voy.notQuite')}</span>{' '}
                    {ok ? item.explanation : t('voy.hint', { hint: item.hint })}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <div className="ec-row ec-row--spaced">
          <button type="button" className="ec-btn ec-btn--primary" onClick={onCheck} disabled={!allAnswered}>{t('voy.check')}</button>
          {!allAnswered && <span className="ec-hint">{t('voy.chooseAll')}</span>}
        </div>
        <Feedback ok={Boolean(result?.correct)} okTag={t('voy.allFour')} tryTag={result ? t('voy.score', { score: result.score, total: content.matches.length }) : undefined}>
          {result && (result.correct ? t('voy.successText') : t('voy.tryText'))}
        </Feedback>
      </div>
    </div>
  );
}

function GoldenRecord() {
  const { t } = useT();
  const content = useContent();
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  return (
    <div className="ec-game">
      <div className="ec-stage">
        <p className="ec-mini-heading">{t('voy.recordTitle', { n: opened.size, total: content.goldenRecord.length })}</p>
        <div className="ec-record-grid">
          {content.goldenRecord.map((item) => (
            <details
              key={item.id}
              className="ec-record-item"
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) setOpened((s) => new Set(s).add(item.id));
              }}
            >
              <summary>
                <span>{item.title}</span>
                {opened.has(item.id) && <span className="ec-record-seen"><span aria-hidden="true">✓</span><span className="ec-visually-hidden">{t('voy.opened')}</span></span>}
              </summary>
              <p>{item.fact}</p>
            </details>
          ))}
        </div>
        <p className="ec-small ec-muted">
          {t('voy.factsFrom')} <SourceLink id="goldenRecord" />. {t('voy.noReproduce')}
        </p>
      </div>
    </div>
  );
}

const HELIO_STARS = [[18,24],[44,70],[22,150],[60,196],[268,120],[300,150],[284,196],[250,206],[306,92],[236,14],[190,8],[96,10],[12,98],[300,6],[260,68],[204,214],[30,204],[140,214]] as const;

function HeliosphereArt() {
  const { t } = useT();
  const id = useSvgId('helio');
  return (
    <Art caption={t('voy.artHelio')}>
      <svg className="ec-art ec-diagram" viewBox="0 0 320 220" role="img" aria-label={t('voy.artHelioAria')}>
        <defs>
          <radialGradient id={`${id}-bubble`} cx="130" cy="110" r="120" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffd27a" stopOpacity="0.32" />
            <stop offset="0.45" stopColor="#c9a8ff" stopOpacity="0.14" />
            <stop offset="1" stopColor="#8f7cff" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor="#fffbe8" /><stop offset="0.5" stopColor="#ffd27a" /><stop offset="1" stopColor="#ff9f43" stopOpacity="0" />
          </radialGradient>
          <GlowFilter id={id} blur={3} />
        </defs>
        {HELIO_STARS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.2 : 0.7} className="ec-star" />)}
        <ellipse cx="140" cy="110" rx="110" ry="84" className="ec-helio" style={fillUrl(id, 'bubble')} />
        <circle cx="130" cy="110" r="22" style={fillUrl(id, 'sun')} />
        <circle cx="130" cy="110" r="5" className="ec-sun" />
        <path d="M130 110Q210 70 290 40" className="ec-beam" />
        <circle cx="290" cy="40" r="3.5" className="ec-probe-dot" filter={`url(#${id}-glow)`} />
        <text x="140" y="212" textAnchor="middle" className="ec-svg-note">{t('voy.heliosphere')}</text>
        <text x="300" y="66" textAnchor="end" className="ec-svg-label">{t('voy.svgVoyager')}</text>
        <text x="300" y="18" textAnchor="end" className="ec-svg-note">{t('voy.interstellar')}</text>
      </svg>
    </Art>
  );
}


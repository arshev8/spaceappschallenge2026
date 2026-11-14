import { useId, useState } from 'react';
import { MATCH_OPTIONS, evaluateMatches } from '../content/experiments.ts';
import { useContent } from '../content/useContent.ts';
import { useT } from '../i18n';
import { Art, ChapterFrame, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
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
      visual={kind === 'hook' ? <VoyagerArt /> : kind === 'problem' ? <HeliosphereArt /> : flow.scene.id === 'golden-record' ? <RecordArt /> : undefined}
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

function VoyagerArt() {
  const { t } = useT();
  return (
    <Art caption={t('voy.artVoyager')} decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label={t('voy.artVoyagerAria')}>
        {Array.from({ length: 34 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 320} cy={(i * 53) % 220} r={i % 5 === 0 ? 1.3 : 0.7} className="ec-star" />
        ))}
        <circle cx="26" cy="186" r="5" className="ec-sun" />
        <path d="M26 186Q140 150 200 108" className="ec-beam" />
        <g transform="translate(220 92)" className="ec-rover-line">
          <ellipse cx="0" cy="0" rx="34" ry="12" transform="rotate(-25)" />
          <path d="M-8 8h16v12H-8Z" />
          <path d="M8 16l62 12M-8 16l-34 28M0 20v26" />
        </g>
      </svg>
    </Art>
  );
}

function HeliosphereArt() {
  const { t } = useT();
  return (
    <Art caption={t('voy.artHelio')}>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label={t('voy.artHelioAria')}>
        <ellipse cx="140" cy="110" rx="110" ry="84" className="ec-bubble" />
        <circle cx="130" cy="110" r="7" className="ec-sun" />
        <path d="M130 110Q210 70 290 40" className="ec-beam" />
        <circle cx="290" cy="40" r="4" className="ec-probe" />
        <text x="140" y="212" textAnchor="middle" className="ec-svg-note">{t('voy.heliosphere')}</text>
        <text x="300" y="66" textAnchor="end" className="ec-svg-label">{t('voy.svgVoyager')}</text>
        <text x="300" y="18" textAnchor="end" className="ec-svg-note">{t('voy.interstellar')}</text>
      </svg>
    </Art>
  );
}

function RecordArt() {
  const { t } = useT();
  return (
    <Art caption={t('voy.artRecord')} decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 220 220" role="img" aria-label={t('voy.artRecordAria')}>
        {[96, 80, 64, 48].map((r) => <circle key={r} cx="110" cy="110" r={r} className="ec-groove" />)}
        <circle cx="110" cy="110" r="22" className="ec-record-label" />
        <circle cx="110" cy="110" r="3" className="ec-star" />
      </svg>
    </Art>
  );
}

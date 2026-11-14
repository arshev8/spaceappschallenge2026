import { useId, useState } from 'react';
import { MATCH_ITEMS, MATCH_OPTIONS, evaluateMatches } from '../content/experiments.ts';
import { MISSIONS, STATUS_LABELS } from '../content/missions.ts';
import { FUTURE_QUESTION } from '../content/scripts.ts';
import { ChapterFrame, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

export default function VoyagerChapter({ onComplete, onBack }: ChapterProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, string> | null>(null);
  const solved = checkedAnswers !== null && evaluateMatches(checkedAnswers).correct;
  const flow = useChapterFlow('voyager', () => solved);

  return (
    <ChapterFrame
      id="voyager"
      kicker="Epilogue · Interstellar space"
      theme="deep"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint="Match all four machines correctly to continue."
      discoveryExtra={
        <>
          <p className="ec-question">
            <span className="ec-visually-hidden">Question to think about: </span>
            {FUTURE_QUESTION}
          </p>
          <p className="ec-muted ec-small">
            No need to type an answer — talk it over with a friend, or keep it in mind as you explore. Follow Voyager’s
            progress at <SourceLink id="voyager" />.
          </p>
        </>
      }
    >
      {flow.scene.kind === 'hook' && <VoyagerArt />}
      {flow.scene.kind === 'problem' && (
        <>
          <Timeline entries={MISSIONS.voyager.chronology} />
          <p className="ec-muted ec-small">
            Power and instruments: <SourceLink id="voyagerLecp" />.
          </p>
        </>
      )}
      {flow.scene.kind === 'experiment' && (
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
  const baseId = useId();
  const result = checked ? evaluateMatches(checked) : null;
  const allAnswered = MATCH_ITEMS.every((m) => answers[m.id]);

  return (
    <div className="ec-panel">
      <ul className="ec-match">
        {MATCH_ITEMS.map((item) => {
          const selectId = `${baseId}-${item.id}`;
          const ok = result?.results[item.id];
          return (
            <li key={item.id}>
              <label htmlFor={selectId}>
                <strong>{item.label}</strong>
              </label>
              <select id={selectId} value={answers[item.id] ?? ''} onChange={(e) => onChange(item.id, e.target.value)}>
                <option value="" disabled>
                  Choose a status…
                </option>
                {MATCH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {STATUS_LABELS[opt]}
                  </option>
                ))}
              </select>
              {result && (
                <p className="ec-match-result">
                  <span className={ok ? 'ec-mark-ok' : 'ec-mark-bad'}>{ok ? '✓ Correct.' : '✗ Not quite.'}</span>{' '}
                  {ok ? item.explanation : 'Look back at what happened to this machine and try another status.'}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <div className="ec-row" style={{ marginTop: '0.8rem' }}>
        <button type="button" className="ec-btn ec-btn--primary" onClick={onCheck} disabled={!allAnswered}>
          Check answers
        </button>
      </div>
      <div aria-live="polite">
        {result && (
          <p className={`ec-feedback ${result.correct ? 'ec-feedback--ok' : 'ec-feedback--try'}`}>
            {result.correct
              ? '✓ All four! One mirror still useful without power, two missions complete, and one explorer still sending news from beyond the planets.'
              : `${result.score} of ${MATCH_ITEMS.length} correct. Change the ones marked ✗ and check again.`}
          </p>
        )}
      </div>
    </div>
  );
}

function VoyagerArt() {
  return (
    <>
      <svg
        className="ec-art"
        viewBox="0 0 400 200"
        role="img"
        aria-label="Illustration: a spacecraft with a large dish antenna flying among distant stars, far from a small bright Sun."
      >
        <rect width="400" height="200" fill="#050816" />
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 400} cy={(i * 53) % 200} r={i % 5 === 0 ? 1.4 : 0.8} fill="#fff" opacity="0.7" />
        ))}
        <circle cx="30" cy="160" r="6" fill="#ffe08a" />
        <path d="M30 160 Q160 120 250 90" fill="none" stroke="#b9a7ff" strokeDasharray="3 6" opacity="0.6" />
        <g transform="translate(270 70)">
          <ellipse cx="0" cy="20" rx="34" ry="12" fill="#e8e4d8" transform="rotate(-25 0 20)" />
          <rect x="-8" y="26" width="16" height="12" fill="#b8b2a3" />
          <line x1="8" y1="34" x2="70" y2="44" stroke="#ccc" strokeWidth="2" />
          <line x1="-8" y1="34" x2="-40" y2="60" stroke="#ccc" strokeWidth="2" />
        </g>
      </svg>
      <p className="ec-art-caption">Illustration, not a NASA image. Distances are not to scale.</p>
    </>
  );
}

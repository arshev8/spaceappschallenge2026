import { useId, useState } from 'react';
import { GOLDEN_RECORD_ITEMS, MATCH_ITEMS, MATCH_OPTIONS, evaluateMatches } from '../content/experiments.ts';
import { MISSIONS, STATUS_LABELS } from '../content/missions.ts';
import { FUTURE_QUESTION } from '../content/scripts.ts';
import { Art, ChapterFrame, SourceLink, Timeline } from './shared/ChapterFrame.tsx';
import { Feedback } from './shared/GameParts.tsx';
import { useChapterFlow } from './shared/useChapterFlow.ts';

type ChapterProps = { onComplete: () => void; onBack: () => void };

export default function VoyagerChapter({ onComplete, onBack }: ChapterProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, string> | null>(null);
  const solved = checkedAnswers !== null && evaluateMatches(checkedAnswers).correct;
  const flow = useChapterFlow('voyager', () => solved);
  const kind = flow.scene.kind;

  return (
    <ChapterFrame
      id="voyager"
      kicker="Epilogue · Interstellar space"
      theme="deep"
      flow={flow}
      onBack={onBack}
      onComplete={onComplete}
      gateHint="Match all four machines correctly to continue."
      visual={kind === 'hook' ? <VoyagerArt /> : kind === 'problem' ? <HeliosphereArt /> : flow.scene.id === 'golden-record' ? <RecordArt /> : undefined}
      discoveryExtra={
        <>
          <p className="ec-question">
            <span className="ec-visually-hidden">Question to think about: </span>
            {FUTURE_QUESTION}
          </p>
          <p className="ec-muted ec-small">
            No need to type an answer. Talk it over with a friend, or keep it in mind as you explore. Follow Voyager’s progress at <SourceLink id="voyager" />.
          </p>
        </>
      }
    >
      {kind === 'problem' && (
        <>
          <Timeline entries={MISSIONS.voyager.chronology} />
          <p className="ec-muted ec-small">
            Power and instruments: <SourceLink id="voyagerLecp" />.
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
  const baseId = useId();
  const result = checked ? evaluateMatches(checked) : null;
  const allAnswered = MATCH_ITEMS.every((m) => answers[m.id]);

  return (
    <div className="ec-game">
      <div className="ec-stage">
        <ul className="ec-match">
          {MATCH_ITEMS.map((item) => {
            const selectId = `${baseId}-${item.id}`;
            const ok = result?.results[item.id];
            return (
              <li key={item.id} className={result ? (ok ? 'is-right' : 'is-retry') : undefined}>
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
                    <span className={ok ? 'ec-mark-ok' : 'ec-mark-bad'}>{ok ? '✓ Correct.' : '↻ Not quite.'}</span>{' '}
                    {ok ? item.explanation : `Hint: ${item.hint}`}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <div className="ec-row ec-row--spaced">
          <button type="button" className="ec-btn ec-btn--primary" onClick={onCheck} disabled={!allAnswered}>
            Check answers
          </button>
          {!allAnswered && <span className="ec-hint">Choose a status for all four machines first.</span>}
        </div>
        <Feedback ok={Boolean(result?.correct)} okTag="All four!" tryTag={result ? `${result.score} of ${MATCH_ITEMS.length} correct` : undefined}>
          {result && (result.correct
            ? 'One mirror still useful without power, two missions complete, and one explorer still sending news from beyond the planets.'
            : 'Read the hints, change the ones marked “Not quite” and check again.')}
        </Feedback>
      </div>
    </div>
  );
}

function GoldenRecord() {
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  return (
    <div className="ec-game">
      <div className="ec-stage">
        <p className="ec-mini-heading">Explore the Golden Record · {opened.size} of {GOLDEN_RECORD_ITEMS.length} opened</p>
        <div className="ec-record-grid">
          {GOLDEN_RECORD_ITEMS.map((item) => (
            <details
              key={item.id}
              className="ec-record-item"
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) setOpened((s) => new Set(s).add(item.id));
              }}
            >
              <summary>
                <span>{item.title}</span>
                {opened.has(item.id) && <span className="ec-record-seen"><span aria-hidden="true">✓</span><span className="ec-visually-hidden">(opened)</span></span>}
              </summary>
              <p>{item.fact}</p>
            </details>
          ))}
        </div>
        <p className="ec-small ec-muted">
          Facts from <SourceLink id="goldenRecord" />. ECHOES does not reproduce the record’s images or sounds.
        </p>
      </div>
    </div>
  );
}

function VoyagerArt() {
  return (
    <Art caption="Line illustration, not a NASA image. Distances are not to scale." decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label="Line illustration: a spacecraft with a large dish antenna flying among distant stars, far from a small Sun.">
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
  return (
    <Art caption="Simplified diagram, not to scale.">
      <svg className="ec-art ec-lineart" viewBox="0 0 320 220" role="img" aria-label="Diagram: the Sun at the center of a bubble called the heliosphere; a dotted path shows Voyager 1 crossing the bubble's edge into interstellar space.">
        <ellipse cx="140" cy="110" rx="110" ry="84" className="ec-bubble" />
        <circle cx="130" cy="110" r="7" className="ec-sun" />
        <path d="M130 110Q210 70 290 40" className="ec-beam" />
        <circle cx="290" cy="40" r="4" className="ec-probe" />
        <text x="140" y="212" textAnchor="middle" className="ec-svg-note">heliosphere (the Sun’s bubble)</text>
        <text x="300" y="66" textAnchor="end" className="ec-svg-label">VOYAGER 1</text>
        <text x="300" y="18" textAnchor="end" className="ec-svg-note">interstellar space</text>
      </svg>
    </Art>
  );
}

function RecordArt() {
  return (
    <Art caption="Simplified illustration of a gold-plated record, not a copy of its cover diagrams." decorative>
      <svg className="ec-art ec-lineart" viewBox="0 0 220 220" role="img" aria-label="Illustration: a round gold record with grooves and a small label in the center.">
        {[96, 80, 64, 48].map((r) => <circle key={r} cx="110" cy="110" r={r} className="ec-groove" />)}
        <circle cx="110" cy="110" r="22" className="ec-record-label" />
        <circle cx="110" cy="110" r="3" className="ec-star" />
      </svg>
    </Art>
  );
}

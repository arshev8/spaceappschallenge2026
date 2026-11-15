import { useEffect, useRef, useState } from 'react';
import { award, recordBest } from '../app/explorer';
import { NasaImage } from '../components/NasaImage';
import { useShell } from '../app/l10n';

const LEVEL = { 1: 'ui.q.level1', 2: 'ui.q.level2', 3: 'ui.q.level3' } as const;

export default function Quiz() {
  const { t, questions: QUESTIONS } = useShell();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gain, setGain] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const done = results.length === QUESTIONS.length && picked === null;
  const q = QUESTIONS[index];
  const correctCount = results.filter(Boolean).length;

  useEffect(() => { if (started && !done) heading.current?.focus(); }, [index, started, done]);

  const answer = (choice: number) => {
    if (picked !== null) return;
    const right = choice === q.answer;
    const nextStreak = right ? streak + 1 : 0;
    const points = right ? q.level * 100 + Math.max(0, nextStreak - 1) * 25 : 0;
    setPicked(choice); setStreak(nextStreak); setScore(s => s + points); setGain(points);
    setResults(r => [...r, right]);
    requestAnimationFrame(() => nextButton.current?.focus());
  };
  const next = () => {
    if (index === QUESTIONS.length - 1) {
      setPicked(null);
      award('quiz-cadet');
      if (correctCount >= 8) award('quiz-expert');
      recordBest('quiz', score);
      return;
    }
    setIndex(i => i + 1); setPicked(null); setGain(0);
  };
  const restart = () => { setIndex(0); setPicked(null); setScore(0); setStreak(0); setResults([]); setGain(0); setStarted(true); };

  useEffect(() => {
    if (!started || done) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest('input, textarea')) return;
      const n = Number(event.key);
      if (picked === null && n >= 1 && n <= q.options.length) answer(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!started) return <div className="quiz quiz-intro">
    <h2>{t('ui.q.introTitle')}</h2>
    <ul className="howto"><li>{t('ui.q.how1')}</li><li>{t('ui.q.how2')}</li><li>{t('ui.q.how3')} <kbd>1</kbd>–<kbd>4</kbd>{t('ui.q.how3b')}</li></ul>
    <button type="button" className="button button-primary" onClick={() => setStarted(true)}>{t('ui.q.start')}</button>
  </div>;

  if (done) {
    const rank = t(correctCount >= 9 ? 'ui.q.rank4' : correctCount >= 7 ? 'ui.q.rank3' : correctCount >= 4 ? 'ui.q.rank2' : 'ui.q.rank1');
    return <div className="quiz quiz-done">
      <p className="quiz-rank">{rank}</p>
      <p className="big-score"><span>{score}</span> {t('ui.points')}</p>
      <p>{t('ui.q.correctOf', { n: correctCount, total: QUESTIONS.length })} {t(correctCount >= 8 ? 'ui.q.expertYes' : 'ui.q.expertNo')}</p>
      <ol className="quiz-dots" aria-label={t('ui.q.answers')}>{results.map((r, i) => <li key={i} className={r ? 'is-right' : 'is-wrong'}><span className="sr-only">{t(r ? 'ui.q.answerRight' : 'ui.q.answerWrong', { n: i + 1 })}</span></li>)}</ol>
      <div className="button-row"><button type="button" className="button button-primary" onClick={restart}>{t('ui.q.again')}</button><a className="button button-ghost" href="#/journal">{t('ui.q.seePatches')}</a></div>
    </div>;
  }

  const answered = picked !== null;
  return <div className="quiz">
    <div className="quiz-top">
      <ol className="quiz-dots" aria-label={t('ui.q.progress', { n: index + 1, total: QUESTIONS.length })}>
        {QUESTIONS.map((question, i) => <li key={question.id} className={i < results.length ? (results[i] ? 'is-right' : 'is-wrong') : i === index ? 'is-current' : ''} />)}
      </ol>
      <p className="quiz-score"><span>{score}</span> {t('ui.points')}{streak > 1 && <span className="streak"> · {t('ui.q.streak', { n: streak })}</span>}</p>
    </div>
    <div className="quiz-card" key={q.id}>
      <NasaImage media={q.media} className="quiz-photo" decorative={false} sizes="(max-width: 760px) 100vw, 45vw" />
      <div className="quiz-body">
        <p className={`quiz-level level-${q.level}`}>{t('ui.q.levelLine', { level: t(LEVEL[q.level]), n: index + 1 })}</p>
        <h2 ref={heading} tabIndex={-1}>{q.prompt}</h2>
        <ul className="quiz-options">
          {q.options.map((option, i) => {
            const state = !answered ? '' : i === q.answer ? 'is-right' : i === picked ? 'is-wrong' : 'is-dim';
            return <li key={option}><button type="button" className={`quiz-option ${state}`} onClick={() => answer(i)} disabled={answered && i !== picked && i !== q.answer} aria-disabled={answered}>
              <span className="opt-key" aria-hidden="true">{i + 1}</span>{option}
              {answered && i === q.answer && <span className="sr-only"> {t('ui.q.correctAnswer')}</span>}
            </button></li>;
          })}
        </ul>
        <div className="quiz-feedback" aria-live="polite">
          {answered && <>
            <p className={`feedback-title ${picked === q.answer ? 'is-right' : 'is-wrong'}`}>{picked === q.answer ? t('ui.q.right', { points: gain }) : t('ui.q.wrong', { answer: q.options[q.answer] })}</p>
            <p>{q.fact}</p>
            <button ref={nextButton} type="button" className="button button-primary" onClick={next}>{t(index === QUESTIONS.length - 1 ? 'ui.q.results' : 'ui.q.next')}</button>
          </>}
        </div>
      </div>
    </div>
  </div>;
}

import { motionReduced } from '../app/preferences';
import { useRef, useState, type CSSProperties } from 'react';
import { PATCHES, points, resetLog, useExplorerLog } from '../app/explorer';
import { useShell } from '../app/l10n';
import { MEDIA, type Media } from '../app/media';
import { coreMissions, type ChapterId } from '../app/missions';
import { PLANETS } from '../app/solar';
import { useContent } from '../content/useContent';
import type { MessageKey } from '../i18n';
import { Icon } from './Icon';
import { NasaImage } from './NasaImage';
import { Patch } from './Patch';
import { ProgressMeter } from './ProgressMeter';

/** Each feature gets its own image and layout so the issue reads like a magazine, not a list. */
const FEATURES: Record<'apollo11' | 'opportunity' | 'insight', { media: Media; layout: 'left' | 'full' | 'right' }> = {
  apollo11: { media: MEDIA.a11Easep, layout: 'left' },
  opportunity: { media: MEDIA.oppBurns, layout: 'full' },
  insight: { media: MEDIA.insightFinal, layout: 'right' },
};

export default function Journal({ completed, saved, onReset }: { completed: ChapterId[]; saved: boolean; onReset: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const log = useExplorerLog();
  const content = useContent();
  const { t, locale, exhibit, mission: text, patch: localize } = useShell();
  const count = coreMissions.filter(mission => completed.includes(mission.id)).length;
  const total = points(log, count);
  const nothing = completed.length === 0 && log.patches.length === 0;
  const visited = log.visited.filter(id => PLANETS.some(p => p.id === id)).length;
  const headline: MessageKey = count === 3 ? 'ui.j.hDone' : count === 0 ? 'ui.j.hZero' : 'ui.j.hSome';

  return <section className="journal mag" aria-labelledby="journal-title">
    <header className="mag-cover">
      <NasaImage media={MEDIA.a11Earthrise} decorative bare className="mag-cover-photo" sizes="100vw" eager />
      <div className="mag-cover-inner">
        <div className="mag-masthead">
          <p className="mag-brand">ECHOES</p>
          <h1 id="journal-title">{t('ui.j.title')}</h1>
        </div>
        <div className="mag-cover-lines">
          <h2>{t(headline)}</h2>
          <p>{t(count === 0 ? 'ui.j.pZero' : count === 3 ? 'ui.j.ledeDone' : 'ui.j.pSome')}</p>
          <ul>{coreMissions.map(m => <li key={m.id} className={completed.includes(m.id) ? 'is-done' : ''}>
            <span className="mag-tick" aria-hidden="true">{completed.includes(m.id) ? <Icon name="check" size={14} /> : null}</span>
            <button type="button" className="mag-line" onClick={() => document.getElementById(`mag-${m.id}`)?.scrollIntoView({ behavior: motionReduced() ? 'auto' : 'smooth', block: 'start' })}>{t(`m.${m.id}.title` as MessageKey)}</button>
          </li>)}</ul>
        </div>
        <div className="mag-cover-meta">
          <div className="points" aria-label={t('ui.j.pointsAria', { points: total })}><span className="points-value">{total.toLocaleString(locale)}</span><span className="points-label">{t('ui.j.pointsLabel')}</span></div>
          <ProgressMeter count={count} />
          <a className="button button-ghost" href="#/atlas">{t(count === 0 ? 'ui.j.find' : 'ui.title.atlas')}<Icon name="arrow" size={16} /></a>
        </div>
      </div>
    </header>

    <h2 className="sr-only">{t('ui.j.discoveries')}</h2>
    {coreMissions.map(mission => {
      const id = mission.id as keyof typeof FEATURES;
      const feature = FEATURES[id];
      const collected = completed.includes(mission.id);
      const ex = exhibit(mission.id);
      const m = text(mission.id);
      const fact = ex.facts[0];
      return <article key={mission.id} id={`mag-${mission.id}`} className={`mag-feature mag-${feature.layout} ${collected ? 'is-collected' : ''}`} style={{ '--hue': ex.hue } as CSSProperties} aria-labelledby={`mag-h-${mission.id}`}>
        <NasaImage media={feature.media} caption className="mag-photo" sizes={feature.layout === 'full' ? '100vw' : '(max-width: 860px) 100vw, 55vw'} />
        <div className="mag-copy">
          <p className="mag-kicker">{m.name} · {m.place}</p>
          <h3 id={`mag-h-${mission.id}`}>{t(`m.${mission.id}.title` as MessageKey)}</h3>
          <p className="mag-standfirst">{m.summary}</p>
          <p className="mag-body">{content.missions[mission.id].takeaway}</p>
          <p className="mag-pull"><span>{fact.value}</span>{fact.label}</p>
          <div className="mag-foot">
            <span className={`collection-label ${collected ? 'collected' : ''}`}>{collected && <Icon name="check" size={14} />}{t(collected ? 'ui.j.collected' : 'ui.j.notCollected')}</span>
            <a className="text-link" href={`#/chapter/${mission.id}`}>{t(collected ? 'ui.j.revisit' : 'ui.j.explore')}<Icon name="arrow" size={16} /></a>
          </div>
        </div>
      </article>;
    })}

    <article className={`mag-epilogue ${completed.includes('voyager') ? 'is-collected' : ''}`} aria-labelledby="mag-h-voyager">
      <NasaImage media={MEDIA.paleBlueDot} caption className="mag-epilogue-photo" sizes="(max-width: 860px) 100vw, 30vw" />
      <div className="mag-copy">
        <p className="mag-kicker">{t(completed.includes('voyager') ? 'ui.j.epVisited' : 'ui.j.epOpen')}</p>
        <h3 id="mag-h-voyager">{t('ui.j.epTitle')}</h3>
        <p className="mag-standfirst">{text('voyager').summary}</p>
        <p className="mag-body">{content.missions.voyager.takeaway}</p>
        <a className="button button-primary" href="#/chapter/voyager">{t(completed.includes('voyager') ? 'ui.j.epRevisit' : 'ui.j.epMeet')}</a>
      </div>
    </article>

    {count === 3 && <QuickCheck />}

    <section className="mag-collect" aria-labelledby="mag-patches">
      <h2 id="mag-patches" className="journal-section-title">{t('ui.j.patches')} <span>{t('ui.count', { n: log.patches.length, total: PATCHES.length })}</span></h2>
      <ul className="patch-grid">
        {PATCHES.map(source => {
          const patch = localize(source);
          const earned = log.patches.includes(patch.id);
          return <li key={patch.id} className={earned ? 'is-earned' : ''}>
            <Patch patch={patch} earned={earned} />
            <strong>{patch.name}</strong>
            <span>{earned ? t('ui.j.earned', { points: patch.points }) : patch.how}</span>
          </li>;
        })}
      </ul>
    </section>

    <dl className="best-scores">
      <div><dt>{t('ui.j.bestLander')}</dt><dd>{log.best.lander || '—'}</dd></div>
      <div><dt>{t('ui.j.bestQuiz')}</dt><dd>{log.best.quiz || '—'}</dd></div>
      <div><dt>{t('ui.j.inspected')}</dt><dd>{log.inspected.length}</dd></div>
      <div><dt>{t('ui.j.visited')}</dt><dd>{visited} / {PLANETS.length}</dd></div>
    </dl>

    <div className="journal-storage"><p><span className={`storage-dot ${saved ? '' : 'storage-unavailable'}`} aria-hidden="true" />{t(saved ? 'ui.j.saved' : 'ui.j.unsaved')}</p>
      <button className="text-link reset-link" onClick={() => dialog.current?.showModal()} disabled={nothing}><Icon name="reset" size={16} />{t('ui.j.reset')}</button></div>
    <p className="sr-only" role="status">{announcement}</p>
    <dialog ref={dialog} className="reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description">
      <h2 id="reset-title">{t('ui.j.resetTitle')}</h2><p id="reset-description">{t('ui.j.resetText')}</p>
      <form method="dialog" className="button-row" onSubmit={event => { event.preventDefault(); dialog.current?.close(); }}><button className="button button-ghost" autoFocus>{t('ui.j.keep')}</button><button className="button button-danger" onClick={() => { onReset(); resetLog(); setAnnouncement(t('ui.j.resetDone')); }}>{t('ui.j.reset')}</button></form>
    </dialog>
  </section>;
}

/** The three quiz questions that match the three core discoveries (already translated with the quiz). */
const CHECK_IDS = ['q-mirror', 'q-berries', 'q-seis'];

/**
 * Short comprehension check shown once all three discoveries are collected. Nothing is scored or
 * stored: it is a moment to recall what was learned, with the sourced fact after each answer.
 */
function QuickCheck() {
  const { t, questions } = useShell();
  const items = CHECK_IDS.map(id => questions.find(q => q.id === id)).filter(q => q !== undefined);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const answeredCount = items.filter(q => picked[q.id] !== undefined).length;
  const correct = items.filter(q => picked[q.id] === q.answer).length;
  return <section className="mag-check" aria-labelledby="mag-check-title">
    <h2 id="mag-check-title" className="journal-section-title">{t('ui.j.check.title')}</h2>
    <p className="mag-check-intro">{t('ui.j.check.intro')}</p>
    <ol className="check-list">
      {items.map((q, n) => {
        const choice = picked[q.id];
        const answered = choice !== undefined;
        return <li key={q.id}>
          <fieldset>
            <legend>{q.prompt}</legend>
            <div className="check-options">
              {q.options.map((option, i) => {
                const state = !answered ? '' : i === q.answer ? 'is-right' : i === choice ? 'is-wrong' : 'is-dim';
                // aria-disabled (not disabled) keeps keyboard focus on the button that was just pressed.
                return <button key={option} type="button" className={`check-option ${state}`} aria-pressed={choice === i} aria-disabled={answered}
                  onClick={() => { if (!answered) setPicked(p => ({ ...p, [q.id]: i })); }}>
                  {option}{answered && i === q.answer && <span className="sr-only"> {t('ui.q.correctAnswer')}</span>}
                </button>;
              })}
            </div>
            <div aria-live="polite">{answered && <p className={`check-fact ${choice === q.answer ? 'is-right' : 'is-wrong'}`}>
              <strong>{choice === q.answer ? t('ui.q.answerRight', { n: n + 1 }) : t('ui.q.wrong', { answer: q.options[q.answer] })}</strong> {q.fact}
            </p>}</div>
          </fieldset>
        </li>;
      })}
    </ol>
    {answeredCount === items.length && <div className="check-result" role="status">
      <p>{t('ui.j.check.score', { n: correct, total: items.length })}</p>
      <button type="button" className="button button-ghost button-small" onClick={() => setPicked({})}><Icon name="reset" size={16} />{t('ui.j.check.again')}</button>
    </div>}
  </section>;
}

import { useEffect, useRef, useState } from 'react';
import { coreMissions, getMission, type ChapterId } from '../app/missions';
import { getSource } from '../content/missions.ts';
import { useContent } from '../content/useContent.ts';
import { useT } from '../i18n';
import { Icon } from './Icon';
import { MissionArt } from './MissionArt';
import { ProgressMeter } from './ProgressMeter';

type JournalProps = {
  completed: ChapterId[];
  saved: boolean;
  onReset: () => void;
  justCollected?: ChapterId | null;
  onHighlightShown?: () => void;
};

export default function Journal({ completed, saved, onReset, justCollected = null, onHighlightShown }: JournalProps) {
  const { t } = useT();
  const content = useContent();
  const dialog = useRef<HTMLDialogElement>(null);
  const newCard = useRef<HTMLHeadingElement>(null);
  // Keep the "just collected" highlight for this visit only.
  const [highlight] = useState(justCollected);
  const [announcement, setAnnouncement] = useState('');
  const count = coreMissions.filter(mission => completed.includes(mission.id)).length;
  const voyager = getMission('voyager');
  const voyagerVisited = completed.includes('voyager');

  useEffect(() => {
    if (!highlight) return;
    onHighlightShown?.();
    newCard.current?.focus({ preventScroll: true });
    newCard.current?.scrollIntoView?.({ block: 'center' });
  }, [highlight, onHighlightShown]);

  return <section className="journal-page" aria-labelledby="journal-title">
    <div className="page-heading"><div><p className="eyebrow">{t('journal.eyebrow')}</p><h1 id="journal-title">{t('journal.title')}<span>.</span></h1><p>{count === 3 ? t('journal.introDone') : t('journal.intro')}</p></div><ProgressMeter count={count} /></div>
    <div className={`journal-message ${count === 3 ? 'journal-complete' : ''}`}><Icon name={count === 3 ? 'star' : 'book'} size={28} /><div><h2>{count === 3 ? t('journal.msgDone') : count === 0 ? t('journal.msgEmpty') : t('journal.msgGrowing')}</h2><p>{count === 0 ? t('journal.textEmpty') : count === 3 ? t('journal.textDone') : t('journal.textGrowing')}</p></div><a className="button button-secondary" href="#/atlas">{count === 0 ? t('journal.findDiscovery') : t('common.returnToAtlas')}<Icon name="arrow" /></a></div>

    <h2 className="sr-only">{t('journal.cards')}</h2>
    <ul className="journal-grid" role="list">
      {coreMissions.map(mission => {
        const collected = completed.includes(mission.id);
        const info = content.missions[mission.id];
        const source = getSource(info.primarySourceId);
        const first = info.chronology[0];
        const last = info.chronology[info.chronology.length - 1];
        const isNew = collected && highlight === mission.id;
        return <li key={mission.id} className={`journal-card art-${mission.id} ${collected ? 'is-collected' : 'is-locked'} ${isNew ? 'is-new' : ''}`}>
          <div className="journal-card-top">
            <span className="eyebrow">{t('common.discoveryN', { n: mission.number })}</span>
            <span className={`collection-label ${collected ? 'collected' : ''}`}><Icon name={collected ? 'check' : 'lock'} size={14} />{collected ? t('journal.collected') : t('journal.notCollected')}</span>
          </div>
          {isNew && <p className="new-badge"><Icon name="spark" size={14} /> {t('journal.new')}</p>}
          <MissionArt id={mission.id} />
          <p className="eyebrow">{t(`m.${mission.id}.name`)} / {t(`m.${mission.id}.place`)}</p>
          <h3 ref={isNew ? newCard : undefined} tabIndex={isNew ? -1 : undefined}>{collected ? info.takeaway : t(`m.${mission.id}.title`)}</h3>
          {collected ? <dl className="card-facts">
            <div><dt>{t('journal.concept')}</dt><dd>{info.method}</dd></div>
            <div><dt>{t('journal.context')}</dt><dd>{first.date}: {first.event} {last !== first && <>{last.date}: {last.event}</>}</dd></div>
            <div><dt>{t('journal.learned')}</dt><dd>{info.result}</dd></div>
          </dl> : <p className="card-teaser"><span className="card-teaser-label">{t('journal.question')}</span>{info.scienceQuestion}</p>}
          <a className="text-link" href={`#/chapter/${mission.id}`}>{collected ? t('journal.revisit') : t('journal.start')}<Icon name="arrow" size={18} /></a>
          {source && <a className="source-link" href={source.url} target="_blank" rel="noreferrer" lang="en">{source.publisher}: {source.label}<Icon name="external" size={12} /><span className="sr-only" lang={content.locale}>{t('common.newTab')}</span></a>}
        </li>;
      })}
    </ul>

    <article className={`epilogue-card art-voyager ${highlight === 'voyager' ? 'is-new' : ''}`}><MissionArt id="voyager" /><div><p className="eyebrow">{t('journal.epilogueEyebrow', { state: voyagerVisited ? t('journal.visited') : t('journal.open') })}</p><h2 ref={highlight === 'voyager' ? newCard : undefined} tabIndex={highlight === 'voyager' ? -1 : undefined}>{t('journal.epilogueTitle')}</h2><p>{t('journal.epilogueText', { summary: t('m.voyager.summary') })}</p><a className="source-link" href={voyager.source} target="_blank" rel="noreferrer">{t('journal.voyagerSource')}<Icon name="external" size={12} /><span className="sr-only">{t('common.newTab')}</span></a></div><a className="button button-secondary" href="#/chapter/voyager">{voyagerVisited ? t('journal.revisitVoyager') : t('journal.meetVoyager')}<Icon name="arrow" /></a></article>
    <div className="journal-storage"><p><span className={`storage-dot ${saved ? '' : 'storage-unavailable'}`} aria-hidden="true" />{saved ? t('journal.saved') : t('journal.unsaved')}</p><button className="text-link reset-link" onClick={() => dialog.current?.showModal()} disabled={completed.length === 0}><Icon name="reset" size={16} />{t('journal.reset')}</button></div>
    <p className="sr-only" role="status">{announcement}</p>
    <dialog ref={dialog} className="reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description">
      <Icon name="reset" size={28} /><h2 id="reset-title">{t('journal.resetTitle')}</h2><p id="reset-description">{t('journal.resetText')}</p>
      <form method="dialog" className="button-row" onSubmit={event => { event.preventDefault(); dialog.current?.close(); }}><button className="button button-secondary" autoFocus>{t('journal.keep')}</button><button className="button button-danger" onClick={() => { onReset(); setAnnouncement(t('journal.resetDone')); }}>{t('journal.reset')}</button></form>
    </dialog>
  </section>;
}

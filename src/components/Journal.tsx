import { useEffect, useRef, useState } from 'react';
import { coreMissions, getMission, type ChapterId } from '../app/missions';
import { MISSIONS, getSource } from '../content/missions.ts';
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
    <div className="page-heading"><div><p className="eyebrow">CURIOSITY LEAVES A RECORD</p><h1 id="journal-title">Your discovery journal<span>.</span></h1><p>{count === 3 ? 'Three discoveries collected. A universe of questions ahead.' : 'Complete an experiment to unlock its discovery card.'}</p></div><ProgressMeter count={count} /></div>
    <div className={`journal-message ${count === 3 ? 'journal-complete' : ''}`}><Icon name={count === 3 ? 'star' : 'book'} size={28} /><div><h2>{count === 3 ? 'The archive is yours to carry forward.' : count === 0 ? 'Your next discovery is out there.' : 'Your collection is growing.'}</h2><p>{count === 0 ? 'Each exhibit ends with a short experiment. Finish it to unlock a discovery card here. You can explore in any order.' : count === 3 ? 'You measured the Moon, followed the water on Mars and listened to marsquakes. Voyager 1 is still out there, waiting in the epilogue.' : 'Every completed experiment adds a piece of the story. Revisit an exhibit whenever curiosity calls.'}</p></div><a className="button button-secondary" href="#/atlas">{count === 0 ? 'Find a discovery' : 'Return to atlas'}<Icon name="arrow" /></a></div>

    <h2 className="sr-only">Discovery cards</h2>
    <ul className="journal-grid" role="list">
      {coreMissions.map(mission => {
        const collected = completed.includes(mission.id);
        const content = MISSIONS[mission.id];
        const source = getSource(content.primarySourceId);
        const first = content.chronology[0];
        const last = content.chronology[content.chronology.length - 1];
        const isNew = collected && highlight === mission.id;
        return <li key={mission.id} className={`journal-card art-${mission.id} ${collected ? 'is-collected' : 'is-locked'} ${isNew ? 'is-new' : ''}`}>
          <div className="journal-card-top">
            <span className="eyebrow">DISCOVERY {mission.number}</span>
            <span className={`collection-label ${collected ? 'collected' : ''}`}><Icon name={collected ? 'check' : 'lock'} size={14} />{collected ? 'Collected' : 'Not yet collected'}</span>
          </div>
          {isNew && <p className="new-badge"><Icon name="spark" size={14} /> New discovery unlocked!</p>}
          <MissionArt id={mission.id} />
          <p className="eyebrow">{mission.name} / {mission.place}</p>
          <h3 ref={isNew ? newCard : undefined} tabIndex={isNew ? -1 : undefined}>{collected ? content.takeaway : mission.title}</h3>
          {collected ? <dl className="card-facts">
            <div><dt>Science concept</dt><dd>{content.method}</dd></div>
            <div><dt>Historical context</dt><dd>{first.date}: {first.event} {last !== first && <>{last.date}: {last.event}</>}</dd></div>
            <div><dt>What you learned</dt><dd>{content.result}</dd></div>
          </dl> : <p className="card-teaser"><span className="card-teaser-label">The question</span>{content.scienceQuestion}</p>}
          <a className="text-link" href={`#/chapter/${mission.id}`}>{collected ? 'Revisit the experiment' : 'Start the experiment'}<Icon name="arrow" size={18} /></a>
          {source && <a className="source-link" href={source.url} target="_blank" rel="noreferrer">{source.publisher}: {source.label}<Icon name="external" size={12} /><span className="sr-only">(opens in a new tab)</span></a>}
        </li>;
      })}
    </ul>

    <article className={`epilogue-card art-voyager ${highlight === 'voyager' ? 'is-new' : ''}`}><MissionArt id="voyager" /><div><p className="eyebrow">THE EPILOGUE · {voyagerVisited ? 'VISITED' : 'OPEN TO EXPLORE'}</p><h2 ref={highlight === 'voyager' ? newCard : undefined} tabIndex={highlight === 'voyager' ? -1 : undefined}>Beyond the last planet.</h2><p>{voyager.summary} Voyager’s epilogue is separate from your three core discoveries.</p><a className="source-link" href={voyager.source} target="_blank" rel="noreferrer">NASA · Voyager (status reference: November 2026)<Icon name="external" size={12} /><span className="sr-only">(opens in a new tab)</span></a></div><a className="button button-secondary" href="#/chapter/voyager">{voyagerVisited ? 'Revisit Voyager 1' : 'Meet Voyager 1'}<Icon name="arrow" /></a></article>
    <div className="journal-storage"><p><span className={`storage-dot ${saved ? '' : 'storage-unavailable'}`} aria-hidden="true" />{saved ? 'Saved on this device. Your discoveries stay here when you return.' : 'Device storage is unavailable. Discoveries last only for this visit.'}</p><button className="text-link reset-link" onClick={() => dialog.current?.showModal()} disabled={completed.length === 0}><Icon name="reset" size={16} />Reset journal</button></div>
    <p className="sr-only" role="status">{announcement}</p>
    <dialog ref={dialog} className="reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description">
      <Icon name="reset" size={28} /><h2 id="reset-title">Begin a new journey?</h2><p id="reset-description">This clears all collected discoveries and your Voyager epilogue progress on this device. You can collect them again by revisiting the exhibits.</p>
      <form method="dialog" className="button-row" onSubmit={event => { event.preventDefault(); dialog.current?.close(); }}><button className="button button-secondary" autoFocus>Keep my discoveries</button><button className="button button-danger" onClick={() => { onReset(); setAnnouncement('Journal reset. Zero of three discoveries collected.'); }}>Reset journal</button></form>
    </dialog>
  </section>;
}

import { useRef, useState } from 'react';
import { coreMissions, getMission, type ChapterId } from '../app/missions';
import { Icon } from './Icon';
import { MissionArt } from './MissionArt';
import { ProgressMeter } from './ProgressMeter';

export default function Journal({ completed, saved, onReset }: { completed: ChapterId[]; saved: boolean; onReset: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const count = coreMissions.filter(mission => completed.includes(mission.id)).length;
  const voyager = getMission('voyager');
  return <section className="journal-page" aria-labelledby="journal-title">
    <div className="page-heading"><div><p className="eyebrow">CURIOSITY LEAVES A RECORD</p><h1 id="journal-title">Your discovery journal<span>.</span></h1><p>{count === 3 ? 'Three discoveries collected. A universe of questions ahead.' : 'Keep the discoveries. Carry the questions with you.'}</p></div><ProgressMeter count={count} /></div>
    <div className={`journal-message ${count === 3 ? 'journal-complete' : ''}`}><Icon name={count === 3 ? 'check' : 'book'} size={28} /><div><h2>{count === 3 ? 'The archive is yours to carry forward.' : count === 0 ? 'Your next discovery is out there.' : 'Your collection is growing.'}</h2><p>{count === 0 ? 'Complete an exhibit’s experiment to collect its discovery here. You can explore in any order.' : 'Every completed experiment adds a piece of the story. Revisit an exhibit whenever curiosity calls.'}</p></div><a className="button button-secondary" href="#/atlas">{count === 0 ? 'Find a discovery' : 'Return to atlas'}<Icon name="arrow" /></a></div>
    <div className="journal-grid">
      {coreMissions.map(mission => {
        const collected = completed.includes(mission.id);
        return <article className={`journal-card art-${mission.id} ${collected ? 'is-collected' : ''}`} key={mission.id}>
          <div className="journal-card-top"><span className="eyebrow">DISCOVERY {mission.number}</span><span className={`collection-label ${collected ? 'collected' : ''}`}>{collected && <Icon name="check" size={14} />}{collected ? 'Collected' : 'Not yet collected'}</span></div>
          <MissionArt id={mission.id} /><p className="eyebrow">{mission.name} / {mission.place}</p><h2>{mission.title}</h2><p>{mission.summary}</p>
          <a className="text-link" href={`#/chapter/${mission.id}`}>{collected ? 'Revisit discovery' : 'Explore exhibit'}<Icon name="arrow" size={18} /></a>
          <a className="source-link" href={mission.source} target="_blank" rel="noreferrer">{mission.sourceName}<Icon name="external" size={12} /></a>
        </article>;
      })}
    </div>
    <article className="epilogue-card art-voyager"><MissionArt id="voyager" /><div><p className="eyebrow">THE EPILOGUE · {completed.includes('voyager') ? 'VISITED' : 'OPEN TO EXPLORE'}</p><h2>Beyond the last planet.</h2><p>{voyager.summary} Voyager’s epilogue is separate from your three core discoveries.</p><a className="source-link" href={voyager.source} target="_blank" rel="noreferrer">NASA · Voyager (status reference: November 2026)<Icon name="external" size={12} /></a></div><a className="button button-secondary" href="#/chapter/voyager">{completed.includes('voyager') ? 'Revisit Voyager 1' : 'Meet Voyager 1'}<Icon name="arrow" /></a></article>
    <div className="journal-storage"><p><span className={`storage-dot ${saved ? '' : 'storage-unavailable'}`} aria-hidden="true" />{saved ? 'Saved on this device. Your discoveries stay here when you return.' : 'Device storage is unavailable. Discoveries last only for this visit.'}</p><button className="text-link reset-link" onClick={() => dialog.current?.showModal()} disabled={completed.length === 0}><Icon name="reset" size={16} />Reset journal</button></div>
    <p className="sr-only" role="status">{announcement}</p>
    <dialog ref={dialog} className="reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description">
      <Icon name="reset" size={28} /><h2 id="reset-title">Begin a new journey?</h2><p id="reset-description">This clears all collected discoveries and your Voyager epilogue progress on this device. You can collect them again by revisiting the exhibits.</p>
      <form method="dialog" className="button-row" onSubmit={event => { event.preventDefault(); dialog.current?.close(); }}><button className="button button-secondary" autoFocus>Keep my discoveries</button><button className="button button-danger" onClick={() => { onReset(); setAnnouncement('Journal reset. Zero of three discoveries collected.'); }}>Reset journal</button></form>
    </dialog>
  </section>;
}

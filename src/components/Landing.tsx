import { missions, type ChapterId } from '../app/missions';
import { Icon } from './Icon';
import { MissionArt } from './MissionArt';
import { OrbitScene } from './OrbitScene';
import { StatusBadge } from './StatusBadge';

export default function Landing({ completed }: { completed: ChapterId[] }) {
  return <>
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="tiny-star" aria-hidden="true">✦</span> THE MACHINES THAT CHANGED OUR UNIVERSE</p>
        <h1 id="landing-title">Their signals<br />may fade.<br /><em>Their discoveries</em><br />never will.</h1>
        <p className="hero-description">A mirror on the Moon. A rover in the dust. A quiet listener on Mars. Discover what they left for all of us.</p>
        <div className="button-row"><a className="button button-primary" href="#/chapter/apollo11">Begin the Journey <Icon name="arrow" /></a><a className="hero-secondary" href="#/atlas">Explore the atlas <Icon name="compass" size={17} /></a></div>
        <p className="hero-footnote"><span aria-hidden="true" />Three discoveries. One extraordinary human story.</p>
      </div>
      <div className="hero-illustration"><OrbitScene /><div className="illustration-caption"><span className="crosshair" aria-hidden="true">+</span> AN ATLAS OF HUMAN CURIOSITY <span>ILLUSTRATIVE · NOT TO SCALE</span></div></div>
    </section>
    <section className="archive-intro" aria-labelledby="archive-heading">
      <div><p className="eyebrow">THE ARCHIVE IS AWAKE</p><h2 id="archive-heading">Small machines.<br /><span>Extraordinary legacies.</span></h2></div>
      <p>Some missions have ended. One reflector needs no power at all. Another spacecraft is still exploring. Their discoveries connect us to worlds beyond our own.</p>
      <a className="text-link" href="#/atlas">Choose your next stop <Icon name="arrow" /></a>
    </section>
    <section className="mission-preview" aria-label="Explore the four archive exhibits">
      {missions.map(mission => <a className={`preview-card art-${mission.id}`} key={mission.id} href={`#/chapter/${mission.id}`}>
        <div className="preview-top"><span className="eyebrow">{mission.epilogue ? 'EPILOGUE' : `CHAPTER ${mission.number}`}</span><span className="preview-place">{mission.place}</span></div>
        <MissionArt id={mission.id} />
        <StatusBadge mission={mission} />
        <div className="preview-title"><h3>{mission.name}</h3><Icon name={completed.includes(mission.id) ? 'check' : 'arrow'} /></div>
        <p>{mission.instrument}</p>
      </a>)}
    </section>
    <section className="landing-note"><Icon name="spark" size={22} /><p>Made for curious minds. Grounded in NASA science.<br /><span>An independent educational experience. No account. No equipment. Just curiosity.</span></p><a href="#/journal" className="text-link">Your discovery journal <Icon name="book" /></a></section>
  </>;
}

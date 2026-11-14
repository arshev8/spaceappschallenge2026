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
        <div className="button-row"><a className="button button-primary button-hero" href="#/atlas">Begin Exploring <Icon name="arrow" /></a><a className="hero-secondary" href="#/chapter/apollo11">Or start with the Moon <Icon name="spark" size={17} /></a></div>
        <p className="hero-footnote"><span aria-hidden="true" />Three hands-on experiments. One extraordinary human story.</p>
      </div>
      <div className="hero-illustration"><OrbitScene /><div className="illustration-caption"><span className="crosshair" aria-hidden="true">+</span> AN ATLAS OF HUMAN CURIOSITY <span>ILLUSTRATIVE · NOT TO SCALE</span></div></div>
    </section>
    <section className="archive-intro" aria-labelledby="archive-heading">
      <div><p className="eyebrow">THE ARCHIVE IS AWAKE</p><h2 id="archive-heading">Small machines.<br /><span>Extraordinary legacies.</span></h2></div>
      <p>Some missions have ended. One reflector needs no power at all. Another spacecraft is still exploring. Their discoveries connect us to worlds beyond our own.</p>
      <a className="text-link" href="#/atlas">Choose your next stop <Icon name="arrow" /></a>
    </section>
    <section className="how-it-works" aria-labelledby="how-heading">
      <div className="how-intro"><p className="eyebrow">HOW IT WORKS</p><h2 id="how-heading">Be the scientist,<br /><span>not just the reader.</span></h2></div>
      <ol className="how-steps">
        <li><span className="how-num" aria-hidden="true">01</span><h3>Choose a machine</h3><p>Pick a stop on the atlas: a mirror on the Moon, a rover or a listener on Mars, or a probe beyond the planets.</p></li>
        <li><span className="how-num" aria-hidden="true">02</span><h3>Run the experiment</h3><p>Time a laser pulse, sort rock evidence, read a seismogram. Wrong answers come with hints, never penalties.</p></li>
        <li><span className="how-num" aria-hidden="true">03</span><h3>Collect the discovery</h3><p>Each experiment unlocks a discovery card in your journal, linked to the real NASA source.</p></li>
      </ol>
      <p className="how-note"><Icon name="settings" size={18} /><span>Need bigger text, higher contrast or less motion? Open <strong>Display &amp; accessibility</strong> at the top of any page.</span></p>
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

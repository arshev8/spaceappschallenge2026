import type { CSSProperties } from 'react';
import { KIND_KEY, useShell } from '../app/l10n';
import { MEDIA } from '../app/media';
import { missions, type ChapterId } from '../app/missions';
import { MOMENTS } from '../app/timeline';
import { GameArt } from '../games/GameArt';
import { Icon } from './Icon';
import { NasaImage } from './NasaImage';
import { SignalHero } from './SignalHero';
import { StatusBadge } from './StatusBadge';
import { useReveal } from './useReveal';

/** Real whole-planet photographs for the solar-system card, inner to outer (sizes not to scale). */
const ORRERY = [MEDIA.venus, MEDIA.earth, MEDIA.mars, MEDIA.saturn, MEDIA.uranus, MEDIA.neptune];

export default function Landing({ completed }: { completed: ChapterId[] }) {
  const { t, exhibit, mission: text } = useShell();
  const reel = useReveal<HTMLElement>();
  const play = useReveal<HTMLElement>();
  const years = [...new Set(MOMENTS.map(m => m.year))];
  return <div className="landing">
    <section className="hero" aria-labelledby="landing-title">
      <div className="hero-copy">
        <h1 id="landing-title" className="hero-title"><span className="ht-fade">{t('ui.hero.fade')}</span> <span className="ht-keep">{t('ui.hero.keep')}</span></h1>
        <p className="hero-lede">{t('ui.hero.lede')}</p>
        <div className="button-row">
          <a className="button button-primary" href="#/chapter/apollo11">{t('ui.hero.begin')}</a>
          <a className="button button-ghost" href="#/explore"><Icon name="compass" size={18} />{t('ui.hero.explore')}</a>
        </div>
      </div>
      <SignalHero />
    </section>

    <section ref={reel} className="reel reveal" aria-labelledby="reel-title">
      <header className="section-head">
        <h2 id="reel-title">{t('ui.reel.title')}</h2>
        <a className="text-link" href="#/atlas">{t('ui.reel.link')}<Icon name="arrow" size={16} /></a>
      </header>
      <ul className="reel-list">
        {missions.map((mission, i) => {
          const ex = exhibit(mission.id);
          const m = text(mission.id);
          const media = ex.hero;
          return <li key={mission.id} className="reel-item" style={{ '--hue': ex.hue, '--i': i } as CSSProperties}>
            <a href={`#/chapter/${mission.id}`} className="reel-link">
              <NasaImage media={media} decorative bare className="reel-media" sizes="(max-width: 760px) 100vw, 40vw" />
              {media.kind === 'artist-concept' && <span className="reel-kind">{t(KIND_KEY[media.kind])}</span>}
              <span className="reel-shade" aria-hidden="true" />
              <span className="reel-body">
                <span className="reel-place">{m.place}</span>
                <span className="reel-name">{m.name}{completed.includes(mission.id) && <Icon name="check" size={20} />}</span>
                <span className="reel-discovery">{ex.discovery}</span>
                <StatusBadge mission={mission} />
              </span>
            </a>
          </li>;
        })}
      </ul>
    </section>

    <section ref={play} className="play reveal" aria-labelledby="play-title">
      <header className="section-head">
        <h2 id="play-title">{t('ui.play.title')}</h2>
        <a className="text-link" href="#/games">{t('ui.play.all')}<Icon name="arrow" size={16} /></a>
      </header>
      <div className="play-grid">
        <a className="play-tile play-lander" href="#/games/lander"><GameArt game="lander" /><span><strong>{t('ui.play.lander.title')}</strong><span>{t('ui.play.lander.text')}</span></span></a>
        <a className="play-tile play-probe" href="#/games/probe"><GameArt game="probe" /><span><strong>{t('ui.play.probe.title')}</strong><span>{t('ui.play.probe.text')}</span></span></a>
        <a className="play-tile play-quiz" href="#/games/quiz"><GameArt game="quiz" /><span><strong>{t('ui.play.quiz.title')}</strong><span>{t('ui.play.quiz.text')}</span></span></a>
      </div>
    </section>

    <section className="wayfinding" aria-label={t('ui.way.label')}>
      <a className="way way-orrery" href="#/explore">
        <span className="way-planets" aria-hidden="true">
          {ORRERY.map(m => <NasaImage key={m.file} media={m} decorative bare className="way-planet" sizes="120px" />)}
          <span className="game-art-credit">NASA</span>
        </span>
        <span><strong>{t('ui.way.orrery.title')}</strong><span>{t('ui.way.orrery.text')}</span></span>
      </a>
      <a className="way way-timeline" href="#/timeline">
        <span className="way-years" aria-hidden="true">{years.map(y => <span key={y}>{y}</span>)}</span>
        <span><strong>{t('ui.way.timeline.title')}</strong><span>{t('ui.way.timeline.text', { count: MOMENTS.length })}</span></span>
      </a>
    </section>
  </div>;
}

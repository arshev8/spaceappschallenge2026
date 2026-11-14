import { missions, type ChapterId } from '../app/missions';
import { useT } from '../i18n';
import { Icon } from './Icon';
import { MissionArt } from './MissionArt';
import { OrbitScene } from './OrbitScene';
import { StatusBadge } from './StatusBadge';

export default function Landing({ completed }: { completed: ChapterId[] }) {
  const { t } = useT();
  return <>
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="tiny-star" aria-hidden="true">✦</span> {t('landing.eyebrow')}</p>
        <h1 id="landing-title">{t('landing.h1a')}<br />{t('landing.h1b')}<br /><em>{t('landing.h1c')}</em><br />{t('landing.h1d')}</h1>
        <p className="hero-description">{t('landing.description')}</p>
        <div className="button-row"><a className="button button-primary button-hero" href="#/atlas">{t('landing.begin')} <Icon name="arrow" /></a><a className="hero-secondary" href="#/chapter/apollo11">{t('landing.startMoon')} <Icon name="spark" size={17} /></a></div>
        <p className="hero-footnote"><span aria-hidden="true" />{t('landing.footnote')}</p>
      </div>
      <div className="hero-illustration"><OrbitScene /><div className="illustration-caption"><span className="crosshair" aria-hidden="true">+</span> {t('landing.caption')} <span>{t('landing.captionNote')}</span></div></div>
    </section>
    <section className="archive-intro" aria-labelledby="archive-heading">
      <div><p className="eyebrow">{t('landing.archiveEyebrow')}</p><h2 id="archive-heading">{t('landing.archiveA')}<br /><span>{t('landing.archiveB')}</span></h2></div>
      <p>{t('landing.archiveText')}</p>
      <a className="text-link" href="#/atlas">{t('landing.nextStop')} <Icon name="arrow" /></a>
    </section>
    <section className="how-it-works" aria-labelledby="how-heading">
      <div className="how-intro"><p className="eyebrow">{t('landing.howEyebrow')}</p><h2 id="how-heading">{t('landing.howA')}<br /><span>{t('landing.howB')}</span></h2></div>
      <ol className="how-steps">
        <li><span className="how-num" aria-hidden="true">01</span><h3>{t('landing.step1')}</h3><p>{t('landing.step1Text')}</p></li>
        <li><span className="how-num" aria-hidden="true">02</span><h3>{t('landing.step2')}</h3><p>{t('landing.step2Text')}</p></li>
        <li><span className="how-num" aria-hidden="true">03</span><h3>{t('landing.step3')}</h3><p>{t('landing.step3Text')}</p></li>
      </ol>
      <p className="how-note"><Icon name="settings" size={18} /><span>{t('landing.noteA')} <strong>{t('settings.button')}</strong> {t('landing.noteB')}</span></p>
    </section>
    <section className="mission-preview" aria-label={t('landing.previews')}>
      {missions.map(mission => <a className={`preview-card art-${mission.id}`} key={mission.id} href={`#/chapter/${mission.id}`}>
        <div className="preview-top"><span className="eyebrow">{mission.epilogue ? t('common.epilogue') : t('common.chapterN', { n: mission.number })}</span><span className="preview-place">{t(`m.${mission.id}.place`)}</span></div>
        <MissionArt id={mission.id} />
        <StatusBadge mission={mission} />
        <div className="preview-title"><h3>{t(`m.${mission.id}.name`)}</h3><Icon name={completed.includes(mission.id) ? 'check' : 'arrow'} /></div>
        <p>{t(`m.${mission.id}.instrument`)}</p>
      </a>)}
    </section>
    <section className="landing-note"><Icon name="spark" size={22} /><p>{t('landing.madeFor')}<br /><span>{t('landing.madeForNote')}</span></p><a href="#/journal" className="text-link">{t('landing.journalLink')} <Icon name="book" /></a></section>
  </>;
}

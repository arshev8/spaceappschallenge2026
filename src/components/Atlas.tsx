import { coreMissions, missions, type ChapterId } from '../app/missions';
import { useT, type MessageKey } from '../i18n';
import { Icon } from './Icon';
import { MissionArt } from './MissionArt';
import { OrbitScene } from './OrbitScene';
import { ProgressMeter } from './ProgressMeter';
import { StatusBadge } from './StatusBadge';

const REGIONS: { id: 'moon' | 'mars' | 'deep'; glyph: string; ids: ChapterId[] }[] = [
  { id: 'moon', glyph: '◐', ids: ['apollo11'] },
  { id: 'mars', glyph: '●', ids: ['opportunity', 'insight'] },
  { id: 'deep', glyph: '✦', ids: ['voyager'] },
];

export default function Atlas({ completed }: { completed: ChapterId[] }) {
  const { t } = useT();
  const count = coreMissions.filter(mission => completed.includes(mission.id)).length;
  return <section className="atlas-page" aria-labelledby="atlas-title">
    <div className="page-heading"><div><p className="eyebrow">{t('atlas.eyebrow')}</p><h1 id="atlas-title">{t('atlas.title')}<span>.</span></h1><p>{t('atlas.intro')}</p></div><ProgressMeter count={count} /></div>
    <div className="atlas-chart">
      <div className="atlas-chart-top"><span className="eyebrow"><span aria-hidden="true">⌖</span> {t('atlas.chartTitle')}</span><span>{t('atlas.chartNote')}</span></div>
      <OrbitScene className="atlas-scene" />
      <nav className="atlas-nodes" aria-label={t('atlas.nav')}>
        {missions.map(mission => <a key={mission.id} className={`atlas-node node-${mission.id}`} href={`#/chapter/${mission.id}`}>
          <span className="node-marker" aria-hidden="true">{completed.includes(mission.id) ? <Icon name="check" size={16} /> : mission.number}</span>
          <span className="node-copy"><span className="eyebrow">{mission.epilogue ? t('common.epilogue') : t(`m.${mission.id}.place`)}</span><strong>{t(`m.${mission.id}.name`)} <Icon name="arrow" size={15} /></strong><StatusBadge mission={mission} /></span>
        </a>)}
      </nav>
      <div className="atlas-legend"><span><i className="legend-passive" />{t('atlas.legendPassive')}</span><span><i className="legend-ended" />{t('atlas.legendEnded')}</span><span><i className="legend-active" />{t('atlas.legendActive')}</span></div>
    </div>
    <div className="atlas-reading"><p><Icon name="compass" size={18} />{t('atlas.reading')}</p><span>{t('atlas.statesNote')}</span></div>
    <div className="atlas-index" aria-label={t('atlas.index')}>
      {REGIONS.map(region => <section className={`atlas-region region-${region.id}`} key={region.id} aria-labelledby={`region-${region.id}`}>
        <h2 id={`region-${region.id}`} className="atlas-region-title"><span aria-hidden="true">{region.glyph}</span> {t(`atlas.region.${region.id}` as MessageKey)}<small>{t(`atlas.region.${region.id}Note` as MessageKey)}</small></h2>
        {missions.filter(m => region.ids.includes(m.id)).map(mission => <article className={`atlas-entry art-${mission.id}`} key={mission.id}>
          <MissionArt id={mission.id} /><div><p className="eyebrow">{mission.epilogue ? t('atlas.beyond') : t('common.discoveryN', { n: mission.number })}{completed.includes(mission.id) ? t('atlas.collected') : ''}</p><h3><a href={`#/chapter/${mission.id}`}>{t(`m.${mission.id}.name`)}<Icon name="arrow" size={18} /></a></h3><p>{t(`m.${mission.id}.summary`)}</p><p className="atlas-game"><Icon name="spark" size={14} />{t('atlas.experiment', { game: t(`game.${mission.id}`) })}</p><a className="source-link" href={mission.source} target="_blank" rel="noreferrer">{t(`m.${mission.id}.sourceName`)}<Icon name="external" size={12} /><span className="sr-only">{t('common.newTab')}</span></a></div>
        </article>)}
      </section>)}
    </div>
  </section>;
}

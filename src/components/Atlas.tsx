import { coreMissions, missions, type ChapterId } from '../app/missions';
import { Icon } from './Icon';
import { MissionArt } from './MissionArt';
import { OrbitScene } from './OrbitScene';
import { ProgressMeter } from './ProgressMeter';
import { StatusBadge } from './StatusBadge';

const REGIONS: { id: string; name: string; note: string; glyph: string; ids: ChapterId[] }[] = [
  { id: 'moon', name: 'The Moon', note: 'About 384,400 km away, on average', glyph: '◐', ids: ['apollo11'] },
  { id: 'mars', name: 'Mars', note: 'Two machines, two kinds of clues', glyph: '●', ids: ['opportunity', 'insight'] },
  { id: 'deep', name: 'Deep space', note: 'Still traveling', glyph: '✦', ids: ['voyager'] },
];
const GAMES: Record<ChapterId, string> = {
  apollo11: 'Measure the distance to the Moon',
  opportunity: 'Follow the water',
  insight: 'Marsquake investigator',
  voyager: 'Match the machines + Golden Record',
};

export default function Atlas({ completed }: { completed: ChapterId[] }) {
  const count = coreMissions.filter(mission => completed.includes(mission.id)).length;
  return <section className="atlas-page" aria-labelledby="atlas-title">
    <div className="page-heading"><div><p className="eyebrow">FOLLOW YOUR CURIOSITY</p><h1 id="atlas-title">The discovery atlas<span>.</span></h1><p>Four machines. Three discoveries. Choose a signal to follow.</p></div><ProgressMeter count={count} /></div>
    <div className="atlas-chart">
      <div className="atlas-chart-top"><span className="eyebrow"><span aria-hidden="true">⌖</span> HUMANITY’S OFF-WORLD ARCHIVE</span><span>Illustrative navigation map · not to scale</span></div>
      <OrbitScene className="atlas-scene" />
      <nav className="atlas-nodes" aria-label="Artifact navigation">
        {missions.map(mission => <a key={mission.id} className={`atlas-node node-${mission.id}`} href={`#/chapter/${mission.id}`}>
          <span className="node-marker" aria-hidden="true">{completed.includes(mission.id) ? <Icon name="check" size={16} /> : mission.number}</span>
          <span className="node-copy"><span className="eyebrow">{mission.epilogue ? 'EPILOGUE' : mission.place}</span><strong>{mission.name} <Icon name="arrow" size={15} /></strong><StatusBadge mission={mission} /></span>
        </a>)}
      </nav>
      <div className="atlas-legend"><span><i className="legend-passive" />Passive · no electronics needed</span><span><i className="legend-ended" />Mission ended · discoveries endure</span><span><i className="legend-active" />Active · extended mission</span></div>
    </div>
    <div className="atlas-reading"><p><Icon name="compass" size={18} />There’s no wrong place to begin. Every exhibit is open to explore.</p><span>Mission states referenced November 2026 · not live telemetry</span></div>
    <div className="atlas-index" aria-label="Exhibit details and sources">
      {REGIONS.map(region => <section className={`atlas-region region-${region.id}`} key={region.id} aria-labelledby={`region-${region.id}`}>
        <h2 id={`region-${region.id}`} className="atlas-region-title"><span aria-hidden="true">{region.glyph}</span> {region.name}<small>{region.note}</small></h2>
        {missions.filter(m => region.ids.includes(m.id)).map(mission => <article className={`atlas-entry art-${mission.id}`} key={mission.id}>
          <MissionArt id={mission.id} /><div><p className="eyebrow">{mission.epilogue ? 'BEYOND THE LAST PLANET' : `DISCOVERY ${mission.number}`}{completed.includes(mission.id) ? ' · COLLECTED ✓' : ''}</p><h3><a href={`#/chapter/${mission.id}`}>{mission.name}<Icon name="arrow" size={18} /></a></h3><p>{mission.summary}</p><p className="atlas-game"><Icon name="spark" size={14} />Experiment: {GAMES[mission.id]}</p><a className="source-link" href={mission.source} target="_blank" rel="noreferrer">{mission.sourceName}<Icon name="external" size={12} /><span className="sr-only">(opens in a new tab)</span></a></div>
        </article>)}
      </section>)}
    </div>
  </section>;
}

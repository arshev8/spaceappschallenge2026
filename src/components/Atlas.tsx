import { coreMissions, missions, type ChapterId } from '../app/missions';
import { Icon } from './Icon';
import { MissionArt } from './MissionArt';
import { OrbitScene } from './OrbitScene';
import { ProgressMeter } from './ProgressMeter';
import { StatusBadge } from './StatusBadge';

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
      {missions.map(mission => <article className={`atlas-entry art-${mission.id}`} key={mission.id}>
        <MissionArt id={mission.id} /><div><p className="eyebrow">{mission.epilogue ? 'BEYOND THE LAST PLANET' : `DISCOVERY ${mission.number}`}</p><h2><a href={`#/chapter/${mission.id}`}>{mission.name}<Icon name="arrow" size={18} /></a></h2><p>{mission.summary}</p><a className="source-link" href={mission.source} target="_blank" rel="noreferrer">{mission.sourceName}<Icon name="external" size={12} /></a></div>
      </article>)}
    </div>
  </section>;
}

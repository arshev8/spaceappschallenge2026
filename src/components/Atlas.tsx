import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useShell, chapterRole } from '../app/l10n';
import { coreMissions, missions, type ChapterId } from '../app/missions';
import { getSource } from '../content/missions';
import { useContent } from '../content/useContent';
import { HotspotImage } from './Hotspots';
import { Icon } from './Icon';
import { NasaImage } from './NasaImage';
import { ProgressMeter } from './ProgressMeter';
import { StatusBadge } from './StatusBadge';

/** Mission explorer: one mission on stage at a time, with journey, milestones and hardware. */
export default function Atlas({ completed }: { completed: ChapterId[] }) {
  const { t, exhibit: exhibitFor, mission: text } = useShell();
  const content = useContent();
  const count = coreMissions.filter(mission => completed.includes(mission.id)).length;
  const [index, setIndex] = useState(0);
  const [milestone, setMilestone] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const mission = missions[index];
  const m = text(mission.id);
  const exhibit = exhibitFor(mission.id);
  const chronology = content.missions[mission.id].chronology;

  const choose = (i: number, focus = false) => {
    const next = (i + missions.length) % missions.length;
    setIndex(next); setMilestone(0);
    if (focus) tabs.current[next]?.focus();
  };
  const onTabKey = (event: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: missions.length - 1 };
    if (event.key in keys) { event.preventDefault(); choose(keys[event.key], true); }
  };
  const step = chronology[milestone];
  const stepSource = getSource(step.sourceId);

  return <section className="missions" aria-labelledby="atlas-title" style={{ '--hue': exhibit.hue } as CSSProperties}>
    <header className="page-head page-head-split">
      <div><h1 id="atlas-title">{t('ui.title.atlas')}</h1><p>{t('ui.atlas.lede')}</p></div>
      <ProgressMeter count={count} />
    </header>

    <div className="mission-tabs" role="tablist" aria-label={t('ui.atlas.tabs')}>
      {missions.map((item, i) => <button key={item.id} ref={el => { tabs.current[i] = el; }} role="tab" id={`tab-${item.id}`} aria-selected={i === index} aria-controls="mission-stage"
        tabIndex={i === index ? 0 : -1} onClick={() => choose(i)} onKeyDown={onTabKey} style={{ '--tab-hue': exhibitFor(item.id).hue } as CSSProperties}>
        <span className={`tab-role${item.epilogue ? ' is-epilogue' : ''}`}>{chapterRole(t, item)}</span>
        <span className="tab-place">{text(item.id).place}</span><span className="tab-name">{text(item.id).name}</span>
        {completed.includes(item.id) && <Icon name="check" size={16} />}
      </button>)}
    </div>

    <div id="mission-stage" role="tabpanel" aria-labelledby={`tab-${mission.id}`} className="mission-stage" key={mission.id}>
      <div className="stage-hero">
        <NasaImage media={exhibit.hero} className="stage-photo" sizes="100vw" eager />
        <div className="stage-copy">
          <p className="stage-place">{chapterRole(t, mission)} · {m.place} · {m.instrument}</p>
          <h2 className="stage-name">{m.name}</h2>
          <p className="stage-discovery">{exhibit.discovery}</p>
          <StatusBadge mission={mission} />
          <div className="button-row">
            <a className="button button-primary" href={`#/chapter/${mission.id}`}>{t(completed.includes(mission.id) ? 'ui.atlas.revisit' : 'ui.atlas.start')}</a>
            <button type="button" className="button button-ghost" onClick={() => choose(index + 1)}>{t('ui.atlas.next')}<Icon name="arrow" size={16} /></button>
          </div>
        </div>
      </div>

      <dl className="stage-facts">
        {exhibit.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
      </dl>

      <div className="journey" aria-label={t('ui.atlas.journey', { stops: exhibit.journey.join(t('ui.atlas.then')) })}>
        <svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true" className="journey-line"><path d="M8 74 C 300 -6, 700 -6, 992 74" pathLength={1} /></svg>
        <ol>{exhibit.journey.map((stop, i) => <li key={stop} style={{ '--i': i } as CSSProperties}><span className="journey-dot" aria-hidden="true" />{stop}</li>)}</ol>
      </div>

      <div className="milestones">
        <h3>{t('ui.atlas.milestones')}</h3>
        <ol className="milestone-track">
          {chronology.map((c, i) => <li key={c.date + c.event}><button type="button" aria-pressed={i === milestone} onClick={() => setMilestone(i)}><span className="ms-date">{c.date}</span></button></li>)}
        </ol>
        <p className="milestone-detail" aria-live="polite"><strong>{step.date}</strong> {step.event} {stepSource && <a className="source-link" href={stepSource.url} target="_blank" rel="noreferrer">{t('common.source')}<Icon name="external" size={11} /></a>}</p>
      </div>

      <div className="stage-inspect">
        <h3>{t('ui.atlas.inspect')}</h3>
        <HotspotImage media={exhibit.inspect.media} hotspots={exhibit.inspect.hotspots} label={t('ui.atlas.parts', { name: m.name })} />
      </div>
      <p className="stage-source">{t('ui.atlas.reference')} <a href={mission.source} target="_blank" rel="noreferrer">{m.sourceName} <Icon name="external" size={11} /></a> · {t('ui.atlas.statusNote')}</p>
    </div>

    <nav className="exhibit-jump" aria-label={t('ui.atlas.jumpNav')}>
      <p>{t('ui.atlas.jump')}</p>
      <ul>{missions.map(item => <li key={item.id}><a href={`#/chapter/${item.id}`}>{text(item.id).name}{completed.includes(item.id) ? <Icon name="check" size={14} /> : <Icon name="arrow" size={14} />}</a></li>)}</ul>
    </nav>
  </section>;
}

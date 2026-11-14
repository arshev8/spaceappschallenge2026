import { Component, Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { getMission, type ChapterId, type ChapterProps } from './missions';
import { MissionArt } from '../components/MissionArt';
import { Icon } from '../components/Icon';
import { StatusBadge } from '../components/StatusBadge';

type ChapterModule = { default: ComponentType<ChapterProps> };
// Vite resolves these paths relative to this file. An empty glob is intentional
// until Agent 2's chapter files are merged. No chapter stubs are needed.
const chapterModules: Partial<Record<string, () => Promise<ChapterModule>>> = import.meta.glob<ChapterModule>('../chapters/*.tsx');

class ChapterBoundary extends Component<{ children: ReactNode; onRetry: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="host-message" role="alert">
      <Icon name="compass" size={36} /><h2>This exhibit couldn’t open.</h2>
      <p>A chapter may have changed while this page was open. Try again, or return to the atlas.</p>
      <div className="button-row"><button className="button button-primary" onClick={this.props.onRetry}>Try again <Icon name="reset" /></button><a className="button button-secondary" href="#/atlas">Return to atlas</a></div>
    </div> : this.props.children;
  }
}
export default function ChapterHost({ id, onComplete, onBack }: { id: ChapterId } & ChapterProps) {
  const mission = getMission(id);
  const [attempt, setAttempt] = useState(0);
  const completed = useRef(false);
  const loader = chapterModules[`../chapters/${id}.tsx`];
  const [loaded, setLoaded] = useState<{ chapter: ComponentType<ChapterProps> | null; error: boolean }>({ chapter: null, error: false });
  useEffect(() => {
    if (!loader) return;
    let active = true;
    loader().then(module => {
      if (!module.default) throw new Error('Chapter requires a default export');
      if (active) setLoaded({ chapter: module.default, error: false });
    }).catch(() => { if (active) setLoaded({ chapter: null, error: true }); });
    return () => { active = false; };
  }, [loader, attempt]);
  const Chapter = loaded.chapter;
  const retry = () => {
    setLoaded({ chapter: null, error: false });
    setAttempt(value => value + 1);
  };
  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  };
  return <section className="chapter-host" aria-label={`${mission.name} exhibit`}>
    <div className="chapter-topline"><button className="text-link" onClick={onBack}><Icon name="back" />Back to atlas</button><span className="eyebrow">{mission.epilogue ? 'EPILOGUE' : `DISCOVERY ${mission.number}`} / {mission.place}</span></div>
    <div className="chapter-heading"><div><p className="eyebrow">{mission.instrument}</p><h1>{mission.name}</h1></div><StatusBadge mission={mission} /></div>
    {Chapter ? <ChapterBoundary key={`${id}-${attempt}`} onRetry={retry}>
      <Suspense fallback={<div className="host-message" role="status"><span className="loading-orbit" aria-hidden="true" /><h2>Opening the archive…</h2><p>Preparing your {mission.name} exhibit.</p></div>}>
        <Chapter onComplete={finish} onBack={onBack} />
      </Suspense>
    </ChapterBoundary> : loader ? loaded.error ? <div className="host-message" role="alert">
      <Icon name="compass" size={36} /><h2>This exhibit couldn’t open.</h2><p>The chapter couldn’t be loaded. Try again, or return to the atlas.</p>
      <div className="button-row"><button className="button button-primary" onClick={retry}>Try again <Icon name="reset" /></button><a className="button button-secondary" href="#/atlas">Return to atlas</a></div>
    </div> : <div className="host-message" role="status"><span className="loading-orbit" aria-hidden="true" /><h2>Opening the archive…</h2><p>Preparing your {mission.name} exhibit.</p></div> : <div className="host-message host-preparing">
      <div className={`host-art art-${id}`}><MissionArt id={id} /></div>
      <p className="eyebrow">A STORY WORTH WAITING FOR</p><h2>Exhibit is being prepared.</h2>
      <p>This chapter’s story and experiment haven’t arrived in the archive yet. Your journal is safe. Explore another stop in the meantime.</p>
      <a className="button button-primary" href="#/atlas">Return to atlas <Icon name="arrow" /></a>
      <p className="host-source">Curious already? <a href={mission.source} target="_blank" rel="noreferrer">Explore the NASA source <Icon name="external" size={13} /></a></p>
    </div>}
    <p className="chapter-source">Mission reference: <a href={mission.source} target="_blank" rel="noreferrer">{mission.sourceName} <Icon name="external" size={12} /></a>{mission.id === 'voyager' && ' · Status reference: November 2026; not live telemetry.'}</p>
  </section>;
}

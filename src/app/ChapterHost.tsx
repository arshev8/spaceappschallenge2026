import { Component, Suspense, useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from 'react';
import { getMission, type ChapterId, type ChapterProps } from './missions';
import { NasaImage } from '../components/NasaImage';
import { useShell, chapterRole } from './l10n';
import { Icon } from '../components/Icon';
import { StatusBadge } from '../components/StatusBadge';

type ChapterModule = { default: ComponentType<ChapterProps> };
// Vite resolves these paths relative to this file. An empty glob is intentional
// until Agent 2's chapter files are merged. No chapter stubs are needed.
const chapterModules: Partial<Record<string, () => Promise<ChapterModule>>> = import.meta.glob<ChapterModule>('../chapters/*.tsx');

class ChapterBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
export default function ChapterHost({ id, onComplete, onBack }: { id: ChapterId } & ChapterProps) {
  const mission = getMission(id);
  const { t, exhibit: exhibitFor, mission: text } = useShell();
  const m = text(id);
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
  const exhibit = exhibitFor(id);
  const failure = (detail: string, onRetry: () => void) => <div className="host-message" role="alert">
    <Icon name="compass" size={36} /><h2>{t('ui.host.failed')}</h2><p>{detail}</p>
    <div className="button-row"><button className="button button-primary" onClick={onRetry}>{t('ui.host.retry')} <Icon name="reset" /></button><a className="button button-ghost" href="#/atlas">{t('ui.host.return')}</a></div>
  </div>;
  const loading = <div className="host-message" role="status"><span className="loading-orbit" aria-hidden="true" /><h2>{t('ui.host.loading')}</h2><p>{t('ui.host.preparing', { name: m.name })}</p></div>;
  return <section className="chapter-host" aria-label={t('ui.ch.exhibit', { name: m.name })} style={{ '--hue': exhibit.hue } as CSSProperties}>
    <div className="chapter-hero">
      <NasaImage media={exhibit.hero} className="chapter-hero-photo" sizes="100vw" eager />
      <div className="chapter-hero-copy">
        <button className="text-link" onClick={onBack}><Icon name="back" size={16} />{t('ui.ch.back')}</button>
        <p className="chapter-place">{chapterRole(t, mission)} · {m.place}</p>
        <h1>{m.name}</h1>
        <p className="chapter-instrument">{m.instrument}</p>
        <StatusBadge mission={mission} />
      </div>
    </div>
    <dl className="chapter-facts">{exhibit.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
    {Chapter ? <ChapterBoundary key={`${id}-${attempt}`} fallback={failure(t('ui.host.boundaryText'), retry)}>
      <Suspense fallback={loading}>
        <Chapter onComplete={finish} onBack={onBack} />
      </Suspense>
    </ChapterBoundary> : loader ? loaded.error ? failure(t('ui.host.failedText'), retry) : loading : <div className="host-message host-preparing">
      <NasaImage media={exhibit.inspect.media} decorative bare className={`host-art art-${id}`} sizes="240px" />
      <h2>{t('ui.host.prepTitle')}</h2>
      <p>{t('ui.host.prepText')}</p>
      <a className="button button-primary" href="#/atlas">{t('ui.host.return')} <Icon name="arrow" /></a>
      <p className="host-source">{t('ui.host.curious')} <a href={mission.source} target="_blank" rel="noreferrer">{t('ui.host.nasaSource')} <Icon name="external" size={13} /></a></p>
    </div>}
    <p className="chapter-source">{t('ui.atlas.reference')} <a href={mission.source} target="_blank" rel="noreferrer">{m.sourceName} <Icon name="external" size={12} /></a>{mission.id === 'voyager' && ` · ${t('ui.host.voyagerNote')}`}</p>
  </section>;
}

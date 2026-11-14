import { Component, Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { getMission, type ChapterId, type ChapterProps } from './missions';
import { MissionArt } from '../components/MissionArt';
import { Icon } from '../components/Icon';
import { StatusBadge } from '../components/StatusBadge';
import { useT, type T } from '../i18n';

type ChapterModule = { default: ComponentType<ChapterProps> };
// Vite resolves these paths relative to this file. An empty glob is intentional
// if chapter files are missing; the host then shows a preparation state.
const chapterModules: Partial<Record<string, () => Promise<ChapterModule>>> = import.meta.glob<ChapterModule>(['../chapters/*.tsx', '!../chapters/*.test.tsx']);

class ChapterBoundary extends Component<{ children: ReactNode; onRetry: () => void; t: T }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    const { t } = this.props;
    return this.state.failed ? <div className="host-message" role="alert">
      <Icon name="compass" size={36} /><h2>{t('host.failed')}</h2>
      <p>{t('host.failedText')}</p>
      <div className="button-row"><button className="button button-primary" onClick={this.props.onRetry}>{t('host.retry')} <Icon name="reset" /></button><a className="button button-secondary" href="#/atlas">{t('common.returnToAtlas')}</a></div>
    </div> : this.props.children;
  }
}
export default function ChapterHost({ id, onComplete, onBack }: { id: ChapterId } & ChapterProps) {
  const { t } = useT();
  const mission = getMission(id);
  const name = t(`m.${id}.name`);
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
  const opening = <div className="host-message" role="status"><span className="loading-orbit" aria-hidden="true" /><h2>{t('host.opening')}</h2><p>{t('host.preparingExhibit', { name })}</p></div>;
  return <section className="chapter-host" aria-label={t('host.exhibit', { name })}>
    <div className="chapter-topline"><button className="text-link" onClick={onBack}><Icon name="back" />{t('common.backToAtlas')}</button><span className="eyebrow">{mission.epilogue ? t('common.epilogue') : t('common.discoveryN', { n: mission.number })} / {t(`m.${id}.place`)}</span></div>
    <div className="chapter-heading"><div><p className="eyebrow">{t(`m.${id}.instrument`)}</p><h1>{name}</h1></div><StatusBadge mission={mission} /></div>
    {Chapter ? <ChapterBoundary key={`${id}-${attempt}`} onRetry={retry} t={t}>
      <Suspense fallback={opening}>
        <Chapter onComplete={finish} onBack={onBack} />
      </Suspense>
    </ChapterBoundary> : loader ? loaded.error ? <div className="host-message" role="alert">
      <Icon name="compass" size={36} /><h2>{t('host.failed')}</h2><p>{t('host.loadFailedText')}</p>
      <div className="button-row"><button className="button button-primary" onClick={retry}>{t('host.retry')} <Icon name="reset" /></button><a className="button button-secondary" href="#/atlas">{t('common.returnToAtlas')}</a></div>
    </div> : opening : <div className="host-message host-preparing">
      <div className={`host-art art-${id}`}><MissionArt id={id} /></div>
      <p className="eyebrow">{t('host.waiting')}</p><h2>{t('host.preparing')}</h2>
      <p>{t('host.preparingText')}</p>
      <a className="button button-primary" href="#/atlas">{t('common.returnToAtlas')} <Icon name="arrow" /></a>
      <p className="host-source">{t('host.curious')} <a href={mission.source} target="_blank" rel="noreferrer">{t('host.exploreSource')} <Icon name="external" size={13} /></a></p>
    </div>}
    <p className="chapter-source">{t('host.reference')} <a href={mission.source} target="_blank" rel="noreferrer">{t(`m.${id}.sourceName`)} <Icon name="external" size={12} /></a>{mission.id === 'voyager' && t('host.voyagerNote')}</p>
  </section>;
}

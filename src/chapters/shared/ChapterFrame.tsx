import { useEffect, useId, useRef, type ReactNode } from 'react';
import { chapterSources, getSource, type ChapterId, type ChronologyEntry } from '../../content/missions.ts';
import type { Scene } from '../../content/scripts.ts';
import { useContent } from '../../content/useContent.ts';
import { formatIsoDate, useT, type MessageKey } from '../../i18n';
import { useCompleteOnce, type ChapterFlow } from './useChapterFlow.ts';
import '../chapters.css';

type FrameProps = {
  id: ChapterId;
  kicker: string;
  theme: 'moon' | 'mars' | 'deep';
  flow: ChapterFlow;
  onBack: () => void;
  onComplete: () => void;
  /** Illustration or diagram shown beside the story text (story scenes only). */
  visual?: ReactNode;
  /** Full-width content for the current scene (experiments, timelines, explorers). */
  children?: ReactNode;
  /** Shown inside the discovery card before the completion button. */
  discoveryExtra?: ReactNode;
  /** Hint shown next to a disabled "Next" button on a gated scene. */
  gateHint?: string;
};

function nextLabel(flow: ChapterFlow): MessageKey {
  const upcoming = flow.scenes[flow.index + 1];
  if (!upcoming) return 'ch.next';
  if (upcoming.kind === 'experiment') return 'ch.startExperiment';
  if (upcoming.kind === 'discovery') return 'ch.reveal';
  if (flow.scene.kind === 'experiment') return 'ch.realScience';
  return 'ch.next';
}

export function ChapterFrame({ id, kicker, theme, flow, onBack, onComplete, visual, children, discoveryExtra, gateHint }: FrameProps) {
  const { t, locale } = useT();
  const content = useContent();
  const mission = content.missions[id];
  const titleId = useId();
  const sceneHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const [completed, complete] = useCompleteOnce(onComplete);
  const { scene, scenes, index } = flow;
  const story = scene.kind !== 'experiment' && scene.kind !== 'discovery' && Boolean(visual);
  const checked = formatIsoDate(mission.statusAsOf, locale);

  // Move focus to the new scene heading when the learner changes step (not on mount).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    sceneHeadingRef.current?.focus({ preventScroll: true });
    sceneHeadingRef.current?.closest('.echoes-chapter')?.scrollIntoView?.({ block: 'start' });
  }, [index]);

  return (
    <article className={`echoes-chapter ec-theme-${theme}`} aria-labelledby={titleId}>
      <header className="ec-header">
        <p className="ec-kicker">{kicker}</p>
        <h2 id={titleId} className="ec-title">{mission.chapterTitle}</h2>
        <nav aria-label={t('ch.steps')}>
          <ol className="ec-stepper">
            {scenes.map((s, i) => {
              const state = i === index ? 'is-current' : i <= flow.maxReached ? 'is-done' : 'is-locked';
              const aria = t('ch.stepAria', { n: i + 1, total: scenes.length, title: s.title });
              const label = (
                <>
                  <span className="ec-step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ec-step-text">
                    <span className="ec-step-stage">{content.stageLabels[s.kind]}</span>
                    <span className="ec-step-title">{s.title}</span>
                  </span>
                </>
              );
              return (
                <li key={s.id} className={state}>
                  {i <= flow.maxReached ? (
                    <button type="button" onClick={() => flow.goTo(i)} aria-current={i === index ? 'step' : undefined} aria-label={aria + (i === index ? t('ch.current') : '')}>
                      {label}
                    </button>
                  ) : (
                    <span className="ec-step-locked" aria-label={aria + t('ch.locked')}>{label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <section key={scene.id} className={`ec-scene ec-scene--${scene.kind}`} aria-labelledby={`${titleId}-scene`}>
        <div className={story ? 'ec-scene-grid' : undefined}>
          <div className="ec-scene-text">
            <p className="ec-step-label">
              <span>{content.stageLabels[scene.kind]}</span>
              <span aria-hidden="true"> · </span>
              <span>{t('ch.stepOf', { n: index + 1, total: scenes.length })}</span>
            </p>
            <h3 id={`${titleId}-scene`} className="ec-scene-title" ref={sceneHeadingRef} tabIndex={-1}>{scene.title}</h3>
            <SceneText scene={scene} />
          </div>
          {visual && <div className="ec-scene-media">{visual}</div>}
        </div>
        {children}
        {scene.kind === 'discovery' && (
          <div className={`ec-discovery${completed ? ' is-collected' : ''}`}>
            <div className="ec-discovery-head">
              <span className="ec-discovery-seal" aria-hidden="true">✦</span>
              <div>
                <p className="ec-discovery-label">{mission.role === 'epilogue' ? t('ch.epilogueCard') : t('ch.discoveryCard')}</p>
                <p className="ec-discovery-takeaway">{mission.takeaway}</p>
              </div>
            </div>
            <dl className="ec-facts">
              <div><dt>{t('ch.question')}</dt><dd>{mission.scienceQuestion}</dd></div>
              <div><dt>{t('ch.method')}</dt><dd>{mission.method}</dd></div>
              <div><dt>{t('ch.result')}</dt><dd>{mission.result}</dd></div>
              <div>
                <dt>{t('ch.statusAsOf', { date: checked })}</dt>
                <dd>
                  <span className={`ec-status ec-status--${mission.status}`}>{content.statusLabels[mission.status]}</span> {mission.statusDetail}
                </dd>
              </div>
            </dl>
            <p className="ec-source-inline">
              {t('ch.nasaConnection')} <SourceLink id={mission.primarySourceId} />
            </p>
            {discoveryExtra}
            <div className="ec-complete" aria-live="polite">
              {completed ? (
                <>
                  <p className="ec-feedback ec-feedback--ok">{t('ch.added')}</p>
                  <button type="button" className="ec-btn ec-btn--primary" onClick={onBack}>{t('ch.returnToAtlas')}</button>
                </>
              ) : (
                <button type="button" className="ec-btn ec-btn--primary ec-btn--large" onClick={complete}>
                  {mission.role === 'epilogue' ? t('ch.finishJourney') : t('ch.addToJournal')}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <nav className="ec-nav" aria-label={t('ch.prevNext')}>
        {flow.isFirst ? (
          <button type="button" className="ec-btn" onClick={onBack}><span aria-hidden="true">‹</span> {t('common.backToAtlas')}</button>
        ) : (
          <button type="button" className="ec-btn" onClick={flow.prev}><span aria-hidden="true">‹</span> {t('ch.previous')}</button>
        )}
        {!flow.isLast && (
          <div className="ec-nav-next">
            {!flow.canAdvance && <p className="ec-hint" id={`${titleId}-gate`}>{gateHint ?? t('ch.gateDefault')}</p>}
            <button
              type="button"
              className="ec-btn ec-btn--primary"
              onClick={flow.next}
              disabled={!flow.canAdvance}
              aria-describedby={!flow.canAdvance ? `${titleId}-gate` : undefined}
            >
              {t(nextLabel(flow))} <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
      </nav>

      <footer className="ec-sources">
        <h3 className="ec-sources-title">{t('ch.sources')}</h3>
        <ul>
          {chapterSources(id).map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" lang="en">
                {s.label}
                <span className="ec-visually-hidden" lang={locale}> {t('common.newTab')}</span>
              </a>{' '}
              <span className="ec-muted" lang="en">— {s.publisher}</span>
            </li>
          ))}
        </ul>
        {locale !== 'en' && <p className="ec-muted ec-small">{t('common.sourcesEnglish')}</p>}
        {mission.credits?.map((c) => <p key={c} className="ec-muted ec-small">{c}</p>)}
        <p className="ec-muted ec-small">{t('ch.independent', { date: checked })}</p>
      </footer>
    </article>
  );
}

export function SceneText({ scene }: { scene: Scene }) {
  return (
    <>
      {scene.body.map((p) => <p key={p} className="ec-body">{p}</p>)}
      {scene.narration && <ImaginedNarration text={scene.narration} />}
    </>
  );
}

export function ImaginedNarration({ text }: { text: string }) {
  const content = useContent();
  return (
    <figure className="ec-narration">
      <figcaption className="ec-narration-label"><span aria-hidden="true">✎ </span>{content.narrationLabel}</figcaption>
      <blockquote><p>{text}</p></blockquote>
    </figure>
  );
}

export function SourceLink({ id, children }: { id: string; children?: ReactNode }) {
  const { t, locale } = useT();
  const s = getSource(id);
  if (!s) return null;
  return (
    <a href={s.url} target="_blank" rel="noopener noreferrer" lang={children ? undefined : 'en'}>
      {children ?? s.label}
      <span className="ec-visually-hidden" lang={locale}> {t('common.newTab')}</span>
    </a>
  );
}

export function Timeline({ entries }: { entries: ChronologyEntry[] }) {
  const { t } = useT();
  return (
    <ol className="ec-timeline" aria-label={t('ch.timeline')}>
      {entries.map((e) => {
        const source = getSource(e.sourceId);
        return (
          <li key={e.date + e.event}>
            <span className="ec-timeline-date">{e.date}</span>
            <span className="ec-timeline-event">
              {e.event}{' '}
              {source && (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="ec-source-chip">
                  {t('common.source')}<span className="ec-visually-hidden">: <span lang="en">{source.label}</span> {t('common.newTab')}</span>
                </a>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function IllustrativeBadge({ children }: { children: ReactNode }) {
  const { t } = useT();
  return (
    <p className="ec-badge" role="note">
      <span className="ec-badge-tag">{t('ch.simulation')}</span>
      {children}
    </p>
  );
}

/** Figure wrapper for chapter artwork; decorative art is hidden in simplified mode. */
export function Art({ caption, decorative = false, children }: { caption: string; decorative?: boolean; children: ReactNode }) {
  return (
    <figure className={`ec-figure${decorative ? ' ec-decor' : ''}`}>
      {children}
      <figcaption className="ec-art-caption">{caption}</figcaption>
    </figure>
  );
}


import { useEffect, useId, useRef, type ReactNode } from 'react';
import {
  MISSIONS,
  STATUS_LABELS,
  chapterSources,
  getSource,
  type ChapterId,
  type ChronologyEntry,
} from '../../content/missions.ts';
import { IMAGINED_NARRATION_LABEL, STAGE_LABELS, type Scene } from '../../content/scripts.ts';
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

function nextLabel(flow: ChapterFlow): string {
  const upcoming = flow.scenes[flow.index + 1];
  if (!upcoming) return 'Next';
  if (upcoming.kind === 'experiment') return 'Start the experiment';
  if (upcoming.kind === 'discovery') return 'Reveal the discovery';
  if (flow.scene.kind === 'experiment') return 'See the real science';
  return 'Next';
}

export function ChapterFrame({
  id,
  kicker,
  theme,
  flow,
  onBack,
  onComplete,
  visual,
  children,
  discoveryExtra,
  gateHint = 'Finish the experiment to continue.',
}: FrameProps) {
  const mission = MISSIONS[id];
  const titleId = useId();
  const sceneHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const [completed, complete] = useCompleteOnce(onComplete);
  const { scene, scenes, index } = flow;
  const story = scene.kind !== 'experiment' && scene.kind !== 'discovery' && Boolean(visual);

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
        <h2 id={titleId} className="ec-title">
          {mission.chapterTitle}
        </h2>
        <nav aria-label="Chapter steps">
          <ol className="ec-stepper">
            {scenes.map((s, i) => {
              const state = i === index ? 'is-current' : i <= flow.maxReached ? 'is-done' : 'is-locked';
              const label = (
                <>
                  <span className="ec-step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ec-step-text">
                    <span className="ec-step-stage">{STAGE_LABELS[s.kind]}</span>
                    <span className="ec-step-title">{s.title}</span>
                  </span>
                </>
              );
              return (
                <li key={s.id} className={state}>
                  {i <= flow.maxReached ? (
                    <button
                      type="button"
                      onClick={() => flow.goTo(i)}
                      aria-current={i === index ? 'step' : undefined}
                      aria-label={`Step ${i + 1} of ${scenes.length}: ${s.title}${i === index ? ' (current)' : ''}`}
                    >
                      {label}
                    </button>
                  ) : (
                    <span className="ec-step-locked" aria-label={`Step ${i + 1} of ${scenes.length}: ${s.title} (locked)`}>
                      {label}
                    </span>
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
              <span>{STAGE_LABELS[scene.kind]}</span>
              <span aria-hidden="true"> · </span>
              <span>Step {index + 1} of {scenes.length}</span>
            </p>
            <h3 id={`${titleId}-scene`} className="ec-scene-title" ref={sceneHeadingRef} tabIndex={-1}>
              {scene.title}
            </h3>
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
                <p className="ec-discovery-label">{mission.role === 'epilogue' ? 'Epilogue card' : 'Discovery card'}</p>
                <p className="ec-discovery-takeaway">{mission.takeaway}</p>
              </div>
            </div>
            <dl className="ec-facts">
              <div>
                <dt>Question</dt>
                <dd>{mission.scienceQuestion}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{mission.method}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{mission.result}</dd>
              </div>
              <div>
                <dt>Status (as of {formatDate(mission.statusAsOf)})</dt>
                <dd>
                  <span className={`ec-status ec-status--${mission.status}`}>{STATUS_LABELS[mission.status]}</span>{' '}
                  {mission.statusDetail}
                </dd>
              </div>
            </dl>
            <p className="ec-source-inline">
              Real NASA connection: <SourceLink id={mission.primarySourceId} />
            </p>
            {discoveryExtra}
            <div className="ec-complete" aria-live="polite">
              {completed ? (
                <>
                  <p className="ec-feedback ec-feedback--ok">Discovery added to your journal.</p>
                  <button type="button" className="ec-btn ec-btn--primary" onClick={onBack}>
                    Return to the atlas
                  </button>
                </>
              ) : (
                <button type="button" className="ec-btn ec-btn--primary ec-btn--large" onClick={complete}>
                  {mission.role === 'epilogue' ? 'Finish the journey' : 'Add discovery to journal'}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <nav className="ec-nav" aria-label="Previous and next step">
        {flow.isFirst ? (
          <button type="button" className="ec-btn" onClick={onBack}>
            <span aria-hidden="true">‹</span> Back to atlas
          </button>
        ) : (
          <button type="button" className="ec-btn" onClick={flow.prev}>
            <span aria-hidden="true">‹</span> Previous
          </button>
        )}
        {!flow.isLast && (
          <div className="ec-nav-next">
            {!flow.canAdvance && <p className="ec-hint" id={`${titleId}-gate`}>{gateHint}</p>}
            <button
              type="button"
              className="ec-btn ec-btn--primary"
              onClick={flow.next}
              disabled={!flow.canAdvance}
              aria-describedby={!flow.canAdvance ? `${titleId}-gate` : undefined}
            >
              {nextLabel(flow)} <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
      </nav>

      <footer className="ec-sources">
        <h3 className="ec-sources-title">Sources for this chapter</h3>
        <ul>
          {chapterSources(id).map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
                <span className="ec-visually-hidden"> (opens in a new tab)</span>
              </a>{' '}
              <span className="ec-muted">— {s.publisher}</span>
            </li>
          ))}
        </ul>
        {mission.credits?.map((c) => (
          <p key={c} className="ec-muted ec-small">
            {c}
          </p>
        ))}
        <p className="ec-muted ec-small">
          ECHOES is an independent educational project and is not endorsed by NASA. Facts checked {formatDate(mission.statusAsOf)}.
        </p>
      </footer>
    </article>
  );
}

export function SceneText({ scene }: { scene: Scene }) {
  return (
    <>
      {scene.body.map((p) => (
        <p key={p} className="ec-body">
          {p}
        </p>
      ))}
      {scene.narration && <ImaginedNarration text={scene.narration} />}
    </>
  );
}

export function ImaginedNarration({ text }: { text: string }) {
  return (
    <figure className="ec-narration">
      <figcaption className="ec-narration-label">
        <span aria-hidden="true">✎ </span>
        {IMAGINED_NARRATION_LABEL}
      </figcaption>
      <blockquote>
        <p>{text}</p>
      </blockquote>
    </figure>
  );
}

export function SourceLink({ id, children }: { id: string; children?: ReactNode }) {
  const s = getSource(id);
  if (!s) return null;
  return (
    <a href={s.url} target="_blank" rel="noopener noreferrer">
      {children ?? s.label}
      <span className="ec-visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

export function Timeline({ entries }: { entries: ChronologyEntry[] }) {
  return (
    <ol className="ec-timeline" aria-label="Mission timeline">
      {entries.map((e) => {
        const source = getSource(e.sourceId);
        return (
          <li key={e.date + e.event}>
            <span className="ec-timeline-date">{e.date}</span>
            <span className="ec-timeline-event">
              {e.event}{' '}
              {source && (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="ec-source-chip">
                  Source<span className="ec-visually-hidden">: {source.label} (opens in a new tab)</span>
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
  return (
    <p className="ec-badge" role="note">
      <span className="ec-badge-tag">Simulation</span>
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

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  return `${months[m - 1]} ${d}, ${y}`;
}

import { useEffect, useId, useRef, type ReactNode } from 'react';
import {
  MISSIONS,
  STATUS_LABELS,
  chapterSources,
  getSource,
  type ChapterId,
  type ChronologyEntry,
} from '../../content/missions.ts';
import { IMAGINED_NARRATION_LABEL, type Scene } from '../../content/scripts.ts';
import { useCompleteOnce, type ChapterFlow } from './useChapterFlow.ts';
import '../chapters.css';

type FrameProps = {
  id: ChapterId;
  kicker: string;
  theme: 'moon' | 'mars' | 'deep';
  flow: ChapterFlow;
  onBack: () => void;
  onComplete: () => void;
  /** Extra content for the current scene (art, experiment, timeline). */
  children?: ReactNode;
  /** Shown inside the discovery card before the completion button. */
  discoveryExtra?: ReactNode;
  /** Hint shown next to a disabled "Next" button on a gated scene. */
  gateHint?: string;
};

export function ChapterFrame({
  id,
  kicker,
  theme,
  flow,
  onBack,
  onComplete,
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

  // Move focus to the new scene heading when the learner changes step (not on mount).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    sceneHeadingRef.current?.focus();
  }, [index]);

  return (
    <article className={`echoes-chapter ec-theme-${theme}`} aria-labelledby={titleId}>
      <header className="ec-header">
        <button type="button" className="ec-btn ec-btn--ghost ec-back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to atlas
        </button>
        <p className="ec-kicker">{kicker}</p>
        <h2 id={titleId} className="ec-title">
          {mission.chapterTitle}
        </h2>
        <p className="ec-subtitle">
          {mission.title} · {mission.target}
        </p>
        <ol className="ec-progress" aria-label="Chapter progress">
          {scenes.map((s, i) => (
            <li
              key={s.id}
              className={i === index ? 'is-current' : i < index ? 'is-done' : undefined}
              aria-current={i === index ? 'step' : undefined}
            >
              <span className="ec-visually-hidden">
                Step {i + 1} of {scenes.length}: {s.title}
                {i < index ? ' (done)' : ''}
              </span>
            </li>
          ))}
        </ol>
      </header>

      <section className={`ec-scene ec-scene--${scene.kind}`} aria-labelledby={`${titleId}-scene`}>
        <p className="ec-step-label">
          Step {index + 1} of {scenes.length}
        </p>
        <h3 id={`${titleId}-scene`} className="ec-scene-title" ref={sceneHeadingRef} tabIndex={-1}>
          {scene.title}
        </h3>
        <SceneText scene={scene} />
        {children}
        {scene.kind === 'discovery' && (
          <div className="ec-discovery">
            <p className="ec-discovery-label">Discovery card</p>
            <p className="ec-discovery-takeaway">{mission.takeaway}</p>
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
              Read more:{' '}
              <SourceLink id={mission.primarySourceId} />
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
                <button type="button" className="ec-btn ec-btn--primary" onClick={complete}>
                  {mission.role === 'epilogue' ? 'Finish the journey' : 'Add discovery to journal'}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <nav className="ec-nav" aria-label="Chapter steps">
        <button type="button" className="ec-btn" onClick={flow.prev} disabled={flow.isFirst}>
          <span aria-hidden="true">‹</span> Previous
        </button>
        {!flow.isLast && (
          <div className="ec-nav-next">
            {!flow.canAdvance && <p className="ec-hint">{gateHint}</p>}
            <button type="button" className="ec-btn ec-btn--primary" onClick={flow.next} disabled={!flow.canAdvance}>
              Next <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
      </nav>

      <footer className="ec-sources">
        <h3 className="ec-sources-title">Sources</h3>
        <ul>
          {chapterSources(id).map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
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
      <figcaption className="ec-narration-label">{IMAGINED_NARRATION_LABEL}</figcaption>
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
    </a>
  );
}

export function Timeline({ entries }: { entries: ChronologyEntry[] }) {
  return (
    <ol className="ec-timeline" aria-label="Mission timeline">
      {entries.map((e) => (
        <li key={e.date + e.event}>
          <span className="ec-timeline-date">{e.date}</span>
          <span className="ec-timeline-event">
            {e.event} <SourceLink id={e.sourceId}>(source)</SourceLink>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function IllustrativeBadge({ children }: { children: ReactNode }) {
  return (
    <p className="ec-badge" role="note">
      <span aria-hidden="true">⚠ </span>
      {children}
    </p>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  return `${months[m - 1]} ${d}, ${y}`;
}

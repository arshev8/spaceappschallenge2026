import { motionReduced } from '../app/preferences';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { EXHIBITS } from '../app/exhibits';
import { record, useExplorerLog } from '../app/explorer';
import { useShell } from '../app/l10n';
import type { ChapterId } from '../app/missions';
import { Icon } from './Icon';
import { NasaImage } from './NasaImage';

const START = 1969, END = 2026;
const FILTERS = ['all', 'apollo11', 'voyager', 'opportunity', 'insight'] as const;
const hueFor = (chapter?: ChapterId) => EXHIBITS[chapter ?? 'insight'].hue;

export default function Timeline() {
  const log = useExplorerLog();
  const { t, moments: all, mission: text } = useShell();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const moments = useMemo(() => all.filter(m => filter === 'all' || m.chapter === filter), [all, filter]);
  const [activeId, setActiveId] = useState(all[0].id);
  const active = moments.find(m => m.id === activeId) ?? moments[0];
  const index = moments.indexOf(active);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const track = useRef<HTMLDivElement>(null);
  // The detail card is keyed by moment (for its entrance animation), so it remounts on every step.
  // Remember which step button was used and put focus back on its new copy.
  const stepFocus = useRef<'earlier' | 'later' | null>(null);
  const earlier = useRef<HTMLButtonElement>(null);
  const later = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const which = stepFocus.current;
    stepFocus.current = null;
    if (which) (which === 'earlier' ? earlier : later).current?.focus({ preventScroll: true });
  }, [active.id]);

  const open = (id: string, focus = false) => {
    setActiveId(id);
    record('moments', id);
    const el = buttons.current[id];
    if (focus) el?.focus({ preventScroll: true });
    if (el && track.current) {
      const t = track.current;
      t.scrollTo({ left: el.offsetLeft - t.clientWidth / 2, behavior: motionReduced() ? 'auto' : 'smooth' });
    }
  };
  useEffect(() => { record('moments', all[0].id); }, [all]);

  const onKey = (event: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: moments.length - 1 };
    if (event.key in map) { event.preventDefault(); const next = moments[Math.max(0, Math.min(moments.length - 1, map[event.key]))]; open(next.id, true); }
  };

  // Stack moments that share a year so dots never overlap.
  const lanes = new Map<number, number>();
  const placed = moments.map(m => { const lane = lanes.get(m.year) ?? 0; lanes.set(m.year, lane + 1); return { m, lane }; });
  const decades = [1970, 1980, 1990, 2000, 2010, 2020];

  return <section className="timeline-page" aria-labelledby="timeline-title" style={{ '--hue': hueFor(active.chapter) } as CSSProperties}>
    <header className="page-head page-head-split">
      <div><h1 id="timeline-title">{t('ui.title.timeline')}</h1><p>{t('ui.tl.lede')}</p></div>
      <div className="filter-row" role="group" aria-label={t('ui.tl.filter')}>
        {FILTERS.map(f => <button key={f} type="button" aria-pressed={filter === f} onClick={() => { setFilter(f); const first = all.find(m => f === 'all' || m.chapter === f)!; setActiveId(first.id); }}
          style={f === 'all' ? undefined : { '--chip': hueFor(f) } as CSSProperties}>{f === 'all' ? t('ui.tl.all') : text(f).name}</button>)}
      </div>
    </header>

    <div className="tl-track-wrap">
      <div className="tl-track" ref={track}>
        <div className="tl-rail">
          {decades.map(d => <span key={d} className="tl-decade" style={{ left: `${(d - START) / (END - START) * 100}%` }}>{t('ui.tl.decade', { d })}</span>)}
          <ol className="tl-moments" aria-label={t('ui.tl.list')}>
            {placed.map(({ m, lane }) => <li key={m.id} style={{ left: `${(m.year - START) / (END - START) * 100}%`, '--lane': lane, '--dot': hueFor(m.chapter) } as CSSProperties}>
              <button ref={el => { buttons.current[m.id] = el; }} type="button" className={`tl-dot ${m.id === active.id ? 'is-active' : ''} ${log.moments.includes(m.id) ? 'is-seen' : ''}`}
                aria-current={m.id === active.id ? 'true' : undefined} tabIndex={m.id === active.id ? 0 : -1} onKeyDown={onKey} onClick={() => open(m.id)}>
                <span className="sr-only">{m.date}: {m.title}</span>
              </button>
            </li>)}
          </ol>
        </div>
      </div>
    </div>

    <article className="tl-detail" key={active.id} aria-live="polite">
      <NasaImage media={active.media} caption className="tl-photo" sizes="(max-width: 900px) 100vw, 45vw" />
      <div className="tl-copy">
        <p className="tl-year" aria-hidden="true">{active.year}</p>
        <p className="tl-date">{active.date} · {active.chapter ? text(active.chapter).name : active.mission}</p>
        <h2>{active.title}</h2>
        <p>{active.detail}</p>
        <div className="button-row">
          {/* aria-disabled instead of disabled: a disabled button would drop keyboard focus to <body> at either end. */}
          <button ref={earlier} type="button" className="icon-button" aria-disabled={index === 0} onClick={() => { if (index > 0) { stepFocus.current = 'earlier'; open(moments[index - 1].id); } }} aria-label={t('ui.tl.earlier')}><Icon name="back" size={18} /></button>
          <button ref={later} type="button" className="icon-button" aria-disabled={index === moments.length - 1} onClick={() => { if (index < moments.length - 1) { stepFocus.current = 'later'; open(moments[index + 1].id); } }} aria-label={t('ui.tl.later')}><Icon name="arrow" size={18} /></button>
          {active.chapter && <a className="text-link" href={`#/chapter/${active.chapter}`}>{t('ui.tl.open', { name: text(active.chapter).name })}<Icon name="arrow" size={16} /></a>}
        </div>
        <a className="source-link" href={active.source} target="_blank" rel="noreferrer">{t('ui.tl.source')}<Icon name="external" size={11} /></a>
        <p className="tl-count">{t('ui.count', { n: index + 1, total: moments.length })}</p>
      </div>
    </article>
  </section>;
}

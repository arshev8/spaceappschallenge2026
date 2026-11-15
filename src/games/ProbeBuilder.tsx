import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { record, useExplorerLog } from '../app/explorer';
import { MEDIA, mediaUrl } from '../app/media';
import { useReducedMotion } from '../app/preferences';
import { useShell } from '../app/l10n';
import { PART_ICONS, PROBE_BUS, toDataUrl } from './sprites';

const iconCache = new Map<string, string>();
const icon = (id: string) => { let url = iconCache.get(id); if (!url) { url = toDataUrl(PART_ICONS[id]); iconCache.set(id, url); } return url; };
import type { Destination, Part, SlotId } from './probeData';

type Build = Partial<Record<SlotId, Part>>;
type Drag = { part: Part; x: number; y: number; startX: number; startY: number; active: boolean };

export default function ProbeBuilder() {
  const reduced = useReducedMotion();
  const log = useExplorerLog();
  const [dest, setDest] = useState<Destination | null>(null);
  const { t, destinations: DESTINATIONS, slots: SLOTS, parts: PARTS } = useShell();
  // Parts are stored by identity, then re-read from the localized list so a language switch updates names.
  const [rawBuild, setBuild] = useState<Build>({});
  const [rawInfo, setInfo] = useState<Part | null>(null);
  const localPart = (p: Part) => PARTS.find(x => x.id === p.id)!;
  const build: Build = Object.fromEntries(Object.entries(rawBuild).map(([k, p]) => [k, localPart(p)]));
  const info = rawInfo && localPart(rawInfo);
  const slotName = (id: SlotId) => SLOTS.find(s => s.id === id)!.name;
  const [message, setMessage] = useState('');
  // A slot that just refused a part flashes red, so sighted players see why nothing happened.
  const [refused, setRefused] = useState<SlotId | null>(null);
  useEffect(() => {
    if (!refused) return;
    const timer = window.setTimeout(() => setRefused(null), 1400);
    return () => window.clearTimeout(timer);
  }, [refused]);
  const [launched, setLaunched] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hover, setHover] = useState<SlotId | null>(null);
  const dragRef = useRef<Drag | null>(null);

  const destination = DESTINATIONS.find(d => d.id === dest);
  const complete = SLOTS.every(s => build[s.id]);

  const place = (part: Part, slot: SlotId = part.slot) => {
    if (slot !== part.slot) { setMessage(t('ui.p.wrongSlot', { part: part.name, slot: slotName(part.slot) })); setRefused(slot); return; }
    setBuild(b => ({ ...b, [slot]: part }));
    setInfo(part);
    setMessage(t('ui.p.fitted', { part: part.name, slot: slotName(slot) }));
  };
  const remove = (slot: SlotId) => { setBuild(b => { const next = { ...b }; delete next[slot]; return next; }); setMessage(t('ui.p.removed')); };

  // Pointer drag that works for mouse, pen and touch. A tap (no movement) places the part directly.
  const onPointerDown = (part: Part) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { part, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, active: false };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const moved = Math.hypot(event.clientX - d.startX, event.clientY - d.startY) > 8;
    const next = { ...d, x: event.clientX, y: event.clientY, active: d.active || moved };
    dragRef.current = next;
    if (next.active) {
      setDrag(next);
      const el = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-slot]');
      setHover((el?.dataset.slot as SlotId) ?? null);
    }
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    dragRef.current = null; setDrag(null); setHover(null);
    if (!d) return;
    if (!d.active) { place(d.part); return; }
    const el = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-slot]');
    if (el?.dataset.slot) place(d.part, el.dataset.slot as SlotId);
    else setMessage(t('ui.p.dropHint'));
  };
  const onPointerCancel = () => { dragRef.current = null; setDrag(null); setHover(null); };

  const ratings = destination ? SLOTS.map(s => ({ slot: s, part: build[s.id]!, fit: build[s.id]?.fit[destination.id] })) : [];
  const failures = ratings.filter(r => r.fit?.[0] === 'bad');
  const greats = ratings.filter(r => r.fit?.[0] === 'great').length;
  const ready = complete && failures.length === 0;

  const launch = () => {
    if (!complete || !destination) return;
    setLaunched(true);
    if (failures.length === 0) record('probes', destination.id);
    setMessage(failures.length === 0 ? t('ui.p.ready', { dest: destination.name, n: greats }) : t('ui.p.risk', { dest: destination.name, n: failures.length }));
  };

  if (!destination) return <div className="probe">
    <h2 className="game-step">{t('ui.p.step1')}</h2>
    <ul className="dest-grid">
      {DESTINATIONS.map(d => <li key={d.id}><button type="button" className="dest-card" onClick={() => { setDest(d.id); setBuild({}); setLaunched(false); setInfo(null); setMessage(''); }} style={{ '--hue': d.color } as CSSProperties}>
        <img src={mediaUrl(MEDIA[d.media], 'sm')} alt="" width="160" height="160" loading="lazy" />
        <strong>{d.name}{log.probes.includes(d.id) && <span className="done-mark"> {t('ui.p.built')}</span>}</strong><span>{d.brief}</span>
      </button></li>)}
    </ul>
    <p className="game-note">{t('ui.p.note', { n: log.probes.length })}</p>
  </div>;

  return <div className="probe" style={{ '--hue': destination.color } as CSSProperties}>
    <div className="probe-head">
      <h2 className="game-step">{t(launched ? 'ui.p.step3' : 'ui.p.step2')} · <span>{destination.name}</span></h2>
      <button type="button" className="text-link" onClick={() => setDest(null)}>{t('ui.p.change')}</button>
    </div>

    <div className={`probe-bench ${launched ? 'is-launched' : ''}`}>
      <div className={`probe-schematic ${launched && ready && !reduced ? 'is-flying' : ''}`}>
        <img className="probe-bus" src={toDataUrl(PROBE_BUS)} alt="" aria-hidden="true" />
        {SLOTS.map(s => {
          const part = build[s.id];
          const fit = launched && part ? part.fit[destination.id][0] : null;
          return <div key={s.id} data-slot={s.id} className={`slot slot-${s.id} ${part ? 'is-filled' : ''} ${hover === s.id ? 'is-hover' : ''} ${refused === s.id ? 'is-refused' : ''} ${fit ? `fit-${fit}` : ''}`}>
            {part ? <>
              <img className="slot-icon" src={icon(part.id)} alt="" aria-hidden="true" />
              <span className="slot-name">{part.name}</span>
              {!launched && <button type="button" className="slot-remove" onClick={() => remove(s.id)} aria-label={t('ui.p.remove', { name: part.name })}>×</button>}
            </> : <><span className="slot-label">{s.name}</span><span className="slot-hint">{s.hint}</span></>}
          </div>;
        })}
      </div>

      {!launched ? <div className="parts-tray">
        {SLOTS.map(s => <fieldset key={s.id} className="parts-group">
          <legend>{s.name}</legend>
          <div className="parts-row">
            {PARTS.filter(p => p.slot === s.id).map(p => <button key={p.id} type="button" className={`part ${build[s.id]?.id === p.id ? 'is-used' : ''}`}
              aria-pressed={build[s.id]?.id === p.id} aria-describedby="probe-info"
              onPointerDown={onPointerDown(p)} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); place(p); } }}
              onFocus={() => setInfo(p)} onMouseEnter={() => setInfo(p)}>
              <img className="part-icon" src={icon(p.id)} alt="" aria-hidden="true" />{p.name}
            </button>)}
          </div>
        </fieldset>)}
      </div> : <ol className="review">
        {ratings.map(r => <li key={r.slot.id} className={`review-${r.fit![0]}`}>
          <span className="review-badge">{t(r.fit![0] === 'great' ? 'ui.p.great' : r.fit![0] === 'ok' ? 'ui.p.ok' : 'ui.p.bad')}</span>
          <strong>{r.part.name}</strong><p>{r.fit![1]}</p>
        </li>)}
      </ol>}
    </div>

    <div className="probe-footer">
      {!launched ? <div id="probe-info" className="probe-info" aria-live="polite">
        {info ? <><strong>{info.name}</strong><p>{info.what}</p></> : <p>{t('ui.p.infoEmpty')}</p>}
      </div> : <div className={`verdict ${ready ? 'verdict-go' : 'verdict-nogo'}`}>
        <h3>{t(ready ? 'ui.p.go' : 'ui.p.nogo')}</h3>
        <p>{ready ? `${t('ui.p.goText', { dest: destination.name })} ${greats === 4 ? t('ui.p.perfect') : t('ui.p.partial', { n: greats })}` : t('ui.p.nogoText')}</p>
      </div>}
      <div className="button-row">
        {!launched ? <button type="button" className="button button-primary" disabled={!complete} onClick={launch}>{complete ? t('ui.p.launch') : t('ui.p.fitMore', { n: SLOTS.filter(s => !build[s.id]).length })}</button>
          : <><button type="button" className="button button-primary" onClick={() => setLaunched(false)}>{t(ready ? 'ui.p.improve' : 'ui.p.fix')}</button>
            <button type="button" className="button button-ghost" onClick={() => setDest(null)}>{t('ui.p.newDest')}</button></>}
      </div>
    </div>
    <p className="probe-message" aria-live="polite">{message}</p>
    {drag?.active && <div className="drag-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true"><img src={icon(drag.part.id)} alt="" width="24" height="24" />{drag.part.name}</div>}
  </div>;
}

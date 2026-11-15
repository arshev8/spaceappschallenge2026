import { useId, useState } from 'react';
import type { Hotspot } from '../app/exhibits';
import { record } from '../app/explorer';
import type { Media } from '../app/media';
import { NasaImage } from './NasaImage';
import { useShell } from '../app/l10n';

/**
 * A photo with numbered, focusable hotspots. The same information is available as a
 * plain list beside the image, so nothing is locked inside the visual.
 */
export function HotspotImage({ media, hotspots, label }: { media: Media; hotspots: Hotspot[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const uid = useId();
  const { t, media: localize } = useShell();
  const open = (id: string) => { setActive(current => current === id ? null : id); record('inspected', id); };
  const current = hotspots.find(h => h.id === active);
  return <div className="hotspot-wrap">
    <div className="hotspot-stage">
      <NasaImage media={media} caption={false} sizes="(max-width: 760px) 100vw, 60vw" />
      {hotspots.map((h, i) => <button key={h.id} type="button" className={`hotspot ${active === h.id ? 'is-active' : ''}`}
        style={{ left: `${h.x}%`, top: `${h.y}%` }} aria-expanded={active === h.id} aria-controls={`${uid}-detail`}
        onClick={() => open(h.id)} aria-label={`${i + 1}: ${h.name}`}><span aria-hidden="true">{i + 1}</span></button>)}
    </div>
    <div className="hotspot-panel">
      <p className="hotspot-label">{label}</p>
      <ol className="hotspot-list">
        {hotspots.map((h, i) => <li key={h.id}><button type="button" className={active === h.id ? 'is-active' : ''} aria-expanded={active === h.id} aria-controls={`${uid}-detail`} onClick={() => open(h.id)}><span aria-hidden="true">{i + 1}</span>{h.name}</button></li>)}
      </ol>
      <div id={`${uid}-detail`} className="hotspot-detail" aria-live="polite">
        {current ? <><strong>{current.name}</strong><p>{current.detail}</p></> : <p className="hotspot-empty">{t('ui.hot.pick')}</p>}
      </div>
      <p className="hotspot-caption">{localize(media).caption}</p>
    </div>
  </div>;
}

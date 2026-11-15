import { useEffect, useRef, useState } from 'react';
import { award } from '../app/explorer';
import { MEDIA, mediaUrl } from '../app/media';
import { useReducedMotion } from '../app/preferences';
import { useT, type MessageKey } from '../i18n';

type Target = { id: 'moon' | 'mars' | 'voyager'; pos: number; /** Animation length in ms (out and back). */ ms: number };

const TARGETS: Target[] = [
  { id: 'moon', pos: 27, ms: 2560 },
  { id: 'mars', pos: 60, ms: 4200 },
  { id: 'voyager', pos: 93, ms: 6000 },
];

/** The landing page's signature: send a signal from Earth and watch its echo come home. */
export function SignalHero() {
  const reduced = useReducedMotion();
  const { t } = useT();
  const tx = (id: Target['id'], field: 'name' | 'real' | 'speed' | 'echo') => t(`ui.sig.${id}.${field}` as MessageKey);
  const [active, setActive] = useState<Target['id'] | null>(null);
  const [echoed, setEchoed] = useState<Target | null>(null);
  const pulse = useRef<HTMLSpanElement>(null);
  const anim = useRef<Animation | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => { anim.current?.cancel(); window.clearTimeout(timer.current); }, []);

  const send = (target: Target) => {
    anim.current?.cancel();
    window.clearTimeout(timer.current);
    setEchoed(null);
    setActive(target.id);
    const finish = () => { setActive(null); setEchoed(target); award('first-signal'); };
    const el = pulse.current;
    if (reduced || !el || typeof el.animate !== 'function') { finish(); return; }
    const from = 'calc(var(--earth-pos) - 6px)', to = `calc(${target.pos}% - 6px)`;
    anim.current = el.animate([
      { left: from, opacity: 0, transform: 'scale(.6)' },
      { left: from, opacity: 1, transform: 'scale(1)', offset: .04 },
      { left: to, opacity: 1, transform: 'scale(1.4)', offset: .5 },
      { left: from, opacity: 1, transform: 'scale(1)', offset: .97 },
      { left: from, opacity: 0, transform: 'scale(.6)' },
    ], { duration: target.ms, easing: 'linear' });
    anim.current.onfinish = finish;
  };

  const current = TARGETS.find(t => t.id === active);
  // The accessible name starts with the visible label (WCAG 2.5.3), so "click Moon" works in voice control.
  return <div className="signal" role="group" aria-labelledby="signal-title">
    <div className="signal-head">
      <h2 id="signal-title">{t('ui.signal.title')}</h2>
      <p>{t('ui.signal.choose')}</p>
    </div>
    <div className={`signal-track ${active ? `is-sending to-${active}` : ''}`}>
      <span className="signal-line" aria-hidden="true" />
      <span className="signal-node signal-earth" aria-hidden="true"><img src={mediaUrl(MEDIA.earth, 'sm')} alt="" width="48" height="48" /><span>{t('ui.signal.earth')}</span></span>
      {TARGETS.map(target => <button key={target.id} type="button" className={`signal-node signal-target target-${target.id} ${echoed?.id === target.id ? 'has-echo' : ''}`}
        style={{ left: `${target.pos}%` }} onClick={() => send(target)} aria-label={`${t(`ui.signal.${target.id}` as MessageKey)}: ${t('ui.signal.send', { name: tx(target.id, 'name') })}`} disabled={active !== null && active !== target.id}>
        {target.id === 'voyager' ? <VoyagerGlyph /> : <img src={mediaUrl(target.id === 'moon' ? MEDIA.moon : MEDIA.mars, 'sm')} alt="" width="40" height="40" />}
        <span>{t(`ui.signal.${target.id}` as MessageKey)}</span>
        <i className="signal-ring" aria-hidden="true" />
      </button>)}
      <span ref={pulse} className="signal-pulse" aria-hidden="true" />
    </div>
    <div className="signal-readout" aria-live="polite">
      {current ? <p><strong>{t('ui.signal.sending', { name: tx(current.id, 'name') })}</strong> <span>{tx(current.id, 'speed')}</span></p>
        : echoed ? <p><strong>{t('ui.signal.echo', { time: tx(echoed.id, 'real') })}</strong> <span>{tx(echoed.id, 'echo')}</span></p>
        : <p><span>{t('ui.signal.scale')}</span></p>}
    </div>
  </div>;
}

function VoyagerGlyph() {
  return <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <ellipse cx="17" cy="18" rx="10" ry="10" fill="#0d1530" /><path d="M17 8v20M7 18h20" opacity=".35" />
    <path d="M25 22l9 9M22 26l-6 10M27 15l9-7" />
  </svg>;
}

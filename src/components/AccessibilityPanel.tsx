import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  TEXT_SCALE, TEXT_SIZES, changedCount, resetA11y, setA11y, useA11y, useSystemReducedMotion,
  type A11ySettings,
} from '../app/a11y';
import { setPreferences, usePreferences } from '../app/preferences';
import { useT, type MessageKey } from '../i18n';
import { Icon } from './Icon';

type IconName = Parameters<typeof Icon>[0]['name'];

/**
 * The accessibility panel: a compact, non-modal dialog opened from the header.
 * - Native controls only (switch-role checkboxes, radio groups, a select), so keyboard,
 *   screen readers and mobile pickers work without custom key handling.
 * - Escape or the close button returns focus to the toggle; clicking or tabbing away closes it.
 *   It never traps focus.
 * - Every change is announced through the shell's live region, and each switch also prints
 *   its state as text, never by colour or position alone.
 */
export default function AccessibilityPanel({ announce }: { announce: (message: string) => void }) {
  const { t, locale } = useT();
  const s = useA11y();
  const { prefs } = usePreferences();
  const systemCalm = useSystemReducedMotion();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const changed = changedCount(s) + (prefs.contrast === 'high' ? 1 : 0);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggle.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onPointer = (event: PointerEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const onOff = (on: boolean) => t(on ? 'a11y.on' : 'a11y.off');
  const say = (label: MessageKey, value: string) => announce(`${t(label)}: ${value}`);
  const update = <K extends keyof Omit<A11ySettings, 'version'>>(key: K, value: A11ySettings[K], label: MessageKey, spoken: string) => {
    setA11y({ [key]: value } as Partial<A11ySettings>);
    say(label, spoken);
  };
  const percent = (n: number) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(n / 100);

  return <div className="a11y" ref={wrap}
    onBlur={event => { const next = event.relatedTarget as Node | null; if (open && next && !wrap.current?.contains(next)) setOpen(false); }}>
    <button ref={toggle} type="button" className="icon-button a11y-toggle" aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup="dialog"
      title={t('a11y.open')} onClick={() => (open ? close() : setOpen(true))}>
      <Icon name="access" size={20} />
      <span className="sr-only">{t('a11y.open')}{changed > 0 ? ` (${t('a11y.active', { n: changed })})` : ''}</span>
      {changed > 0 && <span className="a11y-badge" aria-hidden="true">{changed}</span>}
    </button>

    {open && <div ref={panel} id={id} className="a11y-panel" role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`} tabIndex={-1}
      onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <div className="a11y-head">
        <div>
          <h2 id={`${id}-title`}>{t('a11y.title')}</h2>
          <p id={`${id}-intro`}>{t('a11y.intro')}</p>
        </div>
        <button type="button" className="icon-button a11y-close" onClick={() => close()} aria-label={t('a11y.close')}>×</button>
      </div>

      <Group title={t('a11y.g.see')}>
        <Switch icon="contrast" label={t('ui.highContrast')} desc={t('a11y.contrast.desc')} checked={prefs.contrast === 'high'} state={onOff}
          onChange={on => { setPreferences({ contrast: on ? 'high' : 'normal' }); say('ui.highContrast', onOff(on)); }} />
        <Choices icon="text" label={t('a11y.text')} name={`${id}-size`} value={s.textSize}
          options={TEXT_SIZES.map(v => ({ value: v, label: percent(TEXT_SCALE[v]) }))}
          onChange={v => update('textSize', v, 'a11y.text', percent(TEXT_SCALE[v]))} />
      </Group>

      <Group title={t('a11y.g.move')}>
        {/* When the device already asks for less motion, the switch shows that and cannot override it. */}
        <Switch icon="motion" label={t('a11y.motion')} checked={s.reduceMotion || systemCalm} disabled={systemCalm && !s.reduceMotion} state={onOff}
          desc={systemCalm && !s.reduceMotion ? `${t('a11y.motion.desc')} ${t('a11y.motion.system')}` : t('a11y.motion.desc')}
          onChange={on => update('reduceMotion', on, 'a11y.motion', onOff(on))} />
        <Switch icon="play" label={t('a11y.games')} desc={t('a11y.games.desc')} checked={s.relaxedGames} state={onOff}
          onChange={on => update('relaxedGames', on, 'a11y.games', onOff(on))} />
      </Group>

      <div className="a11y-foot">
        <small aria-live="off">{changed > 0 ? t('a11y.active', { n: changed }) : ''}</small>
        <button type="button" className="button button-ghost button-small" disabled={changed === 0}
          onClick={() => { resetA11y(); setPreferences({ contrast: 'normal' }); announce(t('a11y.resetDone')); panel.current?.focus(); }}>
          <Icon name="reset" size={16} />{t('a11y.reset')}
        </button>
      </div>
    </div>}
  </div>;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return <section className="a11y-group" aria-labelledby={id}><h3 id={id}>{title}</h3>{children}</section>;
}

function Switch({ icon, label, desc, checked, disabled, state, onChange }: { icon: IconName; label: string; desc: string; checked: boolean; disabled?: boolean; state: (on: boolean) => string; onChange: (on: boolean) => void }) {
  const id = useId();
  return <div className={`a11y-row ${checked ? 'is-on' : ''}`}>
    <Icon name={icon} size={20} />
    <span className="a11y-copy"><label htmlFor={id}>{label}</label><small id={`${id}-d`}>{desc}</small></span>
    <span className="a11y-control">
      <span className="a11y-state" aria-hidden="true">{state(checked)}</span>
      <input id={id} type="checkbox" role="switch" className="a11y-switch" checked={checked} disabled={disabled} aria-describedby={`${id}-d`} onChange={event => onChange(event.target.checked)} />
    </span>
  </div>;
}

function Choices<V extends string>({ icon, label, name, value, options, onChange }: { icon: IconName; label: string; name: string; value: V; options: { value: V; label: string }[]; onChange: (v: V) => void }) {
  const id = useId();
  return <div className="a11y-row a11y-row-wide">
    <Icon name={icon} size={20} />
    <span className="a11y-copy"><span id={id}>{label}</span></span>
    <div className="a11y-choices" role="radiogroup" aria-labelledby={id}>
      {options.map(o => <label key={o.value}>
        <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />{o.label}
      </label>)}
    </div>
  </div>;
}

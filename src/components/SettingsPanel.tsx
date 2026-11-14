import { useId, useRef, type ReactNode, type RefObject } from 'react';
import { TEXT_SIZES, systemPrefersReducedMotion, type Preferences } from '../app/preferences';
import { Icon } from './Icon';

type ToggleKey = 'highContrast' | 'reduceMotion' | 'simplified' | 'readingFont';

const TOGGLES: { key: ToggleKey; label: string; description: string; on: string; off: string }[] = [
  {
    key: 'highContrast',
    label: 'High contrast',
    description: 'Pure black background, brighter text, thicker outlines and a bold yellow focus ring.',
    on: 'High contrast on.',
    off: 'High contrast off.',
  },
  {
    key: 'reduceMotion',
    label: 'Reduce motion',
    description: 'Stops decorative movement and makes changes appear instantly. Experiments still work and still explain every result in words.',
    on: 'Reduced motion on.',
    off: 'Reduced motion off.',
  },
  {
    key: 'simplified',
    label: 'Simplified interface',
    description: 'Hides decorative artwork and starfields, uses plain backgrounds and shows the atlas as a simple list.',
    on: 'Simplified interface on.',
    off: 'Simplified interface off.',
  },
  {
    key: 'readingFont',
    label: 'Reading-friendly text',
    description: 'A plain, open typeface with extra letter, word and line spacing. Some readers find it easier; it is not a treatment for dyslexia.',
    on: 'Reading-friendly text on.',
    off: 'Reading-friendly text off.',
  },
];

export function SettingsButton({ onOpen, buttonRef }: { onOpen: () => void; buttonRef: RefObject<HTMLButtonElement | null> }) {
  return (
    <button ref={buttonRef} type="button" className="settings-trigger" onClick={onOpen} aria-haspopup="dialog">
      <Icon name="settings" size={18} />
      <span>Display &amp; accessibility</span>
    </button>
  );
}

export default function SettingsPanel({
  dialogRef,
  prefs,
  saved,
  onChange,
  onReset,
  onClose,
  announce,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  prefs: Preferences;
  saved: boolean;
  onChange: <K extends keyof Omit<Preferences, 'version'>>(key: K, value: Preferences[K]) => void;
  onReset: () => void;
  onClose: () => void;
  announce: (message: string) => void;
}) {
  const titleId = useId();
  const descId = useId();
  const sizeName = useId();
  const closeButton = useRef<HTMLButtonElement>(null);
  const systemMotion = systemPrefersReducedMotion();

  return (
    <dialog
      ref={dialogRef}
      className="settings-dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
    >
      <div className="settings-inner">
        <div className="settings-head">
          <div>
            <p className="eyebrow">Make ECHOES yours</p>
            <h2 id={titleId}>Display &amp; accessibility</h2>
          </div>
          <button ref={closeButton} type="button" className="icon-button" onClick={() => dialogRef.current?.close()}>
            <Icon name="close" size={20} />
            <span className="sr-only">Close settings</span>
          </button>
        </div>
        <p id={descId} className="settings-intro">Changes apply right away, on every page, and are saved on this device.</p>

        <fieldset className="settings-group">
          <legend>Text size</legend>
          <div className="size-options">
            {TEXT_SIZES.map((size, i) => (
              <label key={size.value} className="size-option">
                <input
                  type="radio"
                  name={sizeName}
                  value={size.value}
                  checked={prefs.textSize === size.value}
                  onChange={() => { onChange('textSize', size.value); announce(`Text size: ${size.label}.`); }}
                />
                <span className="size-sample" aria-hidden="true" style={{ fontSize: `${1 + i * 0.3}em` }}>Aa</span>
                <span className="size-label">{size.label}</span>
                <span className="size-desc">{size.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="settings-group">
          {TOGGLES.map(t => (
            <Toggle
              key={t.key}
              label={t.label}
              description={t.description}
              checked={prefs[t.key]}
              onChange={value => { onChange(t.key, value); announce(value ? t.on : t.off); }}
              note={t.key === 'reduceMotion' && systemMotion ? 'Your device already asks for reduced motion, so ECHOES keeps animation to a minimum either way.' : undefined}
            />
          ))}
        </div>

        {!saved && <p className="settings-warning" role="alert">Device storage is unavailable, so these settings will last only for this visit.</p>}

        <div className="settings-actions">
          <button type="button" className="button button-secondary" onClick={() => { onReset(); announce('All display settings reset to default.'); }}>
            <Icon name="reset" size={16} /> Reset to default
          </button>
          <button type="button" className="button button-primary" onClick={() => dialogRef.current?.close()}>Done</button>
        </div>
      </div>
    </dialog>
  );
}

function Toggle({ label, description, checked, onChange, note }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; note?: ReactNode }) {
  const id = useId();
  return (
    <div className="setting-toggle">
      <div className="setting-copy">
        <label htmlFor={id}>{label}</label>
        <p id={`${id}-desc`}>{description}</p>
        {note && <p className="setting-note">{note}</p>}
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="switch"
        checked={checked}
        aria-describedby={`${id}-desc`}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="switch-state" aria-hidden="true">{checked ? 'On' : 'Off'}</span>
    </div>
  );
}

import { useId, type ReactNode, type RefObject } from 'react';
import { systemPrefersReducedMotion, type Preferences, type TextSize } from '../app/preferences';
import { useT, type MessageKey } from '../i18n';
import { Icon } from './Icon';

type ToggleKey = 'highContrast' | 'reduceMotion' | 'simplified' | 'readingFont';

const TOGGLES: { key: ToggleKey; label: MessageKey; description: MessageKey }[] = [
  { key: 'highContrast', label: 'settings.contrast', description: 'settings.contrastDesc' },
  { key: 'reduceMotion', label: 'settings.motion', description: 'settings.motionDesc' },
  { key: 'simplified', label: 'settings.simplified', description: 'settings.simplifiedDesc' },
  { key: 'readingFont', label: 'settings.reading', description: 'settings.readingDesc' },
];

const SIZES: { value: TextSize; label: MessageKey; description: MessageKey }[] = [
  { value: 'normal', label: 'settings.size.normal', description: 'settings.size.normalDesc' },
  { value: 'large', label: 'settings.size.large', description: 'settings.size.largeDesc' },
  { value: 'xlarge', label: 'settings.size.xlarge', description: 'settings.size.xlargeDesc' },
];

export function SettingsButton({ onOpen, buttonRef }: { onOpen: () => void; buttonRef: RefObject<HTMLButtonElement | null> }) {
  const { t } = useT();
  return (
    <button ref={buttonRef} type="button" className="settings-trigger" onClick={onOpen} aria-haspopup="dialog">
      <Icon name="settings" size={18} />
      <span>{t('settings.button')}</span>
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
  const { t } = useT();
  const titleId = useId();
  const descId = useId();
  const sizeName = useId();
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
            <p className="eyebrow">{t('settings.eyebrow')}</p>
            <h2 id={titleId}>{t('settings.button')}</h2>
          </div>
          <button type="button" className="icon-button" onClick={() => dialogRef.current?.close()}>
            <Icon name="close" size={20} />
            <span className="sr-only">{t('settings.close')}</span>
          </button>
        </div>
        <p id={descId} className="settings-intro">{t('settings.intro')}</p>

        <fieldset className="settings-group">
          <legend>{t('settings.textSize')}</legend>
          <div className="size-options">
            {SIZES.map((size, i) => (
              <label key={size.value} className="size-option">
                <input
                  type="radio"
                  name={sizeName}
                  value={size.value}
                  checked={prefs.textSize === size.value}
                  onChange={() => { onChange('textSize', size.value); announce(t('settings.sizeChanged', { size: t(size.label) })); }}
                />
                <span className="size-sample" aria-hidden="true" style={{ fontSize: `${1 + i * 0.3}em` }}>Aa</span>
                <span className="size-label">{t(size.label)}</span>
                <span className="size-desc">{t(size.description)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="settings-group">
          {TOGGLES.map(item => (
            <Toggle
              key={item.key}
              label={t(item.label)}
              description={t(item.description)}
              checked={prefs[item.key]}
              onLabel={t('settings.on')}
              offLabel={t('settings.off')}
              onChange={value => { onChange(item.key, value); announce(t(value ? 'settings.turnedOn' : 'settings.turnedOff', { name: t(item.label) })); }}
              note={item.key === 'reduceMotion' && systemMotion ? t('settings.motionNote') : undefined}
            />
          ))}
        </div>

        {!saved && <p className="settings-warning" role="alert">{t('settings.unsaved')}</p>}

        <div className="settings-actions">
          <button type="button" className="button button-secondary" onClick={() => { onReset(); announce(t('settings.resetDone')); }}>
            <Icon name="reset" size={16} /> {t('settings.reset')}
          </button>
          <button type="button" className="button button-primary" onClick={() => dialogRef.current?.close()}>{t('settings.done')}</button>
        </div>
      </div>
    </dialog>
  );
}

function Toggle({ label, description, checked, onChange, note, onLabel, offLabel }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; note?: ReactNode; onLabel: string; offLabel: string }) {
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
      <span className="switch-state" aria-hidden="true">{checked ? onLabel : offLabel}</span>
    </div>
  );
}

import { useEffect, useId, useState } from 'react';
import { LOCALES, LOCALE_NAMES, isLocale, setLocale, translate, useT } from '../i18n';
import { Icon } from './Icon';

/**
 * Native <select> so it works with keyboards, screen readers and mobile pickers.
 * Each option is written in its own language and tagged with `lang` (and `dir`), so
 * national scripts render and are announced correctly whatever the page language is.
 */
export default function LanguageSwitcher({ announce }: { announce: (message: string) => void }) {
  const { t, locale } = useT();
  const id = useId();
  const [busy, setBusy] = useState(false);
  // A pack that failed to load (offline) is also shown on screen for a few seconds, not only announced.
  const [failed, setFailed] = useState('');
  useEffect(() => {
    if (!failed) return;
    const timer = window.setTimeout(() => setFailed(''), 6000);
    return () => window.clearTimeout(timer);
  }, [failed]);
  return (
    <div className="lang-switch" aria-busy={busy || undefined}>
      <label htmlFor={id}>
        <Icon name="globe" size={17} />
        <span className="sr-only">{t('shell.language')}</span>
      </label>
      <select
        id={id}
        value={locale}
        disabled={busy}
        title={t('shell.language')}
        onChange={async event => {
          const next = event.target.value;
          if (!isLocale(next)) return;
          setBusy(true);
          setFailed('');
          try {
            await setLocale(next);
            announce(translate(next, 'shell.languageChanged', { name: LOCALE_NAMES[next].native }));
          } catch {
            const message = translate(locale, 'shell.languageFailed', { name: LOCALE_NAMES[next].native });
            announce(message);
            setFailed(message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {LOCALES.map(code => (
          <option key={code} value={code} lang={code} dir={code === 'ar' ? 'rtl' : 'ltr'}>
            {LOCALE_NAMES[code].native}
          </option>
        ))}
      </select>
      {/* Already announced through the shell's live region, so hidden from screen readers here. */}
      {failed && <p className="lang-error" aria-hidden="true">{failed}</p>}
    </div>
  );
}

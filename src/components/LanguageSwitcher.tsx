import { useId } from 'react';
import { LOCALES, LOCALE_NAMES, isLocale, setLocale, translate, useT } from '../i18n';
import { Icon } from './Icon';

/** Native <select> so it works with keyboards, screen readers and mobile pickers. */
export default function LanguageSwitcher({ announce }: { announce: (message: string) => void }) {
  const { t, locale } = useT();
  const id = useId();
  return (
    <div className="lang-switch">
      <label htmlFor={id}>
        <Icon name="globe" size={17} />
        <span className="sr-only">{t('shell.language')}</span>
      </label>
      <select
        id={id}
        value={locale}
        onChange={event => {
          const next = event.target.value;
          if (!isLocale(next)) return;
          setLocale(next);
          announce(translate(next, 'shell.languageChanged', { name: LOCALE_NAMES[next].native }));
        }}
      >
        {LOCALES.map(code => (
          <option key={code} value={code} lang={code}>
            {LOCALE_NAMES[code].native}
          </option>
        ))}
      </select>
    </div>
  );
}

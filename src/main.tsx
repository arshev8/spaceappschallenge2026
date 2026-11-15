import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/atkinson-hyperlegible/latin-400';
import '@fontsource/atkinson-hyperlegible/latin-700';
import '@fontsource-variable/big-shoulders-display';
// Russian: the fonts above have no Cyrillic, so <html lang="ru"> switches to these (loaded on demand via unicode-range).
import '@fontsource/fira-sans-extra-condensed/cyrillic-700';
import '@fontsource/fira-sans-extra-condensed/cyrillic-800';
import '@fontsource/fira-sans-extra-condensed/latin-700';
import '@fontsource/fira-sans-extra-condensed/latin-800';
import '@fontsource/fira-sans-extra-condensed/cyrillic-ext-700.css';
import '@fontsource/fira-sans-extra-condensed/cyrillic-ext-800.css';
import '@fontsource/fira-sans-extra-condensed/latin-ext-700.css';
import '@fontsource/fira-sans-extra-condensed/latin-ext-800.css';
import '@fontsource-variable/onest';
// Turkish, German, French, Spanish and Portuguese letters outside basic Latin (ğ ş ı İ ß œ ã õ …).
import '@fontsource/atkinson-hyperlegible/latin-ext-400.css';
import '@fontsource/atkinson-hyperlegible/latin-ext-700.css';
// Arabic and Hindi (Devanagari) fonts are imported by their language packs (src/i18n/packs/ar|hi.ts),
// so their @font-face rules stay out of the main CSS.
import { applyLocale, detectLocale, DEFAULT_LOCALE, ensureLocale } from './i18n/locale';
import './i18n/packs';
import App from './App';
import './styles/global.css';
import './styles/a11y.css';

async function start() {
  let locale = detectLocale();
  try {
    await ensureLocale(locale);
  } catch {
    locale = DEFAULT_LOCALE; // language pack failed to load (offline?): fall back to English
  }
  applyLocale(locale);
  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
}
void start();

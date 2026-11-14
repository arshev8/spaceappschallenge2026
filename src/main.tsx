import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyPreferences, readPreferences } from './app/preferences';
import { applyLocale, detectLocale } from './i18n/locale';
import './styles/global.css';
import './styles/experience.css';
import './styles/accessibility.css';

// Apply saved display preferences before the first paint to avoid a flash of the wrong theme or size.
applyPreferences(readPreferences());
applyLocale(detectLocale());

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

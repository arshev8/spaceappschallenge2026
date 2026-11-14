import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyPreferences, readPreferences } from './app/preferences';
import './styles/global.css';
import './styles/experience.css';
import './styles/accessibility.css';

// Apply saved display preferences before the first paint to avoid a flash of the wrong theme or size.
applyPreferences(readPreferences());

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

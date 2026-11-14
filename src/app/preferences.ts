import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Accessibility preferences. Stored locally, applied globally as data attributes
 * on <html> so every page (including lazy-loaded chapters) can respond in CSS.
 */
export const PREFERENCES_KEY = 'echoes.preferences.v1';

export type TextSize = 'normal' | 'large' | 'xlarge';
export type Preferences = {
  version: 1;
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  simplified: boolean;
  readingFont: boolean;
};

export const TEXT_SIZES: { value: TextSize; label: string; description: string }[] = [
  { value: 'normal', label: 'Normal', description: 'Standard text size' },
  { value: 'large', label: 'Large', description: 'About 20% bigger' },
  { value: 'xlarge', label: 'Extra large', description: 'About 40% bigger' },
];

export const defaultPreferences = (): Preferences => ({
  version: 1,
  textSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  simplified: false,
  readingFont: false,
});

const isTextSize = (v: unknown): v is TextSize => v === 'normal' || v === 'large' || v === 'xlarge';

export function parsePreferences(raw: string | null): Preferences {
  const fallback = defaultPreferences();
  if (!raw) return fallback;
  try {
    const p: unknown = JSON.parse(raw);
    if (!p || typeof p !== 'object' || !('version' in p) || p.version !== 1) return fallback;
    const r = p as Record<string, unknown>;
    return {
      version: 1,
      textSize: isTextSize(r.textSize) ? r.textSize : fallback.textSize,
      highContrast: r.highContrast === true,
      reduceMotion: r.reduceMotion === true,
      simplified: r.simplified === true,
      readingFont: r.readingFont === true,
    };
  } catch {
    return fallback;
  }
}

export function readPreferences(): Preferences {
  try {
    return parsePreferences(window.localStorage.getItem(PREFERENCES_KEY));
  } catch {
    return defaultPreferences();
  }
}

/** Writes the preferences onto <html> as data attributes (no-op outside the browser). */
export function applyPreferences(prefs: Preferences, root: HTMLElement | null = typeof document === 'undefined' ? null : document.documentElement) {
  if (!root) return;
  root.dataset.textSize = prefs.textSize;
  const flag = (name: string, on: boolean) => {
    if (on) root.setAttribute(name, 'true');
    else root.removeAttribute(name);
  };
  flag('data-high-contrast', prefs.highContrast);
  flag('data-reduce-motion', prefs.reduceMotion);
  flag('data-simplified', prefs.simplified);
  flag('data-reading-font', prefs.readingFont);
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(readPreferences);
  const [saved, setSaved] = useState(true);

  useEffect(() => { applyPreferences(prefs); }, [prefs]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === PREFERENCES_KEY || event.key === null) setPrefs(readPreferences());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next: Preferences) => {
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
      setSaved(true);
    } catch {
      setSaved(false);
    }
    setPrefs(next);
  }, []);

  const update = useCallback(<K extends keyof Omit<Preferences, 'version'>>(key: K, value: Preferences[K]) => {
    setPrefs(current => {
      const next = { ...current, [key]: value };
      try {
        window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
        setSaved(true);
      } catch {
        setSaved(false);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => persist(defaultPreferences()), [persist]);

  return { prefs, saved, update, reset };
}

function subscribeMotion(callback: () => void) {
  const mq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  mq?.addEventListener?.('change', callback);
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduce-motion'] });
  return () => {
    mq?.removeEventListener?.('change', callback);
    observer.disconnect();
  };
}

/** True when the OS asks for reduced motion OR the ECHOES setting is on. */
export function motionReduced(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.hasAttribute('data-reduce-motion')) return true;
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function systemPrefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, motionReduced, () => false);
}

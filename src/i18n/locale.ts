import { useSyncExternalStore } from 'react';

/**
 * The active language lives on <html lang>. Both the shell and lazily loaded
 * chapters subscribe to it, so switching language re-renders everything at once
 * without any shared React context.
 */
export const LOCALES = ['en', 'ru', 'kk', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_KEY = 'echoes.locale.v1';

export const LOCALE_NAMES: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  ru: { native: 'Русский', english: 'Russian' },
  kk: { native: 'Қазақша', english: 'Kazakh' },
  es: { native: 'Español', english: 'Spanish' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Stored choice first, then the browser's preferred languages, then English. */
export function detectLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (isLocale(stored)) return stored;
  } catch { /* storage blocked */ }
  const preferred = typeof navigator !== 'undefined' ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : [];
  for (const tag of preferred) {
    const base = String(tag || '').toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function applyLocale(locale: Locale) {
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
}

export function currentLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const lang = document.documentElement.lang.toLowerCase().split('-')[0];
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/** Saves and applies a language. Returns false if it could not be saved. */
export function setLocale(locale: Locale): boolean {
  applyLocale(locale);
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_KEY && isLocale(event.newValue)) applyLocale(event.newValue);
  };
  window.addEventListener('storage', onStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStorage);
  };
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, currentLocale, () => DEFAULT_LOCALE);
}

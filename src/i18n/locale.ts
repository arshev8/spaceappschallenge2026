import { useSyncExternalStore } from 'react';

/**
 * The active language lives on <html lang> (and <html dir>). Both the shell and lazily
 * loaded chapters subscribe to it, so switching language re-renders everything at once
 * without any shared React context.
 *
 * Order here is the order shown in the language selector.
 */
export const LOCALES = ['kk', 'ru', 'en', 'es', 'ar', 'fr', 'de', 'hi', 'pt', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_KEY = 'echoes.locale.v1';

export const LOCALE_NAMES: Record<Locale, { native: string; english: string }> = {
  kk: { native: 'Қазақша', english: 'Kazakh' },
  ru: { native: 'Русский', english: 'Russian' },
  en: { native: 'English', english: 'English' },
  es: { native: 'Español', english: 'Spanish' },
  ar: { native: 'العربية', english: 'Arabic' },
  fr: { native: 'Français', english: 'French' },
  de: { native: 'Deutsch', english: 'German' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  pt: { native: 'Português', english: 'Portuguese' },
  tr: { native: 'Türkçe', english: 'Turkish' },
};

const RTL: ReadonlySet<Locale> = new Set<Locale>(['ar']);

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

function localeDir(locale: Locale): 'rtl' | 'ltr' {
  return RTL.has(locale) ? 'rtl' : 'ltr';
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
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dir = localeDir(locale);
  root.lang = locale;
}

export function currentLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const lang = document.documentElement.lang.toLowerCase().split('-')[0];
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/**
 * Language packs for everything except English and Russian are loaded on demand, so
 * visitors only download the language they use. A pack must be loaded before its
 * locale is applied; `loader` is registered by ./packs.ts.
 */
type Loader = (locale: Locale) => Promise<void>;
let loader: Loader = async () => {};
export function registerPackLoader(load: Loader) { loader = load; }
export function ensureLocale(locale: Locale): Promise<void> { return loader(locale); }

/** Loads, saves and applies a language. Resolves to false if the choice could not be saved. */
export async function setLocale(locale: Locale): Promise<boolean> {
  await ensureLocale(locale);
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
    // Another tab switched language: follow it once its pack is loaded.
    if (event.key === LOCALE_KEY && isLocale(event.newValue)) {
      const next = event.newValue;
      void ensureLocale(next).then(() => applyLocale(next));
    }
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

import { useCallback } from 'react';
import { en, type MessageKey } from './messages/en';
import { ru } from './messages/ru';
import { kk } from './messages/kk';
import { es } from './messages/es';
import { useLocale, type Locale } from './locale';

export type { MessageKey } from './messages/en';
export * from './locale';

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = { en, ru, kk, es };

export type Vars = Record<string, string | number>;

/** Replaces {name} placeholders. Unknown placeholders are left visible so they are easy to spot. */
export function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function translate(locale: Locale, key: MessageKey, vars?: Vars): string {
  return interpolate(MESSAGES[locale][key] ?? en[key], vars);
}

export type T = (key: MessageKey, vars?: Vars) => string;

export function useT(): { t: T; locale: Locale } {
  const locale = useLocale();
  const t = useCallback<T>((key, vars) => translate(locale, key, vars), [locale]);
  return { t, locale };
}

const supported = new Map<Locale, boolean>();
/**
 * True when the runtime really has data for this locale. Some browsers report a
 * locale as "supported" but silently format it like English, so we also probe.
 */
function hasIntl(locale: Locale): boolean {
  if (!supported.has(locale)) {
    let ok = false;
    try {
      ok = Intl.NumberFormat.supportedLocalesOf([locale]).length > 0;
      if (ok && locale !== 'en') ok = new Intl.NumberFormat(locale).format(1234.5) !== new Intl.NumberFormat('en').format(1234.5);
    } catch { ok = false; }
    supported.set(locale, ok);
  }
  return supported.get(locale)!;
}

/** Fallback when data is missing: Kazakh uses the same separators as Russian (CLDR: 1 234,5). */
function numberLocale(locale: Locale): string {
  if (hasIntl(locale)) return locale;
  return locale === 'kk' ? 'ru' : 'en';
}

export function formatNumber(value: number, locale: Locale, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits, minimumFractionDigits: maximumFractionDigits }).format(value);
}

const KK_MONTHS = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];

/** Formats an ISO date (YYYY-MM-DD) as a long, locale-appropriate date. */
export function formatIsoDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const formatted = hasIntl(locale)
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date)
    : '';
  // Fall back when the runtime lacks month names (e.g. "2026 M11 14").
  if (locale === 'kk' && (!formatted || !/[а-яәғқңөұүһі]{3,}/i.test(formatted))) return `${y} жылғы ${d} ${KK_MONTHS[m - 1]}`;
  return formatted || new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}

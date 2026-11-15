import { useCallback } from 'react';
import { en, type MessageKey } from './messages/en';
import { ru } from './messages/ru';
import { useLocale, type Locale } from './locale';

export type { MessageKey } from './messages/en';
export * from './locale';

export type Messages = Record<MessageKey, string>;
/**
 * UI dictionaries. English and Russian are bundled; the other languages are added by
 * ./packs.ts when their pack is loaded (always before that language is applied).
 */
export const MESSAGES: Partial<Record<Locale, Messages>> & Record<'en' | 'ru', Messages> = { en, ru };

export type Vars = Record<string, string | number>;

/** Replaces {name} placeholders. Unknown placeholders are left visible so they are easy to spot. */
export function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function translate(locale: Locale, key: MessageKey, vars?: Vars): string {
  return interpolate(MESSAGES[locale]?.[key] ?? en[key], vars);
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
      // Month names differ from English in every supported language, unlike digits (hi groups like en).
      const month = (tag: string) => new Intl.DateTimeFormat(tag, { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2020, 0, 15)));
      if (ok && locale !== 'en') ok = month(locale) !== month('en');
    } catch { ok = false; }
    supported.set(locale, ok);
  }
  return supported.get(locale)!;
}

/** Arabic text in ECHOES keeps Western digits (as NASA figures are written), so numbers match the copy around them. */
const NUMBER_TAG: Partial<Record<Locale, string>> = { ar: 'ar-u-nu-latn' };
function numberLocale(locale: Locale): string {
  return hasIntl(locale) ? NUMBER_TAG[locale] ?? locale : 'en';
}

export function formatNumber(value: number, locale: Locale, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits, minimumFractionDigits: maximumFractionDigits }).format(value);
}

/** Formats an ISO date (YYYY-MM-DD) as a long, locale-appropriate date. */
export function formatIsoDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const formatted = hasIntl(locale)
    ? new Intl.DateTimeFormat(numberLocale(locale), { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date)
    : '';
  return formatted || new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}

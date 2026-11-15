/**
 * On-demand language packs. English and Russian ship in the main bundle; each other
 * language is one lazily loaded chunk holding its UI messages, story content and shell
 * data. Importing this module registers the loader used by setLocale()/ensureLocale().
 */
import { MESSAGES, type Messages } from '.';
import { registerPackLoader, type Locale } from './locale';
import { TRANSLATIONS, type ContentTranslation } from '../content/localize';
import { SHELL_TRANSLATIONS, type ShellTranslation } from '../app/l10n';

export type LanguagePack = { messages: Messages; content: ContentTranslation; shell: ShellTranslation };
type PackLocale = Exclude<Locale, 'en' | 'ru'>;

export const PACKS: Record<PackLocale, () => Promise<LanguagePack>> = {
  kk: () => import('./packs/kk'),
  es: () => import('./packs/es'),
  ar: () => import('./packs/ar'),
  fr: () => import('./packs/fr'),
  de: () => import('./packs/de'),
  hi: () => import('./packs/hi'),
  pt: () => import('./packs/pt'),
  tr: () => import('./packs/tr'),
};

export function registerPack(locale: PackLocale, pack: LanguagePack) {
  MESSAGES[locale] = pack.messages;
  TRANSLATIONS[locale] = pack.content;
  SHELL_TRANSLATIONS[locale] = pack.shell;
}

const pending = new Map<PackLocale, Promise<void>>();
function loadPack(locale: Locale): Promise<void> {
  if (locale === 'en' || locale === 'ru' || MESSAGES[locale]) return Promise.resolve();
  let job = pending.get(locale);
  if (!job) {
    job = PACKS[locale]().then(pack => registerPack(locale, pack)).catch(error => { pending.delete(locale); throw error; });
    pending.set(locale, job);
  }
  return job;
}

/** Loads every pack (tests and integrity checks). */
export function loadAllPacks(): Promise<void[]> {
  return Promise.all((Object.keys(PACKS) as PackLocale[]).map(loadPack));
}

registerPackLoader(loadPack);

import { useMemo } from 'react';
import { useLocale } from '../i18n/locale';
import { localizeContent, type LocalizedContent } from './localize.ts';

/** Localized mission/story/game content for the active language. */
export function useContent(): LocalizedContent {
  const locale = useLocale();
  return useMemo(() => localizeContent(locale), [locale]);
}

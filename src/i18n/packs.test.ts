/**
 * Completeness checks for the lazily loaded language packs (everything except en/ru).
 * Run one language with:  npx vitest run src/i18n/packs.test.ts -t "pack: kk"
 */
import { describe, expect, it } from 'vitest';
import { MESSAGES, translate } from '.';
import { PACKS, registerPack } from './packs';
import type { Locale } from './locale';
import { checkTranslations } from '../content/integrity';
import { localizeContent } from '../content/localize';
import { shellData } from '../app/l10n';
import { EXHIBITS } from '../app/exhibits';
import { PATCHES } from '../app/explorer';
import { MEDIA } from '../app/media';
import { MOMENTS } from '../app/timeline';
import { pick, solarTexts, PLANETS } from '../app/solar';
import { DESTINATIONS, PARTS, SLOTS } from '../games/probeData';
import { QUESTIONS } from '../games/quizData';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
const filled = (s: unknown) => typeof s === 'string' && s.trim().length > 0;
const latin = /^[\x20-\x7e’‘“”–—…·×÷°±≈→←↔%€$£]*$/;

describe.each(Object.keys(PACKS) as Exclude<Locale, 'en' | 'ru'>[])('pack: %s', locale => {
  it('loads and registers', async () => {
    registerPack(locale, await PACKS[locale]());
    expect(MESSAGES[locale]).toBeTruthy();
  });

  it('UI messages: every key, no empty values, same {placeholders} as English', () => {
    const en = MESSAGES.en, dict = MESSAGES[locale]!;
    expect(Object.keys(dict).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(filled(dict[key]), key).toBe(true);
      expect(placeholders(dict[key]), key).toBe(placeholders(en[key]));
    }
    expect(translate(locale, 'ui.nav.explore')).not.toBe(en['ui.nav.explore']);
  });

  it('UI messages: translated, not left in English', () => {
    if (['es', 'fr', 'de', 'pt', 'tr'].includes(locale)) return; // Latin-script languages: checked by review
    const en = MESSAGES.en, dict = MESSAGES[locale]!;
    // Non-Latin languages: a value made only of Latin characters is almost certainly untranslated
    // (allowed: values identical to English such as names, units, symbols and short codes).
    const suspicious = (Object.keys(en) as (keyof typeof en)[]).filter(k => latin.test(dict[k]) && /[a-z]{4,}/i.test(dict[k]) && dict[k].split(/\s+/).length > 2);
    expect(suspicious).toEqual([]);
  });

  it('story content passes every integrity check (keys, list lengths, numbers, ≤110 words per scene)', () => {
    const failed = checkTranslations().filter(r => r.name.startsWith(`${locale}`) && !r.ok);
    expect(failed).toEqual([]);
    const local = localizeContent(locale), en = localizeContent('en');
    expect(local.samples.map(s => [s.id, s.verdict])).toEqual(en.samples.map(s => [s.id, s.verdict]));
    expect(local.missions.opportunity.chapterTitle).not.toBe(en.missions.opportunity.chapterTitle);
  });

  it('shell data covers every image, exhibit, moment, patch, game item and 3D text', () => {
    const pack = shellData(locale);
    for (const m of Object.values(MEDIA)) { const l = pack.media(m); expect(filled(l.alt) && l.alt !== m.alt && filled(l.caption), m.file).toBe(true); }
    for (const e of Object.values(EXHIBITS)) {
      const l = pack.exhibit(e.id);
      expect(l.facts).toHaveLength(e.facts.length);
      expect(l.journey).toHaveLength(e.journey.length);
      expect(l.discovery).not.toBe(e.discovery);
      l.inspect.hotspots.forEach((h, i) => expect(h.detail !== e.inspect.hotspots[i].detail && filled(h.name), h.id).toBe(true));
    }
    pack.moments.forEach((m, i) => expect(m.title !== MOMENTS[i].title && filled(m.date) && filled(m.detail), m.id).toBe(true));
    for (const p of PATCHES) expect(pack.patch(p).how, p.id).not.toBe(p.how);
    expect(pack.destinations.map(d => d.id)).toEqual(DESTINATIONS.map(d => d.id));
    pack.slots.forEach((s, i) => expect(filled(s.name) && s.hint !== SLOTS[i].hint, s.id).toBe(true));
    pack.parts.forEach((p, i) => {
      expect(p.what, p.id).not.toBe(PARTS[i].what);
      for (const d of DESTINATIONS) {
        expect(p.fit[d.id][0], `${p.id}/${d.id} rating`).toBe(PARTS[i].fit[d.id][0]);
        expect(filled(p.fit[d.id][1]) && p.fit[d.id][1] !== PARTS[i].fit[d.id][1], `${p.id}/${d.id}`).toBe(true);
      }
    });
    pack.questions.forEach((q, i) => {
      expect(q.answer).toBe(QUESTIONS[i].answer);
      expect(q.options, q.id).toHaveLength(QUESTIONS[i].options.length);
      expect(q.prompt, q.id).not.toBe(QUESTIONS[i].prompt);
    });
    const missing = solarTexts().filter(en => {
      const local = pick({ en, ru: en }, locale);
      return !filled(local);
    });
    expect(missing).toEqual([]);
    const untranslated = solarTexts().filter(en => pick({ en, ru: en }, locale) === en && en.split(/\s+/).length > 3);
    expect(untranslated).toEqual([]);
    expect(pick(PLANETS[1].name, locale)).toBeTruthy();
  });
});

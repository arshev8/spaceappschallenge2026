import { describe, expect, it } from 'vitest';
import { EXHIBITS } from './exhibits';
import { PATCHES } from './explorer';
import { MEDIA } from './media';
import { MOMENTS } from './timeline';
import { SHELL_TRANSLATIONS, shellData } from './l10n';
import { DESTINATIONS, PARTS, SLOTS } from '../games/probeData';
import { QUESTIONS } from '../games/quizData';
import { PACKS, registerPack } from '../i18n/packs';

// Register every lazily loaded language pack before the table below is built.
for (const [locale, load] of Object.entries(PACKS)) registerPack(locale as keyof typeof PACKS, await load());

describe.each(Object.entries(SHELL_TRANSLATIONS))('shell translation: %s', (locale, tr) => {
  const filled = (s: string | undefined) => typeof s === 'string' && s.trim().length > 0;
  it('covers every image, exhibit, body, moment, patch and game item', () => {
    for (const m of Object.values(MEDIA)) expect(tr!.media[m.file]?.every(filled), m.file).toBe(true);
    for (const e of Object.values(EXHIBITS)) {
      const t = tr!.exhibits[e.id];
      expect(t.facts).toHaveLength(e.facts.length);
      expect(t.journey).toHaveLength(e.journey.length);
      for (const h of e.inspect.hotspots) expect(t.hotspots[h.id]?.every(filled), h.id).toBe(true);
    }
    for (const m of MOMENTS) expect(tr!.moments[m.id]?.every(filled), m.id).toBe(true);
    for (const p of PATCHES) expect(tr!.patches[p.id]?.every(filled), p.id).toBe(true);
    for (const d of DESTINATIONS) expect(tr!.destinations[d.id].every(filled)).toBe(true);
    for (const s of SLOTS) expect(tr!.slots[s.id].every(filled)).toBe(true);
    for (const p of PARTS) for (const d of DESTINATIONS) expect(filled(tr!.parts[p.id]?.fit[d.id]), `${p.id}/${d.id}`).toBe(true);
    for (const q of QUESTIONS) expect(tr!.quiz[q.id]?.options).toHaveLength(q.options.length);
  });
  it('keeps answers, ratings and structure identical to English', () => {
    const local = shellData(locale as keyof typeof SHELL_TRANSLATIONS), en = shellData('en');
    expect(local.questions.map(q => [q.id, q.answer])).toEqual(en.questions.map(q => [q.id, q.answer]));
    expect(local.parts.map(p => Object.values(p.fit).map(f => f[0]))).toEqual(en.parts.map(p => Object.values(p.fit).map(f => f[0])));
    expect(local.questions[0].prompt).not.toBe(en.questions[0].prompt);
  });
});

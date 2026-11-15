/**
 * Content localization. English data in missions.ts / scripts.ts / experiments.ts
 * is the source of truth for structure, IDs, answers and sources. Each other
 * language supplies a ContentTranslation with the same keys; localizeContent()
 * lays it over the English data. integrity.ts checks every translation is complete.
 */
import type { Locale } from '../i18n/locale.ts';
import { MISSIONS, STATUS_LABELS, type ChapterId, type MissionRecord, type MissionStatus } from './missions.ts';
import { FUTURE_QUESTION, IMAGINED_NARRATION_LABEL, SCRIPTS, STAGE_LABELS, type Scene, type SceneKind } from './scripts.ts';
import {
  APOLLO_TARGETS,
  FORMULA_CHOICES,
  GAP_CHOICES,
  GOLDEN_RECORD_ITEMS,
  LAYER_CHOICES,
  MATCH_ITEMS,
  SAMPLES,
  VERDICT_LABELS,
  WAVE_CASES,
  type Choice,
  type MatchItem,
  type RecordItem,
  type Sample,
  type Verdict,
  type WaveCase,
  type WaveCaseId,
} from './experiments.ts';
import { ru } from './locales/ru.ts';

export type MissionTr = {
  title: string;
  chapterTitle: string;
  target: string;
  hardwareType: string;
  chronology: { date: string; event: string }[];
  statusDetail: string;
  scienceQuestion: string;
  method: string;
  result: string;
  takeaway: string;
  claims: Record<string, string>;
  credits: string[];
};
export type SceneTr = { title: string; body: string[]; narration?: string };
export type ChoiceTr = { label: string; feedback: string };
export type SampleTr = { name: string; location: string; observation: string; properties: string[]; explanation: string; hint: string };
export type WaveTr = { label: string; description: string; shape: string; feedback: string };
export type MatchTr = { label: string; explanation: string; hint: string };
export type RecordTr = { title: string; fact: string };

export type ContentTranslation = {
  missions: Record<ChapterId, MissionTr>;
  scenes: Record<ChapterId, Record<string, SceneTr>>;
  statusLabels: Record<MissionStatus, string>;
  stageLabels: Record<SceneKind, string>;
  narrationLabel: string;
  futureQuestion: string;
  targets: Record<string, ChoiceTr>;
  formulas: Record<string, ChoiceTr>;
  gap: Record<string, ChoiceTr>;
  layers: Record<string, ChoiceTr>;
  verdicts: Record<Verdict, string>;
  samples: Record<string, SampleTr>;
  waves: Record<WaveCaseId, WaveTr>;
  matches: Record<string, MatchTr>;
  goldenRecord: Record<string, RecordTr>;
};

export type LocalizedContent = {
  locale: Locale;
  missions: Record<ChapterId, MissionRecord>;
  scripts: Record<ChapterId, Scene[]>;
  statusLabels: Record<MissionStatus, string>;
  stageLabels: Record<SceneKind, string>;
  narrationLabel: string;
  futureQuestion: string;
  targets: Choice[];
  formulas: Choice[];
  gap: Choice[];
  layers: Choice[];
  verdicts: Record<Verdict, string>;
  samples: Sample[];
  waves: WaveCase[];
  matches: MatchItem[];
  goldenRecord: RecordItem[];
};

/** Russian is bundled; other languages are registered by src/i18n/packs.ts when loaded. */
export const TRANSLATIONS: Partial<Record<Exclude<Locale, 'en'>, ContentTranslation>> = { ru };

const ENGLISH: LocalizedContent = {
  locale: 'en',
  missions: MISSIONS,
  scripts: SCRIPTS,
  statusLabels: STATUS_LABELS,
  stageLabels: STAGE_LABELS,
  narrationLabel: IMAGINED_NARRATION_LABEL,
  futureQuestion: FUTURE_QUESTION,
  targets: APOLLO_TARGETS,
  formulas: FORMULA_CHOICES,
  gap: GAP_CHOICES,
  layers: LAYER_CHOICES,
  verdicts: VERDICT_LABELS,
  samples: SAMPLES,
  waves: WAVE_CASES,
  matches: MATCH_ITEMS,
  goldenRecord: GOLDEN_RECORD_ITEMS,
};

const mapChoices = (list: Choice[], tr: Record<string, ChoiceTr>): Choice[] =>
  list.map(c => ({ ...c, label: tr[c.id]?.label ?? c.label, feedback: tr[c.id]?.feedback ?? c.feedback }));

function build(locale: Exclude<Locale, 'en'>): LocalizedContent {
  const tr = TRANSLATIONS[locale]!;
  const missions = Object.fromEntries(
    (Object.keys(MISSIONS) as ChapterId[]).map(id => {
      const base = MISSIONS[id];
      const m = tr.missions[id];
      const record: MissionRecord = {
        ...base,
        title: m.title,
        chapterTitle: m.chapterTitle,
        target: m.target,
        hardwareType: m.hardwareType,
        chronology: base.chronology.map((entry, i) => ({ ...entry, date: m.chronology[i]?.date ?? entry.date, event: m.chronology[i]?.event ?? entry.event })),
        statusDetail: m.statusDetail,
        scienceQuestion: m.scienceQuestion,
        method: m.method,
        result: m.result,
        takeaway: m.takeaway,
        claims: base.claims.map(c => ({ ...c, text: m.claims[c.id] ?? c.text })),
        credits: m.credits,
      };
      return [id, record];
    }),
  ) as Record<ChapterId, MissionRecord>;

  const scripts = Object.fromEntries(
    (Object.keys(SCRIPTS) as ChapterId[]).map(id => [
      id,
      SCRIPTS[id].map(scene => {
        const s = tr.scenes[id]?.[scene.id];
        return s ? { ...scene, title: s.title, body: s.body, narration: scene.narration ? s.narration ?? scene.narration : undefined } : scene;
      }),
    ]),
  ) as Record<ChapterId, Scene[]>;

  return {
    locale,
    missions,
    scripts,
    statusLabels: tr.statusLabels,
    stageLabels: tr.stageLabels,
    narrationLabel: tr.narrationLabel,
    futureQuestion: tr.futureQuestion,
    targets: mapChoices(APOLLO_TARGETS, tr.targets),
    formulas: mapChoices(FORMULA_CHOICES, tr.formulas),
    gap: mapChoices(GAP_CHOICES, tr.gap),
    layers: mapChoices(LAYER_CHOICES, tr.layers),
    verdicts: tr.verdicts,
    samples: SAMPLES.map(s => ({ ...s, ...tr.samples[s.id] })),
    waves: WAVE_CASES.map(w => ({ ...w, ...tr.waves[w.id] })),
    matches: MATCH_ITEMS.map(m => ({ ...m, ...tr.matches[m.id] })),
    goldenRecord: GOLDEN_RECORD_ITEMS.map(r => ({ ...r, ...tr.goldenRecord[r.id] })),
  };
}

const cache = new Map<Locale, LocalizedContent>([['en', ENGLISH]]);

export function localizeContent(locale: Locale): LocalizedContent {
  let content = cache.get(locale);
  if (!content) {
    // Pack not loaded yet: show English without caching it, so it is rebuilt once loaded.
    if (!TRANSLATIONS[locale as Exclude<Locale, 'en'>]) return ENGLISH;
    content = build(locale as Exclude<Locale, 'en'>);
    cache.set(locale, content);
  }
  return content;
}

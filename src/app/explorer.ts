import { useSyncExternalStore } from 'react';

/**
 * Exploration log: patches (achievements), visited places and best game scores.
 * Kept separate from the discovery journal (progress.ts) so the original journal
 * contract and its tests stay untouched.
 */
export const EXPLORER_KEY = 'echoes.explorer-log.v1';

export type PatchId =
  | 'first-signal' | 'grand-tour' | 'hardware' | 'time-traveler'
  | 'soft-landing' | 'ace-pilot' | 'probe-engineer' | 'quiz-cadet' | 'quiz-expert';

export type Patch = { id: PatchId; name: string; how: string; points: number; color: string; glyph: 'pulse' | 'orbit' | 'gear' | 'clock' | 'lander' | 'star' | 'probe' | 'book' | 'crown' };

export const PATCHES: Patch[] = [
  { id: 'first-signal', name: 'First echo', how: 'Send a signal from the home page and hear it return.', points: 50, color: '#8ee7dd', glyph: 'pulse' },
  { id: 'grand-tour', name: 'Grand tour', how: 'Visit every destination in the solar system explorer.', points: 150, color: '#e8b04b', glyph: 'orbit' },
  { id: 'hardware', name: 'Hardware inspector', how: 'Inspect five pieces of real mission hardware.', points: 100, color: '#c9c4b8', glyph: 'gear' },
  { id: 'time-traveler', name: 'Time traveler', how: 'Open six moments on the timeline.', points: 100, color: '#b7a6ff', glyph: 'clock' },
  { id: 'soft-landing', name: 'Soft touchdown', how: 'Land safely in the landing challenge.', points: 150, color: '#ef9876', glyph: 'lander' },
  { id: 'ace-pilot', name: 'Ace pilot', how: 'Score 800 or more in the landing challenge.', points: 200, color: '#ffd27a', glyph: 'star' },
  { id: 'probe-engineer', name: 'Probe engineer', how: 'Build a mission-ready probe for three destinations.', points: 200, color: '#8ee7dd', glyph: 'probe' },
  { id: 'quiz-cadet', name: 'Mission cadet', how: 'Finish the discovery quiz.', points: 100, color: '#aab8d4', glyph: 'book' },
  { id: 'quiz-expert', name: 'Mission expert', how: 'Answer at least 8 of 10 quiz questions correctly.', points: 200, color: '#e8b04b', glyph: 'crown' },
];
const patchIds = new Set<string>(PATCHES.map(p => p.id));

export type ExplorerLog = {
  version: 1;
  patches: PatchId[];
  visited: string[];
  inspected: string[];
  moments: string[];
  probes: string[];
  best: { lander: number; quiz: number };
};
export const emptyLog = (): ExplorerLog => ({ version: 1, patches: [], visited: [], inspected: [], moments: [], probes: [], best: { lander: 0, quiz: 0 } });

const strings = (value: unknown, max = 64) =>
  Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === 'string' && v.length <= 64))].slice(0, max) : [];
const score = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(100000, Math.round(value))) : 0);

export function parseLog(raw: string | null): ExplorerLog {
  if (!raw) return emptyLog();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || (parsed as { version?: unknown }).version !== 1) return emptyLog();
    const v = parsed as Record<string, unknown>;
    const best = v.best && typeof v.best === 'object' ? v.best as Record<string, unknown> : {};
    return {
      version: 1,
      patches: strings(v.patches).filter((id): id is PatchId => patchIds.has(id)),
      visited: strings(v.visited), inspected: strings(v.inspected), moments: strings(v.moments), probes: strings(v.probes),
      best: { lander: score(best.lander), quiz: score(best.quiz) },
    };
  } catch { return emptyLog(); }
}

function read(): ExplorerLog {
  try { return parseLog(window.localStorage.getItem(EXPLORER_KEY)); } catch { return emptyLog(); }
}

let log: ExplorerLog = typeof window === 'undefined' ? emptyLog() : read();
const listeners = new Set<() => void>();
const awardListeners = new Set<(patch: Patch) => void>();

function commit(next: ExplorerLog) {
  log = next;
  try { window.localStorage.setItem(EXPLORER_KEY, JSON.stringify(next)); } catch { /* keep in memory */ }
  listeners.forEach(l => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === EXPLORER_KEY || event.key === null) { log = read(); listeners.forEach(l => l()); }
  });
}

export function award(id: PatchId) {
  if (log.patches.includes(id)) return;
  commit({ ...log, patches: [...log.patches, id] });
  const patch = PATCHES.find(p => p.id === id)!;
  awardListeners.forEach(l => l(patch));
}

type ListKey = 'visited' | 'inspected' | 'moments' | 'probes';
const thresholds: Partial<Record<ListKey, [number, PatchId]>> = {
  inspected: [5, 'hardware'], moments: [6, 'time-traveler'], probes: [3, 'probe-engineer'],
};
/** Adds an item to a log list and awards any threshold patch. Returns the new list length. */
export function record(key: ListKey, item: string, total?: number): number {
  const list = log[key];
  if (!list.includes(item)) commit({ ...log, [key]: [...list, item] });
  const length = log[key].length;
  const rule = thresholds[key];
  if (rule && length >= rule[0]) award(rule[1]);
  if (key === 'visited' && total && length >= total) award('grand-tour');
  return length;
}

export function recordBest(game: 'lander' | 'quiz', value: number) {
  if (value > log.best[game]) commit({ ...log, best: { ...log.best, [game]: Math.round(value) } });
}

export function resetLog() { commit(emptyLog()); }

export function points(l: ExplorerLog, discoveries: number): number {
  return l.patches.reduce((sum, id) => sum + (PATCHES.find(p => p.id === id)?.points ?? 0), 0) + discoveries * 250;
}

function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useExplorerLog(): ExplorerLog { return useSyncExternalStore(subscribe, () => log, () => log); }
export function onAward(listener: (patch: Patch) => void) { awardListeners.add(listener); return () => { awardListeners.delete(listener); }; }

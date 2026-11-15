import { useSyncExternalStore } from 'react';

/**
 * High-contrast preference, persisted locally and mirrored onto <html data-contrast>.
 * Every other accessibility setting (theme, text size, motion, …) lives in ./a11y.ts;
 * the motion helpers are re-exported here so existing imports keep working.
 */
export type Preferences = { version: 1; contrast: 'normal' | 'high' };
export const PREFS_KEY = 'echoes.preferences.v1';
const defaults = (): Preferences => ({ version: 1, contrast: 'normal' });

function parsePreferences(raw: string | null): Preferences {
  if (!raw) return defaults();
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return defaults();
    const v = value as Record<string, unknown>;
    // A "motion: reduced" value saved by older versions is deliberately ignored.
    return { version: 1, contrast: v.contrast === 'high' ? 'high' : 'normal' };
  } catch { return defaults(); }
}

let current: Preferences = (() => {
  try { return parsePreferences(typeof window === 'undefined' ? null : window.localStorage.getItem(PREFS_KEY)); }
  catch { return defaults(); }
})();
const listeners = new Set<() => void>();
function emit() { listeners.forEach(listener => listener()); }

function apply(prefs: Preferences) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.contrast = prefs.contrast;
}
apply(current);

export function setPreferences(patch: Partial<Omit<Preferences, 'version'>>) {
  current = { ...current, ...patch };
  try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(current)); } catch { /* storage blocked: keep in memory */ }
  apply(current);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function usePreferences() {
  const prefs = useSyncExternalStore(subscribe, () => current, () => current);
  return { prefs };
}

export { motionReduced, useReducedMotion } from './a11y';

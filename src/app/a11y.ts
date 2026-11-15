import { useSyncExternalStore } from 'react';

/**
 * Accessibility settings: one central store, persisted locally and mirrored onto <html>
 * as data attributes, so every page, chapter module and game reads the same state from CSS.
 *
 * High contrast lives in ./preferences.ts (it predates this panel and keeps its own storage key);
 * the accessibility panel edits both stores.
 *
 * Attributes are only written for non-default values, so a visitor who never opens the panel
 * gets exactly the original site.
 */
export type TextSize = 'normal' | 'large' | 'xlarge';
export type A11ySettings = {
  version: 1;
  textSize: TextSize;
  /** Stop animations and hide decorative layers (starfield, blur), lighter 3D scene. */
  reduceMotion: boolean;
  /** Games start in relaxed mode (slow-motion landing, more forgiving limits). */
  relaxedGames: boolean;
};

export const A11Y_KEY = 'echoes.a11y.v1';
export const TEXT_SIZES: TextSize[] = ['normal', 'large', 'xlarge'];
export const TEXT_SCALE: Record<TextSize, number> = { normal: 100, large: 125, xlarge: 150 };

export const A11Y_DEFAULTS: A11ySettings = { version: 1, textSize: 'normal', reduceMotion: false, relaxedGames: false };

export function parseA11y(raw: string | null): A11ySettings {
  if (!raw) return { ...A11Y_DEFAULTS };
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== 'object') return { ...A11Y_DEFAULTS };
    const o = v as Record<string, unknown>;
    // Earlier builds of the panel had a 112.5% step, a separate "calm view" and a three-way motion choice.
    const textSize = o.textSize === 'medium' ? 'large' : TEXT_SIZES.includes(o.textSize as TextSize) ? (o.textSize as TextSize) : 'normal';
    return {
      version: 1,
      textSize,
      reduceMotion: o.reduceMotion === true || o.motion === 'reduce' || o.calm === true,
      relaxedGames: o.relaxedGames === true,
    };
  } catch { return { ...A11Y_DEFAULTS }; }
}

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const media = (query: string) => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query) : null);

let current: A11ySettings = (() => {
  try { return parseA11y(typeof window === 'undefined' ? null : window.localStorage.getItem(A11Y_KEY)); }
  catch { return { ...A11Y_DEFAULTS }; }
})();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());

function setAttr(name: string, on: boolean, value = '') {
  const root = document.documentElement;
  if (on) root.setAttribute(name, value); else root.removeAttribute(name);
}

function apply(s: A11ySettings) {
  if (typeof document === 'undefined') return;
  // chapters.css reads 'large' and 'xlarge'.
  setAttr('data-text-size', s.textSize !== 'normal', s.textSize);
  document.documentElement.style.fontSize = s.textSize === 'normal' ? '' : `${TEXT_SCALE[s.textSize]}%`;
  // data-reduce-motion is the attribute every motion-aware module checks;
  // data-simplified hides decorative layers (global and chapter styles).
  setAttr('data-reduce-motion', s.reduceMotion);
  setAttr('data-simplified', s.reduceMotion);
}
apply(current);

export function getA11y(): A11ySettings { return current; }

export function setA11y(patch: Partial<Omit<A11ySettings, 'version'>>) {
  current = { ...current, ...patch, version: 1 };
  try { window.localStorage.setItem(A11Y_KEY, JSON.stringify(current)); } catch { /* storage blocked: keep in memory */ }
  apply(current);
  emit();
}

export function resetA11y() {
  current = { ...A11Y_DEFAULTS };
  try { window.localStorage.removeItem(A11Y_KEY); } catch { /* ignore */ }
  apply(current);
  emit();
}

/** Number of settings that differ from the defaults (shown as a badge on the panel button). */
export function changedCount(s: A11ySettings): number {
  return (Object.keys(A11Y_DEFAULTS) as (keyof A11ySettings)[]).filter(k => s[k] !== A11Y_DEFAULTS[k]).length;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function useA11y(): A11ySettings {
  return useSyncExternalStore(subscribe, () => current, () => current);
}

/** Whether the operating system asks for reduced motion. */
function systemReducedMotion(): boolean { return !!media(MOTION_QUERY)?.matches; }

/**
 * One answer to "should motion be calmed?" for the whole app:
 * on when the visitor switched it on in the panel, or when the operating system asks for it.
 */
export function motionReduced(): boolean {
  if (current.reduceMotion) return true;
  if (typeof document !== 'undefined' && document.documentElement.hasAttribute('data-reduce-motion')) return true;
  return systemReducedMotion();
}
function subscribeMotion(listener: () => void) {
  const m = media(MOTION_QUERY);
  m?.addEventListener?.('change', listener);
  listeners.add(listener);
  return () => { m?.removeEventListener?.('change', listener); listeners.delete(listener); };
}
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, motionReduced, () => false);
}
export function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, systemReducedMotion, () => false);
}

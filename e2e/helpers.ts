import { expect, type Page } from '@playwright/test';

/** localStorage keys the app persists. Mirrors src/app/*.ts and src/i18n/locale.ts. */
export const KEYS = {
  progress: 'echoes.discovery-journal.v1',
  prefs: 'echoes.preferences.v1',
  locale: 'echoes.locale.v1',
  explorer: 'echoes.explorer-log.v1',
  a11y: 'echoes.a11y.v1',
} as const;

export type Seed = {
  locale?: 'en' | 'ru';
  completed?: string[];
  /** Raw preferences object, to simulate data saved by older versions. */
  legacyPrefs?: Record<string, unknown>;
  contrast?: 'normal' | 'high';
};

/** Every route the shell can render, with the h1 and document title it must show (English). */
export const ROUTES = [
  { hash: '#/', name: 'home', h1: /Their signals may fade\.\s*Their discoveries never will\./, title: 'The Machines That Changed Our Universe — ECHOES' },
  { hash: '#/atlas', name: 'atlas', h1: /Mission explorer/, title: /— ECHOES$/ },
  { hash: '#/chapter/apollo11', name: 'chapter-apollo11', h1: 'Apollo 11', title: 'Apollo 11 — ECHOES' },
  { hash: '#/chapter/opportunity', name: 'chapter-opportunity', h1: 'Opportunity', title: 'Opportunity — ECHOES' },
  { hash: '#/chapter/insight', name: 'chapter-insight', h1: 'InSight', title: 'InSight — ECHOES' },
  { hash: '#/chapter/voyager', name: 'chapter-voyager', h1: 'Voyager 1', title: 'Voyager 1 — ECHOES' },
  { hash: '#/explore', name: 'explore', h1: /./, title: /— ECHOES$/ },
  { hash: '#/timeline', name: 'timeline', h1: 'Timeline', title: /— ECHOES$/ },
  { hash: '#/games', name: 'games', h1: 'Mission games', title: /— ECHOES$/ },
  { hash: '#/games/lander', name: 'game-lander', h1: /./, title: /— ECHOES$/ },
  { hash: '#/games/probe', name: 'game-probe', h1: /./, title: /— ECHOES$/ },
  { hash: '#/games/quiz', name: 'game-quiz', h1: /./, title: /— ECHOES$/ },
  { hash: '#/journal', name: 'journal', h1: /./, title: /— ECHOES$/ },
  { hash: '#/nowhere', name: 'not-found', h1: 'A little off course.', title: /— ECHOES$/ },
] as const;

/**
 * Seeds localStorage once per test, before any app script runs. The guard keeps
 * reloads honest: after the first load the app's own writes are what persists.
 */
export async function seed(page: Page, data: Seed = {}) {
  await page.addInitScript(({ data, KEYS }) => {
    if (sessionStorage.getItem('__e2e_seeded')) return;
    sessionStorage.setItem('__e2e_seeded', '1');
    localStorage.clear();
    if (data.locale) localStorage.setItem(KEYS.locale, data.locale);
    if (data.completed) localStorage.setItem(KEYS.progress, JSON.stringify({ version: 1, completed: data.completed }));
    if (data.contrast) localStorage.setItem(KEYS.prefs, JSON.stringify({ version: 1, contrast: data.contrast }));
    if (data.legacyPrefs) localStorage.setItem(KEYS.prefs, JSON.stringify(data.legacyPrefs));
  }, { data, KEYS });
}

/** Replaces Math.random with a seeded PRNG so canvases (lander terrain, particles) render identically. */
export async function seedRandom(page: Page) {
  await page.addInitScript(() => {
    let s = 20260;
    Math.random = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  });
}

/** Collects console errors, uncaught exceptions and failed same-origin requests. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', req => { if (isLocal(req.url())) errors.push(`requestfailed: ${req.url()} ${req.failure()?.errorText ?? ''}`); });
  page.on('response', res => { if (isLocal(res.url()) && res.status() >= 400) errors.push(`http ${res.status()}: ${res.url()}`); });
  return {
    errors,
    expectNone: () => expect(errors, errors.join('\n')).toEqual([]),
  };
}
const isLocal = (url: string) => url.startsWith('http://localhost');

/** Navigates to a hash route and waits until the route has rendered its heading and fonts. */
export async function visit(page: Page, hash: string) {
  await page.goto(hash === '#/' ? '/' : `/${hash}`);
  await expect(page.locator('main h1').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

/** Client-side navigation (hashchange), like clicking an in-app link. */
export async function go(page: Page, hash: string) {
  await page.evaluate(h => { window.location.hash = h; }, hash);
}

export async function readStore<T = unknown>(page: Page, key: string): Promise<T | null> {
  const raw = await page.evaluate(k => localStorage.getItem(k), key);
  return raw === null ? null : (JSON.parse(raw) as T);
}

export async function expectNoHorizontalScroll(page: Page) {
  const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(scroll, `page scrolls horizontally (${scroll}px > ${client}px)`).toBeLessThanOrEqual(client);
}

/** Main navigation, located by its accessible name so it survives markup changes. */
export const mainNav = (page: Page) => page.getByRole('navigation', { name: 'Main navigation' });

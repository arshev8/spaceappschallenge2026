import { useMemo, useSyncExternalStore } from 'react';
import { isChapterId, type ChapterId } from './missions';

const gameIds = ['lander', 'probe', 'quiz'] as const;
export type GameId = (typeof gameIds)[number];
const isGameId = (value: unknown): value is GameId => typeof value === 'string' && gameIds.some(id => id === value);

export type SimplePage = 'home' | 'atlas' | 'journal' | 'explore' | 'timeline' | 'games' | 'not-found';
export type Route = { page: SimplePage } | { page: 'chapter'; id: ChapterId } | { page: 'game'; id: GameId };

const simple: Record<string, SimplePage> = {
  '/atlas': 'atlas', '/journal': 'journal', '/explore': 'explore', '/timeline': 'timeline', '/games': 'games',
};

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/$/, '');
  if (path === '' || path === '/') return { page: 'home' };
  if (Object.hasOwn(simple, path)) return { page: simple[path] };
  const chapter = /^\/chapter\/([^/]+)$/.exec(path);
  if (chapter && isChapterId(chapter[1])) return { page: 'chapter', id: chapter[1] };
  const game = /^\/games\/([^/]+)$/.exec(path);
  if (game && isGameId(game[1])) return { page: 'game', id: game[1] };
  return { page: 'not-found' };
}
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  return useMemo(() => parseHash(hash), [hash]);
}
export function navigate(hash: string) { window.location.hash = hash; }

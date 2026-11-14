import { useMemo, useSyncExternalStore } from 'react';
import { isChapterId, type ChapterId } from './missions';

export type Route = { page: 'home' | 'atlas' | 'journal' | 'not-found' } | { page: 'chapter'; id: ChapterId };
export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/$/, '');
  if (path === '' || path === '/') return { page: 'home' };
  if (path === '/atlas') return { page: 'atlas' };
  if (path === '/journal') return { page: 'journal' };
  const chapter = /^\/chapter\/([^/]+)$/.exec(path);
  if (chapter && isChapterId(chapter[1])) return { page: 'chapter', id: chapter[1] };
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

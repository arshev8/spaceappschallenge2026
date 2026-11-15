import { useCallback, useEffect, useRef, useState } from 'react';
import { isChapterId, type ChapterId } from './missions';

export const STORAGE_KEY = 'echoes.discovery-journal.v1';
export type Progress = { version: 1; completed: ChapterId[] };
const emptyProgress = (): Progress => ({ version: 1, completed: [] });
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 ||
      !('completed' in parsed) || !Array.isArray(parsed.completed)) return emptyProgress();
    return { version: 1, completed: [...new Set(parsed.completed.filter(isChapterId))] };
  } catch { return emptyProgress(); }
}
function readProgress() {
  try { return { progress: parseProgress(window.localStorage.getItem(STORAGE_KEY)), saved: true }; }
  catch { return { progress: emptyProgress(), saved: false }; }
}
export function useProgress() {
  const [state, setState] = useState(readProgress);
  const current = useRef(state);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        const next = readProgress();
        current.current = next;
        setState(next);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const update = useCallback((progress: Progress) => {
    let saved = true;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch { saved = false; }
    const next = { progress, saved };
    current.current = next;
    setState(next);
  }, []);
  const complete = useCallback((id: ChapterId) => {
    const progress = current.current.progress;
    if (!progress.completed.includes(id)) update({ version: 1, completed: [...progress.completed, id] });
  }, [update]);
  const reset = useCallback(() => update(emptyProgress()), [update]);
  return { completed: state.progress.completed, saved: state.saved, complete, reset };
}

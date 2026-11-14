import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseProgress, STORAGE_KEY, useProgress } from './progress';

afterEach(cleanup);
beforeEach(() => localStorage.clear());
describe('journal storage validation', () => {
  it.each([null, '', '{bad', 'null', '42', '[]', '{}', '{"version":2,"completed":["apollo11"]}', '{"version":1,"completed":null}'])('recovers from %s', raw => {
    expect(parseProgress(raw)).toEqual({ version: 1, completed: [] });
  });
  it('keeps valid IDs, removes duplicates, and ignores untrusted values', () => {
    expect(parseProgress(JSON.stringify({ version: 1, completed: ['apollo11', 'apollo11', null, {}, 'unknown', 'voyager'] })))
      .toEqual({ version: 1, completed: ['apollo11', 'voyager'] });
  });
  it('persists a completion only once and restores it on the next visit', () => {
    const first = renderHook(() => useProgress());
    act(() => { first.result.current.complete('insight'); first.result.current.complete('insight'); });
    expect(first.result.current.completed).toEqual(['insight']);
    first.unmount();
    const second = renderHook(() => useProgress());
    expect(second.result.current.completed).toEqual(['insight']);
    act(() => second.result.current.reset());
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ version: 1, completed: [] });
  });
  it('retains in-memory progress if storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { result } = renderHook(() => useProgress());
    act(() => result.current.complete('opportunity'));
    expect(result.current.completed).toEqual(['opportunity']);
    expect(result.current.saved).toBe(false);
  });
  it('synchronizes progress and resets from another tab', async () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completed: ['apollo11'] }));
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    });
    await waitFor(() => expect(result.current.completed).toEqual(['apollo11']));
    act(() => { localStorage.clear(); window.dispatchEvent(new StorageEvent('storage', { key: null })); });
    expect(result.current.completed).toEqual([]);
  });
});

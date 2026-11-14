import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PREFERENCES_KEY, applyPreferences, defaultPreferences, motionReduced, parsePreferences, usePreferences } from './preferences';

const root = document.documentElement;
afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
  applyPreferences(defaultPreferences());
});

describe('accessibility preferences', () => {
  it.each([null, '', '{bad', 'null', '[]', '{"version":2,"textSize":"large"}'])('falls back to defaults for %s', raw => {
    expect(parsePreferences(raw)).toEqual(defaultPreferences());
  });

  it('keeps valid values and ignores untrusted ones', () => {
    const parsed = parsePreferences(JSON.stringify({ version: 1, textSize: 'huge', highContrast: 'yes', reduceMotion: true, simplified: true, readingFont: 1 }));
    expect(parsed).toEqual({ ...defaultPreferences(), reduceMotion: true, simplified: true });
  });

  it('applies every preference to <html> as data attributes and removes them again', () => {
    applyPreferences({ version: 1, textSize: 'xlarge', highContrast: true, reduceMotion: true, simplified: true, readingFont: true });
    expect(root.dataset.textSize).toBe('xlarge');
    for (const attr of ['data-high-contrast', 'data-reduce-motion', 'data-simplified', 'data-reading-font']) expect(root.hasAttribute(attr)).toBe(true);
    expect(motionReduced()).toBe(true);
    applyPreferences(defaultPreferences());
    expect(root.dataset.textSize).toBe('normal');
    for (const attr of ['data-high-contrast', 'data-reduce-motion', 'data-simplified', 'data-reading-font']) expect(root.hasAttribute(attr)).toBe(false);
  });

  it('persists changes, restores them on the next visit and resets to default', () => {
    const first = renderHook(() => usePreferences());
    act(() => { first.result.current.update('textSize', 'large'); first.result.current.update('highContrast', true); });
    expect(root.dataset.textSize).toBe('large');
    expect(root.hasAttribute('data-high-contrast')).toBe(true);
    expect(JSON.parse(localStorage.getItem(PREFERENCES_KEY)!)).toMatchObject({ textSize: 'large', highContrast: true });
    first.unmount();
    const second = renderHook(() => usePreferences());
    expect(second.result.current.prefs).toMatchObject({ textSize: 'large', highContrast: true });
    act(() => second.result.current.reset());
    expect(second.result.current.prefs).toEqual(defaultPreferences());
    expect(root.hasAttribute('data-high-contrast')).toBe(false);
  });

  it('keeps working in memory when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.update('simplified', true));
    expect(result.current.prefs.simplified).toBe(true);
    expect(result.current.saved).toBe(false);
    expect(root.hasAttribute('data-simplified')).toBe(true);
  });
});

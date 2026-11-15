import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { A11Y_DEFAULTS, A11Y_KEY, changedCount, getA11y, motionReduced, parseA11y, resetA11y, setA11y } from './a11y';
import { PREFS_KEY, setPreferences } from './preferences';
import AccessibilityPanel from '../components/AccessibilityPanel';

const html = document.documentElement;
beforeEach(() => { localStorage.clear(); act(() => { resetA11y(); setPreferences({ contrast: 'normal' }); }); });
afterEach(cleanup);

describe('accessibility settings store', () => {
  it('parses safely: junk, unknown values and missing fields fall back to defaults', () => {
    expect(parseA11y(null)).toEqual(A11Y_DEFAULTS);
    expect(parseA11y('{broken')).toEqual(A11Y_DEFAULTS);
    expect(parseA11y(JSON.stringify({ textSize: 'huge', reduceMotion: 'yes', relaxedGames: 1 }))).toEqual(A11Y_DEFAULTS);
  });

  it('migrates settings saved by the earlier, longer panel', () => {
    expect(parseA11y(JSON.stringify({ theme: 'dark', textSize: 'medium', filter: 'grayscale', motion: 'reduce' }))).toEqual({ ...A11Y_DEFAULTS, textSize: 'large', reduceMotion: true });
    expect(parseA11y(JSON.stringify({ calm: true, motion: 'full' }))).toEqual({ ...A11Y_DEFAULTS, reduceMotion: true });
  });

  it('writes no attributes by default, so the original site is untouched', () => {
    for (const a of ['data-text-size', 'data-simplified', 'data-reduce-motion']) expect(html.hasAttribute(a), a).toBe(false);
    expect(html.style.fontSize).toBe('');
  });

  it('mirrors every setting onto <html>, persists it and resets cleanly', () => {
    act(() => setA11y({ textSize: 'xlarge', reduceMotion: true, relaxedGames: true }));
    expect(html.dataset.textSize).toBe('xlarge');
    expect(html.style.fontSize).toBe('150%');
    expect(html.hasAttribute('data-reduce-motion') && html.hasAttribute('data-simplified')).toBe(true);
    expect(parseA11y(localStorage.getItem(A11Y_KEY))).toEqual(getA11y());
    expect(changedCount(getA11y())).toBe(3);
    act(() => resetA11y());
    expect(html.hasAttribute('data-text-size') || html.hasAttribute('data-simplified') || html.hasAttribute('data-reduce-motion')).toBe(false);
    expect(html.style.fontSize).toBe('');
    expect(localStorage.getItem(A11Y_KEY)).toBeNull();
  });

  it('reduce motion: the switch turns motion off app-wide', () => {
    expect(motionReduced()).toBe(false);
    act(() => setA11y({ reduceMotion: true }));
    expect(motionReduced()).toBe(true);
    act(() => setA11y({ reduceMotion: false }));
    expect(motionReduced()).toBe(false);
  });
});

describe('accessibility panel', () => {
  it('opens as a labelled dialog, changes settings, announces them and closes with Escape', () => {
    const notices: string[] = [];
    render(<AccessibilityPanel announce={m => notices.push(m)} />);
    const toggle = screen.getByRole('button', { name: 'Accessibility settings' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(toggle);
    const dialog = screen.getByRole('dialog', { name: 'Accessibility' });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    expect(within(dialog).getAllByRole('switch').map(el => (el as HTMLInputElement).labels?.[0]?.textContent))
      .toEqual(['High contrast', 'Reduce motion', 'Relaxed games']);
    fireEvent.click(within(dialog).getByRole('switch', { name: 'Reduce motion' }));
    expect(html.hasAttribute('data-reduce-motion')).toBe(true);
    expect(notices.at(-1)).toBe('Reduce motion: On');

    fireEvent.click(within(dialog).getByRole('switch', { name: 'High contrast' }));
    expect(html.dataset.contrast).toBe('high');
    expect(JSON.parse(localStorage.getItem(PREFS_KEY)!)).toEqual({ version: 1, contrast: 'high' });

    fireEvent.click(within(dialog).getByRole('radio', { name: '125%' }));
    expect(html.dataset.textSize).toBe('large');
    expect(screen.getByRole('button', { name: /Accessibility settings \(3 settings changed\)/ })).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: /Reset all/ }));
    expect(html.hasAttribute('data-reduce-motion') || html.hasAttribute('data-text-size')).toBe(false);
    expect(html.dataset.contrast).toBe('normal');
    expect(notices.at(-1)).toBe('Accessibility settings reset.');

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });
});

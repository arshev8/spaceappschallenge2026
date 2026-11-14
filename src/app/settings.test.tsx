import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { PREFERENCES_KEY, applyPreferences, defaultPreferences } from './preferences';

beforeEach(() => {
  localStorage.clear();
  applyPreferences(defaultPreferences());
  window.location.hash = '#/';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
afterEach(cleanup);

describe('display & accessibility settings', () => {
  it('opens from the header, applies each setting globally and saves it', async () => {
    render(<App />);
    const trigger = screen.getByRole('button', { name: 'Display & accessibility' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Display & accessibility' });

    fireEvent.click(within(dialog).getByLabelText(/Large/, { selector: 'input[value="large"]' }));
    expect(document.documentElement.dataset.textSize).toBe('large');

    for (const [name, attr] of [['High contrast', 'data-high-contrast'], ['Reduce motion', 'data-reduce-motion'], ['Simplified interface', 'data-simplified'], ['Reading-friendly text', 'data-reading-font']] as const) {
      const toggle = within(dialog).getByRole('switch', { name });
      expect((toggle as HTMLInputElement).checked).toBe(false);
      fireEvent.click(toggle);
      expect((toggle as HTMLInputElement).checked).toBe(true);
      expect(document.documentElement.hasAttribute(attr)).toBe(true);
    }
    expect(JSON.parse(localStorage.getItem(PREFERENCES_KEY)!)).toEqual({ version: 1, textSize: 'large', highContrast: true, reduceMotion: true, simplified: true, readingFont: true });

    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(screen.getAllByRole('status').some(el => el.textContent === 'Reading-friendly text on.')).toBe(true);

    fireEvent.click(within(dialog).getByRole('button', { name: /Reset to default/ }));
    expect(document.documentElement.dataset.textSize).toBe('normal');
    expect(document.documentElement.hasAttribute('data-high-contrast')).toBe(false);

    fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('restores saved settings on load', () => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ version: 1, textSize: 'xlarge', highContrast: true, reduceMotion: false, simplified: false, readingFont: false }));
    render(<App />);
    expect(document.documentElement.dataset.textSize).toBe('xlarge');
    expect(document.documentElement.hasAttribute('data-high-contrast')).toBe(true);
  });

  it('offers a skip link to the main content', () => {
    render(<App />);
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    fireEvent.click(skip);
    expect(document.activeElement?.id).toBe('main-content');
  });
});

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChapterId, ChapterProps } from './missions';
import { STORAGE_KEY } from './progress';

// Exercise the shell/content boundary without creating files in Agent 2's paths.
vi.mock('./ChapterHost', () => ({
  default: ({ id, onComplete, onBack }: { id: ChapterId } & ChapterProps) => <section>
    <h1>Contract fixture: {id}</h1>
    <button onClick={() => { onComplete(); onComplete(); }}>Finish fixture</button>
    <button onClick={onBack}>Leave fixture</button>
  </section>,
}));
import App from '../App';

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(cleanup);
async function visit(id: ChapterId) {
  await act(async () => { window.location.hash = `#/chapter/${id}`; window.dispatchEvent(new HashChangeEvent('hashchange')); });
}

describe('chapter completion contract', () => {
  it('persists three core discoveries and keeps the Voyager epilogue separate', async () => {
    await visit('voyager');
    const firstVisit = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Finish fixture' }));
    await act(async () => { window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
    for (const id of ['apollo11', 'opportunity', 'insight'] as const) {
      await visit(id);
      fireEvent.click(screen.getByRole('button', { name: 'Finish fixture' }));
      await act(async () => { window.dispatchEvent(new HashChangeEvent('hashchange')); });
    }
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('3');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).completed).toEqual(['voyager', 'apollo11', 'opportunity', 'insight']);
    firstVisit.unmount();
    render(<App />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('3');
    expect(screen.getByRole('heading', { name: 'The archive is yours to carry forward.' })).toBeTruthy();
  });
  it('returns to the atlas without awarding progress when a chapter calls onBack', async () => {
    await visit('opportunity');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Leave fixture' }));
    await act(async () => { window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(screen.getByRole('heading', { name: /Mission explorer/ })).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
  });
});

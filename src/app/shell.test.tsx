import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { STORAGE_KEY } from './progress';

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '#/';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
afterEach(cleanup);
async function visit(hash: string) {
  await act(async () => { window.location.hash = hash; window.dispatchEvent(new HashChangeEvent('hashchange')); });
}

describe('museum shell', () => {
  it('starts exploring or a chapter in one click and does not award progress on visit', async () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Begin Exploring' }).getAttribute('href')).toBe('#/atlas');
    const begin = screen.getByRole('link', { name: 'Or start with the Moon' });
    expect(begin.getAttribute('href')).toBe('#/chapter/apollo11');
    await visit(begin.getAttribute('href')!);
    expect(await screen.findByRole('heading', { name: 'The Mirror That Never Went Silent' })).toBeTruthy();
    expect(document.title).toBe('Apollo 11 — ECHOES');
    expect(document.activeElement?.id).toBe('main-content');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"completed":[]}').completed).toEqual([]);
  });
  it('shows all four accessible atlas routes and handles browser navigation', async () => {
    render(<App />);
    await visit('#/atlas');
    const chart = screen.getByRole('navigation', { name: 'Artifact navigation' });
    expect(within(chart).getAllByRole('link')).toHaveLength(4);
    const titles: Record<string, string> = {
      apollo11: 'The Mirror That Never Went Silent', opportunity: 'The Rover That Outlived Its Mission',
      insight: 'Listening to the Heart of Mars', voyager: 'Beyond the Last Planet',
    };
    for (const id of ['apollo11', 'opportunity', 'insight', 'voyager']) {
      expect(chart.querySelector(`a[href="#/chapter/${id}"]`)).toBeTruthy();
      await visit(`#/chapter/${id}`);
      expect(await screen.findByRole('heading', { name: titles[id] })).toBeTruthy();
    }
    await visit('#/atlas');
    expect(screen.getByRole('heading', { name: /The discovery atlas/ })).toBeTruthy();
    await visit('#/unknown');
    expect(screen.getByRole('heading', { name: 'A little off course.' })).toBeTruthy();
  });
  it('counts only core discoveries and requires reset confirmation', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completed: ['apollo11', 'insight', 'voyager'] }));
    await visit('#/journal');
    render(<App />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('2');
    expect(screen.getAllByText('Collected')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Reset journal' }));
    const dialog = screen.getByRole('dialog');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).completed).toHaveLength(3);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep my discoveries' }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).completed).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Reset journal' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Reset journal' }));
    await waitFor(() => expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0'));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"completed":[]}').completed).toEqual([]);
  });
  it('loads a deep-link journal safely when storage is malformed', async () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    await visit('#/journal');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Your next discovery is out there.' })).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
  });
});

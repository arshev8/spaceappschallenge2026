import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import Apollo11 from '../chapters/apollo11';
import { LOCALES, LOCALE_KEY, MESSAGES, applyLocale, detectLocale, formatNumber, interpolate, translate } from '.';
import { localizeContent } from '../content/localize.ts';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');

beforeEach(() => {
  localStorage.clear();
  applyLocale('en');
  window.location.hash = '#/';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  applyLocale('en');
});

describe('message dictionaries', () => {
  it.each(LOCALES)('%s has every key, no empty values and the same placeholders as English', locale => {
    const en = MESSAGES.en;
    const dict = MESSAGES[locale];
    expect(Object.keys(dict).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(dict[key].trim().length, key).toBeGreaterThan(0);
      expect(placeholders(dict[key]), key).toBe(placeholders(en[key]));
    }
  });

  it('interpolates variables and leaves unknown placeholders visible', () => {
    expect(interpolate('{a} of {b}', { a: 1, b: 3 })).toBe('1 of 3');
    expect(interpolate('{missing}', {})).toBe('{missing}');
    expect(translate('ru', 'shell.count', { count: 2 })).toBe('Открытий: 2 из 3');
  });

  it('formats numbers for each language', () => {
    expect(formatNumber(384400, 'en')).toBe('384,400');
    expect(formatNumber(2.564, 'es', 3)).toBe('2,564');
    expect(formatNumber(384400, 'ru').replace(/\s/g, ' ')).toBe('384 400');
  });
});

describe('language detection', () => {
  it('prefers a stored choice, then the browser language, then English', () => {
    localStorage.setItem(LOCALE_KEY, 'kk');
    expect(detectLocale()).toBe('kk');
    localStorage.clear();
    const spy = vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-MX', 'en']);
    expect(detectLocale()).toBe('es');
    spy.mockReturnValue(['de-DE', 'fr']);
    expect(detectLocale()).toBe('en');
  });
});

describe('localized content', () => {
  it('keeps answers and structure identical across languages', () => {
    const en = localizeContent('en');
    for (const locale of ['ru', 'kk', 'es'] as const) {
      const c = localizeContent(locale);
      expect(c.samples.map(s => [s.id, s.verdict])).toEqual(en.samples.map(s => [s.id, s.verdict]));
      expect(c.formulas.map(f => [f.id, f.correct])).toEqual(en.formulas.map(f => [f.id, f.correct]));
      expect(c.scripts.apollo11.map(s => [s.id, s.gate])).toEqual(en.scripts.apollo11.map(s => [s.id, s.gate]));
      expect(c.missions.opportunity.chapterTitle).not.toBe(en.missions.opportunity.chapterTitle);
    }
  });
});

describe('switching language in the app', () => {
  it('translates the whole page, sets <html lang> and remembers the choice', async () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Begin Exploring' })).toBeTruthy();
    const select = screen.getByLabelText('Language') as HTMLSelectElement;
    await act(async () => { fireEvent.change(select, { target: { value: 'ru' } }); });
    expect(document.documentElement.lang).toBe('ru');
    expect(localStorage.getItem(LOCALE_KEY)).toBe('ru');
    expect(screen.getByRole('link', { name: 'Начать исследование' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Отображение и доступность' })).toBeTruthy();
    await act(async () => { fireEvent.change(screen.getByLabelText('Язык'), { target: { value: 'es' } }); });
    expect(screen.getByRole('link', { name: 'Empezar a explorar' })).toBeTruthy();
    expect(document.title).toBe('Las máquinas que cambiaron nuestro universo — ECHOES');
  });

  it('plays a chapter in Kazakh with localized feedback and numbers', async () => {
    document.documentElement.setAttribute('data-reduce-motion', 'true');
    applyLocale('kk');
    render(<Apollo11 onComplete={() => {}} onBack={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Үнсіз қалмаған айна' })).toBeTruthy();
    const next = () => screen.getAllByRole('button').filter(b => b.closest('.ec-nav')).pop()!;
    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(screen.getByLabelText('«Аполлон-11» шағылыстырғыш панелі'));
    fireEvent.click(screen.getByRole('button', { name: 'Лазер импульсін жіберу' }));
    expect(screen.getAllByText(/2,564/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Сигнал қайтты!/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('қашықтық = жарық жылдамдығы × уақыт ÷ 2'));
    expect(screen.getByText(/Дәл солай!/)).toBeTruthy();
    document.documentElement.removeAttribute('data-reduce-motion');
  });
});

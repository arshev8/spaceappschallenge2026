import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import Apollo11 from '../chapters/apollo11';
import { LOCALES, LOCALE_KEY, MESSAGES, applyLocale, currentLocale as currentLocaleForTest, detectLocale, formatNumber, interpolate, translate } from '.';
import { localizeContent } from '../content/localize.ts';
import { loadAllPacks } from './packs';

beforeAll(async () => { await loadAllPacks(); });

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
    const dict = MESSAGES[locale]!;
    expect(dict).toBeTruthy();
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
    expect(formatNumber(2.564, 'ru', 3)).toBe('2,564');
    expect(formatNumber(384400, 'ru').replace(/\s/g, ' ')).toBe('384 400');
  });
});

describe('language detection', () => {
  it('prefers a stored choice, then the browser language, then English', () => {
    localStorage.setItem(LOCALE_KEY, 'ru');
    expect(detectLocale()).toBe('ru');
    localStorage.clear();
    const spy = vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ru-RU', 'en']);
    expect(detectLocale()).toBe('ru');
    spy.mockReturnValue(['kk-KZ', 'ru']);
    expect(detectLocale()).toBe('kk');
    spy.mockReturnValue(['zh-CN']);
    expect(detectLocale()).toBe('en'); // Chinese is not offered
    spy.mockReturnValue(['ja-JP', 'it']);
    expect(detectLocale()).toBe('en');
  });
});

describe('localized content', () => {
  it('keeps answers and structure identical across languages', () => {
    const en = localizeContent('en');
    for (const locale of LOCALES.filter(l => l !== 'en')) {
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
    expect(screen.getByRole('link', { name: 'Begin the Journey' })).toBeTruthy();
    const select = screen.getByLabelText('Language') as HTMLSelectElement;
    expect([...select.options].map(o => o.value)).toEqual(['kk', 'ru', 'en', 'es', 'ar', 'fr', 'de', 'hi', 'pt', 'tr']);
    expect([...select.options].map(o => o.textContent)).toEqual(['Қазақша', 'Русский', 'English', 'Español', 'العربية', 'Français', 'Deutsch', 'हिन्दी', 'Português', 'Türkçe']);
    await act(async () => { fireEvent.change(select, { target: { value: 'ru' } }); });
    await waitFor(() => expect(document.documentElement.lang).toBe('ru'));
    expect(localStorage.getItem(LOCALE_KEY)).toBe('ru');
    expect(screen.getByRole('link', { name: 'Начать путешествие' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Миссии/ })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Отправь сигнал. Дождись эха.' })).toBeTruthy();
    expect(document.title).toBe('Машины, которые изменили наш взгляд на Вселенную — ECHOES');
    await act(async () => { fireEvent.change(screen.getByLabelText('Язык'), { target: { value: 'en' } }); });
    await waitFor(() => expect(screen.getByRole('link', { name: 'Begin the Journey' })).toBeTruthy());
  });

  it('switches to Arabic right-to-left and back, and to Kazakh', async () => {
    render(<App />);
    await act(async () => { fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'ar' } }); });
    await waitFor(() => expect(document.documentElement.dir).toBe('rtl'));
    expect(document.documentElement.lang).toBe('ar');
    expect(localStorage.getItem(LOCALE_KEY)).toBe('ar');
    const nav = () => screen.getByRole('navigation', { name: translate(currentLocaleForTest(), 'shell.nav') });
    expect(within(nav()).getByRole('link', { name: new RegExp(translate('ar', 'ui.nav.explore')) })).toBeTruthy();
    await act(async () => { fireEvent.change(screen.getByLabelText(translate('ar', 'shell.language')), { target: { value: 'kk' } }); });
    await waitFor(() => expect(document.documentElement.lang).toBe('kk'));
    expect(document.documentElement.dir).toBe('ltr');
    expect(within(nav()).getByRole('link', { name: new RegExp(translate('kk', 'ui.nav.explore')) })).toBeTruthy();
    expect(document.title).toBe(`${translate('kk', 'title.home')} — ECHOES`);
  });

  it('plays a chapter in Russian with localized headings', async () => {
    applyLocale('ru');
    render(<Apollo11 onComplete={() => {}} onBack={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Зеркало, которое не замолчало' })).toBeTruthy();
  });
});

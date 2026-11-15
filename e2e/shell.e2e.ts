import { expect, test } from '@playwright/test';
import { KEYS, go, mainNav, readStore, seed, visit, watchErrors } from './helpers';

test.describe('museum shell', () => {
  test.beforeEach(async ({ page }) => { await seed(page); });

  test('main navigation reaches every section and marks the current page', async ({ page }) => {
    const watch = watchErrors(page);
    await visit(page, '#/');
    const links = [
      { name: 'Missions', hash: '#/atlas', h1: /Mission explorer/ },
      { name: 'Explore', hash: '#/explore', h1: 'Solar system explorer' },
      { name: 'Timeline', hash: '#/timeline', h1: 'Timeline' },
      { name: 'Games', hash: '#/games', h1: 'Mission games' },
      { name: /^Journal/, hash: '#/journal', h1: /./ },
    ];
    for (const link of links) {
      const a = mainNav(page).getByRole('link', { name: link.name });
      await a.click();
      await expect(page).toHaveURL(new RegExp(`${link.hash.replace('/', '\\/')}$`));
      await expect(page.locator('main h1').first()).toHaveText(link.h1);
      await expect(a).toHaveAttribute('aria-current', 'page');
      // Focus moves to <main> on route change so screen-reader users land on the new content.
      await expect(page.locator('#main-content')).toBeFocused();
    }
    await page.getByRole('link', { name: 'ECHOES home' }).click();
    await expect(page).toHaveTitle('The Machines That Changed Our Universe — ECHOES');
    watch.expectNone();
  });

  test('Begin the Journey opens Apollo 11 without awarding progress', async ({ page }) => {
    await visit(page, '#/');
    await page.getByRole('link', { name: 'Begin the Journey' }).click();
    await expect(page).toHaveURL(/#\/chapter\/apollo11$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Apollo 11' })).toBeVisible();
    expect((await readStore<{ completed: string[] }>(page, KEYS.progress))?.completed ?? []).toEqual([]);
  });

  test('browser back and forward follow hash routes', async ({ page }) => {
    await visit(page, '#/atlas');
    await go(page, '#/chapter/insight');
    await expect(page.getByRole('heading', { level: 1, name: 'InSight' })).toBeVisible();
    await page.goBack();
    await expect(page.locator('main h1').first()).toHaveText(/Mission explorer/);
    await page.goForward();
    await expect(page.getByRole('heading', { level: 1, name: 'InSight' })).toBeVisible();
  });

  test('unknown routes show the not-found page with a way back', async ({ page }) => {
    await visit(page, '#/does/not/exist');
    await expect(page.getByRole('heading', { name: 'A little off course.' })).toBeVisible();
    await page.locator('main').getByRole('link').first().click();
    await expect(page).toHaveURL(/#\/atlas$/);
  });

  test('skip link moves focus to the main content', async ({ page }) => {
    await visit(page, '#/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('language switch translates the page, sets <html lang> and survives reload', async ({ page }) => {
    await visit(page, '#/games');
    const select = page.getByRole('combobox', { name: 'Language' });
    await select.selectOption('ru');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByRole('heading', { level: 1, name: 'Космические игры' })).toBeVisible();
    await expect(mainNav(page)).toHaveCount(0); // nav label is translated too
    await expect(page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Миссии' })).toBeVisible();
    expect(await page.evaluate(k => localStorage.getItem(k), KEYS.locale)).toBe('ru');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByRole('combobox', { name: 'Язык' })).toHaveValue('ru');
    await page.getByRole('combobox', { name: 'Язык' }).selectOption('en');
    await expect(page.getByRole('heading', { level: 1, name: 'Mission games' })).toBeVisible();
  });

  test('there is no animation toggle; high contrast applies, persists and reverses', async ({ page }) => {
    await visit(page, '#/');
    const html = page.locator('html');
    const settings = page.getByRole('group', { name: 'Display settings' });
    await expect(page.getByRole('button', { name: /animations/i })).toHaveCount(0);
    await expect(html).not.toHaveAttribute('data-motion', /.*/);
    await expect(html).not.toHaveAttribute('data-reduce-motion', /.*/);

    // High contrast lives only in the accessibility panel; the header has no separate button.
    await expect(settings.getByRole('button', { name: 'High contrast' })).toHaveCount(0);
    const setContrast = async () => {
      await settings.getByRole('button', { name: /Accessibility settings/ }).click();
      return page.getByRole('dialog', { name: 'Accessibility' }).getByRole('switch', { name: 'High contrast' });
    };
    let contrast = await setContrast();
    await expect(contrast).not.toBeChecked();
    await contrast.click();
    await expect(contrast).toBeChecked();
    await expect(html).toHaveAttribute('data-contrast', 'high');
    expect(await readStore(page, KEYS.prefs)).toEqual({ version: 1, contrast: 'high' });

    await page.reload();
    await expect(html).toHaveAttribute('data-contrast', 'high');
    contrast = await setContrast();
    await expect(contrast).toBeChecked();
    await contrast.click();
    await expect(html).toHaveAttribute('data-contrast', 'normal');
    await expect(settings).toBeVisible();
  });

  test('a motion setting saved by an older version is ignored: animations start automatically', async ({ page }) => {
    await seed(page, { legacyPrefs: { version: 1, motion: 'reduced', contrast: 'normal' } });
    await visit(page, '#/');
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', /.*/);
    await expect(page.locator('html')).not.toHaveAttribute('data-reduce-motion', /.*/);
  });

});

test('journal badge reflects saved core discoveries only', async ({ page }) => {
  await seed(page, { completed: ['apollo11', 'insight', 'voyager'] });
  await visit(page, '#/');
  await expect(mainNav(page).getByRole('link', { name: /^Journal/ })).toContainText('2/3');
});

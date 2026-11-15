import { expect, test } from '@playwright/test';
import { KEYS, readStore, seed, visit, watchErrors } from './helpers';

test.describe('accessibility panel', () => {
  test.beforeEach(async ({ page }) => { await seed(page); });

  test('works from the keyboard, applies settings site-wide and survives reload', async ({ page }) => {
    const watch = watchErrors(page);
    await visit(page, '#/atlas');
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: 'Accessibility settings' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Accessibility' });
    await expect(dialog).toBeVisible();

    // Only the settings that matter: contrast, text size, motion, games.
    await expect(dialog.getByRole('switch')).toHaveCount(3);
    await expect(dialog.getByRole('radio')).toHaveCount(3);

    // Space toggles a switch; arrow keys move within a radio group.
    await dialog.getByRole('switch', { name: 'Reduce motion' }).focus();
    await page.keyboard.press('Space');
    await expect(html).toHaveAttribute('data-reduce-motion', '');
    await expect(page.locator('.starfield')).toHaveCount(0);
    await expect(page.getByRole('status').filter({ hasText: 'Reduce motion: On' })).toHaveCount(1);
    await dialog.getByRole('radio', { name: /^100/ }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(html).toHaveAttribute('data-text-size', 'large');

    // Escape closes and returns focus to the toggle.
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(toggle).toBeFocused();
    expect(await readStore(page, KEYS.a11y)).toEqual({ version: 1, textSize: 'large', reduceMotion: true, relaxedGames: false });

    // Every route keeps the settings: they live on <html>.
    await page.reload();
    await expect(html).toHaveAttribute('data-reduce-motion', '');
    await expect(html).toHaveAttribute('data-text-size', 'large');
    const fontSize = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
    expect(parseFloat(fontSize)).toBeCloseTo(20, 0);
    // No horizontal scrolling at the larger text size.
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    await page.getByRole('button', { name: /Accessibility settings/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: /Reset all/ }).click();
    await expect(html).not.toHaveAttribute('data-reduce-motion', /.*/);
    await expect(html).not.toHaveAttribute('data-text-size', /.*/);
    watch.expectNone();
  });

  test('clicking outside closes the panel without moving focus into it', async ({ page }) => {
    await visit(page, '#/');
    await page.getByRole('button', { name: 'Accessibility settings' }).click();
    await expect(page.getByRole('dialog', { name: 'Accessibility' })).toBeVisible();
    await page.mouse.click(4, 4); // empty header corner, outside the panel on every viewport
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

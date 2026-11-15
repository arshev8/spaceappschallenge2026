import { expect, test } from '@playwright/test';
import { ROUTES, expectNoHorizontalScroll, seed, visit, watchErrors } from './helpers';

/** Every route renders cleanly in a real browser: heading, title, no errors, no broken assets, no sideways scroll. */
test.describe('routes', () => {
  for (const route of ROUTES) {
    test(`${route.name} renders without errors`, async ({ page }) => {
      const watch = watchErrors(page);
      await seed(page);
      await visit(page, route.hash);
      await expect(page.locator('main h1').first()).toHaveText(route.h1);
      await expect(page).toHaveTitle(route.title);
      // Shell chrome is present on every route.
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await expect(page.getByRole('group', { name: 'Display settings' })).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeAttached();
      // Every image that is in the DOM actually decoded.
      await page.waitForLoadState('networkidle');
      const broken = await page.evaluate(() => Array.from(document.images)
        .filter(img => img.complete && img.currentSrc && img.naturalWidth === 0)
        .map(img => img.currentSrc));
      expect(broken, `broken images: ${broken.join(', ')}`).toEqual([]);
      await expectNoHorizontalScroll(page);
      watch.expectNone();
    });
  }

  test('Russian locale renders every route without errors', async ({ page }) => {
    const watch = watchErrors(page);
    await seed(page, { locale: 'ru' });
    for (const route of ROUTES) {
      await visit(page, route.hash);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
      await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible();
      await expectNoHorizontalScroll(page);
    }
    watch.expectNone();
  });
});

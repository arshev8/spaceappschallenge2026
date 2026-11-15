import { expect, test, type Page } from '@playwright/test';
import { ROUTES, seed, seedRandom, visit } from './helpers';

/**
 * @visual — the "before" record of the current design.
 *
 * These are NOT a contract for the redesign: the redesign is expected to change them.
 * Run `npm run test:visual` to see exactly what moved, review the diffs, then re-baseline
 * on purpose with `npm run test:visual:update`.
 *
 * Determinism: reduced motion (set on the visual projects) gives a static starfield and
 * no reveal transitions; Math.random is seeded; WebGL canvases are masked.
 */
const masks = (page: Page) => [page.locator('canvas[aria-label*="3D"]')];

async function capture(page: Page, name: string) {
  // Images are loading="lazy"; a full-page shot would otherwise catch below-the-fold ones
  // loaded on some runs and blank on others. Load them all, then wait for every decode.
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    imgs.forEach(img => { img.loading = 'eager'; });
    await document.fonts.ready;
    await Promise.all(imgs.map(img => img.decode().catch(() => null)));
  });
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, mask: masks(page) });
}

test.describe('@visual current design', () => {
  test.beforeEach(async ({ page }) => { await seedRandom(page); });

  for (const route of ROUTES) {
    test(`${route.name} (en)`, async ({ page }) => {
      await seed(page, { locale: 'en' });
      await visit(page, route.hash);
      await capture(page, `${route.name}.en`);
    });
  }

  for (const name of ['home', 'atlas', 'chapter-apollo11', 'games', 'journal'] as const) {
    test(`${name} (ru)`, async ({ page }) => {
      const route = ROUTES.find(r => r.name === name)!;
      await seed(page, { locale: 'ru' });
      await visit(page, route.hash);
      await capture(page, `${name}.ru`);
    });
  }

  for (const name of ['home', 'chapter-apollo11', 'journal'] as const) {
    test(`${name} (high contrast)`, async ({ page }) => {
      const route = ROUTES.find(r => r.name === name)!;
      await seed(page, { locale: 'en', contrast: 'high' });
      await visit(page, route.hash);
      await capture(page, `${name}.contrast`);
    });
  }

  test('journal with progress (en)', async ({ page }) => {
    await seed(page, { locale: 'en', completed: ['apollo11', 'opportunity', 'insight', 'voyager'] });
    await visit(page, '#/journal');
    await capture(page, 'journal-complete.en');
  });
});

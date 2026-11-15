import { expect, test } from '@playwright/test';
import { ROUTES, seed, visit, watchErrors } from './helpers';

/**
 * §8 verification widths. Every route must render at each width with no sideways page
 * scroll, no errors, and the main navigation reachable. Runs once (desktop project);
 * it resizes the viewport itself.
 */
const WIDTHS = [1920, 1440, 1024, 768, 390, 360] as const;

test.describe('responsive widths', () => {
  test.skip(({ isMobile }) => isMobile, 'resizes its own viewport; run once on the desktop project');

  for (const width of WIDTHS) {
    test(`all routes at ${width}px`, async ({ page }) => {
      const watch = watchErrors(page);
      await page.setViewportSize({ width, height: width >= 1024 ? 900 : 800 });
      await seed(page);
      const overflow: string[] = [];
      for (const route of ROUTES) {
        await visit(page, route.hash);
        await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeAttached();
        const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
        if (scroll > client) overflow.push(`${route.name}: ${scroll}px > ${client}px`);
      }
      expect(overflow, `horizontal overflow at ${width}px:\n${overflow.join('\n')}`).toEqual([]);
      watch.expectNone();
    });
  }
});

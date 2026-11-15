import { expect, test, type Page } from '@playwright/test';
import { KEYS, mainNav, readStore, seed, visit, watchErrors } from './helpers';

/** The step navigator every chapter uses; its last button is "next". */
const next = (page: Page) => page.getByRole('navigation', { name: 'Previous and next step' }).getByRole('button').last();
async function advance(page: Page, n: number) {
  for (let i = 0; i < n; i++) await next(page).click();
}
const completed = async (page: Page) => (await readStore<{ completed: string[] }>(page, KEYS.progress))?.completed ?? [];
const progressValue = (page: Page) => page.getByRole('progressbar').first();

/**
 * Full chapter playthroughs in the real app, ported from the Vitest game specs but going
 * through the shell: completion must save, route to the journal and update the badge.
 * Reduced motion makes the Apollo laser resolve instantly, exactly as in the unit tests.
 */
test.describe('chapter journeys', () => {
  test.use({ reducedMotion: 'reduce' });
  test.beforeEach(async ({ page }) => { await seed(page); });

  test('Apollo 11: aim, fire, calculate, collect', async ({ page }) => {
    const watch = watchErrors(page);
    await visit(page, '#/chapter/apollo11');
    await advance(page, 2);
    await expect(page.getByRole('heading', { name: 'Measure the distance to the Moon' })).toBeVisible();
    await expect(next(page)).toBeDisabled();
    await page.getByLabel('Bare lunar ground beside it').check();
    await expect(page.getByText(/Not yet — try again/)).toBeVisible();
    await page.getByLabel('The Apollo 11 reflector array').check();
    await page.getByRole('button', { name: 'Fire laser pulse' }).click();
    await expect(page.getByText(/Return detected! Shot 1/)).toBeVisible();
    await expect(page.getByRole('table', { name: /Measurement log/ })).toBeVisible();
    await page.getByLabel('distance = speed of light × time ÷ 2').check();
    await expect(page.getByText(/matches the 384,400 km you set/)).toBeVisible();
    await expect(next(page)).toBeEnabled();
    await advance(page, 2);
    expect(await completed(page)).toEqual([]);
    await page.getByRole('button', { name: 'Add discovery to journal' }).click();
    await expect(page).toHaveURL(/#\/journal$/);
    expect(await completed(page)).toEqual(['apollo11']);
    await expect(mainNav(page).getByRole('link', { name: /^Journal/ })).toContainText('1/3');
    await expect(progressValue(page)).toHaveAttribute('aria-valuenow', '1');
    watch.expectNone();
  });

  test('Opportunity: sort the evidence, model the dust, collect', async ({ page }) => {
    await visit(page, '#/chapter/opportunity');
    await expect(page.getByText('Imagined narration based on NASA mission records').first()).toBeVisible();
    await advance(page, 2);
    const decide = async (sample: string, verdict: string) => {
      await page.getByRole('button', { name: new RegExp(sample) }).first().click();
      await page.getByRole('group', { name: /Your verdict for/ }).getByRole('button', { name: verdict }).click();
    };
    await decide('Tiny round spheres', 'Supports ancient water');
    await expect(page.getByText(/NASA listed more than one way/)).toBeVisible();
    await decide('Tiny round spheres', 'Not a water clue on its own');
    await decide('Hematite at the landing site', 'Supports ancient water');
    await decide('Jarosite in the', 'Supports ancient water');
    await decide('Rocks at Endeavour Crater', 'Supports ancient water');
    await decide('The small crater where it landed', 'Not a water clue on its own');
    await expect(page.getByText('Case closed')).toBeVisible();
    await expect(next(page)).toBeDisabled();
    await page.getByLabel(/How dusty is the sky/).fill('8');
    await expect(page.getByText(/fell silent/)).toBeVisible();
    await expect(next(page)).toBeEnabled();
    await advance(page, 2);
    await page.getByRole('button', { name: 'Add discovery to journal' }).click();
    await expect(page).toHaveURL(/#\/journal$/);
    expect(await completed(page)).toEqual(['opportunity']);
  });

  test('InSight: find the event, reason about arrivals and layers, collect', async ({ page }) => {
    await visit(page, '#/chapter/insight');
    await advance(page, 2);
    await expect(page.getByText(/not real NASA/i).first()).toBeVisible();
    await expect(page.getByRole('table', { name: /Signal summary/ })).toBeVisible();
    await page.getByRole('radio', { name: /^Trace C/ }).check();
    await page.getByRole('radio', { name: /^Trace B/ }).check();
    await page.getByLabel('Farther away').check();
    await page.getByRole('button', { name: 'Mantle' }).click();
    await page.getByLabel(/Where the boundaries between layers are/).check();
    await expect(next(page)).toBeEnabled();
    await advance(page, 2);
    await page.getByRole('button', { name: 'Add discovery to journal' }).click();
    await expect(page).toHaveURL(/#\/journal$/);
    expect(await completed(page)).toEqual(['insight']);
  });

  test('Voyager: match statuses, hear the Golden Record, finish the epilogue', async ({ page }) => {
    await visit(page, '#/chapter/voyager');
    await advance(page, 2);
    const answers = { 'Apollo 11 laser reflector': 'passive-still-useful', 'Opportunity rover': 'mission-ended', 'InSight lander': 'mission-ended', 'Voyager 1': 'extended-mission' };
    for (const [label, value] of Object.entries(answers)) await page.getByRole('combobox', { name: label, exact: true }).selectOption(value);
    await page.getByRole('button', { name: 'Check answers' }).click();
    await expect(page.getByText('All four!')).toBeVisible();
    await advance(page, 1);
    await expect(page.getByText('Greetings').first()).toBeVisible();
    await advance(page, 1);
    await page.getByRole('button', { name: 'Finish the journey' }).click();
    await expect(page).toHaveURL(/#\/journal$/);
    expect(await completed(page)).toEqual(['voyager']);
    // Voyager is an epilogue: it never counts toward the three core discoveries.
    await expect(mainNav(page).getByRole('link', { name: /^Journal/ })).toContainText('0/3');
  });

});

test.describe('journal', () => {
  test('progress survives a reload and all three core discoveries complete the journal', async ({ page }) => {
    await seed(page, { completed: ['apollo11', 'opportunity', 'insight'] });
    await visit(page, '#/journal');
    await expect(progressValue(page)).toHaveAttribute('aria-valuenow', '3');
    await expect(page.getByRole('heading', { name: 'The archive is yours to carry forward.' })).toBeVisible();
    await page.reload();
    await expect(progressValue(page)).toHaveAttribute('aria-valuenow', '3');
  });

  test('reset needs confirmation and clears saved progress', async ({ page }) => {
    await seed(page, { completed: ['apollo11', 'insight', 'voyager'] });
    await visit(page, '#/journal');
    await expect(progressValue(page)).toHaveAttribute('aria-valuenow', '2');
    await expect(page.getByText('Collected', { exact: true })).toHaveCount(2);
    await page.getByRole('button', { name: 'Reset journal' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Keep my discoveries' }).click();
    await expect(dialog).toBeHidden();
    expect(await completed(page)).toHaveLength(3);
    await page.getByRole('button', { name: 'Reset journal' }).click();
    await dialog.getByRole('button', { name: 'Reset journal' }).click();
    await expect(progressValue(page)).toHaveAttribute('aria-valuenow', '0');
    expect(await completed(page)).toEqual([]);
  });

  test('malformed saved data falls back to an empty journal', async ({ page }) => {
    await page.addInitScript(k => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', '1'); localStorage.setItem(k, '{broken'); } }, KEYS.progress);
    await visit(page, '#/journal');
    await expect(page.getByRole('heading', { name: 'Your next discovery is out there.' })).toBeVisible();
    await expect(progressValue(page)).toHaveAttribute('aria-valuenow', '0');
  });
});

test.describe('mission explorer (atlas)', () => {
  test('lists four missions and switches tabs with the keyboard', async ({ page }) => {
    await seed(page);
    await visit(page, '#/atlas');
    const chart = page.getByRole('navigation', { name: 'Artifact navigation' });
    await expect(chart.getByRole('link')).toHaveCount(4);
    for (const id of ['apollo11', 'opportunity', 'insight', 'voyager']) await expect(chart.locator(`a[href="#/chapter/${id}"]`)).toHaveCount(1);
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(4);
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: /Opportunity/ })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { level: 2, name: 'Opportunity' })).toBeVisible();
  });
});

test.describe('solar system explorer', () => {
  test('3D view renders a WebGL canvas and the destination list', async ({ page }) => {
    const watch = watchErrors(page);
    await seed(page);
    await visit(page, '#/explore');
    await expect(page.getByRole('navigation', { name: 'Destinations' })).toBeVisible();
    const canvas = page.getByLabel(/Interactive 3D model of the solar system/);
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box && box.width > 200 && box.height > 200).toBeTruthy();
    expect(await canvas.evaluate((c: HTMLCanvasElement) => !!(c.getContext('webgl2') || c.getContext('webgl')))).toBe(true);
    watch.expectNone();
  });

  test('there is no 2D mode: only the 3D scene, and choosing a destination opens its panel', async ({ page }) => {
    await seed(page);
    await visit(page, '#/explore');
    await expect(page.getByRole('button', { name: /2D/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '3D view' })).toHaveCount(0);
    const dest = page.getByRole('navigation', { name: 'Destinations' });
    await dest.getByRole('button').first().click();
    await expect(page.locator('#s3-panel-title')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('#s3-panel-title')).toHaveCount(0);
    await expect(page.getByLabel(/Interactive 3D model/)).toBeVisible();
  });

  test('the whole 3D scene fits the screen on arrival, with no scrolling needed', async ({ page }) => {
    await seed(page);
    await visit(page, '#/explore');
    const canvas = page.getByLabel(/Interactive 3D model of the solar system/);
    await expect(canvas).toBeVisible();
    const fits = async () => {
      const box = (await canvas.boundingBox())!;
      const { vw, vh, scrollY, tabBar, overflowX } = await page.evaluate(() => {
        const nav = document.querySelector('.main-nav')!;
        const fixed = getComputedStyle(nav).position === 'fixed';
        return { vw: window.innerWidth, vh: window.innerHeight, scrollY: window.scrollY, tabBar: fixed ? nav.getBoundingClientRect().height : 0, overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth };
      });
      expect(scrollY).toBe(0);
      expect(overflowX).toBe(false);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(vw + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(vh - tabBar + 1);
      expect(box.height).toBeGreaterThan(200);
    };
    await fits();
    // Resizing (e.g. rotating a tablet) refits the scene.
    const size = page.viewportSize()!;
    await page.setViewportSize({ width: size.height > size.width ? size.height : size.width, height: Math.min(size.width, size.height) });
    await expect.poll(async () => { try { await fits(); return true; } catch { return false; } }).toBe(true);
  });
});

test.describe('mini-games', () => {
  test.beforeEach(async ({ page }) => { await seed(page); });

  test('games hub links to all three games', async ({ page }) => {
    await visit(page, '#/games');
    for (const id of ['lander', 'probe', 'quiz']) await expect(page.locator(`main a[href="#/games/${id}"]`).first()).toBeVisible();
  });

  test('quiz plays through all ten questions to a result', async ({ page }) => {
    await visit(page, '#/games/quiz');
    await page.getByRole('button', { name: 'Start the quiz' }).click();
    for (let n = 1; n <= 10; n++) {
      await expect(page.getByRole('list', { name: `Question ${n} of 10` })).toBeAttached();
      await page.getByRole('main').getByRole('listitem').getByRole('button').first().click();
      await expect(page.getByText(/^(Correct! \+\d+|Not quite\. It’s “.+”\.)$/)).toBeVisible();
      await page.getByRole('button', { name: n === 10 ? 'See results' : 'Next question' }).click();
    }
    await expect(page.getByText(/of 10 correct\./)).toBeVisible();
    await expect(page.getByRole('list', { name: 'Your answers' }).getByRole('listitem')).toHaveCount(10);
    await page.getByRole('button', { name: 'Play again' }).click();
    await expect(page.getByRole('list', { name: 'Question 1 of 10' })).toBeAttached();
  });

  test('probe builder starts at destination choice', async ({ page }) => {
    await visit(page, '#/games/probe');
    await expect(page.getByRole('heading', { name: /Choose a destination/ })).toBeVisible();
  });

  test('lander starts a descent and enables flight controls', async ({ page }) => {
    await visit(page, '#/games/lander');
    await expect(page.locator('main canvas')).toBeAttached();
    const left = page.getByRole('button', { name: 'Side thruster: push left' });
    await expect(left).toBeDisabled();
    await page.getByRole('button', { name: 'Start descent' }).click();
    await expect(page.getByRole('button', { name: 'Start descent' })).toHaveCount(0);
    await expect(left).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Thrust', exact: true })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Side thruster: push right' })).toBeEnabled();
  });
});

import { test, expect, type Page } from '@playwright/test';

const TRIGGER = '[data-scope="dialog"][data-part="trigger"]';
const CONTENT = '[data-scope="dialog"][data-part="content"]';
const BACKDROP = '[data-scope="dialog"][data-part="backdrop"]';

const open = async (page: Page) => {
  await page.click(TRIGGER);
  await expect(page.locator(CONTENT)).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  (page as any).__errors = errors;
  await page.goto('/');
  await expect(page.locator(TRIGGER)).toBeVisible();
});

test('1+2: machine drives the dialog, correct data-* and portaled to body', async ({ page }) => {
  await open(page);
  const content = page.locator(CONTENT);
  await expect(content).toHaveAttribute('data-state', 'open');
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(page.locator(BACKDROP)).toBeVisible();
  // portaled out of the component subtree
  expect(await page.locator(`app-root ${CONTENT}`).count()).toBe(0);
  expect(await page.locator(`body > * ${CONTENT}, body > ${CONTENT}`).count()).toBeGreaterThan(0);
});

test('3: focus trap — enters on open, wraps both directions, restores on close', async ({
  page,
}) => {
  await open(page);

  // focus moved into the dialog
  await expect(page.locator(CONTENT)).toContainText('Spike dialog');
  const activeInside = await page.evaluate(() => {
    const c = document.querySelector('[data-scope="dialog"][data-part="content"]')!;
    return c.contains(document.activeElement);
  });
  expect(activeInside, 'focus should move into the dialog on open').toBe(true);

  // forward wrap: from the last focusable, Tab returns to the first
  await page.locator('#last-focusable').focus();
  await page.keyboard.press('Tab');
  const afterForward = await page.evaluate(() => {
    const c = document.querySelector('[data-scope="dialog"][data-part="content"]')!;
    return { inside: c.contains(document.activeElement), id: document.activeElement?.id };
  });
  expect(afterForward.inside, 'Tab from last must stay inside the trap').toBe(true);

  // backward wrap
  await page.locator('#first-focusable').focus();
  await page.keyboard.press('Shift+Tab');
  const afterBackward = await page.evaluate(() => {
    const c = document.querySelector('[data-scope="dialog"][data-part="content"]')!;
    return { inside: c.contains(document.activeElement), id: document.activeElement?.id };
  });
  expect(afterBackward.inside, 'Shift+Tab from first must stay inside the trap').toBe(true);

  // focus restored to the trigger on close
  await page.keyboard.press('Escape');
  await expect(page.locator(CONTENT)).toHaveCount(0);
  await expect(page.locator(TRIGGER)).toBeFocused();
});

test('4: Escape closes, and closeOnEscape=false prevents it', async ({ page }) => {
  await open(page);
  await page.keyboard.press('Escape');
  await expect(page.locator(CONTENT)).toHaveCount(0);

  await page.click('#toggle-esc'); // esc -> false
  await open(page);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await expect(page.locator(CONTENT), 'closeOnEscape=false must keep it open').toBeVisible();
});

test('5: outside click closes, and closeOnInteractOutside=false prevents it', async ({ page }) => {
  // A modal dialog makes the rest of the page inert, so Playwright's
  // actionability checks correctly refuse a normal click on the backdrop —
  // dispatch the pointer sequence zag listens for instead.
  const clickOutside = () =>
    page.locator(BACKDROP).click({ position: { x: 5, y: 5 }, force: true });

  await open(page);
  await clickOutside();
  await expect(page.locator(CONTENT)).toHaveCount(0);

  await page.click('#toggle-outside'); // outside -> false
  await open(page);
  await clickOutside();
  await page.waitForTimeout(400);
  await expect(page.locator(CONTENT)).toBeVisible();
  await page.keyboard.press('Escape'); // leave the suite in a clean state
});

test('6: body scroll locked while open, restored on close', async ({ page }) => {
  const overflow = () => page.evaluate(() => getComputedStyle(document.body).overflow);
  await open(page);
  expect(await overflow()).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(page.locator(CONTENT)).toHaveCount(0);
  expect(await overflow()).not.toBe('hidden');
});

test('7: aria-labelledby resolves to the rendered title element', async ({ page }) => {
  await open(page);
  const id = await page.locator(CONTENT).getAttribute('aria-labelledby');
  expect(id).toBeTruthy();
  // zag ids contain ':' so an #id selector needs escaping; an attribute
  // selector sidesteps it (CSS.escape is a browser global, not a Node one).
  await expect(page.locator(`[id="${id}"]`)).toHaveText('Spike dialog');
});

test('8: controlled [(open)] round-trips in both directions', async ({ page }) => {
  // parent -> child
  await page.click(TRIGGER);
  await expect(page.locator(CONTENT)).toBeVisible();
  await expect(page.locator('#parent-state')).toHaveText('OPEN');

  // child -> parent (close from inside the dialog)
  await page.locator('[aria-label="Close"]').click();
  await expect(page.locator(CONTENT)).toHaveCount(0);
  await expect(page.locator('#parent-state'), 'child close must write back to parent').toHaveText(
    'CLOSED',
  );
});

test('9: exit animation holds data-state="closed" before unmount', async ({ page }) => {
  await open(page);
  await page.keyboard.press('Escape');
  // sampled immediately: the node must still exist, marked closed
  const closedSeen = await page.evaluate(async () => {
    const sel = '[data-scope="dialog"][data-part="content"]';
    for (let i = 0; i < 20; i++) {
      const el = document.querySelector(sel);
      if (el?.getAttribute('data-state') === 'closed') return true;
      if (!el) return false; // vanished without ever being marked closed
      await new Promise((r) => setTimeout(r, 15));
    }
    return false;
  });
  expect(closedSeen, 'content must render data-state="closed" during the exit').toBe(true);
  await expect(page.locator(CONTENT)).toHaveCount(0);
});

test('10 + 11: 20x open/close leaves no leaked nodes and logs no Angular errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  for (let i = 0; i < 20; i++) {
    await page.click(TRIGGER);
    await expect(page.locator(CONTENT)).toBeVisible();
    // close with Escape, not an outside button: while the modal is open the rest
    // of the page is inert, which is correct behaviour and blocks outside clicks.
    await page.keyboard.press('Escape');
    await expect(page.locator(CONTENT)).toHaveCount(0);
  }

  // NB: the trigger button legitimately carries data-scope="dialog" because it
  // holds the machine's trigger props — count only the portaled parts.
  const leaked = await page
    .locator(`${CONTENT}, ${BACKDROP}, [data-scope="dialog"][data-part="positioner"]`)
    .count();
  expect(leaked, 'no leaked portal nodes').toBe(0);
  const angularErrors = errors.filter((e) => /NG0100|NG0103|ExpressionChanged/.test(e));
  expect(angularErrors, 'no NG0100/NG0103').toEqual([]);
});

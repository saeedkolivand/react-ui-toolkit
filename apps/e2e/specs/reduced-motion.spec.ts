import { test, expect, type Page } from "@playwright/test";

/**
 * `prefers-reduced-motion` actually reducing motion.
 *
 * Every one of these blocks looked right and four of them did nothing. The
 * override selects `[data-scope][data-part]` while the animation it has to beat
 * is `[data-scope][data-part][data-state]` — one attribute more specific, in the
 * same cascade layer — so the browser kept the full-duration animation and the
 * preference was honoured nowhere.
 *
 * Nothing in the unit suites can see this: it is the cascade resolving two rules
 * against each other, which needs a real stylesheet, a real browser, and the
 * media feature actually set. Reading the CSS is how it passed review twice.
 */

/**
 * Set per page rather than through `test.use({ reducedMotion })`, which did not
 * take effect here — `matchMedia("(prefers-reduced-motion: reduce)").matches`
 * read `false` under it, so the first version of this file measured ordinary
 * unreduced durations and would have "failed correctly" for entirely the wrong
 * reason. The dialog control is what exposed it: a component whose block was
 * already right cannot fail unless the harness is broken.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true
  );
});

/** The longest animation or transition the element will actually run, in ms. */
const motionOf = (page: Page, selector: string) =>
  page.locator(selector).evaluate(node => {
    const style = getComputedStyle(node);
    const longest = (value: string) =>
      Math.max(
        ...value.split(",").map(part => parseFloat(part) * (part.includes("ms") ? 1 : 1000))
      );
    return {
      animation: longest(style.animationDuration),
      transition: longest(style.transitionDuration),
    };
  });

/** Reduced means reduced: anything a user would read as motion is gone. */
const IMPERCEPTIBLE = 16;

test("silences the tooltip's enter animation", async ({ page }) => {
  await page.goto("/anchored.html");
  await page.locator("#fits").hover();
  const content = '[data-scope="tooltip"][data-part="content"]';
  await expect(page.locator(content)).toBeVisible();
  expect((await motionOf(page, content)).animation).toBeLessThanOrEqual(IMPERCEPTIBLE);
});

test("silences the popover's enter animation", async ({ page }) => {
  await page.goto("/anchored.html");
  await page.locator("#popover-trigger").click();
  const content = '[data-scope="popover"][data-part="content"]';
  await expect(page.locator(content)).toBeVisible();
  // Popover was not named in the block at all — it is newer than the rule.
  expect((await motionOf(page, content)).animation).toBeLessThanOrEqual(IMPERCEPTIBLE);
});

test("silences the menu's enter animation", async ({ page }) => {
  await page.goto("/anchored.html");
  await page.locator("#menu-trigger").click();
  const content = '[data-scope="menu"][data-part="content"]';
  await expect(page.locator(content)).toBeVisible();
  expect((await motionOf(page, content)).animation).toBeLessThanOrEqual(IMPERCEPTIBLE);
});

test("keeps the dialog silent, which it already was", async ({ page }) => {
  await page.goto("/overlay.html");
  await page.locator("#before").click();
  const content = '[data-scope="dialog"][data-part="content"]';
  await expect(page.locator(content)).toBeVisible();
  // The control. `dialog.css` reaches every part with `!important` and has been
  // correct all along — it is the pattern the others now follow, so a change
  // that broke this would mean the fix went the wrong way.
  expect((await motionOf(page, content)).animation).toBeLessThanOrEqual(IMPERCEPTIBLE);
});

test("silences the select trigger, which the old block never named", async ({ page }) => {
  await page.goto("/");
  const trigger = '[data-scope="select"][data-part="trigger"]';
  await expect(page.locator(trigger).first()).toBeVisible();
  // Naming parts one at a time is how this was missed: the old block listed
  // `content` and `indicator`, and the trigger's own border and background
  // transition was simply never covered. Reaching every part fixes the whole
  // component rather than the parts somebody remembered.
  expect((await motionOf(page, trigger)).transition).toBeLessThanOrEqual(IMPERCEPTIBLE);
});

test("slows the button spinner rather than stopping it", async ({ page }) => {
  await page.goto("/");
  const spinner = '[data-scope="button"] [data-part="spinner"]';
  await expect(page.locator(spinner).first()).toBeVisible();
  // The deliberate exception, pinned so nobody "fixes" it to 1ms: a spinner is
  // the only thing on screen saying work is still happening, so reduced motion
  // slows it from 0.6s to 1.5s instead of removing it. `button.css` was right.
  expect((await motionOf(page, spinner)).animation).toBe(1500);
});

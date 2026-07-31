import { test, expect, type Page, type Locator } from "@playwright/test";

/**
 * Anchored overlay placement, in a real browser.
 *
 * None of this is assertable in jsdom, and not for want of trying: it reports
 * every element as a 0×0 rect at the origin, so a popup that anchored to the
 * wrong element, flipped when it should not have, or landed on top of its own
 * trigger produces byte-identical numbers to one that is placed correctly. The
 * unit suites cover which attributes and handlers exist; this covers whether the
 * result is anywhere near the trigger.
 */

/**
 * Geometry is read off the POSITIONER, never off the content.
 *
 * `applyPosition` writes the coordinates onto the positioner and nothing else,
 * and the content inside it is running `ck-overlay-in`, which is a
 * `transform: scale(.96)` — so its rect is inset by a few percent for the length
 * of the enter animation. That inset is invisible to a centred assertion, which
 * is why the first version of this file passed every "centred on its trigger"
 * check and failed only the edge-aligned one, by 3.2px.
 */
const box = async (locator: Locator) => {
  const rect = await locator.boundingBox();
  expect(rect, "element has no box").not.toBeNull();
  return rect!;
};

const positioner = (page: Page, scope: string) =>
  page.locator(`[data-scope="${scope}"][data-part="positioner"]`);
const content = (page: Page, scope: string) =>
  page.locator(`[data-scope="${scope}"][data-part="content"]`);

test.beforeEach(async ({ page }) => {
  await page.goto("/anchored.html");
});

test("places the tooltip above its trigger when there is room", async ({ page }) => {
  const trigger = page.locator("#fits");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();

  const [t, c] = [await box(trigger), await box(positioner(page, "tooltip"))];
  // Above, and actually touching: a positioner that silently returned {0,0}
  // would also be "above" a trigger 380px down the page, so the gap is bounded
  // at both ends rather than only asserted to be positive.
  expect(c.y + c.height).toBeLessThanOrEqual(t.y);
  expect(t.y - (c.y + c.height)).toBeLessThan(24);
  // Centred on the trigger, within a pixel of rounding.
  expect(Math.abs(c.x + c.width / 2 - (t.x + t.width / 2))).toBeLessThan(2);
  await expect(positioner(page, "tooltip")).toHaveAttribute("data-placement", "top");
});

test("flips to the opposite side rather than leaving the viewport", async ({ page }) => {
  const trigger = page.locator("#flip-top");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();

  // Asked for `top` two pixels from the top of the viewport, where it cannot
  // fit. `data-placement` carries the placement actually used, AFTER the flip,
  // which is what the stylesheet points the arrow with.
  await expect(positioner(page, "tooltip")).toHaveAttribute("data-placement", "bottom");
  const [t, c] = [await box(trigger), await box(positioner(page, "tooltip"))];
  expect(c.y).toBeGreaterThanOrEqual(t.y + t.height - 1);
  // Still on screen, which is the point of flipping at all.
  expect(c.y).toBeGreaterThanOrEqual(0);
});

test("escapes an ancestor with a transform", async ({ page }) => {
  const trigger = page.locator("#transformed");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();

  // A transformed ancestor becomes the containing block for `position: fixed`,
  // so a popup rendered in place would resolve its viewport coordinates against
  // that box instead. Portalling to document.body is the only fix, and it
  // cannot be enforced from core — so it is asserted here.
  const parent = await content(page, "tooltip").evaluate(
    node => node.parentElement?.parentElement?.tagName
  );
  expect(parent).toBe("BODY");

  const [t, c] = [await box(trigger), await box(positioner(page, "tooltip"))];
  expect(Math.abs(c.x + c.width / 2 - (t.x + t.width / 2))).toBeLessThan(2);
  expect(t.y - (c.y + c.height)).toBeLessThan(24);
});

test("puts the menu below its trigger and left-aligned to it", async ({ page }) => {
  await page.locator("#menu-trigger").click();
  await expect(content(page, "menu")).toBeVisible();

  const [t, c] = [await box(page.locator("#menu-trigger")), await box(positioner(page, "menu"))];
  expect(c.y).toBeGreaterThanOrEqual(t.y + t.height - 1);
  // `bottomLeft` aligns the popup's start edge with the trigger's, rather than
  // centring it — the difference between the twelve names and four.
  expect(Math.abs(c.x - t.x)).toBeLessThan(2);
});

test("keeps the popover reachable, and its controls clickable", async ({ page }) => {
  await page.locator("#popover-trigger").click();
  await expect(content(page, "popover")).toBeVisible();

  const [t, c] = [
    await box(page.locator("#popover-trigger")),
    await box(positioner(page, "popover")),
  ];
  // `right` means after the trigger on the inline axis.
  expect(c.x).toBeGreaterThanOrEqual(t.x + t.width - 1);

  // The reason a popover is a dialog rather than a tooltip: a real control
  // inside it has to receive a real press. Nothing about this is assertable
  // without layout — an element the positioner left underneath its own trigger
  // would fail here and nowhere else.
  await page.locator("#popover-button").click();
  await expect(page.locator("#popover-button")).toBeFocused();
});

test("repositions when the page scrolls under the trigger", async ({ page }) => {
  const trigger = page.locator("#fits");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();
  const before = await box(positioner(page, "tooltip"));

  // `position: fixed` coordinates are viewport-relative, so a popup that does
  // not re-measure on scroll detaches from its anchor and hangs in mid-air.
  await page.evaluate(() => window.scrollBy(0, 120));
  await expect.poll(async () => (await box(positioner(page, "tooltip"))).y).not.toBe(before.y);

  const [t, c] = [await box(trigger), await box(positioner(page, "tooltip"))];
  expect(t.y - (c.y + c.height)).toBeLessThan(24);
});

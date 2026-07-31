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

test("lets the keyboard reach what is inside the popover", async ({ page }) => {
  await page.locator("#popover-trigger").click();
  await expect(content(page, "popover")).toBeVisible();

  // Two separate bugs met here. The layer dismissed on the first `focusin`
  // outside it, which for a non-trapping dialog is the trigger itself — so Tab
  // closed it. And the popup is portalled to the end of the document, so Tab
  // order walked straight past it into the next control on the page: measured
  // `active="menu-trigger"` with the inner button never visited.
  await expect(content(page, "popover")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#popover-button")).toBeFocused();
  await expect(content(page, "popover")).toHaveCount(1);

  await page.keyboard.press("Escape");
  await expect(content(page, "popover")).toHaveCount(0);
  await expect(page.locator("#popover-trigger")).toBeFocused();
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

test("gives menu focus back to the trigger, but not over a press outside", async ({ page }) => {
  await page.locator("#menu-trigger").click();
  await expect(content(page, "menu")).toBeVisible();
  await expect(content(page, "menu")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(content(page, "menu")).toHaveCount(0);
  // Taking focus on open and dropping it on close leaves <body> focused, so the
  // next Tab restarts at the top of the page.
  await expect(page.locator("#menu-trigger")).toBeFocused();

  await page.locator("#menu-trigger").click();
  await expect(content(page, "menu")).toBeVisible();
  // The outcome, not the mechanism. No pointer path can observe the restore
  // guard: the browser assigns focus from the press AFTER the close effect has
  // run, so the trigger never keeps it either way — checked against both a
  // focusable target and empty space, with the guard neutered. What this pins
  // is that a dismissed menu does not drag focus back to its trigger, however
  // that ends up being true. The guard itself is covered where it IS decisive,
  // by the controlled-close test in `dropdown.test.tsx`.
  await page.mouse.click(960, 40);
  await expect(content(page, "menu")).toHaveCount(0);
  await expect(page.locator("#menu-trigger")).not.toBeFocused();
});

/**
 * The arrow, in both directions.
 *
 * A centred arrow is blind to mirroring — `--ck-arrow-x` is symmetric there, so
 * every "centred on its trigger" assertion above passes whether the CSS reads
 * the offset from the correct edge or the opposite one. Only a SIDE placement
 * separates them, which is what these two use.
 */
for (const dir of ["ltr", "rtl"] as const) {
  test(`points the arrow at the trigger in ${dir}`, async ({ page }) => {
    await page.evaluate(d => {
      document.documentElement.dir = d;
    }, dir);
    await page.locator("#popover-trigger").click();
    await expect(content(page, "popover")).toBeVisible();

    const pos = await box(positioner(page, "popover"));
    const arrow = await box(positioner(page, "popover").locator('[data-part="arrow"]'));
    const trigger = await box(page.locator("#popover-trigger"));

    // The arrow sits on the popup's edge that FACES the trigger. In rtl the
    // popup lands on the other side, so which edge that is flips with it —
    // computed from the measured boxes rather than hard-coded per direction.
    const triggerIsAfter = trigger.x > pos.x;
    const facingEdge = triggerIsAfter ? pos.x + pos.width : pos.x;
    const arrowCentre = arrow.x + arrow.width / 2;
    expect(Math.abs(arrowCentre - facingEdge)).toBeLessThan(2);

    // And on the trigger's side of the popup rather than the far one: reading
    // the offset from the wrong edge put this a full popup width out.
    expect(Math.abs(arrowCentre - (trigger.x + trigger.width / 2))).toBeLessThan(pos.width);
  });
}

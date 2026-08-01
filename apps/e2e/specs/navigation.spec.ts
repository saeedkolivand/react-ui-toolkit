import { test, expect, type Page } from "@playwright/test";

/** Every element's rect for one selector, rounded. */
const rects = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els =>
    els.map(el => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) };
    })
  );

test("spans a Steps connector across the gap between markers", async ({ page }) => {
  await page.goto("/navigation.html");
  const connectors = await rects(page, '#steps-row [data-part="separator"]');

  // `flex: 1 1 0` on the item and `flex: 1 1 auto` on the connector is what
  // makes the line fill whatever the title did not. A connector at zero width
  // renders as no connector at all, and jsdom cannot tell the two apart.
  expect(connectors).toHaveLength(2);
  expect(connectors.every(c => c.w > 40)).toBe(true);
});

test("gives every Steps item but the last an equal share", async ({ page }) => {
  await page.goto("/navigation.html");
  const items = await rects(page, '#steps-row [data-part="item"]');

  // The last item is `flex: none` on purpose — it has no connector to pad, so
  // an equal share would leave a gap after the final marker. The first two are
  // what have to match each other.
  expect(items[0]!.w).toBe(items[1]!.w);
  expect(items[2]!.w).toBeLessThan(items[0]!.w);
});

test("hides the connector when the steps run vertically", async ({ page }) => {
  await page.goto("/navigation.html");
  // A horizontal rule between stacked steps is a line across the layout. The
  // rule is `display: none`, which is the one thing a zero-size check would
  // not distinguish from a connector that merely collapsed.
  const visible = await page
    .locator('#steps-column [data-part="separator"]')
    .evaluateAll(els => els.filter(el => getComputedStyle(el).display !== "none").length);
  expect(visible).toBe(0);
});

test("shares the inline axis equally across a block Segmented", async ({ page }) => {
  await page.goto("/navigation.html");
  const items = await rects(page, '#segmented-block [data-part="item"]');

  expect(items).toHaveLength(3);
  // Equal to each other, and together filling the container — `flex: 1 1 0`
  // without `min-inline-size: 0` would let the longest label widen its own
  // share instead.
  expect(new Set(items.map(i => i.w)).size).toBe(1);
  const spanned = items[2]!.x + items[2]!.w - items[0]!.x;
  expect(spanned).toBeGreaterThan(560);
});

test("sizes a plain Segmented to its labels rather than its container", async ({ page }) => {
  await page.goto("/navigation.html");
  const root = await rects(page, '#segmented-plain [data-part="root"]');
  // The control for the one above: `inline-flex` shrink-wraps, so `block` is
  // doing the widening rather than the root being 100% all along.
  expect(root[0]!.w).toBeLessThan(400);
});

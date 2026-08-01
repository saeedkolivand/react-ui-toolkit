import { test, expect } from "@playwright/test";

/**
 * The one thing about Skeleton that only a real browser can answer: whether
 * `block` costs a `Node` the centring that is its entire reason to exist.
 *
 * `block` and the per-part display rules sit at the same specificity, so which
 * one wins is decided by declaration order — and the unit suite sees neither,
 * because jsdom resolves no stylesheet at all. Both `display` values are
 * present in the CSS and correct in isolation; only the cascade between them
 * is wrong.
 */
test("keeps a block Node centring its content", async ({ page }) => {
  await page.goto("/skeleton.html");
  const node = page.locator("#block-node");
  await expect(node).toBeVisible();

  const gaps = await node.evaluate(el => {
    const outer = el.getBoundingClientRect();
    const inner = el.firstElementChild!.getBoundingClientRect();
    return { start: inner.left - outer.left, end: outer.right - inner.right, width: outer.width };
  });

  // Filling the inline axis is what `block` is for, so that half must hold too
  // — a "centred" child in a shrink-wrapped box would satisfy the gaps alone.
  expect(gaps.width).toBeGreaterThan(500);
  expect(Math.abs(gaps.start - gaps.end)).toBeLessThan(2);
});

test("gives each avatar keyword its own size", async ({ page }) => {
  await page.goto("/skeleton.html");
  const avatars = page.locator('#avatar-sizes [data-part="avatar"]');
  await expect(avatars).toHaveCount(3);

  const sizes = await avatars.evaluateAll(els => els.map(el => el.getBoundingClientRect().height));

  // Measured against each other rather than against fixed numbers: a rule that
  // restates the base values leaves the keyword a silent no-op, and every
  // absolute assertion would still pass.
  expect(sizes[0]).toBeLessThan(sizes[1]!);
  expect(sizes[1]).toBeLessThan(sizes[2]!);
});

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

test("lets block win the inline axis against every keyword that sets a width", async ({ page }) => {
  await page.goto("/skeleton.html");
  const buttons = page.locator('#block-buttons [data-part="button"]');
  await expect(buttons).toHaveCount(6);

  const widths = await buttons.evaluateAll(els =>
    els.map(el => Math.round(el.getBoundingClientRect().width))
  );

  // Button is the one part whose width varies by keyword, so its own rules
  // outrank the shared `[data-block]` on specificity and `block` silently
  // applies its display while dropping the thing it is named for.
  expect(widths).toEqual([600, 600, 600, 600, 600, 600]);
});

test("keeps a circle button square at every size", async ({ page }) => {
  await page.goto("/skeleton.html");
  const circles = page.locator('#circle-buttons [data-part="button"]');
  await expect(circles).toHaveCount(3);

  const boxes = await circles.evaluateAll(els =>
    els.map(el => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    })
  );

  // `aspect-ratio` replaced one width rule per size, which is what keeps every
  // button width rule at three attributes. Squareness is what it bought that
  // with, and the heights still have to differ or the sizes stopped working.
  expect(boxes.map(b => b.w)).toEqual(boxes.map(b => b.h));
  expect(boxes[0]!.h).toBeLessThan(boxes[1]!.h);
  expect(boxes[1]!.h).toBeLessThan(boxes[2]!.h);
});

test("keeps a circle button round in every container it can land in", async ({ page }) => {
  await page.goto("/skeleton.html");
  const ids = [
    "circle-flex-column",
    "circle-flex-row",
    "circle-grid",
    "circle-block",
    "circle-space",
  ];

  const boxes = await page.locator("#circle-contexts").evaluate((root, names) => {
    const read = (id: string) => {
      const r = root.querySelector(`#${id}`)!.getBoundingClientRect();
      return { id, w: Math.round(r.width), h: Math.round(r.height) };
    };
    return [...names.map(read), read("circle-numeric")];
  }, ids);

  // A flex column stretches a cross size that is `auto`, and an aspect ratio
  // does not stop it — so the container the circle sits in decides whether it
  // is still a circle. `<Flex vertical>` ships in this same library and
  // defaults to `align-items: stretch`, which makes this reachable.
  expect(boxes.filter(b => b.id !== "circle-numeric").map(b => `${b.w}x${b.h}`)).toEqual(
    ids.map(() => "32x32")
  );
  expect(`${boxes[5]!.w}x${boxes[5]!.h}`).toBe("48x48");
});

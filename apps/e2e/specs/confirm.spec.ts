import { test, expect, type Page } from "@playwright/test";

/**
 * Popconfirm and Notification, in the browser.
 *
 * Both are things jsdom reports as 0×0 at the origin: a portalled overlay with
 * `position: fixed` coordinates, and a group pinned to a viewport corner that
 * lets pointer events through. The unit suites cover what each component does;
 * this covers where it lands.
 */

/**
 * Waits until nothing on the page is still animating.
 *
 * Everything here enters with an animation that MOVES THE BOX — a popup scales
 * from 0.96, a toast slides in from half a rem — and `getBoundingClientRect`
 * reports the transformed box, not the laid-out one. Measured a frame after
 * opening, a 130.6px column reads as 125.4px, and a scale about a centre moves
 * each edge by a different amount: the alignment assertions below drifted by
 * 1.01px, just over their tolerance, in the two cases where the box happened to
 * be widest. Which looked exactly like a real off-by-a-pixel bug.
 */
const settle = (page: Page) =>
  page.waitForFunction(() =>
    document.getAnimations().every(a => a.playState === "finished" || a.playState === "idle")
  );

const box = (page: Page, selector: string) =>
  page.locator(selector).evaluate(el => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
  });

/**
 * Where the TEXT is, not where its box is.
 *
 * `getBoundingClientRect` returns the border box, and a stretched flex item's
 * border box does not move when padding is added to it — so an alignment
 * assertion written against border boxes is invariant to the one thing an
 * alignment bug is usually made of. Adding `padding-inline-start: 1.5rem` to the
 * detail, which is exactly the shape of the bug this component avoided by
 * putting both in one column, left every assertion here green.
 */
const textBox = (page: Page, selector: string) =>
  page.locator(selector).evaluate(el => {
    const range = el.ownerDocument.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
  });

/**
 * Loads the harness and sets `<html dir>`.
 *
 * On the document, not on the element the trigger sits in: every popup here is
 * portalled to `document.body`, so a `dir` further down the page never reaches
 * the thing being measured.
 *
 * After navigation rather than through `addInitScript`. An init script runs
 * before the parser has created `<html>`, so `document.documentElement` is null
 * and the assignment throws — silently, since a failed init script does not
 * fail the navigation. Every "rtl" case here was measuring an LTR page, and
 * three of them still passed. Nothing is open at this point, so the direction is
 * in place before any popup is positioned.
 */
const open = async (page: Page, dir: "ltr" | "rtl") => {
  await page.goto("/confirm.html");
  await page.evaluate(d => {
    document.documentElement.dir = d;
  }, dir);
  await expect(page.locator("html")).toHaveAttribute("dir", dir);
};

/**
 * Opens one of the confirms and waits for it.
 *
 * The harness leaves them closed: a popup open on load is a fixed layer across
 * the page, and it swallowed the clicks the notification tests need.
 */
const confirm = async (page: Page, id: string) => {
  await page.locator(`#${id}-trigger`).click();
  await expect(page.locator(`#${id}`)).toBeVisible();
  await settle(page);
};

/**
 * A part BY SCOPE.
 *
 * `#with-icon [data-part="title"]` matches two elements — the popover's title
 * part and the popconfirm's, one inside the other, which is exactly the nesting
 * the component sets up on purpose. Only the scope tells them apart.
 */
const part = (id: string, name: string) => `#${id} [data-scope="popconfirm"][data-part="${name}"]`;

for (const dir of ["ltr", "rtl"] as const) {
  for (const id of ["with-icon", "without-icon"] as const) {
    test(`aligns the question and its detail, ${dir}, ${id}`, async ({ page }) => {
      await open(page, dir);
      await confirm(page, id);
      const title = await textBox(page, part(id, "title"));
      const description = await textBox(page, part(id, "description"));

      // The two share a column beside the symbol, so their leading edges are the
      // same number by construction — no indent constant to keep in step with
      // the symbol's width, and nothing left behind when `icon={false}` takes
      // the symbol away. Which edge is "leading" is the whole reason this runs
      // in both directions.
      const edge = dir === "rtl" ? "right" : "left";
      expect(Math.abs(title[edge] - description[edge])).toBeLessThanOrEqual(1);

      // And genuinely indented past the symbol when there is one, so the
      // assertion above cannot pass by both being flush against the box.
      const header = await box(page, part(id, "header"));
      const inset = Math.abs(title[edge] - header[edge]);
      if (id === "with-icon") expect(inset).toBeGreaterThan(16);
      else expect(inset).toBeLessThanOrEqual(1);
    });
  }

  test(`puts the buttons on the trailing edge, ${dir}`, async ({ page }) => {
    await open(page, dir);
    await confirm(page, "with-icon");
    const actions = await box(page, part("with-icon", "actions"));
    const buttons = await page
      .locator(`${part("with-icon", "actions")} [data-scope="button"]`)
      .evaluateAll(els => els.map(el => el.getBoundingClientRect()));
    expect(buttons).toHaveLength(2);

    // `justify-content: flex-end` follows the writing direction, which is the
    // reason there is no `:dir(rtl)` twin for this rule — so the claim is that
    // the row hugs the trailing edge, and trailing is not the same side twice.
    const trailing = dir === "rtl" ? "left" : "right";
    const outermost =
      dir === "rtl"
        ? Math.min(...buttons.map(b => b.left))
        : Math.max(...buttons.map(b => b.right));
    expect(Math.abs(outermost - actions[trailing])).toBeLessThanOrEqual(1);
  });
}

test("keeps the detail at normal weight inside a bold popover title", async ({ page }) => {
  await open(page, "ltr");
  await confirm(page, "with-icon");
  const weights = await page.evaluate(() => {
    const read = (selector: string) =>
      getComputedStyle(document.querySelector(selector)!).fontWeight;
    return {
      title: read('#with-icon [data-scope="popconfirm"][data-part="title"]'),
      description: read('#with-icon [data-scope="popconfirm"][data-part="description"]'),
    };
  });
  // The header sits inside the popover's own `title` part, which is 600 — so
  // the detail is bold unless it says otherwise, and inheritance is invisible
  // to every assertion in the unit suite.
  expect(weights.title).toBe("600");
  expect(weights.description).toBe("400");
});

test("anchors to its trigger from inside a transformed ancestor", async ({ page }) => {
  await open(page, "ltr");
  await page.locator("#anchored-trigger").click();
  await expect(page.locator("#anchored")).toBeVisible();
  await settle(page);

  const trigger = await box(page, "#anchored-trigger");
  const popup = await box(page, "#anchored");

  // A `transform` on any ancestor captures a `position: fixed` descendant as its
  // containing block, so a popup that is not portalled to `document.body` lands
  // offset by however far that ancestor sits from the viewport origin — here
  // 80px of inline margin. Centres, because the popup is wider than the button.
  const centre = (b: { left: number; right: number }) => (b.left + b.right) / 2;
  expect(Math.abs(centre(popup) - centre(trigger))).toBeLessThanOrEqual(2);
  // Above it, and touching: the default placement is `top` with an 8px offset.
  expect(trigger.top - popup.bottom).toBeGreaterThan(0);
  expect(trigger.top - popup.bottom).toBeLessThan(24);
});

test("pins the notification group to its corner", async ({ page }) => {
  await open(page, "ltr");
  await page.locator("#notify").click();
  await expect(page.locator('[data-scope="notification"][data-part="root"]')).toHaveCount(1);
  await settle(page);

  const viewport = page.viewportSize()!;
  const card = await box(page, '[data-scope="notification"][data-part="root"]');
  // `top-end`, so against the top and the trailing edge — the group's own
  // placement rules are shared with the toast scope through `:is()`, and a
  // notification part left on the wrong scope would take none of them.
  expect(card.top).toBeLessThan(64);
  expect(viewport.width - card.right).toBeLessThan(64);
  expect(card.width).toBeGreaterThan(200);
});

test("lets a click through the notification group to the page under it", async ({ page }) => {
  await open(page, "ltr");
  await page.locator("#notify").click();
  await expect(page.locator('[data-scope="notification"][data-part="root"]')).toHaveCount(1);

  // The group spans the edge it is pinned to, so without `pointer-events: none`
  // it swallows every click in that band. The button is fixed in the same
  // corner, deliberately under the group.
  const under = page.locator("#underneath");
  await under.click({ position: { x: 10, y: 10 } });
  await expect(under).toHaveAttribute("data-clicked", "1");
});

test("hands the grid row to the notification's own symbol and nothing else", async ({ page }) => {
  await open(page, "ltr");
  await page.locator("#notify-nested").click();
  await expect(page.locator("#stowaway")).toBeVisible();

  const rows = await page.evaluate(() => {
    const read = (el: Element | null) => (el ? getComputedStyle(el).gridRow : "missing");
    return {
      own: read(
        document.querySelector('[data-scope="notification"][data-part="root"] > [data-part="icon"]')
      ),
      stowaway: read(document.querySelector("#stowaway")),
    };
  });

  // The rule has to be a descendant selector, because the symbol is a stamped
  // `<Icon data-part="icon">` that keeps `data-scope="icon"` — so no compound
  // selector of ours reaches it. A CHILD of the root rather than any
  // descendant, though: anything a consumer puts in a title or a description
  // that happens to call itself `icon` was being handed a row in a grid it is
  // not a child of.
  expect(rows.own).toContain("span 2");
  expect(rows.stowaway).not.toContain("span 2");
});

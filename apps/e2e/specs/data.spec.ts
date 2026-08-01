import { test, expect, type Page } from "@playwright/test";

const boxes = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els =>
    els.map(el => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) };
    })
  );

test("keeps a List's row rules off the Pagination it renders inside itself", async ({ page }) => {
  await page.goto("/data.html");

  const read = (selector: string) =>
    page
      .locator(selector)
      .evaluateAll(els => els.map(el => getComputedStyle(el).paddingBlockStart));

  const buttons = await read('#list-with-pagination [data-scope="pagination"] [data-part="item"]');
  const rows = await read('#list-with-pagination [data-part="list"] > [data-part="item"]');

  // Measured against the rows rather than against a number. `[data-scope="list"]
  // [data-part="item"]` reaches every page button, because Pagination has an
  // `item` part too — so the buttons took the row padding. Asserting `0px`
  // would have been wrong for a different reason: a bare `<button>` carries
  // 1px of UA padding, which is not ours and not the leak.
  expect(buttons.length).toBeGreaterThan(0);
  expect(rows.length).toBeGreaterThan(0);
  expect(buttons.every(value => value !== rows[0])).toBe(true);
});

test("keeps a List's rows padded, which is the rule that leaked", async ({ page }) => {
  await page.goto("/data.html");
  // The control: the same declaration still has to reach the rows it is for,
  // or the fix would pass by styling nothing at all.
  const padding = await page
    .locator('#list-with-pagination [data-part="list"] > [data-part="item"]')
    .evaluateAll(els => els.map(el => getComputedStyle(el).paddingBlockStart));
  expect(padding).toHaveLength(3);
  expect(new Set(padding)).not.toEqual(new Set(["0px"]));
});

test("covers the whole row with a full-width Descriptions span", async ({ page }) => {
  await page.goto("/data.html");
  const contents = await boxes(page, '#descriptions-horizontal [data-part="content"]');
  const labels = await boxes(page, '#descriptions-horizontal [data-part="label"]');

  // The spanning item's content has to reach the right edge of the last column
  // — `width * 2` instead of `width * 2 - 1` overshoots the grid and pushes a
  // track out, which is arithmetic no unit test can check against a real grid.
  const lastRowEnd = contents[3]!.x + contents[3]!.w;
  const firstRowEnd = contents[2]!.x + contents[2]!.w;
  expect(Math.abs(lastRowEnd - firstRowEnd)).toBeLessThan(2);
  // And it starts after its own label rather than under it.
  expect(contents[3]!.x).toBeGreaterThan(labels[3]!.x);
});

test("stacks label above content in a vertical Descriptions", async ({ page }) => {
  await page.goto("/data.html");
  const labels = await page
    .locator('#descriptions-vertical [data-part="label"]')
    .evaluateAll(els => els.map(el => el.getBoundingClientRect()));
  const contents = await page
    .locator('#descriptions-vertical [data-part="content"]')
    .evaluateAll(els => els.map(el => el.getBoundingClientRect()));

  // Stacked, not side by side: the content sits *below* its label rather than
  // beside it, which is what makes a vertical span count in items rather than
  // in grid tracks. Comparing block positions, since a `dd` carries a default
  // inline margin that makes the two starts differ by a few pixels.
  expect(contents[0]!.top).toBeGreaterThanOrEqual(labels[0]!.bottom);
});

test("gives the pagination window a stable width as pages change", async ({ page }) => {
  await page.goto("/data.html");
  const items = await boxes(page, '#pagination-plain [data-part="item"]');
  // `min-inline-size` is what holds this, not the `tabular-nums` beside it —
  // removing the tabular figures changes nothing at these page counts, since
  // "1" and "20" both fit inside 2rem either way. The figures start mattering
  // past three digits; this assertion does not reach that far and should not
  // claim to.
  expect(new Set(items.map(i => i.w)).size).toBe(1);
});

test("keeps the size changer to its own width inside the pagination bar", async ({ page }) => {
  await page.goto("/data.html");
  const bar = await boxes(page, '#pagination-extras [data-part="root"]');
  const changer = await boxes(page, '#pagination-extras [data-part="size-changer"]');

  // `Select` defaults to `fullWidth` and the wrapper has no rule of its own, so
  // whether it stretches across the bar is decided by another component's CSS.
  // Measured against the bar rather than a number, since the bar is as wide as
  // its container.
  expect(changer[0]!.w).toBeGreaterThan(0);
  expect(changer[0]!.w).toBeLessThan(bar[0]!.w / 2);
});

test("keeps a Descriptions label rule off a control inside a value", async ({ page }) => {
  await page.goto("/data.html");
  const checkbox = page.locator('#descriptions-with-control [data-scope="checkbox"]');
  await expect(checkbox).toHaveCount(1);

  const colon = await page
    .locator('#descriptions-with-control [data-scope="checkbox"] [data-part="label"]')
    .evaluate(el => getComputedStyle(el, "::after").content);

  // `[data-scope="descriptions"] [data-part="label"]` reaches every nested
  // component that has a `label` part, and `children` is an arbitrary node —
  // so a Checkbox in a value gets the muted label colour and the `[data-colon]`
  // pseudo-element, reading "Active:" and putting that colon in the accessible
  // name. Chromium does; jsdom resolves no stylesheet and sees none of it.
  expect(colon).toBe("none");
  // On the control, not the wrapper: a name is a property of the thing with the
  // role, and the wrapper div has neither.
  await expect(page.getByRole("checkbox")).toHaveAccessibleName("Active");
});

test("leaves a nested component's own parts alone inside a Descriptions value", async ({
  page,
}) => {
  await page.goto("/data.html");
  await expect(page.locator('#nested-controls [data-scope="breadcrumb"]')).toHaveCount(1);
  await expect(page.locator('#loose-controls [data-scope="breadcrumb"]')).toHaveCount(1);

  const read = (root: string, selector: string, props: string[]) =>
    page.locator(`${root} ${selector}`).evaluate((el, names) => {
      const style = getComputedStyle(el);
      return names.map(name => style.getPropertyValue(name)).join("|");
    }, props);

  // Measured against the identical component outside, not against a constant:
  // `list` and `title` are part names nine other components already use, and
  // `data.css` is imported last, so at equal specificity Descriptions wins
  // every collision. A Breadcrumb in a value stopped being a flex row.
  const inside = await read("#nested-controls", '[data-scope="breadcrumb"] [data-part="list"]', [
    "display",
    "grid-template-columns",
  ]);
  const outside = await read("#loose-controls", '[data-scope="breadcrumb"] [data-part="list"]', [
    "display",
    "grid-template-columns",
  ]);
  expect(inside).toBe(outside);

  const statIn = await read("#nested-controls", '[data-scope="statistic"] [data-part="title"]', [
    "font-size",
    "font-weight",
    "color",
  ]);
  const statOut = await read("#loose-controls", '[data-scope="statistic"] [data-part="title"]', [
    "font-size",
    "font-weight",
    "color",
  ]);
  expect(statIn).toBe(statOut);
});

test("leaves no gap where a hidden pagination bar would have been", async ({ page }) => {
  await page.goto("/data.html");
  const wrapper = page.locator('#list-single-page [data-part="pagination"]');
  await expect(wrapper).toHaveCount(1);

  // `hideOnSinglePage` is the one prop whose whole job is to remove the bar,
  // and `Pagination` honours it by returning null — so an unconditional
  // wrapper keeps its own padding and the prop removes the bar but not the
  // space. jsdom measures 0 either way.
  const height = await wrapper.evaluate(el => Math.round(el.getBoundingClientRect().height));
  expect(height).toBe(0);
});

test("keeps Descriptions extra at the trailing edge with or without a title", async ({ page }) => {
  await page.goto("/data.html");
  const alone = page.locator('#extra-alone [data-part="extra"]');
  const both = page.locator('#extra-both [data-part="extra"]');
  await expect(alone).toHaveCount(1);
  await expect(both).toHaveCount(1);

  const right = (locator: typeof alone) =>
    locator.evaluate(el => Math.round(el.getBoundingClientRect().right));

  // `space-between` puts the gap *between* two children; with one child it is
  // `flex-start`, so the same `extra` jumps end to end depending on whether an
  // unrelated prop is set. Compared against each other, since both containers
  // are the same width and neither position is a number worth hard-coding.
  expect(await right(alone)).toBe(await right(both));
});

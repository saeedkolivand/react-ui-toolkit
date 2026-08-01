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

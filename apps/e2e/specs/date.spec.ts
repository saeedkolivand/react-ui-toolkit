import { test, expect, type Page } from "@playwright/test";

/**
 * Calendar and DatePicker, in the browser.
 *
 * The unit suite covers the arithmetic and the keyboard. What it cannot see is
 * which way the grid runs — a table's column order is layout, and jsdom has
 * none — nor a mirror applied by `transform`, which leaves nothing in the DOM to
 * assert against.
 */

const settle = (page: Page) =>
  page.waitForFunction(() =>
    document.getAnimations().every(a => a.playState === "finished" || a.playState === "idle")
  );

const boxes = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els =>
    els.map(el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    })
  );

const open = async (page: Page, dir: "ltr" | "rtl") => {
  await page.goto("/date.html");
  // After navigation, not through `addInitScript`: an init script runs before
  // the parser has created `<html>`, so the assignment throws and every "rtl"
  // case silently measures an LTR page.
  await page.evaluate(d => {
    document.documentElement.dir = d;
  }, dir);
  await expect(page.locator("html")).toHaveAttribute("dir", dir);
};

for (const dir of ["ltr", "rtl"] as const) {
  test(`runs the week across the page in reading order, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const week = await boxes(page, "#cal tbody tr:first-child td");
    expect(week).toHaveLength(7);

    // The grid is a table, so its column order follows the document direction
    // with no rule of our own — which is exactly the kind of claim that is free
    // when it is right and invisible when it is not.
    const positions = week.map(cell => cell.left);
    const sorted = [...positions].sort((a, b) => a - b);
    expect(positions).toEqual(dir === "rtl" ? [...sorted].reverse() : sorted);
  });

  test(`puts each weekday name over its own column, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const headers = await boxes(page, "#cal thead th");
    const cells = await boxes(page, "#cal tbody tr:first-child td");

    // `getWeekdayNames` rotates by `weekStartsOn` and `getMonthGrid` starts the
    // grid on the same day. If the two ever disagree the calendar still looks
    // like a calendar — every date is simply under the wrong name.
    for (let index = 0; index < 7; index++) {
      expect(Math.abs(headers[index]!.left - cells[index]!.left)).toBeLessThanOrEqual(1);
    }
  });

  test(`points the paging arrows the way the page reads, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const flipped = await page
      .locator('#cal [data-part="prev-month"] svg')
      .evaluate(el => getComputedStyle(el).scale);

    // Mirrored by a transform on the whole header rather than by each button
    // choosing a different icon — one place to be wrong instead of four, and
    // nothing in the DOM differs between the two directions.
    expect(flipped).toBe(dir === "rtl" ? "-1 1" : "none");
  });
}

test("anchors the panel to its field from inside a transformed ancestor", async ({ page }) => {
  await open(page, "ltr");
  await page.locator('#transformed [data-part="input"]').click();
  await expect(page.locator('[data-scope="date-picker"][data-part="content"]')).toBeVisible();
  await settle(page);

  const [field] = await boxes(page, '#transformed [data-part="input"]');
  const [panel] = await boxes(page, '[data-scope="date-picker"][data-part="content"]');

  // `transform` on the ancestor captures a `position: fixed` descendant as its
  // containing block, so a panel that skipped the portal would land 80px out.
  expect(Math.abs(panel!.left - field!.left)).toBeLessThan(24);
  // Below the field, and close to it: the placement is `bottomLeft`, offset 8.
  expect(panel!.top - field!.bottom).toBeGreaterThan(0);
  expect(panel!.top - field!.bottom).toBeLessThan(24);
});

test("gives every column the same width under uneven weekday names", async ({ page }) => {
  await open(page, "ltr");
  const cells = await boxes(page, "#uneven tbody tr:first-child td");
  const widths = cells.map(cell => cell.right - cell.left);

  // Measured under hi-IN, whose short weekday names are not all the same width
  // — every name comes from `Intl`, so this is not a width anyone here gets to
  // choose, and it is the hardest case available.
  //
  // This pins the rendered result, not any one rule. A `table-layout: fixed`
  // was written for it and then deleted: no mutation could make this fail with
  // the property gone, nor with the day button's own `inline-size` gone, in
  // either locale. Whatever holds the columns even, it is not that — so the
  // property was dead code dressed as a guarantee, and this comment is here so
  // nobody re-adds it believing this test covers it.
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
});

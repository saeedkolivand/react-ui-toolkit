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

/** The two month panels, which live in the portal rather than under `#range`. */
const RANGE_PANELS =
  '[data-scope="range-picker"][data-part="panels"] [data-scope="calendar"][data-part="root"]';

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

test("gives a blocked day no hover background", async ({ page }) => {
  await open(page, "ltr");
  const day = page.locator('#blocked [data-part="day"]').first();
  await expect(day).toHaveAttribute("data-disabled", "");

  const before = await day.evaluate(el => getComputedStyle(el).backgroundColor);
  await day.hover();
  const after = await day.evaluate(el => getComputedStyle(el).backgroundColor);

  // A real hover, because `:hover` is pointer state rather than an event — a
  // dispatched `mouseover` leaves it unmatched, so a probe built that way
  // reports "no background" whether the rule is guarded or not.
  //
  // The guard has to key on `[data-disabled]`, not `:not(:disabled)`: these
  // cells carry `aria-disabled` on purpose, so a `:disabled` guard is always
  // true and a blocked day lit up under its own `cursor: not-allowed`.
  expect(after).toBe(before);
});

for (const dir of ["ltr", "rtl"] as const) {
  test(`puts the earlier month first in reading order, ${dir}`, async ({ page }) => {
    await open(page, dir);
    // NOT scoped to `#range`: the panel is portalled to `document.body`, so a
    // selector rooted at the trigger matches nothing. The separator below IS
    // inside it, because that sits in the trigger wrapper.
    const panels = await boxes(page, RANGE_PANELS);
    expect(panels).toHaveLength(2);

    // The two months are a flex row, so which one leads follows the document
    // direction with no rule of ours — and a range panel that showed April
    // before March would read as going backwards in time.
    if (dir === "rtl") expect(panels[0]!.left).toBeGreaterThan(panels[1]!.left);
    else expect(panels[0]!.left).toBeLessThan(panels[1]!.left);
  });

  test(`points the range separator along the reading direction, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const flipped = await page
      .locator('#range [data-part="separator"]')
      .evaluate(el => getComputedStyle(el).scale);
    // A shape, not a word: it says "from here to there", and in RTL there is on
    // the other side.
    expect(flipped).toBe(dir === "rtl" ? "-1 1" : "none");
  });
}

test("paints the span between the two ends and not the ends themselves", async ({ page }) => {
  await open(page, "ltr");
  const [selected] = await page
    .locator(`${RANGE_PANELS} [data-part="day"][data-selected]`)
    .evaluateAll(els => [els.map(el => getComputedStyle(el).backgroundColor)]);
  const [between] = await page
    .locator(`${RANGE_PANELS} [data-part="day"][data-in-range]`)
    .evaluateAll(els => [els.map(el => getComputedStyle(el).backgroundColor)]);

  expect(selected!.length).toBeGreaterThan(0);
  expect(between!.length).toBeGreaterThan(0);
  // Two different fills, and no day carrying both — `in-range` is strictly
  // between, so an end painting as both would take whichever rule came last.
  expect(new Set(selected).size).toBe(1);
  expect(new Set(between).size).toBe(1);
  expect(selected![0]).not.toBe(between![0]);
});

test("keeps a day's own fill under the pointer", async ({ page }) => {
  await open(page, "ltr");
  const read = (locator: ReturnType<Page["locator"]>) =>
    locator.evaluate(el => getComputedStyle(el).backgroundColor);

  for (const state of ["data-in-range", "data-selected"]) {
    const day = page.locator(`${RANGE_PANELS} [data-part="day"][${state}]`).first();
    const before = await read(day);
    await day.hover();
    const after = await read(day);

    // A real hover, because `:hover` is pointer state rather than an event.
    // The hover rule was one attribute heavier than the state rules, so it
    // repainted them — and the day under the cursor mid-pick IS the tentative
    // end, so the span looked like it stopped one day short of the pointer for
    // the entire gesture. The existing fill test cannot see it: it reads the
    // colours with nothing hovered.
    expect(after).toBe(before);
  }
});

const openTime = async (page: Page) => {
  await page.locator('#time [data-part="input"]').click();
  await expect(page.locator('[data-scope="time-picker"][data-part="content"]')).toBeVisible();
  await settle(page);
};

test("scrolls each time column inside a bounded panel", async ({ page }) => {
  await open(page, "ltr");
  await openTime(page);

  const columns = await page
    .locator('[data-scope="time-picker"][data-part="column"]')
    .evaluateAll(els =>
      els.map(el => ({
        name: el.getAttribute("aria-label"),
        height: Math.round(el.getBoundingClientRect().height),
        scrollable: el.scrollHeight > el.clientHeight,
      }))
    );
  // Four, not three: the harness sets no locale, so it inherits en-US and gets
  // a day-period column alongside hour, minute and second.
  expect(columns.map(c => c.name)).toEqual(["hour", "minute", "second", "period"]);

  // Every column the same bounded height — including the two-entry period one,
  // or the panel's own height would depend on which columns it happens to show.
  expect(new Set(columns.map(c => c.height)).size).toBe(1);
  // And the long ones scroll their own contents. Without the bound, a 60-entry
  // minute column makes the panel taller than the viewport and the footer —
  // Now and OK — is unreachable.
  expect(columns.filter(c => c.scrollable).map(c => c.name)).toEqual(["hour", "minute", "second"]);

  const footer = await boxes(page, '[data-scope="time-picker"][data-part="footer"]');
  const box = await boxes(page, '[data-scope="time-picker"][data-part="content"]');
  expect(footer[0]!.bottom).toBeLessThanOrEqual(box[0]!.bottom + 1);
  expect(box[0]!.bottom - box[0]!.top).toBeLessThan(page.viewportSize()!.height);
});

test("keeps the chosen time entry's own fill under the pointer", async ({ page }) => {
  await open(page, "ltr");
  await openTime(page);
  const chosen = page
    .locator('[data-scope="time-picker"][data-part="option"][data-selected]')
    .first();
  const read = () => chosen.evaluate(el => getComputedStyle(el).backgroundColor);

  const before = await read();
  await chosen.hover();
  // The same specificity trap the calendar's day cells hit: `[data-selected]`
  // is one attribute lighter than a `:hover` that also names the part.
  expect(await read()).toBe(before);
});

test("scrolls the chosen entry into view, and keeps focus visible under the arrows", async ({
  page,
}) => {
  await open(page, "ltr");
  await openTime(page);

  // EVERY match, not `.first()`. The first selected option is the hour, and in
  // this locale 14:30 shows as "02" — two entries down, visible at
  // `scrollTop: 0` whether anything scrolled or not. The minute, at index 30,
  // is the one that needs bringing in, so an assertion on the first alone is
  // invariant to the thing it tests.
  const visible = (selector: string) =>
    page.locator(selector).evaluateAll(els =>
      els.map(el => {
        const column = el.closest('[data-part="column"]')!.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        return box.top >= column.top - 1 && box.bottom <= column.bottom + 1;
      })
    );

  // The columns are bounded with their own scroller, so a value past the first
  // few entries opens off-screen unless something brings it in.
  const opened = await visible('[data-part="option"][data-selected]');
  expect(opened.length).toBeGreaterThanOrEqual(3);
  expect(opened.every(Boolean)).toBe(true);

  await page.locator('[data-part="option"][data-selected]').first().focus();
  for (let press = 0; press < 8; press++) await page.keyboard.press("ArrowDown");

  // And `preventScroll` on the arrow handler moved focus to an entry nobody
  // could see — the browser's own Tab scrolls here, so the arrows have to match
  // it. Right on DatePicker, whose grid never scrolls; wrong here.
  expect((await visible('[data-part="option"]:focus')).every(Boolean)).toBe(true);
});

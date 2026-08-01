import { test, expect, type Page } from "@playwright/test";

/**
 * Form layout, in the browser.
 *
 * The unit suite covers what a form DOES — binding, validation, lists. What it
 * cannot see is where anything lands: jsdom reports every rect as 0×0, has no
 * grid and no generated content, so the horizontal layout's shared label column
 * and the required marker are both invisible to it.
 */

const boxes = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els =>
    els.map(el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
    })
  );

const open = async (page: Page, dir: "ltr" | "rtl") => {
  await page.goto("/form.html");
  // On the document, and after navigation: an init script runs before the
  // parser has created `<html>`, so the assignment throws and every "rtl" case
  // silently measures an LTR page.
  await page.evaluate(d => {
    document.documentElement.dir = d;
  }, dir);
  await expect(page.locator("html")).toHaveAttribute("dir", dir);
};

const part = (form: string, name: string) => `#${form} [data-scope="form"][data-part="${name}"]`;

for (const dir of ["ltr", "rtl"] as const) {
  test(`gives every horizontal row the same control column, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const controls = await boxes(page, part("horizontal", "control"));
    expect(controls).toHaveLength(4);

    // `subgrid` is the whole mechanism: each item is its own grid, but it
    // inherits the form's tracks rather than sizing its own. Without it every
    // row sizes its label independently and the controls step down the page by
    // the difference — which is what a per-row `grid-template-columns: auto 1fr`
    // does, and it looks almost right until one label is long.
    const edge = dir === "rtl" ? "right" : "left";
    const starts = controls.map(control => control[edge]);
    expect(Math.max(...starts) - Math.min(...starts)).toBeLessThanOrEqual(1);

    // Including the row with no label, which has to be told to occupy column 2
    // rather than starting where the labels do.
    const labels = await boxes(page, part("horizontal", "label"));
    expect(labels).toHaveLength(3);
    const labelEnd =
      dir === "rtl"
        ? Math.min(...labels.map(label => label.left))
        : Math.max(...labels.map(label => label.right));
    // The column is as wide as the widest label, and the controls clear it.
    expect(Math.abs(starts[0]! - labelEnd)).toBeLessThan(24);
  });

  test(`puts the label column on the leading side, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const [label] = await boxes(page, part("horizontal", "label"));
    const [control] = await boxes(page, part("horizontal", "control"));

    // The layout is written in logical properties and grid order, with no
    // `:dir(rtl)` rule anywhere — so this is the assertion that the claim is
    // real rather than that LTR happens to look right.
    if (dir === "rtl") expect(label!.left).toBeGreaterThanOrEqual(control!.right - 1);
    else expect(label!.right).toBeLessThanOrEqual(control!.left + 1);
  });

  test(`marks a required label and leaves an optional one alone, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const markers = await page.evaluate(() => {
      const after = (selector: string) =>
        getComputedStyle(document.querySelector(selector)!, "::after");
      const required = after('#vertical [data-part="item"][data-required] > [data-part="label"]');
      const optional = after(
        '#vertical [data-part="item"]:not([data-required]) > [data-part="label"]'
      );
      return {
        content: required.content,
        margin: required.marginInlineStart,
        optional: optional.content,
      };
    });

    // Generated content, so there is no node and nothing in the DOM to assert
    // against — `getComputedStyle(el, "::after")` is the only way to see it at
    // all, in any environment.
    expect(markers.content).toBe('"*"');
    // Logical, so it trails the text in both directions rather than needing a
    // mirror. A `margin-left` here would put it in front of the word in RTL.
    expect(markers.margin).not.toBe("0px");
    // And keyed on the attribute, so an optional field grows nothing. `"false"`
    // matches `[data-required]`, which is why the attribute is presence-only.
    expect(markers.optional).toBe("none");
  });
}

test("lays an inline form out on one row", async ({ page }) => {
  await open(page, "ltr");
  const items = await boxes(page, part("inline", "item"));
  expect(items.length).toBeGreaterThanOrEqual(2);

  // Same row, so their vertical spans overlap. And no bottom margin, which is
  // what the vertical default has and what would otherwise leave a gap under a
  // toolbar-shaped form.
  expect(items[0]!.top).toBeCloseTo(items[1]!.top, 0);
  const margin = await page
    .locator(part("inline", "item"))
    .first()
    .evaluate(el => getComputedStyle(el).marginBlockEnd);
  expect(margin).toBe("0px");
});

test("stacks a vertical form's label above its control", async ({ page }) => {
  await open(page, "ltr");
  const [label] = await boxes(page, `${part("vertical", "label")}`);
  const [control] = await boxes(page, `${part("vertical", "control")}`);
  expect(label!.bottom).toBeLessThanOrEqual(control!.top + 1);
});

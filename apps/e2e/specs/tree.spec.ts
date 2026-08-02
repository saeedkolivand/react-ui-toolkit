import { test, expect, type Page } from "@playwright/test";

/**
 * Tree, in the browser.
 *
 * The unit suite covers flattening, checking and the keyboard. What it cannot
 * see is the indent — a custom property fed to a logical padding, so which edge
 * a nested row is pushed from is layout — nor the expander's chevron, which is
 * rotated and mirrored by transform with no DOM difference to assert against.
 */

const boxes = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els =>
    els.map(el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    })
  );

/**
 * Waits until nothing is still animating.
 *
 * The expander's chevron TRANSITIONS between its two rotations, and the
 * stylesheet arrives after the first paint — so a read taken straight after
 * load catches it partway, at `20.0671deg` rather than at either end. Reading a
 * transitioning property without waiting is the same instrument mistake as
 * measuring a popup mid-`scale`.
 */
const settle = (page: Page) =>
  page.waitForFunction(() =>
    document.getAnimations().every(a => a.playState === "finished" || a.playState === "idle")
  );

const open = async (page: Page, dir: "ltr" | "rtl") => {
  await page.goto("/tree.html");
  // After navigation, not through `addInitScript`: an init script runs before
  // the parser has created `<html>`, so the assignment throws silently.
  await page.evaluate(d => {
    document.documentElement.dir = d;
  }, dir);
  await expect(page.locator("html")).toHaveAttribute("dir", dir);
  await settle(page);
};

for (const dir of ["ltr", "rtl"] as const) {
  test(`indents each level from the leading edge, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const titles = await boxes(page, '#plain [data-part="node"] [data-part="title"]');
    expect(titles).toHaveLength(6);

    // docs(0) guide(1) intro(2) setup(2) api(1) changelog(0)
    const edge = dir === "rtl" ? "right" : "left";
    const at = (index: number) => titles[index]![edge];
    const deeper = (a: number, b: number) => (dir === "rtl" ? at(a) < at(b) : at(a) > at(b));

    expect(deeper(1, 0)).toBe(true);
    expect(deeper(2, 1)).toBe(true);
    // Siblings share a level, so they share an edge.
    expect(Math.abs(at(2) - at(3))).toBeLessThanOrEqual(1);
    expect(Math.abs(at(1) - at(4))).toBeLessThanOrEqual(1);
    expect(Math.abs(at(0) - at(5))).toBeLessThanOrEqual(1);
  });

  test(`turns the expander to face the branch it opens, ${dir}`, async ({ page }) => {
    await open(page, dir);
    const read = (name: string) =>
      page
        .locator(`#mixed [role="treeitem"][aria-expanded="${name}"] [data-part="expander"] svg`)
        .first()
        .evaluate(el => {
          const style = getComputedStyle(el);
          return { rotate: style.rotate, scale: style.scale };
        });

    const closed = await read("false");
    const opened = await read("true");

    // Rotated rather than swapped for a second icon, so the two states are one
    // shape with something to animate between — and mirrored with the document,
    // because a chevron pointing INTO a branch points the other way when the
    // branch is on the other side.
    expect(closed.rotate).toBe("none");
    expect(closed.scale).toBe(dir === "rtl" ? "-1 1" : "none");
    expect(opened.rotate).toBe(dir === "rtl" ? "-90deg" : "90deg");
  });
}

test("keeps the selected row's own fill under the pointer", async ({ page }) => {
  await open(page, "ltr");
  const row = page.locator('#plain [data-part="node"][data-selected]').first();
  const read = () => row.evaluate(el => getComputedStyle(el).backgroundColor);

  const before = await read();
  await row.hover();
  // The same specificity trap the calendar's day cells and the time columns
  // hit: `[data-selected]` is one attribute lighter than a `:hover` that also
  // names the part.
  expect(await read()).toBe(before);
});

test("draws a connecting line for every level but the first", async ({ page }) => {
  await open(page, "ltr");
  const lines = await page.locator('#lines [data-part="node"]').evaluateAll(els =>
    els.map(el => ({
      depth: el.getAttribute("data-depth"),
      drawn: getComputedStyle(el, "::before").content !== "none",
    }))
  );
  // Generated content, so there is no node to query — `getComputedStyle` with a
  // pseudo-element is the only way to see it in any environment.
  expect(lines.filter(l => l.depth === "0").every(l => !l.drawn)).toBe(true);
  expect(lines.filter(l => l.depth !== "0").every(l => l.drawn)).toBe(true);
});

test("matches the popup's width to the control it belongs to", async ({ page }) => {
  await open(page, "ltr");
  // The CONTROL, not the trigger button. The anchor is the wrapper, which also
  // holds the clear button — comparing against the button alone is off by
  // exactly that button plus the gap, which reads as a 20px bug in a popup that
  // is in fact aligned.
  const [control] = await boxes(page, '#select [data-part="control"]');
  const [popup] = await boxes(page, '[data-scope="tree-select"][data-part="content"]');

  // `applyPosition` publishes the anchor's width as a custom property; without
  // reading it the popup shrink-wraps its deepest row and a narrow tree renders
  // a popup visibly narrower than the control that opened it.
  expect(Math.abs(popup!.right - popup!.left - (control!.right - control!.left))).toBeLessThan(2);
  expect(Math.abs(popup!.left - control!.left)).toBeLessThan(2);
});

test("turns the indicator when the popup is open", async ({ page }) => {
  await open(page, "ltr");
  const rotate = await page
    .locator('#select [data-part="indicator"]')
    .evaluate(el => getComputedStyle(el).rotate);
  // Turned rather than swapped for a second icon, so the two states are one
  // shape with something to animate between.
  expect(rotate).toBe("180deg");
});

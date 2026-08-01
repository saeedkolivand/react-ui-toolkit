import { test, expect, type Page, type Locator } from "@playwright/test";

/**
 * Anchored overlay placement, in a real browser.
 *
 * None of this is assertable in jsdom, and not for want of trying: it reports
 * every element as a 0×0 rect at the origin, so a popup that anchored to the
 * wrong element, flipped when it should not have, or landed on top of its own
 * trigger produces byte-identical numbers to one that is placed correctly. The
 * unit suites cover which attributes and handlers exist; this covers whether the
 * result is anywhere near the trigger.
 */

/**
 * Geometry is read off the POSITIONER, never off the content.
 *
 * `applyPosition` writes the coordinates onto the positioner and nothing else,
 * and the content inside it is running `ck-overlay-in`, which is a
 * `transform: scale(.96)` — so its rect is inset by a few percent for the length
 * of the enter animation. That inset is invisible to a centred assertion, which
 * is why the first version of this file passed every "centred on its trigger"
 * check and failed only the edge-aligned one, by 3.2px.
 */
/**
 * Waits until the position has actually been written, then hands back the
 * positioner.
 *
 * `toBeVisible()` is not enough and CI proved it: the element is in the document
 * and painted before `applyPosition` runs, and a portalled `position: fixed` box
 * with no coordinates sits at its static place at the end of `<body>` — measured
 * at y=840 for a trigger at y=380, which reads as a wild mispositioning rather
 * than as a race. `data-placement` is written in the same call as `left`/`top`,
 * so its presence is the signal that all of them are there.
 */
const positioned = async (page: Page, scope: string) => {
  const locator = positioner(page, scope);
  await expect(locator).toHaveAttribute("data-placement", /\S/);
  return locator;
};

const box = async (locator: Locator) => {
  const rect = await locator.boundingBox();
  expect(rect, "element has no box").not.toBeNull();
  return rect!;
};

const positioner = (page: Page, scope: string) =>
  page.locator(`[data-scope="${scope}"][data-part="positioner"]`);
const content = (page: Page, scope: string) =>
  page.locator(`[data-scope="${scope}"][data-part="content"]`);

test.beforeEach(async ({ page }) => {
  await page.goto("/anchored.html");
});

test("places the tooltip above its trigger when there is room", async ({ page }) => {
  const trigger = page.locator("#fits");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();

  const [t, c] = [await box(trigger), await box(await positioned(page, "tooltip"))];
  // Above, and actually touching: a positioner that silently returned {0,0}
  // would also be "above" a trigger 380px down the page, so the gap is bounded
  // at both ends rather than only asserted to be positive.
  expect(c.y + c.height).toBeLessThanOrEqual(t.y);
  expect(t.y - (c.y + c.height)).toBeLessThan(24);
  // Centred on the trigger, within a pixel of rounding.
  expect(Math.abs(c.x + c.width / 2 - (t.x + t.width / 2))).toBeLessThan(2);
  await expect(positioner(page, "tooltip")).toHaveAttribute("data-placement", "top");
});

test("flips to the opposite side rather than leaving the viewport", async ({ page }) => {
  const trigger = page.locator("#flip-top");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();

  // Asked for `top` two pixels from the top of the viewport, where it cannot
  // fit. `data-placement` carries the placement actually used, AFTER the flip,
  // which is what the stylesheet points the arrow with.
  await expect(positioner(page, "tooltip")).toHaveAttribute("data-placement", "bottom");
  const [t, c] = [await box(trigger), await box(await positioned(page, "tooltip"))];
  expect(c.y).toBeGreaterThanOrEqual(t.y + t.height - 1);
  // Still on screen, which is the point of flipping at all.
  expect(c.y).toBeGreaterThanOrEqual(0);
});

test("escapes an ancestor with a transform", async ({ page }) => {
  const trigger = page.locator("#transformed");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();

  // A transformed ancestor becomes the containing block for `position: fixed`,
  // so a popup rendered in place would resolve its viewport coordinates against
  // that box instead. Portalling to document.body is the only fix, and it
  // cannot be enforced from core — so it is asserted here.
  const parent = await content(page, "tooltip").evaluate(
    node => node.parentElement?.parentElement?.tagName
  );
  expect(parent).toBe("BODY");

  const [t, c] = [await box(trigger), await box(await positioned(page, "tooltip"))];
  expect(Math.abs(c.x + c.width / 2 - (t.x + t.width / 2))).toBeLessThan(2);
  expect(t.y - (c.y + c.height)).toBeLessThan(24);
});

test("puts the menu below its trigger and left-aligned to it", async ({ page }) => {
  await page.locator("#menu-trigger").click();
  await expect(content(page, "menu")).toBeVisible();

  const [t, c] = [
    await box(page.locator("#menu-trigger")),
    await box(await positioned(page, "menu")),
  ];
  expect(c.y).toBeGreaterThanOrEqual(t.y + t.height - 1);
  // `bottomLeft` aligns the popup's start edge with the trigger's, rather than
  // centring it — the difference between the twelve names and four.
  expect(Math.abs(c.x - t.x)).toBeLessThan(2);
});

test("keeps the popover reachable, and its controls clickable", async ({ page }) => {
  await page.locator("#popover-trigger").click();
  await expect(content(page, "popover")).toBeVisible();

  const [t, c] = [
    await box(page.locator("#popover-trigger")),
    await box(await positioned(page, "popover")),
  ];
  // `right` means after the trigger on the inline axis.
  expect(c.x).toBeGreaterThanOrEqual(t.x + t.width - 1);

  // The reason a popover is a dialog rather than a tooltip: a real control
  // inside it has to receive a real press. Nothing about this is assertable
  // without layout — an element the positioner left underneath its own trigger
  // would fail here and nowhere else.
  await page.locator("#popover-button").click();
  await expect(page.locator("#popover-button")).toBeFocused();
});

test("lets the keyboard reach what is inside the popover", async ({ page }) => {
  await page.locator("#popover-trigger").click();
  await expect(content(page, "popover")).toBeVisible();

  // Two separate bugs met here. The layer dismissed on the first `focusin`
  // outside it, which for a non-trapping dialog is the trigger itself — so Tab
  // closed it. And the popup is portalled to the end of the document, so Tab
  // order walked straight past it into the next control on the page: measured
  // `active="menu-trigger"` with the inner button never visited.
  await expect(content(page, "popover")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#popover-button")).toBeFocused();
  await expect(content(page, "popover")).toHaveCount(1);

  await page.keyboard.press("Escape");
  await expect(content(page, "popover")).toHaveCount(0);
  await expect(page.locator("#popover-trigger")).toBeFocused();
});

test("repositions when the page scrolls under the trigger", async ({ page }) => {
  const trigger = page.locator("#fits");
  await trigger.hover();
  await expect(content(page, "tooltip")).toBeVisible();
  const before = await box(await positioned(page, "tooltip"));

  // `position: fixed` coordinates are viewport-relative, so a popup that does
  // not re-measure on scroll detaches from its anchor and hangs in mid-air.
  await page.evaluate(() => window.scrollBy(0, 120));
  await expect
    .poll(async () => (await box(await positioned(page, "tooltip"))).y)
    .not.toBe(before.y);

  const [t, c] = [await box(trigger), await box(await positioned(page, "tooltip"))];
  expect(t.y - (c.y + c.height)).toBeLessThan(24);
});

test("gives menu focus back to the trigger, but not over a press outside", async ({ page }) => {
  await page.locator("#menu-trigger").click();
  await expect(content(page, "menu")).toBeVisible();
  await expect(content(page, "menu")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(content(page, "menu")).toHaveCount(0);
  // Taking focus on open and dropping it on close leaves <body> focused, so the
  // next Tab restarts at the top of the page.
  await expect(page.locator("#menu-trigger")).toBeFocused();

  await page.locator("#menu-trigger").click();
  await expect(content(page, "menu")).toBeVisible();
  // The outcome, not the mechanism. No pointer path can observe the restore
  // guard: the browser assigns focus from the press AFTER the close effect has
  // run, so the trigger never keeps it either way — checked against both a
  // focusable target and empty space, with the guard neutered. What this pins
  // is that a dismissed menu does not drag focus back to its trigger, however
  // that ends up being true. The guard itself is covered where it IS decisive,
  // by the controlled-close test in `dropdown.test.tsx`.
  await page.mouse.click(960, 40);
  await expect(content(page, "menu")).toHaveCount(0);
  await expect(page.locator("#menu-trigger")).not.toBeFocused();
});

test("opens both default triggers from the keyboard alone", async ({ page }) => {
  // The other instances on this page set `trigger="click"` so a press is
  // deterministic, which also means they never exercise the defaults a consumer
  // actually gets. Driven by focus and keys only here — no pointer, so no race
  // between the hover delay and the press.
  await page.locator("#default-menu").focus();
  await page.keyboard.press("Enter");
  await expect(content(page, "menu")).toBeVisible();
  await expect(content(page, "menu")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#default-menu")).toBeFocused();

  await page.locator("#default-popover").focus();
  await page.keyboard.press("Enter");
  await expect(content(page, "popover")).toBeVisible();
  await expect(content(page, "popover")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#default-popover-button")).toBeFocused();
});

test("caps a long menu against the room actually available", async ({ page }) => {
  // Short on purpose. At this suite's default 1000x800 the 20rem fallback fits
  // above or below whatever the trigger does, so flip rescues it and the bug is
  // invisible — the first version of this test passed with the fix reverted for
  // exactly that reason. 400px tall is the case where 320px of menu fits on
  // NEITHER side, which is the only case that needs the real number.
  await page.setViewportSize({ width: 900, height: 400 });
  await page.locator("#long-menu").click();
  await expect(content(page, "menu")).toBeVisible();

  const viewport = page.viewportSize()!;

  // Polled, because this settles over an extra frame by construction: the cap
  // depends on which side was chosen, and the side depends on the height the cap
  // changes. Capping resizes the box, the ResizeObserver in `autoUpdate` sees it
  // and repositions, and the second pass is stable because the anchor has not
  // moved. Reading once catches it mid-convergence at y=-22.
  await expect
    .poll(async () => {
      const b = await box(content(page, "menu"));
      return { top: Math.round(b.y), bottom: Math.round(b.y + b.height) };
    })
    .toEqual({ top: 0, bottom: expect.any(Number) });

  const c = await box(content(page, "menu"));
  // BOTH edges. Asserting only the bottom is not enough, and the first version
  // of this test proved it: with the trigger at y=300 in a 400px viewport, flip
  // sends the menu upward, so an uncapped 320px box overflows the TOP while its
  // bottom edge stays comfortably on screen.
  //
  // `--available-height` was only ever written by the v1 machine, so v2 took the
  // 20rem fallback wherever the trigger sat.
  expect(c.y).toBeGreaterThanOrEqual(-1);
  expect(c.y + c.height).toBeLessThanOrEqual(viewport.height + 1);

  // And genuinely capped rather than merely short — the list is 30 rows, so an
  // uncapped box would be far taller than this.
  expect(await content(page, "menu").evaluate(n => n.scrollHeight > n.clientHeight)).toBe(true);
  // The last row is reachable by scrolling within the menu.
  await content(page, "menu").evaluate(n => n.scrollTo(0, n.scrollHeight));
  await expect(page.locator('[data-part="item"]', { hasText: "Row 29" })).toBeInViewport();
});

test("tabs out of a hover-opened menu to the control after it", async ({ page }) => {
  // Hover-open, then press: focus lands on the trigger with the menu open,
  // which is the route that had no keyboard handling two rounds ago.
  await page.locator("#default-menu").hover();
  await expect(content(page, "menu")).toBeVisible();
  await page.locator("#default-menu").click();
  await expect(content(page, "menu")).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(content(page, "menu")).toHaveCount(0);

  // Tab is the user LEAVING, not navigating. The close does not preventDefault,
  // so the browser's own Tab runs from wherever focus is — and moving it into a
  // popup portalled to the end of <body> first sent the user to `#flip-top`,
  // the FIRST control on the page, instead of the next one after the trigger.
  await expect(page.locator("#flip-top")).not.toBeFocused();
  await expect(page.locator("#default-popover")).toBeFocused();
});

test("lets the keyboard leave a popover, forwards and backwards", async ({ page }) => {
  const after = page.locator("#default-popover");
  await after.focus();
  await page.keyboard.press("Enter");
  await expect(content(page, "popover")).toBeVisible();
  await expect(content(page, "popover")).toBeFocused();

  // Into the popup's own control, then past it. A Popover has no key handling
  // of its own — Dropdown survives this because its menu closes on Tab — and
  // `focus: role !== "dialog"` correctly stops the dismissable layer watching
  // focus leave. So nothing observed a Tab out at all: the second press landed
  // on `<body>`, outside the document, with the popover still open.
  await page.keyboard.press("Tab");
  await expect(page.locator("#default-popover-button")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(content(page, "popover")).toHaveCount(0);
  await expect(page.locator("body")).not.toBeFocused();

  // Backwards out of it, which used to land on the LAST control on the page
  // because the popup is portalled to the end of the document.
  await after.focus();
  await page.keyboard.press("Enter");
  await expect(content(page, "popover")).toBeFocused();
  await page.keyboard.down("Shift");
  await page.keyboard.press("Tab");
  await page.keyboard.up("Shift");
  await expect(content(page, "popover")).toHaveCount(0);
  await expect(page.locator("#transformed")).not.toBeFocused();
});

test("does not pull focus into a hover-opened popup on a bare modifier", async ({ page }) => {
  await page.locator("#default-popover").hover();
  await expect(content(page, "popover")).toBeVisible();
  // Focus has to be ON the trigger for its keydown handler to see the key at
  // all — a hover leaves it wherever it was, so pressing Shift with `<body>`
  // focused observes nothing and passes whatever the filter does. Focused
  // rather than clicked, because `click` is in this component's default trigger
  // and would toggle the popup shut.
  await page.locator("#default-popover").focus();
  await expect(content(page, "popover")).toBeVisible();

  // A Shift+Tab is two keydowns, `Shift` then `Tab`, and only the second was
  // filtered — so the bare Shift pulled focus into a popup that the hover-open
  // had deliberately declined to focus, and the Shift+Tab then ran from the
  // portal at the end of the document.
  await page.keyboard.down("Shift");
  await expect(page.locator("#default-popover")).toBeFocused();
  await expect(content(page, "popover")).not.toBeFocused();
  await page.keyboard.up("Shift");
});

test("scrolls the highlighted row into view in a capped menu", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 400 });
  await page.locator("#long-menu").click();
  await expect(content(page, "menu")).toBeVisible();

  await page.keyboard.press("End");
  const highlighted = page.locator('[data-part="item"][data-highlighted]');
  await expect(highlighted).toHaveText("Row 29");

  // `aria-activedescendant` keeps one element focused, which is what makes the
  // highlight announceable — but it gives up the scrolling that moving real
  // focus would have done, and nothing else did it. The cap added earlier on
  // this branch is what made it bite: the box now scrolls by construction, so
  // End left the highlighted row hundreds of pixels below the fold with
  // `scrollTop` still 0, and Enter selected something invisible.
  await expect(highlighted).toBeInViewport();

  const visible = await content(page, "menu").evaluate(box => {
    const row = box.querySelector('[data-part="item"][data-highlighted]')!;
    const b = box.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    return r.top >= b.top - 1 && r.bottom <= b.bottom + 1;
  });
  expect(visible).toBe(true);
});

test("dismisses a focus-triggered menu instead of reopening it", async ({ page }) => {
  await page.locator("#focus-menu").focus();
  await expect(content(page, "menu")).toBeVisible();
  await expect(content(page, "menu")).toBeFocused();

  // Two correct mechanisms, wrong together: the close hands focus back to the
  // trigger, and for this mode that focus IS the gesture that opens it. Escape
  // closed and reopened in one breath, so the menu could not be dismissed at
  // all — two Escapes still left it open with focus back inside.
  await page.keyboard.press("Escape");
  await expect(content(page, "menu")).toHaveCount(0);
  await expect(page.locator("#focus-menu")).toBeFocused();

  // And the marker is down again, so a focus the USER causes still opens it —
  // otherwise the fix would break the trigger mode outright.
  await page.locator("#long-menu").focus();
  await page.locator("#focus-menu").focus();
  await expect(content(page, "menu")).toBeVisible();
});

test("does not style a nested overlay trigger like a tab", async ({ page }) => {
  const nested = page.locator('[data-scope="popover"][data-part="trigger"]', {
    has: page.locator("#tab-nested-trigger"),
  });
  await expect(nested).toBeVisible();

  // The tab rules are descendant selectors, so an unscoped
  // `[data-type="line"] [data-part="trigger"]` reached any `trigger` part in the
  // subtree — and Tooltip, Popover, Menu and Select all render one. Measured a
  // popover trigger inside a tab panel carrying `2px solid` and `-1px`.
  const style = await nested.evaluate(node => {
    const s = getComputedStyle(node);
    return { border: s.borderBlockEndWidth, margin: s.marginBlockEnd };
  });
  expect(style.border).toBe("0px");
  expect(style.margin).toBe("0px");
});

test("puts the tab panel's gap on the side its list is on", async ({ page }) => {
  const panel = page
    .locator('[data-tab-position="bottom"] [data-scope="tabs"][data-part="content"]')
    .first();
  await expect(panel).toBeVisible();

  // `column-reverse` paints the panel above the list, but the padding was still
  // `padding-top: 1rem` — 16px on the outside edge of the whole component and
  // nothing at all between the panel and the tabs it belongs to.
  const pad = await panel.evaluate(node => {
    const s = getComputedStyle(node);
    return { top: s.paddingTop, bottom: s.paddingBottom };
  });
  expect(pad).toEqual({ top: "0px", bottom: "16px" });
});

test("does not let an outer tab type reach a nested Tabs", async ({ page }) => {
  const trigger = (name: string) => page.getByRole("tab", { name });
  const shape = (name: string) =>
    trigger(name).evaluate(node => {
      const s = getComputedStyle(node);
      return {
        end: s.borderBlockEndWidth,
        start: s.borderBlockStartWidth,
        radius: s.borderStartStartRadius,
      };
    });

  // Scoping both ends to `[data-scope="tabs"]` keeps these rules off a Popover
  // or Select trigger, but an inner Tabs' own triggers carry that scope too —
  // and with both blocks at equal specificity, source order handed `card` the
  // argument. The inner `line` tabs came out identical to the outer card ones.
  const [inner, alone] = [await shape("Inner line"), await shape("Alone")];
  expect(inner).toEqual(alone);

  // And the outer is still a card, so the fix scoped rather than removed.
  expect((await shape("Outer card")).radius).not.toBe("0px");
});

test("mirrors a card tab's open edge when its list moves below", async ({ page }) => {
  const edges = (name: string) =>
    page.getByRole("tab", { name }).evaluate(node => {
      const s = getComputedStyle(node);
      return {
        startColour: s.borderBlockStartColor,
        endColour: s.borderBlockEndColor,
        startRadius: s.borderStartStartRadius,
        endRadius: s.borderEndStartRadius,
      };
    });

  const [top, bottom] = [await edges("Top card"), await edges("Bottom")];

  // The type rules name the block-END edge, which faces the panel only while
  // the list is above it. With the list below, the tab sealed itself shut: a
  // grey seam between it and its own panel, and the white notch meant to merge
  // them punched into the divider on the outer edge instead.
  //
  // Mirrored, so `bottom` is `top` reflected — the open edge faces the panel in
  // both, which is the whole point of the shape.
  expect(bottom.startColour).toBe(top.endColour);
  expect(bottom.endColour).toBe(top.startColour);
  expect(bottom.endRadius).toBe(top.startRadius);
  expect(bottom.startRadius).toBe(top.endRadius);
});

/**
 * The arrow, in both directions.
 *
 * A centred arrow is blind to mirroring — `--ck-arrow-x` is symmetric there, so
 * every "centred on its trigger" assertion above passes whether the CSS reads
 * the offset from the correct edge or the opposite one. Only a SIDE placement
 * separates them, which is what these two use.
 */
for (const dir of ["ltr", "rtl"] as const) {
  test(`points the arrow at the trigger in ${dir}`, async ({ page }) => {
    await page.evaluate(d => {
      document.documentElement.dir = d;
    }, dir);
    await page.locator("#popover-trigger").click();
    await expect(content(page, "popover")).toBeVisible();

    const pos = await box(await positioned(page, "popover"));
    const arrow = await box((await positioned(page, "popover")).locator('[data-part="arrow"]'));
    const trigger = await box(page.locator("#popover-trigger"));

    // The arrow sits on the popup's edge that FACES the trigger. In rtl the
    // popup lands on the other side, so which edge that is flips with it —
    // computed from the measured boxes rather than hard-coded per direction.
    const triggerIsAfter = trigger.x > pos.x;
    const facingEdge = triggerIsAfter ? pos.x + pos.width : pos.x;
    const arrowCentre = arrow.x + arrow.width / 2;
    expect(Math.abs(arrowCentre - facingEdge)).toBeLessThan(2);

    // And on the trigger's side of the popup rather than the far one: reading
    // the offset from the wrong edge put this a full popup width out.
    expect(Math.abs(arrowCentre - (trigger.x + trigger.width / 2))).toBeLessThan(pos.width);
  });
}

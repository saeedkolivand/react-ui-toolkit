import { test, expect, type Page } from "@playwright/test";

/**
 * Overlay behaviour, in a real browser.
 *
 * These assertions exist because the unit tests structurally cannot make them.
 * jsdom reflects the `inert` IDL attribute and implements none of its behaviour
 * — no focus blocking, no focus fixup rule — and it has no layout, so it cannot
 * say which of two overlapping `position: fixed` elements receives a press. Both
 * gaps have already produced a green test over a real bug on this branch.
 *
 * Modal is deliberately absent from the parity fixture (it portals, and only
 * exists once opened), so this is the only place these hold.
 */

const activeId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? "");
const open = async (page: Page) => {
  await page.goto("/overlay.html");
  await page.locator("#before").focus();
  await page.locator("#before").click();
  await expect(page.locator('[data-scope="dialog"][data-part="content"]')).toBeVisible();
};

test("returns focus to the trigger after Escape, across the inert background", async ({ page }) => {
  await open(page);
  // Focus moved inside before anything became inert.
  expect(await activeId(page)).not.toBe("before");

  await page.keyboard.press("Escape");
  await expect(page.locator('[data-scope="dialog"][data-part="content"]')).toHaveCount(0);

  // The trap captures its return target by reading document.activeElement. Inert
  // an ancestor of the focused element first and the focus fixup rule resets
  // that to <body>, so the user closing a dialog would lose their place in the
  // document entirely — the next Tab restarts from the top of the page.
  expect(await activeId(page)).toBe("before");
});

test("makes the background genuinely unreachable, not merely hidden", async ({ page }) => {
  await open(page);
  // `inert` blocks focus, so Tab cannot reach a control outside the dialog no
  // matter how many times it is pressed. jsdom would let this walk straight out.
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  const inside = await page.evaluate(() => {
    const content = document.querySelector('[data-scope="dialog"][data-part="content"]');
    return content?.contains(document.activeElement) ?? false;
  });
  expect(inside).toBe(true);
});

test("a press on the mask reaches the positioner, and reports as a cancel", async ({ page }) => {
  await open(page);
  // Pressed at the very top of the viewport, which is mask rather than dialog.
  // The backdrop and the positioner are both fixed and inset:0 at the same
  // z-index, and the positioner is second in DOM order — so this lands on the
  // positioner, and only the dismissable layer can see it. A handler on the
  // backdrop would never fire here.
  await page.mouse.click(20, 20);
  await expect(page.locator('[data-scope="dialog"][data-part="content"]')).toHaveCount(0);
  await expect(page.locator("#cancels")).toHaveText("1");
  // Focus is NOT pulled back to the trigger, and that is the trap's documented
  // guard rather than an oversight: the press itself moved focus out of the
  // dialog, so restoring would be stealing it from wherever the user just put
  // it. Escape, which moves nothing, does restore — asserted above.
  expect(await activeId(page)).toBe("");
});

test("Tab advances inside a nested dialog, and the outer trap resumes", async ({ page }) => {
  await open(page);
  await page.locator("#inner-first").click();
  await expect(page.locator('[data-scope="dialog"][data-part="content"]')).toHaveCount(2);

  await page.locator("#nested-first").focus();
  await page.keyboard.press("Tab");
  expect(await activeId(page)).toBe("nested-second");
  // Wraps within the nested dialog rather than escaping into the outer one.
  await page.keyboard.press("Tab");
  expect(await activeId(page)).toBe("nested-first");

  await page.keyboard.press("Escape");
  await expect(page.locator('[data-scope="dialog"][data-part="content"]')).toHaveCount(1);
  // Only the top layer answered, and focus came back to what opened it.
  expect(await activeId(page)).toBe("inner-first");

  await page.keyboard.press("Tab");
  expect(await activeId(page)).toBe("inner-second");
});

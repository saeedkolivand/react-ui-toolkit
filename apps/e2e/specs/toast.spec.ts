import { expect, test, type Page } from "@playwright/test";

/**
 * Toast, in a real browser.
 *
 * Everything here is something jsdom cannot answer: the group is
 * `position: fixed` and jsdom gives every element a 0×0 rect at the origin, it
 * runs no transitions, and it does not implement `pointer-events` — so a group
 * pinned to the wrong corner, an exit that never animates, and a fixed layer
 * that swallows every click underneath it all look identical there to the
 * correct thing.
 *
 * The trap from `anchored.spec.ts` applies here too: measure the element that
 * holds the geometry, not one mid-transition. A toast is read after its enter
 * settles, or the numbers describe a frame nobody sees.
 */

const groupFor = (page: Page, placement: string) =>
  page.locator(`[data-fixture="${placement}"] [data-part="group"]`);

const rootsIn = (page: Page, placement: string) =>
  page.locator(`[data-fixture="${placement}"] [data-scope="toast"][data-part="root"]`);

test.beforeEach(async ({ page }) => {
  await page.goto("/toast.html");
  await expect(page.locator("#underneath")).toBeVisible();
});

test("pins the group to the corner its placement names", async ({ page }) => {
  await page.click("#add-bottom-end");
  await page.click("#add-top-start");
  await expect(rootsIn(page, "bottom-end")).toHaveCount(1);
  await expect(rootsIn(page, "top-start")).toHaveCount(1);

  const viewport = page.viewportSize()!;
  const bottomEnd = (await rootsIn(page, "bottom-end").first().boundingBox())!;
  const topStart = (await rootsIn(page, "top-start").first().boundingBox())!;

  // Bottom-end sits in the lower half and against the right edge; top-start in
  // the upper half and against the left. Asserting the halves rather than exact
  // pixels, so padding can change without rewriting the test.
  expect(bottomEnd.y).toBeGreaterThan(viewport.height / 2);
  expect(bottomEnd.x + bottomEnd.width).toBeGreaterThan(viewport.width / 2);
  expect(topStart.y).toBeLessThan(viewport.height / 2);
  expect(topStart.x).toBeLessThan(viewport.width / 2);
});

test("keeps the two ends apart rather than stacking them in one corner", async ({ page }) => {
  await page.click("#add-top-start");
  await page.click("#add-top-end");
  await expect(rootsIn(page, "top-start")).toHaveCount(1);
  await expect(rootsIn(page, "top-end")).toHaveCount(1);

  const start = (await rootsIn(page, "top-start").first().boundingBox())!;
  const end = (await rootsIn(page, "top-end").first().boundingBox())!;
  // Both are `top`, so only the alignment separates them. Equal widths mean
  // nothing but x can tell the two apart.
  expect(end.x).toBeGreaterThan(start.x + start.width);
});

test("lets clicks through to the page underneath the group", async ({ page }) => {
  await page.click("#add-bottom-end");
  await expect(rootsIn(page, "bottom-end")).toHaveCount(1);

  const button = page.locator("#underneath");
  const box = (await button.boundingBox())!;
  const group = (await groupFor(page, "bottom-end").boundingBox())!;
  // Deliberately inside the group's own box, on the left where no toast sits.
  // A group without `pointer-events: none` intercepts this and the counter
  // stays at 0.
  expect(group.y).toBeLessThan(box.y + box.height);
  await page.mouse.click(box.x + 20, group.y + group.height / 2);
  await expect(button).toHaveAttribute("data-clicked", "1");
});

test("still takes clicks on the toast itself", async ({ page }) => {
  await page.click("#add-closable");
  const root = rootsIn(page, "bottom-end").first();
  await expect(root).toHaveCount(1);
  // The mirror of the test above: `pointer-events: none` on the group has to be
  // taken back by the roots, or nothing in a toast is clickable.
  await root.getByRole("button", { name: "Dismiss" }).click();
  await expect(root).toHaveAttribute("data-state", "closed");
});

test("holds a toast open while the pointer is over the group", async ({ page }) => {
  await page.click("#add-bottom-end");
  const root = rootsIn(page, "bottom-end").first();
  await expect(root).toHaveCount(1);
  await root.hover();
  // The default duration is 5s. Ten seconds hovered and it must still be open,
  // which is the whole point of pausing.
  await page.waitForTimeout(10_000);
  await expect(root).toHaveAttribute("data-state", "open");
});

test("animates the exit rather than vanishing", async ({ page }) => {
  await page.click("#add-sticky");
  const root = rootsIn(page, "bottom-end").first();
  await expect(root).toHaveCount(1);
  await expect(root).toHaveAttribute("data-state", "open");
  const opaque = await root.evaluate(n => getComputedStyle(n).opacity);

  await page.click("#dismiss-sticky");
  await expect(root).toHaveAttribute("data-state", "closed");
  // Partway through, not on the first frame: the computed value right after the
  // attribute flips is still the start value, so reading there proves nothing.
  await page.waitForTimeout(100);
  const fading = await root.evaluate(n => getComputedStyle(n).opacity);
  expect(Number(opaque)).toBe(1);
  expect(Number(fading)).toBeLessThan(1);
  await expect(rootsIn(page, "bottom-end")).toHaveCount(0);
});

test("finishes the exit before the node is removed", async ({ page }) => {
  await page.click("#add-sticky");
  const root = rootsIn(page, "bottom-end").first();
  await expect(root).toHaveCount(1);

  // The pair that has to hold: the queue removes a dismissed toast after its
  // `removeDelay` (200ms by default), so an exit longer than that is cut off
  // mid-flight and the toast disappears part-faded. Read as a number rather
  // than raced against a timer — sampling near the end of a 200ms window is
  // exactly the flaky assertion this project keeps finding.
  const seconds = await root.evaluate(n => parseFloat(getComputedStyle(n).transitionDuration));
  expect(seconds).toBeLessThanOrEqual(0.2);
});

test("shows a held-back toast once a slot frees", async ({ page }) => {
  await page.click("#add-overflow");
  const roots = rootsIn(page, "bottom-start");
  // `max: 2`, so the third waits rather than being dropped.
  await expect(roots).toHaveCount(2);
  await expect(roots).toContainText(["one", "two"]);
  await expect(roots.filter({ hasText: "three" })).toHaveCount(0);
  await expect(roots.filter({ hasText: "three" })).toHaveCount(1, { timeout: 10_000 });
});

test("stacks the newest nearest the edge it enters from", async ({ page }) => {
  await page.click("#add-bottom-end");
  await page.click("#add-closable");
  const roots = rootsIn(page, "bottom-end");
  await expect(roots).toHaveCount(2);

  const first = (await roots.first().boundingBox())!;
  const second = (await roots.nth(1).boundingBox())!;
  // DOM order is creation order; `column-reverse` puts the newest lowest in a
  // bottom-anchored group. Without it the stack grows the wrong way and the
  // newest toast is the one furthest from the corner.
  expect(second.y).toBeLessThan(first.y);
});

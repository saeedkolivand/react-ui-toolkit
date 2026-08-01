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

/**
 * Waits out whatever is currently animating on a node.
 *
 * The enter is a keyframe animation, so the first computed read after a toast
 * appears describes a frame of that animation rather than the resting style —
 * the same trap `anchored.spec.ts` documents for enter transitions, and it bit
 * again here the moment the enter existed.
 */
const settled = (locator: ReturnType<Page["locator"]>) =>
  locator.evaluate(async node => {
    await Promise.all(node.getAnimations().map(animation => animation.finished));
  });

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

test("counts down again after a toast is closed under the pointer", async ({ page }) => {
  await page.click("#add-closable");
  const roots = rootsIn(page, "bottom-end");
  await expect(roots).toHaveCount(1);

  // Clicking a close button means the pointer is necessarily over the toast,
  // and a detached node fires no boundary event — so the hover hold it raised
  // has no release. Left stranded, nothing on the page ever counts down again.
  await roots.first().getByRole("button", { name: "Dismiss" }).click();
  await expect(roots).toHaveCount(0);
  await page.mouse.move(5, 5);

  await page.click("#add-bottom-end");
  await expect(rootsIn(page, "bottom-end")).toHaveCount(1);
  // Default duration is 5s. With the hold stranded this never closes.
  await expect(rootsIn(page, "bottom-end")).toHaveCount(0, { timeout: 10_000 });
});

test("does not hold a replacement that lands where the pointer used to be", async ({ page }) => {
  await page.click("#add-closable");
  const roots = rootsIn(page, "bottom-end");
  await expect(roots).toHaveCount(1);
  await roots.first().getByRole("button", { name: "Dismiss" }).click();
  await expect(roots).toHaveCount(0);

  // No pointer movement in between, which is the whole point: the freed slot is
  // exactly where the next toast lands, so a last-known position that is never
  // cleared goes on answering for a pointer that is no longer there.
  //
  // Same shape as the toast it replaces, deliberately. A shorter replacement
  // puts the stale coordinate 3px above its top edge, and the test passes
  // whether or not the coordinate was cleared.
  await page.click("#add-closable");
  await expect(rootsIn(page, "bottom-end")).toHaveCount(1);
  await expect(rootsIn(page, "bottom-end")).toHaveCount(0, { timeout: 10_000 });
});

test("holds a toast that slides under the pointer when the one below closes", async ({ page }) => {
  await page.click("#add-bottom-end");
  await page.click("#add-closable");
  const roots = rootsIn(page, "bottom-end");
  await expect(roots).toHaveCount(2);

  // Close the lower one with its own close button. The toast above slides down
  // into the freed slot, under the pointer that just clicked — and the pointer
  // never crosses the group boundary, so no event follows to say so. Reading
  // the browser's `:hover` at commit time answers for the layout that has just
  // stopped existing.
  const closable = roots.filter({ hasText: "Deleted" });
  const before = await page.locator("#resumes").getAttribute("data-count");
  await closable.getByRole("button", { name: "Dismiss" }).click();
  await expect(roots).toHaveCount(1);

  // Counting releases rather than waiting for the toast to expire: a stray
  // `mouseover` a moment later re-raises the hold, so the countdown restarting
  // for an instant can leave no trace in the end state. The release itself is
  // the bug.
  expect(await page.locator("#resumes").getAttribute("data-count")).toBe(before);
  await page.waitForTimeout(6000);
  await expect(roots).toHaveAttribute("data-state", "open");
});

test("animates the exit rather than vanishing", async ({ page }) => {
  await page.click("#add-sticky");
  const root = rootsIn(page, "bottom-end").first();
  await expect(root).toHaveCount(1);
  await expect(root).toHaveAttribute("data-state", "open");
  await settled(root);
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

test("stacks the newest nearest the bottom edge it enters from", async ({ page }) => {
  await page.click("#add-bottom-end");
  await page.click("#add-closable");
  const roots = rootsIn(page, "bottom-end");
  await expect(roots).toHaveCount(2);

  const oldest = (await roots.first().boundingBox())!;
  const newest = (await roots.nth(1).boundingBox())!;
  // DOM order is creation order, so the newest is the last child. In a
  // bottom-pinned group it belongs nearest the bottom — lower on the page, not
  // higher. `column-reverse` here would pin the OLDEST to the edge and push
  // each new one away from it.
  expect(newest.y).toBeGreaterThan(oldest.y);
});

test("stacks the newest nearest the top edge it enters from", async ({ page }) => {
  await page.click("#add-top-start");
  await page.click("#add-top-start-2");
  const roots = rootsIn(page, "top-start");
  await expect(roots).toHaveCount(2);

  const oldest = (await roots.first().boundingBox())!;
  const newest = (await roots.nth(1).boundingBox())!;
  // The mirror, and the side that had no coverage at all: pinned to the top,
  // the newest belongs higher, which takes `column-reverse` rather than the
  // default order.
  expect(newest.y).toBeLessThan(oldest.y);
});

test("lets a consumer override the enter keyframes from ck.overrides", async ({ page }) => {
  // Rule 8, applied to animations. `@keyframes` authored outside a cascade
  // layer wins over any layered redefinition, so a consumer overriding the name
  // in `ck.overrides` would be silently ignored — the one thing the layer
  // architecture exists to prevent.
  await page.addStyleTag({
    content: "@layer ck.overrides { @keyframes ck-toast-in-bottom { from { opacity: 0.42 } } }",
  });
  await page.click("#add-bottom-end");
  const root = rootsIn(page, "bottom-end").first();
  await expect(root).toHaveCount(1);

  // Read the resolved keyframes rather than racing a frame of the animation.
  const from = await root.evaluate(
    node =>
      (node.getAnimations()[0]?.effect as KeyframeEffect | undefined)?.getKeyframes()[0]?.opacity
  );
  expect(String(from)).toBe("0.42");
});

test("animates the enter, not only the exit", async ({ page }) => {
  const started = page.evaluate(
    () =>
      new Promise<string[]>(resolve => {
        const seen: string[] = [];
        document.addEventListener("animationstart", event => {
          seen.push((event.target as HTMLElement).dataset.part ?? "?");
          resolve(seen);
        });
        setTimeout(() => resolve(seen), 2000);
      })
  );
  await page.click("#add-bottom-end");
  await expect(rootsIn(page, "bottom-end")).toHaveCount(1);
  // A node inserted straight at its resting style has nothing to transition
  // from, so the enter is a keyframe animation. Nothing firing here means the
  // toast appears instantly however the CSS reads.
  expect(await started).toContain("root");
});

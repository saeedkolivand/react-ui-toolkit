import { expect, test, type Page } from "@playwright/test";

/**
 * The Phase 0 gate for the hand-rolled positioner.
 *
 * The unit suite in `packages/core` proves the arithmetic; this proves the
 * arithmetic is what reaches the screen. Every assertion reads the floating
 * element's real `getBoundingClientRect()` after layout, so a bug anywhere
 * between `computePosition` and the applied `left`/`top` shows up here.
 */

const PLACEMENTS = [
  "top",
  "topLeft",
  "topRight",
  "bottom",
  "bottomLeft",
  "bottomRight",
  "left",
  "leftTop",
  "leftBottom",
  "right",
  "rightTop",
  "rightBottom",
] as const;

const SPOTS = [
  "topStart",
  "top",
  "topEnd",
  "start",
  "center",
  "end",
  "bottomStart",
  "bottom",
  "bottomEnd",
] as const;

/** What each alias resolves to when nothing is in the way. */
const CANONICAL: Record<(typeof PLACEMENTS)[number], string> = {
  top: "top",
  topLeft: "top-start",
  topRight: "top-end",
  bottom: "bottom",
  bottomLeft: "bottom-start",
  bottomRight: "bottom-end",
  left: "left",
  leftTop: "left-start",
  leftBottom: "left-end",
  right: "right",
  rightTop: "right-start",
  rightBottom: "right-end",
};

const PADDING = 8;

type Placement = (typeof PLACEMENTS)[number];
type Spot = (typeof SPOTS)[number];

interface PlaceRequest {
  placement: Placement;
  spot: Spot;
  rtl?: boolean;
  padding?: number;
  anchorSize?: [number, number];
  floatingSize?: [number, number];
}

declare global {
  interface Window {
    place(request: PlaceRequest): Placed;
    attach(request: PlaceRequest): void;
    stop(): void;
    current(): Pick<Placed, "rect" | "viewport"> & { placement?: string };
  }
}

interface Placed {
  x: number;
  y: number;
  placement: string;
  rect: { x: number; y: number; width: number; height: number };
  viewport: { width: number; height: number };
  arrow?: { x?: number; y?: number; centerOffset: number };
  arrowDetached: boolean;
}

const place = (page: Page, request: { placement: Placement; spot: Spot; rtl?: boolean }) =>
  page.evaluate(
    r => window.place({ ...r, padding: 8 }) as unknown as Placed,
    request
  ) as Promise<Placed>;

test.beforeEach(async ({ page }) => {
  await page.goto("/position.html");
  await page.waitForFunction(() => typeof window.place === "function");
});

test.describe("stays on screen", () => {
  // The core claim: whatever you ask for, wherever the anchor is, in either
  // direction, the floating element ends up fully visible. 216 combinations.
  for (const rtl of [false, true]) {
    for (const spot of SPOTS) {
      test(`${rtl ? "rtl" : "ltr"} · anchor at ${spot}`, async ({ page }) => {
        for (const placement of PLACEMENTS) {
          const { rect, viewport } = await place(page, { placement, spot, rtl });
          const where = `${placement} @ ${spot}`;

          expect(rect.x, `${where} left edge`).toBeGreaterThanOrEqual(PADDING);
          expect(rect.y, `${where} top edge`).toBeGreaterThanOrEqual(PADDING);
          expect(rect.x + rect.width, `${where} right edge`).toBeLessThanOrEqual(
            viewport.width - PADDING
          );
          expect(rect.y + rect.height, `${where} bottom edge`).toBeLessThanOrEqual(
            viewport.height - PADDING
          );
        }
      });
    }
  }
});

test.describe("flip", () => {
  test("does not fire when the anchor is central", async ({ page }) => {
    for (const placement of PLACEMENTS) {
      const { placement: got } = await place(page, { placement, spot: "center" });
      // A spurious flip in open space is the failure mode that makes a
      // positioner feel unpredictable, and it never shows up in a unit test
      // that only checks overflow cases.
      expect(got, placement).toBe(CANONICAL[placement]);
    }
  });

  test("top flips to bottom against the top edge", async ({ page }) => {
    for (const placement of ["top", "topLeft", "topRight"] as const) {
      const { placement: got } = await place(page, { placement, spot: "top" });
      expect(got, placement).toMatch(/^bottom/);
    }
  });

  test("bottom flips to top against the bottom edge", async ({ page }) => {
    for (const placement of ["bottom", "bottomLeft", "bottomRight"] as const) {
      const { placement: got } = await place(page, { placement, spot: "bottom" });
      expect(got, placement).toMatch(/^top/);
    }
  });

  test("left flips to right against the start edge", async ({ page }) => {
    for (const placement of ["left", "leftTop", "leftBottom"] as const) {
      const { placement: got } = await place(page, { placement, spot: "start" });
      expect(got, placement).toMatch(/^right/);
    }
  });

  test("right flips to left against the end edge", async ({ page }) => {
    for (const placement of ["right", "rightTop", "rightBottom"] as const) {
      const { placement: got } = await place(page, { placement, spot: "end" });
      expect(got, placement).toMatch(/^left/);
    }
  });
});

test.describe("rtl", () => {
  test("mirrors the inline axis in real layout", async ({ page }) => {
    const mirrored = await place(page, { placement: "topLeft", spot: "center", rtl: true });
    const reference = await place(page, { placement: "topRight", spot: "center" });
    expect(mirrored.rect).toEqual(reference.rect);
  });

  test("mirrors left to right", async ({ page }) => {
    const mirrored = await place(page, { placement: "left", spot: "center", rtl: true });
    const reference = await place(page, { placement: "right", spot: "center" });
    expect(mirrored.rect).toEqual(reference.rect);
  });
});

test.describe("arrow", () => {
  test("points at the anchor's centre", async ({ page }) => {
    const { arrow, arrowDetached } = await place(page, { placement: "top", spot: "center" });
    expect(arrowDetached).toBe(false);
    expect(arrow?.centerOffset).toBe(0);
  });

  test("detaches and hides when it cannot reach the anchor", async ({ page }) => {
    // A wide floating element shifted hard against the viewport edge leaves the
    // anchor outside the arrow's reachable range.
    const result = await page.evaluate(
      () =>
        window.place({
          placement: "bottom",
          spot: "bottomStart",
          anchorSize: [20, 20],
          floatingSize: [400, 80],
          padding: 8,
        }) as unknown as Placed
    );
    expect(result.arrow?.centerOffset).not.toBe(0);
    expect(result.arrowDetached).toBe(true);
    await expect(page.locator("#arrow")).toBeHidden();
  });
});

test.describe("autoUpdate", () => {
  test("repositions on viewport resize", async ({ page }) => {
    await page.evaluate(() => window.attach({ placement: "bottom", spot: "end", padding: 8 }));
    const before = await page.evaluate(() => window.current());

    await page.setViewportSize({ width: 600, height: 800 });
    await expect
      .poll(async () => (await page.evaluate(() => window.current())).rect.x)
      .not.toBe(before.rect.x);

    const after = await page.evaluate(() => window.current());
    expect(after.rect.x).toBeGreaterThanOrEqual(PADDING);
    expect(after.rect.x + after.rect.width).toBeLessThanOrEqual(after.viewport.width - PADDING);

    await page.evaluate(() => window.stop());
  });

  test("stops listening once detached", async ({ page }) => {
    await page.evaluate(() => window.attach({ placement: "bottom", spot: "end", padding: 8 }));
    await page.evaluate(() => window.stop());
    const before = await page.evaluate(() => window.current());

    await page.setViewportSize({ width: 500, height: 800 });
    await page.waitForTimeout(100);

    const after = await page.evaluate(() => window.current());
    expect(after.rect.x).toBe(before.rect.x);
  });
});

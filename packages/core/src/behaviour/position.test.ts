import { describe, expect, it } from "vitest";
import {
  computePosition,
  formatPlacement,
  parsePlacement,
  toCanonicalPlacement,
  type PlacementAlias,
  type Rect,
} from "./position";

/** 1000x800 viewport with the anchor comfortably in the middle of it. */
const VIEWPORT: Rect = { x: 0, y: 0, width: 1000, height: 800 };
const ANCHOR: Rect = { x: 400, y: 300, width: 100, height: 50 };
const FLOATING: Rect = { x: 0, y: 0, width: 200, height: 100 };

const at = (placement: PlacementAlias, options = {}) =>
  computePosition(ANCHOR, FLOATING, VIEWPORT, { placement, ...options });

describe("placement names", () => {
  it("maps all 12 aliases to canonical names", () => {
    expect(toCanonicalPlacement("topLeft")).toBe("top-start");
    expect(toCanonicalPlacement("bottomRight")).toBe("bottom-end");
    expect(toCanonicalPlacement("leftTop")).toBe("left-start");
    expect(toCanonicalPlacement("rightBottom")).toBe("right-end");
  });

  it("passes canonical names through unchanged", () => {
    expect(toCanonicalPlacement("bottom-start")).toBe("bottom-start");
    expect(toCanonicalPlacement("top")).toBe("top");
  });

  it("round-trips through parse and format", () => {
    for (const p of ["top", "bottom-start", "left-end", "right"] as const) {
      const { side, align } = parsePlacement(p);
      expect(formatPlacement(side, align)).toBe(p);
    }
  });

  it("treats a bare side as centre alignment", () => {
    expect(parsePlacement("top")).toEqual({ side: "top", align: "center" });
  });
});

describe("base placement, all 12, nothing overflowing", () => {
  // anchor spans x 400-500, y 300-350; floating is 200x100.
  const cases: Array<[PlacementAlias, number, number]> = [
    ["top", 350, 200],
    ["topLeft", 400, 200],
    ["topRight", 300, 200],
    ["bottom", 350, 350],
    ["bottomLeft", 400, 350],
    ["bottomRight", 300, 350],
    ["left", 200, 275],
    ["leftTop", 200, 300],
    ["leftBottom", 200, 250],
    ["right", 500, 275],
    ["rightTop", 500, 300],
    ["rightBottom", 500, 250],
  ];

  it.each(cases)("%s → (%i, %i)", (placement, x, y) => {
    expect(at(placement)).toMatchObject({ x, y, placement: toCanonicalPlacement(placement) });
  });

  it("applies offset along the main axis only", () => {
    expect(at("top", { offset: 10 })).toMatchObject({ x: 350, y: 190 });
    expect(at("right", { offset: 10 })).toMatchObject({ x: 510, y: 275 });
  });
});

describe("flip", () => {
  it("flips top → bottom when there is no room above", () => {
    const anchor = { x: 400, y: 10, width: 100, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, { placement: "top" });
    expect(r.placement).toBe("bottom");
    expect(r.y).toBe(60);
  });

  it("flips bottom → top when there is no room below", () => {
    const anchor = { x: 400, y: 740, width: 100, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, { placement: "bottom" });
    expect(r.placement).toBe("top");
    expect(r.y).toBe(640);
  });

  it("flips left → right and preserves alignment", () => {
    const anchor = { x: 10, y: 300, width: 100, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, { placement: "leftTop" });
    expect(r.placement).toBe("right-start");
    expect(r.x).toBe(110);
  });

  it("keeps the requested side when flipping would be worse", () => {
    // 100-tall boundary: above overflows by 20, below would overflow by 60.
    const boundary = { x: 0, y: 0, width: 1000, height: 100 };
    const anchor = { x: 400, y: 60, width: 100, height: 20 };
    const floating = { x: 0, y: 0, width: 200, height: 80 };
    const r = computePosition(anchor, floating, boundary, {
      placement: "top",
      shift: false,
    });
    expect(r.placement).toBe("top");
  });

  it("takes the lesser overflow when neither side fits", () => {
    // Above overflows by 90, below by 40 — so it still flips.
    const boundary = { x: 0, y: 0, width: 1000, height: 120 };
    const anchor = { x: 400, y: 10, width: 100, height: 50 };
    const r = computePosition(anchor, FLOATING, boundary, { placement: "top", shift: false });
    expect(r.placement).toBe("bottom");
  });

  it("respects padding when deciding to flip", () => {
    // Fits by 5px, but not once an 8px boundary padding is required.
    const anchor = { x: 400, y: 105, width: 100, height: 50 };
    expect(
      computePosition(anchor, FLOATING, VIEWPORT, { placement: "top", padding: 0 }).placement
    ).toBe("top");
    expect(
      computePosition(anchor, FLOATING, VIEWPORT, { placement: "top", padding: 8 }).placement
    ).toBe("bottom");
  });

  it("keeps the requested side when both overflow equally", () => {
    // Overflow is 20 either way. A tie must not flip, or a resize that lands
    // exactly on the boundary makes the placement depend on nothing.
    const boundary = { x: 0, y: 0, width: 1000, height: 100 };
    const anchor = { x: 400, y: 40, width: 100, height: 20 };
    const floating = { x: 0, y: 0, width: 200, height: 60 };
    const r = computePosition(anchor, floating, boundary, { placement: "top", shift: false });
    expect(r.placement).toBe("top");
  });

  it("does nothing when disabled", () => {
    const anchor = { x: 400, y: 10, width: 100, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, { placement: "top", flip: false });
    expect(r.placement).toBe("top");
    expect(r.y).toBe(-90);
  });
});

describe("shift", () => {
  it("clamps to the start edge", () => {
    const anchor = { x: 0, y: 300, width: 50, height: 50 };
    // Unshifted this would be x = -75.
    expect(computePosition(anchor, FLOATING, VIEWPORT, { placement: "bottom" }).x).toBe(0);
  });

  it("honours padding at the start edge", () => {
    const anchor = { x: 0, y: 300, width: 50, height: 50 };
    expect(computePosition(anchor, FLOATING, VIEWPORT, { placement: "bottom", padding: 8 }).x).toBe(
      8
    );
  });

  it("clamps to the end edge", () => {
    const anchor = { x: 970, y: 300, width: 50, height: 50 };
    // Unshifted this would be x = 895; the widest allowed is 1000 - 200.
    expect(computePosition(anchor, FLOATING, VIEWPORT, { placement: "bottom" }).x).toBe(800);
  });

  it("shifts along y for left/right placements", () => {
    const anchor = { x: 400, y: 0, width: 100, height: 20 };
    // Unshifted this would be y = -40.
    expect(computePosition(anchor, FLOATING, VIEWPORT, { placement: "right" }).y).toBe(0);
  });

  it("pins to the start edge when the floating element is larger than the boundary", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 800 };
    const anchor = { x: 40, y: 300, width: 20, height: 50 };
    // max (100-200 = -100) is below min (0); keeping the leading edge visible wins.
    expect(computePosition(anchor, FLOATING, boundary, { placement: "bottom" }).x).toBe(0);
  });

  it("does nothing when disabled", () => {
    const anchor = { x: 0, y: 300, width: 50, height: 50 };
    expect(
      computePosition(anchor, FLOATING, VIEWPORT, { placement: "bottom", shift: false }).x
    ).toBe(-75);
  });

  it("does not move the main axis", () => {
    const anchor = { x: 0, y: 300, width: 50, height: 50 };
    expect(computePosition(anchor, FLOATING, VIEWPORT, { placement: "bottom" }).y).toBe(350);
  });
});

describe("rtl mirrors the inline axis only", () => {
  it("swaps start/end alignment on top and bottom", () => {
    expect(at("topLeft", { rtl: true })).toMatchObject(at("topRight"));
    expect(at("bottomRight", { rtl: true })).toMatchObject(at("bottomLeft"));
  });

  it("reports the mirrored placement, not the requested one", () => {
    expect(at("bottomLeft", { rtl: true }).placement).toBe("bottom-end");
  });

  it("swaps the side itself for left and right", () => {
    expect(at("left", { rtl: true })).toMatchObject(at("right"));
    expect(at("right", { rtl: true }).placement).toBe("left");
  });

  it("leaves block-axis alignment alone on left and right", () => {
    // leftTop mirrors to rightTop: the side flips, `-start` does not.
    expect(at("leftTop", { rtl: true })).toMatchObject(at("rightTop"));
  });

  it("leaves centred placements untouched", () => {
    expect(at("top", { rtl: true })).toMatchObject(at("top"));
  });

  it("is its own inverse", () => {
    for (const p of ["topLeft", "bottomRight", "leftTop", "rightBottom", "top"] as const) {
      const once = at(p, { rtl: true }).placement;
      const twice = computePosition(ANCHOR, FLOATING, VIEWPORT, {
        placement: once,
        rtl: true,
      }).placement;
      expect(twice).toBe(toCanonicalPlacement(p));
    }
  });
});

describe("arrow", () => {
  const arrow = { size: 8 };

  it("centres on the anchor", () => {
    // anchor centre 450, floating starts at 350, half-arrow 4.
    expect(at("top", { arrow }).arrow).toEqual({ x: 96, centerOffset: 0 });
  });

  it("uses the y axis for left/right placements", () => {
    // anchor centre 325, floating starts at 275.
    expect(at("left", { arrow }).arrow).toEqual({ y: 46, centerOffset: 0 });
  });

  it("stays inside the floating element and reports how far it was pushed", () => {
    const anchor = { x: 400, y: 300, width: 10, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, {
      placement: "bottomLeft",
      arrow: { size: 8, padding: 8 },
    });
    // Wants x = 1 (anchor centre 405, floating at 400, minus half-arrow).
    expect(r.arrow).toEqual({ x: 8, centerOffset: -7 });
  });

  it("reports centerOffset 0 whenever the arrow still points at the anchor", () => {
    expect(at("bottomLeft", { arrow: { size: 8, padding: 8 } }).arrow?.centerOffset).toBe(0);
  });

  it("tracks the element after a shift", () => {
    const anchor = { x: 0, y: 300, width: 50, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, { placement: "bottom", arrow });
    // Shifted to x = 0, so the arrow sits over the anchor's centre at 25.
    expect(r.arrow).toEqual({ x: 21, centerOffset: 0 });
  });

  it("is absent unless requested", () => {
    expect(at("top").arrow).toBeUndefined();
  });
});

describe("flip and shift together", () => {
  it("flips first, then shifts the flipped placement", () => {
    // No room above, and the anchor is hard against the left edge.
    const anchor = { x: 0, y: 10, width: 50, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, { placement: "top", padding: 8 });
    expect(r).toMatchObject({ placement: "bottom", x: 8, y: 60 });
  });

  it("resolves rtl before flipping", () => {
    // `leftTop` mirrors to `right-start`, which has no room, so it flips back to left.
    const anchor = { x: 940, y: 300, width: 50, height: 50 };
    const r = computePosition(anchor, FLOATING, VIEWPORT, { placement: "leftTop", rtl: true });
    expect(r.placement).toBe("left-start");
    expect(r.x).toBe(740);
  });
});

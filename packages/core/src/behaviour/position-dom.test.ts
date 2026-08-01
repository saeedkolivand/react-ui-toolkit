import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyPosition, measure, rectOf, viewportRect, type PositionResult } from "./position-dom";

const el = () => document.getElementById("floating")!;

const result = (overrides: Partial<PositionResult> = {}): PositionResult => ({
  x: 120,
  y: 40,
  placement: "bottom-start",
  rtl: false,
  available: { width: 800, height: 300 },
  ...overrides,
});

beforeEach(() => {
  document.body.innerHTML = '<div id="floating"></div>';
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("applyPosition available space", () => {
  it("still positions a result that carries no available space", () => {
    // The docblock invites a caller to apply a position it computed elsewhere,
    // and `available` arrived after that promise did. Required, it threw here —
    // after left, top and data-placement were already written, leaving the
    // element half-positioned rather than failing cleanly.
    const { available: _omitted, ...withoutAvailable } = result();
    expect(() => applyPosition(el(), withoutAvailable)).not.toThrow();
    expect(el().style.left).toBe("120px");
    expect(el().dataset.placement).toBe("bottom-start");
    expect(el().style.getPropertyValue("--ck-available-height")).toBe("");
  });

  it("publishes the room on the chosen side, for popups that scroll", () => {
    applyPosition(el(), result({ available: { width: 640, height: 210 } }));
    // A menu caps its own `max-height` against this. Without it the box takes
    // its fallback height and runs off the bottom of the viewport with the last
    // items unreachable — and neither flip nor shift can help, because content
    // taller than both sides fits on neither.
    expect(el().style.getPropertyValue("--ck-available-height")).toBe("210px");
    expect(el().style.getPropertyValue("--ck-available-width")).toBe("640px");
  });
});

describe("applyPosition", () => {
  it("sets position: fixed alongside the coordinates", () => {
    // The coordinates are viewport-relative, which is only what `fixed` means.
    // Under `absolute` they would be measured from whichever ancestor happened
    // to be the containing block — a different, silently wrong place. Left to a
    // stylesheet this can be overridden, scoped away, or never written for a
    // component added later.
    applyPosition(el(), result());
    expect(el().style.position).toBe("fixed");
    expect(el().style.left).toBe("120px");
    expect(el().style.top).toBe("40px");
  });

  it("overrides a position the element already had", () => {
    el().style.position = "absolute";
    applyPosition(el(), result());
    expect(el().style.position).toBe("fixed");
  });

  it("publishes the resolved placement, not the requested one", () => {
    // After a flip this is the only value that matches what the user sees, and
    // the stylesheet points the arrow and picks the enter animation from it.
    applyPosition(el(), result({ placement: "top-end" }));
    expect(el().dataset.placement).toBe("top-end");
  });

  it("leaves transform alone", () => {
    // Reserved for the animation layer, which scales and translates these same
    // elements. Sharing it would make every animation re-apply the offset.
    el().style.transform = "scale(0.95)";
    applyPosition(el(), result());
    expect(el().style.transform).toBe("scale(0.95)");
  });

  describe("arrow", () => {
    it("writes the offset on whichever axis the arrow slides", () => {
      applyPosition(el(), result({ arrow: { x: 24, centerOffset: 0 } }));
      expect(el().style.getPropertyValue("--ck-arrow-x")).toBe("24px");
      expect(el().style.getPropertyValue("--ck-arrow-y")).toBe("");
    });

    it("marks an arrow that no longer reaches its anchor", () => {
      applyPosition(el(), result({ arrow: { x: 8, centerOffset: -7 } }));
      expect(el().dataset.arrowDetached).toBe("");
    });

    it("clears the mark when the arrow reaches again", () => {
      applyPosition(el(), result({ arrow: { x: 8, centerOffset: -7 } }));
      applyPosition(el(), result({ arrow: { x: 24, centerOffset: 0 } }));
      // Left behind, the arrow would stay hidden for the rest of the layer's
      // life — the stale-attribute failure the spread directive exists for.
      expect(el().dataset.arrowDetached).toBeUndefined();
    });

    it("touches nothing arrow-related when no arrow was requested", () => {
      applyPosition(el(), result());
      expect(el().style.getPropertyValue("--ck-arrow-x")).toBe("");
      expect(el().dataset.arrowDetached).toBeUndefined();
    });
  });
});

describe("measure", () => {
  it("makes the element fixed before reading its rect", () => {
    // The read is what depends on the precondition, not the write: a block
    // element with no width fills its container while static and shrinks to its
    // content once fixed, so measuring first hands `computePosition` a box the
    // element will never have. Recorded here so the order cannot be reversed
    // without a failure; the e2e suite proves the consequence in a real layout.
    const positionsWhenRead: string[] = [];
    Element.prototype.getBoundingClientRect = function (this: HTMLElement) {
      if (this.id === "floating") positionsWhenRead.push(this.style.position);
      return { x: 0, y: 0, width: 10, height: 10 } as DOMRect;
    };

    document.body.innerHTML = '<div id="anchor"></div><div id="floating"></div>';
    measure(document.getElementById("anchor")!, document.getElementById("floating")!);

    expect(positionsWhenRead).toEqual(["fixed"]);
  });
});

describe("rectOf", () => {
  it("reports the element's own box", () => {
    Element.prototype.getBoundingClientRect = () =>
      ({ x: 5, y: 10, width: 100, height: 20 }) as DOMRect;
    expect(rectOf(el())).toEqual({ x: 5, y: 10, width: 100, height: 20 });
  });
});

describe("viewportRect", () => {
  it("measures the viewport without the classic scrollbar", () => {
    // `innerWidth` includes it, which would put the shift boundary underneath
    // the scrollbar rather than beside it.
    Object.defineProperty(document.documentElement, "clientWidth", {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 800,
      configurable: true,
    });
    expect(viewportRect()).toEqual({ x: 0, y: 0, width: 1000, height: 800 });
  });
});

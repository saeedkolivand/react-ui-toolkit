import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flip, flipLayout, measureLayout } from "./layout";

/**
 * jsdom does no layout, so `getBoundingClientRect` is driven from a table the
 * test controls. That is exactly the right seam here: FLIP is arithmetic over
 * two measurements, and the arithmetic is what can be wrong.
 */
let rects = new Map<Element, DOMRect>();

const rect = (x: number, y: number, width = 100, height = 20) =>
  ({ x, y, width, height, top: y, left: x, right: x + width, bottom: y + height }) as DOMRect;

let recorded: Array<{ keyframes: Keyframe[]; options: KeyframeAnimationOptions }> = [];

beforeEach(() => {
  rects = new Map();
  recorded = [];
  document.body.innerHTML = '<div id="a"></div><div id="b"></div>';

  Element.prototype.getBoundingClientRect = function () {
    return rects.get(this) ?? rect(0, 0, 0, 0);
  };
  Element.prototype.animate = function (keyframes, options) {
    recorded.push({
      keyframes: keyframes as Keyframe[],
      options: options as KeyframeAnimationOptions,
    });
    return {
      finished: Promise.resolve(),
      cancel: vi.fn(),
      finish: vi.fn(),
    } as unknown as Animation;
  } as Element["animate"];
  Element.prototype.getAnimations = () => [];
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal("CSS", { supports: () => true });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

const el = (id: string) => document.getElementById(id)!;
const transformOf = (index = 0) => String(recorded[index]!.keyframes[0]!.transform);

describe("flip", () => {
  it("inverts the movement, so the element starts where it used to be", () => {
    rects.set(el("a"), rect(0, 0));
    const snapshot = measureLayout([el("a")]);

    rects.set(el("a"), rect(0, 60));
    flip(snapshot);

    // Moved down 60, so it starts 60 above and animates to nothing.
    expect(transformOf()).toBe("translate(0px, -60px) scale(1, 1)");
    expect(recorded[0]!.keyframes[1]).toEqual({ transform: "none" });
  });

  it("skips an element that did not move", () => {
    rects.set(el("a"), rect(0, 0));
    const snapshot = measureLayout([el("a")]);
    flip(snapshot);
    expect(recorded).toHaveLength(0);
  });

  it("skips movement below the threshold", () => {
    rects.set(el("a"), rect(0, 0));
    const snapshot = measureLayout([el("a")]);
    rects.set(el("a"), rect(0, 0.5));
    flip(snapshot);
    expect(recorded).toHaveLength(0);
  });

  it("leaves size alone unless asked", () => {
    // Scaling a box scales its text too, so most list reordering wants
    // position only.
    rects.set(el("a"), rect(0, 0, 100, 20));
    const snapshot = measureLayout([el("a")]);
    rects.set(el("a"), rect(0, 60, 200, 40));
    flip(snapshot);
    expect(transformOf()).toBe("translate(0px, -60px) scale(1, 1)");
  });

  it("inverts size when asked", () => {
    rects.set(el("a"), rect(0, 0, 100, 20));
    const snapshot = measureLayout([el("a")]);
    rects.set(el("a"), rect(0, 0, 200, 40));
    flip(snapshot, { scale: true });
    expect(transformOf()).toBe("translate(0px, 0px) scale(0.5, 0.5)");
  });

  it("does not divide by zero on a collapsed element", () => {
    // A row measured while hidden has no size; scaling from it would be Infinity.
    rects.set(el("a"), rect(0, 0, 100, 20));
    const snapshot = measureLayout([el("a")]);
    rects.set(el("a"), rect(0, 60, 0, 0));
    flip(snapshot, { scale: true });
    expect(transformOf()).toBe("translate(0px, -60px) scale(1, 1)");
  });

  it("skips an element that has left the document", () => {
    rects.set(el("a"), rect(0, 0));
    const snapshot = measureLayout([el("a")]);
    el("a").remove();
    expect(() => flip(snapshot)).not.toThrow();
    expect(recorded).toHaveLength(0);
  });

  it("animates several elements independently", () => {
    rects.set(el("a"), rect(0, 0));
    rects.set(el("b"), rect(0, 20));
    const snapshot = measureLayout([el("a"), el("b")]);

    rects.set(el("a"), rect(0, 20));
    rects.set(el("b"), rect(0, 0));
    const handles = flip(snapshot);

    expect(handles).toHaveLength(2);
    expect(transformOf(0)).toBe("translate(0px, -20px) scale(1, 1)");
    expect(transformOf(1)).toBe("translate(0px, 20px) scale(1, 1)");
  });

  it("holds the inverted transform through a delay, and retains nothing after", () => {
    // `both` would pin an inline `transform: none` over the stylesheet, but
    // `none` drops the backwards fill — so a delayed flip paints at the *new*
    // position for the whole delay and then snaps back, showing the jump the
    // inversion exists to hide. `stagger()` produces exactly such delays.
    rects.set(el("a"), rect(0, 0));
    const snapshot = measureLayout([el("a")]);
    rects.set(el("a"), rect(0, 60));
    flip(snapshot, { delay: 100 });
    expect(recorded[0]!.options.fill).toBe("backwards");
    expect(recorded[0]!.options.delay).toBe(100);
  });

  it("passes spring options through", () => {
    rects.set(el("a"), rect(0, 0));
    const snapshot = measureLayout([el("a")]);
    rects.set(el("a"), rect(0, 60));
    flip(snapshot, { spring: { stiffness: 200, damping: 15 } });
    expect(recorded[0]!.options.easing).toMatch(/^linear\(/);
  });
});

describe("flipLayout", () => {
  it("measures, applies the change, then animates from the old positions", () => {
    rects.set(el("a"), rect(0, 0));
    flipLayout([el("a")], () => {
      rects.set(el("a"), rect(0, 100));
    });
    expect(transformOf()).toBe("translate(0px, -100px) scale(1, 1)");
  });

  it("measures before the change runs, not after", () => {
    // The whole technique depends on this ordering; reversing it measures the
    // same layout twice and animates nothing.
    const order: string[] = [];
    rects.set(el("a"), rect(0, 0));
    Element.prototype.getBoundingClientRect = function () {
      order.push("measure");
      return rects.get(this) ?? rect(0, 0, 0, 0);
    };
    flipLayout([el("a")], () => order.push("change"));
    expect(order).toEqual(["measure", "change", "measure"]);
  });
});

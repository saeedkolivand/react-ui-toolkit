import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flip, flipLayout, measureLayout } from "./layout";
import { createDrag } from "./gesture";

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

  it("leaves no inline transform behind", () => {
    // `fill: both` would pin the element at `transform: none` and silently
    // override whatever the stylesheet sets next.
    rects.set(el("a"), rect(0, 0));
    const snapshot = measureLayout([el("a")]);
    rects.set(el("a"), rect(0, 60));
    flip(snapshot);
    expect(recorded[0]!.options.fill).toBe("none");
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

describe("createDrag", () => {
  const pointer = (type: string, x: number, y: number, t = 0, pointerId = 1, button = 0) => {
    const event = new Event(type, { bubbles: true }) as PointerEvent;
    Object.assign(event, { clientX: x, clientY: y, pointerId, pointerType: "mouse", button });
    // `timeStamp` is getter-only, and velocity is measured from it — so it has
    // to be defined rather than assigned.
    Object.defineProperty(event, "timeStamp", { value: t, configurable: true });
    return event;
  };

  beforeEach(() => {
    Element.prototype.setPointerCapture = vi.fn();
    Element.prototype.releasePointerCapture = vi.fn();
    Element.prototype.hasPointerCapture = () => true;
  });

  it("does not start until the threshold is passed", () => {
    const onStart = vi.fn();
    createDrag(el("a"), { onStart, threshold: 10 });

    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    el("a").dispatchEvent(pointer("pointermove", 5, 0, 10));
    expect(onStart).not.toHaveBeenCalled();

    el("a").dispatchEvent(pointer("pointermove", 20, 0, 20));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("captures the pointer only once the gesture is real", () => {
    // Capturing on pointerdown would swallow plain clicks.
    createDrag(el("a"), { threshold: 10 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    expect(Element.prototype.setPointerCapture).not.toHaveBeenCalled();

    el("a").dispatchEvent(pointer("pointermove", 20, 0, 20));
    expect(Element.prototype.setPointerCapture).toHaveBeenCalled();
  });

  it("reports movement from the origin", () => {
    const onMove = vi.fn();
    createDrag(el("a"), { onMove, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 10, 10));
    el("a").dispatchEvent(pointer("pointermove", 40, 30, 16));
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ dx: 30, dy: 20 }));
  });

  it("measures velocity in pixels per second", () => {
    const onEnd = vi.fn();
    createDrag(el("a"), { onEnd, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0, 0));
    el("a").dispatchEvent(pointer("pointermove", 50, 0, 50));
    el("a").dispatchEvent(pointer("pointerup", 50, 0, 50));
    // 50px over 50ms.
    expect(onEnd.mock.calls[0]![0].vx).toBeCloseTo(1000, 0);
  });

  it("reports zero velocity rather than Infinity for a single-frame gesture", () => {
    const onEnd = vi.fn();
    createDrag(el("a"), { onEnd, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0, 5));
    el("a").dispatchEvent(pointer("pointermove", 50, 0, 5));
    el("a").dispatchEvent(pointer("pointerup", 50, 0, 5));
    expect(onEnd.mock.calls[0]![0].vx).toBe(0);
  });

  it("ignores the axis it was not asked to track", () => {
    const onMove = vi.fn();
    createDrag(el("a"), { onMove, axis: "x", threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    el("a").dispatchEvent(pointer("pointermove", 30, 40, 16));
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ dx: 30, dy: 0 }));
  });

  it("measures the threshold on the tracked axis only", () => {
    const onStart = vi.fn();
    createDrag(el("a"), { onStart, axis: "x", threshold: 10 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    // Straight down: no horizontal movement, so a horizontal drag never starts
    // and the page keeps its scroll.
    el("a").dispatchEvent(pointer("pointermove", 0, 50, 16));
    expect(onStart).not.toHaveBeenCalled();
  });

  it("ends on pointercancel, not just pointerup", () => {
    // The browser takes the gesture over when a scroll starts; without this the
    // element stays stuck mid-swipe.
    const onEnd = vi.fn();
    createDrag(el("a"), { onEnd, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    el("a").dispatchEvent(pointer("pointermove", 30, 0, 16));
    el("a").dispatchEvent(pointer("pointercancel", 30, 0, 20));
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("does not report an end for a gesture that never started", () => {
    const onEnd = vi.fn();
    createDrag(el("a"), { onEnd, threshold: 10 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    el("a").dispatchEvent(pointer("pointerup", 2, 0, 16));
    expect(onEnd).not.toHaveBeenCalled();
  });

  it("ignores a secondary mouse button", () => {
    const onStart = vi.fn();
    createDrag(el("a"), { onStart, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0, 0, 1, 2));
    el("a").dispatchEvent(pointer("pointermove", 30, 0, 16));
    expect(onStart).not.toHaveBeenCalled();
  });

  it("ignores a second pointer mid-gesture", () => {
    const onMove = vi.fn();
    createDrag(el("a"), { onMove, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0, 0, 1));
    el("a").dispatchEvent(pointer("pointermove", 30, 0, 16, 2));
    expect(onMove).not.toHaveBeenCalled();
  });

  it("detaches every listener", () => {
    const onStart = vi.fn();
    const stop = createDrag(el("a"), { onStart, threshold: 1 });
    stop();
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    el("a").dispatchEvent(pointer("pointermove", 30, 0, 16));
    expect(onStart).not.toHaveBeenCalled();
  });
});

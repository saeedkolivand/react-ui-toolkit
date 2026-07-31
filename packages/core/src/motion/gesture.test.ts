import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDrag } from "./gesture";

const el = (id: string) => document.getElementById(id)!;

beforeEach(() => {
  document.body.innerHTML = '<div id="a"></div>';
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.hasPointerCapture = () => true;
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

  it("measures velocity to the release, not to the last move", () => {
    // Drag fast, hold perfectly still, let go. Without tracking the release the
    // window still ended at the last move and reported the old fast movement --
    // a deliberate hold dismissed as a flick. Jittery holds happened to work,
    // because the jitter refreshed the window, so it was intermittent.
    const onEnd = vi.fn();
    createDrag(el("a"), { onEnd, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0, 0));
    el("a").dispatchEvent(pointer("pointermove", 50, 0, 50));
    document.dispatchEvent(pointer("pointerup", 50, 0, 1050));
    expect(onEnd.mock.calls[0]![0].vx).toBeCloseTo(0, 5);
  });

  it("recovers when the pointer leaves the element before the threshold", () => {
    // Capture is deferred until the threshold, so the pointer can leave with
    // nothing capturing it. With element-bound listeners the release was never
    // seen, pointerId stayed set, and every later press was rejected -- the
    // element dead to dragging until it remounted. `axis` widens the window:
    // dragging straight up off a toast never meets an x threshold.
    const onStart = vi.fn();
    createDrag(el("a"), { onStart, axis: "x", threshold: 10 });

    el("a").dispatchEvent(pointer("pointerdown", 0, 0, 0, 1));
    document.dispatchEvent(pointer("pointerup", 0, 80, 100, 1));

    // A real second press carries a new pointerId.
    el("a").dispatchEvent(pointer("pointerdown", 0, 0, 200, 2));
    el("a").dispatchEvent(pointer("pointermove", 50, 0, 220, 2));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("finishes on a release dispatched away from the element", () => {
    const onEnd = vi.fn();
    createDrag(el("a"), { onEnd, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    el("a").dispatchEvent(pointer("pointermove", 30, 0, 16));
    document.dispatchEvent(pointer("pointerup", 300, 300, 32));
    expect(onEnd).toHaveBeenCalledTimes(1);
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

  it("detaches the document listeners even if torn down mid-gesture", () => {
    const onMove = vi.fn();
    const stop = createDrag(el("a"), { onMove, threshold: 1 });
    el("a").dispatchEvent(pointer("pointerdown", 0, 0));
    stop();
    document.dispatchEvent(pointer("pointermove", 30, 0, 16));
    expect(onMove).not.toHaveBeenCalled();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { animate, prefersReducedMotion, retarget } from "./animate";

/**
 * jsdom implements neither `Element.animate` nor `matchMedia`, so both are
 * stubbed. What is being tested is the options this module *computes* — the
 * duration, the easing, whether reduced motion collapsed it — not whether the
 * browser then honours them, which is the parity suite's job.
 */
interface Recorded {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}

let recorded: Recorded[] = [];
let running: Animation[] = [];

const fakeAnimation = (onCancel?: () => void) => {
  const animation = {
    finished: Promise.resolve(),
    // A real `cancel()` snaps the element back to its pre-animation style.
    // Modelling that is what lets a test see the read/cancel ordering at all.
    cancel: vi.fn(onCancel),
    finish: vi.fn(),
    playState: "running",
  } as unknown as Animation;
  running.push(animation);
  return animation;
};

beforeEach(() => {
  recorded = [];
  running = [];
  document.body.innerHTML = '<div id="el"></div>';

  Element.prototype.animate = function (keyframes, options) {
    recorded.push({
      keyframes: keyframes as Keyframe[],
      options: options as KeyframeAnimationOptions,
    });
    return fakeAnimation();
  } as Element["animate"];

  Element.prototype.getAnimations = () => running;
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal("CSS", { supports: () => true });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

const el = () => document.getElementById("el")!;
const lastCall = () => recorded[recorded.length - 1]!;

describe("animate", () => {
  it("uses a fixed duration and easing when given them", () => {
    animate(el(), [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
    expect(lastCall().options).toMatchObject({ duration: 300, easing: "ease-out" });
  });

  it("derives duration and easing from a spring", () => {
    animate(el(), [{ opacity: 0 }, { opacity: 1 }], { spring: { stiffness: 180, damping: 12 } });
    const { duration, easing } = lastCall().options;
    expect(easing).toMatch(/^linear\(/);
    expect(duration).toBeGreaterThan(0);
  });

  it("lets a spring override an explicit duration", () => {
    // The sampled curve is normalised to the spring's own duration, so pairing
    // it with a different one plays the wrong motion.
    animate(el(), [{ opacity: 1 }], { duration: 999, spring: {} });
    expect(lastCall().options.duration).not.toBe(999);
  });

  it("fills both directions by default", () => {
    // Without this the element snaps back to its pre-animation style the
    // instant the animation ends.
    animate(el(), [{ opacity: 1 }]);
    expect(lastCall().options.fill).toBe("both");
  });

  it("collapses to one frame under reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    animate(el(), [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
    // One frame rather than skipping outright, so `finished` still resolves on
    // the same code path and callers need no special case.
    expect(lastCall().options.duration).toBe(1);
  });

  it("resolves rather than rejects when cancelled", async () => {
    // `animation.finished` rejects with AbortError on cancel, which would be an
    // unhandled rejection in every caller that does not care. Cancelling is a
    // normal outcome here.
    Element.prototype.animate = (() =>
      ({
        finished: Promise.reject(new DOMException("aborted", "AbortError")),
        cancel: vi.fn(),
        finish: vi.fn(),
      }) as unknown as Animation) as Element["animate"];

    await expect(animate(el(), [{ opacity: 1 }]).finished).resolves.toBeUndefined();
  });

  it("falls back to a parseable easing where linear() is unsupported", () => {
    // `element.animate()` throws on an easing it cannot parse, which would make
    // this the only path in the module that fails hard rather than degrading.
    vi.stubGlobal("CSS", { supports: () => false });
    animate(el(), [{ opacity: 1 }], { spring: { stiffness: 180, damping: 12 } });
    expect(lastCall().options.easing).toBe("ease-out");
  });

  it("applies the end state when the platform has no WAAPI", () => {
    // @ts-expect-error deliberately removing the method
    delete Element.prototype.animate;
    animate(el(), [{ opacity: "0" }, { opacity: "0.5" }]);
    expect(el().style.opacity).toBe("0.5");
  });
});

describe("retarget", () => {
  it("starts from the element's current computed value", () => {
    // Cancel-then-restart snaps back to the pre-animation state first, so an
    // interrupted fade visibly jumps before starting again.
    el().style.opacity = "0.4";
    retarget(el(), ["opacity"], { opacity: 1 });
    expect(lastCall().keyframes[0]).toEqual({ opacity: "0.4" });
  });

  it("reads the current value before cancelling, not after", () => {
    // The invariant the whole function exists for, and it was previously
    // untestable: with a cancel that does not touch the element, moving the
    // cancel loop above the read left all tests green while restoring the
    // tooltip-jumps-to-transparent bug.
    el().style.opacity = "0.4";
    fakeAnimation(() => {
      el().style.opacity = "";
    });

    retarget(el(), ["opacity"], { opacity: 1 });
    expect(lastCall().keyframes[0]).toEqual({ opacity: "0.4" });
  });

  it("does not throw where getAnimations is missing", () => {
    // The same environment `animate` deliberately degrades for. `getAnimations`
    // also postdates `animate` by years, so an engine can have one without it.
    // @ts-expect-error deliberately removing the method
    delete Element.prototype.getAnimations;
    expect(() => retarget(el(), ["opacity"], { opacity: 1 })).not.toThrow();
  });

  it("cancels whatever was already running", () => {
    const existing = fakeAnimation();
    retarget(el(), ["opacity"], { opacity: 1 });
    expect(existing.cancel).toHaveBeenCalled();
  });

  it("converts camelCase properties for the computed lookup", () => {
    el().style.backgroundColor = "rgb(1, 2, 3)";
    retarget(el(), ["backgroundColor"], { backgroundColor: "rgb(4, 5, 6)" });
    expect(lastCall().keyframes[0]).toEqual({ backgroundColor: "rgb(1, 2, 3)" });
  });
});

describe("prefersReducedMotion", () => {
  it("reports what the media query says", () => {
    expect(prefersReducedMotion()).toBe(false);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    expect(prefersReducedMotion()).toBe(true);
  });

  it("is false where matchMedia does not exist", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(prefersReducedMotion()).toBe(false);
  });
});

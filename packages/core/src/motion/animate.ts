/**
 * The imperative animation path, over the Web Animations API.
 *
 * Most motion in this library never reaches here: component enter and exit are
 * CSS keyframes with a `linear()` spring easing, which the compositor runs with
 * no JavaScript at all. This exists for what CSS cannot express — an animation
 * that has to be *interrupted* and continue from wherever it currently is, and
 * one whose keyframes are only known at runtime, which is what FLIP produces.
 *
 * WAAPI rather than writing styles each frame: it composites off the main
 * thread for transform and opacity, and it can report a running animation's
 * current value, which is exactly what interruption needs.
 */

import { toLinearEasing, type SpringOptions } from "./spring";

export interface AnimateOptions {
  /** Fixed duration in ms. Ignored when `spring` is given. */
  duration?: number;
  easing?: string;
  /** Derive duration and easing from spring physics instead. */
  spring?: SpringOptions;
  delay?: number;
  fill?: FillMode;
}

export interface AnimationHandle {
  /** Resolves when the animation finishes; rejects on nothing — cancel resolves it. */
  finished: Promise<void>;
  cancel(): void;
  /** Leaves the element at its end state without playing the rest. */
  finish(): void;
}

/**
 * Whether the environment will actually animate.
 *
 * Respected here rather than in each component, so a component cannot forget.
 * `reduce` collapses duration to a single frame instead of skipping the
 * animation, which keeps `finished` resolving on the same code path.
 */
export const prefersReducedMotion = (): boolean =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const NOOP_HANDLE: AnimationHandle = {
  finished: Promise.resolve(),
  cancel() {},
  finish() {},
};

export function animate(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: AnimateOptions = {}
): AnimationHandle {
  // No WAAPI at all — jsdom, or a very old engine. Jump to the end state so the
  // element still lands where the caller intended.
  if (typeof element.animate !== "function") {
    const last = keyframes[keyframes.length - 1];
    if (last) Object.assign(element.style, last);
    return NOOP_HANDLE;
  }

  const spring = options.spring ? toLinearEasing(options.spring) : undefined;
  const duration = prefersReducedMotion() ? 1 : (spring?.duration ?? options.duration ?? 200);

  const animation = element.animate(keyframes, {
    duration,
    easing: spring?.easing ?? options.easing ?? "ease",
    delay: options.delay ?? 0,
    fill: options.fill ?? "both",
  });

  return {
    // `animation.finished` rejects with an AbortError when cancelled, which
    // would be an unhandled rejection in every caller that does not care.
    // Cancelling is a normal outcome here, not a failure.
    finished: animation.finished.then(
      () => undefined,
      () => undefined
    ),
    cancel: () => animation.cancel(),
    finish: () => animation.finish(),
  };
}

/**
 * Restarts an animation from wherever the element currently *is*.
 *
 * The reason this is not just `cancel()` then `animate()`: cancelling snaps the
 * element back to its pre-animation state, so a tooltip interrupted halfway
 * through its fade jumps to fully transparent and then fades in again. Reading
 * the computed value first and starting from there is what makes an interrupted
 * animation look continuous.
 */
export function retarget(
  element: HTMLElement,
  properties: string[],
  to: Keyframe,
  options: AnimateOptions = {}
): AnimationHandle {
  const computed = getComputedStyle(element);
  const from: Keyframe = {};
  for (const property of properties) {
    from[property] = computed.getPropertyValue(
      property.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
    );
  }

  for (const existing of element.getAnimations({ subtree: false })) existing.cancel();
  return animate(element, [from, to], options);
}

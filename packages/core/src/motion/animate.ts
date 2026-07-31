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

/**
 * Whether the engine understands `linear()`.
 *
 * Baseline since late 2025, so this is a shrinking tail — but an easing string
 * the engine rejects makes `element.animate()` throw, and nothing else in this
 * file fails that way rather than degrading.
 *
 * Deliberately not cached. One `CSS.supports` parse per animation is nothing
 * next to the animation itself, and a module-level cache would freeze whatever
 * the first call saw — including a server render, where `CSS` does not exist at
 * all and every later spring on the client would silently lose its curve.
 */
const supportsLinearEasing = (): boolean =>
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("transition-timing-function", "linear(0, 1)");

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

  // `element.animate()` throws on an easing it cannot parse, which would make
  // this the one path in the file that fails hard instead of degrading. The
  // fallback loses the overshoot but keeps the motion.
  const easing = spring
    ? supportsLinearEasing()
      ? spring.easing
      : "ease-out"
    : (options.easing ?? "ease");

  const animation = element.animate(keyframes, {
    duration,
    easing,
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

  // Cancelled only after the read above. Reversing these two is the bug this
  // function exists to prevent, and it is silent: cancelling snaps the element
  // back to its pre-animation style, so `from` would capture the state the
  // interrupted animation started at rather than where it had reached.
  //
  // Guarded for the same reason `animate` guards `element.animate`: this is the
  // environment that has neither, and `getAnimations` postdates `animate` by
  // several years, so an engine can have one without the other.
  if (typeof element.getAnimations === "function") {
    for (const existing of element.getAnimations({ subtree: false })) existing.cancel();
  }
  return animate(element, [from, to], options);
}

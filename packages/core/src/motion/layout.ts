/**
 * FLIP: animating a layout change that has already happened.
 *
 * The browser cannot tween layout — a row moving because its neighbour was
 * removed simply *is* somewhere else on the next frame. FLIP animates it anyway
 * by inverting the change: measure First, let the layout change (Last), apply a
 * transform that puts everything visually back where it was (Invert), then
 * animate that transform away (Play).
 *
 * This is why the motion engine cannot be CSS alone. Toast stacks resettling
 * after one is dismissed, and table rows moving on sort, are exactly this — and
 * both have keyframes that are only knowable at runtime.
 *
 * Only `transform` and `opacity` are animated, never width or height: those
 * trigger layout on every frame of the animation, which is the thing FLIP
 * exists to avoid. Size changes are expressed as `scale`.
 */

import { animate, type AnimateOptions, type AnimationHandle } from "./animate";

export interface Snapshot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type LayoutSnapshot = Map<Element, Snapshot>;

const snapshotOf = (element: Element): Snapshot => {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x, y, width, height };
};

/** Measures where everything is now. Call before the change. */
export function measureLayout(elements: Iterable<Element>): LayoutSnapshot {
  const snapshot: LayoutSnapshot = new Map();
  for (const element of elements) snapshot.set(element, snapshotOf(element));
  return snapshot;
}

export interface FlipOptions extends AnimateOptions {
  /**
   * Animate size as well as position. Off by default: most list reordering
   * moves items without resizing them, and scaling a box also scales its text.
   */
  scale?: boolean;
  /** Below this many pixels of movement, skip the animation entirely. */
  threshold?: number;
}

/**
 * Plays the inverted transform for everything that moved.
 *
 * Elements absent from the snapshot are new, and elements in the snapshot that
 * have since left the document are gone — both are skipped rather than guessed
 * at, because a FLIP has nothing to say about an element that has no "before"
 * or no "after".
 */
export function flip(snapshot: LayoutSnapshot, options: FlipOptions = {}): AnimationHandle[] {
  const { scale = false, threshold = 1, ...animateOptions } = options;
  const handles: AnimationHandle[] = [];

  for (const [element, before] of snapshot) {
    if (!element.isConnected || !(element instanceof HTMLElement)) continue;

    const after = snapshotOf(element);
    const dx = before.x - after.x;
    const dy = before.y - after.y;
    // Guard against a zero-size element — a collapsed row, or one measured
    // while hidden — which would otherwise produce a scale of Infinity.
    const sx = scale && after.width > 0 ? before.width / after.width : 1;
    const sy = scale && after.height > 0 ? before.height / after.height : 1;

    const moved = Math.abs(dx) >= threshold || Math.abs(dy) >= threshold;
    const resized = scale && (Math.abs(sx - 1) > 0.001 || Math.abs(sy - 1) > 0.001);
    if (!moved && !resized) continue;

    handles.push(
      animate(
        element,
        [{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transform: "none" }],
        // `backwards`, not `none` and not `both`.
        //
        // `both` would pin an inline `transform: none` over whatever the
        // stylesheet sets next. But `none` also drops the *backwards* fill, and
        // `delay` is part of this function's surface -- so a delayed flip paints
        // at the new layout position for the whole delay, then snaps back to the
        // inverted transform: exactly the jump the inversion exists to hide.
        // That pairing is not hypothetical, since `stagger()` produces delays.
        //
        // `backwards` holds the first keyframe during the delay and retains
        // nothing after the active phase, which is both properties at once.
        { fill: "backwards", ...animateOptions }
      )
    );
  }

  return handles;
}

/**
 * Measure, apply the change, then animate from the old positions.
 *
 * `change` must be synchronous: the whole technique depends on measuring the
 * new layout in the same frame the old one was measured, before a paint lands
 * in between and shows the jump this is meant to hide.
 */
export function flipLayout(
  elements: Iterable<Element>,
  change: () => void,
  options: FlipOptions = {}
): AnimationHandle[] {
  const snapshot = measureLayout(elements);
  change();
  return flip(snapshot, options);
}

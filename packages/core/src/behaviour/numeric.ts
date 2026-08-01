/**
 * The arithmetic behind every control that picks a number.
 *
 * Slider, InputNumber and Rate all clamp to a range, snap to a step and move by
 * a step on an arrow key. Written once and framework-free, because the same
 * three components exist in four adapters and floating-point step maths is not
 * something to get right four times.
 */

export interface NumericRange {
  min: number;
  max: number;
  /** The granularity values snap to. `0` or less means no snapping. */
  step: number;
}

/** Bring a value inside `[min, max]`, tolerating a reversed range. */
export const clamp = (value: number, min: number, max: number): number =>
  min > max ? clamp(value, max, min) : Math.min(Math.max(value, min), max);

/**
 * How many decimal places a number is written with.
 *
 * From the string, not from arithmetic: `0.1` is not exactly a tenth in binary,
 * so any sum-based approach inherits the error it is meant to remove.
 * Exponent form is handled because `1e-7` stringifies that way and would
 * otherwise read as zero decimals.
 */
export const decimals = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  const text = String(value);
  const exponent = text.indexOf("e-");
  if (exponent >= 0)
    return Number(text.slice(exponent + 2)) + decimals(Number(text.slice(0, exponent)));
  const point = text.indexOf(".");
  return point < 0 ? 0 : text.length - point - 1;
};

/**
 * Snap to the nearest step above `min`, then clamp.
 *
 * Rounded back to the precision of the inputs, because `0.1 + 0.2` is
 * `0.30000000000000004` and a slider that reports that has a bug a consumer
 * cannot fix. The precision comes from `step` and `min` together — a step of
 * `0.1` from a min of `0.05` lands on values with two decimals, not one.
 */
export const snap = (value: number, { min, max, step }: NumericRange): number => {
  const bounded = clamp(value, min, max);
  if (!(step > 0)) return bounded;
  // Steps are counted from `min`, and an unbounded min makes that count
  // infinite — `min + Infinity * step` is NaN, which reaches a component as a
  // value that renders nothing and compares false to everything. An open-ended
  // range still has a grid; it is just anchored at zero instead.
  const origin = Number.isFinite(min) ? min : 0;
  const steps = Math.round((bounded - origin) / step);
  const places = Math.max(decimals(step), decimals(origin));
  const snapped = Number((origin + steps * step).toFixed(places));
  // Snapping can overshoot when the range is not a whole number of steps: a
  // 0..10 range with step 3 rounds 10 to 9, and rounds 9.5 up to 12 without
  // this. Clamping after is what keeps the result inside the range.
  return clamp(snapped, min, max);
};

/** Move `count` steps from `value`, snapped and clamped. Negative goes down. */
export const stepBy = (value: number, count: number, range: NumericRange): number =>
  snap(value + count * (range.step > 0 ? range.step : 1), range);

/** Where `value` sits in the range, 0 to 1. A zero-width range reads as 0. */
export const ratio = (value: number, min: number, max: number): number =>
  max === min ? 0 : clamp((value - min) / (max - min), 0, 1);

/**
 * The inverse: a 0-to-1 position back to a value in the range.
 *
 * No clamp on `position` — a pointer dragged past the end of the track is the
 * ordinary case, and `snap` already pins the result to the range. Clamping here
 * as well was written first and measured to change nothing.
 */
export const fromRatio = (position: number, range: NumericRange): number =>
  snap(range.min + position * (range.max - range.min), range);

/**
 * What an arrow, page or home/end key does to a value.
 *
 * Returns `undefined` for a key this does not handle, so an adapter can tell
 * "handled, do not scroll" from "not ours, let it through". `rtl` flips only
 * the inline axis: Up and Down mean more and less in every direction.
 */
export const numericKey = (
  event: { key: string; shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean },
  value: number,
  range: NumericRange,
  options: { rtl?: boolean; pageSize?: number } = {}
): number | undefined => {
  if (event.ctrlKey || event.metaKey) return undefined;
  const page = options.pageSize ?? 10;
  const inline = options.rtl ? -1 : 1;
  // Shift takes a bigger bite, which is what every native range input does.
  const size = event.shiftKey ? page : 1;

  switch (event.key) {
    case "ArrowRight":
      return stepBy(value, size * inline, range);
    case "ArrowLeft":
      return stepBy(value, -size * inline, range);
    case "ArrowUp":
      return stepBy(value, size, range);
    case "ArrowDown":
      return stepBy(value, -size, range);
    case "PageUp":
      return stepBy(value, page, range);
    case "PageDown":
      return stepBy(value, -page, range);
    case "Home":
      return snap(range.min, range);
    case "End":
      return snap(range.max, range);
    default:
      return undefined;
  }
};

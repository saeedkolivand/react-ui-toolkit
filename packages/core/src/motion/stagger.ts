/**
 * Stagger: delays for a sequence, so a list arrives in order rather than all at
 * once.
 *
 * Pure arithmetic. It returns the delay each index should use; whoever is
 * animating decides what to do with it, which means the same function serves a
 * WAAPI `delay`, a CSS `animation-delay` custom property, or a `setTimeout`.
 */

export type StaggerOrigin = "first" | "last" | "center" | number;

export interface StaggerOptions {
  /** Milliseconds between neighbours. */
  each?: number;
  /** Which index goes first; everything else is ordered by distance from it. */
  from?: StaggerOrigin;
  /** Total time the whole sequence may take. Scales `each` down to fit. */
  total?: number;
}

const originIndex = (from: StaggerOrigin, count: number): number => {
  if (typeof from === "number") return Math.min(Math.max(from, 0), count - 1);
  if (from === "last") return count - 1;
  if (from === "center") return (count - 1) / 2;
  return 0;
};

/**
 * Delay in milliseconds for each index.
 *
 * Ordering is by *distance* from the origin, not by index, so `center` sends
 * the middle first and both edges outward together — the two neighbours of the
 * origin share a delay rather than one trailing the other.
 */
export function stagger(count: number, options: StaggerOptions = {}): number[] {
  if (count <= 0) return [];

  const { each = 50, from = "first", total } = options;
  const origin = originIndex(from, count);
  const distances = Array.from({ length: count }, (_, i) => Math.abs(i - origin));
  const furthest = Math.max(...distances);

  // `total` is a ceiling on the whole sequence, so a list of 200 does not take
  // ten seconds to appear. With one item, or an origin every item is equidistant
  // from, there is no spread to scale and `each` stands.
  const step = total !== undefined && furthest > 0 ? total / furthest : each;

  return distances.map(distance => distance * step);
}

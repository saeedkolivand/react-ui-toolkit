/**
 * An ordered list of selectable items, and the index arithmetic over it.
 *
 * Pure data — no DOM, no events. Select, Menu, Tabs, Tree, Radio and Segmented
 * all need "next enabled item, wrapping" and "first item starting with these
 * letters"; writing that once here is what keeps their keyboard behaviour
 * identical rather than six subtly different implementations.
 */

export interface CollectionItem<T = unknown> {
  value: string;
  /** What typeahead matches against, and what a screen reader announces. */
  label: string;
  disabled?: boolean;
  data?: T;
}

export interface Collection<T = unknown> {
  readonly items: ReadonlyArray<CollectionItem<T>>;
  indexOf(value: string | null): number;
  at(index: number): CollectionItem<T> | undefined;
  /** First enabled item, or undefined if every item is disabled. */
  first(): CollectionItem<T> | undefined;
  last(): CollectionItem<T> | undefined;
  next(value: string | null, options?: StepOptions): CollectionItem<T> | undefined;
  previous(value: string | null, options?: StepOptions): CollectionItem<T> | undefined;
  /** First enabled item whose label starts with `query`, searched from `after`. */
  search(query: string, after?: string | null): CollectionItem<T> | undefined;
}

export interface StepOptions {
  /** Wrap past the end. Menus and selects wrap; a stepper should not. */
  loop?: boolean;
}

const enabled = (item: CollectionItem<unknown>) => !item.disabled;

export function createCollection<T = unknown>(
  items: ReadonlyArray<CollectionItem<T>>
): Collection<T> {
  const indexOf = (value: string | null) =>
    value === null ? -1 : items.findIndex(item => item.value === value);

  /**
   * Walks in `step` direction from `from`, skipping disabled items.
   *
   * Bounded by the item count rather than by "until we find one", so a
   * collection where every item is disabled terminates instead of spinning.
   */
  const step = (from: number, direction: 1 | -1, loop: boolean) => {
    const count = items.length;
    if (count === 0) return undefined;

    let index = from;
    for (let taken = 0; taken < count; taken++) {
      index += direction;
      if (index >= count) {
        if (!loop) return undefined;
        index = 0;
      } else if (index < 0) {
        if (!loop) return undefined;
        index = count - 1;
      }
      const item = items[index];
      if (item && enabled(item)) return item;
    }
    return undefined;
  };

  return {
    items,
    indexOf,
    at: index => items[index],
    first: () => items.find(enabled),
    last: () => [...items].reverse().find(enabled),

    next(value, options = {}) {
      // From nothing, "next" means the first item, not the second.
      if (value === null || indexOf(value) === -1) return items.find(enabled);
      return step(indexOf(value), 1, options.loop ?? true);
    },

    previous(value, options = {}) {
      if (value === null || indexOf(value) === -1) return [...items].reverse().find(enabled);
      return step(indexOf(value), -1, options.loop ?? true);
    },

    search(query, after = null) {
      if (!query) return undefined;
      const needle = query.toLowerCase();
      const start = indexOf(after) + 1;
      // Rotated so the search starts just past the current item and wraps —
      // which is what makes pressing the same letter cycle through matches.
      for (let offset = 0; offset < items.length; offset++) {
        const item = items[(start + offset) % items.length];
        if (item && enabled(item) && item.label.toLowerCase().startsWith(needle)) return item;
      }
      return undefined;
    },
  };
}

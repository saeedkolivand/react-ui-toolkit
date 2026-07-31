/**
 * Keyboard navigation over a collection: arrows, Home/End, and typeahead.
 *
 * Pure: a key event description goes in, the value that should now be active
 * comes out. No DOM, no focus calls — the adapter owns those. That is what
 * makes every arrow-key and typeahead case a plain unit test.
 */

import type { Collection } from "./collection";

export interface NavigationOptions {
  orientation?: "horizontal" | "vertical" | "both";
  loop?: boolean;
  rtl?: boolean;
  /** Whether letter keys jump to a matching item. */
  typeahead?: boolean;
}

export interface KeyDescription {
  key: string;
  /** Set for any modifier that means the key is not plain navigation. */
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
}

export interface NavigationResult {
  /** The value that should become active, if the key changed it. */
  value?: string;
  /** Whether the key was consumed and its default should be prevented. */
  handled: boolean;
}

const NOT_HANDLED: NavigationResult = { handled: false };

/**
 * Typeahead buffer.
 *
 * Keystrokes accumulate for a short window so "st" finds "Strawberry" rather
 * than jumping to "S" then "T". Repeating one character is special-cased to
 * cycling through items starting with it, which is what every native select
 * does and what people expect without being told.
 */
export interface Typeahead {
  push(character: string): string;
  clear(): void;
  readonly query: string;
}

export function createTypeahead(timeout = 500): Typeahead {
  let query = "";
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    get query() {
      return query;
    },
    push(character) {
      if (timer !== undefined) clearTimeout(timer);
      query += character;
      timer = setTimeout(() => {
        query = "";
        timer = undefined;
      }, timeout);
      return query;
    },
    clear() {
      if (timer !== undefined) clearTimeout(timer);
      query = "";
      timer = undefined;
    },
  };
}

/** Whether every character in the query is the same one. */
const isRepeat = (query: string) => query.length > 1 && [...query].every(c => c === query[0]);

export function navigate(
  event: KeyDescription,
  collection: Collection,
  current: string | null,
  options: NavigationOptions = {},
  typeahead?: Typeahead
): NavigationResult {
  const { orientation = "vertical", loop = true, rtl = false } = options;

  // A modified key belongs to the browser or the OS — Ctrl+Home is "top of
  // document", not "first item".
  if (event.ctrlKey || event.metaKey || event.altKey) return NOT_HANDLED;

  const vertical = orientation === "vertical" || orientation === "both";
  const horizontal = orientation === "horizontal" || orientation === "both";
  // In RTL, ArrowRight moves toward the start of the list.
  const forwardKey = rtl ? "ArrowLeft" : "ArrowRight";
  const backwardKey = rtl ? "ArrowRight" : "ArrowLeft";

  const step = (direction: "next" | "previous"): NavigationResult => {
    const item = collection[direction](current, { loop });
    return item ? { value: item.value, handled: true } : { handled: true };
  };

  if (vertical && event.key === "ArrowDown") return step("next");
  if (vertical && event.key === "ArrowUp") return step("previous");
  if (horizontal && event.key === forwardKey) return step("next");
  if (horizontal && event.key === backwardKey) return step("previous");

  if (event.key === "Home") {
    const item = collection.first();
    return item ? { value: item.value, handled: true } : { handled: true };
  }
  if (event.key === "End") {
    const item = collection.last();
    return item ? { value: item.value, handled: true } : { handled: true };
  }

  if (options.typeahead && typeahead && event.key.length === 1 && event.key !== " ") {
    const query = typeahead.push(event.key);
    // Holding one letter cycles through everything starting with it, so search
    // from the current item; a real multi-character query restarts from the top
    // so it can match the item already selected.
    const item = isRepeat(query)
      ? collection.search(query[0]!, current)
      : (collection.search(query, null) ?? collection.search(query, current));
    return item ? { value: item.value, handled: true } : { handled: true };
  }

  return NOT_HANDLED;
}

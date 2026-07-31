/**
 * The default comparator.
 *
 * A table sorts whatever it is given, so this has to be defensible for mixed
 * and missing values rather than assuming a type. Three rules, in order:
 * blanks last regardless of direction, numbers and dates numerically, and
 * everything else by locale — because `"ä" < "b"` is false under a plain `<`
 * but true to anyone reading the column.
 */

/** `null`, `undefined` and `""` all count as "no value". */
const isBlank = (value: unknown): boolean => value === null || value === undefined || value === "";

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export function compareValues(a: unknown, b: unknown): number {
  // Blanks sort last in *both* directions rather than being reversed with
  // everything else. A column of mostly-empty cells is otherwise unreadable
  // descending, which is the direction people sort it in to find the filled
  // ones.
  const aBlank = isBlank(a);
  const bBlank = isBlank(b);
  if (aBlank || bBlank) return aBlank && bBlank ? 0 : aBlank ? 1 : -1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  // `numeric: true` means "item 2" precedes "item 10", which is what a reader
  // expects from a column of identifiers.
  return collator.compare(String(a), String(b));
}

/**
 * Applies direction, keeping blanks last.
 *
 * Negating `compareValues` wholesale would send blanks to the top when
 * descending, which is the behaviour the blank rule exists to prevent.
 */
export function directedCompare(a: unknown, b: unknown, descending: boolean): number {
  const aBlank = isBlank(a);
  const bBlank = isBlank(b);
  if (aBlank || bBlank) return aBlank && bBlank ? 0 : aBlank ? 1 : -1;
  const result = compareValues(a, b);
  return descending ? -result : result;
}

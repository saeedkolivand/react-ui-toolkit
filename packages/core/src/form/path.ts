/**
 * Field paths: `"user.address[0].city"` in, a value out — or a new object with
 * that value replaced.
 *
 * Forms address nested data by string, so this is the foundation everything
 * else in the engine stands on. Two rules it never breaks:
 *
 * 1. **Nothing is mutated.** `setPath` returns new objects along the path it
 *    touched and shares everything else, so a framework comparing by identity
 *    sees exactly the branches that changed and re-renders only those.
 * 2. **A numeric segment means an array.** Creating a plain object for
 *    `items[0]` would produce `{ "0": … }`, which looks right in a debugger and
 *    breaks the moment anything maps over it.
 */

export type PathSegment = string | number;

/**
 * `"a.b[0].c"` → `["a", "b", 0, "c"]`.
 *
 * Bracket indices become numbers so `setPath` can tell an array from an object
 * without guessing from the existing value — which would be undefined the first
 * time a field is written.
 */
export function parsePath(path: string): PathSegment[] {
  if (!path) return [];
  const segments: PathSegment[] = [];
  for (const part of path.split(".")) {
    const match = /^([^[\]]*)((?:\[\d+\])*)$/.exec(part);
    if (!match) {
      segments.push(part);
      continue;
    }
    if (match[1]) segments.push(match[1]);
    for (const index of match[2]?.match(/\d+/g) ?? []) segments.push(Number(index));
  }
  return segments;
}

export function getPath(source: unknown, path: string | PathSegment[]): unknown {
  const segments = Array.isArray(path) ? path : parsePath(path);
  let current = source;
  for (const segment of segments) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<PathSegment, unknown>)[segment];
  }
  return current;
}

/** A container of the right shape for the *next* segment along the path. */
const container = (existing: unknown, nextSegment: PathSegment | undefined): unknown => {
  if (Array.isArray(existing)) return [...existing];
  if (existing !== null && typeof existing === "object") return { ...existing };
  return typeof nextSegment === "number" ? [] : {};
};

/**
 * Returns a copy of `source` with `path` set to `value`.
 *
 * Missing intermediate containers are created, so a form can write
 * `contacts[0].email` into `{}` without the caller pre-building the shape.
 */
export function setPath<T>(source: T, path: string | PathSegment[], value: unknown): T {
  const segments = Array.isArray(path) ? path : parsePath(path);
  if (segments.length === 0) return value as T;

  const [head, ...rest] = segments as [PathSegment, ...PathSegment[]];
  const copy = container(source, head) as Record<PathSegment, unknown>;

  copy[head] =
    rest.length === 0
      ? value
      : setPath((source as Record<PathSegment, unknown> | null | undefined)?.[head], rest, value);

  return copy as T;
}

/** Returns a copy of `source` with `path` removed. Splices arrays rather than leaving holes. */
export function deletePath<T>(source: T, path: string | PathSegment[]): T {
  const segments = Array.isArray(path) ? path : parsePath(path);
  if (segments.length === 0) return source;

  const [head, ...rest] = segments as [PathSegment, ...PathSegment[]];
  if (source === null || source === undefined) return source;

  if (rest.length === 0) {
    if (Array.isArray(source)) {
      // Spliced, not `delete`d: leaving a hole would keep the length and give
      // every later index the wrong path, silently shifting a list field's
      // errors onto the wrong rows.
      const copy = [...source];
      copy.splice(Number(head), 1);
      return copy as T;
    }
    const copy = { ...(source as object) } as Record<PathSegment, unknown>;
    delete copy[head];
    return copy as T;
  }

  const child = (source as Record<PathSegment, unknown>)[head];
  const copy = container(source, head) as Record<PathSegment, unknown>;
  copy[head] = deletePath(child, rest);
  return copy as T;
}

/** Formats segments back into a path string. Inverse of `parsePath`. */
export const formatPath = (segments: PathSegment[]): string =>
  segments.reduce<string>(
    (acc, segment) =>
      typeof segment === "number" ? `${acc}[${segment}]` : acc ? `${acc}.${segment}` : segment,
    ""
  );

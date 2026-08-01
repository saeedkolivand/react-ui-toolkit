/**
 * A boolean that a framework's DOM typings may hand us. Svelte's
 * `HTMLButtonAttributes` and Angular's inputs both allow `null`, so the guards
 * accept it rather than forcing a cast at every call site.
 */
export type BooleanGuard = boolean | null | undefined;

/**
 * Presence attribute: `""` when true, absent otherwise — NEVER the string
 * `"false"`.
 *
 * This is not a style preference. Binding a raw boolean makes Vue and Angular
 * render `data-loading="false"`, which still MATCHES a `[data-loading]` CSS
 * selector, so the component silently picks up the wrong styles. Every boolean
 * data attribute in every adapter goes through this function, and the adapter
 * smoke tests assert it.
 */
export const dataAttr = (guard: BooleanGuard): "" | undefined => (guard ? "" : undefined);

/** aria-* expects the string "true" or omission, not a JS boolean. */
export const ariaAttr = (guard: BooleanGuard): "true" | undefined => (guard ? "true" : undefined);

/**
 * Whether an optional slot has anything in it, and therefore whether its
 * wrapper part should exist at all.
 *
 * `{condition && <Divider/>}` evaluates to `false`, not to `undefined`, and
 * every framework renders `false` as nothing — so a `!= null` check passes it
 * through and emits an empty wrapper. That wrapper is not nothing: as a flex or
 * grid item it still takes its gap, so a Space with a conditioned-away split
 * silently doubles its own spacing.
 *
 * `unknown` because core is framework-free and has no node type of its own; the
 * adapters narrow it at the call site.
 */
export const hasContent = (slot: unknown): boolean =>
  slot !== null && slot !== undefined && slot !== false && slot !== "";

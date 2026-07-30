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
export const dataAttr = (guard: boolean | undefined): "" | undefined => (guard ? "" : undefined);

/** aria-* expects the string "true" or omission, not a JS boolean. */
export const ariaAttr = (guard: boolean | undefined): "true" | undefined =>
  guard ? "true" : undefined;

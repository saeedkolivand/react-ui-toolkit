/**
 * Angular signals binding for Zag.js.
 *
 * Ported from @zag-js/svelte rather than @zag-js/react: Svelte's runes map onto
 * Angular signals nearly one-to-one ($state→signal, $derived→computed,
 * untrack→untracked, onMount→afterNextRender, onDestroy→DestroyRef.onDestroy),
 * whereas React's version is entangled with useState/useRef/flushSync. Roughly
 * 85% of machine.ts is upstream's framework-free TypeScript, copied unchanged.
 *
 * IMPORTANT: useMachine() must be called in an injection context — a field
 * initializer, never ngOnInit.
 */
export { useMachine } from "./machine";
export { bindable } from "./bindable";
export { useRefs } from "./refs";
export { track } from "./track";
export { normalizeProps, DOM_PROPERTY_KEYS, toStyleString } from "./normalize-props";
export { ZagSpread } from "./spread.directive";
export { CkPortal } from "./portal";
export { usePresence } from "./presence";

/** Angular removes an attribute on null, not undefined. */
export const ckDataAttr = (guard: boolean | undefined): "" | null => (guard ? "" : null);
export const ckAriaAttr = (guard: boolean | undefined): "true" | null => (guard ? "true" : null);

// Angular-signals port of @zag-js/svelte/dist/bindable.svelte.js.
//
// The one real divergence: Svelte uses `$effect.pre` to refresh valueRef/prevValue
// *before* the DOM updates. Angular has no pre-render effect, so the sync happens
// imperatively inside set() (which is where it actually matters), and an effect()
// covers the other direction — a parent changing a *controlled* `value` without
// going through set().
import {
  ApplicationRef,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
  type Injector,
} from "@angular/core";
import { isFunction } from "@zag-js/utils";

export interface BindableParams<T> {
  value?: T;
  defaultValue?: T;
  isEqual?: (a: T, b: T) => boolean;
  onChange?: (next: T, prev: T) => void;
  hash?: (v: T) => string;
  debug?: string;
  sync?: boolean;
}

export function bindable<T>(props: () => BindableParams<T>, injector?: Injector) {
  const initial = (props().value ?? props().defaultValue) as T;
  const eq = props().isEqual ?? Object.is;
  const appRef = injector ? injector.get(ApplicationRef) : inject(ApplicationRef);

  const value = signal<T>(initial);
  const isControlled = () => props().value !== undefined;

  const valueRef = { current: untracked(() => value()) as T };
  const prevValue = { current: untracked(() => value()) as T };

  // Equivalent of Svelte's $effect.pre: keep the refs in step with a controlled
  // value that changed outside of set().
  effect(
    () => {
      const v = (isControlled() ? props().value : value()) as T;
      untracked(() => {
        valueRef.current = v;
        prevValue.current = v;
      });
    },
    injector ? { injector } : undefined
  );

  /** Commit pending template updates, ignoring a recursive call from inside CD. */
  const flush = () => {
    try {
      appRef.tick();
    } catch {
      // NG0101 (recursive tick) or NG0103 (already inside change detection).
      // Reaching here means the DOM will NOT be committed before the caller's
      // machine effects run — see track.ts for why every controlled-prop change
      // used to land here, and why it no longer does.
    }
  };

  const setValueFn = (v: T | ((prev: T) => T)) => {
    const next = isFunction(v) ? (v as (p: T) => T)(valueRef.current) : v;
    const prev = prevValue.current;
    if (props().debug) console.log(`[bindable > ${props().debug}] setValue`, { next, prev });
    if (!isControlled()) value.set(next);
    valueRef.current = next;
    if (!eq(next, prev)) {
      // THE load-bearing line. Zag's effects (focus trap, popper measurement)
      // defer by exactly one requestAnimationFrame and then resolve their target
      // element, bailing silently if it is null. React and Svelte both have the
      // DOM committed by that frame; zoneless Angular does not, because change
      // detection is merely *scheduled* by the signal write above.
      //
      // Flushing here is the real equivalent of Svelte/React's flushSync: the
      // template renders the new state, so the element exists when the rAF fires.
      // Without it the focus trap never attaches — silently, with correct ARIA.
      //
      // Upstream applies flushSync only when `props.sync` is set (the presence
      // machine's `initial` context is the one that asks for it). We flush
      // unconditionally: Angular has no synchronous DOM commit outside of
      // tick(), and the cost of an extra flush is far smaller than the cost of
      // the silent, hard-to-diagnose failures caused by skipping it.
      flush();
      props().onChange?.(next, prev);
    }
    prevValue.current = next;
  };

  return {
    initial,
    ref: valueRef,
    get: () => (isControlled() ? (props().value as T) : value()),
    // untracked so a machine transition triggered from inside a computed/effect
    // does not register a phantom dependency.
    set: (val: T | ((prev: T) => T)) => untracked(() => setValueFn(val)),
    invoke: (next: T, prev: T) => props().onChange?.(next, prev),
    hash: (v: T) => props().hash?.(v) ?? String(v),
  };
}

bindable.cleanup = (fn: VoidFunction) => {
  inject(DestroyRef).onDestroy(fn);
};

bindable.ref = <T>(defaultValue: T) => {
  let val = defaultValue;
  return { get: () => val, set: (next: T) => void (val = next) };
};

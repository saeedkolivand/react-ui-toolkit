// Ported verbatim from @zag-js/svelte/dist/refs.svelte.js — zero framework coupling.
export function useRefs<T extends Record<string, any>>(refs: T) {
  const ref = { current: refs };
  return {
    get<K extends keyof T>(key: K): T[K] {
      return ref.current[key];
    },
    set<K extends keyof T>(key: K, value: T[K]) {
      ref.current[key] = value;
    },
  };
}

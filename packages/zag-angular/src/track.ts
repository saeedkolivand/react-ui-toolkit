// Port of @zag-js/svelte/dist/track.svelte.js.
//
// Zag's contract is NOT "run whenever the effect re-runs" — it is "run only when
// one of `deps` actually changed", with the first run used purely to snapshot.
// Angular effects can re-run for reasons unrelated to these particular values,
// so the isEqual comparison is load-bearing: without it the machine receives
// spurious transitions (observed as a presence node that either unmounts
// instantly or never unmounts at all).
import { effect, untracked, type Injector } from "@angular/core";
import { isEqual } from "@zag-js/utils";

const access = (value: any) => (typeof value === "function" ? value() : value);

export function track(deps: Array<() => any>, fn: VoidFunction, injector?: Injector) {
  let prevDeps: any[] = [];
  let isFirstRun = true;

  effect(
    () => {
      // read every dep so Angular registers the dependencies
      const current = deps.map(d => access(d));

      if (isFirstRun) {
        prevDeps = current;
        isFirstRun = false;
        return;
      }

      let changed = false;
      for (let i = 0; i < deps.length; i++) {
        if (!isEqual(prevDeps[i], current[i])) {
          changed = true;
          break;
        }
      }

      if (changed) {
        prevDeps = current;
        untracked(fn);
      }
    },
    injector ? { injector } : undefined
  );
}

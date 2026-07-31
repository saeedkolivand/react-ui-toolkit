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
        // Deferred out of change detection, and this is load-bearing.
        //
        // Angular effects run inside ApplicationRef.tick(). Every controlled
        // prop change reaches the machine through this callback, so running it
        // here means the transition — and the flush inside bindable.set that is
        // supposed to commit the new DOM — happens inside a tick that is already
        // running. appRef.tick() then throws NG0101 (recursive tick), the flush
        // silently does nothing, and the machine's entry effects run against a
        // DOM that has not been updated: they rAF, resolve a null element, and
        // bail without a sound. That is the whole of the intermittent
        // "dialog opens but Escape does nothing".
        //
        // tick() is synchronous, so a microtask queued from inside it runs once
        // the pass has finished — at which point flushing is both legal and
        // meaningful.
        queueMicrotask(() => untracked(fn));
      }
    },
    injector ? { injector } : undefined
  );
}

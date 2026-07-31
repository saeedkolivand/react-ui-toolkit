# zag-angular behaviour suite

These specs drive `@zag-js/dialog` through the Angular binding and assert the
behaviours that motivate the whole architecture: focus trap, controlled
round-trip, portal, ARIA wiring, scroll lock, and exit animations.

They run against `apps/playground-angular`, which is checked in:

```bash
pnpm --filter @crosskit-ui/playground-angular test:e2e
```

Playwright starts the app's Vite dev server itself, so no manual setup is
needed. Until this batch the host app was a throwaway scaffold that was never
committed, which is worth knowing: several rounds of "fixes" were measured
against a **stale `dist/`** and the numbers they produced were meaningless.
`pnpm --filter '@crosskit-ui/zag-angular' --filter '@crosskit-ui/angular' build`
runs first, or the suite tests the previous build.

## Current state

Stable across eight consecutive runs: machine drives the dialog with correct
`data-*`; content portals to `document.body`; focus trap enters, wraps both
directions and restores to the trigger; Escape closes and `closeOnEscape=false`
prevents it; `aria-labelledby` resolves; controlled `[(open)]` round-trips;
exit animation holds `data-state="closed"` before unmount; **20 rapid
open/close cycles leak no nodes and log no Angular errors**.

The rapid open/close flake that previously scored 6–7 out of 9 is fixed. Two
distinct defects were behind it, plus one bug in the test itself — see
`track.ts`, `presence.ts` and `open()` in `dialog.spec.ts` for the details:

1. **Every controlled prop change reached the machine from inside change
   detection.** `track` ran its callback in an Angular `effect`, effects run
   inside `ApplicationRef.tick()`, so the flush in `bindable.set` hit
   NG0101 (recursive tick) and silently did nothing. The machine's entry
   effects — focus trap, and the dismissable listener that handles Escape —
   then resolved their target element against a DOM that had not been updated,
   found null, and bailed without a sound. Deferring the callback by a
   microtask puts it after the tick, where flushing is both legal and
   meaningful.
2. **Presence cost two extra ticks to mount**, so on entry the node often did
   not exist yet. `present` now reads the raw input OR the machine's state: the
   input governs entry, the machine still governs the exit.
3. The suite's own `open()` waited for the node to be _visible_, then pressed
   Escape — sometimes in the same frame, before anything was listening. It now
   waits for focus to land inside the dialog, which is the observable signal
   that the entry effects actually attached.

## Determinism

The config emulates `prefers-reduced-motion`. Entry and exit animations are real
CSS here, and a click delivered while `ck-dialog-in` is still running tests the
animation rather than the behaviour — outside-click dismissal failed roughly
half the time for exactly that reason, with the machine, the listener and every
`isEventOutside` predicate all provably correct. The library collapses every
duration to 1ms under reduced motion, so this uses a path consumers really get
rather than a test-only escape hatch.

With it, the suite is 9/9 across nine consecutive runs.

---
"@crosskit-ui/core": minor
"@crosskit-ui/react": major
"@crosskit-ui/styles": minor
---

Rebuild React's Toaster on a framework-free queue in `core`.

`createToastQueue()` is new in `@crosskit-ui/core`: a plain store with the queue,
per-toast countdowns, pause and resume, overflow and placement in it, and no
framework anywhere. `<Toaster>` in React reads it through `useSyncExternalStore`.

**Breaking, React only.** `<Toaster toaster>` now takes a `ToastQueue` from
`createToastQueue()` rather than the store from `createToaster()`:

```diff
-import { createToaster } from "@crosskit-ui/core";
-export const toaster = createToaster();
+import { createToastQueue } from "@crosskit-ui/core";
+export const toaster = createToastQueue();
```

Everything you call on it is unchanged — `create`, `success`, `error`,
`warning`, `info`, `loading`, `update`, `dismiss`. Vue, Svelte and Angular keep
`createToaster()` and are untouched.

The group emits what it did before. **Each toast root emits less.** The flow
layout has no per-toast geometry, so `data-first`, `data-stack`, `data-ghost`,
`data-overlap`, `data-sibling`, `data-mounted` and `data-paused` are gone along
with the `--x`/`--y`/`--z-index`/`--offset` custom properties that drove the
old stacking, and `data-placement`, `data-side` and `data-align` now live on the
group only. `data-state`, `data-type` and the part attributes are unchanged. If
you style a toast off any of the removed ones, move the selector to the group or
key it on `data-state`.

`dir` is also gone, deliberately. Every rule is written in logical properties,
so the group inherits direction from its ancestors — and an explicit `dir="ltr"`
inside an RTL document would have forced the wrong one.

Two option names differ on the factory: `removeDelay` replaces the machine's
`gap`/`offsets`, which were part of an absolute-positioning scheme the flow
layout does not have. Placement, `max` and `duration` are the same.

`@crosskit-ui/react` now declares **no third-party runtime dependencies at all**
— only its sibling `@crosskit-ui/*` packages.

Also fixed: the exit transition ran for 300ms while a dismissed toast was
removed after 200ms, so the last third of every exit was cut off mid-flight.
The two are now a documented pair, in both files.

Toasts enter with an animation again. A node inserted straight at its resting
style has nothing to transition from, so this is keyframes rather than a
transition on `data-state` — which only ever drove the exit.

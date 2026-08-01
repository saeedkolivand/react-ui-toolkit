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
`warning`, `info`, `loading`, `update`, `dismiss` — as is every attribute the
markup emits. Vue, Svelte and Angular keep `createToaster()` and are untouched.

Two option names differ on the factory: `removeDelay` replaces the machine's
`gap`/`offsets`, which were part of an absolute-positioning scheme the flow
layout does not have. Placement, `max` and `duration` are the same.

`@crosskit-ui/react` now declares **no third-party runtime dependencies at all**
— only its sibling `@crosskit-ui/*` packages.

Also fixed: the exit transition ran for 300ms while a dismissed toast was
removed after 200ms, so the last third of every exit was cut off mid-flight.
The two are now a documented pair, in both files.

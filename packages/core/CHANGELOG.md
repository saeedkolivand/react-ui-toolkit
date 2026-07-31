# @crosskit-ui/core

## 1.0.0

### Major Changes

- [#42](https://github.com/saeedkolivand/crosskit/pull/42) [`0fa9b31`](https://github.com/saeedkolivand/crosskit/commit/0fa9b3174d4cf5cfcc72ee616ef1cd994f1666ca) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - CrossKit 1.0.0 — the first release under this name.

  `@saeedkolivand/react-ui-toolkit` was a React-only component library that composed Tailwind utility classes at runtime. CrossKit is the same 27 components with the same API in **React, Vue, Svelte and Angular**: behaviour from Zag.js state machines shared across all four, styling from one precompiled stylesheet keyed to `data-scope` / `data-part` / `data-state`.

  Consumers need no Tailwind of their own — it is an authoring tool here, not a runtime dependency. `tailwind-merge`, `classnames` and `framer-motion` are gone with nothing replacing them.

  This is a clean break, not a rename. See `docs/migrating-from-react-ui-toolkit.md`, which lists every API change and the seven v0 bugs whose workarounds can now be deleted.

### Minor Changes

- [#31](https://github.com/saeedkolivand/crosskit/pull/31) [`1b9981d`](https://github.com/saeedkolivand/crosskit/commit/1b9981db8ca5c1bc04cba63e18d22687b1470492) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Table across all four adapters, plus `createTableStore`, `toColumnDefs`, `fromLegacyColumns` and `getPageWindow` in core. `@tanstack/table-core` is bound once in core rather than through the four official framework adapters.

- [#30](https://github.com/saeedkolivand/crosskit/pull/30) [`d7fd5ba`](https://github.com/saeedkolivand/crosskit/commit/d7fd5ba4793a1f5b8d2453b93f11d9459732e29f) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Toast across all four adapters: `createToaster()` in core plus a `<Toaster>` per framework, driven by `@zag-js/toast`. Replaces v0's `NotificationProvider` + `useNotification()`.

- [#29](https://github.com/saeedkolivand/crosskit/pull/29) [`f66d3b7`](https://github.com/saeedkolivand/crosskit/commit/f66d3b7036d1b66b6dd9f197c167604e47827bbb) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Tooltip and Menu across all four adapters, driven by `@zag-js/tooltip` and `@zag-js/menu`, plus `resolvePlacement` in core for v0's Ant placement names.

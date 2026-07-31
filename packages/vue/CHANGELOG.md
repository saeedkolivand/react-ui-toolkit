# @crosskit-ui/vue

## 1.0.0

### Major Changes

- [#42](https://github.com/saeedkolivand/crosskit/pull/42) [`0fa9b31`](https://github.com/saeedkolivand/crosskit/commit/0fa9b3174d4cf5cfcc72ee616ef1cd994f1666ca) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - CrossKit 1.0.0 — the first release under this name.

  `@saeedkolivand/react-ui-toolkit` was a React-only component library that composed Tailwind utility classes at runtime. CrossKit is the same 27 components with the same API in **React, Vue, Svelte and Angular**: behaviour from Zag.js state machines shared across all four, styling from one precompiled stylesheet keyed to `data-scope` / `data-part` / `data-state`.

  Consumers need no Tailwind of their own — it is an authoring tool here, not a runtime dependency. `tailwind-merge`, `classnames` and `framer-motion` are gone with nothing replacing them.

  This is a clean break, not a rename. See `docs/migrating-from-react-ui-toolkit.md`, which lists every API change and the seven v0 bugs whose workarounds can now be deleted.

### Minor Changes

- [#28](https://github.com/saeedkolivand/crosskit/pull/28) [`fd141dd`](https://github.com/saeedkolivand/crosskit/commit/fd141dd215a6696ed55a3ee3df9b83ea7af5b176) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Select and Option across all four adapters, driven by `@zag-js/select`. Fixes the Vue dialog close button, which carried the wrong data attribute and no click handler.

- [#31](https://github.com/saeedkolivand/crosskit/pull/31) [`1b9981d`](https://github.com/saeedkolivand/crosskit/commit/1b9981db8ca5c1bc04cba63e18d22687b1470492) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Table across all four adapters, plus `createTableStore`, `toColumnDefs`, `fromLegacyColumns` and `getPageWindow` in core. `@tanstack/table-core` is bound once in core rather than through the four official framework adapters.

- [#27](https://github.com/saeedkolivand/crosskit/pull/27) [`c419f38`](https://github.com/saeedkolivand/crosskit/commit/c419f389d97d57efc0b2a6612b9a3927ad9d516d) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Tabs and Accordion (Wave 5) across all four adapters, driven by `@zag-js/tabs` and `@zag-js/accordion`.

- [#30](https://github.com/saeedkolivand/crosskit/pull/30) [`d7fd5ba`](https://github.com/saeedkolivand/crosskit/commit/d7fd5ba4793a1f5b8d2453b93f11d9459732e29f) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Toast across all four adapters: `createToaster()` in core plus a `<Toaster>` per framework, driven by `@zag-js/toast`. Replaces v0's `NotificationProvider` + `useNotification()`.

- [#29](https://github.com/saeedkolivand/crosskit/pull/29) [`f66d3b7`](https://github.com/saeedkolivand/crosskit/commit/f66d3b7036d1b66b6dd9f197c167604e47827bbb) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Tooltip and Menu across all four adapters, driven by `@zag-js/tooltip` and `@zag-js/menu`, plus `resolvePlacement` in core for v0's Ant placement names.

### Patch Changes

- [#36](https://github.com/saeedkolivand/crosskit/pull/36) [`93f13d2`](https://github.com/saeedkolivand/crosskit/commit/93f13d22c4a38add30d5028806e37954fbca87aa) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Fix Angular ignoring every `default*` machine prop: `bindable` now seeds its initial value on first use rather than at construction, so `defaultValue` reaches zag after Angular has applied inputs. Removes `RadioGroup.name`, which silently did nothing in every adapter.

- [#33](https://github.com/saeedkolivand/crosskit/pull/33) [`6a8c183`](https://github.com/saeedkolivand/crosskit/commit/6a8c18308c47c93ab69fbe9f2a49082ff494c9a6) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Move `aria-invalid` off individual radios and onto the radio group, where ARIA actually supports it. `RadioGroup` gains an `invalid` prop; `data-invalid` on the radio is unchanged.

- [#35](https://github.com/saeedkolivand/crosskit/pull/35) [`a84f12d`](https://github.com/saeedkolivand/crosskit/commit/a84f12d91460f805daea7ba426769e7b39bd45c1) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Fix three divergences the cross-framework parity matrix found: Vue's Input and Textarea sent every native attribute to the wrapper instead of the control; Angular's Tabs, Accordion and Menu crashed with NG0950 by reading a required input during construction; Angular's Input and Textarea had no way to set placeholder, type, name, required or readonly.

- Updated dependencies [[`e01f4fa`](https://github.com/saeedkolivand/crosskit/commit/e01f4fa10f42702cdbb2f00b6744d57c11825c85), [`0fa9b31`](https://github.com/saeedkolivand/crosskit/commit/0fa9b3174d4cf5cfcc72ee616ef1cd994f1666ca), [`fd141dd`](https://github.com/saeedkolivand/crosskit/commit/fd141dd215a6696ed55a3ee3df9b83ea7af5b176), [`1b9981d`](https://github.com/saeedkolivand/crosskit/commit/1b9981db8ca5c1bc04cba63e18d22687b1470492), [`c419f38`](https://github.com/saeedkolivand/crosskit/commit/c419f389d97d57efc0b2a6612b9a3927ad9d516d), [`d7fd5ba`](https://github.com/saeedkolivand/crosskit/commit/d7fd5ba4793a1f5b8d2453b93f11d9459732e29f), [`f66d3b7`](https://github.com/saeedkolivand/crosskit/commit/f66d3b7036d1b66b6dd9f197c167604e47827bbb)]:
  - @crosskit-ui/styles@1.0.0
  - @crosskit-ui/core@1.0.0

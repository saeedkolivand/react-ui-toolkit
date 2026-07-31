# @crosskit-ui/zag-angular

## 1.0.0

### Major Changes

- [#42](https://github.com/saeedkolivand/crosskit/pull/42) [`0fa9b31`](https://github.com/saeedkolivand/crosskit/commit/0fa9b3174d4cf5cfcc72ee616ef1cd994f1666ca) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - CrossKit 1.0.0 — the first release under this name.

  `@saeedkolivand/react-ui-toolkit` was a React-only component library that composed Tailwind utility classes at runtime. CrossKit is the same 27 components with the same API in **React, Vue, Svelte and Angular**: behaviour from Zag.js state machines shared across all four, styling from one precompiled stylesheet keyed to `data-scope` / `data-part` / `data-state`.

  Consumers need no Tailwind of their own — it is an authoring tool here, not a runtime dependency. `tailwind-merge`, `classnames` and `framer-motion` are gone with nothing replacing them.

  This is a clean break, not a rename. See `docs/migrating-from-react-ui-toolkit.md`, which lists every API change and the seven v0 bugs whose workarounds can now be deleted.

### Patch Changes

- [#32](https://github.com/saeedkolivand/crosskit/pull/32) [`488486b`](https://github.com/saeedkolivand/crosskit/commit/488486b9f985a2ee653b7e41397d806d42c0c41a) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Fix intermittent loss of machine entry effects under controlled props: `track` now defers its callback out of change detection, so `bindable`'s flush is no longer a recursive `ApplicationRef.tick()` that silently does nothing. Presence also reports `present` from the raw input on entry, removing a two-tick mount delay.

- [#36](https://github.com/saeedkolivand/crosskit/pull/36) [`93f13d2`](https://github.com/saeedkolivand/crosskit/commit/93f13d22c4a38add30d5028806e37954fbca87aa) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Fix Angular ignoring every `default*` machine prop: `bindable` now seeds its initial value on first use rather than at construction, so `defaultValue` reaches zag after Angular has applied inputs. Removes `RadioGroup.name`, which silently did nothing in every adapter.

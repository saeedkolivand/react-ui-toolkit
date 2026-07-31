# @crosskit-ui/core

Framework-free core for CrossKit.

The parts of CrossKit with no framework in them. Every adapter depends on this;
you rarely need it directly, but nothing here requires React, Vue, Svelte or
Angular to run.

```ts
import { createToaster, getPageWindow, iconPaths, resolvePlacement } from "@crosskit-ui/core";
```

| Export                              | What it is                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `iconPaths`, `ICON_NAMES`           | 104 icons as path data, not components                                     |
| `createToaster`                     | The toast store — a plain singleton, no provider                           |
| `createTableStore`                  | `@tanstack/table-core` bound once for all four adapters                    |
| `getPageWindow`                     | Pagination windowing, so a 500-row table renders a handful of page buttons |
| `toColumnDefs`, `fromLegacyColumns` | Serialisable column definitions, and a migration helper                    |
| `resolvePlacement`                  | Floating UI placements, accepting the older Ant names too                  |
| `dataAttr`, `ariaAttr`              | Booleans as presence attributes, never `="false"`                          |

## Documentation

Full component reference, with samples for all four frameworks:
**[https://crosskit.iamsaeed.dev/docs](https://crosskit.iamsaeed.dev/docs/)**

## Part of CrossKit

One component library with the same API in React, Vue, Svelte and Angular.
Behaviour lives in framework-free state machines shared across all four — so focus
traps, keyboard navigation and ARIA are written and tested once, not four times —
and styling in one precompiled stylesheet.

|                            |                                 |
| -------------------------- | ------------------------------- |
| `@crosskit-ui/react`       | React 19 adapters               |
| `@crosskit-ui/vue`         | Vue 3.5 adapters                |
| `@crosskit-ui/svelte`      | Svelte 5 adapters               |
| `@crosskit-ui/angular`     | Angular 20–22 adapters          |
| `@crosskit-ui/styles`      | The visual layer, precompiled   |
| `@crosskit-ui/core`        | Framework-free shared logic     |
| `@crosskit-ui/zag-angular` | Angular signals binding for Zag |

All seven move in lockstep, so there is never a version to match up by hand.

[Source](https://github.com/saeedkolivand/crosskit) · [Migrating from react-ui-toolkit](https://github.com/saeedkolivand/crosskit/blob/main/docs/migrating-from-react-ui-toolkit.md)

MIT © Saeed Kolivand

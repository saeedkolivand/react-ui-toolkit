# @crosskit-ui/zag-angular

Angular signals binding for Zag.js.

Drives [Zag.js](https://zagjs.com) state machines from Angular signals. Zag ships
official React, Vue, Solid and Svelte adapters but none for Angular; this is that
adapter, and it is useful on its own — you do not need the rest of CrossKit.

```ts
import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps, ZagSpread } from "@crosskit-ui/zag-angular";

export class MyDialog {
  // A FIELD INITIALIZER: this is the only injection context available.
  private readonly service = useMachine(dialog.machine, () => ({ id: "d1" }));
  protected readonly api = computed(() => dialog.connect(this.service, normalizeProps));
}
```

```html
<div [zagSpread]="api().getContentProps()">...</div>
```

Ported from `@zag-js/svelte` rather than the React adapter, because runes map onto
signals almost one to one. Zoneless, SSR-safe, and verified against a real
Playwright suite: focus trap wrapping both directions, focus restore, controlled
round-trips, portalling and exit animations.

Three things it has to get right that are not obvious:

- **`bindable` seeds on first use, not at construction.** A machine is built in a
  field initializer, before Angular applies inputs — seeding earlier snapshots
  every `default*` prop as `undefined`.
- **`track` defers out of change detection.** Angular effects run inside
  `ApplicationRef.tick()`, so flushing from one throws NG0101 and silently does
  nothing, leaving machine effects to resolve against a stale DOM.
- **`ZagSpread` removes stale attributes.** `data-state` toggling _is_ the styling
  system, so an add-only spread leaves `data-state="open"` stuck forever.

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

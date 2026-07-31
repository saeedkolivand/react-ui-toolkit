# @crosskit-ui/styles

The CrossKit visual layer, precompiled.

One stylesheet for every CrossKit component, in every framework. Import it once:

```ts
import "@crosskit-ui/styles";
```

There is no JavaScript in this package and nothing to configure. **You do not need
Tailwind** — it is an authoring tool for this stylesheet, not a runtime dependency.

## How it is built

Selectors key off `data-scope`, `data-part` and `data-state`, never class names.
Everything ships inside named cascade layers:

```css
@layer ck.reset, ck.tokens, ck.components, ck.overrides;
```

Because **unlayered CSS beats layered CSS regardless of specificity**, your own
rules win without `!important`.

## Theming

About 48 semantic `--ck-*` custom properties are the public contract, and dark
mode is a single `[data-theme="dark"]` block rather than a variant duplicated
inside all 27 components.

```css
:root {
  --ck-accent-solid: #7c3aed;
  --ck-radius-md: 2px;
}
```

Tailwind users can opt into a bridge that maps utilities onto the same tokens, so
`bg-primary-600` and the components read one source of truth:

```css
@import "@crosskit-ui/styles/theme.css";
```

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

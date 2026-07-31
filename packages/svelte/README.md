# @crosskit-ui/svelte

CrossKit components for Svelte.

27 accessible components for Svelte 5, with the same API as the React, Vue and Angular
adapters.

```bash
pnpm add @crosskit-ui/svelte
```

```svelte
<script lang="ts">
  import { Button } from "@crosskit-ui/svelte";
  import "@crosskit-ui/styles";
</script>

<Button variant="primary" icon="check" onclick={save}>Save changes</Button>
```

The stylesheet is imported once, anywhere. Consumers need no Tailwind of their
own — it is an authoring tool in this repository, not a runtime dependency.

## Styling

Components emit `data-scope`, `data-part` and `data-state` — never a class name.
Your own `class` lands on the root untouched, and because everything ships inside
CSS cascade layers, **your unlayered rules win regardless of specificity**:

```css
.my-button {
  background: rebeccapurple;
} /* beats the library, no !important */
```

Retheming is ~48 semantic custom properties, and dark mode is one
`[data-theme="dark"]` block:

```css
:root {
  --ck-accent-solid: #7c3aed;
}
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

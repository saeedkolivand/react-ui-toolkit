<h1 align="center">CrossKit</h1>

<p align="center">
  One component library. React, Vue, Svelte and Angular.
</p>

<p align="center">
  <a href="https://github.com/saeedkolivand/crosskit/actions/workflows/ci.yml">
    <img src="https://github.com/saeedkolivand/crosskit/actions/workflows/ci.yml/badge.svg" alt="CI Status">
  </a>
  <a href="https://www.npmjs.com/org/crosskit-ui">
    <img src="https://img.shields.io/npm/v/@crosskit-ui/react.svg" alt="npm version">
  </a>
  <a href="https://github.com/saeedkolivand/crosskit/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@crosskit-ui/react.svg" alt="MIT licence">
  </a>
</p>

<p align="center">
  <a href="https://crosskit.iamsaeed.dev/">Docs</a> ·
  <a href="https://crosskit.iamsaeed.dev/docs/">Components</a> ·
  <a href="https://crosskit.iamsaeed.dev/storybook/">Storybook</a>
</p>

---

27 accessible components with **the same API in four frameworks**. Behaviour comes from
[Zag.js](https://zagjs.com) state machines shared across all of them; styling from one precompiled
stylesheet. Consumers need no Tailwind of their own — it is an authoring tool here, not a runtime
dependency.

```bash
pnpm add @crosskit-ui/react    # or /vue, /svelte, /angular
```

```tsx
import { Button } from "@crosskit-ui/react";
import "@crosskit-ui/styles"; // once, anywhere

<Button variant="primary" icon="check" onClick={save}>
  Save changes
</Button>;
```

The same component in each of the other three:

```vue
<Button variant="primary" icon="check" @click="save">Save changes</Button>
```

```svelte
<Button variant="primary" icon="check" onclick={save}>Save changes</Button>
```

```html
<button ckButton variant="primary" icon="check" (click)="save()">Save changes</button>
```

## Why it is built this way

**Accessibility is the expensive part of a component library**, and it is the part that would
otherwise have to be right four separate times. Focus traps, keyboard navigation, typeahead, roving
tabindex and ARIA wiring all come from machines that are tested once and shared.

**The markup is identical everywhere.** Every component emits `data-scope`, `data-part` and
`data-state` — never a class name. Because the DOM and the CSS are shared, rendered output is
framework-independent, which is what makes a real parity test possible: the suite in `apps/e2e`
drives all four playgrounds with assertions that never branch on which framework they are talking
to, then checks that all four agree on every computed style and every box.

That test has already found six bugs which unit tests, typecheck and build all passed.

**Styling is CSS, not runtime class composition.** `tailwind-merge`, `classnames` and
`framer-motion` are gone with nothing replacing them; exit animations key off the machines' own
`data-state`.

## Packages

| Package                    | What it is                                                     |
| -------------------------- | -------------------------------------------------------------- |
| `@crosskit-ui/react`       | React 19 adapters                                              |
| `@crosskit-ui/vue`         | Vue 3.5 adapters                                               |
| `@crosskit-ui/svelte`      | Svelte 5 adapters                                              |
| `@crosskit-ui/angular`     | Angular 20–22 adapters                                         |
| `@crosskit-ui/styles`      | The whole visual layer, precompiled. One import.               |
| `@crosskit-ui/core`        | Icon data, table and toast stores, shared types                |
| `@crosskit-ui/zag-angular` | Angular signals binding for `@zag-js/core`. Useful on its own. |

`core` and `styles` are dependencies of each adapter rather than peers, and every package moves in
lockstep — so there is no version to keep in step by hand.

## Components

Button · Icon · Spinner · Divider · Badge · Tag · Card · Alert · Container · Row · Col · Input ·
Textarea · Checkbox · Radio · RadioGroup · Switch · Select · Option · Modal · Drawer · Tooltip ·
Menu · Toast · Tabs · Accordion · Avatar · Progress · Table

Full reference, with samples for all four frameworks, at
[crosskit.iamsaeed.dev/docs](https://crosskit.iamsaeed.dev/docs/).

## Theming

About 48 semantic `--ck-*` custom properties are the public contract. Dark mode is a single
`[data-theme="dark"]` block rather than a `dark:` variant duplicated inside all 27 components.

```css
:root {
  --ck-accent-solid: #7c3aed;
  --ck-radius-md: 2px;
}
```

Everything ships inside CSS cascade layers, so **your own unlayered rules win regardless of
specificity** — a plain `.my-button { background: red }` beats
`[data-scope="button"][data-part="root"]` with no `!important` anywhere.

## Migrating from `@saeedkolivand/react-ui-toolkit`

CrossKit is a clean break, not a rename. See
[docs/migrating-from-react-ui-toolkit.md](./docs/migrating-from-react-ui-toolkit.md) — generated
from the same data as the component reference, so the two cannot drift — including the seven v0 bugs
whose workarounds you can now delete.

## Repository

```
packages/   core · styles · zag-angular · react · vue · svelte · angular
apps/       docs · storybook · e2e · playground-{react,vue,svelte,angular}
```

```bash
pnpm install
pnpm turbo run lint typecheck build test check:exports   # the gate CI runs
pnpm --filter @crosskit-ui/e2e test:e2e                  # cross-framework parity
```

- [CONTRIBUTING.md](./CONTRIBUTING.md) — the conventions that keep four adapters honest
- [docs/releasing.md](./docs/releasing.md) — how a release is cut, and the failure modes it avoids
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

MIT © Saeed Kolivand

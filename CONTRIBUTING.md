# Contributing to CrossKit

The hard part of this repository is not any one component — it is that **four adapters have to stay
identical**. Most of what follows exists to make divergence fail loudly instead of shipping.

```bash
pnpm install
pnpm turbo run lint typecheck build test check:exports   # the gate CI runs
pnpm --filter @crosskit-ui/e2e test:e2e                  # cross-framework parity
```

Node 22+, pnpm 11+. Nothing else to set up.

## The layout

```
packages/
  core/         icon data, table and toast stores, shared types — no framework anywhere
  styles/       the whole visual layer, precompiled. Tailwind is author-time only.
  zag-angular/  Angular signals binding for @zag-js/core
  react/ vue/ svelte/ angular/    thin adapters, nothing else
apps/
  docs/         the site, and the registry MIGRATION.md is generated from
  storybook/    React-only visual catalogue and styles review surface
  e2e/          the cross-framework parity suite
  playground-*/ one page per framework, driven by e2e
```

## The two files you copy

Every new component starts as a copy of one of these. Read them before writing anything.

- **Presentational** — `packages/react/src/button/button.tsx`. Props in, data attributes out.
- **Behavioural** — `packages/react/src/dialog/modal.tsx`, over the primitives in
  `packages/core`. Portal, presence, focus trap, dismissable layer, scroll lock, controlled and
  uncontrolled, four content areas. The wiring lives in `use-overlay.ts` beside it; the component
  is markup.

## Conventions that keep four adapters honest

1. **Prop names are identical in all four.** Only two-way binding differs, and each framework uses
   its own idiom over the same underlying prop: React `open`/`onOpenChange`, Vue `v-model:open`,
   Svelte `bind:open`, Angular `[(open)]`. All four feed the same underlying prop, so there is no
   branching logic to write.

2. **No class names in markup, ever.** Components emit `data-scope`, `data-part` and `data-state`.
   `data-scope` is the CSS contract, so it is fixed per component and never renamed — every rule
   in `packages/styles` keys on it, and changing one means the CSS silently stops matching. Where a
   component is still driven by a third-party machine, the machine emits the scope from its
   prop-getters and the name is that machine's, not ours.

3. **Booleans are presence attributes, never `="false"`.** Funnel every one through `dataAttr()`.
   Binding a raw boolean makes Vue and Angular render `data-loading="false"`, which **matches**
   `[data-loading]` in CSS and applies the wrong styles. This has its own assertion in the parity
   suite because it is the single most likely divergence.

4. **Consumer attributes spread last**, after our own `data-*`, so a consumer — and a composing
   component — can override anything. It is what makes `<Icon data-part="icon">` inside Button work.

5. **Continuous values are inline custom properties, not attributes.** Enumerable props
   (`span` 1–12) are static CSS; unbounded ones (`Row.spacing`) are `--ck-*` written inline.

6. **Every root part declares its own `display`.** Angular's adapters use element selectors, so a
   root can be a `<ck-progress>` rather than a `<div>` — and an unknown element defaults to
   `display: inline`. A root that does not state its display is one framework away from a different
   box.

7. **Gate rendering on presence, never on `api.open`.** Otherwise the node unmounts the instant
   `open` flips, `data-state="closed"` never gets a frame, and every exit animation silently does
   nothing.

## Angular, specifically

Two rules that are not obvious and have both cost real debugging time:

- **`useMachine` must be a field initializer**, never `ngOnInit` — it needs an injection context.
  Which also means **inputs are not readable yet**: an `input.required` read while building a
  machine throws NG0950 and blanks the component tree, and anything snapshotted there sees
  `undefined`. `bindable` seeds lazily for exactly this reason.
- **Declare no `styles`.** Component-scoped styles add `_ngcontent-*` attributes and never reach
  portaled content. All styling comes from the global sheet. Never reach for `ViewEncapsulation.None`
  or `::ng-deep`.

## Definition of done for a component

1. CSS in `packages/styles/src/components/`
2. Four adapters, in the order React → Svelte → Vue → Angular
3. React tests — render, `data-part` present, props pass through, booleans absent-not-false
4. An entry in `apps/docs/src/data/` (which also generates its MIGRATION.md rows)
5. A Storybook story
6. Added to the parity page in all four playgrounds if it renders statically

## Testing, and what each layer is for

Deliberately unequal:

- **Core unit tests** carry the logic budget — pagination windows, column mapping, placement
  translation. No framework involved.
- **Adapter tests** assert the same six things per component so divergence is obvious. Behaviour
  belongs to `packages/core` and is tested there once; do not re-test it four times.
- **The parity suite** is the real guarantee. Assertions never branch on framework, and the visual
  check compares the frameworks against **each other**, not against a stored golden image — which is
  what keeps it useful while the CSS is still moving.

If you find a divergence the parity suite did not catch, add the assertion that would have.

## Commits and releases

Conventional commits (enforced by commitlint). Add a changeset for anything user-visible:

```bash
pnpm changeset
```

Versions are lockstep across all seven packages. Releases are manual — see
[docs/releasing.md](./docs/releasing.md).

By contributing you agree your contributions are licensed under the MIT License.

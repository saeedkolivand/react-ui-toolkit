# CrossKit

One component library with the same API in React, Vue, Svelte and Angular.

Full conventions live in [CONTRIBUTING.md](./CONTRIBUTING.md). What follows is only the part that is
non-obvious, repo-specific, and expensive to get wrong — the things worth checking on every change.

## Direction

v2 is a rewrite toward **zero runtime dependencies**. Behaviour that used to come from a third-party
state-machine library is being reimplemented as framework-free TypeScript in `packages/core`, and
`packages/react|vue|svelte|angular` are thin adapters over it.

So: hand-rolled focus traps, positioners and animation primitives in `core` are the intended
design, not something to flag as reinventing a wheel. What *is* worth flagging is any new runtime
dependency in a published `package.json`.

Do not name other UI or behaviour libraries in shipped code, comments, docs or commit messages.

## The rules that catch real bugs

1. **Booleans are presence attributes, never `="false"`.** Everything goes through `dataAttr()`,
   which returns `"" | undefined`. Binding a raw boolean makes some frameworks render
   `data-loading="false"`, and `"false"` *matches* `[data-loading]` in CSS — so the wrong styles
   apply, silently. This is the single most likely cross-framework divergence.

2. **No class names in markup, ever.** Components emit `data-scope`, `data-part` and `data-state`.
   A consumer's `class` lands on the root untouched.

3. **Consumer attributes spread last**, after our own `data-*`, so a consumer — and a composing
   component — can override anything.

4. **Every root part declares its own `display`.** Angular roots can be custom elements, which
   default to `display: inline`. A root that does not state its display is one framework away from
   a different box.

5. **Gate rendering on presence, not on `open`.** Unmounting the instant `open` flips means
   `data-state="closed"` never gets a frame and every exit animation silently does nothing.

6. **Prop names are identical in all four adapters.** Only two-way binding differs, each using its
   own framework idiom over the same underlying prop.

7. **CSS ships inside cascade layers** (`@layer ck.reset, ck.tokens, ck.components, ck.overrides`),
   because unlayered consumer CSS then wins regardless of specificity. Authoring outside a layer
   breaks the override story.

8. **Write logical properties, not physical ones** (`margin-inline`, `inset-inline-start`). RTL is a
   tested contract, not a claim.

## Two traps that have each cost real time

- **Ambiguous star exports vanish silently.** Two `export *` sources exporting the same name makes
  it ambiguous, and TypeScript drops it from the barrel rather than erroring — so a type disappears
  from the public API with a clean typecheck *and* a clean build.
- **Playgrounds import built `dist`, not `src`.** Changing source and re-running an e2e suite
  without rebuilding measures the old code. This has produced false greens twice.

## Gate

```bash
pnpm turbo run lint typecheck build test check:exports   # what CI runs
pnpm --filter @crosskit-ui/e2e test:e2e                  # cross-framework parity
```

Conventional commits, enforced by commitlint. Anything a consumer can observe needs a changeset.

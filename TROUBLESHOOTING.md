# Troubleshooting

## Styles are not applied

Import the stylesheet once, anywhere in your app:

```ts
import "@crosskit-ui/styles";
```

Angular has no JS entry point for it, so it goes in `angular.json`:

```json
"styles": ["@crosskit-ui/styles", "src/styles.css"]
```

There is nothing else — no provider, no HOC. v0's `withStyles`, `withStylesSSR`, `StylesProvider`
and `StylesProviderSSR` are deleted rather than renamed, because a single CSS import replaces all
four.

## My own CSS does not override a component

It should, without `!important`. Everything shipped lives inside CSS cascade layers
(`ck.reset, ck.tokens, ck.components, ck.overrides`), and **unlayered CSS beats layered CSS
regardless of specificity** — so a plain `.my-button { background: red }` wins over
`[data-scope="button"][data-part="root"]`.

If it is not winning, your rule is probably inside a layer too. Tailwind users: import
`@crosskit-ui/styles` **before** `tailwindcss`, so the `ck.*` layers are declared first.

## Dark mode does nothing

Set `data-theme` on `<html>`, not a `dark` class:

```html
<html data-theme="dark"></html>
```

To avoid a flash of the wrong theme, inline `themeScript()` in `<head>` — it is a string, so a
Server Component can render it with no client JS.

## A Content Security Policy blocks the layout

A few props are continuous rather than enumerable — `Row.spacing`, `Col.order`, `Progress.value`,
the table's scroll limits — and ship as **inline custom properties**, which a strict CSP rejects:

```
style-src-attr 'unsafe-inline'
```

Everything else is static CSS, so this is the only concession needed.

## Exit animations do not run

The node has to survive long enough to be animated. Any component you build on top of the machines
must gate rendering on **presence**, never on `api.open` — otherwise the node unmounts the instant
`open` flips, `data-state="closed"` never gets a frame, and the animation silently does nothing.

## Angular: a component renders nothing

Almost always a required input read during construction. `useMachine` has to run in a field
initializer — the only injection context available — which is **before** Angular applies any
binding, so an `input.required` read there throws `NG0950` and takes the whole component tree with
it. Use a default instead.

## Next.js: "useState only works in a Client Component"

`"use client"` is a per-file banner here, never on the barrel — so importing from
`@crosskit-ui/react` in a Server Component is fine, and only the components that need it are client
components. If you hit this, you are probably importing a machine-driven component (Modal, Select,
Tabs…) into a file that is itself a Server Component; add `"use client"` there, or import from the
per-component subpath.

## Something else

[Open an issue](https://github.com/saeedkolivand/crosskit/issues) with the framework, the version and
a reproduction.

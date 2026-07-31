---
"@crosskit-ui/core": major
"@crosskit-ui/styles": major
"@crosskit-ui/zag-angular": major
"@crosskit-ui/react": major
"@crosskit-ui/vue": major
"@crosskit-ui/svelte": major
"@crosskit-ui/angular": major
---

CrossKit 1.0.0 — the first release under this name.

`@saeedkolivand/react-ui-toolkit` was a React-only component library that composed Tailwind utility classes at runtime. CrossKit is the same 27 components with the same API in **React, Vue, Svelte and Angular**: behaviour from Zag.js state machines shared across all four, styling from one precompiled stylesheet keyed to `data-scope` / `data-part` / `data-state`.

Consumers need no Tailwind of their own — it is an authoring tool here, not a runtime dependency. `tailwind-merge`, `classnames` and `framer-motion` are gone with nothing replacing them.

This is a clean break, not a rename. See `docs/migrating-from-react-ui-toolkit.md`, which lists every API change and the seven v0 bugs whose workarounds can now be deleted.

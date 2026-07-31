---
"@crosskit-ui/core": minor
"@crosskit-ui/styles": minor
"@crosskit-ui/react": major
"@crosskit-ui/vue": minor
"@crosskit-ui/svelte": minor
"@crosskit-ui/angular": minor
"@crosskit-ui/zag-angular": minor
---

Begin the React v2 API. `Button` now takes `type`, `size` (small/middle/large), `shape`, `danger`,
`ghost`, `block`, a `ReactNode` icon, and `htmlType` for the native attribute; an `href` renders an
anchor. `ConfigProvider` carries a compiled theme, locale and direction.

This is a breaking change to `@crosskit-ui/react`. The other adapters are unchanged until they
follow.

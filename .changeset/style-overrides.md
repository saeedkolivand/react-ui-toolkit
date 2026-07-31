---
"@crosskit-ui/core": minor
"@crosskit-ui/styles": minor
"@crosskit-ui/react": minor
"@crosskit-ui/vue": minor
"@crosskit-ui/svelte": minor
"@crosskit-ui/angular": minor
"@crosskit-ui/zag-angular": minor
---

Compile `styleOverrides` into static CSS.

`createTheme({ components: { Button: { token, styleOverrides } } })` now accepts arbitrary CSS per
part, written as `({ theme, ownerState }) => ({ … })`. The function is evaluated once per variant
combination at theme-creation time and emitted as plain selectors, so the authoring API costs
nothing at runtime.

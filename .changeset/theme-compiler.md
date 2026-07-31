---
"@crosskit-ui/core": minor
"@crosskit-ui/styles": minor
"@crosskit-ui/react": minor
"@crosskit-ui/vue": minor
"@crosskit-ui/svelte": minor
"@crosskit-ui/angular": minor
"@crosskit-ui/zag-angular": minor
---

Add `createTheme()` to `@crosskit-ui/core`.

A theme configuration goes in and a plain CSS string comes out — colour ramps derived from one
brand colour in OKLCH, plus radius and duration scales, wrapped in `@layer ck.overrides`. Nothing
runs at render time: no style engine, no class hashing, no per-framework SSR collector.

`themeScript()` returns an inline script that applies a stored theme preference before first
paint. Nothing consumes either yet.

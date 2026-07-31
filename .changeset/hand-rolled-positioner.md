---
"@crosskit-ui/core": minor
"@crosskit-ui/styles": minor
"@crosskit-ui/react": minor
"@crosskit-ui/vue": minor
"@crosskit-ui/svelte": minor
"@crosskit-ui/angular": minor
"@crosskit-ui/zag-angular": minor
---

Add a dependency-free anchor positioner to `@crosskit-ui/core`.

`computePosition()` is pure geometry — rects in, coordinates out — with flip, shift, arrow
placement and RTL mirroring, and it accepts both canonical placements (`top-start`) and their
camelCase aliases (`topLeft`). `attachPosition()` is the DOM half, keeping a floating element on
its anchor across scroll, resize and either element changing size.

This is the first piece of the v2 behaviour core. Nothing consumes it yet.

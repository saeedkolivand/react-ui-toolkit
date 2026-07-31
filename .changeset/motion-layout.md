---
"@crosskit-ui/core": minor
"@crosskit-ui/styles": minor
"@crosskit-ui/react": minor
"@crosskit-ui/vue": minor
"@crosskit-ui/svelte": minor
"@crosskit-ui/angular": minor
"@crosskit-ui/zag-angular": minor
---

Complete the motion engine in `@crosskit-ui/core`.

`flipLayout()` animates layout changes the browser cannot tween — toast stacks resettling, table
rows moving on sort — by inverting the change and animating the inversion away. `createDrag()`
recognises pointer drags with trailing-window velocity, for drag-to-dismiss. `stagger()` produces
delays for a sequence.

Nothing consumes them yet.

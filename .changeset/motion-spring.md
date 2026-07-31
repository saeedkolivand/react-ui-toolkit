---
"@crosskit-ui/core": minor
"@crosskit-ui/styles": minor
"@crosskit-ui/react": minor
"@crosskit-ui/vue": minor
"@crosskit-ui/svelte": minor
"@crosskit-ui/angular": minor
"@crosskit-ui/zag-angular": minor
---

Add spring physics and a Web Animations wrapper to `@crosskit-ui/core`.

`createSpring()` solves the damped harmonic oscillator analytically, and `toLinearEasing()` samples
it into a CSS `linear()` easing — so an uninterrupted spring runs on the compositor with no
JavaScript at all. `animate()` and `retarget()` cover what CSS cannot: interruption from the
current value, and keyframes only known at runtime.

Nothing consumes them yet.

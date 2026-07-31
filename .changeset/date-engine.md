---
"@crosskit-ui/core": minor
"@crosskit-ui/styles": minor
"@crosskit-ui/react": minor
"@crosskit-ui/vue": minor
"@crosskit-ui/svelte": minor
"@crosskit-ui/angular": minor
"@crosskit-ui/zag-angular": minor
---

Add a dependency-free date engine to `@crosskit-ui/core`.

Calendar arithmetic on `[year, month, day]` rather than timestamps, so daylight saving cannot skew
it; month grids padded to whole weeks with a configurable week start; and month names, weekday
names, formatting and locale-aware parsing entirely from `Intl` — no locale packs.

This completes Phase 3. Nothing consumes any of it yet.

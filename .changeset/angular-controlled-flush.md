---
"@crosskit-ui/zag-angular": patch
---

Fix intermittent loss of machine entry effects under controlled props: `track` now defers its callback out of change detection, so `bindable`'s flush is no longer a recursive `ApplicationRef.tick()` that silently does nothing. Presence also reports `present` from the raw input on entry, removing a two-tick mount delay.

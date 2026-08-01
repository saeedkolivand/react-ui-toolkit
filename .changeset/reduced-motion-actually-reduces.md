---
"@crosskit-ui/styles": patch
---

Make `prefers-reduced-motion` actually reduce motion.

The overrides for the anchored overlays and for Select selected
`[data-scope][data-part="…"]`, while the animations they had to beat are gated
on `[data-state]` — one attribute more specific, in the same cascade layer. So
they lost, and a user who asked for reduced motion got the full 120ms enter
animation on every tooltip, menu, popover and select listbox. Popover was not
named at all, and Select's trigger transition never was either.

Both blocks now reach every part of their scope with `!important`, which is what
`dialog.css` has always done and why it was the only one that worked. A
preference is not a style to be out-ranked, and matching specificity would break
again silently the moment a more specific rule appeared.

`button.css` is unchanged and deliberately so: its spinner slows from 0.6s to
1.5s rather than stopping, because a spinner is the only thing on screen saying
work is still happening.

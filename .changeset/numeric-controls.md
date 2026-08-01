---
"@crosskit-ui/core": minor
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `Slider`, `InputNumber` and `Rate`, on a new numeric primitive in core.

`@crosskit-ui/core` gains `clamp`, `decimals`, `snap`, `stepBy`, `ratio`,
`fromRatio` and `numericKey` — the arithmetic all three share. Written once
because floating-point step maths is not something to get right four times, and
Phase 5 needs it framework-free anyway. `snap` rounds back to the precision its
inputs are written with, so a 0.1 step reports `0.3` rather than
`0.30000000000000004`.

**`Slider`** takes `min`, `max`, `step`, `value`/`defaultValue`, `onChange`,
`onChangeComplete`, `vertical`, `disabled`, `marks` and `tooltip`. Dragging uses
pointer capture, so a drag that leaves the track keeps tracking — without it the
thumb stops exactly when a user is reaching for the end. `onChangeComplete` is
separate from `onChange` so a caller has somewhere to hang a network request
that is not every frame of a drag.

**`InputNumber`** takes `min`, `max`, `step`, `value`/`defaultValue`,
`onChange`, `size`, `disabled`, `status`, `prefix`, `suffix`, `controls` and
`precision`. It keeps the typed text apart from the value: `"1."` and `"-"` are
states a number cannot represent, and clamping on each keystroke turns `5` into
the max the moment someone starts typing `50`. The clamp happens on blur. An
empty field is `null`, which is a different answer from `0`.

Home and End are left to the caret — in a text field they belong to it, and
stealing them makes a long number impossible to edit from the front.

**`Rate`** takes `count`, `value`/`defaultValue`, `onChange`, `onHoverChange`,
`allowHalf`, `allowClear`, `disabled`, `character` and `tooltips`. Clicking the
current value clears it, which is the only route back to zero with a pointer.
`tooltips` becomes `aria-valuetext`, so it reads "Fair" rather than "3".

`Locale` gains an `InputNumber` entry for the two spinner labels.

New in `@crosskit-ui/styles`: `numeric.css`, keyed on `data-scope` `slider`,
`input-number` and `rate`.

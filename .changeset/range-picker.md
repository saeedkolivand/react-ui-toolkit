---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `RangePicker` to React, over the same date panel `DatePicker` uses.

Two fields and two months side by side, so a range crossing a month boundary is
picked without paging. The right panel is always the one after the left, which
is what stops the two drifting apart or showing the same month twice.

`value` is `[Date | null, Date | null]`. The first click is reported as a
half-range rather than held back — `null` for the other end is what makes "one
chosen, one not" expressible at all, and a controlled consumer needs to see the
first click. A range picked backwards comes back sorted, because picking
backwards is an ordinary gesture and ends arriving swapped would be nobody's
idea of the answer.

The span under the pointer previews before the second click, normalised the same
way, since `compareDates` on an unsorted pair highlights nothing. `in-range` is
strictly between the ends: the ends paint as selected, and a day claiming both
would take whichever rule came last in the file.

`disabledDate` gets the day **and** which end is being picked, plus the anchor —
without that a minimum stay is not expressible.

Reopening the panel always starts a fresh range. Resuming mid-pick would write
an end for a start the user has forgotten choosing and commit a range they never
saw, and the path that reaches it is ordinary: the first click moves focus to
the end field, so that is the field they come back through.

`DatePanel` regains a `range` prop and an `onDayHover`, which is where the
`[data-in-range]` rule removed in the last batch belongs — it now has a caller
that exercises it.

`Locale.DatePicker` gains `start` and `end`, for the two field placeholders.

---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `Calendar` and `DatePicker` to React, over the date engine in
`@crosskit-ui/core`.

All the arithmetic is already in core — grid generation, month and year
stepping, the daylight-saving-safe day difference, and the rule that a calendar
day is `[year, month, day]` rather than a timestamp. All the naming comes from
`Intl`, so there is no locale pack behind any of this and nothing in the adapter
has a month-length table in it.

The public value is a `Date`, because that is what a consumer has. The
`CalendarDate` triple stays internal: it is what makes the arithmetic exact and
the wrong thing to hand someone who wants to put a date in a request.

**`Calendar`** takes `value`/`defaultValue`/`onChange`, `onPanelChange`,
`disabledDate`, `cellRender` and `fullscreen`. It renders a real `<table
role="grid">` — the pattern a screen reader announces as a date grid, row and
column position included, which no amount of `aria-*` on nested divs expresses.

One tab stop for the whole grid, and the cursor is separate from the selection:
arrows move without selecting, because a picker that commits on every arrow
press fires `onChange` six times crossing a week. Arrows move by day and week,
`PageUp`/`PageDown` by month, `Home`/`End` to the ends of the month, and the
page follows the cursor out of the month rather than leaving focus on a cell
nobody can see.

Disabled days use `aria-disabled`, not the `disabled` attribute. A disabled
button cannot take focus, so the roving tab stop could never land on one — and
the arrow that moved the cursor there would leave focus on the previous cell,
where the next Enter selects the wrong day. Skipping disabled days instead makes
everything past a long block unreachable. So the cell stays focusable and
refuses to activate, by either route.

**`DatePicker`** takes the same value props plus `format`, `placeholder`,
`size`, `status`, `showToday`, `allowClear`, `inputReadOnly` and the anchoring
props. Typing is read back through the locale's own part order — `01/02/2026` is
January in the US and February nearly everywhere else, so reaching for
`Date.parse` would silently pick one. An unparseable or disabled entry reverts
rather than clearing: someone who mistyped wants to see what they had.

Focus does **not** move into the panel when it opens, because the field is typed
into. `ArrowDown`, `PageUp` and `PageDown` hand the grid the keyboard — they do
nothing in a single-line field, so they are free to take, while left and right
stay with the caret. Selecting, Escape and a press outside all return focus to
the field.

New in `@crosskit-ui/styles`: `date.css`, keyed on `data-scope` `calendar` and
`date-picker`. The header's paging arrows are mirrored once with a transform
rather than each button choosing a different icon.

`Locale.DatePicker` gains `clear`, for the clear button's accessible name.

The direction that reverses the horizontal arrows is read off the DOM rather
than from `ConfigProvider`, matching the five other components that reverse
keys: the column order comes from the document's own `dir`, so taking it from
context gave a mirrored grid whose ArrowLeft moved to the previous day whenever
the two disagreed.

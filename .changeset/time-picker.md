---
"@crosskit-ui/core": minor
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add a time engine to `@crosskit-ui/core`, and `TimePicker` to React.

**`core/date/time.ts`** is deliberately separate from `calendar.ts`. That module
exists to keep `Date` honest about days across daylight saving; this one never
touches a day. `CalendarTime` is `[hour, minute, second]` in 24-hour form
always — the twelve-hour split is a _presentation_ of it, produced at the edge,
which is what stops "is 12 AM midnight or noon" leaking into the arithmetic.

`stepValues`, `to12Hour`/`from12Hour`, `compareTimes`, `clampTime`, `timeToDate`,
`formatTime`, `parseTime`, `prefers12Hour` and `getDayPeriods`. Everything
locale-shaped comes from `Intl`:

- **Whether a locale is twelve-hour is asked, not guessed** — it varies inside
  one language, en-US against en-GB.
- **The day-period words come from the locale**, so a Greek or Japanese user's
  own keyboard output parses. Matching on "am"/"pm" would put English into every
  field.
- **Typed digits go through the same ASCII mapping the date parser uses**, since
  `\d` is `[0-9]` and finds nothing in the numbering systems fa-IR or ar-EG
  actually type in.

`toAsciiDigits` is now exported from `date/format` so both parsers share it.

**`TimePicker`** takes `value`/`defaultValue`/`onChange`, `format`, `use12Hours`,
`hourStep`/`minuteStep`/`secondStep`, `showSecond`, `minTime`/`maxTime` and the
usual field and anchoring props.

A committed time is composed onto the day the current value sits on, so a picker
driving one half of a date-and-time pair does not move the other half.

Each column is a `role="listbox"` with **one tab stop**, not one per option —
an hour-minute-second panel is 144 entries, and a keyboard user reaching the OK
button would otherwise walk all of them. Arrows move the stop inside a column
without committing, and clamp at the ends rather than wrapping: arriving at
23:00 by pressing Up past midnight is nobody's intent.

`minTime`/`maxTime` block the entries outside them _and_ clamp a typed value, so
both ways in land on the same answer.

New in `@crosskit-ui/styles`: the `time-picker` block in `date.css`. Columns are
a bounded height with their own scroller — a 60-entry minute column is taller
than most viewports, and a panel that grows to fit one is a panel nobody can
reach the footer of.

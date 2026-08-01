---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `Breadcrumb`, `Steps` and `Segmented` to React.

**`Breadcrumb`** takes `items` (`title`, `href`, `onClick`) and a `separator`.
It renders a `<nav aria-label="Breadcrumb">` around an ordered list, the
separator sits in its own list item and is `aria-hidden` — read aloud inside the
label it turns "Settings" into "Settings slash" — and the last crumb is text
with `aria-current="page"` rather than a link, because it is where you already
are. An item with `onClick` and no `href` renders a `<button>`, not an anchor:
an `<a>` with no `href` takes neither focus nor Enter, so the handler would be
mouse-only.

**`Steps`** takes `items` (`title`, `subTitle`, `description`, `icon`, `status`,
`disabled`) plus `current`, `direction`, `labelPlacement`, `size`, `status`,
`progressDot` and `initial`. Each step's status comes from its position —
before `current` is `finish`, after is `wait` — and `current` itself carries the
group `status`, which is how one `status="error"` marks the step that failed
rather than the whole list. An item's own `status` overrides that.

Passing `onChange` turns the steps into buttons; without it they are inert
markup rather than N extra tab stops.

**`Segmented`** takes `options` (a bare string is both label and value, or
`{ label, value, disabled, icon }`), `value`/`defaultValue`/`onChange`, `size`,
`disabled`, `block` and `vertical`. It is a `role="radiogroup"` of
`role="radio"` buttons with a roving tabindex: one tab stop for the whole
control, arrows move **and** select on both axes, and the list loops. That is
the radio-group pattern rather than the tablist one, which is why there is no
`activationMode` — a segmented control has no panel to load, so deferring
selection would only cost a keypress.

If the selected option is disabled the tab stop moves to the first enabled one,
since a tab stop that cannot take focus is no tab stop.

New in `@crosskit-ui/styles`: `navigation.css`, keyed on `data-scope`
`breadcrumb`, `steps` and `segmented`.

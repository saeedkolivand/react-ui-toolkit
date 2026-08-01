---
"@crosskit-ui/core": major
"@crosskit-ui/react": major
"@crosskit-ui/styles": major
---

Rebuild Tooltip on the core primitives, add Popover, and replace Menu with Dropdown.

`@zag-js/tooltip`, `@zag-js/menu` and `@zag-js/presence` are gone from
`@crosskit-ui/react`, and `use-presence.ts` with them. What remains of the
third-party graph there is Accordion, Select, Tabs and Toast.

**Breaking, React only.** The other three adapters keep the v1 API until they
move too.

Marked `major` rather than `minor`, because `Menu`, `MenuProps`, `MenuItem`,
`MenuEntry` and `MenuSeparator` leave the public API and four `Tooltip` props are
renamed. There is no shape of this change that is compatible with `^1.0.0`, and
the accumulated changesets are meant to land as 2.0.0 anyway — recording it as a
minor would have published removed exports as 1.1.0.

- `Tooltip`'s `content` is now `title`, `contentClassName` is `overlayClassName`,
  and `openDelay`/`closeDelay` are `mouseEnterDelay`/`mouseLeaveDelay` **in
  seconds**. An empty `title` never opens, so `title={row.note}` needs no
  conditional around it. New: `trigger`, `color`.
- `Menu` is now `Dropdown`, and takes the trigger *element* rather than trigger
  content — no generated button, so your own `<Button>` stays exactly one
  button. Items move to `menu={{ items, onClick }}`, `value` to `key`, and
  `{ separator: true }` to `{ type: "divider" }`.
- `Popover` is new: a title, a body, and real controls inside it. `role="dialog"`
  rather than `tooltip`, so a screen reader can reach what is in it. Its default
  `trigger` is `["hover", "click"]` — `click` is what lets a keyboard open it at
  all, since Enter or Space on the trigger dispatches one, and unlike the other
  two there is no second way in.

All three share one hook, so they cannot drift apart in the parts a user can
observe, and all three portal to `document.body` — a transformed ancestor would
otherwise capture the `position: fixed` popup and place it somewhere else.

Dropdown and Popover move focus into the popup when they open and hand it back
when they close, which is what makes a portalled popup reachable at all: tab
order follows the DOM, and the popup is a body sibling at the end of the
document rather than a neighbour of its trigger. Neither does it on a hover-open
— a pointer crossing a trigger is not a request for focus.

`Dropdown` gets arrow keys, Home/End, typeahead, and `aria-activedescendant`
from the primitives already in core. It opens on Enter, Space and the arrows
whatever `trigger` says, because a menu button answering Enter belongs to the
role rather than to the pointer configuration.

`core`'s `computePosition` now also reports how much room the chosen side has,
and `applyPosition` writes it as `--ck-available-width` / `--ck-available-height`.
A popup that scrolls has to cap itself against that or it runs off the screen
with its last items unreachable, and neither flip nor shift can help once the
content is taller than both sides.

Styles: a `popover` scope, an arrow driven by the positioner's own
`data-placement` and `--ck-arrow-x/y`, and a real `z-index` on the anchored
positioners alongside the `--z-index` the v1 adapters still read.

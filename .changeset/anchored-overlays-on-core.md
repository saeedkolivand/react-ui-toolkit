---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Rebuild Tooltip on the core primitives, add Popover, and replace Menu with Dropdown.

`@zag-js/tooltip`, `@zag-js/menu` and `@zag-js/presence` are gone from
`@crosskit-ui/react`, and `use-presence.ts` with them. What remains of the
third-party graph there is Accordion, Select, Tabs and Toast.

**Breaking, React only.** The other three adapters keep the v1 API until they
move too.

- `Tooltip`'s `content` is now `title`, `contentClassName` is `overlayClassName`,
  and `openDelay`/`closeDelay` are `mouseEnterDelay`/`mouseLeaveDelay` **in
  seconds**. An empty `title` never opens, so `title={row.note}` needs no
  conditional around it. New: `trigger`, `color`.
- `Menu` is now `Dropdown`, and takes the trigger *element* rather than trigger
  content — no generated button, so your own `<Button>` stays exactly one
  button. Items move to `menu={{ items, onClick }}`, `value` to `key`, and
  `{ separator: true }` to `{ type: "divider" }`.
- `Popover` is new: a title, a body, and real controls inside it. `role="dialog"`
  rather than `tooltip`, so a screen reader can reach what is in it.

All three share one hook, so they cannot drift apart in the parts a user can
observe, and all three portal to `document.body` — a transformed ancestor would
otherwise capture the `position: fixed` popup and place it somewhere else.

`Dropdown` gets arrow keys, Home/End, typeahead, and `aria-activedescendant`
from the primitives already in core. It opens on Enter, Space and the arrows
whatever `trigger` says, because a menu button answering Enter belongs to the
role rather than to the pointer configuration.

Styles: a `popover` scope, an arrow driven by the positioner's own
`data-placement` and `--ck-arrow-x/y`, and a real `z-index` on the anchored
positioners alongside the `--z-index` the v1 adapters still read.

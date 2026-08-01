---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `Popconfirm` and `Notification` to React.

**`Popconfirm`** takes `title`, `description`, `onConfirm`, `onCancel`,
`okText`, `cancelText`, `okType`, `okDanger`, `okLoading`, `showCancel`, `icon`,
plus the anchoring props `placement`, `trigger`, `open`/`defaultOpen`/
`onOpenChange` and `disabled`. It is a Popover with a question in it, so
positioning, dismissal, the portal and the exit animation are the same code.

Two deliberate differences from Popover. The default trigger is `click` alone,
not hover-and-click: a confirm asks about something destructive and a pointer
crossing the trigger is not the user asking it. And an `onConfirm` that returns
a promise holds OK busy until it settles — a rejection leaves the question up,
because dismissing it would tell the user the action succeeded.

The question and its detail share one column beside the symbol rather than the
detail being indented to a constant. There is no arithmetic to keep in step with
the symbol's width, and nothing left stranded when `icon={false}` removes the
symbol. Both sit in the popover's `title` part, so the dialog's accessible name
is the whole question rather than half of it.

**`Notification`** is a second surface over the same queue `Toaster` renders:
`createToastQueue()` drives either. It emits `data-scope="notification"` so a
page can hold both and style them apart, and it is closable by default — a
message speaks and goes, a notification stays until it is read. `closable: false`
on an item still removes the button.

Both surfaces share every rule in `toast.css` through `:is()` rather than the
notification getting a copy, so there is no second place for one of them to
drift.

Fixed alongside: alt+T now cycles through the non-empty toast regions on the
page instead of each surface grabbing focus for itself, which left whichever
mounted last holding it and the other unreachable — with the label on both still
advertising the shortcut. And the toast grid rule that hands the symbol its row
is now a child combinator, so something a consumer puts in a toast's own title or
description that happens to call itself `icon` no longer takes a row in a grid it
is not a child of.

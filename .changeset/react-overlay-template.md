---
"@crosskit-ui/react": minor
"@crosskit-ui/core": patch
---

React Modal and Drawer are rebuilt on the framework-free primitives in `core` —
focus trap, dismissable layer stack, presence, scroll lock, inert background —
and no longer pull a state-machine dependency. The DOM contract is unchanged, so
no markup-keyed rule moved; `dialog.css` changes only in that the size rules now
read `--ck-modal-width` as their fallback.

New in `ModalProps`: `onOk` / `onCancel` / `okText` / `cancelText` / `okType` /
`okDanger` / `confirmLoading` / `width`, and a default footer built from the
active locale. `footer={null}` removes it. `Drawer` gains `onClose`.

`Portal` is now exported.

Two fixes in `core` that this turned up:

- `createPresence` called `getAnimations` unguarded. Where it does not exist the
  call threw inside a `requestAnimationFrame` callback, where nothing catches
  it, and the node stayed mounted forever.
- `DismissableOptions` gains `focus`, so a focus-trapped layer can opt out of
  dismissing on outside focus. Without it, closing a stacked layer restored
  focus to its trigger at the moment the layer below became topmost and
  dismissed that one too — two nested dialogs closing on one Escape.

`Modal.width` is written as `--ck-modal-width`, which the size rules now read as
their `max-width` fallback — previously an inline `inline-size` was clamped by
the size rule and had no effect. An async `onOk` now holds the confirm button
busy until it settles.

`@zag-js/dialog` is dropped from `@crosskit-ui/react`'s dependencies — nothing
imports it now that Modal and Drawer are rebuilt.

`createFocusTrap` gains a layer stack, matching `pushDismissable` and
`lockScroll`. Without it, nested overlays left two traps active: the outer one
ran first, found its container empty because an inner overlay had marked it
inert, and cancelled every Tab — so Tab from the middle of a nested dialog did
nothing at all. `focusTrapDepth()` is exported for tests.

The focus trap is now activated before the background is made inert, so the
return-focus target is read while the trigger is unambiguously still focused
rather than relying on the focus fixup rule being deferred.


`inertBackground` moves into `core` with a shared registry. Each overlay used to
sweep the background alone and treat every `document.body` child that did not
contain *its* content as background — including another overlay's layers. Two
overlays opening in the same commit each inerted the other, leaving both visible
and untouchable; and closing the lower of two released the page while the upper
was still open. `inertDepth()` is exported for tests.

A non-modal `Modal` no longer closes when focus leaves it. It has no focus trap,
so focus starts on the trigger — outside the layer — and the first Tab onto
anything after it dismissed the dialog, which is the opposite of what a non-modal
dialog is for.

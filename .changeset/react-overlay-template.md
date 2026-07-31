---
"@crosskit-ui/react": minor
"@crosskit-ui/core": patch
---

React Modal and Drawer are rebuilt on the framework-free primitives in `core` —
focus trap, dismissable layer stack, presence, scroll lock — and no longer pull
a state-machine dependency. The DOM contract is unchanged, so no stylesheet
moved.

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

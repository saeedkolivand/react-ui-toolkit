---
"@crosskit-ui/react": major
"@crosskit-ui/styles": major
---

Rebuild Select on the core primitives.

`@zag-js/select` is gone from `@crosskit-ui/react`. Toast is the only component
there still on a machine.

**Breaking, React only.** The other three adapters keep the v1 API until they
move too.

- `items` becomes `options`, and `SelectItem` becomes `SelectOption`.
- `onValueChange({ value, item })` becomes `onChange(value, option)` — the
  option as well as the value, because a consumer almost always wants the label
  too and would otherwise have to look it up again.
- `size` takes `small` / `middle` / `large` and emits `data-size` in that
  vocabulary, so v2 carries its own rules alongside the `sm`/`md`/`lg` block the
  other adapters still match.
- `invalid` becomes `status="error"`, which colours the control and deliberately
  claims nothing to assistive tech. Use `errorMessage` for something a screen
  reader should read; it still sets `data-invalid` and describes the trigger.
- `variant` is gone — it was a field-level prop the select never used
  distinctly.
- **`<Option>` children are gone.** One way to declare options rather than two,
  and the one that survives being generated. It also cannot be wrapped in
  another component, which the v1 doc comment named as its own ceiling.
- New: `placement`, from the same twelve names the overlays take.

The listbox is built on `useAnchored`, so it inherits what the anchored
overlays already had: portalling out of transformed ancestors, collision-aware
placement, dismissal, focus moving in on open and back on close, and a highlight
scrolled into view. Keyboard comes from `navigation.ts`, `collection.ts` and
`createTypeahead` — arrows, Home/End, typeahead, and stepping over disabled
options.

Opening lands on the current selection rather than the top of the list, on every
route in rather than only the keyboard one.

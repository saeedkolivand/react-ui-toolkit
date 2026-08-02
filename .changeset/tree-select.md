---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `TreeSelect` to React — the `Tree` from the last release inside an anchored
control.

Takes `treeData`, `value`/`defaultValue`/`onChange`, `multiple`, `treeCheckable`,
`treeDefaultExpandAll`, `treeExpandedKeys`/`onTreeExpand`, `placeholder`,
`maxTagCount`, `size`, `status`, `disabled`, `allowClear` and the usual
anchoring props.

The value takes the shape the mode implies: a key when single, an array when
`multiple` or `treeCheckable`. `treeCheckable` is inherently many-valued — a
parent tick is a statement about several nodes, and a single-valued checkable
tree could not report it — so it implies `multiple` rather than conflicting with
it. Checked values are the leaves, the same contract `Tree`'s own `onCheck`
keeps.

A single-valued select closes on the first pick; a multi-valued one stays open,
because closing would make every extra choice a fresh round trip through the
trigger.

Its own `data-scope`, deliberately not `select`'s. Borrowing that one would mean
every `[data-scope="select"]` rule applying to a control this file also styles,
with source order deciding which wins — the container-leak shape dressed up as
reuse.

The trigger is a `combobox` with `aria-haspopup="tree"`, so a screen reader can
say what shape of popup is about to open. Focus stays on it while the panel is
up — ArrowDown hands the tree the keyboard, and closing gives focus back.

New in `@crosskit-ui/styles`: the `tree-select` block in `tree.css`. The popup
takes its width from the anchor's own, published by the positioner — a popup
narrower than the control that opened it reads as a different control.

Not in scope: `showSearch`. Filtering a tree while preserving ancestor chains
belongs in core alongside `flattenTree`, and is additive when wanted.

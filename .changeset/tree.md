---
"@crosskit-ui/core": minor
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add tree arithmetic to `@crosskit-ui/core`, and `Tree` to React.

**`core/tree.ts`** answers the two questions a tree implementation gets wrong.

_What is visible._ A tree is nested and a keyboard is not — every arrow key,
every roving tab stop and every "next node" question is asked of a **flat** list.
`flattenTree` omits a collapsed node's descendants entirely rather than marking
them hidden, so "the next node" is the next entry and no caller reimplements the
skip. `isLeaf` wins over the children a node happens to carry, which is what a
lazy-loading caller needs before the load.

_What a check means._ "Checked" in a tree is three states, and the third — a
parent some of whose descendants are checked — is **derived on every read, never
stored**. An incremental version has to be told about every structural change,
and a tree that loaded a subtree lazily would keep a parent ticked over children
it has never seen. Only leaves are stored; `checkedLeaves` is what a form wants
back, since a parent key in the payload is a restatement the server then has to
decide whether to trust.

`toggleCheck` leaves a disabled node exactly as it found it, in both directions:
a parent tick must not reach through something the user was told they cannot
change. `checkable: false` excludes a node _and_ its subtree, so a heading inside
a tree of options is not a thing to tick.

**`Tree`** takes `treeData`, `expandedKeys`/`defaultExpandedKeys`/`onExpand`/
`defaultExpandAll`, `selectedKeys`/`onSelect`/`multiple`, `checkable`/
`checkedKeys`/`onCheck`, `titleRender`, `showLine` and `disabled`.

It renders `role="tree"` over a **flat list of rows** with the indent as a
custom property — nesting the rows would make the DOM disagree with the flat
list the keyboard walks, and every `aria-level` would then need keeping in step
with a depth the markup already implies.

One tab stop for the whole tree, clamped to a row that is actually rendered: a
consumer collapsing a branch while focus sits inside it would otherwise leave
the tree with no stop at all, and Tab would walk straight past it. Arrows move
between visible rows and clamp at the ends; Right opens then steps in, Left
closes then steps **out** to the parent — without that second half, Left on a
leaf does nothing and the only way back up a deep tree is Up, one sibling at a
time.

The row carries `aria-checked`, including `"mixed"`, and the checkbox inside it
is hidden from assistive tech — otherwise the state is announced once per
element.

New in `@crosskit-ui/styles`: `tree.css`. The expander's chevron is rotated
rather than swapped for a second icon, so the two states are one shape with
something to animate between, and it mirrors with the document — a chevron
pointing into a branch points the other way when the branch is on the other
side.

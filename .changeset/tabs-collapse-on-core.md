---
"@crosskit-ui/react": major
"@crosskit-ui/styles": major
---

Rebuild Tabs on the core primitives, and replace Accordion with Collapse.

`@zag-js/accordion` and `@zag-js/tabs` are gone from `@crosskit-ui/react`. What
remains of that graph there is Select and Toast.

**Breaking, React only.** The other three adapters keep the v1 API until they
move too.

- `Tabs`: items are keyed by `key` and carry `children` rather than `id` and
  `content`; `value`/`defaultValue`/`onValueChange` become
  `activeKey`/`defaultActiveKey`/`onChange`, which passes the key itself rather
  than a detail object; `variant` becomes `type` with `line` and `card`; and
  `orientation` becomes `tabPosition`, which derives it — the arrow keys follow
  the axis the list is actually laid out on, so the two cannot disagree.
- `Accordion` is now `Collapse`. Items are keyed the same way, and
  `value`/`defaultValue`/`onValueChange` become
  `activeKey`/`defaultActiveKey`/`onChange`.
- **`Collapse` allows several panels open by default**, where `Accordion`
  allowed one. `accordion` is the prop that opts back into one-at-a-time — the
  inverse of `allowMultiple`, and the default the name change implies.
- `collapsible` is gone. A collapse with nothing open is a legitimate state
  rather than one to be prevented, in both modes.

`activationMode` survives, and is deliberately not part of the API this mirrors:
both are valid in the ARIA pattern, and `manual` is what a panel that loads
something wants — automatic selection would fetch every panel the user arrows
past.

A `Tabs` whose first item is disabled is now keyboard-operable. The selection
fell back to `items[0]` regardless, so the roving `tabIndex={0}` sat on a button
that cannot take focus while every other tab held `-1` — Tab skipped the whole
list and landed on the panel. It picks the first ENABLED item now, and the one
entry in the tab order is always a tab that can be focused, even when a consumer
names a disabled one in `activeKey`. Inherited from v1, which had the same
fallback, and fixable for the first time now the selection is ours.

Keyboard navigation now comes from `navigation.ts` and `collection.ts`, which
also makes it testable: the previous suite could not assert arrow keys at all,
because the machine filtered focus candidates by visibility and jsdom reports
every element as zero-sized.

Styles: v2 tab rules keyed on `data-type`, in logical properties, alongside the
`data-ck-variant` block the v1 adapters still match.

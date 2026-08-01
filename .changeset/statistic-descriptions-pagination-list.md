---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `Statistic`, `Descriptions`, `Pagination` and `List` to React.

**`Statistic`** takes `title`, `value`, `precision`, `prefix`, `suffix`,
`formatter` and `loading`. Numbers go through `Intl.NumberFormat` with the
locale from `ConfigProvider`, so grouping and the decimal mark follow the
reader — 1,234.5 or 1.234,5 from the same call. That is why there is no
`groupSeparator`/`decimalSeparator` pair: two props can only approximate one
locale at a time. `formatter` is the way out. A string `value` is left alone,
since reformatting it would mean parsing it back out first.

**`Descriptions`** takes `items` (`label`, `children`, `span`), `title`,
`extra`, `bordered`, `column`, `layout`, `size` and `colon`. It renders a real
`<dl>` with `<dt>`/`<dd>` — the pairing a screen reader already understands —
and the columns are CSS grid over the top, so `bordered` and `column` are
presentation rather than a second DOM shape. `colon` applies only to horizontal
unbordered layouts, where a trailing colon is the only place it reads as a
label rather than a typo, and it is a pseudo-element so it is not read aloud.

**`Pagination`** takes `total` (items, not pages), `current`/`defaultCurrent`,
`pageSize`/`defaultPageSize`, `onChange`, `showSizeChanger`, `pageSizeOptions`,
`showQuickJumper`, `showTotal`, `siblings`, `size`, `disabled` and
`hideOnSinglePage`. The page window comes from `getPageWindow` in
`@crosskit-ui/core` — the same function `Table` already uses, rather than a
second copy of the ellipsis logic. The current page carries `aria-current`, and
the ellipsis is `aria-hidden`: it is a gap in a sequence, not a control.

The current page is clamped on read, not only on write, because `total` and
`pageSize` are props — shrinking either can strand a page past the end with
nothing to notice it.

**`List`** takes `dataSource`, `renderItem`, `rowKey`, `header`, `footer`,
`bordered`, `size`, `split`, `loading`, `itemLayout`, `pagination` and
`emptyText`, plus `List.Item` and `List.Item.Meta`. It slices to the page
itself rather than making every caller redo the index maths, and pages against
the whole source. An empty list renders `Empty` unless `emptyText` is given —
including `emptyText={null}`, which is how you ask for nothing at all.

`Statistic` and `Pagination` read `ConfigProvider`; `Descriptions` is
server-safe.

New in `@crosskit-ui/styles`: `data.css`, keyed on `data-scope` `statistic`,
`descriptions`, `pagination` and `list`.

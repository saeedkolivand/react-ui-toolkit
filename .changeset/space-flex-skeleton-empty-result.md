---
"@crosskit-ui/core": minor
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `Space`, `Flex`, `Skeleton`, `Empty` and `Result` to React.

Five components with no behaviour between them — no timers, no focus, no
listeners — so all five are pure markup over the existing tokens, and only
`Empty` is a client component (it reads the locale from context).

**`Flex`** is a flexbox wrapper: `vertical`, `justify`, `align`, `flex`, `gap`,
`wrap`, and `component` to render as something other than a `div`. `justify`,
`align` and `flex` take the whole CSS value space, so they land inline rather
than as `data-*` — the documented boundary for props with no finite set of
values. `gap` accepts `"small" | "middle" | "large"`, which resolve to the new
`--ck-space-sm/md/lg` tokens, or any number (pixels) or CSS length.

**`Space`** puts a gap between its children and, unlike a bare `gap`, can put
something _between_ them:

```tsx
<Space split={<Divider orientation="vertical" />}>
  <Button>Edit</Button>
  <Button>Delete</Button>
</Space>
```

Each child is wrapped in an `item` part. `size` takes one value or
`[horizontal, vertical]`. A horizontal Space centres its items by default, since
controls of unequal height otherwise sit on different lines.

**`Skeleton`** draws a loading placeholder: `avatar`, `title`, `paragraph`
(rows and per-row widths), `active` for the shimmer, `round`. Omitting `loading`
shows the placeholder, so `<Skeleton />` on its own works and
`<Skeleton loading={busy}>…</Skeleton>` is a switch. `Skeleton.Avatar`,
`.Button`, `.Input`, `.Image` and `.Node` are standalone blocks. The container
carries `aria-busy` rather than a live region — there is no text to announce.

**`Empty`** is the no-data state: `description` (from the locale unless given —
`null` or `false` removes it), `image` as a node or a URL string, and children
as a footer. Two built-in illustrations ship as `Empty.PRESENTED_IMAGE_DEFAULT`
and `Empty.PRESENTED_IMAGE_SIMPLE`.

**`Result`** is the after-the-fact state: `status` (`success`, `error`, `info`,
`warning`, `404`, `403`, `500`), `title`, `subTitle`, `icon`, `extra`, and
children. The actions render last, after any children.

`Locale` gains an `Empty` entry, so a custom locale object needs one more field.
The shipped `enUS` has it already.

New in `@crosskit-ui/core`: `hasContent(slot)`, the check every optional slot
now goes through before emitting its wrapper part. `{condition && <Divider/>}`
evaluates to `false`, not `undefined`, and `{items.map(…)}` on an empty list
evaluates to `[]` — every framework renders both as nothing, so a `!= null`
check passes them through and emits an empty wrapper, which still takes its gap
as a flex item. Arrays recurse; a slot wrapped in a fragment is opaque to core
and cannot be detected framework-free.

New in `@crosskit-ui/styles`: `--ck-space-sm`, `--ck-space-md` and
`--ck-space-lg` tokens, and `--ck-skeleton-fill` / `--ck-skeleton-sheen` for
retinting every placeholder block at once.

# @crosskit-ui/core

## 2.0.0

### Major Changes

- [#67](https://github.com/saeedkolivand/crosskit/pull/67) [`a267c58`](https://github.com/saeedkolivand/crosskit/commit/a267c5886bf55e77f5e3891d1282f6a0bb02e74a) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Rebuild Tooltip on the core primitives, add Popover, and replace Menu with Dropdown.

  `@zag-js/tooltip`, `@zag-js/menu` and `@zag-js/presence` are gone from
  `@crosskit-ui/react`, and `use-presence.ts` with them. What remains of the
  third-party graph there is Accordion, Select, Tabs and Toast.

  **Breaking, React only.** The other three adapters keep the v1 API until they
  move too.

  Marked `major` rather than `minor`, because `Menu`, `MenuProps`, `MenuItem`,
  `MenuEntry` and `MenuSeparator` leave the public API and four `Tooltip` props are
  renamed. There is no shape of this change that is compatible with `^1.0.0`, and
  the accumulated changesets are meant to land as 2.0.0 anyway — recording it as a
  minor would have published removed exports as 1.1.0.

  - `Tooltip`'s `content` is now `title`, `contentClassName` is `overlayClassName`,
    and `openDelay`/`closeDelay` are `mouseEnterDelay`/`mouseLeaveDelay` **in
    seconds**. An empty `title` never opens, so `title={row.note}` needs no
    conditional around it. New: `trigger`, `color`.
  - `Menu` is now `Dropdown`, and takes the trigger _element_ rather than trigger
    content — no generated button, so your own `<Button>` stays exactly one
    button. Items move to `menu={{ items, onClick }}`, `value` to `key`, and
    `{ separator: true }` to `{ type: "divider" }`.
  - `Popover` is new: a title, a body, and real controls inside it. `role="dialog"`
    rather than `tooltip`, so a screen reader can reach what is in it. Its default
    `trigger` is `["hover", "click"]` — `click` is what lets a keyboard open it at
    all, since Enter or Space on the trigger dispatches one, and unlike the other
    two there is no second way in.

  All three share one hook, so they cannot drift apart in the parts a user can
  observe, and all three portal to `document.body` — a transformed ancestor would
  otherwise capture the `position: fixed` popup and place it somewhere else.

  Dropdown and Popover move focus into the popup when they open and hand it back
  when they close, which is what makes a portalled popup reachable at all: tab
  order follows the DOM, and the popup is a body sibling at the end of the
  document rather than a neighbour of its trigger. Neither does it on a hover-open
  — a pointer crossing a trigger is not a request for focus.

  `Dropdown` gets arrow keys, Home/End, typeahead, and `aria-activedescendant`
  from the primitives already in core. It opens on Enter, Space and the arrows
  whatever `trigger` says, because a menu button answering Enter belongs to the
  role rather than to the pointer configuration.

  `core`'s `computePosition` now also reports how much room the chosen side has,
  and `applyPosition` writes it as `--ck-available-width` / `--ck-available-height`.
  A popup that scrolls has to cap itself against that or it runs off the screen
  with its last items unreachable, and neither flip nor shift can help once the
  content is taller than both sides.

  Styles: a `popover` scope, an arrow driven by the positioner's own
  `data-placement` and `--ck-arrow-x/y`, and a real `z-index` on the anchored
  positioners alongside the `--z-index` the v1 adapters still read.

- [#70](https://github.com/saeedkolivand/crosskit/pull/70) [`b096aae`](https://github.com/saeedkolivand/crosskit/commit/b096aaece88c47c40260c806b593c80ea4272383) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Rebuild Select on the core primitives.

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
  - `invalid` becomes `status="error"`, which colours the control and marks the
    trigger `aria-invalid`. `status="warning"` is presentation only, since there is
    no ARIA state for it. `errorMessage` sets `aria-invalid` too and describes the
    trigger, and is what a screen reader actually reads out.
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

  `applyPosition` also publishes `--ck-anchor-width`, so a popup that belongs to
  its trigger can match it rather than sizing to its own content — a listbox
  sized to its content jumps about as the options change.

  Opening lands on the current selection rather than the top of the list, on every
  route in rather than only the keyboard one.

### Minor Changes

- [#57](https://github.com/saeedkolivand/crosskit/pull/57) [`e3dce7f`](https://github.com/saeedkolivand/crosskit/commit/e3dce7f4ebf010aa6b933d0f30eed6ce1cfa7565) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add the dependency-free behaviour primitives to `@crosskit-ui/core`.

  Focus trapping with wrap and restore, a shared dismissable layer stack so nested overlays close in
  the right order, presence tracking that keeps a node mounted through its exit animation,
  reference-counted scroll locking, and a pure collection plus keyboard navigation with typeahead.

  Nothing consumes them yet.

- [#62](https://github.com/saeedkolivand/crosskit/pull/62) [`667ac59`](https://github.com/saeedkolivand/crosskit/commit/667ac596584cfb4a627ecf24f60e04ef456a3b05) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add a dependency-free date engine to `@crosskit-ui/core`.

  Calendar arithmetic on `[year, month, day]` rather than timestamps, so daylight saving cannot skew
  it; month grids padded to whole weeks with a configurable week start; and month names, weekday
  names, formatting and locale-aware parsing entirely from `Intl` — no locale packs.

  This completes Phase 3. Nothing consumes any of it yet.

- [#61](https://github.com/saeedkolivand/crosskit/pull/61) [`722ff04`](https://github.com/saeedkolivand/crosskit/commit/722ff04f80e3651b8af79245b6aa5492724dc8a2) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add a dependency-free form engine to `@crosskit-ui/core`.

  Nested field paths, declarative validation rules with templated messages, per-field and per-form
  validate triggers, cross-field dependencies, async validators, list fields with error re-indexing,
  and submission state.

  The CSS compiler's `Rule` type is renamed `CssRule`, since the validation rule has the stronger
  claim on the bare name.

- [#51](https://github.com/saeedkolivand/crosskit/pull/51) [`9efaa3f`](https://github.com/saeedkolivand/crosskit/commit/9efaa3fbe798ee7803cf211bdedf7beb11aa7104) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add a dependency-free anchor positioner to `@crosskit-ui/core`.

  `computePosition()` is pure geometry — rects in, coordinates out — with flip, shift, arrow
  placement and RTL mirroring, and it accepts both canonical placements (`top-start`) and their
  camelCase aliases (`topLeft`). `attachPosition()` is the DOM half, keeping a floating element on
  its anchor across scroll, resize and either element changing size.

  This is the first piece of the v2 behaviour core. Nothing consumes it yet.

- [#59](https://github.com/saeedkolivand/crosskit/pull/59) [`7bf2fd2`](https://github.com/saeedkolivand/crosskit/commit/7bf2fd29834afab90ba9d767dc676a6d9b4f8805) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Complete the motion engine in `@crosskit-ui/core`.

  `flipLayout()` animates layout changes the browser cannot tween — toast stacks resettling, table
  rows moving on sort — by inverting the change and animating the inversion away. `createDrag()`
  recognises pointer drags with trailing-window velocity, for drag-to-dismiss. `stagger()` produces
  delays for a sequence.

  Nothing consumes them yet.

- [#58](https://github.com/saeedkolivand/crosskit/pull/58) [`b706129`](https://github.com/saeedkolivand/crosskit/commit/b7061296f17d5a7f09dd03b03d69f1484325026f) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add spring physics and a Web Animations wrapper to `@crosskit-ui/core`.

  `createSpring()` solves the damped harmonic oscillator analytically, and `toLinearEasing()` samples
  it into a CSS `linear()` easing — so an uninterrupted spring runs on the compositor with no
  JavaScript at all. `animate()` and `retarget()` cover what CSS cannot: interruption from the
  current value, and keyframes only known at runtime.

  Nothing consumes them yet.

- [#76](https://github.com/saeedkolivand/crosskit/pull/76) [`978b924`](https://github.com/saeedkolivand/crosskit/commit/978b9246acf67a305859f1dd1d4beec0154a7e32) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add `Slider`, `InputNumber` and `Rate`, on a new numeric primitive in core.

  `@crosskit-ui/core` gains `clamp`, `decimals`, `snap`, `stepBy`, `ratio`,
  `fromRatio` and `numericKey` — the arithmetic all three share. Written once
  because floating-point step maths is not something to get right four times, and
  Phase 5 needs it framework-free anyway. `snap` rounds back to the precision its
  inputs are written with, so a 0.1 step reports `0.3` rather than
  `0.30000000000000004`.

  **`Slider`** takes `min`, `max`, `step`, `value`/`defaultValue`, `onChange`,
  `onChangeComplete`, `vertical`, `disabled`, `marks` and `tooltip`. Dragging uses
  pointer capture, so a drag that leaves the track keeps tracking — without it the
  thumb stops exactly when a user is reaching for the end. `onChangeComplete` is
  separate from `onChange` so a caller has somewhere to hang a network request
  that is not every frame of a drag.

  **`InputNumber`** takes `min`, `max`, `step`, `value`/`defaultValue`,
  `onChange`, `size`, `disabled`, `status`, `prefix`, `suffix`, `controls` and
  `precision`. It keeps the typed text apart from the value: `"1."` and `"-"` are
  states a number cannot represent, and clamping on each keystroke turns `5` into
  the max the moment someone starts typing `50`. The clamp happens on blur. An
  empty field is `null`, which is a different answer from `0`.

  Home and End are left to the caret — in a text field they belong to it, and
  stealing them makes a long number impossible to edit from the front.

  **`Rate`** takes `count`, `value`/`defaultValue`, `onChange`, `onHoverChange`,
  `allowHalf`, `allowClear`, `disabled`, `character` and `tooltips`. Clicking the
  current value clears it, which is the only route back to zero with a pointer.
  `tooltips` becomes `aria-valuetext`, so it reads "Fair" rather than "3".

  `Locale` gains an `InputNumber` entry for the two spinner labels.

  New in `@crosskit-ui/styles`: `numeric.css`, keyed on `data-scope` `slider`,
  `input-number` and `rate`.

- [#64](https://github.com/saeedkolivand/crosskit/pull/64) [`00cb4b5`](https://github.com/saeedkolivand/crosskit/commit/00cb4b52687f09ac4a45dc9a13886f354677d55f) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Begin the React v2 API. `Button` now takes `type`, `size` (small/middle/large), `shape`, `danger`,
  `ghost`, `block`, a `ReactNode` icon, and `htmlType` for the native attribute; an `href` renders an
  anchor. `ConfigProvider` carries a compiled theme, locale and direction.

  This is a breaking change to `@crosskit-ui/react`. The other adapters are unchanged until they
  follow.

- [#72](https://github.com/saeedkolivand/crosskit/pull/72) [`3218fcc`](https://github.com/saeedkolivand/crosskit/commit/3218fcc3e75b1798401fb747e34b65ccbeece298) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add `Space`, `Flex`, `Skeleton`, `Empty` and `Result` to React.

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
  `.Button`, `.Input`, `.Image` and `.Node` are standalone blocks. With
  `loading={false}` the children are returned bare — no wrapper, so no
  `className`, `id` or `ref` either; put those on something present in both
  states. The container
  carries `aria-busy` rather than a live region — there is no text to announce.

  **`Empty`** is the no-data state: `description` (from the locale unless given —
  `null` or `false` removes it), `image` as a node or a URL string, and children
  as a footer. `image` reads the same way: absent takes the default illustration,
  `null` or `false` removes it. Two built-in illustrations ship as `Empty.PRESENTED_IMAGE_DEFAULT`
  and `Empty.PRESENTED_IMAGE_SIMPLE`.

  **`Result`** is the after-the-fact state: `status` (`success`, `error`, `info`,
  `warning`, `404`, `403`, `500`), `title`, `subTitle`, `icon`, `extra`, and
  children. `icon` follows the same rule as `Empty`'s `image` — absent takes the
  built-in one, `null` or `false` removes it. The actions render last, after any
  children.

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

- [#56](https://github.com/saeedkolivand/crosskit/pull/56) [`bd38d9a`](https://github.com/saeedkolivand/crosskit/commit/bd38d9a9c2f703a358464ef15e93abddf0b5405e) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Compile `styleOverrides` into static CSS.

  `createTheme({ components: { Button: { token, styleOverrides } } })` now accepts arbitrary CSS per
  part, written as `({ theme, ownerState }) => ({ … })`. The function is evaluated once per variant
  combination at theme-creation time and emitted as plain selectors, so the authoring API costs
  nothing at runtime.

- [#60](https://github.com/saeedkolivand/crosskit/pull/60) [`75a8295`](https://github.com/saeedkolivand/crosskit/commit/75a82957953c6f83e1581498194e2fdf9329e236) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add a dependency-free table store to `@crosskit-ui/core`.

  Multi-column sorting, per-column and global filtering, pagination, row selection keyed by row id,
  column visibility and expansion — framework-free, over plain data. Exported as
  `createTableStoreV2` alongside the existing store, which the adapters still use until they are
  rewritten.

- [#55](https://github.com/saeedkolivand/crosskit/pull/55) [`5d5405d`](https://github.com/saeedkolivand/crosskit/commit/5d5405d850705734cdb3ac476fe5d6a273217345) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add `createTheme()` to `@crosskit-ui/core`.

  A theme configuration goes in and a plain CSS string comes out — colour ramps derived from one
  brand colour in OKLCH, plus radius and duration scales, wrapped in `@layer ck.overrides`. Nothing
  runs at render time: no style engine, no class hashing, no per-framework SSR collector.

  `themeScript()` returns an inline script that applies a stored theme preference before first
  paint. Nothing consumes either yet.

- [#82](https://github.com/saeedkolivand/crosskit/pull/82) [`0627c42`](https://github.com/saeedkolivand/crosskit/commit/0627c426ac198c58e64c405677d96101e752c0d6) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add a time engine to `@crosskit-ui/core`, and `TimePicker` to React.

  **`core/date/time.ts`** is deliberately separate from `calendar.ts`. That module
  exists to keep `Date` honest about days across daylight saving; this one never
  touches a day. `CalendarTime` is `[hour, minute, second]` in 24-hour form
  always — the twelve-hour split is a _presentation_ of it, produced at the edge,
  which is what stops "is 12 AM midnight or noon" leaking into the arithmetic.

  `stepValues`, `to12Hour`/`from12Hour`, `compareTimes`, `clampTime`, `timeToDate`,
  `formatTime`, `parseTime`, `prefers12Hour` and `getDayPeriods`. Everything
  locale-shaped comes from `Intl`:

  - **Whether a locale is twelve-hour is asked, not guessed** — it varies inside
    one language, en-US against en-GB.
  - **The day-period words come from the locale**, so a Greek or Japanese user's
    own keyboard output parses. Matching on "am"/"pm" would put English into every
    field.
  - **Typed digits go through the same ASCII mapping the date parser uses**, since
    `\d` is `[0-9]` and finds nothing in the numbering systems fa-IR or ar-EG
    actually type in.

  `toAsciiDigits` is now exported from `date/format` so both parsers share it.

  **`TimePicker`** takes `value`/`defaultValue`/`onChange`, `format`, `use12Hours`,
  `hourStep`/`minuteStep`/`secondStep`, `showSecond`, `minTime`/`maxTime` and the
  usual field and anchoring props.

  A committed time is composed onto the day the current value sits on, so a picker
  driving one half of a date-and-time pair does not move the other half.

  Each column is a `role="listbox"` with **one tab stop**, not one per option —
  an hour-minute-second panel is 144 entries, and a keyboard user reaching the OK
  button would otherwise walk all of them. Arrows move the stop inside a column
  without committing, and clamp at the ends rather than wrapping: arriving at
  23:00 by pressing Up past midnight is nobody's intent.

  `minTime`/`maxTime` block the entries outside them _and_ clamp a typed value, so
  both ways in land on the same answer.

  New in `@crosskit-ui/styles`: the `time-picker` block in `date.css`. Columns are
  a bounded height with their own scroller — a 60-entry minute column is taller
  than most viewports, and a panel that grows to fit one is a panel nobody can
  reach the footer of.

- [#71](https://github.com/saeedkolivand/crosskit/pull/71) [`bd9f7a3`](https://github.com/saeedkolivand/crosskit/commit/bd9f7a32d156e738912e69c0e29582b75da6f052) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Rebuild React's Toaster on a framework-free queue in `core`.

  `createToastQueue()` is new in `@crosskit-ui/core`: a plain store with the queue,
  per-toast countdowns, pause and resume, overflow and placement in it, and no
  framework anywhere. `<Toaster>` in React reads it through `useSyncExternalStore`.

  **Breaking, React only.** `<Toaster toaster>` now takes a `ToastQueue` from
  `createToastQueue()` rather than the store from `createToaster()`:

  ```diff
  -import { createToaster } from "@crosskit-ui/core";
  -export const toaster = createToaster();
  +import { createToastQueue } from "@crosskit-ui/core";
  +export const toaster = createToastQueue();
  ```

  Everything you call on it is unchanged — `create`, `success`, `error`,
  `warning`, `info`, `loading`, `update`, `dismiss`. Vue, Svelte and Angular keep
  `createToaster()` and are untouched.

  The group emits what it did before. **Each toast root emits less.** The flow
  layout has no per-toast geometry, so `data-first`, `data-stack`, `data-ghost`,
  `data-overlap`, `data-sibling`, `data-mounted` and `data-paused` are gone along
  with the `--x`/`--y`/`--z-index`/`--offset` custom properties that drove the
  old stacking, and `data-placement`, `data-side` and `data-align` now live on the
  group only. `data-state`, `data-type` and the part attributes are unchanged. If
  you style a toast off any of the removed ones, move the selector to the group or
  key it on `data-state`.

  `dir` is also gone, deliberately. Every rule is written in logical properties,
  so the group inherits direction from its ancestors — and an explicit `dir="ltr"`
  inside an RTL document would have forced the wrong one.

  Two option names differ on the factory: `removeDelay` replaces the machine's
  `gap`/`offsets`, which were part of an absolute-positioning scheme the flow
  layout does not have. Placement, `max` and `duration` are the same.

  `@crosskit-ui/react` now declares **no third-party runtime dependencies at all**
  — only its sibling `@crosskit-ui/*` packages.

  Also fixed: the exit transition ran for 300ms while a dismissed toast was
  removed after 200ms, so the last third of every exit was cut off mid-flight.
  The two are now a documented pair, in both files.

  Toasts enter with an animation again. A node inserted straight at its resting
  style has nothing to transition from, so this is keyframes rather than a
  transition on `data-state` — which only ever drove the exit.

- [#83](https://github.com/saeedkolivand/crosskit/pull/83) [`6c2537f`](https://github.com/saeedkolivand/crosskit/commit/6c2537fdb02b1bc7ec96bd917aecafb0448078c9) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add tree arithmetic to `@crosskit-ui/core`, and `Tree` to React.

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

### Patch Changes

- [#50](https://github.com/saeedkolivand/crosskit/pull/50) [`3c85176`](https://github.com/saeedkolivand/crosskit/commit/3c8517672ef5c3e1de79db2cfd0e10d74338f573) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add a README to every package — 1.0.0 shipped with none, so each npm page showed only "no README available". Also drops an unused `@zag-js/presence` dependency from `@crosskit-ui/angular`.

- [#63](https://github.com/saeedkolivand/crosskit/pull/63) [`109d5c6`](https://github.com/saeedkolivand/crosskit/commit/109d5c6b7964cfee768fd1375a9628606bb591a1) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - `applyPosition` now sets `position: fixed` itself rather than relying on a stylesheet rule that
  never existed. The coordinates it writes are viewport-relative, so anything else measures them
  from the wrong containing block — silently, since the element still renders.

- [#65](https://github.com/saeedkolivand/crosskit/pull/65) [`ce1b99c`](https://github.com/saeedkolivand/crosskit/commit/ce1b99c0bac8c921088126232e965c58628537d8) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - React Modal and Drawer are rebuilt on the framework-free primitives in `core` —
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

  `inertBackground` moves into `core` with a shared registry, in which exactly
  one overlay — the topmost — is foreground. Each overlay used to
  sweep the background alone and treat every `document.body` child that did not
  contain _its_ content as background — including another overlay's layers. Two
  overlays opening in the same commit each inerted the other, leaving both visible
  and untouchable; and closing the lower of two released the page while the upper
  was still open. `inertDepth()` is exported for tests.

  A non-modal `Modal` no longer closes when focus leaves it. It has no focus trap,
  so focus starts on the trigger — outside the layer — and the first Tab onto
  anything after it dismissed the dialog, which is the opposite of what a non-modal
  dialog is for.

## 1.0.0

### Major Changes

- [#42](https://github.com/saeedkolivand/crosskit/pull/42) [`0fa9b31`](https://github.com/saeedkolivand/crosskit/commit/0fa9b3174d4cf5cfcc72ee616ef1cd994f1666ca) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - CrossKit 1.0.0 — the first release under this name.

  `@saeedkolivand/react-ui-toolkit` was a React-only component library that composed Tailwind utility classes at runtime. CrossKit is the same 27 components with the same API in **React, Vue, Svelte and Angular**: behaviour from Zag.js state machines shared across all four, styling from one precompiled stylesheet keyed to `data-scope` / `data-part` / `data-state`.

  Consumers need no Tailwind of their own — it is an authoring tool here, not a runtime dependency. `tailwind-merge`, `classnames` and `framer-motion` are gone with nothing replacing them.

  This is a clean break, not a rename. See `docs/migrating-from-react-ui-toolkit.md`, which lists every API change and the seven v0 bugs whose workarounds can now be deleted.

### Minor Changes

- [#31](https://github.com/saeedkolivand/crosskit/pull/31) [`1b9981d`](https://github.com/saeedkolivand/crosskit/commit/1b9981db8ca5c1bc04cba63e18d22687b1470492) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Table across all four adapters, plus `createTableStore`, `toColumnDefs`, `fromLegacyColumns` and `getPageWindow` in core. `@tanstack/table-core` is bound once in core rather than through the four official framework adapters.

- [#30](https://github.com/saeedkolivand/crosskit/pull/30) [`d7fd5ba`](https://github.com/saeedkolivand/crosskit/commit/d7fd5ba4793a1f5b8d2453b93f11d9459732e29f) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Toast across all four adapters: `createToaster()` in core plus a `<Toaster>` per framework, driven by `@zag-js/toast`. Replaces v0's `NotificationProvider` + `useNotification()`.

- [#29](https://github.com/saeedkolivand/crosskit/pull/29) [`f66d3b7`](https://github.com/saeedkolivand/crosskit/commit/f66d3b7036d1b66b6dd9f197c167604e47827bbb) Thanks [@saeedkolivand](https://github.com/saeedkolivand)! - Add Tooltip and Menu across all four adapters, driven by `@zag-js/tooltip` and `@zag-js/menu`, plus `resolvePlacement` in core for v0's Ant placement names.

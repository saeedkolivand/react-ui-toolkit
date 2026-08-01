---
"@crosskit-ui/react": minor
"@crosskit-ui/styles": minor
---

Add `Form`, `Form.Item` and `Form.List` to React, over the form engine in
`@crosskit-ui/core`.

Everything that decides behaviour already lives in core — values, errors,
touched state, rule evaluation, dependency re-validation and list re-indexing —
so what is new here is subscription, context and markup. That is deliberate:
"when does this field validate" and "which fields re-validate when this one
changes" are where four hand-written adapters would diverge from each other.

**`Form`** takes `form` (from `Form.useForm()`, optional — omit it and the form
owns its own instance), `initialValues`, `onFinish`, `onFinishFailed`, `layout`,
`validateTrigger`, `disabled` and `requiredMark`. It renders a `<form
noValidate>`: the browser's own validation bubbles fire before any rule here
runs and say something different in a different language, so the rules are the
contract and the browser's are not.

**`Form.Item`** takes `name`, `label`, `rules`, `dependencies`, `valuePropName`,
`trigger`, `getValueFromEvent`, `validateTrigger`, `help`, `extra`, `required`
and `noStyle`. It clones its child to bind the value — and **composes** the
child's own `onChange` and `onBlur` rather than replacing them, which is the
failure mode that makes cloning dangerous and the one thing it has to get right.

The default unwrapper reads `target[valuePropName]` from an event-like first
argument and passes anything else through, so one default covers a text input
(`target.value`), a checkbox (`valuePropName="checked"` → `target.checked`) and
our own controls, which report `onChange(next)` directly.

Validation defaults to blur, not change: telling someone their address is
invalid while they are typing the first character of it is worse than saying
nothing. A visible error still clears the moment the value becomes valid.

**`Form.List`** takes `name` and a render function `(fields, { add, remove,
move })`. A row's `name` is its index, so `name={[field.name, "email"]}` inside
`<Form.List name="guests">` resolves to `guests[0].email` — the prefix arrives
through context, since the rows are rendered by the caller and there is nothing
for the list to wrap. Row keys are handed out per row rather than being the
index: removing row 1 of three shifts row 2 into index 1, and an index key makes
React reuse the removed row's DOM for it, taking the caret, any scroll position
and any uncontrolled state to the wrong row.

Three layouts. `horizontal` shares one label column across every row through
`subgrid`, so the column is as wide as the widest label with nothing measured
and no width to configure; a row with no label still occupies the control
column. `vertical` is the default and `inline` wraps.

New in `@crosskit-ui/styles`: `form.css`, keyed on `data-scope="form"`. The
required marker is generated content on `[data-required]`, so it cannot be
mistaken for text by a screen reader — it is decoration, and `aria-invalid` plus
the error's `aria-describedby` are what actually carry the state.

Known gap, unchanged by this: `Select` feeds its `...rest` to the anchoring hook
rather than to the DOM, so the `id` and `aria-*` a `Form.Item` injects do not
reach it. Value and change binding work, because those are declared props.

import type { ComponentDoc } from "./types";

const FIELD_PROPS = [
  {
    name: "variant",
    type: '"default" | "filled" | "outline"',
    default: '"default"',
    description: "Field style. v0 had Input take `outline` and Textarea `outlined`.",
  },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control size." },
  { name: "label", type: "ReactNode", description: "Label, associated by id." },
  { name: "helperText", type: "ReactNode", description: "Hint below the field." },
  {
    name: "invalid",
    type: "boolean",
    default: "false",
    description: "Marks the field invalid. v0 called this `error`.",
  },
  {
    name: "errorMessage",
    type: "ReactNode",
    description: "Replaces helperText and wins aria-describedby.",
  },
  { name: "fullWidth", type: "boolean", default: "true", description: "Stretch to 100%." },
];

export const forms: ComponentDoc[] = [
  {
    slug: "input",
    name: "Input",
    group: "Forms",
    scope: "input",
    summary: "A text field with label, helper text, error state and optional prefix/suffix slots.",
    props: [
      ...FIELD_PROPS,
      { name: "prefix", type: "ReactNode", description: "Content before the input." },
      { name: "suffix", type: "ReactNode", description: "Content after the input." },
    ],
    changes: [{ from: "error", to: "invalid" }],
    samples: {
      react: `import { Input } from "@crosskit-ui/react";

<Input label="Email" type="email" helperText="We never share it." />`,
      vue: `<Input label="Email" type="email" helper-text="We never share it." />`,
      svelte: `<Input label="Email" type="email" helperText="We never share it." />`,
      angular: `<input ckInput label="Email" type="email" helperText="We never share it." />`,
    },
  },
  {
    slug: "textarea",
    name: "Textarea",
    group: "Forms",
    scope: "textarea",
    summary:
      "A multi-line field. Auto-resize is CSS (`field-sizing: content`, with a replica fallback) rather than a keystroke handler — so it also grows on paste, on a programmatic set, and for an initial value, none of which v0 handled.",
    props: [
      ...FIELD_PROPS,
      {
        name: "autoResize",
        type: "boolean",
        default: "false",
        description: "Grow with the content.",
      },
    ],
    changes: [
      { from: "error", to: "invalid" },
      { from: 'variant="outlined"', to: 'variant="outline"', note: "Now matches Input." },
    ],
    samples: {
      react: `<Textarea label="Notes" autoResize rows={3} />`,
      vue: `<Textarea label="Notes" auto-resize :rows="3" />`,
      svelte: `<Textarea label="Notes" autoResize rows={3} />`,
      angular: `<textarea ckTextarea label="Notes" autoResize [rows]="3"></textarea>`,
    },
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    group: "Forms",
    scope: "checkbox",
    summary:
      "A native checkbox with a styled control. `indeterminate` is a DOM property with no HTML attribute, which is why it needs an effect rather than a prop on the element.",
    props: [
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control size." },
      { name: "label", type: "ReactNode", description: "Label text." },
      { name: "invalid", type: "boolean", default: "false", description: "Invalid state." },
      { name: "indeterminate", type: "boolean", default: "false", description: "Mixed state." },
    ],
    samples: {
      react: `<Checkbox label="Accept terms" onChange={e => set(e.target.checked)} />`,
      vue: `<Checkbox v-model="accepted" label="Accept terms" />`,
      svelte: `<Checkbox bind:checked={accepted} label="Accept terms" />`,
      angular: `<ck-checkbox label="Accept terms" [(checked)]="accepted" />`,
    },
  },
  {
    slug: "radio",
    name: "Radio & RadioGroup",
    group: "Forms",
    scope: "radio",
    summary:
      "Native radios sharing a `name` already handle selection and arrow keys. RadioGroup adds the group semantics screen readers need, which v0 never provided.",
    props: [
      { name: "value", type: "string", description: "This radio's value." },
      { name: "label", type: "ReactNode", description: "Label text." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control size." },
      {
        name: "RadioGroup.invalid",
        type: "boolean",
        default: "false",
        description:
          'Marks the group invalid. aria-invalid is not supported on role="radio", so it lives here, not on the individual radio.',
      },
      {
        name: "RadioGroup.orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout axis.",
      },
    ],
    samples: {
      react: `<RadioGroup name="size" label="Size">
  <Radio value="s" label="Small" />
  <Radio value="m" label="Medium" />
</RadioGroup>`,
      vue: `<RadioGroup name="size" label="Size">
  <Radio value="s" label="Small" />
  <Radio value="m" label="Medium" />
</RadioGroup>`,
      svelte: `<RadioGroup name="size" label="Size">
  <Radio value="s" label="Small" bind:group={size} />
  <Radio value="m" label="Medium" bind:group={size} />
</RadioGroup>`,
      angular: `<ck-radio-group label="Size">
  <ck-radio name="size" value="s" label="Small" [(selected)]="size" />
  <ck-radio name="size" value="m" label="Medium" [(selected)]="size" />
</ck-radio-group>`,
    },
  },
  {
    slug: "switch",
    name: "Switch",
    group: "Forms",
    scope: "switch",
    summary:
      'A single `<input role="switch">`. v0 fired two different event shapes — a synthesised `{target:{checked}}` from a wrapper div\'s onClick, and the real onChange from the inner input — and which one you got depended on where you clicked.',
    props: [
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control size." },
      { name: "label", type: "ReactNode", description: "Label text." },
    ],
    changes: [
      {
        from: "two competing change events",
        to: "one native change event",
        note: "Handlers that ran twice, or not at all, now run exactly once.",
      },
    ],
    samples: {
      react: `<Switch label="Notifications" onChange={e => set(e.target.checked)} />`,
      vue: `<Switch v-model="on" label="Notifications" />`,
      svelte: `<Switch bind:checked={on} label="Notifications" />`,
      angular: `<ck-switch label="Notifications" [(checked)]="on" />`,
    },
  },
  {
    slug: "select",
    name: "Select & Option",
    group: "Forms",
    scope: "select",
    machine: "@zag-js/select",
    gains: [
      "Arrow-key navigation and Home/End",
      "Typeahead",
      "A managed highlight that keyboard and mouse cannot disagree about",
      "A real hidden <select>, so plain form submission works",
    ],
    summary:
      'The trigger is a real `<button role="combobox">`. v0 used `<input readOnly role="combobox">`, which is the ARIA pattern for a typeahead combobox and wrong for a plain select.',
    props: [
      { name: "items", type: "SelectItem[]", description: "Options as data." },
      { name: "value", type: "string", description: "Controlled value. Single-select in v1." },
      { name: "defaultValue", type: "string", description: "Uncontrolled initial value." },
      {
        name: "onValueChange",
        type: "(d: { value, item }) => void",
        description: "Replaces v0's synthesised change event.",
      },
      {
        name: "placeholder",
        type: "string",
        default: '"Select an option"',
        description: "Shown while empty.",
      },
      { name: "name", type: "string", description: "Submitted through the hidden <select>." },
      ...FIELD_PROPS.filter(p => p.name !== "variant"),
    ],
    changes: [
      { from: "options", to: "items" },
      { from: "onChange(e) with e.target.value", to: "onValueChange({ value, item })" },
      { from: "error", to: "invalid" },
      {
        from: "<Option> children ignored",
        to: "<Option> children build the collection",
        note: "v0 destructured them into `_children` and never rendered them, which is why Table's page-size dropdown was always empty.",
      },
    ],
    samples: {
      react: `<Select
  label="Country"
  items={[{ value: "ng", label: "Nigeria" }]}
  onValueChange={d => setCountry(d.value)}
/>

{/* or declaratively */}
<Select label="Country">
  <Option value="ng">Nigeria</Option>
</Select>`,
      vue: `<Select label="Country" :items="items" @update:value="v => (country = v)" />

<!-- or declaratively -->
<Select label="Country">
  <Option value="ng">Nigeria</Option>
</Select>`,
      svelte: `<Select label="Country" {items} bind:value={country} />

<!-- Svelte snippets cannot be read as text, so Option takes a label prop -->
<Select label="Country">
  <Option value="ng" label="Nigeria" />
</Select>`,
      angular: `<ck-select label="Country" [items]="items" [(value)]="country" />

<!-- or declaratively -->
<ck-select label="Country">
  <ck-option value="ng" label="Nigeria" />
</ck-select>`,
    },
  },
];

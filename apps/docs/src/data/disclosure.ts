import type { ComponentDoc } from "./types";

export const disclosure: ComponentDoc[] = [
  {
    slug: "tabs",
    name: "Tabs",
    group: "Disclosure",
    scope: "tabs",
    machine: "@zag-js/tabs",
    gains: [
      "Arrow-key navigation, Home and End",
      "Roving tabindex",
      "Automatic or manual activation",
      "aria-controls / aria-labelledby that actually resolve",
    ],
    summary:
      "Value-keyed rather than index-keyed. `TabItem.id` is required now: v0 had it optional with a positional fallback while emitting `aria-labelledby={`tab-${index}`}` against triggers that carried no id, so the association never resolved.",
    props: [
      { name: "items", type: "TabItem[]", description: "Each needs an id, a label and content." },
      { name: "value", type: "string", description: "Selected tab id. v0 keyed by index." },
      { name: "defaultValue", type: "string", description: "Defaults to the first item." },
      { name: "onValueChange", type: "(d: { value }) => void", description: "Selection callback." },
      {
        name: "variant",
        type: '"line" | "enclosed" | "soft-rounded" | "solid-rounded"',
        default: '"line"',
        description: "Visual style, as data-ck-variant on the root.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout axis; also switches which arrow keys navigate.",
      },
      {
        name: "activationMode",
        type: '"automatic" | "manual"',
        default: '"automatic"',
        description: "Activate on focus, or require Enter/Space.",
      },
    ],
    changes: [
      { from: "defaultActiveTab: number", to: "value / defaultValue (a tab id)" },
      { from: "onTabChange(index)", to: "onValueChange({ value })" },
      { from: "TabItem.id?", to: "TabItem.id — required" },
    ],
    samples: {
      react: `<Tabs
  variant="enclosed"
  items={[
    { id: "overview", label: "Overview", content: <Overview /> },
    { id: "settings", label: "Settings", content: <Settings /> },
  ]}
/>`,
      vue: `<Tabs :items="items" variant="enclosed">
  <template #overview>…</template>
  <template #settings>…</template>
</Tabs>`,
      svelte: `<Tabs {items} variant="enclosed">
  {#snippet overview()}…{/snippet}
</Tabs>`,
      angular: `<ck-tabs [items]="items" variant="enclosed">
  <ng-template ckPanel="overview">…</ng-template>
  <ng-template ckPanel="settings">…</ng-template>
</ck-tabs>`,
    },
  },
  {
    slug: "accordion",
    name: "Accordion",
    group: "Disclosure",
    scope: "accordion",
    machine: "@zag-js/accordion",
    gains: ["Arrow-key navigation, Home and End", "Correct aria-expanded and region wiring"],
    summary:
      "The chevron rotates off the machine's own `data-state` — nothing in JavaScript toggles a class.",
    props: [
      { name: "items", type: "AccordionItem[]", description: "Each needs an id, title, content." },
      { name: "value", type: "string[]", description: "Open item ids." },
      { name: "defaultValue", type: "string[]", description: "Initially open ids." },
      {
        name: "allowMultiple",
        type: "boolean",
        default: "false",
        description: "Several open at once. v0 called this `multiple`.",
      },
      {
        name: "collapsible",
        type: "boolean",
        default: "true",
        description: "Allow closing the last open item.",
      },
    ],
    changes: [{ from: "multiple", to: "allowMultiple" }],
    samples: {
      react: `<Accordion
  allowMultiple
  items={[{ id: "a", title: "Shipping", content: <p>…</p> }]}
/>`,
      vue: `<Accordion :items="items" allow-multiple>
  <template #a>…</template>
</Accordion>`,
      svelte: `<Accordion {items} allowMultiple>
  {#snippet a()}…{/snippet}
</Accordion>`,
      angular: `<ck-accordion [items]="items" allowMultiple>
  <ng-template ckPanel="a">…</ng-template>
</ck-accordion>`,
    },
  },
];

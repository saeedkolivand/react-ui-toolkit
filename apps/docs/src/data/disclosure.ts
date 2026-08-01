import type { ComponentDoc } from "./types";

export const disclosure: ComponentDoc[] = [
  {
    slug: "tabs",
    name: "Tabs",
    group: "Disclosure",
    scope: "tabs",
    gains: [
      "Arrow-key navigation, Home and End",
      "Roving tabindex",
      "Automatic or manual activation",
      "aria-controls / aria-labelledby that actually resolve",
    ],
    summary:
      "Value-keyed rather than index-keyed. `TabItem.id` is required now: v0 had it optional with a positional fallback while emitting `aria-labelledby={`tab-${index}`}` against triggers that carried no id, so the association never resolved.",
    props: [
      {
        name: "activeKey, defaultActiveKey",
        reactFirst: true,
        type: "string",
        description: "The selected tab's key. Replaces `value` / `defaultValue`.",
      },
      {
        name: "onChange",
        reactFirst: true,
        type: "(key: string) => void",
        description: "The key itself rather than a detail object.",
      },
      {
        name: "type",
        reactFirst: true,
        type: '"line" | "card"',
        default: '"line"',
        description: "Replaces `variant`. Emits `data-type`, so v2 carries its own rules.",
      },
      {
        name: "tabPosition",
        reactFirst: true,
        type: '"top" | "bottom" | "left" | "right"',
        default: '"top"',
        description:
          "Replaces `orientation`, and derives it — the arrow keys follow the axis the list is actually laid out on, so the two cannot disagree.",
      },
      {
        name: "items",
        type: "TabItem[]",
        description:
          "The tabs. v1 items are `{ id, label, content }`; React's v2 items are `{ key, label, children }`, keyed the way the rest of the v2 API is.",
      },
      {
        name: "value",
        reactRemoved: true,
        type: "string",
        description: "Selected tab id. v0 keyed by index.",
      },
      {
        name: "defaultValue",
        reactRemoved: true,
        type: "string",
        description: "Defaults to the first item.",
      },
      {
        name: "onValueChange",
        reactRemoved: true,
        type: "(d: { value }) => void",
        description: "Selection callback.",
      },
      {
        name: "variant",
        reactRemoved: true,
        type: '"line" | "enclosed" | "soft-rounded" | "solid-rounded"',
        default: '"line"',
        description: "Visual style, as data-ck-variant on the root.",
      },
      {
        name: "orientation",
        reactRemoved: true,
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
  type="card"
  defaultActiveKey="overview"
  onChange={key => setTab(key)}
  items={[
    { key: "overview", label: "Overview", children: <Overview /> },
    { key: "settings", label: "Settings", children: <Settings /> },
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
    name: "Accordion / Collapse",
    group: "Disclosure",
    scope: "accordion",
    gains: ["Arrow-key navigation, Home and End", "Correct aria-expanded and region wiring"],
    summary:
      "The chevron rotates off the machine's own `data-state` — nothing in JavaScript toggles a class.",
    props: [
      {
        name: "activeKey, defaultActiveKey",
        reactFirst: true,
        type: "string | string[]",
        description: "Open panel keys. A bare string is accepted for the single-panel case.",
      },
      {
        name: "onChange",
        reactFirst: true,
        type: "(key: string[]) => void",
        description: "Always the full open set, even in `accordion` mode where it holds one.",
      },
      {
        name: "accordion",
        reactFirst: true,
        type: "boolean",
        default: "false",
        description:
          "One panel at a time. The inverse of v1's `allowMultiple`: several open is now the default, and this opts out.",
      },
      {
        name: "items",
        type: "AccordionItem[] | CollapseItem[]",
        description:
          "The panels. v1 items are `{ id, title, content }`; React's v2 items are `{ key, label, children }`.",
      },
      { name: "value", reactRemoved: true, type: "string[]", description: "Open item ids." },
      {
        name: "defaultValue",
        reactRemoved: true,
        type: "string[]",
        description: "Initially open ids.",
      },
      {
        name: "allowMultiple",
        reactRemoved: true,
        type: "boolean",
        default: "false",
        description: "Several open at once. v0 called this `multiple`.",
      },
      {
        name: "collapsible",
        reactRemoved: true,
        type: "boolean",
        default: "true",
        description: "Allow closing the last open item.",
      },
    ],
    changes: [{ from: "multiple", to: "allowMultiple" }],
    samples: {
      react: `<Collapse
  defaultActiveKey={["a"]}
  items={[{ key: "a", label: "Shipping", children: <p>…</p> }]}
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

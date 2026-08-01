import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapse, Tabs } from "@crosskit-ui/react";

const meta = {
  title: "Components/Disclosure",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const TABS = [
  { key: "overview", label: "Overview", children: "Arrow keys, Home and End all work." },
  { key: "settings", label: "Settings", children: "Roving tabindex, driven from core." },
  { key: "billing", label: "Billing", children: "aria-controls resolves to a real panel." },
  { key: "archived", label: "Archived", children: "Never shown.", disabled: true },
];

export const TabTypes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40 }}>
      {(["line", "card"] as const).map(type => (
        <div key={type}>
          <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>{type}</p>
          <Tabs items={TABS} type={type} />
        </div>
      ))}
    </div>
  ),
};

// `tabPosition` drives the orientation, so the arrow keys follow the axis the
// list is actually laid out on rather than a separate prop that could disagree
// with it.
export const TabPositions: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40 }}>
      {(["top", "bottom", "left", "right"] as const).map(position => (
        <div key={position}>
          <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>{position}</p>
          <Tabs items={TABS} tabPosition={position} />
        </div>
      ))}
    </div>
  ),
};

// Activation follows focus by default; "manual" waits for a press, which is what
// a panel that loads something wants.
export const ManualActivation: Story = {
  render: () => <Tabs items={TABS} activationMode="manual" />,
};

const ITEMS = [
  { key: "shipping", label: "Shipping", children: "Ships within two business days." },
  { key: "returns", label: "Returns", children: "Thirty days, no questions asked." },
  { key: "warranty", label: "Warranty", children: "Two years, parts and labour." },
];

export const Collapses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <div>
        {/* Several open at once is the default now, and `accordion` is what opts
            into one-at-a-time — the inverse of v1's `allowMultiple`. */}
        <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>default</p>
        <Collapse items={ITEMS} defaultActiveKey={["shipping", "returns"]} />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>accordion</p>
        <Collapse items={ITEMS} accordion defaultActiveKey="shipping" />
      </div>
    </div>
  ),
};

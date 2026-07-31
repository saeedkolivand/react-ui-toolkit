import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, Tabs } from "@crosskit-ui/react";

const meta = {
  title: "Components/Disclosure",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const TABS = [
  { id: "overview", label: "Overview", content: "Arrow keys, Home and End all work." },
  { id: "settings", label: "Settings", content: "Roving tabindex comes from the machine." },
  { id: "billing", label: "Billing", content: "aria-controls resolves to a real panel." },
  { id: "archived", label: "Archived", content: "Never shown.", disabled: true },
];

export const TabVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40 }}>
      {(["line", "enclosed", "soft-rounded", "solid-rounded"] as const).map(variant => (
        <div key={variant}>
          <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>{variant}</p>
          <Tabs items={TABS} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const VerticalTabs: Story = {
  render: () => <Tabs items={TABS} orientation="vertical" />,
};

// Activation follows focus by default; "manual" waits for Enter or Space.
export const ManualActivation: Story = {
  render: () => <Tabs items={TABS} activationMode="manual" />,
};

const ITEMS = [
  { id: "shipping", title: "Shipping", content: "Ships within two business days." },
  { id: "returns", title: "Returns", content: "Thirty days, no questions asked." },
  { id: "warranty", title: "Warranty", content: "Two years, parts and labour." },
];

export const Accordions: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>single</p>
        <Accordion items={ITEMS} defaultValue={["shipping"]} />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>allowMultiple</p>
        <Accordion items={ITEMS} allowMultiple defaultValue={["shipping", "returns"]} />
      </div>
      <div>
        {/* collapsible=false keeps at least one panel open. */}
        <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.6 }}>collapsible=false</p>
        <Accordion items={ITEMS} collapsible={false} defaultValue={["shipping"]} />
      </div>
    </div>
  ),
};

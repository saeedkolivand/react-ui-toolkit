import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapse } from "@crosskit-ui/react";

const meta = {
  title: "Components/Collapse",
  component: Collapse,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj;

const ITEMS = [
  { key: "shipping", label: "Shipping", children: "Ships within two business days." },
  { key: "returns", label: "Returns", children: "Thirty days, no questions asked." },
  { key: "warranty", label: "Warranty", children: "Two years, parts and labour." },
];

export const Basics: Story = {
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

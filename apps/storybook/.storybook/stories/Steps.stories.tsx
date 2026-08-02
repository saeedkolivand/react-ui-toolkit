import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Steps } from "@crosskit-ui/react";

const meta = {
  title: "Components/Steps",
  component: Steps,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj;

const CHECKOUT = [
  { title: "Cart", description: "Three items" },
  { title: "Delivery", description: "Pick an address" },
  { title: "Payment", description: "Card or transfer" },
  { title: "Done" },
];

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40 }}>
      <Steps items={CHECKOUT} current={1} initial={1} />
      {/* One failed step, not a failed list — the group status names the
          current step and the others still derive from their position. */}
      <Steps items={CHECKOUT} current={2} initial={1} status="error" />
      <Steps items={CHECKOUT} current={3} initial={1} status="finish" />
      <Steps items={CHECKOUT} current={1} size="small" initial={1} />
      <Steps items={CHECKOUT} current={1} labelPlacement="vertical" initial={1} />
      <Steps items={CHECKOUT} current={1} progressDot initial={1} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40, maxInlineSize: 360 }}>
      <Steps direction="vertical" items={CHECKOUT} current={1} initial={1} />
      <Steps direction="vertical" items={CHECKOUT} current={2} progressDot initial={1} />
    </div>
  ),
};

export const Clickable: Story = {
  render: function Render() {
    const [current, setCurrent] = useState(1);
    // Only with `onChange` do the steps become buttons — without it they are
    // inert markup rather than four extra tab stops.
    return <Steps items={CHECKOUT} current={current} onChange={setCurrent} initial={1} />;
  },
};

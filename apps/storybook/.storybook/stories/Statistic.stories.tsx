import type { Meta, StoryObj } from "@storybook/react-vite";
import { Statistic } from "@crosskit-ui/react";

const meta = {
  title: "Components/Statistic",
  component: Statistic,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
      <Statistic title="Revenue" value={1234567.5} precision={2} prefix="$" />
      <Statistic title="Active users" value={98211} />
      <Statistic title="Conversion" value={12.3456} precision={1} suffix="%" />
      <Statistic title="Uptime" value="99.99%" />
      <Statistic title="Loading" value={0} loading />
    </div>
  ),
};

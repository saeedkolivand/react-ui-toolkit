import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, Rate } from "@crosskit-ui/react";

const meta = {
  title: "Components/Rate",
  component: Rate,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Rate>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: function Render() {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <Rate value={value} onChange={setValue} />
        <Rate defaultValue={2.5} allowHalf />
        <Rate count={10} defaultValue={7} />
        <Rate defaultValue={3} tooltips={["Awful", "Poor", "Fair", "Good", "Great"]} />
        <Rate defaultValue={2} character={<Icon name="heart" />} />
        <Rate defaultValue={3} disabled />
      </div>
    );
  },
};

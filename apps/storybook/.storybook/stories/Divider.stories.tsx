import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "@crosskit-ui/react";

const meta = {
  title: "Components/Divider",
  component: Divider,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ maxWidth: 460 }}>
      <Divider />
      <Divider>with a label</Divider>
      <Divider dashed>dashed</Divider>
      <div style={{ display: "flex", alignItems: "center", height: 40 }}>
        left
        <Divider orientation="vertical" />
        right
      </div>
    </div>
  ),
};

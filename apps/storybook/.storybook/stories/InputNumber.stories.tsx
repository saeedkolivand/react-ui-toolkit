import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputNumber } from "@crosskit-ui/react";

const meta = {
  title: "Components/InputNumber",
  component: InputNumber,
  parameters: { layout: "padded" },
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      {(["small", "middle", "large"] as const).map(size => (
        <InputNumber key={size} size={size} defaultValue={5} />
      ))}
      <InputNumber defaultValue={1.5} step={0.5} min={0} max={10} />
      <InputNumber defaultValue={1000} prefix="$" suffix="/mo" />
      <InputNumber defaultValue={5} status="error" />
      <InputNumber defaultValue={5} controls={false} />
      <InputNumber defaultValue={5} disabled />
      {/* Empty is `null`, which is a different answer from zero. */}
      <InputNumber />
    </div>
  ),
};

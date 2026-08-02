import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "@crosskit-ui/react";

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20, maxWidth: 420 }}>
      <Progress value={62} label="Uploading" showValue />
      {/* Indeterminate is value={null}, which is what ARIA actually models. */}
      <Progress value={null} label="Working" />
      {(["success", "error", "warning", "info"] as const).map(variant => (
        <Progress key={variant} value={45} variant={variant} />
      ))}
      <Progress value={70} striped animated />
    </div>
  ),
};

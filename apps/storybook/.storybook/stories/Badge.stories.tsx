import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@crosskit-ui/react";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(["primary", "secondary", "success", "warning", "error"] as const).map(v => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(["primary", "secondary", "success", "warning", "error"] as const).map(v => (
          <Badge key={v} variant={v} outlined rounded>
            {v}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

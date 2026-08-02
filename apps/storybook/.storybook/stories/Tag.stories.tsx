import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "@crosskit-ui/react";

const meta = {
  title: "Components/Tag",
  component: Tag,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" } as const;

const COLORS = ["default", "primary", "success", "warning", "error", "info"] as const;

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      {(["default", "outline", "solid"] as const).map(variant => (
        <div key={variant} style={row}>
          {COLORS.map(color => (
            <Tag key={color} variant={variant} color={color}>
              {color}
            </Tag>
          ))}
        </div>
      ))}
      <div style={row}>
        {/* The close button appears only when `closable` is set. */}
        <Tag color="primary" closable onClose={() => {}}>
          closable
        </Tag>
        <Tag color="error" variant="solid" closable onClose={() => {}}>
          closable
        </Tag>
      </div>
    </div>
  ),
};

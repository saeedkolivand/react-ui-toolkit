import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip } from "@crosskit-ui/react";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Placements: Story = {
  render: () => (
    <div style={{ ...row, gap: 32, padding: 48 }}>
      {(["top", "right", "bottom", "left"] as const).map(placement => (
        <Tooltip key={placement} title={`Placed ${placement}`} placement={placement}>
          <Button type="default">{placement}</Button>
        </Tooltip>
      ))}
      {/* The corner names resolve to the same twelve placements. */}
      <Tooltip title="Corner name: bottomRight" placement="bottomRight">
        <Button type="text">bottomRight</Button>
      </Tooltip>
    </div>
  ),
};

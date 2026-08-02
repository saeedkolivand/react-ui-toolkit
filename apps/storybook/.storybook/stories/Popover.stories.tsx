import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Popover } from "@crosskit-ui/react";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Triggers: Story = {
  render: () => (
    <div style={{ ...row, gap: 32, padding: 48 }}>
      <Popover
        title="Delete this record?"
        content={
          <div style={{ ...row, gap: 8, marginBlockStart: 8 }}>
            <Button type="primary" size="small">
              Yes
            </Button>
            <Button size="small">No</Button>
          </div>
        }
        trigger="click"
      >
        <Button type="default">Click me</Button>
      </Popover>
      {/* Unlike a tooltip, the body is reachable — which is why it is a dialog. */}
      <Popover content="Hover, then move the pointer onto this popup." placement="bottomLeft">
        <Button type="text">Hover me</Button>
      </Popover>
    </div>
  ),
};

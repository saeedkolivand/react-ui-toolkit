import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@crosskit-ui/react";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj;

const grid = { display: "grid", gap: 20, maxWidth: 420 } as const;
const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" } as const;

export const States: Story = {
  render: () => (
    <div style={grid}>
      <div style={row}>
        <Switch label="Off" />
        <Switch label="On" defaultChecked />
        <Switch label="Disabled" disabled />
      </div>
    </div>
  ),
};

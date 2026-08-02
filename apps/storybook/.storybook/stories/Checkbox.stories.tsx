import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@crosskit-ui/react";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj;

const grid = { display: "grid", gap: 20, maxWidth: 420 } as const;
const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" } as const;

export const States: Story = {
  render: () => (
    <div style={grid}>
      <div style={row}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Invalid" invalid />
        <Checkbox label="Disabled" disabled />
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@crosskit-ui/react";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj;

const grid = { display: "grid", gap: 20, maxWidth: 420 } as const;

export const Basics: Story = {
  render: () => (
    <div style={grid}>
      <Input label="Email" type="email" placeholder="ada@example.com" helperText="Never shared." />
      <Input label="Filled" variant="filled" placeholder="Filled variant" />
      <Input label="Outline" variant="outline" placeholder="Outline variant" />
      <Input label="Invalid" invalid errorMessage="This field is required" />
      <Input label="Disabled" disabled placeholder="Cannot type here" />
      <Input label="With affixes" prefix="https://" suffix=".dev" placeholder="crosskit" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={grid}>
      {(["sm", "md", "lg"] as const).map(size => (
        <Input key={size} size={size} label={size} placeholder={`size="${size}"`} />
      ))}
    </div>
  ),
};

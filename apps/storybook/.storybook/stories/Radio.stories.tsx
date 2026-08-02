import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup } from "@crosskit-ui/react";

const meta = {
  title: "Components/Radio",
  component: Radio,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj;

const grid = { display: "grid", gap: 20, maxWidth: 420 } as const;

export const Basics: Story = {
  render: () => (
    <div style={grid}>
      {/* `name` belongs on each radio: sharing it is what makes native radios
          mutually exclusive, and a group cannot inject props into children. */}
      <RadioGroup label="Size">
        {(["sm", "md", "lg"] as const).map(size => (
          <Radio key={size} name="sb-size" value={size} label={size} />
        ))}
      </RadioGroup>
      <RadioGroup label="Vertical" orientation="vertical">
        <Radio name="sb-plan" value="free" label="Free" />
        <Radio name="sb-plan" value="pro" label="Pro" />
      </RadioGroup>
    </div>
  ),
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@crosskit-ui/react";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj;

const grid = { display: "grid", gap: 20, maxWidth: 420 } as const;

const COUNTRIES = [
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "ke", label: "Kenya" },
  { value: "za", label: "South Africa", disabled: true },
];

export const Basics: Story = {
  render: function SelectStory() {
    const [value, setValue] = useState("ng");
    return (
      <div style={grid}>
        <Select
          label="Country"
          options={COUNTRIES}
          value={value}
          onChange={next => setValue(next)}
          helperText={`Selected: ${value || "nothing"}`}
        />
        {(["small", "middle", "large"] as const).map(size => (
          <Select key={size} label={size} size={size} options={COUNTRIES} defaultValue="gh" />
        ))}
        <Select label="Invalid" options={COUNTRIES} status="error" errorMessage="Pick one" />
        <Select label="Disabled" options={COUNTRIES} disabled />
      </div>
    );
  },
};

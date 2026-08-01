import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Input, Radio, RadioGroup, Select, Switch, Textarea } from "@crosskit-ui/react";

const meta = {
  title: "Components/Forms",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const grid = { display: "grid", gap: 20, maxWidth: 420 } as const;
const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" } as const;

export const Inputs: Story = {
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

export const Textareas: Story = {
  render: () => (
    <div style={grid}>
      <Textarea label="Notes" placeholder="Tell us more" rows={3} />
      {/* Auto-resize is CSS, not a keystroke handler — so it also grows on
          paste, on a programmatic set, and for an initial value. */}
      <Textarea label="Auto-resizing" autoResize placeholder="Type several lines…" />
      <Textarea label="Invalid" invalid errorMessage="Too short" rows={2} />
    </div>
  ),
};

export const Toggles: Story = {
  render: () => (
    <div style={grid}>
      <div style={row}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Invalid" invalid />
        <Checkbox label="Disabled" disabled />
      </div>
      <div style={row}>
        <Switch label="Off" />
        <Switch label="On" defaultChecked />
        <Switch label="Disabled" disabled />
      </div>
    </div>
  ),
};

export const Radios: Story = {
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

const COUNTRIES = [
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "ke", label: "Kenya" },
  { value: "za", label: "South Africa", disabled: true },
];

export const Selects: Story = {
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

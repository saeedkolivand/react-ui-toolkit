import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@crosskit-ui/react";

const meta = {
  title: "Components/Slider",
  component: Slider,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj;

const MARKS = [
  { value: 0, label: "0" },
  { value: 25 },
  { value: 50, label: "50" },
  { value: 75 },
  { value: 100, label: "100" },
];

export const Basics: Story = {
  render: function Render() {
    const [value, setValue] = useState(40);
    return (
      <div style={{ display: "grid", gap: 48, maxInlineSize: 420 }}>
        <Slider value={value} onChange={setValue} tooltip />
        <Slider defaultValue={50} step={25} marks={MARKS} />
        <Slider defaultValue={30} disabled />
        {/* Both directions, because the centring is logical and a mirror that
            works one way can be missing the other. */}
        <div dir="rtl">
          <Slider defaultValue={25} marks={MARKS} />
        </div>
        <div style={{ display: "flex", gap: 48 }}>
          <Slider vertical defaultValue={60} marks={MARKS} />
          <div dir="rtl">
            <Slider vertical defaultValue={60} marks={MARKS} />
          </div>
        </div>
      </div>
    );
  },
};

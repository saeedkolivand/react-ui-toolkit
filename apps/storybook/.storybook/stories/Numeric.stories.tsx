import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, InputNumber, Rate, Slider } from "@crosskit-ui/react";

const meta = {
  title: "Components/Numeric",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const MARKS = [
  { value: 0, label: "0" },
  { value: 25 },
  { value: 50, label: "50" },
  { value: 75 },
  { value: 100, label: "100" },
];

export const Sliders: Story = {
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

export const Numbers: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      {(["small", "middle", "large"] as const).map(size => (
        <InputNumber key={size} size={size} defaultValue={5} />
      ))}
      <InputNumber defaultValue={1.5} step={0.5} min={0} max={10} />
      <InputNumber defaultValue={1000} prefix="$" suffix="/mo" />
      <InputNumber defaultValue={5} status="error" />
      <InputNumber defaultValue={5} controls={false} />
      <InputNumber defaultValue={5} disabled />
      {/* Empty is `null`, which is a different answer from zero. */}
      <InputNumber />
    </div>
  ),
};

export const Rates: Story = {
  render: function Render() {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <Rate value={value} onChange={setValue} />
        <Rate defaultValue={2.5} allowHalf />
        <Rate count={10} defaultValue={7} />
        <Rate defaultValue={3} tooltips={["Awful", "Poor", "Fair", "Good", "Great"]} />
        <Rate defaultValue={2} character={<Icon name="heart" />} />
        <Rate defaultValue={3} disabled />
      </div>
    );
  },
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, Segmented } from "@crosskit-ui/react";

const meta = {
  title: "Components/Segmented",
  component: Segmented,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20, justifyItems: "start" }}>
      <Segmented options={["Daily", "Weekly", "Monthly"]} />
      {(["small", "middle", "large"] as const).map(size => (
        <Segmented key={size} size={size} options={["Day", "Week", "Month"]} />
      ))}
      <Segmented
        options={[
          { label: "List", value: "list", icon: <Icon name="list" size="sm" /> },
          { label: "Grid", value: "grid", icon: <Icon name="grid" size="sm" /> },
        ]}
      />
      <Segmented options={["A", { label: "B (disabled)", value: "b", disabled: true }, "C"]} />
      <Segmented options={["A", "B", "C"]} disabled />
      <Segmented vertical options={["Top", "Middle", "Bottom"]} />
      {/* `block` has to win the inline axis against the size keywords, which
          set their own padding — equal shares, filling the container. */}
      <div style={{ inlineSize: 480 }}>
        <Segmented block options={["Daily", "Weekly", "Monthly"]} />
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState("Weekly");
    return (
      <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
        <Segmented options={["Daily", "Weekly", "Monthly"]} value={value} onChange={setValue} />
        <code>{value}</code>
      </div>
    );
  },
};

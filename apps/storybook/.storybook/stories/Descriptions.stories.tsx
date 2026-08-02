import type { Meta, StoryObj } from "@storybook/react-vite";
import { Descriptions } from "@crosskit-ui/react";

const meta = {
  title: "Components/Descriptions",
  component: Descriptions,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Descriptions>;

export default meta;
type Story = StoryObj;

export const Layouts: Story = {
  render: () => {
    const items = [
      { label: "Name", children: "Ada Lovelace" },
      { label: "Role", children: "Engineer" },
      { label: "Team", children: "Core" },
      { label: "Bio", children: "Spans the whole row.", span: 3 },
    ];
    return (
      <div style={{ display: "grid", gap: 32 }}>
        <Descriptions title="Profile" items={items} />
        {/* Vertical stacks each value under its own label — the pair wrapper is
            a real box here and `display: contents` in the layout above. */}
        <Descriptions title="Vertical" layout="vertical" items={items} />
        <Descriptions title="Bordered" bordered items={items} />
        <Descriptions title="Two columns" column={2} size="small" items={items} />
      </div>
    );
  },
};

import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Divider, Space } from "@crosskit-ui/react";

const meta = {
  title: "Components/Space",
  component: Space,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj;

const Cell = ({ children }: { children: ReactNode }) => <Card variant="default">{children}</Card>;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 24 }}>
      <Space>
        <Button type="primary">Save</Button>
        <Button>Cancel</Button>
      </Space>

      {/* A split is the thing `gap` alone cannot do — it needs something
       *between* the items, which is why each child gets a wrapper. */}
      <Space split={<Divider orientation="vertical" />}>
        <a href="#a">Edit</a>
        <a href="#b">Duplicate</a>
        <a href="#c">Delete</a>
      </Space>

      <Space size="large" wrap>
        {Array.from({ length: 8 }, (_, n) => (
          <Cell key={n}>item {n + 1}</Cell>
        ))}
      </Space>

      {/* A horizontal Space centres by default: children of unequal height
          otherwise sit on different lines and read as broken. */}
      <Space>
        <Button size="small">small</Button>
        <Button size="large">large</Button>
        <span>plain text</span>
      </Space>

      <Space direction="vertical" size={[0, 12]}>
        <Cell>first</Cell>
        <Cell>second</Cell>
      </Space>
    </div>
  ),
};

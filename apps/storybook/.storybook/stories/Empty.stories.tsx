import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Empty } from "@crosskit-ui/react";

const meta = {
  title: "Components/Empty",
  component: Empty,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxInlineSize: 520 }}>
      <Card variant="default">
        <Empty />
      </Card>
      <Card variant="default">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No invoices yet" />
      </Card>
      <Card variant="default">
        <Empty description="Nothing here — add the first one.">
          <Button type="primary">New invoice</Button>
        </Empty>
      </Card>
      {/* `null` removes the description entirely; `undefined` would take the
          locale string instead. */}
      <Card variant="default">
        <Empty description={null} />
      </Card>
    </div>
  ),
};

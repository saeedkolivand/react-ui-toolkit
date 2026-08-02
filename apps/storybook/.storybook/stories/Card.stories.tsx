import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@crosskit-ui/react";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}>
      <Card header={<strong>Default</strong>} footer={<small>Footer</small>}>
        A bordered card with header and footer.
      </Card>
      <Card variant="success" elevated hoverable>
        Elevated and hoverable.
      </Card>
    </div>
  ),
};

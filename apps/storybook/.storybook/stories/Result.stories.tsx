import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Result, Space } from "@crosskit-ui/react";

const meta = {
  title: "Components/Result",
  component: Result,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Result>;

export default meta;
type Story = StoryObj;

export const Statuses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxInlineSize: 520 }}>
      {(["success", "error", "info", "warning", "404", "403", "500"] as const).map(status => (
        <Card key={status} variant="default">
          <Result
            status={status}
            title={`Status ${status}`}
            subTitle="A sentence of detail under the title."
            extra={
              <Space>
                <Button type="primary">Primary</Button>
                <Button>Secondary</Button>
              </Space>
            }
          />
        </Card>
      ))}
    </div>
  ),
};

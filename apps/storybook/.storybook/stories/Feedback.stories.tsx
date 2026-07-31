import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Card, Divider, Spinner } from "@crosskit-ui/react";

const meta = {
  title: "Components/Feedback",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Badges: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(["primary", "secondary", "success", "warning", "error"] as const).map(v => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(["primary", "secondary", "success", "warning", "error"] as const).map(v => (
          <Badge key={v} variant={v} outlined rounded>
            {v}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

export const Spinners: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      {(["sm", "md", "lg"] as const).map(s => (
        <Spinner key={s} size={s} />
      ))}
      <Spinner variant="success" />
      <Spinner variant="error" />
    </div>
  ),
};

export const Cards: Story = {
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

export const Dividers: Story = {
  render: () => (
    <div style={{ maxWidth: 460 }}>
      <Divider />
      <Divider>with a label</Divider>
      <Divider dashed>dashed</Divider>
      <div style={{ display: "flex", alignItems: "center", height: 40 }}>
        left
        <Divider orientation="vertical" />
        right
      </div>
    </div>
  ),
};

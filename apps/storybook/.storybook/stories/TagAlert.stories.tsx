import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, Tag } from "@crosskit-ui/react";

const meta = {
  title: "Components/Tag & Alert",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" } as const;

const COLORS = ["default", "primary", "success", "warning", "error", "info"] as const;

export const Tags: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      {(["default", "outline", "solid"] as const).map(variant => (
        <div key={variant} style={row}>
          {COLORS.map(color => (
            <Tag key={color} variant={variant} color={color}>
              {color}
            </Tag>
          ))}
        </div>
      ))}
      <div style={row}>
        {/* The close button appears only when `closable` is set. */}
        <Tag color="primary" closable onClose={() => {}}>
          closable
        </Tag>
        <Tag color="error" variant="solid" closable onClose={() => {}}>
          closable
        </Tag>
      </div>
    </div>
  ),
};

export const Alerts: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 560 }}>
      {(["info", "success", "warning", "error"] as const).map(variant => (
        <Alert key={variant} variant={variant} title={variant}>
          The quick brown fox jumps over the lazy dog.
        </Alert>
      ))}
      <Alert variant="info" showIcon={false} title="No icon">
        Icons are optional.
      </Alert>
      <Alert variant="warning" title="Dismissible" dismissible onDismiss={() => {}}>
        The close button is a Button, and its own data-part survives being composed in — which is
        what this component was built to prove.
      </Alert>
      <Alert variant="success">A body with no title at all.</Alert>
    </div>
  ),
};

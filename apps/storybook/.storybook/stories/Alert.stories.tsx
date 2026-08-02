import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "@crosskit-ui/react";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj;

export const Variants: Story = {
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

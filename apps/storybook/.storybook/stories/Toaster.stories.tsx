import type { Meta, StoryObj } from "@storybook/react-vite";
import { createToastQueue } from "@crosskit-ui/core";
import { Button, Toaster } from "@crosskit-ui/react";

const meta = {
  title: "Components/Toaster",
  component: Toaster,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

// The toaster is a module-level singleton, so there is no provider anywhere in
// this file — which is the whole point of the API.
const toaster = createToastQueue();

export const Toasts: Story = {
  render: () => (
    <div style={row}>
      <Button
        onClick={() => toaster.success({ title: "Saved", description: "All changes stored." })}
      >
        Success
      </Button>
      <Button type="primary" danger onClick={() => toaster.error({ title: "Upload failed" })}>
        Error
      </Button>
      <Button type="default" onClick={() => toaster.create({ title: "Careful", type: "warning" })}>
        Warning
      </Button>
      <Button
        type="default"
        onClick={() =>
          toaster.create({
            title: "Deleted",
            action: { label: "Undo", onClick: () => toaster.success({ title: "Restored" }) },
          })
        }
      >
        With action
      </Button>
      <Toaster toaster={toaster} />
    </div>
  ),
};

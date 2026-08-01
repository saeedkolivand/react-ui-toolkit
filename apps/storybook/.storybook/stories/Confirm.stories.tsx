import type { Meta, StoryObj } from "@storybook/react-vite";
import { createToastQueue } from "@crosskit-ui/core";
import { Button, Notification, Popconfirm, Toaster } from "@crosskit-ui/react";

const meta = {
  title: "Components/Confirm and Notification",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Popconfirms: Story = {
  render: () => (
    <div style={row}>
      <Popconfirm title="Delete this file?" onConfirm={() => {}}>
        <Button danger>Delete</Button>
      </Popconfirm>

      <Popconfirm
        title="Delete this file?"
        description="This cannot be undone."
        okText="Delete"
        cancelText="Keep"
        okDanger
        placement="bottomLeft"
      >
        <Button type="dashed">With detail</Button>
      </Popconfirm>

      {/* An async confirm holds OK busy on its own, and a rejection leaves the
          question up — dismissing it would say the action succeeded. */}
      <Popconfirm
        title="Publish now?"
        onConfirm={() => new Promise(resolve => setTimeout(resolve, 1200))}
      >
        <Button type="primary">Async confirm</Button>
      </Popconfirm>

      <Popconfirm title="Publish now?" onConfirm={() => Promise.reject(new Error("409"))}>
        <Button>Failing confirm</Button>
      </Popconfirm>

      <Popconfirm title="Sign out?" icon={false} showCancel={false} okText="Sign out">
        <Button type="text">No symbol, no cancel</Button>
      </Popconfirm>
    </div>
  ),
};

/**
 * The two surfaces over the same queue.
 *
 * A message is transient and speaks for itself; a notification is a card that
 * stays until it is read, so it is closable unless it is told not to be. They
 * carry different `data-scope` values for exactly that reason — one page, two
 * kinds of thing, styled apart.
 */
const messages = createToastQueue({ placement: "bottom-start" });
const notices = createToastQueue({ placement: "top-end" });

export const Notifications: Story = {
  render: () => (
    <div style={row}>
      <Button onClick={() => messages.success({ title: "Saved", description: "Draft 12 stored." })}>
        Message
      </Button>
      <Button
        type="primary"
        onClick={() =>
          notices.info({
            title: "Deployed",
            description: "Build 402 is live.",
            action: { label: "View", onClick: () => {} },
          })
        }
      >
        Notification
      </Button>
      <Button
        danger
        onClick={() =>
          notices.error({
            title: "Deploy failed",
            description: "Step 3 exited with code 1.",
            duration: Number.POSITIVE_INFINITY,
          })
        }
      >
        Sticky error
      </Button>
      <Button
        type="dashed"
        onClick={() => notices.warning({ title: "Quota at 90%", closable: false })}
      >
        Not closable
      </Button>

      <Toaster toaster={messages} />
      <Notification toaster={notices} />
    </div>
  ),
};

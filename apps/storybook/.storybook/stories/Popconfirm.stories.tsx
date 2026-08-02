import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Popconfirm } from "@crosskit-ui/react";

const meta = {
  title: "Components/Popconfirm",
  component: Popconfirm,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Popconfirm>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Basics: Story = {
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

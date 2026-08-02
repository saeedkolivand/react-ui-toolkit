import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Modal } from "@crosskit-ui/react";

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Basics: Story = {
  render: function ModalStory() {
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState(false);
    const [wide, setWide] = useState(false);
    return (
      <div style={row}>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Button type="primary" danger onClick={() => setAlert(true)}>
          Open alertdialog
        </Button>
        <Button type="dashed" onClick={() => setWide(true)}>
          Explicit width
        </Button>

        <Modal
          open={open}
          onOpenChange={details => setOpen(details.open)}
          onCancel={() => setOpen(false)}
          // Returning a promise holds the button busy until it settles, so a
          // second press cannot submit twice.
          onOk={async () => {
            await new Promise(resolve => setTimeout(resolve, 1200));
            setOpen(false);
          }}
          okText="Delete"
          okDanger
          title="Delete file?"
          description="This cannot be undone."
        >
          The default footer, the focus trap, the scroll lock, Escape handling and the inert
          background all come from the primitives in core — none of it is written here.
        </Modal>

        <Modal
          open={alert}
          onOpenChange={details => setAlert(details.open)}
          role="alertdialog"
          size="sm"
          title="Are you sure?"
          footer={<Button onClick={() => setAlert(false)}>Understood</Button>}
        >
          An alertdialog is not dismissible by pressing outside — only Escape, or an answer.
        </Modal>

        <Modal
          open={wide}
          onOpenChange={details => setWide(details.open)}
          onCancel={() => setWide(false)}
          // Unbounded, so it is an inline custom property the size rules read as
          // their max-width rather than a variant.
          width={800}
          title="Explicit width"
          footer={null}
        >
          `width` overrides `size`, and `footer={null}` removes the footer entirely.
        </Modal>
      </div>
    );
  },
};

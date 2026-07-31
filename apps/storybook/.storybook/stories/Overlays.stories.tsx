import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { createToaster } from "@crosskit-ui/core";
import { Button, Drawer, Menu, Modal, Toaster, Tooltip } from "@crosskit-ui/react";

const meta = {
  title: "Components/Overlays",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Modals: Story = {
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

export const Drawers: Story = {
  render: function DrawerStory() {
    const [placement, setPlacement] = useState<"left" | "right" | "top" | "bottom" | null>(null);
    return (
      <div style={row}>
        {(["left", "right", "top", "bottom"] as const).map(side => (
          <Button key={side} type="default" onClick={() => setPlacement(side)}>
            {side}
          </Button>
        ))}
        <Drawer
          open={placement !== null}
          onOpenChange={details => !details.open && setPlacement(null)}
          placement={placement ?? "right"}
          title={`Drawer — ${placement ?? ""}`}
        >
          The same machine as Modal. About fifteen lines differ.
        </Drawer>
      </div>
    );
  },
};

export const Tooltips: Story = {
  render: () => (
    <div style={{ ...row, gap: 32, padding: 48 }}>
      {(["top", "right", "bottom", "left"] as const).map(placement => (
        <Tooltip key={placement} content={`Placed ${placement}`} placement={placement}>
          <Button type="default">{placement}</Button>
        </Tooltip>
      ))}
      {/* v0's Ant placement names still work. */}
      <Tooltip content="Legacy name: bottomRight" placement="bottomRight">
        <Button type="text">bottomRight</Button>
      </Tooltip>
    </div>
  ),
};

export const Menus: Story = {
  render: function MenuStory() {
    const [chosen, setChosen] = useState("—");
    return (
      <div style={row}>
        <Menu
          trigger="Actions"
          onSelect={details => setChosen(details.value)}
          items={[
            { value: "edit", label: "Edit", icon: "edit" },
            { value: "copy", label: "Duplicate", icon: "copy" },
            { value: "archive", label: "Archive", disabled: true },
            { separator: true },
            { value: "delete", label: "Delete", icon: "trash", danger: true },
          ]}
        />
        <span>Chosen: {chosen}</span>
      </div>
    );
  },
};

// The toaster is a module-level singleton, so there is no provider anywhere in
// this file — which is the whole point of the API.
const toaster = createToaster();

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

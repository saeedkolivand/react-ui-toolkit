import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "@/components";

const meta: Meta<typeof Drawer> = {
  title: "Navigation/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls the visibility of the drawer",
    },
    onClose: {
      action: "closed",
      description: "Callback when drawer is closed",
    },
    position: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
      description: "Position of the drawer",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "Size of the drawer",
    },
    closeOnBackdropClick: {
      control: "boolean",
      description: "Whether to close drawer when clicking outside",
    },
    closeOnEsc: {
      control: "boolean",
      description: "Whether to close drawer when pressing ESC",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const DrawerContent = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Drawer Title</h2>
    <p className="mb-4">
      This is a sample drawer content. You can put any content here, including forms, images, or
      other components.
    </p>
    <div className="flex justify-end gap-4">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </div>
);

export const Left: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>
    );
  },
  args: {
    position: "left",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true,
  },
};

export const Right: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Right Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>
    );
  },
  args: {
    position: "right",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true,
  },
};

export const Top: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Top Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>
    );
  },
  args: {
    position: "top",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true,
  },
};

export const Bottom: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Bottom Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>
    );
  },
  args: {
    position: "bottom",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true,
  },
};

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Base/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "filled", "outlined"],
      description: "The visual style of the textarea",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the textarea",
    },
    label: {
      control: "text",
      description: "Label text for the textarea",
    },
    helperText: {
      control: "text",
      description: "Helper text to display below the textarea",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the textarea should take full width",
    },
    autoResize: {
      control: "boolean",
      description: "Whether the textarea should auto-resize based on content",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the textarea",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Enter your message...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Message",
    placeholder: "Enter your message...",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Message",
    placeholder: "Enter your message...",
    helperText: "Please enter your message here",
  },
};

export const WithError: Story = {
  args: {
    label: "Message",
    placeholder: "Enter your message...",
    error: "This field is required",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    placeholder: "Enter your message...",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    placeholder: "Enter your message...",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    placeholder: "Enter your message...",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    placeholder: "Enter your message...",
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    placeholder: "This textarea will resize automatically...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled textarea...",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: "Full width textarea...",
  },
  parameters: {
    layout: "padded",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Textarea placeholder="Default textarea" />
      <Textarea variant="filled" placeholder="Filled textarea" />
      <Textarea variant="outlined" placeholder="Outlined textarea" />
      <Textarea size="sm" placeholder="Small textarea" />
      <Textarea size="lg" placeholder="Large textarea" />
      <Textarea label="Message" placeholder="With label" />
      <Textarea helperText="Helper text" placeholder="With helper text" />
      <Textarea error="Error message" placeholder="With error" />
      <Textarea autoResize placeholder="Auto-resizing textarea" />
      <Textarea disabled placeholder="Disabled textarea" />
    </div>
  ),
};

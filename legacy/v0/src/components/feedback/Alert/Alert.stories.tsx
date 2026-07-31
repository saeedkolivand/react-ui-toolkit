import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "The variant of the alert",
    },
    dismissible: {
      control: "boolean",
      description: "Whether the alert is dismissible",
    },
    showIcon: {
      control: "boolean",
      description: "Whether to show an icon",
    },
    title: {
      control: "text",
      description: "The title of the alert",
    },
    onDismiss: {
      action: "dismissed",
      description: "Callback when the alert is dismissed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    children: "This is a default alert message.",
    variant: "info",
  },
};

export const WithTitle: Story = {
  args: {
    title: "Alert Title",
    children: "This is an alert with a title.",
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    title: "Success",
    children: "Operation completed successfully!",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    title: "Warning",
    children: "Please be careful with this action.",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    title: "Error",
    children: "Something went wrong. Please try again.",
    variant: "error",
  },
};

export const Dismissible: Story = {
  args: {
    title: "Dismissible Alert",
    children: "You can dismiss this alert by clicking the close button.",
    variant: "info",
    dismissible: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: "No Icon",
    children: "This alert does not show an icon.",
    variant: "info",
    showIcon: false,
  },
};

export const LongContent: Story = {
  args: {
    title: "Long Content Alert",
    children:
      "This is a longer alert message that might span multiple lines. It demonstrates how the alert component handles content that requires more vertical space. The component should maintain its visual consistency and readability even with extended content.",
    variant: "info",
  },
};

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";
import { Button } from "@/components";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the spinner",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "error"],
      description: "The variant of the spinner",
    },
    label: {
      control: "text",
      description: "The label for screen readers",
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    label: "Loading...",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Loading...",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Loading...",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    label: "Loading...",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    label: "Loading...",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    label: "Loading...",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    label: "Loading...",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    label: "Loading...",
  },
};

export const WithCustomLabel: Story = {
  args: {
    label: "Processing your request...",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" label="Small spinner" />
      <Spinner size="md" label="Medium spinner" />
      <Spinner size="lg" label="Large spinner" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner variant="primary" label="Primary spinner" />
      <Spinner variant="secondary" label="Secondary spinner" />
      <Spinner variant="success" label="Success spinner" />
      <Spinner variant="warning" label="Warning spinner" />
      <Spinner variant="error" label="Error spinner" />
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner size="sm" label="Loading" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <Button loading disabled>
      Processing...
    </Button>
  ),
};

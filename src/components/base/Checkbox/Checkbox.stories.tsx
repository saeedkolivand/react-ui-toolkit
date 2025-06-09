import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Base/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the checkbox",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the checkbox",
    },
    error: {
      control: "boolean",
      description: "Whether the checkbox is in an error state",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when error is true",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Checkbox",
  },
};

export const Checked: Story = {
  args: {
    label: "Checked",
    checked: true,
  },
};

export const Small: Story = {
  args: {
    label: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    label: "Large",
    size: "lg",
  },
};

export const Error: Story = {
  args: {
    label: "Error",
    error: true,
    errorMessage: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Disabled Checked",
    disabled: true,
    checked: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="Default" />
      <Checkbox label="Checked" checked />
      <Checkbox label="Small" size="sm" />
      <Checkbox label="Large" size="lg" />
      <Checkbox label="Error" error errorMessage="This field is required" />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled Checked" disabled checked />
    </div>
  ),
};

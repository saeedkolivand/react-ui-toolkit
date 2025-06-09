import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Base/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "The direction of the divider",
    },
    orientation: {
      control: "select",
      options: ["left", "right", "center"],
      description: "The orientation of the divider text",
    },
    dashed: {
      control: "boolean",
      description: "Whether the divider is dashed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    type: "horizontal",
  },
  render: args => (
    <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args} />
      <p className="mt-4">Text below</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    type: "vertical",
  },
  render: args => (
    <div className="flex items-center h-32 p-8 bg-white rounded-lg shadow">
      <span>Text</span>
      <Divider {...args} />
      <span>Text</span>
    </div>
  ),
};

export const WithText: Story = {
  args: {
    type: "horizontal",
    orientation: "center",
  },
  render: args => (
    <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
  ),
};

export const WithTextLeft: Story = {
  args: {
    type: "horizontal",
    orientation: "left",
  },
  render: args => (
    <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
  ),
};

export const WithTextRight: Story = {
  args: {
    type: "horizontal",
    orientation: "right",
  },
  render: args => (
    <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
  ),
};

export const Dashed: Story = {
  args: {
    type: "horizontal",
    dashed: true,
  },
  render: args => (
    <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args} />
      <p className="mt-4">Text below</p>
    </div>
  ),
};

export const DashedWithText: Story = {
  args: {
    type: "horizontal",
    dashed: true,
    orientation: "center",
  },
  render: args => (
    <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
  ),
};

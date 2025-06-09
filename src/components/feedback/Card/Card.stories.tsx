import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Feedback/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
      description: "The variant of the card",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the card padding",
    },
    hoverable: {
      control: "boolean",
      description: "Whether to add a hover effect",
    },
    elevated: {
      control: "boolean",
      description: "Whether to add a shadow effect",
    },
    bordered: {
      control: "boolean",
      description: "Whether the card has a border",
    },
    fullWidth: {
      control: "boolean",
      description: "Whether to make the card full width",
    },
    header: {
      control: "text",
      description: "The header content of the card",
    },
    footer: {
      control: "text",
      description: "The footer content of the card",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const renderHeader = (text: string) => <h3 className="font-semibold">{text}</h3>;
const renderFooter = (text: string) => <div className="text-sm text-gray-500">{text}</div>;

export const Default: Story = {
  args: {
    children: "This is a basic card with some content.",
  },
};

export const WithHeader: Story = {
  args: {
    header: renderHeader("Card Header"),
    children: "This card has a header section.",
  },
};

export const WithFooter: Story = {
  args: {
    children: "This card has a footer section.",
    footer: renderFooter("Card Footer"),
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: renderHeader("Card Header"),
    children: "This card has both header and footer sections.",
    footer: renderFooter("Card Footer"),
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    header: renderHeader("Primary Card"),
    children: "This is a primary variant card.",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    header: renderHeader("Secondary Card"),
    children: "This is a secondary variant card.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    header: renderHeader("Success Card"),
    children: "This is a success variant card.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    header: renderHeader("Warning Card"),
    children: "This is a warning variant card.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    header: renderHeader("Danger Card"),
    children: "This is a danger variant card.",
  },
};

export const Hoverable: Story = {
  args: {
    header: renderHeader("Hoverable Card"),
    children: "This card has a hover effect.",
    hoverable: true,
  },
};

export const Elevated: Story = {
  args: {
    header: renderHeader("Elevated Card"),
    children: "This card has a shadow effect.",
    elevated: true,
  },
};

export const NotBordered: Story = {
  args: {
    header: renderHeader("Borderless Card"),
    children: "This card has no border.",
    bordered: false,
  },
};

export const NotFullWidth: Story = {
  args: {
    header: renderHeader("Inline Card"),
    children: "This card is not full width.",
    fullWidth: false,
  },
};

export const Small: Story = {
  args: {
    header: renderHeader("Small Card"),
    children: "This card has small padding.",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    header: renderHeader("Large Card"),
    children: "This card has large padding.",
    size: "lg",
  },
};

export const ComplexContent: Story = {
  args: {
    header: renderHeader("Complex Card"),
    children: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-gray-600">
          This is a more complex card with multiple elements and rich content.
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Action Button
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Secondary Button
          </button>
        </div>
      </div>
    ),
    footer: (
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Last updated 2 hours ago</span>
        <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card variant="default" header={renderHeader("Default Card")}>
        Basic card with default styling
      </Card>
      <Card variant="primary" header={renderHeader("Primary Card")}>
        Card with primary variant
      </Card>
      <Card variant="secondary" header={renderHeader("Secondary Card")}>
        Card with secondary variant
      </Card>
      <Card variant="success" header={renderHeader("Success Card")}>
        Card with success variant
      </Card>
      <Card variant="warning" header={renderHeader("Warning Card")}>
        Card with warning variant
      </Card>
      <Card variant="danger" header={renderHeader("Danger Card")}>
        Card with danger variant
      </Card>
    </div>
  ),
};

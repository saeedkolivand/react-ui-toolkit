import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tabs: {
      control: "object",
      description: "Array of tab items",
    },
    defaultActiveTab: {
      control: "number",
      description: "Index of the tab to be active by default",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the tabs",
    },
    variant: {
      control: "select",
      options: ["line", "enclosed", "soft-rounded", "solid-rounded"],
      description: "Visual style of the tabs",
    },
    isFitted: {
      control: "boolean",
      description: "Whether to stretch the tabs to full width",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const defaultTabs = [
  {
    label: "Profile",
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
        <p>This is the profile tab content.</p>
      </div>
    ),
  },
  {
    label: "Settings",
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <p>This is the settings tab content.</p>
      </div>
    ),
  },
  {
    label: "Messages",
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <p>This is the messages tab content.</p>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    tabs: defaultTabs,
  },
};

export const Enclosed: Story = {
  args: {
    tabs: defaultTabs,
    variant: "enclosed",
  },
};

export const SoftRounded: Story = {
  args: {
    tabs: defaultTabs,
    variant: "soft-rounded",
  },
};

export const SolidRounded: Story = {
  args: {
    tabs: defaultTabs,
    variant: "solid-rounded",
  },
};

export const Vertical: Story = {
  args: {
    tabs: defaultTabs,
    orientation: "vertical",
  },
};

export const Fitted: Story = {
  args: {
    tabs: defaultTabs,
    isFitted: true,
  },
};

export const DefaultActive: Story = {
  args: {
    tabs: defaultTabs,
    defaultActiveTab: 1,
  },
};

export const DisabledTab: Story = {
  args: {
    tabs: [
      {
        label: "Active Tab",
        content: <div className="p-4">This tab is active</div>,
      },
      {
        label: "Disabled Tab",
        content: <div className="p-4">This tab is disabled</div>,
        disabled: true,
      },
      {
        label: "Another Tab",
        content: <div className="p-4">This is another tab</div>,
      },
    ],
  },
};

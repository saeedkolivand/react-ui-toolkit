import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, Menu } from "./Dropdown";
import { Button } from "@/components";

const meta: Meta<typeof Dropdown> = {
  title: "Navigation/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    trigger: {
      control: "select",
      options: ["hover", "click"],
      description: "How the dropdown is triggered",
    },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Where the dropdown menu appears",
    },
    disabled: {
      control: "boolean",
      description: "Whether the dropdown is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="1" onClick={() => console.log("Clicked item 1")}>
            Item 1
          </Menu.Item>
          <Menu.Item key="2" disabled>
            Disabled Item
          </Menu.Item>
          <Menu.Item key="3" danger>
            Danger Item
          </Menu.Item>
        </Menu>
      }
      trigger="click"
      placement="bottom"
    >
      <Button>Click me</Button>
    </Dropdown>
  ),
};

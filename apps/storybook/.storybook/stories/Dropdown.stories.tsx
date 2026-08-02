import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dropdown } from "@crosskit-ui/react";

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Basics: Story = {
  render: function DropdownStory() {
    const [chosen, setChosen] = useState("—");
    return (
      <div style={row}>
        <Dropdown
          menu={{
            onClick: info => setChosen(info.key),
            items: [
              { key: "edit", label: "Edit", icon: "edit" },
              { key: "copy", label: "Duplicate", icon: "copy" },
              { key: "archive", label: "Archive", disabled: true },
              { type: "divider" },
              { key: "delete", label: "Delete", icon: "trash", danger: true },
            ],
          }}
        >
          <Button type="default">Actions</Button>
        </Dropdown>
        <span>Chosen: {chosen}</span>
      </div>
    );
  },
};

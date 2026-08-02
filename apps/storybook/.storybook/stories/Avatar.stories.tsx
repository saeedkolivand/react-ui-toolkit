import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@crosskit-ui/react";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" } as const;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={row}>
        {(["sm", "md", "lg", "xl"] as const).map(size => (
          <Avatar key={size} alt="Ada Lovelace" size={size} />
        ))}
      </div>
      <div style={row}>
        {(["online", "offline", "busy", "away"] as const).map(status => (
          <Avatar key={status} alt="Grace Hopper" status={status} />
        ))}
      </div>
      <div style={row}>
        <Avatar alt="Alan Turing" squared />
        <Avatar alt="Alan Turing" bordered />
        <Avatar initials="CK" />
      </div>
    </div>
  ),
};

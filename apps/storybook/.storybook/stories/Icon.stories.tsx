import type { Meta, StoryObj } from "@storybook/react-vite";
import { ICON_NAMES } from "@crosskit-ui/core";
import { Icon } from "@crosskit-ui/react";

const meta = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    name: { control: "select", options: ICON_NAMES },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
  },
  args: { name: "heart", size: "lg" },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { parameters: { layout: "centered" } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {(["sm", "md", "lg", "xl"] as const).map(s => (
        <span key={s} style={{ display: "grid", justifyItems: "center", gap: 6 }}>
          <Icon name="settings" size={s} />
          <small style={{ color: "var(--ck-fg-muted)" }}>{s}</small>
        </span>
      ))}
    </div>
  ),
};

/** The whole set. Also the fastest way to spot a mangled path after regenerating. */
export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
        gap: 12,
      }}
    >
      {ICON_NAMES.map(name => (
        <div
          key={name}
          style={{
            display: "grid",
            justifyItems: "center",
            gap: 8,
            padding: 12,
            borderRadius: 8,
            border: "1px solid var(--ck-border)",
          }}
        >
          <Icon name={name} size="lg" />
          <small style={{ color: "var(--ck-fg-muted)", fontSize: 11, wordBreak: "break-all" }}>
            {name}
          </small>
        </div>
      ))}
    </div>
  ),
};

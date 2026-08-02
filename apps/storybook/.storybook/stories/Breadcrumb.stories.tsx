import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb, Divider } from "@crosskit-ui/react";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <Breadcrumb
        items={[
          { title: "Home", href: "#" },
          { title: "Settings", href: "#" },
          { title: "Profile" },
        ]}
      />
      {/* The last crumb is text with `aria-current="page"`, never a link. */}
      <Breadcrumb
        separator="›"
        items={[
          { title: "Workspace", href: "#" },
          { title: "Projects", href: "#" },
          { title: "crosskit", href: "#" },
          { title: "Issues" },
        ]}
      />
      <Breadcrumb
        separator={<Divider orientation="vertical" />}
        items={[{ title: "One", href: "#" }, { title: "Two", href: "#" }, { title: "Three" }]}
      />
    </div>
  ),
};

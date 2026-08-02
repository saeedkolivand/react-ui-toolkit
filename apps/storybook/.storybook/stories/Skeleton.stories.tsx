import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Skeleton } from "@crosskit-ui/react";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxInlineSize: 520 }}>
      <Card variant="default">
        <Skeleton />
      </Card>
      <Card variant="default">
        <Skeleton active avatar />
      </Card>
      <Card variant="default">
        <Skeleton active avatar round paragraph={{ rows: 2, width: ["100%", "40%"] }} />
      </Card>
    </div>
  ),
};

export const Blocks: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      {/* One row per keyword, because a size rule that restates the base values
          is a silent no-op and reads as correct in isolation. */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {(["small", "default", "large"] as const).map(size => (
          <Skeleton.Avatar key={size} size={size} active />
        ))}
        {(["small", "default", "large"] as const).map(size => (
          <Skeleton.Button key={size} size={size} shape="circle" active />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {(["small", "default", "large"] as const).map(size => (
          <Skeleton.Button key={size} size={size} active />
        ))}
        <Skeleton.Button shape="round" active />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Skeleton.Input active />
        <Skeleton.Image active />
        <Skeleton.Node active>
          <span style={{ fontSize: 12 }}>chart</span>
        </Skeleton.Node>
      </div>
      {/* `block` has to win the inline axis against the keywords above, which
          set their own width — the one place the two can disagree. */}
      <div style={{ display: "grid", gap: 8, inlineSize: 320 }}>
        <Skeleton.Button block active />
        <Skeleton.Button block size="large" active />
        <Skeleton.Input block active />
      </div>
    </div>
  ),
};

export const LoadingSwitch: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxInlineSize: 520 }}>
      <Card variant="default">
        <Skeleton loading={false}>
          <p>The real content, once it has arrived.</p>
        </Skeleton>
      </Card>
    </div>
  ),
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb, Divider, Icon, Segmented, Steps } from "@crosskit-ui/react";

const meta = {
  title: "Components/Navigation",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const CHECKOUT = [
  { title: "Cart", description: "Three items" },
  { title: "Delivery", description: "Pick an address" },
  { title: "Payment", description: "Card or transfer" },
  { title: "Done" },
];

export const Breadcrumbs: Story = {
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

export const StepsHorizontal: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40 }}>
      <Steps items={CHECKOUT} current={1} initial={1} />
      {/* One failed step, not a failed list — the group status names the
          current step and the others still derive from their position. */}
      <Steps items={CHECKOUT} current={2} initial={1} status="error" />
      <Steps items={CHECKOUT} current={3} initial={1} status="finish" />
      <Steps items={CHECKOUT} current={1} size="small" initial={1} />
      <Steps items={CHECKOUT} current={1} labelPlacement="vertical" initial={1} />
      <Steps items={CHECKOUT} current={1} progressDot initial={1} />
    </div>
  ),
};

export const StepsVertical: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40, maxInlineSize: 360 }}>
      <Steps direction="vertical" items={CHECKOUT} current={1} initial={1} />
      <Steps direction="vertical" items={CHECKOUT} current={2} progressDot initial={1} />
    </div>
  ),
};

export const StepsClickable: Story = {
  render: function Render() {
    const [current, setCurrent] = useState(1);
    // Only with `onChange` do the steps become buttons — without it they are
    // inert markup rather than four extra tab stops.
    return <Steps items={CHECKOUT} current={current} onChange={setCurrent} initial={1} />;
  },
};

export const Segments: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20, justifyItems: "start" }}>
      <Segmented options={["Daily", "Weekly", "Monthly"]} />
      {(["small", "middle", "large"] as const).map(size => (
        <Segmented key={size} size={size} options={["Day", "Week", "Month"]} />
      ))}
      <Segmented
        options={[
          { label: "List", value: "list", icon: <Icon name="list" size="sm" /> },
          { label: "Grid", value: "grid", icon: <Icon name="grid" size="sm" /> },
        ]}
      />
      <Segmented options={["A", { label: "B (disabled)", value: "b", disabled: true }, "C"]} />
      <Segmented options={["A", "B", "C"]} disabled />
      <Segmented vertical options={["Top", "Middle", "Bottom"]} />
      {/* `block` has to win the inline axis against the size keywords, which
          set their own padding — equal shares, filling the container. */}
      <div style={{ inlineSize: 480 }}>
        <Segmented block options={["Daily", "Weekly", "Monthly"]} />
      </div>
    </div>
  ),
};

export const SegmentedControlled: Story = {
  render: function Render() {
    const [value, setValue] = useState("Weekly");
    return (
      <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
        <Segmented options={["Daily", "Weekly", "Monthly"]} value={value} onChange={setValue} />
        <code>{value}</code>
      </div>
    );
  },
};

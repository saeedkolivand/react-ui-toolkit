import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@crosskit-ui/react";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "success", "error", "warning", "info"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  args: { children: "Button" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {(
        ["primary", "secondary", "outline", "ghost", "success", "error", "warning", "info"] as const
      ).map(v => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button icon="plus">Left icon</Button>
      <Button icon="chevronRight" iconPosition="right">
        Right icon
      </Button>
      <Button icon="search" variant="outline" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button>Default</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: "Full width" },
  parameters: { layout: "padded" },
};

/**
 * The override story: an unlayered consumer rule beats our layered
 * `[data-scope][data-part][data-variant]` despite lower specificity, because
 * everything we ship lives inside `@layer ck.*`.
 */
export const ConsumerOverride: Story = {
  render: () => (
    <>
      <style>{`.brand-button { background-color: rebeccapurple; border-radius: 999px }`}</style>
      <div style={{ display: "flex", gap: 12 }}>
        <Button>Ours</Button>
        <Button className="brand-button">Overridden</Button>
      </div>
    </>
  ),
};

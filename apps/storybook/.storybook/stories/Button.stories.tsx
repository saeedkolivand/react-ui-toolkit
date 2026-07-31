import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Icon } from "@crosskit-ui/react";

const TYPES = ["default", "primary", "dashed", "text", "link"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    type: { control: "select", options: TYPES },
    size: { control: "inline-radio", options: ["small", "middle", "large"] },
    shape: { control: "inline-radio", options: ["default", "circle", "round"] },
  },
  args: { children: "Button" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>{children}</div>
);

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <Row>
      {TYPES.map(type => (
        <Button key={type} type={type}>
          {type}
        </Button>
      ))}
    </Row>
  ),
};

/** `danger` is orthogonal to `type`, so a text button can be destructive too. */
export const Danger: Story = {
  render: () => (
    <Row>
      {TYPES.map(type => (
        <Button key={type} type={type} danger>
          {type}
        </Button>
      ))}
    </Row>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row>
      <Button size="small">Small</Button>
      <Button size="middle">Middle</Button>
      <Button size="large">Large</Button>
    </Row>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Row>
      <Button shape="default">Default</Button>
      <Button shape="round">Round</Button>
      <Button shape="circle" icon={<Icon name="search" />} aria-label="Search" />
    </Row>
  ),
};

/** `icon` takes a node, so any glyph composes — not only the bundled set. */
export const WithIcons: Story = {
  render: () => (
    <Row>
      <Button icon={<Icon name="plus" />}>Leading</Button>
      <Button icon={<Icon name="chevronRight" />} iconPosition="end">
        Trailing
      </Button>
      <Button icon={<Icon name="search" />} type="dashed" aria-label="Search" />
    </Row>
  ),
};

export const States: Story = {
  render: () => (
    <Row>
      <Button>Default</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </Row>
  ),
};

export const Block: Story = {
  args: { block: true, children: "Block" },
  parameters: { layout: "padded" },
};

/**
 * An `href` renders an `<a>` rather than a button that navigates by script, so
 * it works with a keyboard and with "open in new tab". Disabling it drops the
 * href rather than only styling it.
 */
export const AsLink: Story = {
  render: () => (
    <Row>
      <Button href="https://crosskit.iamsaeed.dev">Docs</Button>
      <Button href="https://crosskit.iamsaeed.dev" disabled>
        Disabled link
      </Button>
    </Row>
  ),
};

/**
 * The override story: an unlayered consumer rule beats our layered
 * `[data-scope][data-part][data-type]` despite lower specificity, because
 * everything we ship lives inside `@layer ck.*`.
 */
export const ConsumerOverride: Story = {
  render: () => (
    <>
      <style>{`.brand-button { background-color: rebeccapurple; border-radius: 999px }`}</style>
      <Row>
        <Button>Ours</Button>
        <Button className="brand-button">Overridden</Button>
      </Row>
    </>
  ),
};

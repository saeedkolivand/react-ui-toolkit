import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Flex } from "@crosskit-ui/react";

const meta = {
  title: "Components/Flex",
  component: Flex,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj;

const Cell = ({ children }: { children: ReactNode }) => <Card variant="default">{children}</Card>;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 24 }}>
      <Flex gap="middle">
        <Cell>one</Cell>
        <Cell>two</Cell>
        <Cell>three</Cell>
      </Flex>

      {/* `justify` and `align` take the whole CSS value space, so they land
          inline rather than as data-*; there is no finite set of selectors to
          compile them into. */}
      <Flex justify="space-between" align="center" gap={8}>
        <Cell>start</Cell>
        <Cell>middle</Cell>
        <Cell>end</Cell>
      </Flex>

      <Flex vertical gap="small">
        <Cell>stacked</Cell>
        <Cell>stacked</Cell>
      </Flex>

      <Flex gap="small" wrap={false} component="section">
        <Cell>no wrap</Cell>
        <Cell>no wrap</Cell>
        <Cell>no wrap</Cell>
      </Flex>
    </div>
  ),
};

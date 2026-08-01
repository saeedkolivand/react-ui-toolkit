import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Col, Container, Divider, Flex, Row, Space } from "@crosskit-ui/react";

const meta = {
  title: "Components/Layout",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const Cell = ({ children }: { children: ReactNode }) => <Card variant="default">{children}</Card>;

export const Grid: Story = {
  render: () => (
    <Container maxWidth="lg">
      <div style={{ display: "grid", gap: 24, padding: 24 }}>
        <Row spacing={4}>
          <Col span={8}>
            <Cell>span 8</Cell>
          </Col>
          <Col span={4}>
            <Cell>span 4</Cell>
          </Col>
        </Row>
        <Row spacing={4}>
          <Col span={3}>
            <Cell>span 3</Cell>
          </Col>
          <Col span={3}>
            <Cell>span 3</Cell>
          </Col>
          <Col span={3}>
            <Cell>span 3</Cell>
          </Col>
          <Col span={3}>
            <Cell>span 3</Cell>
          </Col>
        </Row>
        {/* offset works. In v0 it emitted `ml-${n}/12`, which is not valid
            Tailwind, so it and every *Offset prop were silently no-ops. */}
        <Row spacing={4}>
          <Col span={4} offset={4}>
            <Cell>span 4, offset 4</Cell>
          </Col>
        </Row>
      </div>
    </Container>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Container maxWidth="lg">
      <div style={{ padding: 24 }}>
        <Row spacing={4}>
          {[1, 2, 3].map(n => (
            <Col key={n} span={12} md={{ span: 6 }} lg={{ span: 4 }}>
              <Cell>12 / md 6 / lg 4</Cell>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Container maxWidth="lg">
      <div style={{ display: "grid", gap: 24, padding: 24 }}>
        {(["start", "center", "end", "between", "around"] as const).map(justify => (
          <Row key={justify} spacing={2} justify={justify}>
            <Col span={2}>
              <Cell>{justify}</Cell>
            </Col>
            <Col span={2}>
              <Cell>b</Cell>
            </Col>
          </Row>
        ))}
      </div>
    </Container>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 24 }}>
      <Space>
        <Button type="primary">Save</Button>
        <Button>Cancel</Button>
      </Space>

      {/* A split is the thing `gap` alone cannot do — it needs something
       *between* the items, which is why each child gets a wrapper. */}
      <Space split={<Divider orientation="vertical" />}>
        <a href="#a">Edit</a>
        <a href="#b">Duplicate</a>
        <a href="#c">Delete</a>
      </Space>

      <Space size="large" wrap>
        {Array.from({ length: 8 }, (_, n) => (
          <Cell key={n}>item {n + 1}</Cell>
        ))}
      </Space>

      {/* A horizontal Space centres by default: children of unequal height
          otherwise sit on different lines and read as broken. */}
      <Space>
        <Button size="small">small</Button>
        <Button size="large">large</Button>
        <span>plain text</span>
      </Space>

      <Space direction="vertical" size={[0, 12]}>
        <Cell>first</Cell>
        <Cell>second</Cell>
      </Space>
    </div>
  ),
};

export const Flexing: Story = {
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

import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Col, Container, Row } from "@crosskit-ui/react";

const meta = {
  title: "Components/Row",
  component: Row,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj;

const Cell = ({ children }: { children: ReactNode }) => <Card variant="default">{children}</Card>;

export const Basics: Story = {
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

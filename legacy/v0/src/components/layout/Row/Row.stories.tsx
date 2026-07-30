import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Row } from "./Row";
import { Col } from "../Col";

const meta: Meta<typeof Row> = {
  title: "Layout/Row",
  component: Row,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    justify: {
      control: "select",
      options: ["start", "end", "center", "between", "around", "evenly"],
      description: "Horizontal alignment of columns",
    },
    align: {
      control: "select",
      options: ["start", "end", "center", "baseline", "stretch"],
      description: "Vertical alignment of columns",
    },
    spacing: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      description: "Space between columns",
    },
    wrap: {
      control: "boolean",
      description: "Whether to wrap columns to multiple lines",
    },
    reverse: {
      control: "boolean",
      description: "Whether to reverse the order of columns",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Row>;

interface ContentBoxProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const ContentBox = ({ children, className = "", color = "gray" }: ContentBoxProps) => {
  const getColorClass = () => {
    switch (color) {
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "purple":
        return "bg-purple-500";
      case "orange":
        return "bg-orange-500";
      case "pink":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`p-8 rounded-lg text-white text-lg ${getColorClass()} ${className}`}>
      {children}
    </div>
  );
};

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="py-16 w-full max-w-6xl mx-auto px-8">{children}</div>
);

export const Default: Story = {
  args: {
    justify: "start",
    align: "stretch",
    spacing: 4,
    wrap: true,
    reverse: false,
  },
  render: args => (
    <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row {...args}>
          <Col span={4}>
            <ContentBox color="blue">Column 1</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="green">Column 2</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="purple">Column 3</ContentBox>
          </Col>
        </Row>
      </div>
    </Section>
  ),
};

export const JustifyExamples: Story = {
  args: {
    spacing: 4,
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify Start</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="start">
              <Col span={3}>
                <ContentBox color="blue">Start</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">Start</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify Center</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="center">
              <Col span={3}>
                <ContentBox color="blue">Center</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">Center</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify End</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="end">
              <Col span={3}>
                <ContentBox color="blue">End</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">End</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify Between</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="between">
              <Col span={3}>
                <ContentBox color="blue">Between</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">Between</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
  ),
};

export const AlignExamples: Story = {
  args: {
    spacing: 4,
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Align Start</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg h-48">
            <Row {...args} align="start">
              <Col span={4}>
                <ContentBox color="blue">Start</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green" className="h-24">
                  Start
                </ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Align Center</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg h-48">
            <Row {...args} align="center">
              <Col span={4}>
                <ContentBox color="blue">Center</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green" className="h-24">
                  Center
                </ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Align End</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg h-48">
            <Row {...args} align="end">
              <Col span={4}>
                <ContentBox color="blue">End</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green" className="h-24">
                  End
                </ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
  ),
};

export const InteractiveExample: Story = {
  args: {
    justify: "start",
    align: "stretch",
    spacing: 4,
    wrap: true,
    reverse: false,
  },
  render: args => (
    <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row {...args}>
          <Col span={4}>
            <ContentBox color="blue">Column 1</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="green">Column 2</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="purple">Column 3</ContentBox>
          </Col>
        </Row>
      </div>
    </Section>
  ),
};

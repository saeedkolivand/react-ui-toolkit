import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Col } from './Col';
import { Row } from '../Row/Row';

const meta: Meta<typeof Col> = {
  title: 'Layout/Col',
  component: Col,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    span: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto'],
      description: 'Number of columns to span',
    },
    sm: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto'],
      description: 'Number of columns to span on small screens',
    },
    md: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto'],
      description: 'Number of columns to span on medium screens',
    },
    lg: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto'],
      description: 'Number of columns to span on large screens',
    },
    xl: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto'],
      description: 'Number of columns to span on extra large screens',
    },
    '2xl': {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto'],
      description: 'Number of columns to span on 2xl screens',
    },
    offset: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      description: 'Number of columns to offset',
    },
    order: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'first', 'last'],
      description: 'Order of the column',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Col>;

interface ContentBoxProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const ContentBox = ({ children, className = '', color = 'gray' }: ContentBoxProps) => (
  <div
    className={`p-8 rounded-lg text-white text-lg ${
      color === 'blue'
        ? 'bg-blue-500'
        : color === 'green'
        ? 'bg-green-500'
        : color === 'purple'
        ? 'bg-purple-500'
        : color === 'orange'
        ? 'bg-orange-500'
        : color === 'pink'
        ? 'bg-pink-500'
        : 'bg-gray-500'
    } ${className}`}
  >
    {children}
  </div>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="py-16 w-full max-w-6xl mx-auto px-8">{children}</div>
);

export const Default: Story = {
  args: {
    span: 4,
  },
  render: args => (
    <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row>
          <Col {...args}>
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

export const DifferentSpans: Story = {
  args: {
    span: 4,
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Different Column Spans</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col span={2}>
                <ContentBox color="blue">Span 2</ContentBox>
              </Col>
              <Col {...args}>
                <ContentBox color="green">Controlled Span</ContentBox>
              </Col>
              <Col span={6}>
                <ContentBox color="purple">Span 6</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
  ),
};

export const AutoWidth: Story = {
  args: {
    span: 'auto',
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Auto Width Column</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Auto Width</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green">Fixed Width</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
  ),
};

export const FullWidth: Story = {
  args: {
    span: 12,
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Full Width Column</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Full Width</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
  ),
};

export const WithOffset: Story = {
  args: {
    span: 4,
    offset: 2,
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Column with Offset</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">With Offset</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green">No Offset</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
  ),
};

export const WithOrder: Story = {
  args: {
    span: 4,
    order: 2,
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Column Order</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Order 2</ContentBox>
              </Col>
              <Col span={4} order={1}>
                <ContentBox color="green">Order 1</ContentBox>
              </Col>
              <Col span={4} order={3}>
                <ContentBox color="purple">Order 3</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
  ),
};

export const Responsive: Story = {
  args: {
    span: 12,
    sm: 6,
    md: 4,
    lg: 3,
  },
  render: args => (
    <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Responsive Columns</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Responsive</ContentBox>
              </Col>
              <Col span={12} sm={6} md={4} lg={3}>
                <ContentBox color="green">Responsive</ContentBox>
              </Col>
              <Col span={12} sm={6} md={4} lg={3}>
                <ContentBox color="purple">Responsive</ContentBox>
              </Col>
              <Col span={12} sm={6} md={4} lg={3}>
                <ContentBox color="orange">Responsive</ContentBox>
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
    span: 4,
    offset: 0,
    order: 1,
  },
  render: args => (
    <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row>
          <Col {...args}>
            <ContentBox color="blue">Interactive Column</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="green">Fixed Column</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="purple">Fixed Column</ContentBox>
          </Col>
        </Row>
      </div>
    </Section>
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Container } from '../../layout/Container';
import { Row } from '../../layout/Row';
import { Col } from '../../layout/Col';

const meta: Meta<typeof Tooltip> = {
  title: 'Base/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'The placement of the tooltip relative to its trigger',
    },
    delay: {
      control: 'number',
      description: 'Delay in milliseconds before showing the tooltip',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button>Hover me</Button>,
  },
};

export const WithDelay: Story = {
  args: {
    content: 'This tooltip appears after a 500ms delay',
    children: <Button>Hover me (with delay)</Button>,
    delay: 500,
  },
};

export const AllPlacements: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-4">
        <Tooltip content="Top tooltip" placement="top">
          <Button>Top</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" placement="right">
          <Button>Right</Button>
        </Tooltip>
        <Tooltip content="Bottom tooltip" placement="bottom">
          <Button>Bottom</Button>
        </Tooltip>
        <Tooltip content="Left tooltip" placement="left">
          <Button>Left</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Info icon tooltip">
        <Button variant="ghost" size="sm">
          <Icon name="info" className="h-5 w-5" />
        </Button>
      </Tooltip>
      <Tooltip content="Warning icon tooltip">
        <Button variant="ghost" size="sm">
          <Icon name="warning" className="h-5 w-5" />
        </Button>
      </Tooltip>
      <Tooltip content="Error icon tooltip">
        <Button variant="ghost" size="sm">
          <Icon name="error" className="h-5 w-5" />
        </Button>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    content: 'This is a very long tooltip content that might wrap to multiple lines. It demonstrates how the tooltip handles longer text content and ensures it stays within the viewport boundaries.',
    children: <Button>Long Content</Button>,
  },
};

export const CustomStyle: Story = {
  args: {
    content: 'Custom styled tooltip',
    children: <Button>Custom Style</Button>,
    className: 'bg-primary-600 text-white',
  },
};

export const InScrollableContainer: Story = {
  render: () => (
    <Container maxWidth="md" className="h-64 overflow-y-auto border rounded-lg">
      <div className="h-96 flex flex-col gap-4 p-4">
        <div className="flex gap-4">
          <Tooltip content="Tooltip in scrollable container" placement="top">
            <Button>Top</Button>
          </Tooltip>
          <Tooltip content="Tooltip in scrollable container" placement="right">
            <Button>Right</Button>
          </Tooltip>
        </div>
        <div className="flex-1" />
        <div className="flex gap-4">
          <Tooltip content="Tooltip in scrollable container" placement="bottom">
            <Button>Bottom</Button>
          </Tooltip>
          <Tooltip content="Tooltip in scrollable container" placement="left">
            <Button>Left</Button>
          </Tooltip>
        </div>
      </div>
    </Container>
  ),
};

export const InGrid: Story = {
  render: () => (
    <Container maxWidth="2xl">
      <Row spacing={4}>
        <Col span={6} sm={4} md={3}>
          <Tooltip content="Grid item 1">
            <Button className="w-full">Item 1</Button>
          </Tooltip>
        </Col>
        <Col span={6} sm={4} md={3}>
          <Tooltip content="Grid item 2">
            <Button className="w-full">Item 2</Button>
          </Tooltip>
        </Col>
        <Col span={6} sm={4} md={3}>
          <Tooltip content="Grid item 3">
            <Button className="w-full">Item 3</Button>
          </Tooltip>
        </Col>
        <Col span={6} sm={4} md={3}>
          <Tooltip content="Grid item 4">
            <Button className="w-full">Item 4</Button>
          </Tooltip>
        </Col>
      </Row>
    </Container>
  ),
};

export const EdgeCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <Tooltip content="Near viewport edge" placement="right">
          <Button>Right edge</Button>
        </Tooltip>
        <Tooltip content="Near viewport edge" placement="left">
          <Button>Left edge</Button>
        </Tooltip>
      </div>
      <div className="flex justify-center gap-4">
        <Tooltip content="Near viewport edge" placement="top">
          <Button>Top edge</Button>
        </Tooltip>
        <Tooltip content="Near viewport edge" placement="bottom">
          <Button>Bottom edge</Button>
        </Tooltip>
      </div>
    </div>
  ),
}; 
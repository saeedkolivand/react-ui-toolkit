import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../../base/Button/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Navigation/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Tooltip content',
    },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Position of the tooltip',
    },
    delay: {
      control: 'number',
      description: 'Delay before showing tooltip (ms)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    placement: 'top',
    delay: 100,
  },
  render: args => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Right: Story = {
  args: {
    content: 'Tooltip on the right',
    placement: 'right',
  },
  render: args => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip on the bottom',
    placement: 'bottom',
  },
  render: args => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Left: Story = {
  args: {
    content: 'Tooltip on the left',
    placement: 'left',
  },
  render: args => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  args: {
    content: 'This is a longer tooltip message that might wrap to multiple lines',
    placement: 'top',
  },
  render: args => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Disabled: Story = {
  args: {
    content: 'This tooltip is disabled',
    placement: 'top',
    disabled: true,
  },
  render: args => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

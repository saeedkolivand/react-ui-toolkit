import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the spinner',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'The variant of the spinner',
    },
    label: {
      control: 'text',
      description: 'The label for screen readers',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    label: 'Loading...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Loading...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Loading...',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Loading...',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Loading...',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Loading...',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    label: 'Loading...',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    label: 'Loading...',
  },
};

export const WithCustomLabel: Story = {
  args: {
    label: 'Processing your request...',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" label="Small spinner" />
      <Spinner size="md" label="Medium spinner" />
      <Spinner size="lg" label="Large spinner" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner variant="primary" label="Primary spinner" />
      <Spinner variant="secondary" label="Secondary spinner" />
      <Spinner variant="success" label="Success spinner" />
      <Spinner variant="warning" label="Warning spinner" />
      <Spinner variant="error" label="Error spinner" />
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner size="sm" label="Loading" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <button
      type="button"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      disabled
    >
      <Spinner size="sm" label="Processing" />
      Processing...
    </button>
  ),
};

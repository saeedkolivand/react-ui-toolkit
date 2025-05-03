import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outline'],
      description: 'The visual style of the input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when error is true',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled input...',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Outline input...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input...',
  },
};

export const Error: Story = {
  args: {
    error: true,
    errorMessage: 'This field is required',
    placeholder: 'Error state...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input...',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Input placeholder="Default input" />
      <Input variant="filled" placeholder="Filled input" />
      <Input variant="outline" placeholder="Outline input" />
      <Input size="sm" placeholder="Small input" />
      <Input size="lg" placeholder="Large input" />
      <Input error errorMessage="This field is required" placeholder="Error state" />
      <Input disabled placeholder="Disabled input" />
      <Input label="Username" placeholder="With label" />
    </div>
  ),
}; 
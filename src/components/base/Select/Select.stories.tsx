import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const meta: Meta<typeof Select> = {
  title: 'Base/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outline'],
      description: 'The visual style of the select',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the select',
    },
    error: {
      control: 'boolean',
      description: 'Whether the select is in an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when error is true',
    },
    label: {
      control: 'text',
      description: 'Label text for the select',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: defaultOptions,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Select an option',
    options: defaultOptions,
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    options: defaultOptions,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    options: defaultOptions,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    options: defaultOptions,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    options: defaultOptions,
  },
};

export const Error: Story = {
  args: {
    error: true,
    errorMessage: 'Please select an option',
    options: defaultOptions,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    options: defaultOptions,
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Select options={defaultOptions} />
      <Select variant="filled" options={defaultOptions} />
      <Select variant="outline" options={defaultOptions} />
      <Select size="sm" options={defaultOptions} />
      <Select size="lg" options={defaultOptions} />
      <Select label="Select an option" options={defaultOptions} />
      <Select error errorMessage="Please select an option" options={defaultOptions} />
      <Select disabled options={defaultOptions} />
      <Select
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2', disabled: true },
          { value: 'option3', label: 'Option 3' },
        ]}
      />
    </div>
  ),
};

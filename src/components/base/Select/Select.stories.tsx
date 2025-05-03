import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Base/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the select input',
    },
    error: {
      control: 'boolean',
      description: 'Whether the select is in error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true },
  { value: 'option5', label: 'Option 5' },
];

export const Default: Story = {
  args: {
    value: 'option1',
    options,
    label: 'Select an option',
    onChange: e => console.log('Selected:', e.target.value),
  },
};

export const WithError: Story = {
  args: {
    value: '',
    options,
    label: 'Select an option',
    error: true,
    errorMessage: 'Please select an option',
    onChange: e => console.log('Selected:', e.target.value),
  },
};

export const Disabled: Story = {
  args: {
    value: 'option1',
    options,
    label: 'Select an option',
    disabled: true,
    onChange: e => console.log('Selected:', e.target.value),
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Select
        value="option1"
        options={options}
        label="Small Select"
        size="sm"
        onChange={e => console.log('Selected:', e.target.value)}
      />
      <Select
        value="option1"
        options={options}
        label="Medium Select"
        size="md"
        onChange={e => console.log('Selected:', e.target.value)}
      />
      <Select
        value="option1"
        options={options}
        label="Large Select"
        size="lg"
        onChange={e => console.log('Selected:', e.target.value)}
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: {
    value: 'option1',
    options,
    onChange: e => console.log('Selected:', e.target.value),
  },
};

export const WithCustomOptions: Story = {
  args: {
    value: 'option1',
    label: 'Select with custom options',
    onChange: e => console.log('Selected:', e.target.value),
    children: (
      <>
        <option value="option1">Custom Option 1</option>
        <option value="option2">Custom Option 2</option>
        <option value="option3">Custom Option 3</option>
      </>
    ),
  },
};

export const DarkMode: Story = {
  parameters: {
    themes: {
      defaultTheme: 'dark',
    },
  },
  args: {
    value: 'option1',
    options,
    label: 'Select in dark mode',
    onChange: e => console.log('Selected:', e.target.value),
  },
};

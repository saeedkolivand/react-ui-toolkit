import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Base/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the switch',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the switch',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Switch',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    checked: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Small',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Large',
    size: 'lg',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'With Helper Text',
    helperText: 'This is a helper text',
  },
};

export const WithError: Story = {
  args: {
    label: 'With Error',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked',
    disabled: true,
    checked: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Switch label="Default" />
        <Switch label="Checked" checked />
        <Switch label="Small" size="sm" />
        <Switch label="Large" size="lg" />
      </div>
      <div className="space-y-2">
        <Switch label="With Helper Text" helperText="This is a helper text" />
        <Switch label="With Error" error="This field is required" />
        <Switch label="Disabled" disabled />
        <Switch label="Disabled Checked" disabled checked />
      </div>
    </div>
  ),
}; 
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Base/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the radio button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the radio button',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the radio button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio button is disabled',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the radio button is checked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Radio',
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

export const RadioGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Radio name="group" label="Option 1" />
        <Radio name="group" label="Option 2" />
        <Radio name="group" label="Option 3" />
      </div>
      <div className="space-y-2">
        <Radio name="group2" label="Small" size="sm" />
        <Radio name="group2" label="Medium" size="md" />
        <Radio name="group2" label="Large" size="lg" />
      </div>
      <div className="space-y-2">
        <Radio name="group3" label="With Helper Text" helperText="This is a helper text" />
        <Radio name="group3" label="With Error" error="This field is required" />
        <Radio name="group3" label="Disabled" disabled />
        <Radio name="group3" label="Disabled Checked" disabled checked />
      </div>
    </div>
  ),
}; 
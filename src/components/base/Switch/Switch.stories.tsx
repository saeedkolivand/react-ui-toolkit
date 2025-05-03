import React, { useState } from 'react';
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

const InteractiveTemplate = (args: any) => {
  const [checked, setChecked] = useState(args.checked || false);
  return <Switch {...args} checked={checked} onChange={e => setChecked(e.target.checked)} />;
};

export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Switch',
  },
};

export const Checked: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Checked',
    checked: true,
  },
};

export const Small: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Small',
    size: 'sm',
  },
};

export const Large: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Large',
    size: 'lg',
  },
};

export const WithHelperText: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'With Helper Text',
    helperText: 'This is a helper text',
  },
};

export const WithError: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'With Error',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Disabled Checked',
    disabled: true,
    checked: true,
  },
};

export const AllVariants: Story = {
  render: () => {
    const [states, setStates] = useState({
      default: false,
      checked: true,
      small: false,
      large: false,
      helper: false,
      error: false,
      disabled: false,
      disabledChecked: true,
    });

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setStates(prev => ({ ...prev, [key]: e.target.checked }));
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Switch label="Default" checked={states.default} onChange={handleChange('default')} />
          <Switch label="Checked" checked={states.checked} onChange={handleChange('checked')} />
          <Switch label="Small" size="sm" checked={states.small} onChange={handleChange('small')} />
          <Switch label="Large" size="lg" checked={states.large} onChange={handleChange('large')} />
        </div>
        <div className="space-y-2">
          <Switch
            label="With Helper Text"
            helperText="This is a helper text"
            checked={states.helper}
            onChange={handleChange('helper')}
          />
          <Switch
            label="With Error"
            error="This field is required"
            checked={states.error}
            onChange={handleChange('error')}
          />
          <Switch
            label="Disabled"
            disabled
            checked={states.disabled}
            onChange={handleChange('disabled')}
          />
          <Switch
            label="Disabled Checked"
            disabled
            checked={states.disabledChecked}
            onChange={handleChange('disabledChecked')}
          />
        </div>
      </div>
    );
  },
};

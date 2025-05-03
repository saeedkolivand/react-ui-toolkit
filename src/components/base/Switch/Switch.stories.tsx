import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch, SwitchProps } from './Switch';

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
    loading: {
      control: 'boolean',
      description: 'Whether the switch is in loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

const InteractiveTemplate = (args: SwitchProps) => {
  const [checked, setChecked] = useState(args.checked || false);
  const [loading, setLoading] = useState(args.loading || false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setChecked(e.target.checked);
    // Simulate loading state
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return <Switch {...args} checked={checked} loading={loading} onChange={handleChange} />;
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

export const Loading: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Loading',
    loading: true,
  },
};

export const LoadingChecked: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Loading Checked',
    checked: true,
    loading: true,
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
      loading: false,
      loadingChecked: true,
      small: false,
      large: false,
      helper: false,
      error: false,
      disabled: false,
      disabledChecked: true,
    });

    const [loadingStates, setLoadingStates] = useState({
      default: false,
      checked: false,
      loading: true,
      loadingChecked: true,
      small: false,
      large: false,
      helper: false,
      error: false,
      disabled: false,
      disabledChecked: false,
    });

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
      setStates(prev => ({ ...prev, [key]: e.target.checked }));
      // Simulate loading state
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Switch
            label="Default"
            checked={states.default}
            loading={loadingStates.default}
            onChange={handleChange('default')}
          />
          <Switch
            label="Checked"
            checked={states.checked}
            loading={loadingStates.checked}
            onChange={handleChange('checked')}
          />
          <Switch
            label="Loading"
            checked={states.loading}
            loading={loadingStates.loading}
            onChange={handleChange('loading')}
          />
          <Switch
            label="Loading Checked"
            checked={states.loadingChecked}
            loading={loadingStates.loadingChecked}
            onChange={handleChange('loadingChecked')}
          />
          <Switch
            label="Small"
            size="sm"
            checked={states.small}
            loading={loadingStates.small}
            onChange={handleChange('small')}
          />
          <Switch
            label="Large"
            size="lg"
            checked={states.large}
            loading={loadingStates.large}
            onChange={handleChange('large')}
          />
        </div>
        <div className="space-y-2">
          <Switch
            label="With Helper Text"
            helperText="This is a helper text"
            checked={states.helper}
            loading={loadingStates.helper}
            onChange={handleChange('helper')}
          />
          <Switch
            label="With Error"
            error="This field is required"
            checked={states.error}
            loading={loadingStates.error}
            onChange={handleChange('error')}
          />
          <Switch
            label="Disabled"
            disabled
            checked={states.disabled}
            loading={loadingStates.disabled}
            onChange={handleChange('disabled')}
          />
          <Switch
            label="Disabled Checked"
            disabled
            checked={states.disabledChecked}
            loading={loadingStates.disabledChecked}
            onChange={handleChange('disabledChecked')}
          />
        </div>
      </div>
    );
  },
};

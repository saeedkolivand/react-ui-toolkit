import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The current value of the progress bar (0-100)',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'The maximum value of the progress bar',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'The variant of the progress bar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the progress bar',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the value label',
    },
    striped: {
      control: 'boolean',
      description: 'Whether to show stripes',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate the stripes',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the progress is indeterminate',
    },
    label: {
      control: 'text',
      description: 'Label for accessibility',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

const ProgressContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[600px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow">{children}</div>
);

export const Basic: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 60,
    max: 100,
  },
};

export const Small: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 40,
    max: 100,
    size: 'sm',
  },
};

export const Large: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 80,
    max: 100,
    size: 'lg',
    showValue: true,
  },
};

export const Primary: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 75,
    max: 100,
    variant: 'primary',
    showValue: true,
  },
};

export const Secondary: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 65,
    max: 100,
    variant: 'secondary',
    showValue: true,
  },
};

export const Success: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 100,
    max: 100,
    variant: 'success',
    showValue: true,
  },
};

export const Warning: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 85,
    max: 100,
    variant: 'warning',
    showValue: true,
  },
};

export const Error: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 25,
    max: 100,
    variant: 'error',
    showValue: true,
  },
};

export const WithStripes: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 70,
    max: 100,
    variant: 'primary',
    showValue: true,
    striped: true,
  },
};

export const Animated: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 90,
    max: 100,
    variant: 'success',
    showValue: true,
    striped: true,
    animated: true,
  },
};

export const Indeterminate: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    indeterminate: true,
    variant: 'primary',
    animated: true,
  },
};

export const WithLabel: Story = {
  render: args => (
    <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>
  ),
  args: {
    value: 60,
    variant: 'primary',
    showValue: true,
    label: 'Uploading files...',
  },
};

export const AllVariants: Story = {
  render: () => (
    <ProgressContainer>
      <div className="flex flex-col gap-4">
        <Progress value={60} variant="primary" showValue label="Primary progress" />
        <Progress value={60} variant="secondary" showValue label="Secondary progress" />
        <Progress value={60} variant="success" showValue label="Success progress" />
        <Progress value={60} variant="warning" showValue label="Warning progress" />
        <Progress value={60} variant="error" showValue label="Error progress" />
        <Progress indeterminate animated variant="primary" label="Loading..." />
      </div>
    </ProgressContainer>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <ProgressContainer>
      <div className="flex flex-col gap-4">
        <Progress value={60} size="sm" label="Small progress" />
        <Progress value={60} size="md" showValue label="Medium progress" />
        <Progress value={60} size="lg" showValue label="Large progress" />
      </div>
    </ProgressContainer>
  ),
};

export const AllStates: Story = {
  render: () => (
    <ProgressContainer>
      <div className="flex flex-col gap-4">
        <Progress value={60} showValue label="Basic progress" />
        <Progress value={60} showValue striped label="Striped progress" />
        <Progress value={60} showValue striped animated label="Animated striped progress" />
        <Progress indeterminate animated label="Indeterminate progress" />
      </div>
    </ProgressContainer>
  ),
};

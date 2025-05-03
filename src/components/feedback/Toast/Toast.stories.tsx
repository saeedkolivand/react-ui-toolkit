import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'The variant of the toast',
    },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'The position of the toast',
    },
    visible: {
      control: 'boolean',
      description: 'Whether the toast is visible',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the toast can be dismissed',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the icon',
    },
    duration: {
      control: 'number',
      description: 'Duration in milliseconds before auto-dismiss',
    },
    title: {
      control: 'text',
      description: 'The title of the toast',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const ToastWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[400px] h-[200px] bg-gray-100 rounded-lg p-4">{children}</div>
);

export const Default: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'info',
    position: 'bottom-right',
    visible: true,
    dismissible: true,
    showIcon: true,
    title: 'Information',
    children: 'This is an informational message.',
  },
};

export const Success: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'success',
    position: 'top-right',
    visible: true,
    dismissible: true,
    showIcon: true,
    title: 'Success',
    children: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'warning',
    position: 'top-left',
    visible: true,
    dismissible: true,
    showIcon: true,
    title: 'Warning',
    children: 'Your session will expire in 5 minutes.',
  },
};

export const Error: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'error',
    position: 'bottom-left',
    visible: true,
    dismissible: true,
    showIcon: true,
    title: 'Error',
    children: 'Failed to save changes. Please try again.',
  },
};

export const WithoutIcon: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'info',
    position: 'bottom-right',
    visible: true,
    dismissible: true,
    showIcon: false,
    title: 'No Icon',
    children: 'This toast is displayed without an icon.',
  },
};

export const NonDismissible: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'info',
    position: 'bottom-right',
    visible: true,
    dismissible: false,
    showIcon: true,
    title: 'Non-dismissible',
    children: 'This toast cannot be dismissed.',
  },
};

export const AutoDismiss: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'success',
    position: 'top-right',
    visible: true,
    dismissible: true,
    showIcon: true,
    duration: 3000,
    title: 'Auto-dismiss',
    children: 'This toast will auto-dismiss after 3 seconds.',
  },
};

export const LongContent: Story = {
  render: args => (
    <ToastWrapper>
      <Toast {...args} />
    </ToastWrapper>
  ),
  args: {
    variant: 'info',
    position: 'bottom-right',
    visible: true,
    dismissible: true,
    showIcon: true,
    title: 'Long Content',
    children:
      'This is a toast with a longer message that might wrap to multiple lines. It demonstrates how the toast handles content that exceeds the typical length.',
  },
};

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <ToastWrapper>
        <Toast
          variant="info"
          position="top-left"
          visible={true}
          title="Top Left"
          children="This toast is positioned at the top left."
        />
      </ToastWrapper>
      <ToastWrapper>
        <Toast
          variant="success"
          position="top-right"
          visible={true}
          title="Top Right"
          children="This toast is positioned at the top right."
        />
      </ToastWrapper>
      <ToastWrapper>
        <Toast
          variant="warning"
          position="bottom-left"
          visible={true}
          title="Bottom Left"
          children="This toast is positioned at the bottom left."
        />
      </ToastWrapper>
      <ToastWrapper>
        <Toast
          variant="error"
          position="bottom-right"
          visible={true}
          title="Bottom Right"
          children="This toast is positioned at the bottom right."
        />
      </ToastWrapper>
    </div>
  ),
};

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../../base/Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Navigation/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls the visibility of the modal',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when modal is closed',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size of the modal',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether to close modal when clicking outside',
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Whether to close modal when pressing ESC',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalContent = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
    <p className="mb-4">
      This is a sample modal content. You can put any content here, including forms, images, or
      other components.
    </p>
    <div className="flex justify-end gap-4">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </div>
);

export const Default: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>
    );
  },
  args: {
    size: 'md',
    closeOnOverlayClick: true,
    closeOnEsc: true,
  },
};

export const Small: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Small Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>
    );
  },
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>
    );
  },
  args: {
    size: 'lg',
  },
};

export const FullScreen: Story = {
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Full Screen Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>
    );
  },
  args: {
    size: 'full',
  },
};

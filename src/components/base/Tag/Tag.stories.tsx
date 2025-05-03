import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag, TagVariant, TagColor } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Base/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'solid'],
      description: 'The visual style of the tag',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
      description: 'The color scheme of the tag',
    },
    closable: {
      control: 'boolean',
      description: 'Whether the tag can be closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Default Tag',
  },
};

export const Closable: Story = {
  args: {
    children: 'Closable Tag',
    closable: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Tag variant="default">Default</Tag>
        <Tag variant="outline">Outline</Tag>
        <Tag variant="solid">Solid</Tag>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Tag color="default">Default</Tag>
        <Tag color="primary">Primary</Tag>
        <Tag color="success">Success</Tag>
        <Tag color="warning">Warning</Tag>
        <Tag color="error">Error</Tag>
        <Tag color="info">Info</Tag>
      </div>
      <div className="flex gap-2">
        <Tag variant="outline" color="default">Default</Tag>
        <Tag variant="outline" color="primary">Primary</Tag>
        <Tag variant="outline" color="success">Success</Tag>
        <Tag variant="outline" color="warning">Warning</Tag>
        <Tag variant="outline" color="error">Error</Tag>
        <Tag variant="outline" color="info">Info</Tag>
      </div>
      <div className="flex gap-2">
        <Tag variant="solid" color="default">Default</Tag>
        <Tag variant="solid" color="primary">Primary</Tag>
        <Tag variant="solid" color="success">Success</Tag>
        <Tag variant="solid" color="warning">Warning</Tag>
        <Tag variant="solid" color="error">Error</Tag>
        <Tag variant="solid" color="info">Info</Tag>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['Tag 1', 'Tag 2', 'Tag 3']);

    const handleClose = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div className="flex gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag}
            color="primary"
            closable
            onClose={() => handleClose(tag)}
          >
            {tag}
          </Tag>
        ))}
      </div>
    );
  },
}; 
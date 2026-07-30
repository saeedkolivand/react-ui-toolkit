# Tag Component

A lightweight tag component for categorizing content with different styles and colors. Tags can be used to highlight keywords, label items, or display status information.

## Features

- Multiple color options: default, primary, success, warning, error, info
- Three style variants: default, outline, solid
- Optional close button with callback
- Compact, accessible design
- Customizable with additional classNames
- Built with Tailwind CSS

## Basic Usage

```jsx
import { Tag } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div className="space-x-2">
      <Tag>Default</Tag>
      <Tag color="primary">Primary</Tag>
      <Tag color="success">Success</Tag>
      <Tag color="warning">Warning</Tag>
      <Tag color="error">Error</Tag>
      <Tag color="info">Info</Tag>
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | Content of the tag (required) |
| variant | `'default' \| 'outline' \| 'solid'` | `'default'` | Style variant of the tag |
| color | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color theme of the tag |
| closable | `boolean` | `false` | Whether the tag can be closed/removed |
| onClose | `() => void` | - | Callback executed when tag is closed |
| className | `string` | - | Additional CSS class for custom styling |

## Examples

### Different Variants

```jsx
import { Tag } from '@saeedkolivand/react-ui-toolkit';

function VariantExamples() {
  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <Tag variant="default" color="primary">Default Style</Tag>
        <Tag variant="outline" color="primary">Outline Style</Tag>
        <Tag variant="solid" color="primary">Solid Style</Tag>
      </div>
    </div>
  );
}
```

### Closable Tags

```jsx
import { Tag } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function ClosableTagsExample() {
  const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3']);

  const handleClose = (removedTag) => {
    setTags(tags.filter(tag => tag !== removedTag));
  };

  return (
    <div className="space-x-2">
      {tags.map(tag => (
        <Tag 
          key={tag} 
          closable 
          onClose={() => handleClose(tag)}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}
```

### Color Variations

```jsx
import { Tag } from '@saeedkolivand/react-ui-toolkit';

function ColorExamples() {
  // Default variant
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Default Variant:</h3>
        <div className="space-x-2">
          <Tag color="default">Default</Tag>
          <Tag color="primary">Primary</Tag>
          <Tag color="success">Success</Tag>
          <Tag color="warning">Warning</Tag>
          <Tag color="error">Error</Tag>
          <Tag color="info">Info</Tag>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Outline Variant:</h3>
        <div className="space-x-2">
          <Tag variant="outline" color="default">Default</Tag>
          <Tag variant="outline" color="primary">Primary</Tag>
          <Tag variant="outline" color="success">Success</Tag>
          <Tag variant="outline" color="warning">Warning</Tag>
          <Tag variant="outline" color="error">Error</Tag>
          <Tag variant="outline" color="info">Info</Tag>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Solid Variant:</h3>
        <div className="space-x-2">
          <Tag variant="solid" color="default">Default</Tag>
          <Tag variant="solid" color="primary">Primary</Tag>
          <Tag variant="solid" color="success">Success</Tag>
          <Tag variant="solid" color="warning">Warning</Tag>
          <Tag variant="solid" color="error">Error</Tag>
          <Tag variant="solid" color="info">Info</Tag>
        </div>
      </div>
    </div>
  );
}
```

### With Custom Styling

```jsx
import { Tag } from '@saeedkolivand/react-ui-toolkit';

function CustomizedTag() {
  return (
    <Tag 
      color="primary" 
      className="py-1 px-3 text-sm shadow-sm"
    >
      Custom styled tag
    </Tag>
  );
}
```

### With Icons

```jsx
import { Tag, Icon } from '@saeedkolivand/react-ui-toolkit';

function TagsWithIcons() {
  return (
    <div className="space-x-2">
      <Tag color="success">
        <Icon name="check" size="sm" className="mr-1" /> Completed
      </Tag>

      <Tag color="warning">
        <Icon name="clock" size="sm" className="mr-1" /> Pending
      </Tag>

      <Tag color="error">
        <Icon name="error" size="sm" className="mr-1" /> Failed
      </Tag>
    </div>
  );
}
```

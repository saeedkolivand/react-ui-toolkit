# Divider Component

A versatile divider component that creates a visible boundary between content sections. The divider can be horizontal or vertical, and can optionally include text content.

## Features

- Support for both horizontal and vertical orientations
- Text content with customizable alignment (left, center, right)
- Solid or dashed line styles
- Fully customizable through className props
- Built with Tailwind CSS for consistent styling

## Basic Usage

```jsx
import { Divider } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div>
      <p>Content above divider</p>
      <Divider />
      <p>Content below divider</p>
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction of the divider |
| orientation | `'left' \| 'center' \| 'right'` | `'center'` | The alignment of the divider text (only applies when children are provided) |
| dashed | `boolean` | `false` | Whether the divider line should be dashed |
| children | `React.ReactNode` | - | Optional text or content to display in the divider |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Divider component accepts all standard HTML div attributes.

## Examples

### Horizontal Divider with Text

```jsx
<Divider>OR</Divider>
```

### Dashed Divider

```jsx
<Divider dashed />
```

### Divider with Left-Aligned Text

```jsx
<Divider orientation="left">Section 1</Divider>
```

### Vertical Divider

```jsx
<div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
  <span>Text</span>
  <Divider type="vertical" />
  <span>Text</span>
</div>
```

### Custom Styling

```jsx
<Divider className="my-8 border-blue-500" />
```

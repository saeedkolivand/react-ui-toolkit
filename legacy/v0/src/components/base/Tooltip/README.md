# Tooltip Component

## Usage

The Tooltip component provides a way to display additional information when hovering over an element.

```jsx
import { Tooltip } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Tooltip content="This is a helpful tooltip">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

## Features

- Multiple positioning options
- Customizable appearance
- Delayed showing/hiding
- Support for rich content
- Arrow indicator
- Accessible implementation

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | `string \| ReactNode` | - | Content to display in the tooltip |
| position | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Position of the tooltip relative to the target element |
| trigger | `'hover' \| 'click' \| 'focus'` | `'hover'` | Event that triggers the tooltip to show |
| delay | `number` | `0` | Delay in milliseconds before showing the tooltip |
| hideDelay | `number` | `0` | Delay in milliseconds before hiding the tooltip |
| arrow | `boolean` | `true` | Whether to show an arrow pointing to the target element |
| maxWidth | `number \| string` | `'250px'` | Maximum width of the tooltip |
| className | `string` | - | Additional CSS classes for the tooltip |
| containerClassName | `string` | - | Additional CSS classes for the tooltip container |
| children | `ReactElement` | - | Target element that triggers the tooltip |

## Examples

### Basic Tooltip

```jsx
<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>
```

### Different Positions

```jsx
<Tooltip content="Top tooltip" position="top">
  <button>Top</button>
</Tooltip>

<Tooltip content="Right tooltip" position="right">
  <button>Right</button>
</Tooltip>

<Tooltip content="Bottom tooltip" position="bottom">
  <button>Bottom</button>
</Tooltip>

<Tooltip content="Left tooltip" position="left">
  <button>Left</button>
</Tooltip>
```

### Click Trigger

```jsx
<Tooltip content="Click tooltip" trigger="click">
  <button>Click me</button>
</Tooltip>
```

### Rich Content

```jsx
<Tooltip
  content={
    <div>
      <h4 className="font-bold">Rich Content</h4>
      <p>This tooltip contains formatted content.</p>
      <a href="#" className="text-blue-500 hover:underline">Learn more</a>
    </div>
  }
  maxWidth="300px"
>
  <button>Hover for rich tooltip</button>
</Tooltip>
```

### With Delay

```jsx
<Tooltip 
  content="This tooltip appears after a delay"
  delay={500}
  hideDelay={200}
>
  <button>Hover with delay</button>
</Tooltip>
```

### Without Arrow

```jsx
<Tooltip 
  content="This tooltip has no arrow"
  arrow={false}
>
  <button>No arrow</button>
</Tooltip>
```

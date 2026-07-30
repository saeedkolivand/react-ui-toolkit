# Switch Component

## Usage

The Switch component provides a toggleable switch input.

```jsx
import { Switch } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Switch 
      label="Dark Mode"
      onChange={(checked) => console.log('Dark mode:', checked)}
    />
  );
}
```

## Features

- Styled toggle switch with customizable label
- Support for label placement (left/right)
- Accessible design with proper ARIA attributes
- Support for disabled state
- Various color options

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string \| ReactNode` | - | Switch label |
| checked | `boolean` | `false` | Whether the switch is checked |
| disabled | `boolean` | `false` | Whether the switch is disabled |
| color | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Color variant of the switch |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Switch size |
| labelPlacement | `'start' \| 'end'` | `'end'` | Position of the label relative to the switch |

Additionally, the Switch component accepts all standard HTML input attributes.

## Examples

### Basic Switch

```jsx
<Switch label="Notifications" />
```

### Controlled Switch

```jsx
import { useState } from 'react';

function ControlledSwitch() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch 
      label={`WiFi is ${enabled ? 'enabled' : 'disabled'}`}
      checked={enabled}
      onChange={setEnabled}
    />
  );
}
```

### Different Colors

```jsx
<Switch label="Primary" color="primary" />
<Switch label="Secondary" color="secondary" />
<Switch label="Success" color="success" />
<Switch label="Warning" color="warning" />
<Switch label="Error" color="error" />
<Switch label="Info" color="info" />
```

### Different Sizes

```jsx
<Switch label="Small" size="sm" />
<Switch label="Medium" size="md" />
<Switch label="Large" size="lg" />
```

### Label Placement

```jsx
<Switch label="Label on right" labelPlacement="end" />
<Switch label="Label on left" labelPlacement="start" />
```

### Disabled Switch

```jsx
<Switch label="Unavailable feature" disabled />
```

# Checkbox Component

## Usage

The Checkbox component provides a styled checkbox input with label support.

```jsx
import { Checkbox } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Checkbox 
      label="I agree to the terms and conditions"
      onChange={(e) => console.log(e.target.checked)}
    />
  );
}
```

## Features

- Styled checkbox with customizable label
- Support for indeterminate state
- Accessible design with proper ARIA attributes
- Support for disabled state

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string \| ReactNode` | - | Checkbox label |
| checked | `boolean` | `false` | Whether the checkbox is checked |
| indeterminate | `boolean` | `false` | Whether the checkbox is in indeterminate state |
| disabled | `boolean` | `false` | Whether the checkbox is disabled |
| error | `string` | - | Error message to display |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Checkbox size |

Additionally, the Checkbox component accepts all standard HTML input attributes.

## Examples

### Basic Checkbox

```jsx
<Checkbox label="Remember me" />
```

### Controlled Checkbox

```jsx
import { useState } from 'react';

function ControlledCheckbox() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Checkbox 
      label="Subscribe to newsletter"
      checked={isChecked}
      onChange={(e) => setIsChecked(e.target.checked)}
    />
  );
}
```

### Indeterminate State

```jsx
<Checkbox 
  label="Select all items"
  indeterminate={true}
/>
```

### Disabled Checkbox

```jsx
<Checkbox 
  label="This option is not available"
  disabled
/>
```

### With Error Message

```jsx
<Checkbox 
  label="I agree to the terms"
  error="You must agree to the terms to continue"
/>
```

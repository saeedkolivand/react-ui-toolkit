# Input Component

## Usage

The Input component provides a styled text input field with various customization options.

```jsx
import { Input } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Input 
      label="Email Address"
      placeholder="example@email.com"
      type="email"
      required
    />
  );
}
```

## Features

- Customizable input field with label
- Error state support
- Various sizes
- Support for all standard HTML input attributes
- Accessible design with proper ARIA attributes

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | - | Input label text |
| error | `string` | - | Error message to display |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| fullWidth | `boolean` | `false` | Makes input take full width of container |

Additionally, the Input component accepts all standard HTML input attributes like `type`, `placeholder`, `disabled`, `required`, etc.

## Examples

### Basic Input

```jsx
<Input placeholder="Enter your name" />
```

### With Label

```jsx
<Input label="Username" placeholder="Enter your username" />
```

### With Error Message

```jsx
<Input 
  label="Email" 
  type="email" 
  error="Please enter a valid email address"
/>
```

### Different Sizes

```jsx
<Input size="sm" placeholder="Small input" />
<Input size="md" placeholder="Medium input" />
<Input size="lg" placeholder="Large input" />
```

### Full Width

```jsx
<Input fullWidth placeholder="This input takes full width" />
```

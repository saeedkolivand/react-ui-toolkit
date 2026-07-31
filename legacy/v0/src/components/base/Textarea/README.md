# Textarea Component

## Usage

The Textarea component provides a styled multi-line text input field.

```jsx
import { Textarea } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Textarea 
      label="Bio"
      placeholder="Tell us about yourself..."
      rows={4}
    />
  );
}
```

## Features

- Customizable textarea with label
- Error state support
- Auto-resize capability
- Support for character count
- Accessible design

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | - | Textarea label text |
| error | `string` | - | Error message to display |
| autoResize | `boolean` | `false` | Whether the textarea should automatically resize based on content |
| maxLength | `number` | - | Maximum number of characters allowed |
| showCount | `boolean` | `false` | Whether to show character count |
| rows | `number` | `3` | Number of rows to display |
| fullWidth | `boolean` | `false` | Makes textarea take full width of container |

Additionally, the Textarea component accepts all standard HTML textarea attributes.

## Examples

### Basic Textarea

```jsx
<Textarea placeholder="Enter your message" />
```

### With Label

```jsx
<Textarea 
  label="Message"
  placeholder="Enter your message"
/>
```

### With Error Message

```jsx
<Textarea 
  label="Comments"
  error="Comments cannot be empty"
/>
```

### Auto-resizing Textarea

```jsx
<Textarea 
  label="Description"
  autoResize
  placeholder="The textarea will grow as you type..."
/>
```

### With Character Count

```jsx
<Textarea 
  label="Cover Letter"
  maxLength={500}
  showCount
  placeholder="Introduce yourself (max 500 characters)"
/>
```

### Custom Number of Rows

```jsx
<Textarea 
  label="Detailed Description"
  rows={8}
  placeholder="Please provide a detailed description..."
/>
```

### Full Width

```jsx
<Textarea 
  fullWidth
  label="Notes"
  placeholder="Enter your notes here"
/>
```

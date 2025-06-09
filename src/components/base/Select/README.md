# Select Component

## Usage

The Select component provides a styled dropdown for selecting options from a list.

```jsx
import { Select } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Select 
      label="Country"
      options={[
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
      ]}
      onChange={(value) => console.log(value)}
    />
  );
}
```

## Features

- Customizable dropdown with search functionality
- Support for single and multiple selections
- Accessible keyboard navigation
- Custom option rendering
- Loading and error states

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | - | Select field label |
| options | `Array<{ value: string, label: string }>` | `[]` | Options to display in the dropdown |
| value | `string \| string[]` | - | Selected value(s) |
| placeholder | `string` | `'Select an option'` | Placeholder text when no option is selected |
| multiple | `boolean` | `false` | Allow multiple selections |
| disabled | `boolean` | `false` | Whether the select is disabled |
| error | `string` | - | Error message to display |
| loading | `boolean` | `false` | Whether to show loading state |
| searchable | `boolean` | `false` | Whether to enable search functionality |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Select field size |
| fullWidth | `boolean` | `false` | Makes select take full width of container |

## Examples

### Basic Select

```jsx
<Select 
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ]}
/>
```

### With Label

```jsx
<Select 
  label="Favorite Fruit"
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ]}
/>
```

### Multiple Selection

```jsx
<Select 
  label="Skills"
  multiple
  options={[
    { value: 'js', label: 'JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'node', label: 'Node.js' },
    { value: 'ts', label: 'TypeScript' },
  ]}
/>
```

### Searchable Select

```jsx
<Select 
  label="Country"
  searchable
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    // More countries...
  ]}
/>
```

### With Loading State

```jsx
<Select 
  label="Data"
  loading
  options={[]}
/>
```

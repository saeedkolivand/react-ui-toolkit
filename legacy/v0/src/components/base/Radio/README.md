# Radio Component

## Usage

The Radio component provides a styled radio button with label support.

```jsx
import { Radio } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <div>
      <Radio 
        name="plan"
        value="basic"
        label="Basic Plan"
      />
      <Radio 
        name="plan"
        value="premium"
        label="Premium Plan"
      />
    </div>
  );
}
```

## Features

- Styled radio button with customizable label
- Accessible design with proper ARIA attributes
- Support for disabled state
- Proper grouping with name attribute

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string \| ReactNode` | - | Radio button label |
| name | `string` | - | Name attribute for grouping radio buttons |
| value | `string` | - | Value of the radio button |
| checked | `boolean` | `false` | Whether the radio button is checked |
| disabled | `boolean` | `false` | Whether the radio button is disabled |
| error | `string` | - | Error message to display |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Radio button size |

Additionally, the Radio component accepts all standard HTML input attributes.

## Examples

### Basic Radio Buttons

```jsx
<Radio name="gender" value="male" label="Male" />
<Radio name="gender" value="female" label="Female" />
<Radio name="gender" value="other" label="Other" />
```

### Controlled Radio Group

```jsx
import { useState } from 'react';

function RadioGroup() {
  const [selected, setSelected] = useState('option1');

  return (
    <div className="space-y-2">
      <Radio 
        name="options"
        value="option1"
        label="Option 1"
        checked={selected === 'option1'}
        onChange={() => setSelected('option1')}
      />
      <Radio 
        name="options"
        value="option2"
        label="Option 2"
        checked={selected === 'option2'}
        onChange={() => setSelected('option2')}
      />
      <Radio 
        name="options"
        value="option3"
        label="Option 3"
        checked={selected === 'option3'}
        onChange={() => setSelected('option3')}
      />
    </div>
  );
}
```

### Disabled Radio Button

```jsx
<Radio 
  name="plan"
  value="enterprise"
  label="Enterprise Plan (Coming Soon)"
  disabled
/>
```

### Different Sizes

```jsx
<Radio size="sm" name="size" value="small" label="Small" />
<Radio size="md" name="size" value="medium" label="Medium" />
<Radio size="lg" name="size" value="large" label="Large" />
```

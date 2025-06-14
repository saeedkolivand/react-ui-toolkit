# Badge Component

A lightweight badge component for highlighting information, status, or counts. Badges can be used to draw attention to new items, indicate status, or emphasize small pieces of information.

## Features

- Five variants: primary, secondary, success, warning, error
- Three size options: sm, md, lg
- Rounded or square shape options
- Outlined or filled styling
- Dark mode support
- Customizable with additional classNames

## Basic Usage

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div className="space-x-2">
      <Badge>New</Badge>
      <Badge variant="secondary">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | The color variant of the badge |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the badge |
| rounded | `boolean` | `false` | Whether the badge has fully rounded corners (pill shape) |
| outlined | `boolean` | `false` | Whether the badge has an outlined style instead of filled |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Badge component accepts all standard HTML span attributes.

## Examples

### Different Sizes

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

function BadgeSizes() {
  return (
    <div className="flex items-center space-x-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}
```

### Rounded Badges

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

function RoundedBadges() {
  return (
    <div className="space-x-2">
      <Badge rounded>Primary</Badge>
      <Badge variant="secondary" rounded>Secondary</Badge>
      <Badge variant="success" rounded>Success</Badge>
      <Badge variant="warning" rounded>Warning</Badge>
      <Badge variant="error" rounded>Error</Badge>
    </div>
  );
}
```

### Outlined Badges

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

function OutlinedBadges() {
  return (
    <div className="space-x-2">
      <Badge outlined>Primary</Badge>
      <Badge variant="secondary" outlined>Secondary</Badge>
      <Badge variant="success" outlined>Success</Badge>
      <Badge variant="warning" outlined>Warning</Badge>
      <Badge variant="error" outlined>Error</Badge>
    </div>
  );
}
```

### Combining Options

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

function CombinedBadges() {
  return (
    <div className="space-x-2">
      <Badge rounded outlined>Primary</Badge>
      <Badge variant="success" size="lg" rounded>Success</Badge>
      <Badge variant="error" size="sm" outlined>Error</Badge>
    </div>
  );
}
```

### With Counters

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

function CounterBadges() {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <span className="mr-2">Notifications</span>
        <Badge variant="error" rounded>5</Badge>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Messages</span>
        <Badge variant="primary" rounded>3</Badge>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Updates</span>
        <Badge variant="secondary" rounded>2</Badge>
      </div>
    </div>
  );
}
```

### With Icons

```jsx
import { Badge, Icon } from '@saeedkolivand/react-ui-toolkit';

function BadgesWithIcons() {
  return (
    <div className="space-x-4">
      <Badge variant="success" size="lg" className="px-3">
        <Icon name="check" size="sm" className="mr-1" /> Verified
      </Badge>

      <Badge variant="warning" size="lg" className="px-3">
        <Icon name="warning" size="sm" className="mr-1" /> Warning
      </Badge>

      <Badge variant="error" size="lg" className="px-3">
        <Icon name="error" size="sm" className="mr-1" /> Error
      </Badge>
    </div>
  );
}
```

### Custom Styling

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

function CustomBadges() {
  return (
    <div className="space-y-2">
      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
        Custom Purple
      </Badge>

      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        Gradient
      </Badge>

      <Badge className="shadow-md border border-gray-200">
        With Shadow
      </Badge>
    </div>
  );
}
```

# API Reference

## Core Components

### Button

```jsx
import { Button } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Button style variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| loading | `boolean` | `false` | Shows loading spinner when true |
| fullWidth | `boolean` | `false` | Makes button take full width of container |
| icon | `string` | - | Icon to display in button |
| iconPosition | `'left' \| 'right'` | `'left'` | Position of icon relative to text |

Additionally, the Button component accepts all standard HTML button attributes.

### Input

```jsx
import { Input } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | - | Input label text |
| error | `string` | - | Error message to display |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| fullWidth | `boolean` | `false` | Makes input take full width of container |

Additionally, the Input component accepts all standard HTML input attributes.

### Card

```jsx
import { Card } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes to apply |

**Sub-components**

- `Card.Header` - Card header section
- `Card.Body` - Card body section
- `Card.Footer` - Card footer section

### Notification

```jsx
import { Notification } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | The type of notification which affects styling |
| message | `string` | - | The main message to display (required) |
| description | `string` | - | Optional secondary text with additional details |
| duration | `number` | `4500` | Time in milliseconds before auto-dismissal |
| onClose | `() => void` | - | Callback function triggered when notification closes |
| className | `string` | - | Additional CSS class for custom styling |

## Providers

### StylesProvider

```jsx
import { StylesProvider } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Child components |

Automatic CSS injection for client-side rendering.

### StylesProviderSSR

```jsx
import { StylesProviderSSR } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Child components |

CSS provider optimized for server-side rendering (Next.js, etc).

## Hooks

### useChangeTheme

```jsx
import { useChangeTheme } from '@saeedkolivand/react-ui-toolkit';
```

Returns:

```typescript
{
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

### useColorScheme

```jsx
import { useColorScheme } from '@saeedkolivand/react-ui-toolkit';
```

Returns the current color scheme as a string (`'light'` or `'dark'`).

## Higher-Order Components

### withStyles

```jsx
import { withStyles } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  // Your component code
}

export default withStyles(MyComponent);
```

Wraps a component with automatic CSS injection.

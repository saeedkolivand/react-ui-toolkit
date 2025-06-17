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
| icon | `IconName` | - | Name of the icon to display in button (uses built-in Icon component) |
| iconPosition | `'left' \| 'right'` | `'left'` | Position of icon relative to text |

Additionally, the Button component accepts all standard HTML button attributes.

**Icon Usage Example**

```jsx
<Button icon="search" iconPosition="left">Search</Button>
<Button icon="plus" variant="primary">Add New</Button>
<Button icon="trash" variant="error" iconPosition="right">Delete</Button>
```

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

### Icon

```jsx
import { Icon } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | `IconName` | - | The name of the built-in icon to use |
| customIcon | `React.ReactNode` | - | Custom icon component to use instead of built-in icons |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | The size of the icon |
| color | `string` | `'currentColor'` | The color of the icon |
| className | `string` | - | Additional CSS class for custom styling |

The component includes 80+ built-in icons organized by category (navigation, actions, status, social, etc.).

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

### Divider

```jsx
import { Divider } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction of the divider |
| orientation | `'left' \| 'center' \| 'right'` | `'center'` | The alignment of the divider text |
| dashed | `boolean` | `false` | Whether the divider line should be dashed |
| children | `React.ReactNode` | - | Optional text or content to display in the divider |
| className | `string` | - | Additional CSS class for custom styling |

### Table

```jsx
import { Table } from '@saeedkolivand/react-ui-toolkit';
```

### Progress

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `number` | - | The current value of the progress bar (0-100) |
| max | `number` | `100` | The maximum value of the progress bar |
| variant | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | The color variant of the progress bar |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | The thickness of the progress bar |
| showValue | `boolean` | `false` | Whether to show the percentage value label |
| striped | `boolean` | `false` | Whether to show stripes in the progress bar |
| animated | `boolean` | `false` | Whether to animate the stripes or indeterminate state |
| indeterminate | `boolean` | `false` | Whether the progress is indeterminate (loading state) |
| label | `string` | - | Custom label for accessibility |
| className | `string` | - | Additional CSS class for custom styling |

### Spinner

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the spinner |
| variant | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | The color variant of the spinner |
| label | `string` | `'Loading...'` | Screen reader text for accessibility |
| className | `string` | - | Additional CSS class for custom styling |

## Layout Components

### Container

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| maxWidth | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' \| 'none'` | `'lg'` | Maximum width of the container |
| padding | `boolean` | `true` | Whether to add horizontal padding to the container |
| center | `boolean` | `true` | Whether the container should be centered |
| className | `string` | - | Additional CSS class for custom styling |

### Row

```jsx
import { Row } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| justify | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | Horizontal alignment of columns |
| align | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | - | Vertical alignment of columns |
| spacing | `number` | - | Space between columns (in Tailwind's gap units) |
| wrap | `boolean` | `true` | Whether to wrap columns to multiple lines |
| reverse | `boolean` | `false` | Whether to reverse the order of columns |
| className | `string` | - | Additional CSS class for custom styling |

### Col

```jsx
import { Col } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| span | `1-12` | - | Number of columns to span (1-12) |
| offset | `0-11` | - | Number of columns to offset (0-11) |
| order | `number \| 'first' \| 'last'` | - | Order of the column |
| sm | `1-12` | - | Column span at the sm breakpoint (640px+) |
| md | `1-12` | - | Column span at the md breakpoint (768px+) |
| lg | `1-12` | - | Column span at the lg breakpoint (1024px+) |
| xl | `1-12` | - | Column span at the xl breakpoint (1280px+) |
| smOffset | `0-11` | - | Column offset at the sm breakpoint |
| mdOffset | `0-11` | - | Column offset at the md breakpoint |
| lgOffset | `0-11` | - | Column offset at the lg breakpoint |
| xlOffset | `0-11` | - | Column offset at the xl breakpoint |
| smOrder | `number \| 'first' \| 'last'` | - | Column order at the sm breakpoint |
| mdOrder | `number \| 'first' \| 'last'` | - | Column order at the md breakpoint |
| lgOrder | `number \| 'first' \| 'last'` | - | Column order at the lg breakpoint |
| xlOrder | `number \| 'first' \| 'last'` | - | Column order at the xl breakpoint |
| className | `string` | - | Additional CSS class for custom styling |

## Navigation Components

### Accordion

```jsx
import { Accordion } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | `AccordionItem[]` | - | Array of accordion items to display |
| allowMultiple | `boolean` | `false` | Whether multiple panels can be expanded at once |
| defaultExpanded | `number \| number[]` | - | Index or indices of initially expanded panel(s) |
| className | `string` | - | Additional CSS class for custom styling |

**AccordionItem Type**

```typescript
interface AccordionItem {
  title: React.ReactNode;    // The title of the accordion item
  content: React.ReactNode;  // The content of the accordion item
  disabled?: boolean;        // Whether the accordion item is disabled
}
```

### Drawer

```jsx
import { Drawer } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | `boolean` | - | Whether the drawer is open |
| onClose | `() => void` | - | Callback when the drawer should close |
| position | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | The position of the drawer |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | The size of the drawer |
| showCloseButton | `boolean` | `true` | Whether to show the close button |
| closeOnBackdropClick | `boolean` | `true` | Whether to close the drawer when clicking the backdrop |
| closeOnEsc | `boolean` | `true` | Whether to close the drawer when pressing escape |
| className | `string` | - | Additional CSS class for custom styling |

### Dropdown

```jsx
import { Dropdown, Menu } from '@saeedkolivand/react-ui-toolkit';
```

**Dropdown Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | The trigger element |
| overlay | `React.ReactNode` | - | The dropdown content |
| trigger | `'hover' \| 'click'` | `'hover'` | How the dropdown is triggered |
| placement | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Where the dropdown appears relative to the trigger |
| disabled | `boolean` | `false` | Whether the dropdown is disabled |
| className | `string` | - | Additional CSS class for the dropdown container |
| overlayClassName | `string` | - | Additional CSS class for the dropdown content |

**Menu Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | The menu items |
| className | `string` | - | Additional CSS class for the menu |

**Menu.Item Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| key | `string` | - | Unique identifier for the menu item |
| children | `React.ReactNode` | - | The content of the menu item |
| disabled | `boolean` | `false` | Whether the menu item is disabled |
| danger | `boolean` | `false` | Whether to show the menu item in a danger state |
| className | `string` | - | Additional CSS class for the menu item |
| onClick | `() => void` | - | Callback when the menu item is clicked |

### Modal

```jsx
import { Modal } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | `boolean` | - | Whether the modal is open |
| onClose | `() => void` | - | Callback when the modal should close |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | The size of the modal |
| showCloseButton | `boolean` | `true` | Whether to show the close button |
| closeOnBackdropClick | `boolean` | `true` | Whether to close the modal when clicking the backdrop |
| closeOnEsc | `boolean` | `true` | Whether to close the modal when pressing escape |
| centered | `boolean` | `true` | Whether to center the modal vertically |
| scrollable | `boolean` | `true` | Whether to show a scrollbar when content overflows |
| className | `string` | - | Additional CSS class for custom styling |

### Tabs

```jsx
import { Tabs } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | `TabItem[]` | - | Array of tab items to display |
| defaultActiveTab | `number` | `0` | Index of the initially active tab |
| orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation of the tabs |
| variant | `'line' \| 'enclosed' \| 'soft-rounded' \| 'solid-rounded'` | `'line'` | Visual style variant |
| isFitted | `boolean` | `false` | Whether tabs should take up equal width |
| className | `string` | - | Additional CSS class for custom styling |
| onTabChange | `(index: number) => void` | - | Callback function when a tab is selected |

**TabItem Type**

```typescript
interface TabItem {
  label: React.ReactNode;    // The label of the tab
  content: React.ReactNode;  // The content of the tab panel
  disabled?: boolean;        // Whether the tab is disabled
}
```

## Theme Components

### ThemeToggle

```jsx
import { ThemeToggle } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'button' \| 'icon' \| 'switch'` | `'button'` | Visual style of the toggle |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the toggle |
| className | `string` | - | Additional CSS classes |

### useChangeTheme Hook

```jsx
import { useChangeTheme } from '@saeedkolivand/react-ui-toolkit';
```

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| isDarkMode | `boolean` | Whether dark mode is currently active |
| toggleTheme | `() => void` | Function to toggle between light and dark themes |
| setTheme | `(theme: 'light' \| 'dark' \| 'system') => void` | Function to explicitly set the theme |
| currentTheme | `'light' \| 'dark' \| 'system'` | The currently active theme setting |

### ThemeProvider

```jsx
import { ThemeProvider } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | Child components to be wrapped by the provider |
| defaultTheme | `'light' \| 'dark' \| 'system'` | `'system'` | Default theme to use |
| storageKey | `string` | `'theme'` | Key to use for localStorage |

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| dataSource | `T[]` | - | Data record array to be displayed |
| columns | `ColumnType<T>[]` | - | Columns of the table |
| rowKey | `keyof T` | - | Row key, must be unique for each record |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | Size of the table |
| bordered | `boolean` | `false` | Whether to show all table borders |
| loading | `boolean` | `false` | Loading state of the table |
| pagination | `TablePagination \| false` | - | Config of pagination or false to disable |
| scroll | `{ x?: number \| string, y?: number \| string }` | - | Config of table's scrollable area |
| onChange | `(params: { sorter?, pagination? }) => void` | - | Callback when pagination or sorting changed |

**Column Type**

The Table component uses a column configuration array with the following properties:

```typescript
interface ColumnType<T> {
  title: React.ReactNode;
  dataIndex: keyof T;
  key: string;
  render?: (text: any, record: T) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  width?: number | string;
  defaultSortOrder?: 'ascend' | 'descend' | null;
}
```

### Tag

```jsx
import { Tag } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | Content of the tag (required) |
| variant | `'default' \| 'outline' \| 'solid'` | `'default'` | Style variant of the tag |
| color | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color theme of the tag |
| closable | `boolean` | `false` | Whether the tag can be closed/removed |
| onClose | `() => void` | - | Callback executed when tag is closed |
| className | `string` | - | Additional CSS class for custom styling |

### Avatar

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | `string` | - | The source URL of the avatar image |
| alt | `string` | `''` | Alt text for the avatar image |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the avatar |
| status | `'online' \| 'offline' \| 'away' \| 'busy'` | - | Status indicator shown on the avatar |
| initials | `string` | - | Initials to display when no image is available |
| squared | `boolean` | `false` | Whether the avatar should be squared instead of rounded |
| bordered | `boolean` | `false` | Whether to show a border around the avatar |
| className | `string` | - | Additional CSS class for custom styling |

### Alert

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | The variant/style of the alert |
| dismissible | `boolean` | `false` | Whether the alert can be dismissed/closed |
| onDismiss | `() => void` | - | Callback executed when alert is dismissed |
| title | `string` | - | Optional title text for the alert |
| showIcon | `boolean` | `true` | Whether to show the variant icon |
| children | `React.ReactNode` | - | The content of the alert |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Alert component accepts all standard HTML div attributes.

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

## Documentation

For more comprehensive documentation and live examples, visit the [Storybook documentation site](https://saeedkolivand.github.io/react-ui-toolkit).

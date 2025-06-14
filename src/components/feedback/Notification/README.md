# Notification Component

A customizable notification component that displays temporary messages with different styles based on type (success, error, warning, info).

## Features

- Four notification types with distinct styling: success, error, warning, and info
- Auto-dismiss with configurable duration
- Smooth animations for entrance and exit
- Support for message title and optional description
- Close button for manual dismissal
- Theme-aware styling (light/dark mode support)
- Customizable through class names

## Basic Usage

```jsx
import { Notification } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <Notification 
      type="success"
      message="Operation successful!"
      description="Your changes have been saved."
    />
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | The type of notification which affects styling |
| message | `string` | - | The main message to display (required) |
| description | `string` | - | Optional secondary text with additional details |
| duration | `number` | `4500` | Time in milliseconds before auto-dismissal (set to 0 to disable) |
| onClose | `() => void` | - | Callback function triggered when notification closes |
| className | `string` | - | Additional CSS class for custom styling |

## Examples

### Success Notification

```jsx
<Notification
  type="success"
  message="Profile updated"
  description="Your profile information has been successfully updated."
/>
```

### Error Notification

```jsx
<Notification
  type="error"
  message="Connection failed"
  description="Could not connect to the server. Please try again later."
  duration={6000}
/>
```

### Warning with Custom Duration

```jsx
<Notification
  type="warning"
  message="Session expiring soon"
  description="Your session will expire in 5 minutes."
  duration={10000}
/>
```

### Info with Close Handler

```jsx
<Notification
  type="info"
  message="New features available"
  description="Check out the latest features in your settings."
  onClose={() => console.log('Notification closed')}
/>
```

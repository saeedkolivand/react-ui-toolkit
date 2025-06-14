# Notification Component
# Notification Component

A customizable notification component that displays temporary messages with different styles based on type (success, error, warning, info).

## Features

- Four notification types with distinct styling: success, error, warning, and info
- Auto-dismiss with configurable duration
- Smooth animations for entrance and exit
- Support for message title and optional description
- Dark mode support
- Custom close handler

## Basic Usage

```jsx
import { Notification } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div>
      <Notification 
        type="success"
        message="Profile Updated"
        description="Your profile information has been successfully updated."
      />
    </div>
  );
}
```

## Programmatic Usage

Typically, notifications are triggered programmatically in response to user actions or events:

```jsx
import { useNotification } from '@saeedkolivand/react-ui-toolkit';

function ProfileForm() {
  const notification = useNotification();

  const handleSubmit = async (formData) => {
    try {
      await updateProfile(formData);
      notification.success({
        message: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
        duration: 5000
      });
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: error.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>{
      /* Form fields */}
    </form>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'success' \| 'error' \| 'info' \| 'warning'` | `'info'` | The type of notification which affects styling |
| message | `string` | - | The main message to display (required) |
| description | `string` | - | Optional secondary text with additional details |
| duration | `number` | `4500` | Time in milliseconds before auto-dismissal (0 to never auto-dismiss) |
| onClose | `() => void` | - | Callback function triggered when notification closes |
| className | `string` | - | Additional CSS class for custom styling |

### useNotification Hook

The library provides a `useNotification` hook that returns an object with methods for showing different types of notifications:

```jsx
const notification = useNotification();

// Show different notification types
notification.info({ message, description, duration, onClose });
notification.success({ message, description, duration, onClose });
notification.warning({ message, description, duration, onClose });
notification.error({ message, description, duration, onClose });

// Manually close all open notifications
notification.destroy();
```

## Examples

### Different Notification Types

```jsx
import { Button, Notification } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function NotificationDemo() {
  const [notifications, setNotifications] = useState([]);
  const showNotification = (type) => {
    const id = Date.now();
    const newNotification = {
      id,
      type,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      description: `This is a ${type} notification with a description.`,
      onClose: () => {
        setNotifications(prev => prev.filter(item => item.id !== id));
      }
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  return (
    <div>
      <div className="space-x-2 mb-4">
        <Button onClick={() => showNotification('info')}>Info</Button>
        <Button onClick={() => showNotification('success')}>Success</Button>
        <Button onClick={() => showNotification('warning')}>Warning</Button>
        <Button onClick={() => showNotification('error')}>Error</Button>
      </div>

      <div className="fixed top-4 right-4 space-y-2">
        {notifications.map(notification => (
          <Notification key={notification.id} {...notification} />
        ))}
      </div>
    </div>
  );
}
```

### Custom Duration

```jsx
import { Button, Notification } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function CustomDurationNotification() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Button onClick={() => setShow(true)}>
        Show Long Duration Notification
      </Button>

      {show && (
        <Notification
          type="info"
          message="Long Notification"
          description="This notification will stay visible for 10 seconds."
          duration={10000}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
```

### With Custom Styling

```jsx
import { Button, Notification } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function CustomStyledNotification() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Button onClick={() => setShow(true)}>
        Show Custom Styled Notification
      </Button>

      {show && (
        <Notification
          type="success"
          message="Custom Styled"
          description="This notification has custom styling applied."
          className="border-l-4 border-purple-500 shadow-lg"
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
```

### Notification Stack

```jsx
import { Button, useNotification } from '@saeedkolivand/react-ui-toolkit';

function NotificationStack() {
  const notification = useNotification();

  const showStack = () => {
    notification.info({
      message: 'Process Started',
      description: 'Your request is being processed.'
    });

    setTimeout(() => {
      notification.warning({
        message: 'Processing',
        description: 'This may take a few moments.'
      });
    }, 1000);

    setTimeout(() => {
      notification.success({
        message: 'Process Complete',
        description: 'Your request has been successfully processed.'
      });
    }, 2000);
  };

  return (
    <Button onClick={showStack}>
      Show Notification Stack
    </Button>
  );
}
```

### Confirmation Notification

```jsx
import { Button, Notification } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function ConfirmationNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [count, setCount] = useState(3);

  const startCountdown = () => {
    setCount(3);
    setShowNotification(true);

    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  return (
    <div>
      <Button onClick={startCountdown}>
        Delete Item
      </Button>

      {showNotification && (
        <Notification
          type="warning"
          message="Item will be deleted"
          description={count > 0 ? `Auto-deleting in ${count} seconds...` : "Deleted!"}
          duration={4000}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}
```
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

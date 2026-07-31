# Alert Component

## Usage

The Alert component provides a way to display important messages to users.

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Alert 
      type="info"
      title="Information"
      description="This is an informational alert message."
    />
  );
}
```

## Features

- Multiple alert types (info, success, warning, error)
- Optional title and description
- Dismissible alerts
- Custom icon support
- Animated appearance and dismissal

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Type of the alert which determines its color and icon |
| title | `string \| ReactNode` | - | Title text for the alert |
| description | `string \| ReactNode` | - | Description text for the alert |
| dismissible | `boolean` | `false` | Whether the alert can be dismissed |
| onDismiss | `() => void` | - | Function called when the alert is dismissed |
| icon | `ReactNode` | - | Custom icon to override the default icon |
| className | `string` | - | Additional CSS classes for the alert |
| autoClose | `boolean \| number` | `false` | Automatically close after specified milliseconds, or don't close if false |

## Examples

### Alert Types

```jsx
<Alert type="info" description="This is an informational message." />
<Alert type="success" description="Operation completed successfully!" />
<Alert type="warning" description="Proceed with caution." />
<Alert type="error" description="An error occurred." />
```

### With Title and Description

```jsx
<Alert
  type="success"
  title="Payment Successful"
  description="Your payment has been processed successfully. You will receive a confirmation email shortly."
/>
```

### Dismissible Alert

```jsx
<Alert
  type="info"
  title="New Feature"
  description="We've added a new feature you might be interested in."
  dismissible
  onDismiss={() => console.log('Alert dismissed')}
/>
```

### Auto-closing Alert

```jsx
<Alert
  type="success"
  description="This alert will automatically close after 5 seconds."
  autoClose={5000}
/>
```

### Custom Icon

```jsx
<Alert
  type="info"
  title="Custom Icon"
  description="This alert has a custom icon."
  icon={<CustomIcon />}
/>
```

### Alert with Actions
# Alert Component

A flexible alert component for displaying feedback messages, notifications, and status updates. Alerts come in different variants and can include icons, titles, and dismissal buttons.

## Features

- Four contextual variants: info, success, warning, error
- Optional title for more prominent messaging
- Automatic icons based on variant
- Optional dismiss button with callback
- Dark mode support
- Accessible design with proper ARIA attributes
- Fully customizable with additional classNames

## Basic Usage

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div className="space-y-4">
      <Alert>This is a default info alert</Alert>

      <Alert variant="success">
        Your profile has been updated successfully.
      </Alert>

      <Alert variant="warning">
        Your subscription will expire in 3 days.
      </Alert>

      <Alert variant="error">
        There was an error processing your request.
      </Alert>
    </div>
  );
}
```

## API Reference

### Props

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

## Examples

### With Title

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';

function AlertWithTitle() {
  return (
    <Alert 
      variant="success"
      title="Success!"
    >
      Your changes have been saved successfully.
    </Alert>
  );
}
```

### Dismissible Alert

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function DismissibleAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert 
      variant="info"
      dismissible
      onDismiss={() => setVisible(false)}
    >
      This alert can be dismissed by clicking the X button.
    </Alert>
  );
}
```

### Without Icon

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';

function AlertWithoutIcon() {
  return (
    <Alert 
      variant="warning"
      showIcon={false}
    >
      This alert appears without an icon.
    </Alert>
  );
}
```

### Using with Forms

```jsx
import { Alert, Input, Button } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function FormWithAlert() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation logic
    if (!e.target.email.value) {
      setError('Please enter your email address');
      setSuccess('');
    } else {
      setSuccess('Form submitted successfully!');
      setError('');
      // Form submission logic
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert 
          variant="error"
          dismissible
          onDismiss={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          variant="success"
          dismissible
          onDismiss={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input 
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
          />

          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
```

### Custom Styling

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledAlert() {
  return (
    <Alert 
      variant="info"
      className="shadow-md border-l-4 border-l-blue-500"
    >
      This alert has custom styling applied via className.
    </Alert>
  );
}
```

### Multiple Alerts Stack

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';

function AlertStack() {
  return (
    <div className="space-y-2">
      <Alert variant="info" title="Information">
        Your account was last accessed on June 12, 2025.
      </Alert>

      <Alert variant="success" title="Success">
        Your profile has been updated successfully.
      </Alert>

      <Alert variant="warning" title="Warning">
        Your subscription will expire in 3 days.
      </Alert>

      <Alert variant="error" title="Error">
        There was an error processing your payment method.
      </Alert>
    </div>
  );
}
```
```jsx
<Alert
  type="warning"
  title="Account Verification Required"
  description={
    <div>
      <p>Please verify your account to continue using all features.</p>
      <Button size="sm" className="mt-2" variant="warning">
        Verify Now
      </Button>
    </div>
  }
  dismissible
/>
```

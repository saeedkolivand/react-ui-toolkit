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

# Feedback Components

The feedback components in this library provide visual cues and informational elements to communicate with users. These components are essential for creating responsive and interactive user interfaces.

## Components in this Category

### Alert

A flexible alert component for displaying feedback messages, notifications, and status updates.

[View Alert Documentation](./Alert/README.md)

```jsx
import { Alert } from '@saeedkolivand/react-ui-toolkit';

<Alert variant="success" title="Success!">Your changes have been saved successfully.</Alert>
```

### Badge

A lightweight badge component for highlighting information, status, or counts.

[View Badge Documentation](./Badge/README.md)

```jsx
import { Badge } from '@saeedkolivand/react-ui-toolkit';

<Badge variant="primary">New</Badge>
<Badge variant="error" rounded>42</Badge>
```

### Notification

A customizable notification component that displays temporary messages with different styles.

[View Notification Documentation](./Notification/README.md)

```jsx
import { useNotification } from '@saeedkolivand/react-ui-toolkit';

const notification = useNotification();
notification.success({
  message: 'Profile Updated',
  description: 'Your profile information has been successfully updated.'
});
```

### Progress

A flexible progress bar component for displaying completion status and loading states.

[View Progress Documentation](./Progress/README.md)

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

<Progress value={75} variant="success" striped animated />
```

### Spinner

A simple and customizable loading spinner component that provides visual feedback for loading states.

[View Spinner Documentation](./Spinner/README.md)

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';

<Spinner variant="primary" size="lg" />
```

## Common Features

All feedback components share these common features:

- Multiple variants for different contexts (primary, success, warning, error, etc.)
- Multiple size options for different usage scenarios
- Dark mode support
- Accessibility features including proper ARIA attributes
- Customizable through additional classNames
- Consistent design language across all components

## Best Practices

1. **Choose the right component for the message importance**:
   - Use Alerts for important page-level messages
   - Use Notifications for temporary, non-critical information
   - Use Badges for status indicators or counts

2. **Use appropriate variants**:
   - Success (green): Positive outcomes, completed actions
   - Warning (yellow): Potential issues, important notes
   - Error (red): Problems, failed actions, critical information
   - Info (blue): Neutral information, tips, general updates

3. **Consider placement**:
   - Place alerts at the top of forms or sections they relate to
   - Show notifications in a consistent location (typically top-right)
   - Use progress indicators directly in the context of the operation
   - Place spinners directly in the loading element

4. **Provide clear messages**:
   - Write concise, specific messages
   - For errors, explain what happened and how to fix it
   - For success messages, confirm what action was completed

## Accessibility Considerations

- All components include appropriate ARIA roles and attributes
- Color is never used as the only means of conveying information
- Notifications are automatically announced to screen readers
- Loading indicators (Progress, Spinner) communicate status appropriately

## Documentation

Each component has its own detailed README file with:

- Feature overview
- Basic usage examples
- API reference
- Advanced examples

For more comprehensive documentation and live examples, visit the [Storybook documentation site](https://saeedkolivand.github.io/react-ui-toolkit).

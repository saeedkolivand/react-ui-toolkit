# Avatar Component

A versatile avatar component for displaying user profile images, initials, or a fallback icon. Supports various sizes, shapes, and status indicators.

## Features

- Multiple size options: xs, sm, md, lg, xl
- Optional status indicator: online, offline, away, busy
- Support for images or initials
- Square or rounded variants
- Optional border styling
- Fallback user icon when no image or initials are provided
- Fully customizable with additional classNames
- Built with Tailwind CSS

## Basic Usage

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function UserProfile() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar 
        src="https://example.com/avatar.jpg" 
        alt="User Name" 
        size="md" 
        status="online" 
      />
      <div>
        <h3 className="font-medium">John Doe</h3>
        <p className="text-sm text-gray-500">Product Designer</p>
      </div>
    </div>
  );
}
```

## API Reference

### Props

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

## Examples

### Different Sizes

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function AvatarSizes() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar src="https://example.com/avatar.jpg" size="xs" />
      <Avatar src="https://example.com/avatar.jpg" size="sm" />
      <Avatar src="https://example.com/avatar.jpg" size="md" />
      <Avatar src="https://example.com/avatar.jpg" size="lg" />
      <Avatar src="https://example.com/avatar.jpg" size="xl" />
    </div>
  );
}
```

### With Status Indicators

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function StatusAvatars() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar src="https://example.com/user1.jpg" status="online" />
      <Avatar src="https://example.com/user2.jpg" status="offline" />
      <Avatar src="https://example.com/user3.jpg" status="away" />
      <Avatar src="https://example.com/user4.jpg" status="busy" />
    </div>
  );
}
```

### Using Initials

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function InitialsAvatars() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar initials="John Doe" />
      <Avatar initials="Jane Smith" size="lg" />
      <Avatar initials="Alex Johnson" status="online" />
    </div>
  );
}
```

### Squared Avatars

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function SquaredAvatars() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar src="https://example.com/avatar.jpg" squared />
      <Avatar initials="John Doe" squared />
      <Avatar squared /> {/* Fallback icon */}
    </div>
  );
}
```

### With Border

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function BorderedAvatars() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar src="https://example.com/avatar.jpg" bordered />
      <Avatar initials="John Doe" bordered />
      <Avatar squared bordered /> {/* Fallback icon with border */}
    </div>
  );
}
```

### Avatar Group

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function AvatarGroup() {
  return (
    <div className="flex -space-x-2">
      <Avatar src="https://example.com/user1.jpg" bordered />
      <Avatar src="https://example.com/user2.jpg" bordered />
      <Avatar src="https://example.com/user3.jpg" bordered />
      <Avatar initials="+5" bordered className="bg-gray-300" />
    </div>
  );
}
```

### Custom Styling

```jsx
import { Avatar } from '@saeedkolivand/react-ui-toolkit';

function CustomAvatars() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar 
        src="https://example.com/avatar.jpg" 
        className="ring-2 ring-primary-500 shadow-lg"
      />
      <Avatar 
        initials="VIP" 
        className="bg-primary-100 text-primary-800"
      />
    </div>
  );
}
```

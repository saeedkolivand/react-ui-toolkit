# Tabs Component

The Tabs component provides a way to organize and navigate between related sections of content, displaying one section at a time. It offers multiple style variants and orientations to suit different design needs.

## Features

- Multiple style variants (line, enclosed, soft-rounded, solid-rounded)
- Horizontal or vertical orientation
- Support for disabled tabs
- Controlled or uncontrolled usage
- Custom styling options
- Accessibility features built-in

## Basic Usage

```jsx
import { Tabs } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  const tabs = [
    {
      label: 'Tab 1',
      content: <p>Content for Tab 1</p>
    },
    {
      label: 'Tab 2',
      content: <p>Content for Tab 2</p>
    },
    {
      label: 'Disabled Tab',
      content: <p>This tab is disabled</p>,
      disabled: true
    }
  ];

  return <Tabs tabs={tabs} />;
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | `TabItem[]` | - | Array of tab items to display |
| defaultActiveTab | `number` | `0` | Index of the initially active tab |
| orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation of the tabs |
| variant | `'line' \| 'enclosed' \| 'soft-rounded' \| 'solid-rounded'` | `'line'` | Visual style variant |
| isFitted | `boolean` | `false` | Whether tabs should take up equal width |
| className | `string` | - | Additional CSS class for custom styling |
| onTabChange | `(index: number) => void` | - | Callback function when a tab is selected |

### TabItem Interface

```typescript
interface TabItem {
  label: React.ReactNode;    // The label of the tab
  content: React.ReactNode;  // The content of the tab panel
  disabled?: boolean;        // Whether the tab is disabled
}
```

## Examples

### Different Tab Variants

```jsx
import { Tabs } from '@saeedkolivand/react-ui-toolkit';

function TabVariants() {
  const tabs = [
    {
      label: 'Tab 1',
      content: <div className="p-4">Content for Tab 1</div>
    },
    {
      label: 'Tab 2',
      content: <div className="p-4">Content for Tab 2</div>
    },
    {
      label: 'Tab 3',
      content: <div className="p-4">Content for Tab 3</div>
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4">Line Variant (Default)</h3>
        <Tabs tabs={tabs} variant="line" />
      </div>

      <div>
        <h3 className="mb-4">Enclosed Variant</h3>
        <Tabs tabs={tabs} variant="enclosed" />
      </div>

      <div>
        <h3 className="mb-4">Soft Rounded Variant</h3>
        <Tabs tabs={tabs} variant="soft-rounded" />
      </div>

      <div>
        <h3 className="mb-4">Solid Rounded Variant</h3>
        <Tabs tabs={tabs} variant="solid-rounded" />
      </div>
    </div>
  );
}
```

### Vertical Tabs

```jsx
import { Tabs } from '@saeedkolivand/react-ui-toolkit';

function VerticalTabs() {
  const tabs = [
    {
      label: 'Account',
      content: <div className="p-4">
        <h3 className="text-lg font-medium mb-2">Account Settings</h3>
        <p>Manage your account settings and preferences.</p>
      </div>
    },
    {
      label: 'Password',
      content: <div className="p-4">
        <h3 className="text-lg font-medium mb-2">Password Settings</h3>
        <p>Update your password and security preferences.</p>
      </div>
    },
    {
      label: 'Notifications',
      content: <div className="p-4">
        <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
        <p>Manage your notification preferences.</p>
      </div>
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs 
        tabs={tabs} 
        orientation="vertical" 
        variant="line"
      />
    </div>
  );
}
```

### Fitted Tabs

```jsx
import { Tabs } from '@saeedkolivand/react-ui-toolkit';

function FittedTabs() {
  const tabs = [
    {
      label: 'Day 1',
      content: <div className="p-4">Schedule for Day 1</div>
    },
    {
      label: 'Day 2',
      content: <div className="p-4">Schedule for Day 2</div>
    },
    {
      label: 'Day 3',
      content: <div className="p-4">Schedule for Day 3</div>
    },
    {
      label: 'Day 4',
      content: <div className="p-4">Schedule for Day 4</div>
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs 
        tabs={tabs} 
        isFitted={true}
        variant="enclosed"
      />
    </div>
  );
}
```

### With Icons in Tab Labels

```jsx
import { Tabs, Icon } from '@saeedkolivand/react-ui-toolkit';

function IconTabs() {
  const tabs = [
    {
      label: (
        <div className="flex items-center space-x-2">
          <Icon name="home" />
          <span>Home</span>
        </div>
      ),
      content: <div className="p-4">Home content</div>
    },
    {
      label: (
        <div className="flex items-center space-x-2">
          <Icon name="settings" />
          <span>Settings</span>
        </div>
      ),
      content: <div className="p-4">Settings content</div>
    },
    {
      label: (
        <div className="flex items-center space-x-2">
          <Icon name="user" />
          <span>Profile</span>
        </div>
      ),
      content: <div className="p-4">Profile content</div>
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs tabs={tabs} variant="soft-rounded" />
    </div>
  );
}
```

### Handling Tab Changes

```jsx
import { useState } from 'react';
import { Tabs, Alert } from '@saeedkolivand/react-ui-toolkit';

function TabsWithChangeHandler() {
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState('Currently viewing tab 1');

  const tabs = [
    {
      label: 'Tab 1',
      content: <div className="p-4">Content for Tab 1</div>
    },
    {
      label: 'Tab 2',
      content: <div className="p-4">Content for Tab 2</div>
    },
    {
      label: 'Tab 3',
      content: <div className="p-4">Content for Tab 3</div>
    }
  ];

  const handleTabChange = (index) => {
    setActiveTab(index);
    setMessage(`Currently viewing tab ${index + 1}`);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Alert variant="info">{message}</Alert>

      <Tabs 
        tabs={tabs} 
        defaultActiveTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="mt-4">
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded"
          onClick={() => handleTabChange(0)}
        >
          Go to Tab 1
        </button>
      </div>
    </div>
  );
}
```

### Custom Styled Tabs

```jsx
import { Tabs } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledTabs() {
  const tabs = [
    {
      label: 'Tab 1',
      content: <div className="p-4">Content for Tab 1</div>
    },
    {
      label: 'Tab 2',
      content: <div className="p-4">Content for Tab 2</div>
    },
    {
      label: 'Tab 3',
      content: <div className="p-4">Content for Tab 3</div>
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs 
        tabs={tabs} 
        className="bg-gray-50 p-4 rounded-lg shadow-sm" 
        variant="enclosed"
      />
    </div>
  );
}
```

# Dropdown Component

The Dropdown component provides a way to display a list of actions or navigation options in a contextual overlay. It can be triggered by hover or click and supports various placement options and styling customizations.

## Features

- Hover or click trigger modes
- Multiple placement options (top, bottom, left, right)
- Customizable dropdown menu
- Animation effects
- Automatic positioning
- Support for disabled state

## Basic Usage

```jsx
import { Dropdown, Menu } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <Dropdown
      trigger="click"
      overlay={
        <Menu>
          <Menu.Item key="item1" onClick={() => console.log('Item 1 clicked')}>
            Item 1
          </Menu.Item>
          <Menu.Item key="item2" onClick={() => console.log('Item 2 clicked')}>
            Item 2
          </Menu.Item>
          <Menu.Item key="item3" disabled>
            Item 3 (Disabled)
          </Menu.Item>
        </Menu>
      }
    >
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Click me
      </button>
    </Dropdown>
  );
}
```

## API Reference

### Dropdown Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | The trigger element (required) |
| overlay | `React.ReactNode` | - | The dropdown content (required) |
| trigger | `'hover' \| 'click'` | `'hover'` | How the dropdown is triggered |
| placement | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Where the dropdown appears relative to the trigger |
| disabled | `boolean` | `false` | Whether the dropdown is disabled |
| className | `string` | - | Additional CSS class for the dropdown container |
| overlayClassName | `string` | - | Additional CSS class for the dropdown content |

### Menu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | The menu items (required) |
| className | `string` | - | Additional CSS class for the menu |

### Menu.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| key | `string` | - | Unique identifier for the menu item (required) |
| children | `React.ReactNode` | - | The content of the menu item (required) |
| disabled | `boolean` | `false` | Whether the menu item is disabled |
| danger | `boolean` | `false` | Whether to show the menu item in a danger state |
| className | `string` | - | Additional CSS class for the menu item |
| onClick | `() => void` | - | Callback when the menu item is clicked |

## Examples

### Dropdown with Different Triggers

```jsx
import { Dropdown, Menu, Button } from '@saeedkolivand/react-ui-toolkit';

function DropdownTriggers() {
  return (
    <div className="space-x-4">
      <Dropdown
        trigger="hover"
        overlay={
          <Menu>
            <Menu.Item key="item1" onClick={() => console.log('Hover item 1')}>Option 1</Menu.Item>
            <Menu.Item key="item2" onClick={() => console.log('Hover item 2')}>Option 2</Menu.Item>
            <Menu.Item key="item3" onClick={() => console.log('Hover item 3')}>Option 3</Menu.Item>
          </Menu>
        }
      >
        <Button>Hover Me</Button>
      </Dropdown>

      <Dropdown
        trigger="click"
        overlay={
          <Menu>
            <Menu.Item key="item1" onClick={() => console.log('Click item 1')}>Option 1</Menu.Item>
            <Menu.Item key="item2" onClick={() => console.log('Click item 2')}>Option 2</Menu.Item>
            <Menu.Item key="item3" onClick={() => console.log('Click item 3')}>Option 3</Menu.Item>
          </Menu>
        }
      >
        <Button>Click Me</Button>
      </Dropdown>
    </div>
  );
}
```

### Dropdown with Different Placements

```jsx
import { Dropdown, Menu, Button } from '@saeedkolivand/react-ui-toolkit';

function DropdownPlacements() {
  const menu = (
    <Menu>
      <Menu.Item key="item1">Option 1</Menu.Item>
      <Menu.Item key="item2">Option 2</Menu.Item>
      <Menu.Item key="item3">Option 3</Menu.Item>
    </Menu>
  );

  return (
    <div className="grid grid-cols-2 gap-4 max-w-sm">
      <Dropdown placement="top" overlay={menu}>
        <Button>Top</Button>
      </Dropdown>

      <Dropdown placement="bottom" overlay={menu}>
        <Button>Bottom</Button>
      </Dropdown>

      <Dropdown placement="left" overlay={menu}>
        <Button>Left</Button>
      </Dropdown>

      <Dropdown placement="right" overlay={menu}>
        <Button>Right</Button>
      </Dropdown>
    </div>
  );
}
```

### Menu with Different Item States

```jsx
import { Dropdown, Menu, Button, Icon } from '@saeedkolivand/react-ui-toolkit';

function DropdownItemStates() {
  return (
    <Dropdown
      trigger="click"
      overlay={
        <Menu>
          <Menu.Item key="item1" onClick={() => console.log('Normal item clicked')}>
            <span className="flex items-center">
              <Icon name="check" className="mr-2" /> Normal Item
            </span>
          </Menu.Item>

          <Menu.Item key="item2" disabled>
            <span className="flex items-center">
              <Icon name="block" className="mr-2" /> Disabled Item
            </span>
          </Menu.Item>

          <Menu.Item key="item3" danger onClick={() => console.log('Danger item clicked')}>
            <span className="flex items-center">
              <Icon name="trash" className="mr-2" /> Danger Item
            </span>
          </Menu.Item>
        </Menu>
      }
    >
      <Button>Item States</Button>
    </Dropdown>
  );
}
```

### User Profile Dropdown

```jsx
import { Dropdown, Menu, Icon, Avatar } from '@saeedkolivand/react-ui-toolkit';

function UserProfileDropdown() {
  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <div className="flex justify-end">
      <Dropdown
        trigger="click"
        overlay={
          <Menu>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">jane.doe@example.com</p>
            </div>

            <Menu.Item key="profile" onClick={() => console.log('Profile clicked')}>
              <span className="flex items-center">
                <Icon name="user" className="mr-2" /> Profile
              </span>
            </Menu.Item>

            <Menu.Item key="settings" onClick={() => console.log('Settings clicked')}>
              <span className="flex items-center">
                <Icon name="settings" className="mr-2" /> Settings
              </span>
            </Menu.Item>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            <Menu.Item key="logout" onClick={handleLogout}>
              <span className="flex items-center">
                <Icon name="logout" className="mr-2" /> Logout
              </span>
            </Menu.Item>
          </Menu>
        }
      >
        <button className="flex items-center space-x-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
          <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" size="sm" />
          <Icon name="chevron-down" size="sm" />
        </button>
      </Dropdown>
    </div>
  );
}
```

### Action Menu Dropdown

```jsx
import { Dropdown, Menu, Button, Icon } from '@saeedkolivand/react-ui-toolkit';

function ActionMenuDropdown() {
  return (
    <div className="flex justify-end">
      <Dropdown
        trigger="click"
        overlay={
          <Menu>
            <Menu.Item key="edit" onClick={() => console.log('Edit clicked')}>
              <span className="flex items-center">
                <Icon name="edit" className="mr-2" /> Edit
              </span>
            </Menu.Item>

            <Menu.Item key="duplicate" onClick={() => console.log('Duplicate clicked')}>
              <span className="flex items-center">
                <Icon name="copy" className="mr-2" /> Duplicate
              </span>
            </Menu.Item>

            <Menu.Item key="archive" onClick={() => console.log('Archive clicked')}>
              <span className="flex items-center">
                <Icon name="archive" className="mr-2" /> Archive
              </span>
            </Menu.Item>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            <Menu.Item key="delete" danger onClick={() => console.log('Delete clicked')}>
              <span className="flex items-center">
                <Icon name="trash" className="mr-2" /> Delete
              </span>
            </Menu.Item>
          </Menu>
        }
      >
        <Button variant="ghost" size="sm">
          <Icon name="more-vertical" />
        </Button>
      </Dropdown>
    </div>
  );
}
```

### Custom Styled Dropdown

```jsx
import { Dropdown, Menu, Button } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledDropdown() {
  return (
    <Dropdown
      trigger="click"
      overlayClassName="border-t-2 border-primary-500 rounded-t-none shadow-lg"
      overlay={
        <Menu className="bg-gradient-to-b from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800">
          <div className="px-4 py-2 text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase">
            Custom Menu
          </div>

          <Menu.Item 
            key="item1" 
            className="hover:bg-primary-100 dark:hover:bg-primary-900/30"
            onClick={() => console.log('Item 1 clicked')}
          >
            Option 1
          </Menu.Item>

          <Menu.Item 
            key="item2" 
            className="hover:bg-primary-100 dark:hover:bg-primary-900/30"
            onClick={() => console.log('Item 2 clicked')}
          >
            Option 2
          </Menu.Item>

          <Menu.Item 
            key="item3" 
            className="hover:bg-primary-100 dark:hover:bg-primary-900/30"
            onClick={() => console.log('Item 3 clicked')}
          >
            Option 3
          </Menu.Item>
        </Menu>
      }
    >
      <Button variant="primary">
        Custom Dropdown
      </Button>
    </Dropdown>
  );
}
```

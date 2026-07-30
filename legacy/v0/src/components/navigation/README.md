# Navigation Components

Navigation components help users move between different sections of an application or interact with content in structured ways. These components are designed to provide intuitive user experiences for navigating content, opening dialogs, revealing menus, and organizing information.

## Components in this Category

### Accordion

A component that displays collapsible content panels for presenting information in a limited amount of space.

[View Accordion Documentation](./Accordion/README.md)

```jsx
import { Accordion } from '@saeedkolivand/react-ui-toolkit';

<Accordion
  items={[
    { title: 'Section 1', content: <p>Content for section 1</p> },
    { title: 'Section 2', content: <p>Content for section 2</p> }
  ]}
/>
```

### Drawer

A panel that slides in from the edge of the screen, typically used for navigation menus or additional content.

[View Drawer Documentation](./Drawer/README.md)

```jsx
import { Drawer, Button } from '@saeedkolivand/react-ui-toolkit';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">Drawer Content</div>
      </Drawer>
    </>
  );
}
```

### Dropdown

A toggleable menu that allows the user to choose a value from a predefined list.

[View Dropdown Documentation](./Dropdown/README.md)

```jsx
import { Dropdown, Menu } from '@saeedkolivand/react-ui-toolkit';

<Dropdown
  overlay={
    <Menu>
      <Menu.Item key="item1">Option 1</Menu.Item>
      <Menu.Item key="item2">Option 2</Menu.Item>
    </Menu>
  }
>
  <button>Click me</button>
</Dropdown>
```

### Modal

A dialog box/popup window that is displayed on top of the current page.

[View Modal Documentation](./Modal/README.md)

```jsx
import { Modal, Button } from '@saeedkolivand/react-ui-toolkit';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">Modal Content</div>
      </Modal>
    </>
  );
}
```

### Tabs

Allows a user to switch between different views within the same context.

[View Tabs Documentation](./Tabs/README.md)

```jsx
import { Tabs } from '@saeedkolivand/react-ui-toolkit';

<Tabs
  tabs={[
    { label: 'Tab 1', content: <p>Content for Tab 1</p> },
    { label: 'Tab 2', content: <p>Content for Tab 2</p> }
  ]}
/>
```

## Features Across Navigation Components

- **Accessibility**: All navigation components are built with accessibility in mind, including keyboard navigation, proper ARIA attributes, and focus management.

- **Animation**: Smooth transitions and animations enhance the user experience when navigating between different states.

- **Responsive Design**: Components adapt to different screen sizes, providing appropriate behaviors for both desktop and mobile users.

- **Dark Mode Support**: All components support light and dark mode themes out of the box.

- **Customization**: Each component offers extensive styling options to match your application's design language.

## Common Usage Patterns

### Navigation Hierarchy

- **Tabs**: For top-level navigation between equal sections
- **Accordion**: For hierarchical content that can be expanded/collapsed
- **Drawer**: For main application navigation, especially on mobile

### Content Display

- **Modal**: For important information that requires user attention
- **Drawer**: For supplementary information or tools
- **Dropdown**: For selecting from a list of options

### Combining Components

Navigational components can be combined to create more complex interfaces:

```jsx
import { Tabs, Accordion, Button, Modal } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function ComplexNavigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabContent = [
    {
      label: 'Details',
      content: (
        <Accordion
          items={[
            { title: 'Basic Info', content: <p>Basic information content...</p> },
            { title: 'Advanced Info', content: <p>Advanced information content...</p> }
          ]}
        />
      )
    },
    {
      label: 'Settings',
      content: (
        <div className="p-4">
          <h3 className="mb-4">Settings</h3>
          <Button onClick={() => setIsModalOpen(true)}>Advanced Settings</Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 border rounded">
      <Tabs tabs={tabContent} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Advanced Settings</h2>
          <p>Configure advanced settings here...</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

## Best Practices

1. **Consistency**: Use navigation components consistently throughout your application to create a predictable experience.

2. **Progressive Disclosure**: Use components like Accordion and Tabs to reveal information progressively, rather than overwhelming users with all content at once.

3. **Clear Labeling**: Ensure that all navigational elements have clear, descriptive labels that help users understand where they will be taken.

4. **Feedback**: Provide visual feedback when users interact with navigation components, such as hover states, active indicators, and transitions.

5. **Keyboard Navigation**: Test and ensure that all navigation components can be used with keyboard-only navigation for accessibility.

6. **Mobile Considerations**: Adjust navigation patterns for mobile users, potentially using Drawers instead of Dropdowns, or collapsing Tabs into more mobile-friendly interfaces.

7. **Performance**: Be mindful of performance, especially when using multiple nested navigation components that might affect page load times and interactivity.

## Documentation

For more comprehensive documentation and live examples, visit the [Storybook documentation site](https://saeedkolivand.github.io/react-ui-toolkit).

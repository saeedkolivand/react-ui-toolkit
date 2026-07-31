# Modal Component

The Modal component provides a way to display content that requires user attention or interaction in a focused overlay, interrupting the user's current task. It offers various size options and animation effects using Framer Motion.

## Features

- Multiple size options (sm, md, lg, xl, full)
- Smooth animations with Framer Motion
- Backdrop overlay with click-to-close option
- Keyboard navigation (ESC to close)
- Vertical centering option
- Close button toggle
- Automatic body scroll locking when open

## Basic Usage

```jsx
import { useState } from 'react';
import { Modal, Button } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Modal Title</h2>
          <p className="mb-4">This is the modal content.</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

## API Reference

### Props

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
| className | `string` | - | Additional CSS class for the modal container |

The Modal component also accepts all standard HTML div attributes as well as Framer Motion props (except `ref` and `children`).

## Examples

### Different Sized Modals

```jsx
import { useState } from 'react';
import { Modal, Button } from '@saeedkolivand/react-ui-toolkit';

function ModalSizes() {
  const [modalSize, setModalSize] = useState(null);

  const openModal = (size) => setModalSize(size);
  const closeModal = () => setModalSize(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => openModal('sm')}>Small Modal</Button>
        <Button onClick={() => openModal('md')}>Medium Modal</Button>
        <Button onClick={() => openModal('lg')}>Large Modal</Button>
        <Button onClick={() => openModal('xl')}>Extra Large Modal</Button>
        <Button onClick={() => openModal('full')}>Full Width Modal</Button>
      </div>

      {modalSize && (
        <Modal 
          isOpen={true} 
          onClose={closeModal}
          size={modalSize}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{modalSize.toUpperCase()} Modal</h2>
            <p className="mb-4">This is a {modalSize} sized modal dialog.</p>
            <div className="flex justify-end">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
```

### Modal with Form

```jsx
import { useState } from 'react';
import { Modal, Button, Input } from '@saeedkolivand/react-ui-toolkit';

function ModalWithForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data
    console.log('Form submitted:', formData);
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Contact Form</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
```

### Confirmation Modal

```jsx
import { useState } from 'react';
import { Modal, Button, Icon } from '@saeedkolivand/react-ui-toolkit';

function ConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Perform the confirmed action
    console.log('Action confirmed');
    setIsOpen(false);
  };

  return (
    <div>
      <Button variant="error" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-error-500">
            <Icon name="warning" size="xl" />
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Confirm Deletion</h2>
          <p className="text-center mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>

          <div className="flex justify-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="error" 
              onClick={handleConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

### Modal with Long Content

```jsx
import { useState } from 'react';
import { Modal, Button } from '@saeedkolivand/react-ui-toolkit';

function ScrollableModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Scrollable Modal
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        scrollable={true}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>

          <div className="prose max-w-none mb-4">
            {/* Long content that will scroll */}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            {/* Add multiple paragraphs here to create scrollable content */}
            {Array(20).fill(0).map((_, i) => (
              <p key={i}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            ))}
          </div>

          <div className="flex justify-end sticky bottom-0 pt-4 bg-white dark:bg-gray-800">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

### Custom Styled Modal

```jsx
import { useState } from 'react';
import { Modal, Button } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Custom Modal
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        className="border-t-4 border-primary-500 rounded-t-none"
      >
        <div className="p-6 bg-gradient-to-b from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800">
          <h2 className="text-xl font-bold mb-4 text-primary-700 dark:text-primary-300">
            Custom Styled Modal
          </h2>
          <p className="mb-4">This modal has custom styling applied to it.</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

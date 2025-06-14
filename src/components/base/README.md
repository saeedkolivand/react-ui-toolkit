# Base Components

This directory contains the core UI components that form the foundation of the React UI Toolkit. These components are designed to be simple, accessible, and highly customizable.

## Available Components

| Component | Description |
|-----------|-------------|
| [Button](./Button/README.md) | Basic button component with multiple variants, sizes, and states |
| [Checkbox](./Checkbox/README.md) | Checkbox input component for selecting multiple items |
| [Divider](./Divider/README.md) | Horizontal or vertical separator with optional text |
| [Icon](./Icon/README.md) | SVG icon component with 80+ built-in icons and custom icon support |
| [Input](./Input/README.md) | Text input field with various states and sizes |
| [Radio](./Radio/README.md) | Radio button component for single selection from a group |
| [Select](./Select/README.md) | Dropdown select component for choosing from a list of options |
| [Switch](./Switch/README.md) | Toggle switch component for binary choices |
| [Table](./Table/README.md) | Data table with sorting, pagination, and customizable columns |
| [Tag](./Tag/README.md) | Lightweight tag component with multiple colors and variants |
| [Textarea](./Textarea/README.md) | Multi-line text input component |
| [Tooltip](./Tooltip/README.md) | Informational popup that appears on hover |

## Component Documentation

Detailed documentation for components:

- [Divider](./Divider/README.md) - A versatile divider component that creates visible boundaries between content sections
- [Icon](./Icon/README.md) - A flexible icon component with 80+ built-in SVG icons and custom icon support
- [Table](./Table/README.md) - A powerful data table with sorting, pagination, and customizable columns
- [Tag](./Tag/README.md) - A lightweight tag component for categorizing and labeling content

## Usage Guidelines

All base components follow these principles:

1. **Accessibility First**: Components are designed with WCAG guidelines in mind
2. **Customization**: Styling can be extended via className props using Tailwind CSS
3. **Composability**: Components can be easily combined to create complex UIs
4. **TypeScript Support**: All components have proper TypeScript definitions

## Example Usage

```jsx
import { Button, Icon, Input } from '@saeedkolivand/react-ui-toolkit';

function LoginForm() {
  return (
    <div className="space-y-4">
      <Input 
        label="Email" 
        type="email" 
        placeholder="Enter your email"
      />

      <Input 
        label="Password" 
        type="password" 
        placeholder="Enter your password"
      />

      <Button variant="primary" fullWidth>
        <Icon name="lock" className="mr-2" />
        Login
      </Button>
    </div>
  );
}
```

[## Documentation

Each component has its own detailed README file with:

- Feature overview
- Basic usage examples
- API reference
- Advanced examples

For more comprehensive documentation and live examples, visit the [Storybook documentation site](https://saeedkolivand.github.io/react-ui-toolkit).
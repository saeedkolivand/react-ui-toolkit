# Component Library

This directory contains all the reusable UI components used throughout the application. The components are organized into categories based on their purpose and functionality.

## Directory Structure

```
components/
├── base/            # Fundamental UI building blocks
├── feedback/        # Components that provide feedback to users
├── layout/          # Components for page and content organization
├── navigation/      # Components for navigating the application
├── form/            # Form inputs and related components
├── data/            # Components for displaying data
├── overlays/        # Modals, popovers, and other overlay components
├── utils/           # Utility components and providers
├── index.ts         # Main export file
└── README.md        # This file
```

## Component Categories

### Base Components

These are the fundamental building blocks of the UI that serve as the foundation for more complex components:

- `Button`: Multi-purpose button component with various styles and states
- `Icon`: SVG icon component with a library of icons
- `Table`: Flexible data table with sorting, pagination, and customization options
- `Typography`: Text components for headings, paragraphs, etc.

### Feedback Components

Components that provide feedback to users about their actions or system status:

- `Alert`: Contextual feedback messages for user actions
- `Notification`: Temporary messages that appear in response to user actions
- `Progress`: Visual indicators of progress for operations
- `Skeleton`: Loading placeholders for content

### Layout Components

Components for organizing and structuring content on the page:

- `Container`: Wrapper component with controlled width and padding
- `Grid`: Flexible grid system for layout
- `Card`: Content container with borders and padding
- `Divider`: Horizontal or vertical line to separate content

### Form Components

Components for user input and form creation:

- `Input`: Text input fields
- `Select`: Dropdown selection component
- `Checkbox`: Checkboxes for multiple selections
- `Radio`: Radio buttons for single selections
- `Switch`: Toggle switches for binary options
- `Form`: Form container with validation and submission handling

## Usage Guidelines

### Component Imports

All components are exported from the main index file and can be imported as follows:

```jsx
import { Button, Container, Table } from '@/components';
```

### Component Props

Each component has its own set of props documented in the component's TypeScript interface. Most components accept standard HTML attributes in addition to their specific props.

### Customization

Components can be customized through:

1. **Props**: Many components have props for customizing appearance and behavior
2. **Classnames**: Most components accept a `className` prop for custom styling
3. **Theme**: Components respect the application theme (light/dark mode)

### Best Practices

1. Use the most specific component for your use case
2. Compose complex UIs from simpler components
3. Avoid direct DOM manipulation of component internals
4. When adding a new component:
   - Place it in the appropriate category folder
   - Create a descriptive README.md for the component
   - Create a test file (.test.tsx) with comprehensive tests
   - Create a Storybook story (.stories.tsx) to showcase usage
   - Export it from the category's index.ts and the main index.ts

## Contributing

When adding or modifying components:

1. Follow the existing component structure and naming conventions
2. Ensure components are fully typed with TypeScript
3. Write comprehensive tests covering all component functionality
4. Create or update Storybook stories to demonstrate usage
5. Document props and usage in the component's README.md

## Testing

Components should be tested using Jest and React Testing Library. Tests should focus on functionality and user interactions rather than implementation details.

```bash
# Run tests for all components
npm test

# Run tests for a specific component
npm test -- -t "Button"
```

## Documentation

Each component folder should contain:

- The component file(s)
- A README.md explaining the component's purpose and usage
- A test file
- A Storybook stories file

For more comprehensive documentation and live examples, visit the [Storybook documentation site](https://saeedkolivand.github.io/react-ui-toolkit).


<p align="center">
  <img src="https://github.com/saeedkolivand/react-ui-toolkit/raw/main/assets/images/banner.png" alt="React UI Toolkit Banner" width="100%">
</p>

## Features

- **Modern Design** - Clean and professional component designs  
- **TypeScript Support** - Full type definitions for all components  
- **Accessibility** - WCAG 2.1 compliant components  
- **Customizable** - Easily customize using Tailwind CSS  
- **Dark Mode** - Built-in dark mode support  
- **Responsive** - Mobile-first design approach  

## Installation

```bash
npm install @saeedkolivand/react-ui-toolkit
# or
yarn add @saeedkolivand/react-ui-toolkit
````

## Quick Start

```jsx
import React from "react";
import { Button, StylesProvider } from "@saeedkolivand/react-ui-toolkit";
import "@saeedkolivand/react-ui-toolkit/dist/styles.css";

function App() {
  return (
    <StylesProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Hello React UI Toolkit</h1>
        <Button variant="primary">Click Me</Button>
      </div>
    </StylesProvider>
  );
}

export default App;
```

## Documentation

For detailed documentation, see the following resources:

* [Usage Guide](./docs/usage-guide.md)
* [API Reference](./docs/api-reference.md)
* [Examples](./examples/README.md)

## Available Components

### Base Components

* Button
* Input
* Textarea
* Select
* Checkbox
* Radio
* Switch
* Tooltip
* Tag
* Icon
* Divider

### Layout Components

* Container
* Row
* Col

### Feedback Components

* Card
* Alert
* Badge
* Avatar
* Spinner
* Progress
* Notification

### Navigation Components

* Tabs
* Modal
* Drawer
* Dropdown
* Accordion

### Theme Components

* ThemeToggle

## Development

```bash
# Clone the repository
git clone https://github.com/saeedkolivand/react-ui-toolkit.git
cd react-ui-toolkit

# Install dependencies
npm install

# Start Storybook for development
npm run storybook

# Run tests
npm test

# Build the library
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Usage

### Importing Styles

You have three options for importing styles:

#### Option 1: Direct CSS Import

```js
import "@saeedkolivand/react-ui-toolkit/dist/styles.css";
```

#### Option 2: StylesProvider (Recommended)

```jsx
import { StylesProvider } from "@saeedkolivand/react-ui-toolkit";

function App() {
  return (
    <StylesProvider>
      <YourApplication />
    </StylesProvider>
  );
}
```

#### Option 3: SSR-Compatible Provider (Next.js)

```jsx
import { StylesProviderSSR } from "@saeedkolivand/react-ui-toolkit";

function App() {
  return (
    <StylesProviderSSR>
      <YourApplication />
    </StylesProviderSSR>
  );
}
```

#### Option 4: Higher-Order Component

```jsx
import { withStylesProvider } from "@saeedkolivand/react-ui-toolkit";

function YourApp() {
  return <div>Your application content</div>;
}

export default withStylesProvider(YourApp);
```

### Using Components

```jsx
import { Button, Input } from "@saeedkolivand/react-ui-toolkit";

function App() {
  return (
    <div>
      <Input placeholder="Enter your name" />
      <Button>Click me</Button>
    </div>
  );
}
```

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

### Pre-commit Hooks

Before each commit, the following will run automatically:

* TypeScript type checking
* ESLint
* Prettier
* Tests
* Project build

## License

MIT © [Saeed Kolivand](https://github.com/saeedkolivand)

# React UI Toolkit Usage Guide

## Installation

Install the package using npm or yarn:

```bash
npm install @saeedkolivand/react-ui-toolkit
# or
yarn add @saeedkolivand/react-ui-toolkit
```

## Setting Up Styles

There are multiple ways to include the component styles in your project:

### Option 1: Direct CSS Import (Recommended)

The most reliable approach is to directly import the CSS file in your application entry point:

```javascript
// In your App.js, index.js, or _app.js (Next.js)
import '@saeedkolivand/react-ui-toolkit/dist/styles.css';
```

### Option 2: StylesProvider Component

Wrap your application with the `StylesProvider` which will automatically load the styles:

```jsx
import { StylesProvider } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <StylesProvider>
      <YourApplication />
    </StylesProvider>
  );
}
```

### Option 3: Server-Side Rendering

For Next.js or other SSR frameworks, use the SSR-compatible provider:

```jsx
import { StylesProviderSSR } from '@saeedkolivand/react-ui-toolkit';

function MyApp({ Component, pageProps }) {
  return (
    <StylesProviderSSR>
      <Component {...pageProps} />
    </StylesProviderSSR>
  );
}

export default MyApp;
```

### Option 4: Higher-Order Component

Alternatively, you can use the withStyles HOC to wrap your root component:

```jsx
import { withStyles } from '@saeedkolivand/react-ui-toolkit';

function YourApp() {
  return <div>Your application content</div>;
}

export default withStyles(YourApp);
```

## Configuring Tailwind CSS

If your project uses Tailwind CSS, ensure your configuration includes the component paths:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@saeedkolivand/react-ui-toolkit/**/*.{js,jsx,ts,tsx}'
  ],
  // other configuration...
}
```

## Basic Usage

### Importing Components

Import components directly from the package:

```jsx
import { Button, Input, Select } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Click me</Button>
      <Select
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ]}
      />
    </div>
  );
}
```

### Button Component

The Button component supports various variants:

```jsx
import { Button } from '@saeedkolivand/react-ui-toolkit';

function ButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="success">Success Button</Button>
      <Button variant="error">Error Button</Button>
      <Button variant="warning">Warning Button</Button>
      <Button variant="info">Info Button</Button>

      {/* Different sizes */}
      <Button size="sm">Small Button</Button>
      <Button size="md">Medium Button</Button>
      <Button size="lg">Large Button</Button>

      {/* Loading state */}
      <Button loading>Loading Button</Button>

      {/* Full width */}
      <Button fullWidth>Full Width Button</Button>
    </div>
  );
}
```

### Theme Toggle

Add a theme toggle button to switch between light and dark modes:

```jsx
import { ThemeToggle } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
      <main>
        {/* Your application content */}
      </main>
    </div>
  );
}
```

### Form Elements

Use form elements for collecting user input:

```jsx
import { Input, Textarea, Checkbox, Radio, Select } from '@saeedkolivand/react-ui-toolkit';

function FormExample() {
  return (
    <form className="space-y-4">
      <Input 
        label="Username" 
        placeholder="Enter your username" 
        required 
      />

      <Textarea 
        label="Bio" 
        placeholder="Tell us about yourself" 
      />

      <Checkbox label="I agree to the terms and conditions" />

      <div className="space-y-2">
        <Radio name="plan" value="free" label="Free Plan" />
        <Radio name="plan" value="pro" label="Pro Plan" />
      </div>

      <Select
        label="Country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'uk', label: 'United Kingdom' },
        ]}
      />
    </form>
  );
}
```

## Advanced Usage

### Using Context and Hooks

Access and manipulate theme and other global states:

```jsx
import { useChangeTheme, useColorScheme } from '@saeedkolivand/react-ui-toolkit';

function ThemeAwareComponent() {
  const { isDarkMode, toggleTheme } = useChangeTheme();
  const colorScheme = useColorScheme();

  return (
    <div>
      <p>Current theme: {isDarkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p>Color scheme: {colorScheme}</p>
    </div>
  );
}
```

### Customizing Components

Customize components using className or style props:

```jsx
import { Button } from '@saeedkolivand/react-ui-toolkit';

function CustomizedButton() {
  return (
    <Button 
      variant="primary" 
      className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
    >
      Customized Button
    </Button>
  );
}
```

## Troubleshooting

### CSS Not Loading

If components appear unstyled:

1. Verify you've imported the CSS file correctly
2. Check for any console errors related to loading CSS
3. Try using the direct CSS import method as it's the most reliable
4. Ensure your bundler is configured to handle CSS imports

### Tailwind Conflicts

If you experience conflicts with your Tailwind configuration:

1. Ensure you're using compatible Tailwind versions
2. Use the `prefix` option in your Tailwind config to avoid class name collisions
3. Use the `important` option in Tailwind to override conflicting styles

## Resources

- [GitHub Repository](https://github.com/saeedkolivand/react-ui-toolkit)
- [Issue Tracker](https://github.com/saeedkolivand/react-ui-toolkit/issues)
- [Storybook Documentation](https://react-ui-toolkit-storybook.netlify.app)

## Example Applications

### Basic Example

```jsx
import React from 'react';
import { Button, Card, StylesProvider } from '@saeedkolivand/react-ui-toolkit';
import '@saeedkolivand/react-ui-toolkit/dist/styles.css';

function App() {
  return (
    <StylesProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <Card.Header>
            <h1 className="text-2xl font-bold">Welcome</h1>
          </Card.Header>
          <Card.Body>
            <p className="mb-4">This is a simple example of using React UI Toolkit components.</p>
            <div className="space-y-2">
              <Button variant="primary" fullWidth>Sign In</Button>
              <Button variant="outline" fullWidth>Create Account</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </StylesProvider>
  );
}

export default App;
```

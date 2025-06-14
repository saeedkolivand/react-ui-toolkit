# Hooks

Custom React hooks provide reusable stateful logic that can be shared across components. The hooks in this library are designed to handle common UI patterns and functionality.

## Available Hooks

### useChangeTheme

The `useChangeTheme` hook provides an interface for controlling the application's theme.

```jsx
import { useChangeTheme } from '@saeedkolivand/react-ui-toolkit';

function ThemeController() {
  const { isDarkMode, toggleTheme, setTheme, currentTheme } = useChangeTheme();

  return (
    <div>
      <p>Current theme: {currentTheme}</p>
      <p>Is dark mode: {isDarkMode ? 'Yes' : 'No'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| isDarkMode | `boolean` | Whether dark mode is currently active |
| toggleTheme | `() => void` | Function to toggle between light and dark themes |
| setTheme | `(theme: 'light' \| 'dark' \| 'system') => void` | Function to explicitly set the theme |
| currentTheme | `'light' \| 'dark' \| 'system'` | The currently active theme setting |

### Usage with ThemeProvider

The `useChangeTheme` hook must be used within a component that is wrapped by the `ThemeProvider`:

```jsx
import { ThemeProvider } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <ThemeProvider>
      <ThemeController />
    </ThemeProvider>
  );
}
```

### Creating Theme-Aware Components

You can use the `useChangeTheme` hook to create components that respond to theme changes:

```jsx
import { useChangeTheme } from '@saeedkolivand/react-ui-toolkit';

function ThemeAwareCard({ children }) {
  const { isDarkMode } = useChangeTheme();

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {children}
    </div>
  );
}
```

## Best Practices

- Always use hooks at the top level of your React components
- Don't call hooks inside loops, conditions, or nested functions
- Custom hooks should always start with the word "use"
- When creating custom hooks that depend on theme, use `useChangeTheme` for consistent behavior

## Additional Information

For more detailed information on each hook and for additional hooks, refer to the specific documentation files or the API reference.

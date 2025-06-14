# Theme Components

The theme components provide tools for managing and customizing the visual appearance of your application. They handle theme switching between light and dark modes while respecting user preferences.

## Components in this Category

### ThemeToggle

A simple, user-friendly component that allows users to toggle between light and dark themes.

[View ThemeToggle Documentation](./ThemeToggle/README.md)

```jsx
import { ThemeToggle } from '@saeedkolivand/react-ui-toolkit';

<ThemeToggle />
```

## Theme System Features

- **Automatic Theme Detection**: Automatically detects and respects the user's system preferences
- **Persistent Preferences**: Saves user theme choices to localStorage
- **Smooth Transitions**: Provides smooth transitions when switching between themes
- **Context Integration**: Works with React context for application-wide theme state management

## Using the Theme System

### Basic Setup

To use the theming system in your application, wrap your application with the `ThemeProvider` component:

```jsx
import { ThemeProvider } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
      <ThemeToggle />
    </ThemeProvider>
  );
}
```

### Programmatic Theme Control

You can programmatically control the theme using the `useChangeTheme` hook:

```jsx
import { useChangeTheme } from '@saeedkolivand/react-ui-toolkit';

function ThemeController() {
  const { isDarkMode, toggleTheme, setTheme } = useChangeTheme();

  return (
    <div>
      <p>Current theme: {isDarkMode ? 'Dark' : 'Light'}</p>

      <button onClick={toggleTheme}>
        Toggle Theme
      </button>

      <button onClick={() => setTheme('light')}>
        Set Light Theme
      </button>

      <button onClick={() => setTheme('dark')}>
        Set Dark Theme
      </button>
    </div>
  );
}
```

### Custom Theme-Aware Components

You can create components that adapt to the current theme using the `useChangeTheme` hook:

```jsx
import { useChangeTheme } from '@saeedkolivand/react-ui-toolkit';

function ThemeAwareGreeting() {
  const { isDarkMode } = useChangeTheme();

  return (
    <div className={isDarkMode ? 'text-white' : 'text-black'}>
      Good {isDarkMode ? 'evening' : 'day'}, user!
    </div>
  );
}
```

## Theme System Architecture

The theming system consists of the following key parts:

1. **ThemeProvider**: A React context provider that manages theme state
2. **useChangeTheme Hook**: A custom hook that provides access to theme state and controls
3. **ThemeToggle Component**: A pre-built UI component for toggling between themes

The system uses CSS variables and Tailwind's dark mode functionality to apply theme changes throughout the application.

## Best Practices

- Place the `ThemeToggle` component in a consistent, easy-to-find location in your UI
- Ensure all custom components properly support both light and dark themes
- Test your application in both light and dark modes to ensure proper contrast and readability
- Consider offering additional theme customization options beyond just light and dark modes

## Extending the Theme System

The theme system is designed to be extensible. You can add support for additional themes or color schemes by:

1. Extending the theme context to support additional theme options
2. Creating new CSS variables for your custom themes
3. Building custom theme selector components

```jsx
// Example of a multi-theme selector
import { useChangeTheme } from '@saeedkolivand/react-ui-toolkit';

function ThemeSelector() {
  const { setTheme, currentTheme } = useChangeTheme();

  return (
    <div className="theme-selector">
      <button 
        className={currentTheme === 'light' ? 'active' : ''}
        onClick={() => setTheme('light')}
      >
        Light
      </button>
      <button 
        className={currentTheme === 'dark' ? 'active' : ''}
        onClick={() => setTheme('dark')}
      >
        Dark
      </button>
      <button 
        className={currentTheme === 'system' ? 'active' : ''}
        onClick={() => setTheme('system')}
      >
        System
      </button>
    </div>
  );
}
```
## Documentation

For more comprehensive documentation and live examples, visit the [Storybook documentation site](https://saeedkolivand.github.io/react-ui-toolkit).

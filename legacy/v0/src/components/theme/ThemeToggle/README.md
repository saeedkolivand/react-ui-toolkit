# ThemeToggle Component

The ThemeToggle component provides an easy way for users to switch between light and dark themes in your application. It automatically detects the current theme, displays the appropriate toggle state, and handles theme switching with a single click.

## Features

- Simple, intuitive toggle between light and dark modes
- Automatically persists user's preference in local storage
- Respects system preference by default
- Smooth transitions between themes
- Accessible design with proper ARIA attributes
- Multiple style variants and size options

## Installation

The ThemeToggle component is part of the React UI Toolkit and can be imported directly:

```jsx
import { ThemeToggle } from '@saeedkolivand/react-ui-toolkit';
```

## Basic Usage

```jsx
import { ThemeToggle } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
      <main>
        {/* Your content here */}
      </main>
    </div>
  );
}
```

## Features

- Simple toggle between light and dark modes
- Automatically persists user's preference in local storage
- Respects system preference by default
- Animated transitions between themes
- Accessible design with proper ARIA attributes

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'button' \| 'icon' \| 'switch'` | `'button'` | Visual style of the toggle |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the toggle |
| className | `string` | - | Additional CSS classes |

## Examples

### Default Button Style

```jsx
<ThemeToggle />
```

### Icon-Only Style

```jsx
<ThemeToggle variant="icon" />
```

### Switch Style

```jsx
<ThemeToggle variant="switch" />
```

### Different Sizes

```jsx
<ThemeToggle size="sm" />
<ThemeToggle size="md" />
<ThemeToggle size="lg" />
```

## Integration with Theme Provider

The ThemeToggle component works with the built-in theme context and does not require additional setup if you're using the `StylesProvider` or `StylesProviderSSR` components.

However, if you want to control the theme programmatically, you can use the `useChangeTheme` hook:

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

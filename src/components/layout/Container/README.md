# Container Component

A responsive container component that centers content and maintains consistent spacing with configurable max-width.

## Features

- Multiple preset max-width options (sm, md, lg, xl, 2xl, full, none)
- Optional horizontal padding
- Automatic centering
- Dark mode support
- Fully customizable with additional classNames

## Basic Usage

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <Container>
      <h1>My Content</h1>
      <p>This content is centered and has a max-width.</p>
    </Container>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| maxWidth | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' \| 'none'` | `'lg'` | Maximum width of the container |
| padding | `boolean` | `true` | Whether to add horizontal padding to the container |
| center | `boolean` | `true` | Whether the container should be centered |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Container component accepts all standard HTML div attributes.

## Max-Width Reference

| Value | CSS class | Width |
|-------|-----------|-------|
| `sm` | `max-w-screen-sm` | 640px |
| `md` | `max-w-screen-md` | 768px |
| `lg` | `max-w-screen-lg` | 1024px |
| `xl` | `max-w-screen-xl` | 1280px |
| `2xl` | `max-w-screen-2xl` | 1536px |
| `full` | `max-w-full` | 100% |
| `none` | - | No max-width |

## Examples

### Different Max-Widths

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

function ContainerSizes() {
  return (
    <div className="space-y-8">
      <Container maxWidth="sm" className="bg-gray-100 p-4">
        <div className="text-center">Small Container (max-w-screen-sm)</div>
      </Container>

      <Container maxWidth="md" className="bg-gray-100 p-4">
        <div className="text-center">Medium Container (max-w-screen-md)</div>
      </Container>

      <Container maxWidth="lg" className="bg-gray-100 p-4">
        <div className="text-center">Large Container (max-w-screen-lg)</div>
      </Container>

      <Container maxWidth="xl" className="bg-gray-100 p-4">
        <div className="text-center">Extra Large Container (max-w-screen-xl)</div>
      </Container>
    </div>
  );
}
```

### Without Padding

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

function ContainerWithoutPadding() {
  return (
    <Container padding={false} className="bg-gray-100">
      <div className="p-4">
        <p>This container has no built-in padding.</p>
        <p>Add your own padding to child elements as needed.</p>
      </div>
    </Container>
  );
}
```

### Full-Width Container

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

function FullWidthContainer() {
  return (
    <Container maxWidth="full" className="bg-gray-100 p-4">
      <p>This container spans the full width of its parent.</p>
    </Container>
  );
}
```

### Custom Styling

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

function StyledContainer() {
  return (
    <Container 
      className="bg-gradient-to-r from-blue-100 to-purple-100 shadow-md rounded-lg py-8"
    >
      <h2 className="text-center text-xl font-bold">Custom Styled Container</h2>
      <p className="text-center mt-2">This container has custom background, shadow and rounded corners.</p>
    </Container>
  );
}
```

### Page Layout with Container

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

function PageLayout() {
  return (
    <div>
      {/* Full-width header */}
      <header className="bg-primary-600 text-white py-4">
        <Container>
          <h1 className="text-xl font-bold">My Website</h1>
        </Container>
      </header>

      {/* Main content with container */}
      <main className="py-8">
        <Container>
          <h2 className="text-2xl font-bold mb-4">Welcome to My Website</h2>
          <p className="mb-4">This is the main content of the page.</p>
          {/* More content... */}
        </Container>
      </main>

      {/* Full-width footer */}
      <footer className="bg-gray-100 py-6">
        <Container>
          <p className="text-center text-gray-600">&copy; 2025 My Website</p>
        </Container>
      </footer>
    </div>
  );
}
```

### Nested Containers

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

function NestedContainers() {
  return (
    <Container maxWidth="xl" className="bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-4">Outer Container (XL)</h2>

      <Container maxWidth="md" className="bg-white p-6 shadow-md rounded">
        <h3 className="text-xl font-bold mb-2">Inner Container (MD)</h3>
        <p>This is a nested container with its own max-width.</p>
      </Container>
    </Container>
  );
}
```

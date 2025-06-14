# Spinner Component

A simple and customizable loading spinner component that provides visual feedback for loading states and async operations.

## Features

- Multiple variants: primary, secondary, success, warning, error
- Three size options: sm, md, lg
- Smooth animation
- Accessible by default with proper ARIA attributes
- Dark mode compatible
- Customizable with additional classNames

## Basic Usage

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div className="flex items-center space-x-4">
      <Spinner />
      <span>Loading data...</span>
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the spinner |
| variant | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | The color variant of the spinner |
| label | `string` | `'Loading...'` | Screen reader text for accessibility |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Spinner component accepts all standard HTML div attributes.

## Examples

### Different Sizes

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';

function SpinnerSizes() {
  return (
    <div className="flex items-center space-x-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}
```

### Different Variants

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';

function SpinnerVariants() {
  return (
    <div className="flex items-center space-x-4">
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <Spinner variant="success" />
      <Spinner variant="warning" />
      <Spinner variant="error" />
    </div>
  );
}
```

### With Custom Label

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';

function SpinnerWithLabel() {
  return (
    <Spinner label="Processing payment..." />
  );
}
```

### Button with Spinner

```jsx
import { Button, Spinner } from '@saeedkolivand/react-ui-toolkit';

function LoadingButton({ isLoading, children, ...props }) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Loading...
        </>
      ) : children}
    </Button>
  );
}

// Usage
function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <LoadingButton 
      isLoading={isLoading} 
      onClick={handleClick}
    >
      Submit
    </LoadingButton>
  );
}
```

### Full Page Loading State

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';

function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
      <div className="text-center">
        <Spinner size="lg" />
        <div className="mt-4 font-medium">Loading your content...</div>
      </div>
    </div>
  );
}
```

### Custom Styling

```jsx
import { Spinner } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledSpinner() {
  return (
    <Spinner className="text-purple-600 border-4" />
  );
}
```

### Loading Card

```jsx
import { Card, Spinner } from '@saeedkolivand/react-ui-toolkit';

function LoadingCard({ isLoading, children }) {
  return (
    <Card className="relative min-h-[200px]">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg z-10">
          <Spinner size="lg" />
        </div>
      ) : null}

      <Card.Body className={isLoading ? 'opacity-50' : ''}>
        {children}
      </Card.Body>
    </Card>
  );
}

// Usage
function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingCard isLoading={isLoading}>
      <h3 className="text-lg font-medium">Card Title</h3>
      <p className="mt-2">Card content goes here...</p>
    </LoadingCard>
  );
}
```

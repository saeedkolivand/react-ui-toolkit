# Progress Component

A flexible progress bar component for displaying completion status, loading states, and visual feedback for operations that take time.

## Features

- Multiple variants: primary, secondary, success, warning, error
- Three size options: sm, md, lg
- Optional value label display
- Striped pattern with optional animation
- Indeterminate state for loading feedback
- Fully accessible with ARIA attributes
- Dark mode compatible
- Customizable with additional classNames

## Basic Usage

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div className="space-y-4">
      <Progress value={25} />
      <Progress value={50} variant="success" />
      <Progress value={75} variant="warning" />
      <Progress value={100} variant="error" />
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `number` | - | The current value of the progress bar (0-100) |
| max | `number` | `100` | The maximum value of the progress bar |
| variant | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | The color variant of the progress bar |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | The thickness of the progress bar |
| showValue | `boolean` | `false` | Whether to show the percentage value label |
| striped | `boolean` | `false` | Whether to show stripes in the progress bar |
| animated | `boolean` | `false` | Whether to animate the stripes or indeterminate state |
| indeterminate | `boolean` | `false` | Whether the progress is indeterminate (loading state) |
| label | `string` | - | Custom label for accessibility |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Progress component accepts all standard HTML div attributes except for `children`.

## Examples

### Different Sizes

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

function ProgressSizes() {
  return (
    <div className="space-y-4">
      <Progress value={75} size="sm" />
      <Progress value={75} size="md" />
      <Progress value={75} size="lg" />
    </div>
  );
}
```

### With Value Label

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

function ProgressWithLabel() {
  return (
    <div className="space-y-4">
      <Progress value={33} showValue />
      <Progress value={66} size="lg" showValue />
    </div>
  );
}
```

### Striped Progress Bars

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

function StripedProgress() {
  return (
    <div className="space-y-4">
      <Progress value={45} striped />
      <Progress value={65} variant="success" striped />
      <Progress value={85} variant="warning" striped />
    </div>
  );
}
```

### Animated Progress Bars

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

function AnimatedProgress() {
  return (
    <div className="space-y-4">
      <Progress value={60} striped animated />
      <Progress indeterminate animated />
    </div>
  );
}
```

### Indeterminate State

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

function IndeterminateProgress() {
  return (
    <div className="space-y-4">
      <Progress indeterminate />
      <Progress indeterminate animated variant="success" />
    </div>
  );
}
```

### Custom Styling

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledProgress() {
  return (
    <Progress 
      value={80} 
      className="shadow-md rounded-sm" 
      striped 
      animated 
    />
  );
}
```

### Dynamic Progress

```jsx
import { Progress, Button } from '@saeedkolivand/react-ui-toolkit';
import { useState, useEffect } from 'react';

function DynamicProgress() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && progress < 100) {
      timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 5, 100));
      }, 300);
    } else if (progress >= 100) {
      setIsRunning(false);
    }

    return () => clearTimeout(timer);
  }, [progress, isRunning]);

  const startProgress = () => {
    setProgress(0);
    setIsRunning(true);
  };

  return (
    <div className="space-y-4">
      <Progress 
        value={progress} 
        variant={progress === 100 ? "success" : "primary"} 
        striped={progress < 100}
        animated={progress < 100}
        showValue
      />

      <Button 
        onClick={startProgress} 
        disabled={isRunning}
      >
        {progress === 100 ? "Completed" : isRunning ? "Running..." : "Start Progress"}
      </Button>
    </div>
  );
}
```

### File Upload Progress Example

```jsx
import { Progress } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function FileUploadProgress() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Uploading file.jpg</span>
        <span>{progress}%</span>
      </div>

      <Progress 
        value={progress} 
        variant={progress === 100 ? "success" : "primary"}
        striped={progress < 100}
        animated={progress < 100}
      />

      <button 
        onClick={simulateUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : progress === 100 ? "Upload Complete" : "Start Upload"}
      </button>
    </div>
  );
}
```

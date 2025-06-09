# Button Component

## Usage

The Button component provides a standard button with various styling options.

```jsx
import { Button } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Button variant="primary">Click Me</Button>
  );
}
```

## Variants

The Button component supports multiple variants:

- `primary` - Main action button (blue)
- `secondary` - Secondary action button (gray)
- `outline` - Button with only an outline
- `ghost` - Button with no background until hovered
- `success` - Success action button (green)
- `error` - Error/dangerous action button (red)
- `warning` - Warning action button (yellow)
- `info` - Informational button (blue)

## Color System Notes

The component uses Tailwind CSS for styling with a custom color palette. The primary button uses the `primary-600` color by default, which corresponds to a medium blue shade (`#0284c7`).

If the button is not visible, ensure:

1. The component's CSS is properly loaded
2. There are no CSS conflicts in your application
3. The Tailwind theme is properly configured

## Troubleshooting

If buttons are only visible on hover, check that:
- The CSS is properly loaded
- There are no conflicting class names in your application
- The Tailwind color configuration is properly set up

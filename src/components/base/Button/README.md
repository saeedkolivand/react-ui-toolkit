# Button Component

## Usage

The Button component provides a standard button with various styling options, including built-in icon support.

```jsx
import { Button } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Button variant="primary">Click Me</Button>
  );
}
```

## Icon Support

You can add an icon to your button using the `icon` prop. The icon is rendered using the built-in `Icon` component and accepts any valid `IconName`.

```jsx
<Button icon="search">Search</Button>
<Button icon="plus" variant="primary">Add New</Button>
<Button icon="trash" variant="error" iconPosition="right">Delete</Button>
```

- `icon`: The name of the icon to display (see the Icon component for available names)
- `iconPosition`: Set to 'left' (default) or 'right' to control icon placement relative to the button text

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

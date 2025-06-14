# Icon Component

A flexible and customizable icon component with a comprehensive library of built-in SVG icons. The component supports different sizes, colors, and custom icons.

## Features

- 80+ built-in SVG icons organized by category
- Support for custom SVG icons
- Multiple size options (sm, md, lg, xl)
- Customizable colors
- Compatible with all standard SVG attributes
- Built with accessibility in mind

## Basic Usage

```jsx
import { Icon } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <div>
      {/* Using a built-in icon */}
      <Icon name="check" />

      {/* Customizing size and color */}
      <Icon name="warning" size="lg" color="#F59E0B" />
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | `IconName` | - | The name of the built-in icon to use |
| customIcon | `React.ReactNode` | - | Custom icon component to use instead of built-in icons |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | The size of the icon |
| color | `string` | `'currentColor'` | The color of the icon |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Icon component accepts all standard SVG attributes.

## Available Icons

The component includes 80+ built-in icons organized into the following categories:

### Navigation
- menu, globe, close, chevronDown, chevronRight, chevronLeft, chevronUp, home, externalLink

### Actions
- search, plus, minus, edit, trash, download, upload

### Status
- check, error, warning, info, eye, eyeOff

### Social
- github, twitter, linkedin, facebook, instagram, youtube, tiktok

### File
- file, folder, document, documentText, documentDuplicate

### UI Elements
- user, settings, bell, heart, star, filter, sort, refresh, grid, list, bookmark

### Media
- play, playLarge, pause, volumeUp, volumeDown, volumeOff, fastForward, rewind, skipForward, skipBackward

### Arrows
- arrowUp, arrowDown, arrowLeft, arrowRight, arrowUpRight, arrowUpLeft, arrowDownRight, arrowDownLeft

### Data
- chart, pieChart, chartLine, chartArea

### Time
- clock, calendar

### Location
- location, map

### Security
- lock, key, shield

### Weather
- sun, moon, cloud

### Shopping
- cart, tag, shoppingBag

## Examples

### Different Sizes

```jsx
<div className="flex items-center gap-4">
  <Icon name="star" size="sm" />
  <Icon name="star" size="md" />
  <Icon name="star" size="lg" />
  <Icon name="star" size="xl" />
</div>
```

### Custom Colors

```jsx
<div className="flex items-center gap-4">
  <Icon name="bell" color="#3B82F6" />
  <Icon name="heart" color="#EF4444" />
  <Icon name="check" color="#10B981" />
</div>
```

### Using Custom SVG

```jsx
import { Icon } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  const customSvgPath = (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  );

  return <Icon customIcon={customSvgPath} />;
}
```

### With Other Components

```jsx
import { Button, Icon } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <Button variant="primary">
      <Icon name="download" className="mr-2" />
      Download
    </Button>
  );
}
```

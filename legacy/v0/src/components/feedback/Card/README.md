# Card Component

## Usage

The Card component provides a container for content with optional header and footer sections.

```jsx
import { Card } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-bold">Card Title</h2>
      </Card.Header>
      <Card.Body>
        <p>This is the main content of the card.</p>
      </Card.Body>
      <Card.Footer>
        <p className="text-sm text-gray-500">Footer information</p>
      </Card.Footer>
    </Card>
  );
}
```

## Features

- Clean, modern design with proper spacing
- Flexible structure with Header, Body, and Footer sub-components
- Customizable with various style options
- Support for hover effects and shadows
- Responsive design

## Props

### Card Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes for the card |
| shadow | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Shadow size for the card |
| hoverable | `boolean` | `false` | Whether the card should have a hover effect |
| bordered | `boolean` | `true` | Whether the card should have a border |

### Card.Header, Card.Body, Card.Footer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes for the component |

## Examples

### Basic Card

```jsx
<Card>
  <Card.Body>
    <p>A simple card with just a body.</p>
  </Card.Body>
</Card>
```

### Card with Header

```jsx
<Card>
  <Card.Header>
    <h3 className="text-lg font-semibold">Announcement</h3>
  </Card.Header>
  <Card.Body>
    <p>Important information goes here.</p>
  </Card.Body>
</Card>
```

### Card with Footer

```jsx
<Card>
  <Card.Body>
    <p>Product details and description.</p>
  </Card.Body>
  <Card.Footer>
    <button className="text-blue-500">Add to Cart</button>
  </Card.Footer>
</Card>
```

### Hoverable Card

```jsx
<Card hoverable>
  <Card.Body>
    <p>This card has a hover effect. Try hovering over it!</p>
  </Card.Body>
</Card>
```

### Borderless Card

```jsx
<Card bordered={false} shadow="lg">
  <Card.Body>
    <p>This card has no border but a larger shadow.</p>
  </Card.Body>
</Card>
```

### Different Shadow Sizes

```jsx
<Card shadow="none">
  <Card.Body>No shadow</Card.Body>
</Card>

<Card shadow="sm">
  <Card.Body>Small shadow</Card.Body>
</Card>

<Card shadow="md">
  <Card.Body>Medium shadow (default)</Card.Body>
</Card>

<Card shadow="lg">
  <Card.Body>Large shadow</Card.Body>
</Card>
```

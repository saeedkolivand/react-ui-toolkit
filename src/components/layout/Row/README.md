# Row Component

A flexible grid row component that works in tandem with the Col component to create responsive layouts. Based on the flexbox model, it gives you fine control over the arrangement of columns.

## Features

- Horizontal alignment options for columns (start, end, center, between, around, evenly)
- Vertical alignment options for columns (start, end, center, baseline, stretch)
- Configurable spacing between columns
- Option to wrap or nowrap columns
- Support for reversing column order
- Fully customizable with additional classNames

## Basic Usage

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return (
    <Row>
      <Col span={6}>Left Column</Col>
      <Col span={6}>Right Column</Col>
    </Row>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| justify | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | Horizontal alignment of columns |
| align | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | - | Vertical alignment of columns |
| spacing | `number` | - | Space between columns (in Tailwind's gap units) |
| wrap | `boolean` | `true` | Whether to wrap columns to multiple lines |
| reverse | `boolean` | `false` | Whether to reverse the order of columns |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Row component accepts all standard HTML div attributes.

## Examples

### Basic Grid Layout

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function GridLayout() {
  return (
    <div className="space-y-4">
      <Row>
        <Col span={12} className="bg-gray-100 p-4 text-center">Full Width</Col>
      </Row>

      <Row>
        <Col span={6} className="bg-gray-100 p-4 text-center">Half</Col>
        <Col span={6} className="bg-gray-100 p-4 text-center">Half</Col>
      </Row>

      <Row>
        <Col span={4} className="bg-gray-100 p-4 text-center">One Third</Col>
        <Col span={4} className="bg-gray-100 p-4 text-center">One Third</Col>
        <Col span={4} className="bg-gray-100 p-4 text-center">One Third</Col>
      </Row>

      <Row>
        <Col span={3} className="bg-gray-100 p-4 text-center">Quarter</Col>
        <Col span={3} className="bg-gray-100 p-4 text-center">Quarter</Col>
        <Col span={3} className="bg-gray-100 p-4 text-center">Quarter</Col>
        <Col span={3} className="bg-gray-100 p-4 text-center">Quarter</Col>
      </Row>
    </div>
  );
}
```

### Column Justification

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function JustifyExamples() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2">justify="start"</p>
        <Row justify="start" className="bg-gray-50 h-20">
          <Col span={3} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={3} className="bg-gray-100 p-4">Column 2</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">justify="center"</p>
        <Row justify="center" className="bg-gray-50 h-20">
          <Col span={3} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={3} className="bg-gray-100 p-4">Column 2</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">justify="end"</p>
        <Row justify="end" className="bg-gray-50 h-20">
          <Col span={3} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={3} className="bg-gray-100 p-4">Column 2</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">justify="between"</p>
        <Row justify="between" className="bg-gray-50 h-20">
          <Col span={3} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={3} className="bg-gray-100 p-4">Column 2</Col>
        </Row>
      </div>
    </div>
  );
}
```

### Column Alignment

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function AlignExamples() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2">align="start"</p>
        <Row align="start" className="bg-gray-50 h-24">
          <Col span={4} className="bg-gray-100 p-2">Short</Col>
          <Col span={4} className="bg-gray-100 p-4">Medium content</Col>
          <Col span={4} className="bg-gray-100 p-6">Taller content here</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">align="center"</p>
        <Row align="center" className="bg-gray-50 h-24">
          <Col span={4} className="bg-gray-100 p-2">Short</Col>
          <Col span={4} className="bg-gray-100 p-4">Medium content</Col>
          <Col span={4} className="bg-gray-100 p-6">Taller content here</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">align="end"</p>
        <Row align="end" className="bg-gray-50 h-24">
          <Col span={4} className="bg-gray-100 p-2">Short</Col>
          <Col span={4} className="bg-gray-100 p-4">Medium content</Col>
          <Col span={4} className="bg-gray-100 p-6">Taller content here</Col>
        </Row>
      </div>
    </div>
  );
}
```

### Column Spacing

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function SpacingExamples() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2">No spacing</p>
        <Row className="bg-gray-50">
          <Col span={4} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={4} className="bg-gray-100 p-4">Column 2</Col>
          <Col span={4} className="bg-gray-100 p-4">Column 3</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">spacing={2}</p>
        <Row spacing={2} className="bg-gray-50">
          <Col span={4} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={4} className="bg-gray-100 p-4">Column 2</Col>
          <Col span={4} className="bg-gray-100 p-4">Column 3</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">spacing={4}</p>
        <Row spacing={4} className="bg-gray-50">
          <Col span={4} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={4} className="bg-gray-100 p-4">Column 2</Col>
          <Col span={4} className="bg-gray-100 p-4">Column 3</Col>
        </Row>
      </div>
    </div>
  );
}
```

### Column Wrapping

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function WrapExamples() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2">wrap={true} (default)</p>
        <Row wrap={true} className="bg-gray-50">
          <Col span={6} className="bg-gray-100 p-4">Column 1</Col>
          <Col span={6} className="bg-gray-100 p-4">Column 2</Col>
          <Col span={6} className="bg-gray-100 p-4">Column 3</Col>
          <Col span={6} className="bg-gray-100 p-4">Column 4</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">wrap={false}</p>
        <Row wrap={false} className="bg-gray-50 overflow-x-auto">
          <Col span={6} className="bg-gray-100 p-4 min-w-[200px]">Column 1</Col>
          <Col span={6} className="bg-gray-100 p-4 min-w-[200px]">Column 2</Col>
          <Col span={6} className="bg-gray-100 p-4 min-w-[200px]">Column 3</Col>
          <Col span={6} className="bg-gray-100 p-4 min-w-[200px]">Column 4</Col>
        </Row>
      </div>
    </div>
  );
}
```

### Reversed Column Order

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ReverseExample() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2">Normal order</p>
        <Row className="bg-gray-50">
          <Col span={4} className="bg-gray-100 p-4">First</Col>
          <Col span={4} className="bg-gray-200 p-4">Second</Col>
          <Col span={4} className="bg-gray-300 p-4">Third</Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">reverse={true}</p>
        <Row reverse={true} className="bg-gray-50">
          <Col span={4} className="bg-gray-100 p-4">First (appears last)</Col>
          <Col span={4} className="bg-gray-200 p-4">Second (appears middle)</Col>
          <Col span={4} className="bg-gray-300 p-4">Third (appears first)</Col>
        </Row>
      </div>
    </div>
  );
}
```

### Responsive Layout Example

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ResponsiveLayout() {
  return (
    <Row spacing={4}>
      <Col 
        span={12} 
        md={6} 
        lg={4} 
        className="bg-gray-100 p-4"
      >
        <h3>Column 1</h3>
        <p>This column is full width on small screens, half width on medium screens, and one-third width on large screens.</p>
      </Col>

      <Col 
        span={12} 
        md={6} 
        lg={4} 
        className="bg-gray-100 p-4"
      >
        <h3>Column 2</h3>
        <p>This column is full width on small screens, half width on medium screens, and one-third width on large screens.</p>
      </Col>

      <Col 
        span={12} 
        md={12} 
        lg={4} 
        className="bg-gray-100 p-4"
      >
        <h3>Column 3</h3>
        <p>This column is full width on small and medium screens, and one-third width on large screens.</p>
      </Col>
    </Row>
  );
}
```

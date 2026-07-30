# Col Component

A flexible grid column component designed to work with the Row component to create responsive layouts. Based on a 12-column grid system, it provides comprehensive options for controlling column widths, offsets, and ordering across different breakpoints.

## Features

- 12-column grid system (span 1-12)
- Column offset support (0-11)
- Column ordering (including first/last)
- Responsive breakpoint support (sm, md, lg, xl)
- Full responsive control of span, offset, and order
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
| span | `1-12` | - | Number of columns to span (1-12) |
| offset | `0-11` | - | Number of columns to offset (0-11) |
| order | `number \| 'first' \| 'last'` | - | Order of the column |
| sm | `1-12` | - | Column span at the sm breakpoint (640px+) |
| md | `1-12` | - | Column span at the md breakpoint (768px+) |
| lg | `1-12` | - | Column span at the lg breakpoint (1024px+) |
| xl | `1-12` | - | Column span at the xl breakpoint (1280px+) |
| smOffset | `0-11` | - | Column offset at the sm breakpoint |
| mdOffset | `0-11` | - | Column offset at the md breakpoint |
| lgOffset | `0-11` | - | Column offset at the lg breakpoint |
| xlOffset | `0-11` | - | Column offset at the xl breakpoint |
| smOrder | `number \| 'first' \| 'last'` | - | Column order at the sm breakpoint |
| mdOrder | `number \| 'first' \| 'last'` | - | Column order at the md breakpoint |
| lgOrder | `number \| 'first' \| 'last'` | - | Column order at the lg breakpoint |
| xlOrder | `number \| 'first' \| 'last'` | - | Column order at the xl breakpoint |
| className | `string` | - | Additional CSS class for custom styling |

Additionally, the Col component accepts all standard HTML div attributes.

## Examples

### Basic Grid Columns

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function BasicColumns() {
  return (
    <div className="space-y-4">
      <Row>
        <Col span={12} className="bg-gray-100 p-4 text-center">span={12}</Col>
      </Row>

      <Row>
        <Col span={6} className="bg-gray-100 p-4 text-center">span={6}</Col>
        <Col span={6} className="bg-gray-100 p-4 text-center">span={6}</Col>
      </Row>

      <Row>
        <Col span={4} className="bg-gray-100 p-4 text-center">span={4}</Col>
        <Col span={4} className="bg-gray-100 p-4 text-center">span={4}</Col>
        <Col span={4} className="bg-gray-100 p-4 text-center">span={4}</Col>
      </Row>

      <Row>
        <Col span={3} className="bg-gray-100 p-4 text-center">span={3}</Col>
        <Col span={3} className="bg-gray-100 p-4 text-center">span={3}</Col>
        <Col span={3} className="bg-gray-100 p-4 text-center">span={3}</Col>
        <Col span={3} className="bg-gray-100 p-4 text-center">span={3}</Col>
      </Row>

      <Row>
        <Col span={2} className="bg-gray-100 p-4 text-center">span={2}</Col>
        <Col span={2} className="bg-gray-100 p-4 text-center">span={2}</Col>
        <Col span={2} className="bg-gray-100 p-4 text-center">span={2}</Col>
        <Col span={2} className="bg-gray-100 p-4 text-center">span={2}</Col>
        <Col span={2} className="bg-gray-100 p-4 text-center">span={2}</Col>
        <Col span={2} className="bg-gray-100 p-4 text-center">span={2}</Col>
      </Row>
    </div>
  );
}
```

### Column Offsets

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ColumnOffsets() {
  return (
    <div className="space-y-4">
      <Row>
        <Col span={6} offset={3} className="bg-gray-100 p-4 text-center">
          span={6} offset={3}
        </Col>
      </Row>

      <Row>
        <Col span={4} offset={2} className="bg-gray-100 p-4 text-center">
          span={4} offset={2}
        </Col>
        <Col span={4} offset={2} className="bg-gray-100 p-4 text-center">
          span={4} offset={2}
        </Col>
      </Row>

      <Row>
        <Col span={3} offset={1} className="bg-gray-100 p-4 text-center">
          span={3} offset={1}
        </Col>
        <Col span={3} offset={1} className="bg-gray-100 p-4 text-center">
          span={3} offset={1}
        </Col>
        <Col span={3} offset={1} className="bg-gray-100 p-4 text-center">
          span={3} offset={1}
        </Col>
      </Row>
    </div>
  );
}
```

### Column Ordering

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ColumnOrdering() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2">Numeric ordering</p>
        <Row>
          <Col span={4} order={3} className="bg-gray-100 p-4 text-center">
            First in DOM, order={3}
          </Col>
          <Col span={4} order={1} className="bg-gray-100 p-4 text-center">
            Second in DOM, order={1}
          </Col>
          <Col span={4} order={2} className="bg-gray-100 p-4 text-center">
            Third in DOM, order={2}
          </Col>
        </Row>
      </div>

      <div>
        <p className="mb-2">Using first/last</p>
        <Row>
          <Col span={4} order="last" className="bg-gray-100 p-4 text-center">
            First in DOM, order="last"
          </Col>
          <Col span={4} className="bg-gray-100 p-4 text-center">
            Second in DOM, no order
          </Col>
          <Col span={4} order="first" className="bg-gray-100 p-4 text-center">
            Third in DOM, order="first"
          </Col>
        </Row>
      </div>
    </div>
  );
}
```

### Responsive Columns

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ResponsiveColumns() {
  return (
    <Row spacing={4}>
      <Col 
        span={12} 
        sm={6} 
        md={4} 
        lg={3} 
        className="bg-gray-100 p-4"
      >
        <div className="p-4 border border-gray-300 rounded text-center">
          <p>span={12}</p>
          <p>sm={6}</p>
          <p>md={4}</p>
          <p>lg={3}</p>
        </div>
      </Col>

      <Col 
        span={12} 
        sm={6} 
        md={4} 
        lg={3} 
        className="bg-gray-100 p-4"
      >
        <div className="p-4 border border-gray-300 rounded text-center">
          <p>span={12}</p>
          <p>sm={6}</p>
          <p>md={4}</p>
          <p>lg={3}</p>
        </div>
      </Col>

      <Col 
        span={12} 
        sm={6} 
        md={4} 
        lg={3} 
        className="bg-gray-100 p-4"
      >
        <div className="p-4 border border-gray-300 rounded text-center">
          <p>span={12}</p>
          <p>sm={6}</p>
          <p>md={4}</p>
          <p>lg={3}</p>
        </div>
      </Col>

      <Col 
        span={12} 
        sm={6} 
        md={12} 
        lg={3} 
        className="bg-gray-100 p-4"
      >
        <div className="p-4 border border-gray-300 rounded text-center">
          <p>span={12}</p>
          <p>sm={6}</p>
          <p>md={12}</p>
          <p>lg={3}</p>
        </div>
      </Col>
    </Row>
  );
}
```

### Responsive Offsets

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ResponsiveOffsets() {
  return (
    <div className="space-y-4">
      <Row>
        <Col 
          span={12} 
          md={6} 
          mdOffset={3} 
          className="bg-gray-100 p-4 text-center"
        >
          Full width on mobile, centered on medium+
        </Col>
      </Row>

      <Row>
        <Col 
          span={6} 
          sm={4} 
          smOffset={1} 
          md={3} 
          mdOffset={2} 
          className="bg-gray-100 p-4 text-center"
        >
          Different offsets at different breakpoints
        </Col>

        <Col 
          span={6} 
          sm={4} 
          smOffset={2} 
          md={3} 
          mdOffset={2} 
          className="bg-gray-100 p-4 text-center"
        >
          Different offsets at different breakpoints
        </Col>
      </Row>
    </div>
  );
}
```

### Responsive Ordering

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ResponsiveOrdering() {
  return (
    <Row spacing={4}>
      <Col 
        span={12} 
        md={4} 
        order="last" 
        mdOrder="first"
        className="bg-gray-100 p-4"
      >
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="font-bold">First on Desktop</h3>
          <p>Last on mobile (order="last" mdOrder="first")</p>
        </div>
      </Col>

      <Col 
        span={12} 
        md={4} 
        className="bg-gray-100 p-4"
      >
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="font-bold">Always in the Middle</h3>
          <p>No order specified</p>
        </div>
      </Col>

      <Col 
        span={12} 
        md={4} 
        order="first" 
        mdOrder="last"
        className="bg-gray-100 p-4"
      >
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="font-bold">First on Mobile</h3>
          <p>Last on desktop (order="first" mdOrder="last")</p>
        </div>
      </Col>
    </Row>
  );
}
```

### Complex Layout Example

```jsx
import { Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ComplexLayout() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Row>
        <Col span={12} className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">Website Header</h1>
        </Col>
      </Row>

      {/* Hero */}
      <Row>
        <Col span={12} className="bg-blue-100 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Our Website</h2>
          <p>This is a hero section with a full-width column.</p>
        </Col>
      </Row>

      {/* Main content with sidebar */}
      <Row spacing={4}>
        {/* Sidebar - stacked on mobile, side-by-side on desktop */}
        <Col 
          span={12} 
          md={4} 
          lg={3} 
          order="last" 
          mdOrder="first"
          className="bg-gray-100 p-4"
        >
          <h3 className="font-bold mb-4">Sidebar</h3>
          <ul className="space-y-2">
            <li>Menu Item 1</li>
            <li>Menu Item 2</li>
            <li>Menu Item 3</li>
          </ul>
        </Col>

        {/* Main content */}
        <Col 
          span={12} 
          md={8} 
          lg={9}
          className="p-4"
        >
          <h3 className="text-xl font-bold mb-4">Main Content</h3>
          <p className="mb-4">This is the main content area. On mobile, it appears above the sidebar, but on desktop it appears next to the sidebar.</p>

          {/* Nested grid for content */}
          <Row spacing={4}>
            <Col span={12} md={6} className="bg-gray-50 p-4 rounded">
              <h4 className="font-bold mb-2">Feature 1</h4>
              <p>Description of feature 1.</p>
            </Col>

            <Col span={12} md={6} className="bg-gray-50 p-4 rounded">
              <h4 className="font-bold mb-2">Feature 2</h4>
              <p>Description of feature 2.</p>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Footer */}
      <Row>
        <Col span={12} className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; 2025 My Website</p>
        </Col>
      </Row>
    </div>
  );
}
```

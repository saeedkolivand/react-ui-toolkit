# Layout Components

The layout components provide a flexible grid system and container utilities for creating responsive, well-structured layouts. Based on modern CSS best practices, these components make it easy to build complex layouts that work across all device sizes.

## Components in this Category

### Container

A responsive container component that centers content and maintains consistent spacing with configurable max-width.

[View Container Documentation](./Container/README.md)

```jsx
import { Container } from '@saeedkolivand/react-ui-toolkit';

<Container maxWidth="lg">
  <h1>My Content</h1>
  <p>This content is centered and has a max-width.</p>
</Container>
```

### Row

A flexible grid row component that works in tandem with the Col component to create responsive layouts.

[View Row Documentation](./Row/README.md)

```jsx
import { Row } from '@saeedkolivand/react-ui-toolkit';

<Row justify="between" align="center" spacing={4}>
  {/* Columns go here */}
</Row>
```

### Col

A flexible grid column component designed to work with the Row component, based on a 12-column grid system.

[View Col Documentation](./Col/README.md)

```jsx
import { Col } from '@saeedkolivand/react-ui-toolkit';

<Col span={12} md={6} lg={4}>
  Column content
</Col>
```

## Grid System Features

- Based on CSS Flexbox for modern layout capabilities
- Responsive 12-column grid system
- Breakpoint system (sm, md, lg, xl) for responsive designs
- Control over column width, offset, and order at each breakpoint
- Configurable spacing between columns
- Options for alignment and justification

## Basic Grid Layout Example

```jsx
import { Container, Row, Col } from '@saeedkolivand/react-ui-toolkit';

function BasicGridLayout() {
  return (
    <Container>
      <Row spacing={4}>
        <Col span={12} md={4}>
          <div className="bg-gray-100 p-4 rounded">
            Left Column
          </div>
        </Col>

        <Col span={12} md={8}>
          <div className="bg-gray-100 p-4 rounded">
            Right Column
          </div>
        </Col>
      </Row>
    </Container>
  );
}
```

## Responsive Grid Layout Example

```jsx
import { Container, Row, Col } from '@saeedkolivand/react-ui-toolkit';

function ResponsiveGridLayout() {
  return (
    <Container>
      <Row spacing={4}>
        {/* Header spans full width */}
        <Col span={12}>
          <div className="bg-gray-800 text-white p-4 rounded">
            <h1 className="text-xl font-bold">Page Header</h1>
          </div>
        </Col>

        {/* These columns stack on mobile, side-by-side on larger screens */}
        <Col span={12} md={6} lg={4}>
          <div className="bg-gray-100 p-4 rounded">
            <h2>Column 1</h2>
            <p>This column is full width on mobile, half width on medium screens, and one-third on large screens.</p>
          </div>
        </Col>

        <Col span={12} md={6} lg={4}>
          <div className="bg-gray-100 p-4 rounded">
            <h2>Column 2</h2>
            <p>This column is full width on mobile, half width on medium screens, and one-third on large screens.</p>
          </div>
        </Col>

        <Col span={12} lg={4}>
          <div className="bg-gray-100 p-4 rounded">
            <h2>Column 3</h2>
            <p>This column is full width on mobile and medium screens, and one-third on large screens.</p>
          </div>
        </Col>

        {/* Footer spans full width */}
        <Col span={12}>
          <div className="bg-gray-800 text-white p-4 rounded text-center">
            <p>&copy; 2025 My Website</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
```

## Best Practices

1. **Start with mobile-first design**:
   - Define the default `span` prop for mobile layouts
   - Use responsive props (`sm`, `md`, `lg`, `xl`) to adjust for larger screens

2. **Use appropriate containers**:
   - Use `Container` for page-level content with consistent margins
   - Set an appropriate `maxWidth` based on your design needs

3. **Maintain a consistent grid**:
   - Try to use the 12-column system consistently
   - For most layouts, columns should add up to 12 in each row

4. **Use spacing consistently**:
   - Set `spacing` on the Row component to maintain consistent gutters
   - Use Tailwind's spacing scale for consistency (2, 4, 6, 8, etc.)

5. **Leverage column offsets for layout**:
   - Use `offset` props to create more complex layouts
   - Offsets can be used for centering content or creating asymmetrical designs

6. **Change column order when needed**:
   - Use `order` props to optimize content flow on different devices
   - Content order should prioritize the most important information on small screens

7. **Nest rows and columns for complex layouts**:
   - You can place Row components inside Col components for more complex layouts
   - Maintain the 12-column system at each nesting level

## Accessibility Considerations

- The grid system is purely visual and doesn't affect the semantic structure of your HTML
- Ensure you're using appropriate semantic HTML elements inside your grid components
- Consider the reading order of your content when using order properties
- Test your layouts with screen readers to ensure content is accessible

## Documentation

Each component has its own detailed README file with:

- Feature overview
- Basic usage examples
- API reference
- Advanced examples

For more comprehensive documentation and live examples, visit the [Storybook documentation site](https://saeedkolivand.github.io/react-ui-toolkit).

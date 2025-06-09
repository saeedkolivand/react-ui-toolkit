# React UI Toolkit Examples

This directory contains example applications demonstrating how to use the React UI Toolkit components in real-world scenarios.

## Basic App Example

The `basic-app` directory contains a simple login form example that demonstrates:

- Setting up the StylesProvider
- Using form components (Input)
- Using Button with loading state
- Using Card with header, body, and footer sections
- Implementing the ThemeToggle for dark/light mode switching

### Running the Basic Example

1. Clone this repository
2. Navigate to the examples/basic-app directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Creating Your Own Application

To use React UI Toolkit in your own project:

1. Install the package:
   ```bash
   npm install @saeedkolivand/react-ui-toolkit
   ```

2. Import the CSS in your entry file:
   ```javascript
   import '@saeedkolivand/react-ui-toolkit/dist/styles.css';
   ```

3. Import and use components:
   ```jsx
   import { Button, Input } from '@saeedkolivand/react-ui-toolkit';

   function MyComponent() {
     return (
       <div>
         <Input placeholder="Enter your name" />
         <Button variant="primary">Submit</Button>
       </div>
     );
   }
   ```

## Additional Resources

For more detailed examples and documentation, see:

- [Usage Guide](/docs/usage-guide.md)
- [Component API Reference](/docs/api-reference.md)
- [Storybook Documentation](https://react-ui-toolkit-storybook.netlify.app)

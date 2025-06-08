# React UI Toolkit

A modern React UI toolkit with TypeScript support.

## Installation

```bash
npm install @saeedkolivand/react-ui-toolkit
# or
yarn add @saeedkolivand/react-ui-toolkit
```

## Usage

### Importing Styles

You have two options for importing styles:

#### Option 1: Direct CSS Import

Import the CSS file in your application entry point (e.g., `index.js` or `App.js`):

```javascript
import '@saeedkolivand/react-ui-toolkit/dist/styles.css';
```

#### Option 2: Use the StylesProvider (Recommended)

Wrap your application with the StylesProvider which will automatically load the styles:

```jsx
import { StylesProvider } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <StylesProvider>
      <YourApplication />
    </StylesProvider>
  );
}
```

For Next.js or other SSR frameworks, use the SSR-compatible provider:

```jsx
import { StylesProviderSSR } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <StylesProviderSSR>
      <YourApplication />
    </StylesProviderSSR>
  );
}
```

#### Option 3: Higher-Order Component

Alternatively, you can use the withStyles HOC to wrap your root component:

```jsx
import { withStyles } from '@saeedkolivand/react-ui-toolkit';

function YourApp() {
  return <div>Your application content</div>;
}

export default withStyles(YourApp);
```

### Using Components

```jsx
import { Button, Input } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <div>
      <Input placeholder="Enter your name" />
      <Button>Click me</Button>
    </div>
  );
}
```

## Components

The library includes the following component categories:

- Base Components (Button, Input, Textarea, Select, Checkbox, Radio, Switch)
- Layout Components (Container, Row, Col)
- Feedback Components (Alert, Badge, Progress, Spinner, Avatar)
- Navigation Components (Modal, Drawer, Dropdown, Accordion, Tabs)

## License

MIT
### Development Workflow

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

### Pre-commit Hooks

This project uses Husky for pre-commit hooks. Before each commit, it will:
- Run ESLint
- Run Prettier
- Run tests
- Check TypeScript types
- Build the project

## TODO

1. ESLint Configuration
   - [x] Move to JSON configuration
   - [ ] Fix module system conflicts
   - [ ] Add proper React 18 rules

2. Jest Configuration
   - [ ] Fix ESM module handling
   - [ ] Add proper test environment setup
   - [ ] Add test coverage reporting

3. Build System
   - [ ] Verify Rollup configuration
   - [ ] Add TypeScript path aliases
   - [ ] Improve CSS/SCSS module handling

4. Husky Integration
   - [ ] Add back test running
   - [ ] Add type checking
   - [ ] Add build verification
   - [ ] Add commit message linting

5. Documentation
   - [x] Add basic README
   - [ ] Add contributing guidelines
   - [ ] Add component documentation
   - [ ] Add changelog

## License

MIT © [Saeed Kolivand](https://github.com/saeedkolivand) 
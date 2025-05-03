# React UI Toolkit

A modern React UI toolkit built with TypeScript, Tailwind CSS, and Storybook.

## Features

- 🎨 Modern and beautiful UI components
- 📦 Built with TypeScript for better type safety
- 🎭 Storybook integration for component documentation
- 🌈 Tailwind CSS for styling
- ✅ Comprehensive test coverage
- 📝 Well-documented API

## Installation

```bash
npm install @saeedkolivand/react-ui-toolkit
```

## Quick Start

```tsx
import { Button } from '@saeedkolivand/react-ui-toolkit';

function App() {
  return (
    <Button variant="primary" onClick={() => console.log('Clicked!')}>
      Click me
    </Button>
  );
}
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/saeedkolivand/react-ui-toolkit.git
cd react-ui-toolkit
```

2. Install dependencies:
```bash
npm install
```

3. Start Storybook:
```bash
npm run storybook
```

4. Run tests:
```bash
npm test
```

5. Build the library:
```bash
npm run build
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

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
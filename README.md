# React UI Toolkit

A modern React UI toolkit built with TypeScript, Tailwind CSS, and SCSS Modules. Features responsive design, dark mode support, and tree-shakable components.

## Features

- 🎨 Modern, clean design with Tailwind CSS
- 📱 Built-in responsive design
- 🌙 Dark mode support
- 🌳 Tree-shakable components
- 💅 SCSS Modules support
- 📦 TypeScript declarations
- 📚 Storybook documentation
- ✨ Fully accessible components

## Installation

```bash
npm install react-ui-toolkit
# or
yarn add react-ui-toolkit
```

## Usage

```tsx
import { Button, Card, Alert } from 'react-ui-toolkit';

function App() {
  return (
    <div>
      <Card variant="primary">
        <Alert variant="success" title="Success!">
          Your action was completed successfully.
        </Alert>
        <Button variant="primary">Click me</Button>
      </Card>
    </div>
  );
}
```

## Components

- **Feedback**
  - Alert - Contextual feedback messages
  - Badge - Small count and labeling component
  - Progress - Progress bars and spinners
  - Spinner - Loading indicator
  - Toast - Notification messages
  - Avatar - User avatars with status indicators

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-ui-toolkit.git
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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Scripts

- `npm run dev` - Start development environment
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook

## License

MIT © [Your Name] 
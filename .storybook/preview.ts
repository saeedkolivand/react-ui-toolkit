import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Theme',
          'Components',
          ['Base', 
            [
              'Button',
              'Input',
              'Textarea',
              'Select',
              'Checkbox',
              'Radio',
              'Switch',
              'Tooltip',
              'Icon',
              'Divider',
              'Tag',
              'Table',
              '*'
            ]
          ],
          ['Feedback', 
            [
              'Alert',
              'Badge',
              'Progress',
              'Spinner',
              'Avatar',
              '*'
            ]
          ],
          ['Layout', '*'],
          ['Navigation', '*'],
          'Form',
          'Hooks',
          'Utilities',
          'Examples',
          '*'
        ],
      },
    },
  },
};

export default preview;
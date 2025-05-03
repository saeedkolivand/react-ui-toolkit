import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../src/components/base/Icon/Icon';

const meta: Meta = {
  title: 'Documentation/Get Started',
  parameters: {
    options: { showPanel: false },
    controls: { hideNoControlsWarning: true },
  },
};

export default meta;
type Story = StoryObj;

export const GetStarted: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Rainbow gradient background element */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-blue-500/20 blur-3xl opacity-30"></div>

      <div className="relative p-8 max-w-4xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
          <h1 className="text-5xl text-white font-bold mb-6 bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 bg-clip-text text-transparent">
            Get Started
          </h1>
          <p className="text-xl text-white mb-8">
            Learn how to install and use React UI Toolkit in your project.
          </p>
        </div>

        <div className="space-y-8">
          {/* Installation Section */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Icon name="plus" size="lg" className="text-red-400 mr-2" />
              Installation
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <code className="text-sm text-white">npm install react-ui-toolkit</code>
              </div>
              <p className="text-white">Or using yarn:</p>
              <div className="bg-gray-700 rounded-lg p-4">
                <code className="text-sm text-white">yarn add react-ui-toolkit</code>
              </div>
            </div>
          </div>

          {/* Setup Section */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Icon name="edit" size="lg" className="text-yellow-400 mr-2" />
              Setup
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">1. Import Styles</h3>
              <p className="text-white">Import the CSS file in your main application file:</p>
              <div className="bg-gray-700 rounded-lg p-4">
                <code className="text-sm text-white">
                  import &apos;react-ui-toolkit/dist/styles.css&apos;;
                </code>
              </div>

              <h3 className="text-xl font-semibold text-white">2. Configure Tailwind</h3>
              <p className="text-white">Add the following to your tailwind.config.js:</p>
              <div className="bg-gray-700 rounded-lg p-4">
                <code className="text-sm text-white">
                  {`module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-ui-toolkit/**/*.{js,jsx,ts,tsx}'
  ],
  // ... rest of your config
}`}
                </code>
              </div>
            </div>
          </div>

          {/* Usage Section */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Icon name="search" size="lg" className="text-blue-400 mr-2" />
              Basic Usage
            </h2>
            <div className="space-y-4">
              <p className="text-white">Import and use components in your React application:</p>
              <div className="bg-gray-700 rounded-lg p-4">
                <code className="text-sm text-white">
                  {`import { Button } from 'react-ui-toolkit';

function App() {
  return (
    <Button variant="primary">
      Click me
    </Button>
  );
}`}
                </code>
              </div>
            </div>
          </div>

          {/* Next Steps Section */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Icon name="chevronRight" size="lg" className="text-green-400 mr-2" />
              Next Steps
            </h2>
            <ul className="space-y-2 text-white">
              <li className="flex items-center">
                <Icon name="edit" size="md" className="text-green-400 mr-2" />
                Explore the component library
              </li>
              <li className="flex items-center">
                <Icon name="edit" size="md" className="text-green-400 mr-2" />
                Check out the customization options
              </li>
              <li className="flex items-center">
                <Icon name="edit" size="md" className="text-green-400 mr-2" />
                Learn about theming and styling
              </li>
              <li className="flex items-center">
                <Icon name="edit" size="md" className="text-green-400 mr-2" />
                Read the API documentation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/base/Button/Button';
import { Icon } from '../src/components/base/Icon/Icon';

const meta: Meta = {
  title: 'Welcome',
  parameters: {
    options: { showPanel: false },
    controls: { hideNoControlsWarning: true },
  },
};

export default meta;
type Story = StoryObj;

export const Introduction: Story = {
  render: () => {
    const handleGetStarted = () => {
      window.location.href = '/?path=/docs/documentation-get-started--get-started';
    };

    const handleViewComponents = () => {
      // Navigate to the components overview
      window.location.href = '/?path=/docs/components--docs';
    };

    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Rainbow gradient background element */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-blue-500/20 blur-3xl opacity-30"></div>
        
        <div className="relative p-8 max-w-4xl mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
            <h1 className="text-5xl text-white font-bold mb-6 bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 bg-clip-text text-transparent">
              Welcome to React UI Toolkit
            </h1>
            <p className="text-xl text-white mb-8">
              A collection of beautiful, accessible, and customizable React components built with TypeScript and Tailwind CSS.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Icon name="menu" size="lg" className="text-red-400 mr-2" />
                Getting Started
              </h2>
              <p className="text-white leading-relaxed">
                Browse through the component library using the sidebar navigation. Each component comes with
                examples, documentation, and interactive controls.
              </p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Icon name="globe" size="lg" className="text-yellow-400 mr-2" />
                Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-center text-white">
                  <Icon name="edit" size="md" className="text-green-400 mr-2" />
                  TypeScript support for type safety
                </li>
                <li className="flex items-center text-white">
                  <Icon name="edit" size="md" className="text-green-400 mr-2" />
                  Tailwind CSS for styling
                </li>
                <li className="flex items-center text-white">
                  <Icon name="edit" size="md" className="text-green-400 mr-2" />
                  Fully customizable components
                </li>
                <li className="flex items-center text-white">
                  <Icon name="edit" size="md" className="text-green-400 mr-2" />
                  Responsive design
                </li>
                <li className="flex items-center text-white">
                  <Icon name="edit" size="md" className="text-green-400 mr-2" />
                  Accessibility support
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Icon name="search" size="lg" className="text-blue-400 mr-2" />
                Usage
              </h2>
              <p className="text-white leading-relaxed mb-4">
                To use these components in your project, import them from the package and customize them
                according to your needs.
              </p>
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <code className="text-sm text-white">
                  import {'{'} Button {'}'} from 'react-ui-toolkit';
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
}; 
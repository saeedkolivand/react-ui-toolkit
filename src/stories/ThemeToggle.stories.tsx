import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/base/Button/Button';
import { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Theme/Theme Toggle',
  component: ThemeToggle,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Template: StoryFn = () => (
  <div className="min-h-screen p-8">
    <ThemeToggle />
    <div className="mt-16 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Theme Toggle Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg shadow-sm dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Light Mode Components
          </h2>
          <div className="space-y-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-sm dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Dark Mode Components
          </h2>
          <div className="space-y-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Default = Template.bind({});
Default.parameters = {
  docs: {
    description: {
      story:
        'A demonstration of the theme toggle functionality with example components in both light and dark modes.',
    },
  },
};

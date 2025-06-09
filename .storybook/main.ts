import type { StorybookConfig } from '@storybook/react-vite';

// Get the repository name from package.json or environment
const getBasePath = () => {
  // For GitHub Pages, the base path should be the repository name
  // Example: https://username.github.io/repo-name/ -> '/repo-name/'
  // If this is deployed elsewhere, you can leave it as '/' or configure as needed
  const repoName = process.env.STORYBOOK_BASE_PATH || '/react-ui-toolkit/';
  return process.env.NODE_ENV === 'production' ? repoName : '/';
};

const config: StorybookConfig = {
  stories: [
    './Introduction.stories.tsx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Add base path for GitHub Pages
    config.base = getBasePath();
    return config;
  },
};
export default config;

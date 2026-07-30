import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";

// On GitHub Pages the landing page owns the site root, so Storybook is published
// under a sub-path. Set STORYBOOK_BASE_PATH in CI to override; "/" for local dev.
const base = process.env.STORYBOOK_BASE_PATH || "/";

// Storybook 10 loads this file as ESM, so there is no __dirname.
const srcDir = fileURLToPath(new URL("../src", import.meta.url));

const config: StorybookConfig = {
  stories: ["./Introduction.stories.tsx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  docs: {
    defaultName: "Introduction",
  },
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async config => {
    config.base = base;
    config.resolve = {
      ...config.resolve,
      alias: { ...config.resolve?.alias, "@": srcDir },
    };
    return config;
  },
};
export default config;

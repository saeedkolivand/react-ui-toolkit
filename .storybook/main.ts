import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

// On GitHub Pages the landing page owns the site root, so Storybook is published
// under a sub-path. Set STORYBOOK_BASE_PATH in CI to override; "/" for local dev.
const base = process.env.STORYBOOK_BASE_PATH || "/";

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
    // The "@/*" alias comes from tsconfig.json via this plugin — Storybook 10 loads
    // this file as ESM, so there is no __dirname to build the alias by hand.
    config.plugins = [...(config.plugins ?? []), tsconfigPaths()];
    return config;
  },
};
export default config;

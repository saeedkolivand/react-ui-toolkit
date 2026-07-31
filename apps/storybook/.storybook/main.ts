import type { StorybookConfig } from "@storybook/react-vite";

// The landing page owns the site root, so Storybook is published under a
// sub-path. CI sets STORYBOOK_BASE_PATH; "/" for local dev.
const base = process.env.STORYBOOK_BASE_PATH || "/";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.tsx"],
  docs: { defaultName: "Docs" },
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async config => {
    config.base = base;
    return config;
  },
};

export default config;

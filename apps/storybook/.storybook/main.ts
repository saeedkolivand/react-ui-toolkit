import type { StorybookConfig } from "@storybook/react-vite";

// The landing page owns the site root, so Storybook is published under a
// sub-path. CI sets STORYBOOK_BASE_PATH; "/" for local dev.
const base = process.env.STORYBOOK_BASE_PATH || "/";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.tsx"],
  docs: { defaultName: "Docs" },
  // `addon-a11y` runs axe against every story as you browse it. It is a dev
  // dependency of this private app and never reaches a published package — the
  // zero-runtime-dependency rule is about what a consumer downloads.
  //
  // It earns its place here specifically because v2 hand-rolls every ARIA
  // attribute rather than inheriting them from a behaviour library, so there is
  // no longer anything upstream getting the roles right on our behalf.
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async config => {
    config.base = base;
    return config;
  },
};

export default config;

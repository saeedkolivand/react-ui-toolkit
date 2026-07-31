import type { Preview } from "@storybook/react-vite";
// The real shipped stylesheet — Storybook renders exactly what a consumer gets.
import "@crosskit-ui/styles";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: { order: ["Introduction", "Data attributes", "Components", "*"] },
    },
  },
  // Storybook is the review surface for @crosskit-ui/styles, so the theme
  // toggle has to flip the real [data-theme] attribute the stylesheet keys on,
  // not swap a preview background colour.
  globalTypes: {
    theme: {
      description: "Theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals as { theme?: string }).theme ?? "light";
      document.documentElement.setAttribute("data-theme", theme);
      document.body.style.background = "var(--ck-bg)";
      document.body.style.color = "var(--ck-fg)";
      return Story();
    },
  ],
};

export default preview;

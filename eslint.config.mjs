import js from "@eslint/js";
import tseslint from "typescript-eslint";
// @eslint-react replaces eslint-plugin-react, which does not support ESLint 10
// (it calls context.getFilename(), removed in v10) and has no release that does.
import react from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier/flat";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "landing-dist/**",
      "storybook-static/**",
      "coverage/**",
      // Standalone sample apps with their own toolchains — not part of this build.
      "examples/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.recommended,
  reactHooks.configs.flat.recommended,
  ...storybook.configs["flat/recommended"],
  prettierConfig,

  {
    plugins: { prettier: prettierPlugin, "unused-imports": unusedImports },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
    rules: {
      "prettier/prettier": "error",

      // Both React plugins ship rules-of-hooks. Keep eslint-plugin-react-hooks'
      // version — it is the canonical one and understands Storybook's `render`
      // functions, which @eslint-react's flags as non-components.
      "@eslint-react/rules-of-hooks": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],

      // ponytail: eslint-plugin-react-hooks v7 ships the React Compiler ruleset on top of the
      // two rules v4 enforced. The new ones fire on the standard portal-`mounted` and
      // derived-state-sync patterns in Tooltip/NotificationProvider/Tabs, which are correct.
      // Kept at "warn" so they stay visible without blocking CI; promote to "error" if/when
      // those components are reworked for the compiler.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/set-state-in-render": "warn",
    },
  },

  {
    files: ["**/*.test.*", "**/*.spec.*"],
    rules: { "@typescript-eslint/no-empty-function": "off" },
  }
);

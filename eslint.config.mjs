import js from "@eslint/js";
import tseslint from "typescript-eslint";
// @eslint-react replaces eslint-plugin-react, which does not support ESLint 10
// (it calls context.getFilename(), removed in v10) and has no release that does.
import react from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier/flat";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.svelte-kit/**",
      "**/storybook-static/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/.astro/**",
      // v0 source kept only as porting reference; deleted at v1.0.0.
      "legacy/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    plugins: { prettier: prettierPlugin, "unused-imports": unusedImports },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
  },

  // React rules apply ONLY to the React adapter. Applying them repo-wide would
  // flag Vue/Svelte/Angular code that merely looks like JSX or hooks.
  {
    files: ["packages/react/**/*.{ts,tsx}", "apps/storybook/**/*.{ts,tsx}"],
    extends: [react.configs.recommended, reactHooks.configs.flat.recommended],
    rules: {
      // @eslint-react and eslint-plugin-react-hooks ship 12 rules under identical
      // names, so every hook problem was being reported twice. eslint-plugin-react-hooks
      // is the authority here: it is the canonical React implementation, and its
      // rules-of-hooks understands Storybook's `render` functions, which
      // @eslint-react's flags as non-components.
      //
      // Listed explicitly rather than derived from the plugin's own
      // disable-conflict config — that one turns off the react-hooks rules instead,
      // i.e. the opposite of what is wanted, and a literal list cannot silently
      // change what is enforced when the plugin is bumped.
      "@eslint-react/error-boundaries": "off",
      "@eslint-react/exhaustive-deps": "off",
      "@eslint-react/globals": "off",
      "@eslint-react/immutability": "off",
      "@eslint-react/purity": "off",
      "@eslint-react/refs": "off",
      "@eslint-react/rules-of-hooks": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/set-state-in-render": "off",
      "@eslint-react/static-components": "off",
      "@eslint-react/unsupported-syntax": "off",
      "@eslint-react/use-memo": "off",
    },
  },

  // The Angular binding re-implements Zag's own loosely-typed machine contract;
  // `any` there mirrors upstream and is not worth 40 casts to launder.
  {
    files: ["packages/zag-angular/**/*.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },

  {
    files: ["**/*.test.*", "**/*.spec.*"],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
    rules: { "@typescript-eslint/no-empty-function": "off" },
  },
);

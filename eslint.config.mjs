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

      // These three suggest React 19-only APIs, but peerDependencies are
      // "^18.0.0 || ^19.0.0". Adopting any of them breaks every React 18
      // consumer, so they stay off until the peer range drops 18 — a major.
      //   no-forward-ref     — a React 18 function component does not receive
      //                        `ref` as a prop; dropping forwardRef silently
      //                        hands consumers a null ref. Used by 10 components.
      //   no-context-provider — `<Context>` as a provider is React 19 only.
      //   no-use-context      — `use()` is React 19 only.
      "@eslint-react/no-forward-ref": "off",
      "@eslint-react/no-context-provider": "off",
      "@eslint-react/no-use-context": "off",

      // Tooltip clones its child to attach the trigger ref and handlers to an
      // arbitrary element. That is the standard implementation of this pattern —
      // the alternative, always wrapping in a span, changes consumers' DOM.
      "@eslint-react/no-clone-element": "off",
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

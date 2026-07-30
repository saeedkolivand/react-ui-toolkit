# [1.0.0](https://github.com/saeedkolivand/react-ui-toolkit/compare/v0.1.18...v1.0.0) (2026-07-30)


* feat(react19)!: drop React 18 and lint strict ([fec81d4](https://github.com/saeedkolivand/react-ui-toolkit/commit/fec81d4fdf5744ce95d2ae3c66c0d92afab3ef60))


### Bug Fixes

* **a11y:** give Tabs and Accordion items real reconciliation identity ([a690b0c](https://github.com/saeedkolivand/react-ui-toolkit/commit/a690b0c25b868ec48d20d0592cae1df1e8a12ebf))
* **deps:** drop vite-tsconfig-paths, resolve the Storybook alias directly ([cffeae9](https://github.com/saeedkolivand/react-ui-toolkit/commit/cffeae949888b00569c0c06638627bc4c4c44588))
* **gitattributes:** normalise .mjs, .css, .html and .yml to LF ([fb0cc7e](https://github.com/saeedkolivand/react-ui-toolkit/commit/fb0cc7ea5a8a62a8576f154620d6d9b9702a29ca))
* **lint:** make eslint-plugin-react-hooks the authority on hook rules ([e07f571](https://github.com/saeedkolivand/react-ui-toolkit/commit/e07f5718a3ef22e8cfa098c7ca8b676a09cc5bc5)), closes [#10](https://github.com/saeedkolivand/react-ui-toolkit/issues/10)
* **lint:** replace eslint-plugin-react with [@eslint-react](https://github.com/eslint-react) for ESLint 10 ([5ecc18c](https://github.com/saeedkolivand/react-ui-toolkit/commit/5ecc18ce68936fb0cec1e5f29e6cd81d64f30613))
* **theme:** apply the dark class so dark mode actually works ([45b51c2](https://github.com/saeedkolivand/react-ui-toolkit/commit/45b51c26f206866a2874eee4d83fa609488cbc9c))


### BREAKING CHANGES

* React 18 is no longer supported. peerDependencies now require
react and react-dom ^19.0.0. Components receive `ref` as a normal prop instead
of through forwardRef, and the providers use React 19's <Context> and use().
React 18 consumers should pin 0.x.

# Changelog

## 0.1.8 (2025-06-09)

### Bug Fixes

- Fixed Button component visibility issue where primary buttons were only visible on hover
- Fixed CSS loading issues in published package
- Added DEFAULT color to primary in Tailwind config
- Improved StylesProvider to better handle CSS loading
- Added fallback to unpkg CDN for CSS loading

## 0.1.7 (2025-06-08)

### Bug Fixes

- Fixed CSS compilation issues for better consumption in external projects
- Enhanced the build system to ensure all styles are properly included in the output
- Added clear documentation about CSS imports

## 0.1.6 (2025-06-08)

### Features

- Added StylesProvider component to auto-load styles without explicit import
- Added StylesProviderSSR for Next.js and other SSR frameworks
- Added withStyles and withStylesSSR HOCs as alternative ways to load styles
- Improved barrel file architecture for easier imports
- Added Ant Design-style Tooltip component with Framer Motion animations
- Added advanced placement options for Tooltip (12 different positions)
- Added color customization for Tooltip with predefined theme colors
- Added support for multiple trigger types for Tooltip (hover, click, focus, contextMenu)
- Added flexible width options for Tooltip: auto-width or fixed-width

### Bug Fixes

- Fixed Tooltip positioning issues by implementing a portal-based approach
- Improved Tooltip positioning calculations to better handle edge cases
- Added positioning utilities for better handling of UI elements that need precise positioning
- Fixed issue with Tooltip on disabled elements
- Added support for controlled Tooltip visibility
- Fixed Tooltip arrow color to properly match the tooltip background

## 0.1.5 (2025-06-08)

### Bug Fixes

- Fixed CSS compilation issues for better consumption in external projects
- Enhanced the build system to ensure all styles are properly included in the output
- Added clear documentation about CSS imports

### Features

- Added global.css file that imports all component styles
- Added postinstall notification to remind users about importing CSS

## 0.1.4 (Previous Release)

- Initial public release

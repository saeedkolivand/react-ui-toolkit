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

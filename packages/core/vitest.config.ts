import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // jsdom rather than node: `isFocusVisible` narrows on `Element`, which only
    // exists with a DOM. Nothing else here needs one.
    environment: "jsdom",
    globals: true,
  },
});

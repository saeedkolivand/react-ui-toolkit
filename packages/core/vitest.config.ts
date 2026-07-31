import { defineConfig } from "vitest/config";

/**
 * Pinned so the date engine's daylight-saving tests actually exercise one.
 *
 * CI runners are UTC, which has no DST — so `addDays` across a shift, and the
 * midnight-to-midnight rounding `diffInDays` guards against, would both pass
 * without ever reaching the case they exist for. Europe/Berlin shifts on the
 * last Sundays of March and October, which is what those tests use.
 *
 * Set here rather than in the `test` script because Node reads `TZ` at startup
 * and `TZ=… vitest` is not portable to a Windows shell. `calendar.test.ts`
 * asserts this took effect, so breaking the pin fails loudly rather than
 * quietly making those tests vacuous.
 */
process.env.TZ = "Europe/Berlin";

export default defineConfig({
  test: {
    // jsdom rather than node: `isFocusVisible` narrows on `Element`, which only
    // exists with a DOM. Nothing else here needs one.
    environment: "jsdom",
    globals: true,
  },
});

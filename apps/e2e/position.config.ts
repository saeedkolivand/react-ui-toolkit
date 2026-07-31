import { defineConfig } from "@playwright/test";

/**
 * The suites that need one browser and one server, not the four-server rig.
 *
 * `position.ts` is framework-free, so proving it does not need the parity rig —
 * and booting all four to test rect maths would make the tightest feedback loop
 * in the project one of the slowest. `overlay.spec.ts` joins it for a different
 * reason: what it asserts is browser behaviour every adapter shares rather than
 * anything that differs between them, and it needs a real layout and a real
 * `inert` implementation, which jsdom has neither of.
 */
export default defineConfig({
  testDir: "./specs",
  testMatch: /(position|overlay)\.spec\.ts$/,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: {
    viewport: { width: 1000, height: 800 },
    baseURL: "http://localhost:4174",
  },
  webServer: {
    command: "pnpm --filter @crosskit-ui/playground-react dev",
    url: "http://localhost:4174/overlay.html",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});

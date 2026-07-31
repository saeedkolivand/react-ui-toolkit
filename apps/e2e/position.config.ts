import { defineConfig } from "@playwright/test";

/**
 * The positioner suite runs alone.
 *
 * `position.ts` is framework-free, so proving it does not need the four-server
 * parity rig — and booting all four to test rect maths would make the tightest
 * feedback loop in the project one of the slowest.
 */
export default defineConfig({
  testDir: "./specs",
  testMatch: "position.spec.ts",
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: {
    viewport: { width: 1000, height: 800 },
    baseURL: "http://localhost:4174",
  },
  webServer: {
    command: "pnpm --filter @crosskit-ui/playground-react dev",
    url: "http://localhost:4174/position.html",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});

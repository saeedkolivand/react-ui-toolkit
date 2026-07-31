import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "../../packages/zag-angular/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://localhost:4173",
    // Entry/exit animations are real CSS here, and a test that clicks mid
    // animation is timing the animation rather than the behaviour. The library
    // collapses every duration to 1ms under prefers-reduced-motion, so this
    // makes runs deterministic using a path consumers actually get.
    reducedMotion: "reduce",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

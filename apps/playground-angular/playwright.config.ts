import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "../../packages/zag-angular/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

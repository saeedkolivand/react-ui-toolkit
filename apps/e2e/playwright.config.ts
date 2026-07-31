import { defineConfig } from "@playwright/test";

/**
 * One suite, four servers.
 *
 * Every playground renders the same page, so the specs never branch on which
 * framework they are talking to — the framework is a base URL and nothing else.
 * That is the whole point: if an assertion needed a per-framework special case,
 * the adapters would have diverged.
 */
export const FRAMEWORKS = [
  { name: "react", url: "http://localhost:4174", filter: "@crosskit-ui/playground-react" },
  { name: "vue", url: "http://localhost:4175", filter: "@crosskit-ui/playground-vue" },
  { name: "svelte", url: "http://localhost:4176", filter: "@crosskit-ui/playground-svelte" },
  { name: "angular", url: "http://localhost:4173", filter: "@crosskit-ui/playground-angular" },
] as const;

export default defineConfig({
  testDir: "./specs",
  // The positioner and overlay suites run alone under browser.config.ts,
  // against a single server and its own baseURL. Without this they are collected
  // here too — where there is no baseURL at all, so every `page.goto("/…html")`
  // throws, dozens of times.
  testIgnore: /(position|overlay)\.spec\.ts$/,
  // In CI: an HTML report to upload on failure, plus inline annotations. The
  // failure output here names a property and two values, so having it attached
  // to the run is the difference between fixing it and re-running it locally.
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  fullyParallel: false,
  workers: 1,
  // A fixed viewport and no animation: the parity spec compares screenshots
  // between frameworks, so anything that can move between two page loads is a
  // false positive.
  use: {
    viewport: { width: 1000, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  },
  webServer: FRAMEWORKS.map(framework => ({
    command: `pnpm --filter ${framework.filter} dev`,
    url: framework.url,
    reuseExistingServer: true,
    timeout: 180_000,
  })),
});

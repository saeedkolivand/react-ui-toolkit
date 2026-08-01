import { defineConfig } from "@playwright/test";

/**
 * The suites that need one browser and one server, not the four-server rig.
 *
 * `test:browser` builds every dependency of the harness playground rather than
 * naming them one by one — `^...` is "this package's dependencies, not the
 * package itself", so adding an import to a harness cannot leave the command
 * measuring a stale `dist`. Trap 2 in CLAUDE.md, which has produced a false
 * green twice: the playgrounds import built output, and `overlay.spec.ts`
 * asserts pure CSS layout, so a stale stylesheet could invert its result
 * silently.
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
  testMatch: /(position|overlay|anchored|reduced-motion)\.spec\.ts$/,
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

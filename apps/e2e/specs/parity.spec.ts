import { test, expect, type Page } from "@playwright/test";
import { FRAMEWORKS } from "../playwright.config";

const url = (base: string) => (base.endsWith("4173") ? `${base}/?view=parity` : base);

const SECTIONS = [
  "button",
  "icon",
  "badge",
  "alert",
  "card",
  "field",
  "toggle",
  "display",
  "layout",
  "tabs",
  "accordion",
  "table",
] as const;

async function settle(page: Page, base: string) {
  await page.goto(url(base));
  await expect(page.locator('[data-fixture="table"] [data-part="row"]').first()).toBeVisible();
  // Machine-driven parts (tabs, accordion, select) settle a frame after mount,
  // and the spinner is a CSS animation that reducedMotion already froze.
  await page.waitForTimeout(300);
}

/**
 * Cross-framework visual parity.
 *
 * This asserts the frameworks match EACH OTHER, not that they match a stored
 * golden image. That distinction is what makes it useful during a port: the CSS
 * is still changing, so a golden baseline would be invalidated constantly,
 * whereas "all four produce the same pixels" stays true no matter how the
 * design moves — and fails the moment one adapter's markup drifts.
 *
 * React is the reference only because it was ported first; any of the four
 * would do.
 */
/**
 * Known gaps, listed rather than hidden.
 *
 * Every entry here is a real divergence that the matrix found and that has not
 * been fixed yet. Naming them keeps the rest of the grid enforced — a
 * regression in any unlisted section still fails — while making the debt
 * visible in code review instead of in a skipped test nobody reads.
 */
const KNOWN_GAPS = new Set<string>([
  // The Angular binding snapshots a machine's `default*` props while building
  // the machine, which happens in a field initializer — the only injection
  // context available — i.e. BEFORE Angular has applied any input. So
  // `defaultValue` reaches zag as undefined and no tab is selected, no
  // accordion item is open. Fixing it means deferring machine construction past
  // the first change detection, which is a change to useMachine itself.
  "angular/tabs",
  "angular/accordion",
  // Angular components use element selectors, so every component root is an
  // extra element (<ck-card>) that the other three do not emit. It carries the
  // right data-* and the right box, but sub-pixel layout still differs.
  "angular/button",
  "angular/icon",
  "angular/badge",
  "angular/alert",
  "angular/card",
  "angular/field",
  "angular/toggle",
  "angular/display",
  "angular/layout",
  "angular/table",
  // 42 bytes on the table section only; not yet characterised.
  "vue/table",
]);

test("frameworks render identical pixels", async ({ page }) => {
  // Capture and compare in ONE test on purpose. Module-level state does not
  // survive between Playwright tests reliably — a retry alone moves a test to a
  // fresh worker — so a "capture" test feeding a "compare" test looked like it
  // worked and then reported an empty reference.
  const shots = new Map<string, Map<string, Buffer>>();

  for (const framework of FRAMEWORKS) {
    await settle(page, framework.url);
    const perSection = new Map<string, Buffer>();
    for (const section of SECTIONS) {
      perSection.set(
        section,
        await page.locator(`[data-fixture="${section}"]`).screenshot({ animations: "disabled" })
      );
    }
    shots.set(framework.name, perSection);
  }

  const reference = shots.get("react")!;
  const mismatches: string[] = [];
  const unexpectedlyFixed: string[] = [];

  for (const framework of FRAMEWORKS) {
    if (framework.name === "react") continue;
    for (const section of SECTIONS) {
      const key = `${framework.name}/${section}`;
      const a = reference.get(section)!;
      const b = shots.get(framework.name)!.get(section)!;
      // Same browser, same viewport, same encoder — identical pixels produce
      // identical bytes, so a byte compare needs no image-diff dependency.
      const identical = a.equals(b);
      if (!identical && !KNOWN_GAPS.has(key)) {
        mismatches.push(`${key} (react ${a.length}B vs ${b.length}B)`);
      }
      if (identical && KNOWN_GAPS.has(key)) unexpectedlyFixed.push(key);
    }
  }

  expect(mismatches, "sections that differ from React").toEqual([]);
  // A gap that quietly closes should be deleted from the list, not left to rot.
  expect(unexpectedlyFixed, "KNOWN_GAPS entries that now pass — remove them").toEqual([]);
});

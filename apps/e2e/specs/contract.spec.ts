import { test, expect, type Page } from "@playwright/test";
import { FRAMEWORKS } from "../playwright.config";

const url = (base: string) => (base.endsWith("4173") ? `${base}/?view=parity` : base);

const ready = async (page: Page, base: string) => {
  await page.goto(url(base));
  await expect(page.locator('[data-fixture="table"] [data-part="row"]').first()).toBeVisible();
};

/**
 * The DOM contract, asserted identically against all four adapters.
 *
 * Not "does React work" — every one of these ran green in the unit tests. This
 * asks whether the four adapters emit the SAME markup, which is the class of
 * bug ("the Vue adapter forgot data-size") that per-framework unit tests
 * structurally cannot catch.
 */
for (const framework of FRAMEWORKS) {
  test.describe(framework.name, () => {
    test("every component root carries its scope and part", async ({ page }) => {
      await ready(page, framework.url);
      const scopes = [
        "button",
        "icon",
        "spinner",
        "badge",
        "tag",
        "card",
        "alert",
        "divider",
        "input",
        "textarea",
        "select",
        "checkbox",
        "radio",
        "switch",
        "avatar",
        "progress",
        "row",
        "col",
        "tabs",
        "accordion",
        "table",
      ];
      for (const scope of scopes) {
        const count = await page.locator(`[data-scope="${scope}"]`).count();
        expect(count, `no [data-scope="${scope}"] rendered`).toBeGreaterThan(0);
      }
    });

    // The single highest-value assertion in the suite. Binding a raw boolean
    // makes Vue and Angular render data-loading="false", which MATCHES
    // [data-loading] in CSS and silently applies the wrong styles.
    test('no boolean data attribute is ever the string "false"', async ({ page }) => {
      await ready(page, framework.url);
      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-scope]")].flatMap(element =>
          [...element.attributes]
            .filter(attr => attr.name.startsWith("data-") && attr.value === "false")
            .map(attr => `${element.tagName.toLowerCase()}[${attr.name}]`)
        )
      );
      expect(offenders).toEqual([]);
    });

    test("variant and size land as data attributes, not classes", async ({ page }) => {
      await ready(page, framework.url);
      const primary = page.locator('[data-scope="button"][data-variant="primary"]').first();
      await expect(primary).toBeVisible();
      await expect(page.locator('[data-scope="button"][data-size="lg"]').first()).toBeVisible();
      await expect(
        page.locator('[data-scope="alert"][data-variant="error"]').first()
      ).toBeVisible();
    });

    test("the disabled button reports disabled, and the loading one reports loading", async ({
      page,
    }) => {
      await ready(page, framework.url);
      await expect(page.locator('[data-scope="button"][data-loading]').first()).toBeVisible();
      await expect(page.locator('[data-scope="button"][disabled]').first()).toBeVisible();
    });

    test("machine-backed parts report their state", async ({ page }) => {
      await ready(page, framework.url);
      await expect(
        page.locator('[data-scope="tabs"][data-part="trigger"][data-selected]').first()
      ).toBeVisible();
      await expect(
        page
          .locator('[data-scope="accordion"][data-part="item-content"][data-state="open"]')
          .first()
      ).toBeVisible();
      await expect(page.locator('[data-scope="select"][data-part="trigger"]')).toHaveAttribute(
        "role",
        "combobox"
      );
    });

    test("the invalid field is marked for both CSS and assistive tech", async ({ page }) => {
      await ready(page, framework.url);
      await expect(page.locator('[data-scope="input"][data-invalid]').first()).toBeVisible();
      await expect(
        page.locator('[data-scope="input"][data-part="input"][aria-invalid="true"]').first()
      ).toBeVisible();
    });

    test("the sortable table header is a real button", async ({ page }) => {
      await ready(page, framework.url);
      const trigger = page.locator('[data-scope="table"][data-part="sort-trigger"]').first();
      await expect(trigger).toBeVisible();
      expect(await trigger.evaluate(el => el.tagName)).toBe("BUTTON");
    });

    test("the table paginates rather than rendering every row", async ({ page }) => {
      await ready(page, framework.url);
      // 4 people, pageSize 3
      await expect(page.locator('[data-part="body"] [data-part="row"]')).toHaveCount(3);
      await expect(page.locator('[data-part="page-trigger"][aria-current="page"]')).toHaveText("1");
    });
  });
}

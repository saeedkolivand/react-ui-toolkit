import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createTheme } from "@crosskit-ui/core";
import { ConfigProvider } from "./config-provider";

const styles = () =>
  [...document.querySelectorAll("style[data-ck-theme-style]")].map(s => s.textContent ?? "");

describe("ConfigProvider", () => {
  it("renders a style element and no wrapper when it has nothing to put on one", () => {
    // An unconditional <div> breaks any layout expecting direct children — a
    // flex row, a grid, a <tbody>.
    const { container } = render(
      <ConfigProvider theme={createTheme()}>
        <span data-testid="child" />
      </ConfigProvider>
    );
    expect(container.querySelector("div")).toBeNull();
    expect(styles()).toHaveLength(1);
  });

  it("writes the outermost theme to :root", () => {
    // A portaled overlay is a sibling of the provider, not a descendant, so
    // scoping the top level leaves every modal in the app unthemed.
    render(<ConfigProvider theme={createTheme()}>x</ConfigProvider>);
    expect(styles()[0]).toContain(":root {");
  });

  it("keeps :root for a top-level provider that only sets a direction", () => {
    // `direction` used to force the nested path, so every RTL app scoped its
    // theme to a wrapper div and its overlays rendered unthemed.
    render(
      <ConfigProvider theme={createTheme()} direction="rtl">
        x
      </ConfigProvider>
    );
    expect(styles()[0]).toContain(":root {");
    expect(document.querySelector('[dir="rtl"]')).toBeInTheDocument();
  });

  it("scopes a nested theme so it cannot repaint the document", () => {
    // Both blocks landed on `:root` in the same layer, so the inner theme won
    // everywhere — including outside its own subtree.
    render(
      <ConfigProvider theme={createTheme({ token: { colorPrimary: "#0284c7" } })}>
        <ConfigProvider theme={createTheme({ token: { colorPrimary: "#dc2626" } })}>
          x
        </ConfigProvider>
      </ConfigProvider>
    );
    const [outer, inner] = styles();
    expect(outer).toContain(":root {");
    expect(inner).not.toContain(":root {");
    expect(inner).toMatch(/\[data-ck-theme="[^"]+"\] \{/);
  });

  it("scopes every block of a nested theme, not only the first", () => {
    // `String.replace` with a string pattern replaces one occurrence, so a
    // theme with component tokens kept applying them document-wide.
    const manifests = {
      Button: {
        scope: "button",
        parts: ["root"],
        variants: { type: ["default", "primary"] },
        defaults: { type: "default" },
      },
    };
    render(
      <ConfigProvider theme={createTheme()}>
        <ConfigProvider
          theme={createTheme({
            manifests,
            components: { Button: { token: { "accent-solid": "#059669" } } },
          })}
        >
          x
        </ConfigProvider>
      </ConfigProvider>
    );
    const inner = styles()[1]!;
    expect(inner).toContain("--ck-accent-solid: #059669");
    // The component block is prefixed, so it stays scoped to both.
    expect(inner).toMatch(/\[data-ck-theme="[^"]+"\] \[data-scope="button"\]/);
    expect(inner).not.toMatch(/^\[data-scope="button"\]/m);
  });

  it("inherits what a nested provider does not restate", () => {
    render(
      <ConfigProvider direction="rtl">
        <ConfigProvider>
          <span data-testid="child" />
        </ConfigProvider>
      </ConfigProvider>
    );
    expect(document.querySelectorAll('[dir="rtl"]')).toHaveLength(1);
  });
});

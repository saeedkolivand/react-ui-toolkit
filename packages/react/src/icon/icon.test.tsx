import { render } from "@testing-library/react";
import { ICON_NAMES, iconPaths } from "@crosskit-ui/core";
import { Icon } from "./icon";

describe("Icon", () => {
  const svg = (c: HTMLElement) => c.querySelector("svg")!;

  it("renders with data-scope and data-part", () => {
    const { container } = render(<Icon name="close" />);
    expect(svg(container)).toHaveAttribute("data-scope", "icon");
    expect(svg(container)).toHaveAttribute("data-part", "root");
  });

  it("maps size onto a data attribute", () => {
    const { container } = render(<Icon name="close" size="xl" />);
    expect(svg(container)).toHaveAttribute("data-size", "xl");
  });

  it("renders one path per entry, including multi-path icons", () => {
    const single = render(<Icon name="close" />);
    expect(single.container.querySelectorAll("path")).toHaveLength(1);

    // `eye` is the one two-path icon in the set — the reason iconPaths stores
    // arrays rather than a single string.
    const multi = render(<Icon name="eye" />);
    expect(multi.container.querySelectorAll("path")).toHaveLength(2);
  });

  it("passes className through to the root", () => {
    const { container } = render(<Icon name="close" className="my-icon" />);
    expect(svg(container)).toHaveClass("my-icon");
  });

  it("is hidden from assistive tech by default", () => {
    const { container } = render(<Icon name="close" />);
    expect(svg(container)).toHaveAttribute("aria-hidden", "true");
    expect(svg(container)).toHaveAttribute("focusable", "false");
  });

  it("carries no presentation attributes — those live in the stylesheet", () => {
    const { container } = render(<Icon name="close" />);
    const el = svg(container);
    // If these ever reappear in markup the four adapters will drift, because
    // React/Vue/Svelte/Angular disagree on camelCase vs kebab-case for them.
    for (const attr of ["fill", "stroke", "stroke-width", "strokeWidth"]) {
      expect(el).not.toHaveAttribute(attr);
    }
  });
});

// Guards the generated data itself: a silent typo in a `d` string is invisible
// until someone renders that icon, and an accidental removal would break
// consumers with no compile error on our side.
describe("icon data", () => {
  it("every icon has at least one non-empty path", () => {
    for (const name of ICON_NAMES) {
      const paths = iconPaths[name];
      expect(paths.length, `${name} has no paths`).toBeGreaterThan(0);
      for (const d of paths) expect(d.trim().length, `${name} has an empty path`).toBeGreaterThan(0);
    }
  });

  it("matches the committed icon roster", () => {
    expect(ICON_NAMES.length).toBe(104);
    expect([...ICON_NAMES].sort()).toMatchSnapshot();
  });
});

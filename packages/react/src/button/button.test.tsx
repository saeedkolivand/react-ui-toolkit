import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

const root = () => document.querySelector<HTMLElement>('[data-scope="button"][data-part="root"]')!;

describe("Button", () => {
  it("renders a button carrying its scope and part", () => {
    render(<Button>Save</Button>);
    expect(root().tagName).toBe("BUTTON");
    expect(screen.getByText("Save")).toHaveAttribute("data-part", "label");
  });

  it("puts the enumerable props on data attributes, not classes", () => {
    render(
      <Button type="primary" size="large">
        Save
      </Button>
    );
    expect(root()).toHaveAttribute("data-type", "primary");
    expect(root()).toHaveAttribute("data-size", "large");
    expect(root().className).toBe("");
  });

  it("emits no shape attribute for the default shape", () => {
    // So the stylesheet's base rule is what applies in the common case.
    render(<Button>Save</Button>);
    expect(root()).not.toHaveAttribute("data-shape");
  });

  describe("booleans are presence attributes", () => {
    it("omits them entirely when false", () => {
      // `data-danger="false"` *matches* `[data-danger]` in CSS, so a raw boolean
      // silently applies the wrong styles. This is the highest-value assertion
      // in the suite.
      render(<Button>Save</Button>);
      for (const name of ["data-danger", "data-ghost", "data-block", "data-loading"]) {
        expect(root(), name).not.toHaveAttribute(name);
      }
    });

    it("renders them empty when true", () => {
      render(
        <Button danger ghost block>
          Save
        </Button>
      );
      expect(root()).toHaveAttribute("data-danger", "");
      expect(root()).toHaveAttribute("data-ghost", "");
      expect(root()).toHaveAttribute("data-block", "");
    });

    it("never renders the string false for any combination", () => {
      render(
        <Button danger={false} ghost={false} block={false} loading={false} disabled={false}>
          Save
        </Button>
      );
      expect(root().outerHTML).not.toContain('="false"');
    });
  });

  describe("htmlType", () => {
    it("defaults to button, not submit", () => {
      // Leaving it unset makes a button inside a form submit it, which is
      // almost never what a library's default should be.
      render(<Button>Save</Button>);
      expect(root()).toHaveAttribute("type", "button");
    });

    it("passes through, since `type` is taken by the variant", () => {
      render(
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      );
      expect(root()).toHaveAttribute("type", "submit");
      expect(root()).toHaveAttribute("data-type", "primary");
    });
  });

  describe("loading and disabled", () => {
    it("disables and marks busy while loading", () => {
      render(<Button loading>Save</Button>);
      expect(root()).toBeDisabled();
      // Busy, not merely unavailable — a screen reader should say it is working.
      expect(root()).toHaveAttribute("aria-busy", "true");
      expect(document.querySelector('[data-part="spinner"]')).toBeInTheDocument();
    });

    it("marks itself disabled while loading, matching the DOM", () => {
      // A rule keyed on [data-disabled] would otherwise miss a loading button
      // that `:disabled` matches — and each of the other three adapters would
      // then re-decide that inconsistency differently.
      render(<Button loading>Save</Button>);
      expect(root()).toHaveAttribute("data-disabled", "");
      expect(root()).toBeDisabled();
    });

    it("does not claim to be busy when only disabled", () => {
      render(<Button disabled>Save</Button>);
      expect(root()).toBeDisabled();
      expect(root()).not.toHaveAttribute("aria-busy");
    });

    it("does not fire while loading", async () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>
      );
      await userEvent.click(root());
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("icon", () => {
    it("renders it in its own part, hidden from assistive tech", () => {
      // The label carries the meaning; announcing a decorative glyph as well
      // reads as a duplicate.
      render(<Button icon={<svg data-testid="glyph" />}>Save</Button>);
      const icon = document.querySelector('[data-part="icon"]')!;
      expect(icon).toContainElement(screen.getByTestId("glyph"));
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("reports which side it is on", () => {
      render(<Button icon={<svg />}>Save</Button>);
      expect(root()).toHaveAttribute("data-icon-position", "start");
    });

    it("reports nothing when there is no icon", () => {
      render(<Button>Save</Button>);
      expect(root()).not.toHaveAttribute("data-icon-position");
    });

    it("orders the icon after the label when placed at the end", () => {
      render(
        <Button icon={<svg data-testid="glyph" />} iconPosition="end">
          Save
        </Button>
      );
      const parts = [...root().children].map(child => child.getAttribute("data-part"));
      expect(parts).toEqual(["label", "icon"]);
    });

    it("renders without a label", () => {
      render(<Button icon={<svg />} aria-label="Close" />);
      expect(document.querySelector('[data-part="label"]')).toBeNull();
      expect(root()).toHaveAttribute("aria-label", "Close");
    });
  });

  describe("as a link", () => {
    it("renders an anchor when given an href", () => {
      // A button that navigates has to be a link, or it is unusable by keyboard
      // and invisible to "open in new tab".
      render(<Button href="/next">Next</Button>);
      expect(root().tagName).toBe("A");
      expect(root()).toHaveAttribute("href", "/next");
    });

    it("keeps the link role, so it stays in the links rotor", () => {
      // `role="button"` would override the implicit one, announcing "button"
      // and removing the "this navigates" affordance for exactly the users the
      // <a> was rendered for.
      render(<Button href="/next">Next</Button>);
      expect(screen.getByRole("link", { name: "Next" })).toBe(root());
      expect(root()).not.toHaveAttribute("role");
    });

    it("drops the href when disabled, rather than only styling it", () => {
      render(
        <Button href="/next" disabled>
          Next
        </Button>
      );
      expect(root()).not.toHaveAttribute("href");
      // An <a> has no `disabled`, so the state must be exposed some other way.
      expect(root()).toHaveAttribute("aria-disabled", "true");
    });

    it("keeps the anchor's own attributes", () => {
      render(
        <Button href="/next" target="_blank" rel="noreferrer">
          Next
        </Button>
      );
      expect(root()).toHaveAttribute("target", "_blank");
      expect(root()).toHaveAttribute("rel", "noreferrer");
    });
  });

  describe("passthrough", () => {
    it("puts a consumer class on the root untouched", () => {
      render(<Button className="my-button">Save</Button>);
      expect(root()).toHaveClass("my-button");
    });

    it("lets a consumer override anything, because rest spreads last", () => {
      // What makes composition work: an outer component can restate an
      // attribute this one set.
      render(
        <Button type="primary" data-type="overridden" id="mine">
          Save
        </Button>
      );
      expect(root()).toHaveAttribute("data-type", "overridden");
      expect(root()).toHaveAttribute("id", "mine");
    });

    it("forwards a ref to the element", () => {
      let node: HTMLButtonElement | null = null;
      render(
        <Button
          ref={el => {
            node = el;
          }}
        >
          Save
        </Button>
      );
      expect(node).toBe(root());
    });

    it("fires onClick", async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Save</Button>);
      await userEvent.click(root());
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "./breadcrumb";
import { Steps } from "./steps";

const parts = (scope: string, name: string) =>
  Array.from(
    document.querySelectorAll<HTMLElement>(`[data-scope="${scope}"] [data-part="${name}"]`)
  );

const CRUMBS = [
  { title: "Home", href: "/" },
  { title: "Settings", href: "/settings" },
  { title: "Profile" },
];

describe("Breadcrumb", () => {
  it("is a landmark with an ordered list inside", () => {
    render(<Breadcrumb items={CRUMBS} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.querySelector("ol")).not.toBeNull();
  });

  it("takes a consumer's own label over the default", () => {
    render(<Breadcrumb items={CRUMBS} aria-label="You are here" />);
    expect(screen.getByRole("navigation", { name: "You are here" })).toBeInTheDocument();
  });

  it("puts a separator between crumbs and not around them", () => {
    render(<Breadcrumb items={CRUMBS} />);
    expect(parts("breadcrumb", "separator")).toHaveLength(2);
  });

  it("renders no separator when it is conditioned away", () => {
    const withSeparator = false;
    render(<Breadcrumb items={CRUMBS} separator={withSeparator && "/"} />);
    expect(parts("breadcrumb", "separator")).toHaveLength(0);
  });

  it("hides the separator from assistive tech", () => {
    render(<Breadcrumb items={CRUMBS} />);
    // Read aloud it turns "Settings" into "Settings slash", which is the whole
    // reason it is a list item of its own rather than part of the label.
    expect(parts("breadcrumb", "separator")[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("does not link the crumb you are already on", () => {
    render(<Breadcrumb items={CRUMBS} />);
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
    expect(screen.getByText("Profile")).toHaveAttribute("aria-current", "page");
  });

  it("links the crumbs you are not on", () => {
    render(<Breadcrumb items={CRUMBS} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("makes a click-only crumb a button, not an anchor", async () => {
    const onClick = vi.fn();
    render(<Breadcrumb items={[{ title: "Back", onClick }, { title: "Here" }]} />);
    // An `<a>` with no `href` is not focusable and takes no Enter, so the
    // handler would be mouse-only — a crumb no keyboard could activate.
    const back = screen.getByRole("button", { name: "Back" });
    back.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders a crumb with neither href nor handler as plain text", () => {
    render(<Breadcrumb items={[{ title: "Static" }, { title: "Here" }]} />);
    expect(screen.queryByRole("link", { name: "Static" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Static" })).not.toBeInTheDocument();
  });
});

const STEPS = [{ title: "Cart" }, { title: "Pay" }, { title: "Done" }];

describe("Steps", () => {
  it("derives each step's status from where it sits", () => {
    render(<Steps items={STEPS} current={1} />);
    expect(parts("steps", "item").map(i => i.getAttribute("data-status"))).toEqual([
      "finish",
      "process",
      "wait",
    ]);
  });

  it("applies the group status to the current step only", () => {
    render(<Steps items={STEPS} current={1} status="error" />);
    // One failed step, not a failed list — which is the whole point of the
    // group status naming the current one rather than all of them.
    expect(parts("steps", "item").map(i => i.getAttribute("data-status"))).toEqual([
      "finish",
      "error",
      "wait",
    ]);
  });

  it("lets an item override the status its position implies", () => {
    render(
      <Steps
        items={[{ title: "a" }, { title: "b", status: "error" }, { title: "c" }]}
        current={2}
      />
    );
    expect(parts("steps", "item")[1]!.getAttribute("data-status")).toBe("error");
  });

  it("says which step you are on", () => {
    render(<Steps items={STEPS} current={1} />);
    const current = parts("steps", "item").filter(i => i.getAttribute("aria-current") === "step");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Pay");
  });

  it("numbers from one when told to", () => {
    render(<Steps items={STEPS} current={0} initial={1} />);
    // The markers are `aria-hidden`, so this is the rendered text rather than
    // an accessible name.
    expect(parts("steps", "marker").map(m => m.textContent)).toEqual(["1", "2", "3"]);
  });

  it("numbers from zero by default", () => {
    render(<Steps items={STEPS} current={0} />);
    expect(parts("steps", "marker").map(m => m.textContent)).toEqual(["0", "1", "2"]);
  });

  it("ticks a finished step instead of numbering it", () => {
    render(<Steps items={STEPS} current={1} />);
    expect(parts("steps", "marker")[0]!.querySelector("svg")).not.toBeNull();
    expect(parts("steps", "marker")[2]!.querySelector("svg")).toBeNull();
  });

  it("draws nothing in the marker under progressDot", () => {
    render(<Steps items={STEPS} current={1} progressDot />);
    expect(parts("steps", "marker").map(m => m.textContent)).toEqual(["", "", ""]);
  });

  it("takes an item's own icon over both", () => {
    render(<Steps items={[{ title: "a", icon: <span data-testid="own" /> }]} />);
    expect(screen.getByTestId("own")).toBeInTheDocument();
  });

  it("is inert markup with no onChange", () => {
    render(<Steps items={STEPS} current={1} />);
    // A step list that only reports progress should not put three buttons in
    // the tab order for a keyboard user to walk past.
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("becomes clickable once onChange is given", async () => {
    const onChange = vi.fn();
    render(<Steps items={STEPS} current={1} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Done/ }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("does not report a click on a disabled step", async () => {
    const onChange = vi.fn();
    render(
      <Steps
        items={[{ title: "a" }, { title: "b", disabled: true }]}
        current={0}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /b/ }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("draws a connector between steps and not after the last", () => {
    render(<Steps items={STEPS} current={0} />);
    // A trailing connector runs off the end of the list, which is the one
    // thing about this that looks broken rather than merely wrong.
    expect(parts("steps", "separator")).toHaveLength(2);
  });

  it("omits a title box for a step that has no title", () => {
    render(<Steps items={[{ description: "just a description" }]} current={0} />);
    expect(parts("steps", "title")).toHaveLength(0);
    expect(parts("steps", "description")).toHaveLength(1);
  });

  it("marks progressDot as a presence attribute", () => {
    render(<Steps items={STEPS} progressDot />);
    expect(document.querySelector('[data-scope="steps"]')!.getAttribute("data-progress-dot")).toBe(
      ""
    );
  });

  it("omits it entirely when off", () => {
    render(<Steps items={STEPS} />);
    expect(document.querySelector('[data-scope="steps"]')!.hasAttribute("data-progress-dot")).toBe(
      false
    );
  });

  it("drops the label placement when the steps run vertically", () => {
    render(<Steps items={STEPS} direction="vertical" labelPlacement="vertical" />);
    // Placement is a horizontal-only idea. Emitting it anyway leaves a
    // stylesheet free to act on a combination that has no meaning.
    const root = document.querySelector('[data-scope="steps"]')!;
    expect(root.hasAttribute("data-label-placement")).toBe(false);
    expect(root).toHaveAttribute("data-direction", "vertical");
  });
});

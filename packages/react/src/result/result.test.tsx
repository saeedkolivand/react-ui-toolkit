import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Result, type ResultStatus } from "./result";

const root = () => document.querySelector<HTMLElement>('[data-scope="result"][data-part="root"]')!;
const part = (name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="result"] [data-part="${name}"]`);

describe("Result", () => {
  it("renders the scope and part", () => {
    render(<Result title="Done" />);
    expect(root()).toBeInTheDocument();
  });

  it("defaults to info", () => {
    render(<Result title="Done" />);
    expect(root()).toHaveAttribute("data-status", "info");
  });

  it("puts the status on the root so CSS can colour the icon", () => {
    render(<Result status="success" title="Done" />);
    expect(root()).toHaveAttribute("data-status", "success");
  });

  /** The icon's path data for one status, rendered and torn down in isolation. */
  const iconPath = (status: ResultStatus): string | null => {
    const { unmount } = render(<Result status={status} title="t" />);
    const path = part("icon")!.querySelector("path");
    const d = path?.getAttribute("d") ?? null;
    unmount();
    return d;
  };

  const STATUSES: ResultStatus[] = ["success", "error", "info", "warning", "404", "403", "500"];

  it("gives every status an icon", () => {
    // `Icon` returns null for a name it does not know rather than throwing, so a
    // typo in the lookup renders an empty box and nothing complains.
    expect(STATUSES.map(s => iconPath(s) !== null)).toEqual(STATUSES.map(() => true));
  });

  it("gives every status a different icon", () => {
    // Measured against each other, not against a snapshot: pointing all seven
    // at one fallback would still have passed the check above.
    expect(new Set(STATUSES.map(iconPath)).size).toBe(STATUSES.length);
  });

  it("replaces the built-in icon entirely when given one", () => {
    render(<Result status="success" icon={<span data-testid="own">!</span>} title="t" />);
    expect(screen.getByTestId("own")).toBeInTheDocument();
    expect(part("icon")!.querySelector("svg")).toBeNull();
  });

  it("renders the title and subtitle", () => {
    render(<Result title="Payment taken" subTitle="Order 2456" />);
    expect(screen.getByText("Payment taken")).toBeInTheDocument();
    expect(screen.getByText("Order 2456")).toBeInTheDocument();
  });

  it("omits the subtitle rather than rendering an empty box", () => {
    render(<Result title="Payment taken" />);
    expect(part("subtitle")).toBeNull();
  });

  it("puts the actions after the content, not before it", () => {
    render(
      <Result title="Failed" extra={<button type="button">Retry</button>}>
        <p>What went wrong</p>
      </Result>
    );
    const content = part("content")!;
    const extra = part("extra")!;
    // The actions are what you do after reading the detail, so they come last.
    expect(content.compareDocumentPosition(extra)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("has no content box when there are no children", () => {
    render(<Result title="Done" extra={<button type="button">Home</button>} />);
    expect(part("content")).toBeNull();
    expect(part("extra")).toBeInTheDocument();
  });

  it("spreads a consumer's attributes last", () => {
    render(<Result title="Done" data-status="mine" className="ck-custom" />);
    expect(root()).toHaveAttribute("data-status", "mine");
    expect(root()).toHaveClass("ck-custom");
  });
});

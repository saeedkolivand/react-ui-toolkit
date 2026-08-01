import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Empty } from "./empty";
import { ConfigProvider } from "../config/config-provider";
import { enUS } from "../locale/en-US";

const root = () => document.querySelector<HTMLElement>('[data-scope="empty"][data-part="root"]')!;
const part = (name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="empty"] [data-part="${name}"]`);

describe("Empty", () => {
  it("renders the scope and part", () => {
    render(<Empty />);
    expect(root()).toBeInTheDocument();
  });

  it("describes itself from the locale rather than a hard-coded string", () => {
    render(<Empty />);
    expect(screen.getByText(enUS.Empty.description)).toBeInTheDocument();
  });

  it("follows the locale a provider sets", () => {
    render(
      <ConfigProvider locale={{ ...enUS, Empty: { description: "Nichts hier" } }}>
        <Empty />
      </ConfigProvider>
    );
    expect(screen.getByText("Nichts hier")).toBeInTheDocument();
    expect(screen.queryByText(enUS.Empty.description)).not.toBeInTheDocument();
  });

  it("takes an explicit description over the locale", () => {
    render(<Empty description="No invoices yet" />);
    expect(screen.getByText("No invoices yet")).toBeInTheDocument();
  });

  it("renders no description at all when given null", () => {
    // `undefined` means "not specified" and takes the locale string; `null` is
    // how a caller asks for an illustration and nothing else. Collapsing the
    // two makes a wordless empty state impossible to express.
    render(<Empty description={null} />);
    expect(part("description")).toBeNull();
  });

  it("renders no description when given false", () => {
    render(<Empty description={false} />);
    expect(part("description")).toBeNull();
  });

  it("draws an illustration by default", () => {
    render(<Empty />);
    expect(part("illustration")!.tagName).toBe("svg");
  });

  it("treats a string image as a URL", () => {
    render(<Empty image="/nothing.png" />);
    const img = part("illustration") as HTMLImageElement;
    expect(img.tagName).toBe("IMG");
    expect(img.getAttribute("src")).toBe("/nothing.png");
    // Empty alt, not a description: the text below already says it, and a
    // screen reader announcing both reads the state twice.
    expect(img.getAttribute("alt")).toBe("");
  });

  it("renders no image box when the image is conditioned away", () => {
    const showArt = false;
    render(<Empty image={showArt && <span />} />);
    // The image part carries a fixed block-size, so an empty one is not a
    // hairline — it is the full height of the illustration that is not there.
    expect(part("image")).toBeNull();
  });

  it("renders no image box for null either", () => {
    render(<Empty image={null} />);
    expect(part("image")).toBeNull();
  });

  it("takes a node image as-is", () => {
    render(<Empty image={<span data-testid="own">art</span>} />);
    expect(screen.getByTestId("own")).toBeInTheDocument();
  });

  it("hides the built-in illustrations from assistive tech", () => {
    render(<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />);
    expect(part("illustration")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders children as a footer, below the description", () => {
    render(
      <Empty>
        <button type="button">Add one</button>
      </Empty>
    );
    const footer = part("footer")!;
    expect(footer).toContainElement(screen.getByRole("button", { name: "Add one" }));
    expect(part("description")!.compareDocumentPosition(footer)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it("has no footer for a list that mapped to nothing", () => {
    const actions: string[] = [];
    render(
      <Empty>
        {actions.map(a => (
          <button key={a} type="button" />
        ))}
      </Empty>
    );
    expect(part("footer")).toBeNull();
  });

  it("has no footer when there are no children", () => {
    render(<Empty />);
    expect(part("footer")).toBeNull();
  });

  it("spreads a consumer's attributes last, so they can override ours", () => {
    render(<Empty data-part="mine" className="ck-custom" />);
    const el = document.querySelector('[data-scope="empty"]')!;
    expect(el).toHaveAttribute("data-part", "mine");
    expect(el).toHaveClass("ck-custom");
  });
});

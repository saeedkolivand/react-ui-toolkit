import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./skeleton";

const root = () =>
  document.querySelector<HTMLElement>('[data-scope="skeleton"][data-part="root"]')!;
const parts = (name: string) =>
  document.querySelectorAll<HTMLElement>(`[data-scope="skeleton"] [data-part="${name}"]`);
const block = (name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="skeleton"][data-part="${name}"]`);

describe("Skeleton", () => {
  it("renders a placeholder with no props at all", () => {
    // `loading` omitted has to mean "placeholder". Reading it as merely falsy
    // makes the zero-prop form render nothing, which looks like a broken import.
    render(<Skeleton />);
    expect(root()).toBeInTheDocument();
  });

  it("renders children instead once loading is explicitly false", () => {
    render(
      <Skeleton loading={false}>
        <p>real content</p>
      </Skeleton>
    );
    expect(screen.getByText("real content")).toBeInTheDocument();
    expect(document.querySelector('[data-scope="skeleton"]')).toBeNull();
  });

  it("keeps the placeholder while loading is true, children and all", () => {
    render(
      <Skeleton loading>
        <p>real content</p>
      </Skeleton>
    );
    expect(root()).toBeInTheDocument();
    expect(screen.queryByText("real content")).not.toBeInTheDocument();
  });

  it("tells assistive tech the region is not its final content", () => {
    render(<Skeleton />);
    // `aria-busy` rather than a live region: there is no text here to announce,
    // and a shimmer read out row by row is noise.
    expect(root()).toHaveAttribute("aria-busy", "true");
  });

  it("draws a title and three paragraph rows by default", () => {
    render(<Skeleton />);
    expect(parts("title")).toHaveLength(1);
    expect(parts("row")).toHaveLength(3);
  });

  it("shortens the last row, because that is what reads as prose", () => {
    render(<Skeleton />);
    const rows = parts("row");
    expect(rows[0]!.style.inlineSize).toBe("");
    expect(rows[2]!.style.inlineSize).toBe("61%");
  });

  it("applies one given width to every row, last one included", () => {
    render(<Skeleton paragraph={{ width: "80%" }} />);
    const rows = parts("row");
    expect([...rows].map(r => r.style.inlineSize)).toEqual(["80%", "80%", "80%"]);
  });

  it("applies a list of widths row by row", () => {
    render(<Skeleton paragraph={{ rows: 2, width: [100, "50%"] }} />);
    const rows = parts("row");
    expect([...rows].map(r => r.style.inlineSize)).toEqual(["100px", "50%"]);
  });

  it("drops the title and the paragraph when switched off", () => {
    render(<Skeleton title={false} paragraph={false} avatar />);
    expect(parts("title")).toHaveLength(0);
    expect(parts("row")).toHaveLength(0);
    expect(block("avatar")).toBeInTheDocument();
  });

  it("has no avatar unless asked", () => {
    render(<Skeleton />);
    expect(block("avatar")).toBeNull();
  });

  it("marks active as a presence attribute", () => {
    render(<Skeleton active />);
    expect(root().getAttribute("data-active")).toBe("");
  });

  it("omits active entirely when still", () => {
    // Not `data-active="false"` — `[data-active]` matches that string, so every
    // still skeleton in the app would shimmer.
    render(<Skeleton />);
    expect(root().hasAttribute("data-active")).toBe(false);
  });

  it("passes active down to the avatar it renders for you", () => {
    // The avatar is a separate root with its own `[data-active]` selector, so
    // it does not inherit the shimmer from the container — it has to be told.
    render(<Skeleton active avatar />);
    expect(block("avatar")!.getAttribute("data-active")).toBe("");
  });

  it("lets an explicit avatar prop keep its own shape", () => {
    render(<Skeleton avatar={{ shape: "square" }} />);
    expect(block("avatar")).toHaveAttribute("data-shape", "square");
  });

  it("rounds the rows only when asked", () => {
    render(<Skeleton round />);
    expect(root().getAttribute("data-round")).toBe("");
  });
});

describe("Skeleton blocks", () => {
  it("defaults an avatar to a circle", () => {
    render(<Skeleton.Avatar />);
    expect(block("avatar")).toHaveAttribute("data-shape", "circle");
  });

  it("sizes a numeric avatar on both axes, because it is square", () => {
    render(<Skeleton.Avatar size={64} />);
    expect(block("avatar")!.style.blockSize).toBe("64px");
    expect(block("avatar")!.style.inlineSize).toBe("64px");
  });

  it("sizes a numeric button on the block axis only, so its width still applies", () => {
    render(<Skeleton.Button size={64} />);
    expect(block("button")!.style.blockSize).toBe("64px");
    expect(block("button")!.style.inlineSize).toBe("");
  });

  it("drops the keyword size attribute once a number takes over", () => {
    // Leaving `data-size="default"` on means the stylesheet's own height wins or
    // loses by declaration order rather than by what the consumer asked for.
    render(<Skeleton.Input size={40} />);
    expect(block("input")!.hasAttribute("data-size")).toBe(false);
  });

  it("keeps the keyword size attribute when it is a keyword", () => {
    render(<Skeleton.Input size="large" />);
    expect(block("input")).toHaveAttribute("data-size", "large");
  });

  it("marks block as a presence attribute", () => {
    render(<Skeleton.Input block />);
    expect(block("input")!.getAttribute("data-block")).toBe("");
  });

  it("renders whatever a node is given", () => {
    render(
      <Skeleton.Node>
        <span>chart</span>
      </Skeleton.Node>
    );
    expect(screen.getByText("chart")).toBeInTheDocument();
  });

  it("renders an image block", () => {
    render(<Skeleton.Image />);
    expect(block("image")).toBeInTheDocument();
  });
});

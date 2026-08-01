import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Flex } from "./flex";
import { Space } from "./space";

const flexRoot = () =>
  document.querySelector<HTMLElement>('[data-scope="flex"][data-part="root"]')!;
const spaceRoot = () =>
  document.querySelector<HTMLElement>('[data-scope="space"][data-part="root"]')!;
const parts = (name: string) => document.querySelectorAll(`[data-part="${name}"]`);

describe("Flex", () => {
  it("renders the scope and part", () => {
    render(<Flex>a</Flex>);
    expect(flexRoot()).toBeInTheDocument();
  });

  it("marks vertical as a presence attribute rather than a value", () => {
    render(<Flex vertical>a</Flex>);
    expect(flexRoot().getAttribute("data-vertical")).toBe("");
  });

  it("omits the attribute entirely when horizontal", () => {
    render(<Flex>a</Flex>);
    // Not `data-vertical="false"` — `[data-vertical]` matches that string, so a
    // horizontal Flex would pick up the column rules.
    expect(flexRoot().hasAttribute("data-vertical")).toBe(false);
  });

  it("resolves a named gap to its token so a theme can move it", () => {
    render(<Flex gap="middle">a</Flex>);
    expect(flexRoot().style.gap).toBe("var(--ck-space-md)");
  });

  it("reads a bare number as pixels", () => {
    render(<Flex gap={12}>a</Flex>);
    expect(flexRoot().style.gap).toBe("12px");
  });

  it("passes an arbitrary CSS length through untouched", () => {
    render(<Flex gap="3ch">a</Flex>);
    expect(flexRoot().style.gap).toBe("3ch");
  });

  it("turns the boolean wrap shorthand into a real flex-wrap value", () => {
    // `false` written straight into the style object is dropped silently, so a
    // Flex asked not to wrap would wrap anyway.
    render(<Flex wrap={false}>a</Flex>);
    expect(flexRoot().style.flexWrap).toBe("nowrap");
  });

  it("still accepts the CSS values flex-wrap actually has", () => {
    render(<Flex wrap="wrap-reverse">a</Flex>);
    expect(flexRoot().style.flexWrap).toBe("wrap-reverse");
  });

  it("leaves flex-wrap unset when wrap is not given", () => {
    render(<Flex>a</Flex>);
    expect(flexRoot().style.flexWrap).toBe("");
  });

  it("renders as another element when asked", () => {
    render(<Flex component="section">a</Flex>);
    expect(flexRoot().tagName).toBe("SECTION");
  });

  it("keeps a consumer's own style alongside its own", () => {
    render(
      <Flex gap="small" style={{ padding: "4px" }}>
        a
      </Flex>
    );
    expect(flexRoot().style.padding).toBe("4px");
    expect(flexRoot().style.gap).toBe("var(--ck-space-sm)");
  });
});

describe("Space", () => {
  it("wraps each child in an item", () => {
    render(
      <Space>
        <b>one</b>
        <b>two</b>
      </Space>
    );
    expect(parts("item")).toHaveLength(2);
  });

  it("puts a split between items and not around them", () => {
    render(
      <Space split="/">
        <b>one</b>
        <b>two</b>
        <b>three</b>
      </Space>
    );
    expect(parts("split")).toHaveLength(2);
  });

  it("does not leave a split behind when a child is conditioned away", () => {
    const show = false;
    render(
      <Space split="/">
        <b>one</b>
        {show && <b>two</b>}
        <b>three</b>
      </Space>
    );
    // The count is what proves it: a falsy child that still occupies a slot
    // gives two splits for two visible items, and the row renders "one / / three".
    expect(parts("item")).toHaveLength(2);
    expect(parts("split")).toHaveLength(1);
  });

  it("spaces a mapped list item by item, not as one block", () => {
    // The list sits *beside* a plain child on purpose. As the only child it is
    // already the children array and gets spaced correctly by accident; mixed
    // in, it is one nested array that has to be flattened, and a Space that
    // does not flatten renders all three of them inside a single item.
    render(
      <Space split="/">
        <b>first</b>
        {["a", "b", "c"].map(k => (
          <b key={k}>{k}</b>
        ))}
      </Space>
    );
    expect(parts("item")).toHaveLength(4);
    expect(parts("split")).toHaveLength(3);
  });

  it("hides the split from assistive tech", () => {
    render(
      <Space split="/">
        <b>one</b>
        <b>two</b>
      </Space>
    );
    expect(parts("split")[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("drives both axes from one size", () => {
    render(
      <Space size="large">
        <b>one</b>
      </Space>
    );
    expect(spaceRoot().style.getPropertyValue("--ck-space-x")).toBe("var(--ck-space-lg)");
    expect(spaceRoot().style.getPropertyValue("--ck-space-y")).toBe("var(--ck-space-lg)");
  });

  it("reads a tuple as horizontal then vertical", () => {
    render(
      <Space size={[8, 24]}>
        <b>one</b>
      </Space>
    );
    expect(spaceRoot().style.getPropertyValue("--ck-space-x")).toBe("8px");
    expect(spaceRoot().style.getPropertyValue("--ck-space-y")).toBe("24px");
  });

  it("centres a horizontal row so unequal children share a centre line", () => {
    render(
      <Space>
        <b>one</b>
      </Space>
    );
    expect(spaceRoot()).toHaveAttribute("data-align", "center");
  });

  it("leaves a column to stretch", () => {
    render(
      <Space direction="vertical">
        <b>one</b>
      </Space>
    );
    expect(spaceRoot().hasAttribute("data-align")).toBe(false);
  });

  it("lets an explicit align win over the horizontal default", () => {
    render(
      <Space align="baseline">
        <b>one</b>
      </Space>
    );
    expect(spaceRoot()).toHaveAttribute("data-align", "baseline");
  });

  it("marks wrap as a presence attribute", () => {
    render(
      <Space wrap>
        <b>one</b>
      </Space>
    );
    expect(spaceRoot().getAttribute("data-wrap")).toBe("");
  });

  it("omits wrap entirely when off", () => {
    render(
      <Space>
        <b>one</b>
      </Space>
    );
    expect(spaceRoot().hasAttribute("data-wrap")).toBe(false);
  });

  it("keeps rendering the children themselves", () => {
    render(
      <Space>
        <b>one</b>
      </Space>
    );
    expect(screen.getByText("one")).toBeInTheDocument();
  });
});

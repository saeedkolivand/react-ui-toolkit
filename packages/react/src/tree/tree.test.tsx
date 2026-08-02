import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tree } from "./tree";
import type { TreeNode } from "@crosskit-ui/core";

const TREE: TreeNode[] = [
  {
    key: "docs",
    title: "Docs",
    children: [
      {
        key: "guide",
        title: "Guide",
        children: [
          { key: "intro", title: "Intro" },
          { key: "setup", title: "Setup" },
        ],
      },
      { key: "api", title: "API" },
    ],
  },
  { key: "changelog", title: "Changelog" },
];

const items = () => screen.getAllByRole("treeitem");
const named = (name: string) => screen.getByRole("treeitem", { name: new RegExp(name) });
const visible = () => items().map(item => item.textContent);

describe("Tree", () => {
  it("shows only what is expanded", async () => {
    const user = userEvent.setup();
    render(<Tree treeData={TREE} />);
    expect(visible()).toEqual(["Docs", "Changelog"]);

    await user.click(named("Docs").querySelector('[data-part="expander"]')!);
    await waitFor(() => expect(visible()).toEqual(["Docs", "Guide", "API", "Changelog"]));
  });

  it("opens everything on `defaultExpandAll`", () => {
    render(<Tree treeData={TREE} defaultExpandAll />);
    expect(visible()).toEqual(["Docs", "Guide", "Intro", "Setup", "API", "Changelog"]);
  });

  it("reports level and expansion in a way a screen reader reads", () => {
    render(<Tree treeData={TREE} defaultExpandAll />);
    expect(named("Intro")).toHaveAttribute("aria-level", "3");
    expect(named("Docs")).toHaveAttribute("aria-expanded", "true");
    // `"false"` is right here: absent means "not expandable", which is a
    // different statement from "collapsed" — and it is deliberately not a
    // `data-*`, where "false" would match the attribute selector.
    expect(named("Changelog")).not.toHaveAttribute("aria-expanded");
    render(<Tree treeData={TREE} />);
    expect(screen.getAllByRole("treeitem", { name: /Docs/ })[1]).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("gives the whole tree one tab stop", () => {
    render(<Tree treeData={TREE} defaultExpandAll />);
    // A tree of two hundred nodes is not two hundred stops.
    expect(items().filter(item => item.tabIndex === 0)).toHaveLength(1);
  });

  it("keeps the tab stop when the focused branch collapses", async () => {
    const user = userEvent.setup();

    // Collapsed from OUTSIDE the tree. Clicking an expander focuses its own row
    // on the way, so the stop lands somewhere still visible and the clamp is
    // never exercised — the case that orphans it is a consumer closing a branch
    // while focus sits inside it.
    function Harness() {
      const [open, setOpen] = useState<string[]>(["docs", "guide"]);
      return (
        <>
          <button onClick={() => setOpen([])}>Collapse all</button>
          <Tree treeData={TREE} expandedKeys={open} onExpand={setOpen} />
        </>
      );
    }
    render(<Harness />);
    named("Intro").focus();
    await waitFor(() => expect(named("Intro")).toHaveAttribute("tabindex", "0"));

    await user.click(screen.getByRole("button", { name: "Collapse all" }));
    // The focused node has gone from the flat list, and a tree whose only stop
    // was collapsed away is one Tab walks straight past.
    await waitFor(() => expect(visible()).toEqual(["Docs", "Changelog"]));
    expect(items().filter(item => item.tabIndex === 0)).toHaveLength(1);
  });

  it("walks the visible nodes with the arrows", async () => {
    const user = userEvent.setup();
    render(<Tree treeData={TREE} defaultExpandAll />);
    named("Docs").focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() => expect(named("Intro")).toHaveFocus());
    await user.keyboard("{ArrowUp}");
    await waitFor(() => expect(named("Guide")).toHaveFocus());
  });

  it("stops at the ends rather than wrapping", async () => {
    const user = userEvent.setup();
    render(<Tree treeData={TREE} />);
    named("Docs").focus();
    await user.keyboard("{ArrowUp}");
    // Arriving at the last node by pressing Up on the first is disorienting.
    await waitFor(() => expect(named("Docs")).toHaveFocus());
    await user.keyboard("{End}{ArrowDown}");
    await waitFor(() => expect(named("Changelog")).toHaveFocus());
  });

  it("opens with Right and steps in on the second press", async () => {
    const user = userEvent.setup();
    render(<Tree treeData={TREE} />);
    named("Docs").focus();
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(visible()).toContain("Guide"));
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(named("Guide")).toHaveFocus());
  });

  it("closes with Left, and steps out to the parent from a leaf", async () => {
    const user = userEvent.setup();
    render(<Tree treeData={TREE} defaultExpandAll />);
    named("Intro").focus();
    await user.keyboard("{ArrowLeft}");
    // Without the step-out, Left on a leaf does nothing and the only way back up
    // a deep tree is Up, one sibling at a time.
    await waitFor(() => expect(named("Guide")).toHaveFocus());
    await user.keyboard("{ArrowLeft}");
    await waitFor(() => expect(visible()).not.toContain("Intro"));
  });

  it("selects one node at a time, and clears on re-click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Tree treeData={TREE} defaultExpandAll onSelect={onSelect} />);
    await user.click(named("Intro"));
    expect(onSelect.mock.calls[0]![0]).toEqual(["intro"]);
    await user.click(named("Setup"));
    // Single select replaces rather than accumulating.
    expect(onSelect.mock.calls[1]![0]).toEqual(["setup"]);
    await user.click(named("Setup"));
    // And re-clicking clears, which is the only way back to nothing.
    expect(onSelect.mock.calls[2]![0]).toEqual([]);
  });

  it("accumulates under `multiple`", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Tree treeData={TREE} defaultExpandAll multiple onSelect={onSelect} />);
    await user.click(named("Intro"));
    await user.click(named("Setup"));
    expect(onSelect.mock.calls[1]![0]).toEqual(["intro", "setup"]);
    expect(screen.getByRole("tree")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("propagates a check down and derives the parents up", async () => {
    const user = userEvent.setup();
    const onCheck = vi.fn();
    render(<Tree treeData={TREE} defaultExpandAll checkable onCheck={onCheck} />);
    await user.click(named("Guide").querySelector("input")!);

    expect(onCheck.mock.calls[0]![0]).toEqual(expect.arrayContaining(["guide", "intro", "setup"]));
    await waitFor(() => expect(named("Intro")).toHaveAttribute("aria-checked", "true"));
    // Docs is partial, because API is not checked.
    expect(named("Docs")).toHaveAttribute("aria-checked", "mixed");
  });

  it("checks the whole way up once every leaf is", async () => {
    const user = userEvent.setup();
    render(<Tree treeData={TREE} defaultExpandAll checkable />);
    await user.click(named("Guide").querySelector("input")!);
    await user.click(named("API").querySelector("input")!);
    await waitFor(() => expect(named("Docs")).toHaveAttribute("aria-checked", "true"));
  });

  it("announces the check once, on the row, not twice", () => {
    render(<Tree treeData={TREE} defaultExpandAll checkable />);
    // The row carries `aria-checked`, so the input inside it is decoration —
    // without hiding it the state is read out once per element.
    expect(named("Intro").querySelector("input")).toHaveAttribute("aria-hidden", "true");
    expect(named("Intro").querySelector("input")!.tabIndex).toBe(-1);
  });

  it("leaves a disabled node out of a parent's tick", async () => {
    const user = userEvent.setup();
    const guarded: TreeNode[] = [
      {
        key: "root",
        title: "Root",
        children: [
          { key: "free", title: "Free" },
          { key: "locked", title: "Locked", disabled: true },
        ],
      },
    ];
    const onCheck = vi.fn();
    render(<Tree treeData={guarded} defaultExpandAll checkable onCheck={onCheck} />);
    await user.click(named("Root").querySelector("input")!);
    // A parent tick must not reach through something the user was told they
    // cannot change.
    expect(onCheck.mock.calls[0]![0]).not.toContain("locked");
  });

  it("does nothing at all when the whole tree is disabled", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onCheck = vi.fn();
    render(
      <Tree
        treeData={TREE}
        defaultExpandAll
        disabled
        checkable
        onSelect={onSelect}
        onCheck={onCheck}
      />
    );
    await user.click(named("Intro"));
    await user.click(named("Intro").querySelector("input")!);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onCheck).not.toHaveBeenCalled();
  });

  it("renders a custom title", () => {
    render(
      <Tree
        treeData={TREE}
        defaultExpandAll
        titleRender={(node, flat) => `${node.key}@${flat.depth}`}
      />
    );
    expect(screen.getByText("intro@2")).toBeInTheDocument();
  });
});

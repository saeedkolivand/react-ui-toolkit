import { describe, expect, it } from "vitest";
import {
  allNodes,
  checkableDescendants,
  checkedLeaves,
  expandableKeys,
  flattenTree,
  resolveChecks,
  toggleCheck,
  type TreeNode,
} from "./tree";

/**
 * docs
 *   guide
 *     intro
 *     setup
 *   api
 * changelog
 */
const TREE: TreeNode[] = [
  {
    key: "docs",
    children: [{ key: "guide", children: [{ key: "intro" }, { key: "setup" }] }, { key: "api" }],
  },
  { key: "changelog" },
];

const keys = (set: Set<string>) => [...set].sort();

describe("flattenTree", () => {
  it("omits a collapsed node's descendants entirely", () => {
    // Absent rather than marked hidden, so "the next node" is the next entry —
    // otherwise every caller reimplements the skip and one gets it wrong.
    expect(flattenTree(TREE, new Set()).map(f => f.key)).toEqual(["docs", "changelog"]);
    expect(flattenTree(TREE, new Set(["docs"])).map(f => f.key)).toEqual([
      "docs",
      "guide",
      "api",
      "changelog",
    ]);
  });

  it("carries the depth and the ancestor trail", () => {
    const flat = flattenTree(TREE, new Set(["docs", "guide"]));
    const intro = flat.find(f => f.key === "intro")!;
    expect(intro.depth).toBe(2);
    expect(intro.parents).toEqual(["docs", "guide"]);
  });

  it("expands a node only when it has children to show", () => {
    const flat = flattenTree(TREE, new Set(["docs", "changelog"]));
    expect(flat.find(f => f.key === "changelog")!.expandable).toBe(false);
    expect(flat.find(f => f.key === "changelog")!.expanded).toBe(false);
    expect(flat.find(f => f.key === "docs")!.expanded).toBe(true);
  });

  it("takes `isLeaf` over the children a node actually has", () => {
    // The node that matters is one WITH children — `isLeaf` on a node whose
    // `children` is empty is the case where honouring the flag and ignoring it
    // agree, so it asserts nothing about the flag.
    const lazy: TreeNode[] = [
      { key: "declared", isLeaf: true, children: [{ key: "unreachable" }] },
      { key: "empty", children: [] },
      { key: "real", children: [{ key: "child" }] },
    ];
    const flat = flattenTree(lazy, new Set(["declared", "empty", "real"]));
    expect(flat.map(f => `${f.key}:${f.expandable}`)).toEqual([
      "declared:false",
      "empty:false",
      "real:true",
      "child:false",
    ]);
    // And the subtree under a declared leaf is not walked, so nothing it holds
    // can be reached by a keyboard that only sees the flat list.
    expect(flat.some(f => f.key === "unreachable")).toBe(false);
  });
});

describe("allNodes and expandableKeys", () => {
  it("walks the whole tree regardless of what is open", () => {
    expect(allNodes(TREE).map(n => n.key)).toEqual([
      "docs",
      "guide",
      "intro",
      "setup",
      "api",
      "changelog",
    ]);
  });

  it("names only what an expand-all would open", () => {
    expect(expandableKeys(TREE)).toEqual(["docs", "guide"]);
  });
});

describe("checkableDescendants", () => {
  it("skips an unchecked-able node and everything under it", () => {
    // A heading inside a tree of options is not a thing to tick, and neither is
    // anything it holds only for grouping.
    const withHeading: TreeNode[] = [
      {
        key: "root",
        children: [
          { key: "group", checkable: false, children: [{ key: "hidden" }] },
          { key: "real" },
        ],
      },
    ];
    expect(checkableDescendants(withHeading[0]!).map(n => n.key)).toEqual(["real"]);
  });
});

describe("resolveChecks", () => {
  it("derives a parent from its children rather than storing it", () => {
    const state = resolveChecks(TREE, new Set(["intro", "setup"]));
    // guide is full because both its children are; docs is partial because api
    // is not.
    expect(keys(state.checked)).toEqual(["guide", "intro", "setup"]);
    expect(keys(state.indeterminate)).toEqual(["docs"]);
  });

  it("checks the whole way up when every leaf is", () => {
    const state = resolveChecks(TREE, new Set(["intro", "setup", "api"]));
    expect(keys(state.checked)).toEqual(["api", "docs", "guide", "intro", "setup"]);
    expect(keys(state.indeterminate)).toEqual([]);
  });

  it("reports nothing for an empty selection", () => {
    const state = resolveChecks(TREE, new Set());
    expect(keys(state.checked)).toEqual([]);
    expect(keys(state.indeterminate)).toEqual([]);
  });

  it("ignores a stored parent key that its children do not support", () => {
    // The reason the parent is derived: an incremental version told to add
    // "docs" would keep it ticked over children it has never seen.
    const state = resolveChecks(TREE, new Set(["docs"]));
    expect(keys(state.checked)).toEqual([]);
    expect(keys(state.indeterminate)).toEqual([]);
  });

  it("leaves an unchecked-able branch out of its parent's count", () => {
    const withHeading: TreeNode[] = [
      {
        key: "root",
        children: [
          { key: "group", checkable: false, children: [{ key: "hidden" }] },
          { key: "real" },
        ],
      },
    ];
    // `real` alone makes `root` full — the excluded branch does not hold it
    // back at indeterminate forever.
    const state = resolveChecks(withHeading, new Set(["real"]));
    expect(keys(state.checked)).toEqual(["real", "root"]);
    expect(keys(state.indeterminate)).toEqual([]);
  });
});

describe("toggleCheck", () => {
  it("ticks a subtree and unticks it again", () => {
    const on = toggleCheck(TREE, new Set(), "guide", true);
    expect(keys(on)).toEqual(["guide", "intro", "setup"]);
    expect(keys(toggleCheck(TREE, on, "guide", false))).toEqual([]);
  });

  it("leaves a disabled node alone in both directions", () => {
    const guarded: TreeNode[] = [
      { key: "root", children: [{ key: "free" }, { key: "locked", disabled: true }] },
    ];
    // A parent tick must not reach through something the user was told they
    // cannot change.
    expect(keys(toggleCheck(guarded, new Set(), "root", true))).toEqual(["free", "root"]);
    expect(keys(toggleCheck(guarded, new Set(["free", "locked"]), "root", false))).toEqual([
      "locked",
    ]);
  });

  it("refuses a node that is not checkable", () => {
    const withHeading: TreeNode[] = [{ key: "group", checkable: false, children: [{ key: "a" }] }];
    expect(keys(toggleCheck(withHeading, new Set(), "group", true))).toEqual([]);
  });

  it("does nothing for a key that is not in the tree", () => {
    expect(keys(toggleCheck(TREE, new Set(["intro"]), "nope", true))).toEqual(["intro"]);
  });
});

describe("checkedLeaves", () => {
  it("returns the leaves and not the parents derived from them", () => {
    const state = resolveChecks(TREE, toggleCheck(TREE, new Set(), "docs", true));
    // A parent key in a form payload is a restatement the server then has to
    // decide whether to trust.
    expect(checkedLeaves(TREE, state.checked)).toEqual(["intro", "setup", "api"]);
  });
});

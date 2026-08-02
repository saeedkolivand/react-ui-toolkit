/**
 * Tree arithmetic: what is visible, and what a check means.
 *
 * A tree is nested and a keyboard is not — every arrow key, every roving tab
 * stop and every "next visible node" question is asked of a FLAT list, and
 * flattening is where an implementation gets it wrong. So that lives here, once,
 * rather than in four adapters.
 *
 * The other half is checkbox propagation. "Checked" in a tree is three states,
 * not two, and the third — a parent some of whose descendants are checked — is
 * derived rather than stored. Storing it is what makes a tree drift out of step
 * with itself after a collapse.
 */

export interface TreeNode {
  key: string;
  /** Rendered by the adapter; `unknown` because core has no framework in it. */
  title?: unknown;
  children?: TreeNode[];
  disabled?: boolean;
  /** Excluded from checkbox propagation while still selectable. */
  checkable?: boolean;
  /** Renders no expander and takes no children. */
  isLeaf?: boolean;
}

export interface FlatNode {
  node: TreeNode;
  key: string;
  /** 0 for a root. Drives the indent, and nothing else. */
  depth: number;
  /** Every ancestor's key, nearest last. */
  parents: string[];
  /** Whether it has children to show — `isLeaf` wins over an empty array. */
  expandable: boolean;
  expanded: boolean;
}

/**
 * The nodes a keyboard can reach, in the order it reaches them.
 *
 * A collapsed node's descendants are absent entirely rather than marked hidden:
 * "the next node" has to be answerable by looking at the next entry, or every
 * caller reimplements the skip and one of them gets it wrong.
 */
export function flattenTree(nodes: TreeNode[], expanded: ReadonlySet<string>): FlatNode[] {
  const flat: FlatNode[] = [];

  const walk = (list: TreeNode[], depth: number, parents: string[]) => {
    for (const node of list) {
      // `isLeaf` wins: a node declared a leaf shows no expander even if
      // something handed it an empty `children` array, which is what a
      // lazy-loading caller does before the load.
      const expandable = node.isLeaf !== true && (node.children?.length ?? 0) > 0;
      const isOpen = expandable && expanded.has(node.key);
      flat.push({ node, key: node.key, depth, parents, expandable, expanded: isOpen });
      if (isOpen) walk(node.children!, depth + 1, [...parents, node.key]);
    }
  };

  walk(nodes, 0, []);
  return flat;
}

/** Every node in the tree, collapsed or not, in document order. */
export function allNodes(nodes: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (list: TreeNode[]) => {
    for (const node of list) {
      out.push(node);
      if (node.children) walk(node.children);
    }
  };
  walk(nodes);
  return out;
}

/** Keys of every node that can be expanded, for an expand-all control. */
export const expandableKeys = (nodes: TreeNode[]): string[] =>
  allNodes(nodes)
    .filter(node => node.isLeaf !== true && (node.children?.length ?? 0) > 0)
    .map(node => node.key);

/**
 * A node's own descendants that participate in checking.
 *
 * `checkable: false` excludes a node AND the subtree under it: a heading inside
 * a tree of options is not a thing to tick, and neither is anything it holds
 * only for grouping.
 */
export function checkableDescendants(node: TreeNode): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (list: TreeNode[]) => {
    for (const child of list) {
      if (child.checkable === false) continue;
      out.push(child);
      if (child.children) walk(child.children);
    }
  };
  if (node.children) walk(node.children);
  return out;
}

export interface CheckState {
  /** Fully checked, including every checkable descendant. */
  checked: Set<string>;
  /** Some but not all — derived on every read, never stored. */
  indeterminate: Set<string>;
}

/**
 * Resolves a checked set into the two the UI needs.
 *
 * A parent is checked when every checkable descendant is, and indeterminate
 * when some are. Derived bottom-up on each call rather than maintained
 * incrementally: an incremental version has to be told about every structural
 * change, and a tree that loaded a subtree lazily would keep a parent ticked
 * over children it has never seen.
 */
export function resolveChecks(nodes: TreeNode[], checked: ReadonlySet<string>): CheckState {
  const full = new Set<string>();
  const partial = new Set<string>();

  /** Returns how many of this subtree's checkable leaves are checked, and how many there are. */
  const walk = (node: TreeNode): { on: number; total: number } => {
    const children = (node.children ?? []).filter(child => child.checkable !== false);
    if (children.length === 0) {
      // A leaf answers for itself, and is its own total.
      const on = checked.has(node.key) ? 1 : 0;
      if (on) full.add(node.key);
      return { on, total: 1 };
    }

    let on = 0;
    let total = 0;
    for (const child of children) {
      const counted = walk(child);
      on += counted.on;
      total += counted.total;
    }
    // A branch's own state follows its children, so a parent cannot be ticked
    // over an unticked child — which is the whole contract of a checkbox tree.
    if (on === total) full.add(node.key);
    else if (on > 0) partial.add(node.key);
    return { on, total };
  };

  for (const node of nodes) if (node.checkable !== false) walk(node);
  return { checked: full, indeterminate: partial };
}

/**
 * The set after ticking or unticking one node.
 *
 * Only leaves are stored. A parent's key is derived by `resolveChecks`, so
 * writing it here as well would be two sources for one fact — and the one that
 * drifts is always the stored one.
 */
export function toggleCheck(
  nodes: TreeNode[],
  checked: ReadonlySet<string>,
  key: string,
  on: boolean
): Set<string> {
  const next = new Set(checked);
  const index = new Map<string, TreeNode>();
  for (const node of allNodes(nodes)) index.set(node.key, node);

  const target = index.get(key);
  if (!target || target.checkable === false) return next;

  const affected = [target, ...checkableDescendants(target)];
  // A disabled node keeps whatever it had: a parent tick must not reach through
  // something the user was told they cannot change.
  for (const node of affected) {
    if (node.disabled) continue;
    if (on) next.add(node.key);
    else next.delete(node.key);
  }
  return next;
}

/**
 * The keys to store for a "checked" answer, without the derived parents.
 *
 * What a form wants back is the leaves; a parent key in the payload is a
 * restatement of them that a server then has to decide whether to trust.
 */
export const checkedLeaves = (nodes: TreeNode[], checked: ReadonlySet<string>): string[] =>
  allNodes(nodes)
    .filter(node => (node.children?.length ?? 0) === 0 && checked.has(node.key))
    .map(node => node.key);

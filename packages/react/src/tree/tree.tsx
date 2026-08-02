"use client";

import {
  useId,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  dataAttr,
  checkedLeaves,
  expandableKeys,
  flattenTree,
  resolveChecks,
  toggleCheck,
  type FlatNode,
  type TreeNode,
} from "@crosskit-ui/core";
import { Checkbox } from "../toggle/checkbox";
import { Icon } from "../icon/icon";

export type { TreeNode };

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect" | "title"> {
  treeData: TreeNode[];
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpand?: (keys: string[]) => void;
  /** Open everything at mount. Ignored once `expandedKeys` is controlled. */
  defaultExpandAll?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelect?: (keys: string[], info: { node: TreeNode; selected: boolean }) => void;
  multiple?: boolean;
  /** Show a checkbox on every node, with the usual parent/child propagation. */
  checkable?: boolean;
  /** Leaves only. Parents are derived, so storing them would be two sources for one fact. */
  checkedKeys?: string[];
  defaultCheckedKeys?: string[];
  onCheck?: (keys: string[], info: { node: TreeNode; checked: boolean }) => void;
  /** Renders a node's label. Gets the node and its flattened position. */
  titleRender?: (node: TreeNode, flat: FlatNode) => ReactNode;
  /** Draw the connecting lines down each level. */
  showLine?: boolean;
  /** Clicking a node's label toggles it as well as selecting it. */
  expandOnLabelClick?: boolean;
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function Tree({
  treeData,
  expandedKeys: controlledExpanded,
  defaultExpandedKeys,
  onExpand,
  defaultExpandAll = false,
  selectedKeys: controlledSelected,
  defaultSelectedKeys,
  onSelect,
  multiple = false,
  checkable = false,
  checkedKeys: controlledChecked,
  defaultCheckedKeys,
  onCheck,
  titleRender,
  showLine = false,
  expandOnLabelClick = false,
  disabled = false,
  className,
  ref,
  ...rest
}: TreeProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedKeys ?? (defaultExpandAll ? expandableKeys(treeData) : []))
  );
  const expanded = controlledExpanded ? new Set(controlledExpanded) : uncontrolledExpanded;

  const [uncontrolledSelected, setUncontrolledSelected] = useState<string[]>(
    defaultSelectedKeys ?? []
  );
  const selected = controlledSelected ?? uncontrolledSelected;

  const [uncontrolledChecked, setUncontrolledChecked] = useState<Set<string>>(
    () => new Set(defaultCheckedKeys ?? [])
  );
  const checkedSet = controlledChecked ? new Set(controlledChecked) : uncontrolledChecked;
  // Derived on every render rather than stored: an incremental version would
  // keep a parent ticked over children a lazy load has never delivered.
  const checks = resolveChecks(treeData, checkedSet);

  const flat = flattenTree(treeData, expanded);

  /**
   * The node holding the tree's single tab stop.
   *
   * Clamped to something the flat list actually contains, because collapsing a
   * branch takes the focused node out of the list with it — and a tree whose
   * only tab stop has just been collapsed away is a tree Tab walks straight
   * past.
   */
  const [focused, setFocused] = useState<string | null>(null);
  const active =
    focused !== null && flat.some(entry => entry.key === focused)
      ? focused
      : (selected.find(key => flat.some(entry => entry.key === key)) ?? flat[0]?.key ?? null);

  const setExpanded = (next: Set<string>) => {
    if (!controlledExpanded) setUncontrolledExpanded(next);
    onExpand?.([...next]);
  };

  const toggleExpand = (key: string) => {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpanded(next);
  };

  const select = (entry: FlatNode) => {
    if (disabled || entry.node.disabled) return;
    const isOn = selected.includes(entry.key);
    // Multi-select toggles; single-select replaces, and re-clicking the chosen
    // node clears it — which is the only way back to nothing with a pointer.
    const next = multiple
      ? isOn
        ? selected.filter(key => key !== entry.key)
        : [...selected, entry.key]
      : isOn
        ? []
        : [entry.key];
    if (!controlledSelected) setUncontrolledSelected(next);
    onSelect?.(next, { node: entry.node, selected: !isOn });
  };

  const check = (entry: FlatNode, on: boolean) => {
    if (disabled || entry.node.disabled) return;
    // Narrowed to leaves before it is stored OR reported, so both ends of the
    // contract are the shape the prop documents. `toggleCheck` returns the
    // toggled node's own key as well, which `resolveChecks` then ignores — so
    // emitting it was harmless but still handed a consumer's form the parent
    // keys the docs promise it will not see.
    const leaves = checkedLeaves(treeData, toggleCheck(treeData, checkedSet, entry.key, on));
    if (!controlledChecked) setUncontrolledChecked(new Set(leaves));
    onCheck?.(leaves, { node: entry.node, checked: on });
  };

  const move = (key: string) => {
    setFocused(key);
    // The DOM focus has to follow the stop, or the ring stays where it was and
    // every key after this one still arrives at the old node.
    requestAnimationFrame(() => {
      document.getElementById(nodeId(key))?.focus({ preventScroll: false });
    });
  };

  // `useId`, not a constant. `move()` resolves rows through
  // `document.getElementById`, so two trees on one page — which the stories and
  // the harness both render — shared every row id and an arrow press in one
  // moved focus into the other.
  const autoId = useId();
  const idBase = rest.id ?? autoId;
  const nodeId = (key: string) => `${idBase}-${key}`;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (active === null) return;
    const index = flat.findIndex(entry => entry.key === active);
    const entry = flat[index];
    if (!entry) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        // Clamped, not wrapped: a tree has a top and a bottom, and arriving at
        // the first node by pressing Down past the last is disorienting.
        move(flat[Math.min(index + 1, flat.length - 1)]!.key);
        return;
      case "ArrowUp":
        event.preventDefault();
        move(flat[Math.max(index - 1, 0)]!.key);
        return;
      case "ArrowRight":
        event.preventDefault();
        // Open, then step in — the two halves of "go deeper" on one key, which
        // is what the treegrid pattern asks for.
        if (entry.expandable && !entry.expanded) toggleExpand(entry.key);
        else if (entry.expanded && flat[index + 1]) move(flat[index + 1]!.key);
        return;
      case "ArrowLeft":
        event.preventDefault();
        // Close, or step out to the parent. Without the second half, a leaf's
        // Left does nothing and the only way back up a deep tree is Up, one
        // sibling at a time.
        if (entry.expanded) toggleExpand(entry.key);
        else if (entry.parents.length > 0) move(entry.parents[entry.parents.length - 1]!);
        return;
      case "Home":
        event.preventDefault();
        if (flat[0]) move(flat[0].key);
        return;
      case "End":
        event.preventDefault();
        if (flat.length > 0) move(flat[flat.length - 1]!.key);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (checkable) check(entry, !checks.checked.has(entry.key));
        else select(entry);
        return;
      default:
    }
  };

  return (
    <div
      ref={ref}
      data-scope="tree"
      data-part="root"
      data-show-line={dataAttr(showLine)}
      data-disabled={dataAttr(disabled)}
      // `tree`, and the rows are `treeitem`. A list of nested lists would be
      // announced as a list of lists, with no level or expansion reported.
      role="tree"
      aria-multiselectable={multiple ? true : undefined}
      className={className}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {flat.map(entry => {
        const isChecked = checks.checked.has(entry.key);
        const isPartial = checks.indeterminate.has(entry.key);
        const off = disabled || entry.node.disabled === true;

        return (
          <div
            key={entry.key}
            id={nodeId(entry.key)}
            data-scope="tree"
            data-part="node"
            data-depth={String(entry.depth)}
            data-selected={dataAttr(selected.includes(entry.key))}
            data-disabled={dataAttr(off)}
            role="treeitem"
            // Both are tri-states the spec reads: absent means "not expandable"
            // and "not selectable", which are different statements from
            // "collapsed" and "not selected". This is the one place `"false"` is
            // the right answer, and it is deliberately not `dataAttr`.
            aria-expanded={entry.expandable ? (entry.expanded ? "true" : "false") : undefined}
            aria-selected={selected.includes(entry.key) ? "true" : "false"}
            aria-level={entry.depth + 1}
            aria-disabled={off ? true : undefined}
            aria-checked={checkable ? (isPartial ? "mixed" : isChecked) : undefined}
            // One tab stop for the whole tree, which is the pattern. A tree of
            // two hundred nodes is not two hundred stops.
            tabIndex={entry.key === active ? 0 : -1}
            // The indent is data, not markup: nesting the rows would make the
            // flat list the keyboard walks disagree with the DOM.
            style={{ ["--ck-tree-depth" as string]: entry.depth }}
            onFocus={() => setFocused(entry.key)}
            onClick={() => {
              if (expandOnLabelClick && entry.expandable) toggleExpand(entry.key);
              select(entry);
            }}
          >
            <span
              data-scope="tree"
              data-part="expander"
              data-expandable={dataAttr(entry.expandable)}
              // Not a button: it sits inside a `treeitem`, whose own
              // `aria-expanded` already reports the state, and a nested button
              // would be a second stop announcing the same thing twice.
              aria-hidden="true"
              onClick={event => {
                event.stopPropagation();
                if (entry.expandable) toggleExpand(entry.key);
              }}
            >
              {entry.expandable && <Icon name="chevronRight" size="sm" />}
            </span>

            {/* The Checkbox gets NO `data-part` of ours. Consumer attributes
                spread last, so stamping one here REPLACES its own
                `data-part="control"`, and every `[data-scope="checkbox"]
                [data-part="control"]` rule stops matching — appearance, size,
                border, radius and the `:checked`/`:indeterminate` fills all go,
                leaving a native box with no `mixed` visual at all. Nothing in
                `tree.css` referenced the name either way. */}
            {checkable && (
              <Checkbox
                checked={isChecked}
                indeterminate={isPartial}
                disabled={off}
                // The row carries `aria-checked`, so the input inside it is
                // decoration as far as a screen reader is concerned — without
                // this the state is announced twice, once per element.
                aria-hidden="true"
                tabIndex={-1}
                onChange={event => check(entry, event.target.checked)}
                onClick={event => event.stopPropagation()}
              />
            )}

            <span data-scope="tree" data-part="title">
              {titleRender ? titleRender(entry.node, entry) : (entry.node.title as ReactNode)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  allNodes,
  checkedLeaves,
  contains,
  dataAttr,
  resolveChecks,
  toggleCheck,
  type TreeNode,
} from "@crosskit-ui/core";
import { AnchoredView } from "../anchored/anchored";
import { useAnchored } from "../anchored/use-anchored";
import { useConfig } from "../config/config-provider";
import { Icon } from "../icon/icon";
import { Tree } from "./tree";

export type TreeSelectSize = "small" | "middle" | "large";

export interface TreeSelectProps {
  treeData: TreeNode[];
  /** A key when single, an array when `multiple` or `treeCheckable`. */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  /** The value in the mode's own shape, and the matching node titles. */
  onChange?: (value: string | string[] | null, labels: string[]) => void;
  multiple?: boolean;
  /** Checkboxes with the usual parent/child propagation. Implies `multiple`. */
  treeCheckable?: boolean;
  treeDefaultExpandAll?: boolean;
  treeExpandedKeys?: string[];
  onTreeExpand?: (keys: string[]) => void;
  placeholder?: string;
  /** Collapse the tags past this many into a "+N" counter. */
  maxTagCount?: number;
  size?: TreeSelectSize;
  status?: "error" | "warning";
  disabled?: boolean;
  allowClear?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  onBlur?: () => void;
  ref?: Ref<HTMLButtonElement>;
  children?: ReactNode;
}

const asArray = (value: string | string[] | null | undefined): string[] =>
  value === null || value === undefined ? [] : Array.isArray(value) ? value : [value];

export function TreeSelect({
  treeData,
  value: controlled,
  defaultValue,
  onChange,
  multiple = false,
  treeCheckable = false,
  treeDefaultExpandAll = false,
  treeExpandedKeys,
  onTreeExpand,
  placeholder,
  maxTagCount,
  size = "middle",
  status,
  disabled = false,
  allowClear = true,
  open,
  defaultOpen,
  onOpenChange,
  className,
  id,
  name,
  onBlur,
  ref,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
}: TreeSelectProps) {
  const { locale } = useConfig();
  // Checkable is inherently many-valued: a parent tick is a statement about
  // several nodes, so a single-valued checkable tree could not report it.
  const many = multiple || treeCheckable;

  const [uncontrolled, setUncontrolled] = useState<string[]>(() => asArray(defaultValue));
  const keys = controlled === undefined ? uncontrolled : asArray(controlled);

  // Memoised: this walks the WHOLE tree, collapsed or not, and it was doing so
  // on every render including while the popup is shut.
  const titles = useMemo(() => {
    const map = new Map<string, string>();
    for (const node of allNodes(treeData)) {
      map.set(node.key, typeof node.title === "string" ? node.title : node.key);
    }
    return map;
  }, [treeData]);
  const labelOf = (key: string) => titles.get(key) ?? key;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const setTrigger = (node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const handOverRef = useRef(false);

  const anchored = useAnchored({
    open,
    defaultOpen,
    placement: "bottomLeft",
    trigger: "click",
    disabled,
    arrow: false,
    scope: "tree-select",
    // The union `useAnchored` accepts has no `tree`, and the role is stripped
    // from the content below anyway — what it drives here is the trigger's
    // `aria-haspopup`, which is set explicitly on the button instead.
    role: "listbox",
    // Focus stays on the trigger, so the combobox keeps announcing itself while
    // the panel is up. ArrowDown is what hands the tree the keyboard, the same
    // bargain the pickers make.
    takeFocus: false,
    onOpenChange: details => {
      onOpenChange?.(details);
      if (details.open) return;
      const content = anchoredRef.current?.contentNode;
      if (content && contains(content, document.activeElement)) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    },
  });

  const anchoredRef = useRef(anchored);
  useEffect(() => {
    anchoredRef.current = anchored;
  });

  useEffect(() => {
    if (!anchored.open || !handOverRef.current) return;
    const row = anchored.contentNode?.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]');
    // Lowered only once there is somewhere to put focus: `open` flips a render
    // before the content ref attaches, and clearing the flag on that pass
    // consumes the request before the tree exists.
    if (!row) return;
    handOverRef.current = false;
    row.focus({ preventScroll: true });
  }, [anchored.open, anchored.contentNode]);

  const commit = (next: string[]) => {
    if (controlled === undefined) setUncontrolled(next);
    const shaped = many ? next : (next[0] ?? null);
    onChange?.(shaped, next.map(labelOf));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      handOverRef.current = true;
      if (!anchored.open) anchored.setOpen(true);
      else {
        anchored.contentNode
          ?.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]')
          ?.focus({ preventScroll: true });
        handOverRef.current = false;
      }
    }
  };

  const shown = maxTagCount === undefined ? keys : keys.slice(0, maxTagCount);
  const hidden = keys.length - shown.length;
  const showClear = allowClear && !disabled && keys.length > 0;

  return (
    <AnchoredView
      anchored={anchored}
      arrow={false}
      className={className}
      triggerPart="control"
      // No role on the wrapper. It was `listbox` with zero options in it, while
      // the trigger truthfully advertised `aria-haspopup="tree"` — two
      // statements about the same popup that disagreed. The `Tree` inside is
      // the widget and carries `role="tree"` itself; a container around it
      // claiming to be a different widget is worse than an unlabelled box.
      contentProps={{ role: undefined }}
      body={
        <Tree
          treeData={treeData}
          checkable={treeCheckable}
          multiple={many}
          defaultExpandAll={treeDefaultExpandAll}
          expandedKeys={treeExpandedKeys}
          onExpand={onTreeExpand}
          selectedKeys={treeCheckable ? [] : keys}
          checkedKeys={treeCheckable ? keys : undefined}
          onSelect={(next, info) => {
            if (treeCheckable) {
              // The row, not just the ~14px box. Tree reports a label click as a
              // selection, and returning here left checkable mode answering only
              // a direct hit on the checkbox — which is most of the row doing
              // nothing at all.
              const on = !resolveChecks(treeData, new Set(keys)).checked.has(info.node.key);
              commit(
                checkedLeaves(treeData, toggleCheck(treeData, new Set(keys), info.node.key, on))
              );
              return;
            }
            // A single-valued select does not clear on a second click of the
            // node it already holds: Tree treats that as a deselect, and a
            // control that empties itself when you confirm your own choice is a
            // trap. It closes instead.
            if (!many && next.length === 0) {
              anchored.setOpen(false);
              triggerRef.current?.focus({ preventScroll: true });
              return;
            }
            commit(next);
            // A single-valued select is finished the moment something is picked;
            // a multi-valued one is not, and closing would make every extra
            // choice a fresh round trip through the trigger.
            if (!many) {
              anchored.setOpen(false);
              triggerRef.current?.focus({ preventScroll: true });
            }
          }}
          onCheck={next => commit(next)}
        />
      }
    >
      <button
        ref={setTrigger}
        type="button"
        data-scope="tree-select"
        data-part="trigger"
        data-size={size}
        data-status={status}
        data-disabled={dataAttr(disabled)}
        data-empty={dataAttr(keys.length === 0)}
        id={id}
        disabled={disabled}
        // `combobox` over a `tree` popup, which is what this is: a control whose
        // value comes from a hierarchical list. `aria-haspopup` names the shape
        // so a screen reader can say what is about to open.
        role="combobox"
        aria-haspopup="tree"
        aria-expanded={anchored.open ? "true" : "false"}
        aria-controls={anchored.open ? anchored.contentId : undefined}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={status === "error" || ariaInvalid ? true : undefined}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      >
        {keys.length === 0 ? (
          <span data-scope="tree-select" data-part="placeholder">
            {placeholder ?? locale.Select.placeholder}
          </span>
        ) : many ? (
          <span data-scope="tree-select" data-part="tags">
            {/* Keyed by the node KEY, not its label. Two nodes can share a
                title — `README` under two folders is the ordinary case — and
                keying on the label makes React see one duplicate key and drop a
                tag. */}
            {shown.map(key => (
              <span key={key} data-scope="tree-select" data-part="tag">
                {labelOf(key)}
              </span>
            ))}
            {hidden > 0 && (
              <span data-scope="tree-select" data-part="tag" data-overflow="">
                +{hidden}
              </span>
            )}
          </span>
        ) : (
          <span data-scope="tree-select" data-part="value-text">
            {labelOf(keys[0]!)}
          </span>
        )}
        <Icon
          name="chevronDown"
          size="sm"
          data-scope="tree-select"
          data-part="indicator"
          data-state={anchored.open ? "open" : "closed"}
        />
      </button>
      {/* `name` on a `type="button"` is never submitted. A hidden input per key
          is what makes a plain form work, the same trick `Select` uses — one
          per key rather than a joined string, so a multi-valued field arrives
          as a list rather than as something the server has to split. */}
      {name !== undefined &&
        keys.map(key => <input key={key} type="hidden" name={name} value={key} />)}
      {showClear && (
        <button
          type="button"
          data-scope="tree-select"
          data-part="clear"
          aria-label={locale.DatePicker.clear}
          onClick={event => {
            // The trigger wrapper listens for clicks, so without this the clear
            // opens the panel on its way out.
            event.stopPropagation();
            commit([]);
            triggerRef.current?.focus({ preventScroll: true });
          }}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </AnchoredView>
  );
}

"use client";

import { useId, type ReactNode } from "react";
import * as menu from "@zag-js/menu";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import {
  dataAttr,
  resolvePlacement,
  type IconName,
  type LegacyPlacement,
  type Placement,
  type Size,
  type Variant,
} from "@crosskit-ui/core";
import { Icon } from "../icon/icon";
import { usePresence } from "../use-presence";

export interface MenuItem {
  /** v0 called this `key`. */
  value: string;
  label: ReactNode;
  icon?: IconName;
  disabled?: boolean;
  /** Renders in the danger colour. Carried over from v0's MenuItem. */
  danger?: boolean;
}

export interface MenuSeparator {
  separator: true;
}

export type MenuEntry = MenuItem | MenuSeparator;

export interface MenuProps {
  items: MenuEntry[];
  /**
   * Trigger *content*, not a trigger element — Menu renders the button itself
   * so it can carry the machine's props natively. v0 took a whole `<Button>`
   * here, which produced a button nested inside a button.
   */
  trigger: ReactNode;
  triggerVariant?: Variant;
  triggerSize?: Size;
  onSelect?: (details: { value: string }) => void;
  placement?: Placement | LegacyPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  id?: string;
  className?: string;
  triggerClassName?: string;
}

const isSeparator = (entry: MenuEntry): entry is MenuSeparator => "separator" in entry;

export function Menu({
  items,
  trigger,
  triggerVariant = "secondary",
  triggerSize = "md",
  onSelect,
  placement,
  id,
  className,
  triggerClassName,
  ...machineProps
}: MenuProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const service = useMachine(menu.machine, {
    id: id ?? autoId,
    positioning: { placement: resolvePlacement(placement, "bottom-start") },
    onSelect,
    ...machineProps,
  });
  const api = menu.connect(service, normalizeProps);
  const { present, setNode } = usePresence(api.open);

  return (
    <>
      {/* Zag's own data-scope/data-part are replaced with Button's so the
          trigger simply *is* a Button. Nothing in overlay.css targets
          [data-scope="menu"][data-part="trigger"], so nothing is lost — and the
          machine's data-state still lands, which is all the CSS needs. */}
      <button
        {...api.getTriggerProps()}
        data-scope="button"
        data-part="root"
        data-variant={triggerVariant}
        data-size={triggerSize}
        data-menu-trigger=""
        className={triggerClassName}
      >
        {trigger}
      </button>
      {present && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <div ref={setNode} {...api.getContentProps()} className={className}>
              {items.map((entry, index) =>
                isSeparator(entry) ? (
                  // A separator carries no identity and no state, so its
                  // position IS its identity — there is nothing else to key on.
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  <hr key={`sep-${index}`} {...api.getSeparatorProps()} />
                ) : (
                  <div
                    key={entry.value}
                    {...api.getItemProps({ value: entry.value, disabled: entry.disabled })}
                    data-danger={dataAttr(entry.danger)}
                  >
                    {entry.icon && <Icon name={entry.icon} size="sm" />}
                    {entry.label}
                  </div>
                )
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

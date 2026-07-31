"use client";

import { useId, type ReactNode } from "react";
import * as tabs from "@zag-js/tabs";
import { useMachine, normalizeProps } from "@zag-js/react";
import type { Orientation, TabsVariant } from "@crosskit-ui/core";

export interface TabItem {
  /**
   * REQUIRED, unlike v0 where it was optional with a positional fallback.
   * v0's aria-labelledby pointed at `tab-${index}` while the triggers carried
   * no id at all, so the association never resolved.
   */
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Selected tab id. v0 keyed tabs by index via `defaultActiveTab`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (details: { value: string }) => void;
  variant?: TabsVariant;
  orientation?: Orientation;
  /** Activate on focus rather than on click. */
  activationMode?: "automatic" | "manual";
  id?: string;
  className?: string;
}

export function Tabs({
  items,
  variant = "line",
  orientation = "horizontal",
  id,
  className,
  ...machineProps
}: TabsProps) {
  const autoId = useId();
  const service = useMachine(tabs.machine, {
    id: id ?? autoId,
    orientation,
    defaultValue: machineProps.defaultValue ?? items[0]?.id,
    ...machineProps,
  });
  const api = tabs.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-ck-variant={variant} className={className}>
      <div {...api.getListProps()}>
        {items.map(item => (
          <button
            key={item.id}
            {...api.getTriggerProps({ value: item.id, disabled: item.disabled })}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map(item => (
        <div key={item.id} {...api.getContentProps({ value: item.id })}>
          {item.content}
        </div>
      ))}
    </div>
  );
}

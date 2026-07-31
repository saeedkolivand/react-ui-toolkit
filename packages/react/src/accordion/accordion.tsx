"use client";

import { useId, type ReactNode } from "react";
import * as accordion from "@zag-js/accordion";
import { useMachine, normalizeProps } from "@zag-js/react";
import { Icon } from "../icon/icon";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (details: { value: string[] }) => void;
  /** v0 called this `multiple`. */
  allowMultiple?: boolean;
  /** Allow closing the open item, leaving none open. */
  collapsible?: boolean;
  id?: string;
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  collapsible = true,
  id,
  className,
  ...machineProps
}: AccordionProps) {
  const autoId = useId();
  const service = useMachine(accordion.machine, {
    id: id ?? autoId,
    multiple: allowMultiple,
    collapsible,
    ...machineProps,
  });
  const api = accordion.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} className={className}>
      {items.map(item => {
        const itemProps = { value: item.id, disabled: item.disabled };
        return (
          <div key={item.id} {...api.getItemProps(itemProps)}>
            <h3>
              <button {...api.getItemTriggerProps(itemProps)}>
                {item.title}
                {/* The chevron rotates off the machine's own data-state, so
                    there is no JS toggling a class. */}
                <Icon name="chevronDown" size="sm" data-part="item-indicator" />
              </button>
            </h3>
            <div {...api.getItemContentProps(itemProps)}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );
}

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  TemplateRef,
  contentChildren,
  Directive,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import * as tabs from "@zag-js/tabs";
import * as accordion from "@zag-js/accordion";
import type { Orientation, TabsVariant } from "@crosskit-ui/core";
import { normalizeProps, useMachine, ZagSpread } from "@crosskit-ui/zag-angular";
import { CkIcon } from "../icon/icon.component";

let uid = 0;

export interface CkTabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface CkAccordionItem {
  id: string;
  title: string;
  disabled?: boolean;
}

/**
 * Panel content is supplied as templates keyed by item id.
 *
 * Angular has no per-item slot the way Vue and Svelte do, so a structural
 * directive carrying the id is the closest idiomatic equivalent:
 *
 *   <ng-template ckPanel="overview">…</ng-template>
 */
@Directive({ selector: "[ckPanel]", standalone: true })
export class CkPanel {
  readonly ckPanel = input.required<string>();
  constructor(readonly template: TemplateRef<unknown>) {}
}

@Component({
  selector: "ck-tabs",
  standalone: true,
  imports: [ZagSpread, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [zagSpread]="api().getRootProps()" [attr.data-ck-variant]="variant()">
      <div [zagSpread]="api().getListProps()">
        @for (item of items(); track item.id) {
          <button [zagSpread]="api().getTriggerProps({ value: item.id, disabled: item.disabled })">
            {{ item.label }}
          </button>
        }
      </div>
      @for (item of items(); track item.id) {
        <div [zagSpread]="api().getContentProps({ value: item.id })">
          <ng-container [ngTemplateOutlet]="panelFor(item.id)" />
        </div>
      }
    </div>
  `,
})
export class CkTabs {
  readonly items = input.required<CkTabItem[]>();
  readonly value = model<string | undefined>(undefined);
  readonly defaultValue = input<string>();
  readonly variant = input<TabsVariant>("line");
  readonly orientation = input<Orientation>("horizontal");
  readonly activationMode = input<"automatic" | "manual">();
  readonly id = input<string>();

  private readonly panels = contentChildren(CkPanel);
  private readonly instanceId = `ck-tabs-${++uid}`;

  private readonly service = useMachine(tabs.machine, () => ({
    id: this.id() ?? this.instanceId,
    orientation: this.orientation(),
    value: this.value(),
    defaultValue: this.defaultValue() ?? this.items()[0]?.id,
    activationMode: this.activationMode(),
    onValueChange: (d: { value: string }) => this.value.set(d.value),
  }));

  protected readonly api = computed(() => tabs.connect(this.service, normalizeProps));

  protected panelFor(id: string): TemplateRef<unknown> | null {
    return this.panels().find(p => p.ckPanel() === id)?.template ?? null;
  }
}

@Component({
  selector: "ck-accordion",
  standalone: true,
  imports: [ZagSpread, NgTemplateOutlet, CkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [zagSpread]="api().getRootProps()">
      @for (item of items(); track item.id) {
        <div [zagSpread]="api().getItemProps({ value: item.id, disabled: item.disabled })">
          <h3>
            <button
              [zagSpread]="api().getItemTriggerProps({ value: item.id, disabled: item.disabled })"
            >
              {{ item.title }}
              <!-- rotates off the machine's own data-state; no JS toggles a class -->
              <svg ckIcon name="chevronDown" size="sm" data-part="item-indicator"></svg>
            </button>
          </h3>
          <div [zagSpread]="api().getItemContentProps({ value: item.id, disabled: item.disabled })">
            <ng-container [ngTemplateOutlet]="panelFor(item.id)" />
          </div>
        </div>
      }
    </div>
  `,
})
export class CkAccordion {
  readonly items = input.required<CkAccordionItem[]>();
  readonly value = model<string[] | undefined>(undefined);
  readonly defaultValue = input<string[]>();
  readonly allowMultiple = input(false, { transform: booleanAttribute });
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly panels = contentChildren(CkPanel);
  private readonly instanceId = `ck-accordion-${++uid}`;

  private readonly service = useMachine(accordion.machine, () => ({
    id: this.id() ?? this.instanceId,
    multiple: this.allowMultiple(),
    collapsible: this.collapsible(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: (d: { value: string[] }) => this.value.set(d.value),
  }));

  protected readonly api = computed(() => accordion.connect(this.service, normalizeProps));

  protected panelFor(id: string): TemplateRef<unknown> | null {
    return this.panels().find(p => p.ckPanel() === id)?.template ?? null;
  }
}

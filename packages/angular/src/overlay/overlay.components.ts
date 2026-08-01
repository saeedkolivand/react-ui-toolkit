import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import * as tooltip from "@zag-js/tooltip";
import * as menu from "@zag-js/menu";
import {
  isFocusVisible,
  resolvePlacement,
  type IconName,
  type LegacyPlacement,
  type Placement,
  type Size,
  type Variant,
} from "@crosskit-ui/core";
import {
  ckDataAttr,
  CkPortal,
  CkPresenceNode,
  normalizeProps,
  usePresence,
  useMachine,
  ZagSpread,
} from "@crosskit-ui/zag-angular";
import { CkIcon } from "../icon/icon.component";

let uid = 0;

export interface CkMenuItem {
  /** v0 called this `key`. */
  value: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
  danger?: boolean;
}
export interface CkMenuSeparator {
  separator: true;
}
export type CkMenuEntry = CkMenuItem | CkMenuSeparator;

const isSeparator = (entry: CkMenuEntry): entry is CkMenuSeparator => "separator" in entry;

/**
 * The trigger wraps the projected element rather than cloning props onto it.
 * `(focusin)`/`(focusout)` stand in for zag's focus/blur, which do not bubble to
 * a wrapper — see the note in overlay.css for why the wrapper is a real box and
 * not display:contents.
 */
@Component({
  selector: "ck-tooltip",
  standalone: true,
  imports: [CkPortal, ZagSpread, CkPresenceNode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [zagSpread]="api().getTriggerProps()"
      (focusin)="onFocusIn($event)"
      (focusout)="api().setOpen(false)"
    >
      <ng-content />
    </span>
    <ck-portal>
      @if (presence.present()) {
        <div [zagSpread]="api().getPositionerProps()">
          <div [ckPresenceNode]="presence.setNode" [zagSpread]="api().getContentProps()">
            {{ content() }}
            <ng-content select="[ckTooltipContent]" />
          </div>
        </div>
      }
    </ck-portal>
  `,
})
export class CkTooltip {
  readonly content = input<string>();
  /** Accepts the canonical names and v0's corner names (`topLeft`, `rightBottom`, …). */
  readonly placement = input<Placement | LegacyPlacement>();
  readonly open = model<boolean | undefined>(undefined); // enables [(open)]
  readonly defaultOpen = input<boolean>();
  readonly openDelay = input<number>();
  readonly closeDelay = input<number>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly instanceId = `ck-tooltip-${++uid}`;

  // Field initializer => injection context. NOT ngOnInit.
  private readonly service = useMachine(tooltip.machine, () => ({
    id: this.id() ?? this.instanceId,
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    openDelay: this.openDelay(),
    closeDelay: this.closeDelay(),
    disabled: this.disabled(),
    positioning: { placement: resolvePlacement(this.placement()) },
    onOpenChange: (d: { open: boolean }) => this.open.set(d.open),
  }));

  protected readonly api = computed(() => tooltip.connect(this.service, normalizeProps));

  // Gate on presence, NEVER on api().open, or the exit animation never runs.
  protected readonly presence = usePresence(() => ({ present: this.api().open }));

  protected onFocusIn(event: FocusEvent): void {
    if (isFocusVisible(event.target)) this.api().setOpen(true);
  }
}

@Component({
  selector: "ck-menu",
  standalone: true,
  imports: [CkPortal, ZagSpread, CkPresenceNode, CkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Zag's own data-scope/data-part are replaced with Button's so the trigger
         simply IS a Button. Nothing in overlay.css targets
         [data-scope="menu"][data-part="trigger"], and the machine's data-state
         still lands, which is all the CSS needs. -->
    <button
      [zagSpread]="api().getTriggerProps()"
      data-scope="button"
      data-part="root"
      [attr.data-variant]="triggerVariant()"
      [attr.data-size]="triggerSize()"
      data-menu-trigger=""
    >
      {{ trigger() }}
      <ng-content />
    </button>
    <ck-portal>
      @if (presence.present()) {
        <div [zagSpread]="api().getPositionerProps()">
          <div [ckPresenceNode]="presence.setNode" [zagSpread]="api().getContentProps()">
            @for (entry of items(); track entryKey(entry, $index)) {
              @if (isSep(entry)) {
                <hr [zagSpread]="api().getSeparatorProps()" />
              } @else {
                <div
                  [zagSpread]="api().getItemProps({ value: entry.value, disabled: entry.disabled })"
                  [attr.data-danger]="attr(entry.danger)"
                >
                  @if (entry.icon) {
                    <svg ckIcon [name]="entry.icon" size="sm"></svg>
                  }
                  {{ entry.label }}
                </div>
              }
            }
          </div>
        </div>
      }
    </ck-portal>
  `,
})
export class CkMenu {
  /**
   * Not `input.required`, deliberately. `useMachine` must run in a field
   * initializer (that is the only injection context available), and building the
   * machine's props reads this input — before Angular has applied any binding.
   * A required input throws NG0950 at that point, taking the whole component
   * tree down with it. An empty default is the honest shape for an input the
   * component is obliged to read before it can be set.
   */
  readonly items = input<CkMenuEntry[]>([]);
  /** Trigger *content*, not a trigger element — CkMenu renders the button. */
  readonly trigger = input<string>();
  readonly triggerVariant = input<Variant>("secondary");
  readonly triggerSize = input<Size>("md");
  readonly placement = input<Placement | LegacyPlacement>();
  readonly open = model<boolean | undefined>(undefined); // enables [(open)]
  readonly defaultOpen = input<boolean>();
  readonly id = input<string>();
  readonly select = output<{ value: string }>();

  private readonly instanceId = `ck-menu-${++uid}`;
  protected readonly attr = ckDataAttr;
  protected readonly isSep = isSeparator;

  private readonly service = useMachine(menu.machine, () => ({
    id: this.id() ?? this.instanceId,
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    positioning: { placement: resolvePlacement(this.placement(), "bottom-start") },
    onSelect: (d: { value: string }) => this.select.emit(d),
    onOpenChange: (d: { open: boolean }) => this.open.set(d.open),
  }));

  protected readonly api = computed(() => menu.connect(this.service, normalizeProps));
  protected readonly presence = usePresence(() => ({ present: this.api().open }));

  protected entryKey(entry: CkMenuEntry, index: number): string {
    return isSeparator(entry) ? `sep-${index}` : entry.value;
  }
}

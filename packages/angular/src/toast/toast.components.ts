import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import * as toast from "@zag-js/toast";
import type { IconName, Toaster } from "@crosskit-ui/core";
import { normalizeProps, useMachine, ZagSpread } from "@crosskit-ui/zag-angular";
import { CkIcon } from "../icon/icon.component";

let uid = 0;

// Same mapping as CkAlert, so a success toast and a success alert look alike.
const ICON_FOR: Record<string, IconName> = {
  success: "check",
  error: "error",
  warning: "warning",
  info: "info",
};

/**
 * Split out because each toast needs its own machine, and in Angular a machine
 * needs a component to live in — `useMachine` must run in an injection context.
 */
@Component({
  selector: "ck-toast-item",
  standalone: true,
  imports: [ZagSpread, CkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [zagSpread]="api().getRootProps()">
      @if (!hideIcon() && icon()) {
        <svg ckIcon [name]="icon()!" data-part="icon"></svg>
      }
      @if (api().title != null) {
        <h3 [zagSpread]="api().getTitleProps()">{{ api().title }}</h3>
      }
      @if (api().description != null) {
        <p [zagSpread]="api().getDescriptionProps()">{{ api().description }}</p>
      }
      <!-- The action lives on the toast's own options, not on the api — the
           api only supplies the trigger's props and click handling. -->
      @if (item().action; as action) {
        <button [zagSpread]="api().getActionTriggerProps()">{{ action.label }}</button>
      }
      @if (api().closable) {
        <button [zagSpread]="api().getCloseTriggerProps()" aria-label="Dismiss">
          <svg ckIcon name="close" size="sm"></svg>
        </button>
      }
    </div>
  `,
})
export class CkToastItem {
  readonly item = input.required<toast.Props>();
  readonly index = input.required<number>();
  readonly parent = input.required<toast.GroupService>();
  readonly hideIcon = input(false, { transform: booleanAttribute });

  // Field initializer => injection context. NOT ngOnInit.
  private readonly service = useMachine(toast.machine, () => ({
    ...this.item(),
    parent: this.parent(),
    index: this.index(),
  }));

  protected readonly api = computed(() => toast.connect(this.service, normalizeProps));
  protected readonly icon = computed(() => ICON_FOR[this.api().type]);
}

@Component({
  selector: "ck-toaster",
  standalone: true,
  imports: [ZagSpread, CkToastItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [zagSpread]="api().getGroupProps()">
      @for (item of api().getToasts(); track item.id) {
        <ck-toast-item [item]="item" [index]="$index" [parent]="service" [hideIcon]="hideIcon()" />
      }
    </div>
  `,
})
export class CkToaster {
  /** The store from `createToaster()`. */
  readonly toaster = input.required<Toaster>();
  /** Suppress the per-type icon. */
  readonly hideIcon = input(false, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly instanceId = `ck-toaster-${++uid}`;

  protected readonly service = useMachine(toast.group.machine, () => ({
    id: this.id() ?? this.instanceId,
    store: this.toaster(),
  }));

  protected readonly api = computed(() => toast.group.connect(this.service, normalizeProps));
}

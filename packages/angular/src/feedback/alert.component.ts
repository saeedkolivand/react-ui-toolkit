import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import type { IconName, Status } from "@crosskit-ui/core";
import { CkIcon } from "../icon/icon.component";
import { CkButton } from "../button/button.component";

const ICON_FOR: Record<Status, IconName> = {
  info: "info",
  success: "check",
  warning: "warning",
  error: "error",
};

@Component({
  selector: "ck-alert",
  standalone: true,
  imports: [CkIcon, CkButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "alert",
    "data-scope": "alert",
    "data-part": "root",
    "[attr.data-variant]": "variant()",
  },
  template: `
    @if (showIcon()) {
      <svg ckIcon [name]="iconName()" size="md"></svg>
    }
    <div data-part="content">
      @if (title()) {
        <h3 data-part="title">{{ title() }}</h3>
      }
      <div data-part="description"><ng-content /></div>
    </div>
    @if (dismissible()) {
      <button
        ckButton
        variant="ghost"
        size="sm"
        icon="close"
        data-part="close-trigger"
        aria-label="Dismiss"
        (click)="dismiss.emit()"
      ></button>
    }
  `,
})
export class CkAlert {
  readonly variant = input<Status>("info");
  readonly title = input<string>();
  readonly showIcon = input(true, { transform: booleanAttribute });
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly dismiss = output<void>();

  protected readonly iconName = computed(() => ICON_FOR[this.variant()]);
}

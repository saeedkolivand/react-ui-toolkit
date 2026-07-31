import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { CkIcon } from "../icon/icon.component";

@Component({
  selector: "ck-tag",
  standalone: true,
  imports: [CkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "tag",
    "data-part": "root",
    "[attr.data-variant]": "variant()",
    "[attr.data-color]": "color()",
  },
  template: `
    <ng-content />
    @if (closable()) {
      <button type="button" data-part="close-trigger" aria-label="Remove" (click)="close.emit()">
        <svg ckIcon name="close" size="sm"></svg>
      </button>
    }
  `,
})
export class CkTag {
  readonly variant = input<"default" | "outline" | "solid">("default");
  readonly color = input<"default" | "primary" | "success" | "warning" | "error" | "info">(
    "default"
  );
  readonly closable = input(false, { transform: booleanAttribute });
  readonly close = output<void>();
}

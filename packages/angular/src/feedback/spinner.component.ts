import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { Size, Status } from "@crosskit-ui/core";

@Component({
  selector: "ck-spinner",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "status",
    "data-scope": "spinner",
    "data-part": "root",
    "[attr.data-variant]": "variant()",
  },
  template: `
    <span data-part="indicator" [attr.data-size]="size()"></span>
    <span data-part="visually-hidden">{{ label() }}</span>
  `,
})
export class CkSpinner {
  readonly size = input<Size>("md");
  readonly variant = input<"primary" | "secondary" | Status>("primary");
  readonly label = input("Loading…");
}

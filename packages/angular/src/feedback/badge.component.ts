import { booleanAttribute, ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { Size, Status } from "@crosskit-ui/core";
import { ckDataAttr } from "@crosskit-ui/zag-angular";

@Component({
  selector: "ck-badge, span[ckBadge]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "badge",
    "data-part": "root",
    "[attr.data-variant]": "variant()",
    "[attr.data-size]": "size()",
    "[attr.data-rounded]": "attr(rounded())",
    "[attr.data-outlined]": "attr(outlined())",
  },
  template: `<ng-content />`,
})
export class CkBadge {
  readonly variant = input<"primary" | "secondary" | Status>("primary");
  readonly size = input<Size>("md");
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly outlined = input(false, { transform: booleanAttribute });
  protected readonly attr = ckDataAttr;
}

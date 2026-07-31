import { booleanAttribute, ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { Size } from "@crosskit-ui/core";
import { ckDataAttr } from "@crosskit-ui/zag-angular";

/**
 * Header and footer are optional content areas. Angular has no `$slots`
 * equivalent, so they are selected out of projected content — the same pattern
 * the Modal uses for its title/description/footer.
 */
@Component({
  selector: "ck-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "card",
    "data-part": "root",
    "[attr.data-variant]": "variant()",
    "[attr.data-size]": "size()",
    "[attr.data-bordered]": "attr(bordered())",
    "[attr.data-elevated]": "attr(elevated())",
    "[attr.data-hoverable]": "attr(hoverable())",
    "[attr.data-full-width]": "attr(fullWidth())",
  },
  template: `
    <ng-content select="[ckCardHeader]" />
    <div data-part="body"><ng-content /></div>
    <ng-content select="[ckCardFooter]" />
  `,
})
export class CkCard {
  readonly variant = input<"default" | "primary" | "secondary" | "success" | "warning" | "error">(
    "default"
  );
  readonly size = input<Size>("md");
  readonly hoverable = input(false, { transform: booleanAttribute });
  readonly elevated = input(false, { transform: booleanAttribute });
  readonly bordered = input(true, { transform: booleanAttribute });
  readonly fullWidth = input(true, { transform: booleanAttribute });
  protected readonly attr = ckDataAttr;
}

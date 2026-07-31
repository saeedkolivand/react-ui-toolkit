import { booleanAttribute, ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { Orientation } from "@crosskit-ui/core";
import { ckDataAttr } from "@crosskit-ui/zag-angular";

@Component({
  selector: "ck-divider",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "separator",
    "[attr.aria-orientation]": "orientation()",
    "data-scope": "divider",
    "data-part": "root",
    "[attr.data-orientation]": "orientation()",
    "[attr.data-align]": "align()",
    "[attr.data-dashed]": "attr(dashed())",
  },
  template: `
    @if (orientation() === "horizontal") {
      <span data-part="line"></span>
      @if (label()) {
        <span data-part="label">{{ label() }}</span>
        <span data-part="line"></span>
      }
    }
  `,
})
export class CkDivider {
  readonly orientation = input<Orientation>("horizontal");
  readonly align = input<"start" | "center" | "end">("center");
  readonly dashed = input(false, { transform: booleanAttribute });
  /** Angular cannot conditionally wrap projected content, so the label is a prop. */
  readonly label = input<string>();
  protected readonly attr = ckDataAttr;
}

import { booleanAttribute, ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { Size, Variant } from "@crosskit-ui/core";
import { ckDataAttr } from "@crosskit-ui/zag-angular";

/**
 * Attribute selector on the NATIVE element, not a <ck-button> wrapper.
 *
 * This is Angular's answer to className passthrough: the consumer's class, id,
 * (click), [routerLink], [disabled] and type all land on the real <button> with
 * zero plumbing and no extra DOM node — and our CSS targets exactly the same
 * element as in React, Vue and Svelte.
 *
 * Note there is deliberately NO `styles:` block. Declaring styles would make
 * Angular add _ngcontent-* scoping attributes, and portaled content (dialogs,
 * menus) lives outside this component's encapsulation anyway. All styling comes
 * from the global @crosskit-ui/styles sheet.
 */
@Component({
  selector: "button[ckButton]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "button",
    "data-part": "root",
    "[attr.type]": "type()",
    "[attr.data-variant]": "variant()",
    "[attr.data-size]": "size()",
    "[attr.data-loading]": "attr(loading())",
    "[attr.data-disabled]": "attr(disabled())",
    "[attr.data-full-width]": "attr(fullWidth())",
    "[disabled]": "disabled() || loading()",
  },
  template: `<span data-part="label"><ng-content /></span>`,
})
export class CkButton {
  readonly variant = input<Variant>("primary");
  readonly size = input<Size>("md");
  readonly loading = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<"button" | "submit" | "reset">("button");

  /** Angular removes an attribute on null, not undefined. */
  protected readonly attr = ckDataAttr;
}

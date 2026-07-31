import { booleanAttribute, ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { IconName, Size, Variant } from "@crosskit-ui/core";
import { ckDataAttr } from "@crosskit-ui/zag-angular";
import { CkIcon } from "../icon/icon.component";
import { CkSpinner } from "../feedback/spinner.component";

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
  imports: [CkIcon, CkSpinner],
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
    "[attr.data-icon-position]": "icon() ? iconPosition() : null",
    "[disabled]": "disabled() || loading()",
  },
  template: `
    @if (loading()) {
      <ck-spinner [size]="size()" label="" />
    }
    @if (icon() && iconPosition() === "left") {
      <svg ckIcon [name]="icon()!" [size]="size()"></svg>
    }
    <span data-part="label"><ng-content /></span>
    @if (icon() && iconPosition() === "right") {
      <svg ckIcon [name]="icon()!" [size]="size()"></svg>
    }
  `,
})
export class CkButton {
  readonly variant = input<Variant>("primary");
  readonly size = input<Size>("md");
  readonly loading = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly icon = input<IconName>();
  readonly iconPosition = input<"left" | "right">("left");
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<"button" | "submit" | "reset">("button");

  /** Angular removes an attribute on null, not undefined. */
  protected readonly attr = ckDataAttr;
}

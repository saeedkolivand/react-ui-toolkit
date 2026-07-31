import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { ICON_VIEW_BOX, iconPaths, type IconName, type IconSize } from "@crosskit-ui/core";

/**
 * Attribute selector on a native <svg>, matching the Button's `button[ckButton]`
 * approach: the consumer's class/id land on the real element and the DOM stays
 * identical to the other three adapters.
 *
 * NOTE the `svg:path` namespace prefix in the template. Angular templates are
 * parsed as HTML, so an unprefixed <path> inside a component template is created
 * in the XHTML namespace and renders as nothing. This is the one Angular-only
 * wrinkle in an otherwise byte-identical component.
 */
@Component({
  selector: "svg[ckIcon]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    xmlns: "http://www.w3.org/2000/svg",
    "[attr.viewBox]": "viewBox",
    "aria-hidden": "true",
    focusable: "false",
    "data-scope": "icon",
    "data-part": "root",
    "[attr.data-size]": "size()",
  },
  template: `
    @for (d of paths(); track d) {
      <svg:path [attr.d]="d" />
    }
  `,
})
export class CkIcon {
  readonly name = input.required<IconName>();
  readonly size = input<IconSize>("md");

  protected readonly viewBox = ICON_VIEW_BOX;
  protected readonly paths = computed<readonly string[]>(() => iconPaths[this.name()] ?? []);
}

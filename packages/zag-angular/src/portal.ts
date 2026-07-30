// createEmbeddedView + appendChild, ~40 lines, no @angular/cdk peer dependency.
// The view stays in the LOGICAL Angular tree (DI, change detection and @if all
// keep working) while its DOM nodes live in document.body.
import {
  AfterViewInit,
  booleanAttribute,
  Component,
  EmbeddedViewRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  viewChild,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "ck-portal",
  standalone: true,
  template: `<ng-template #tpl><ng-content /></ng-template>`,
})
export class CkPortal implements AfterViewInit, OnDestroy {
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly container = input<HTMLElement>();

  private readonly tpl = viewChild.required<TemplateRef<unknown>>("tpl");
  private readonly vcr = inject(ViewContainerRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private view?: EmbeddedViewRef<unknown>;

  ngAfterViewInit() {
    // Render nothing on the server — same as Zag's React Portal. A dialog is
    // closed on first paint anyway, and this avoids NG0500 hydration mismatches.
    if (!this.isBrowser) return;
    this.view = this.vcr.createEmbeddedView(this.tpl());
    const host = this.container() ?? document.body;
    this.view.rootNodes.forEach((n: Node) => host.appendChild(n));
    this.view.detectChanges();
  }

  ngOnDestroy() {
    this.view?.destroy();
  }
}

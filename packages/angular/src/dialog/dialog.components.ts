import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from "@angular/core";
import * as dialog from "@zag-js/dialog";
import type { ModalSize, Side, Size } from "@crosskit-ui/core";
import {
  ckDataAttr,
  CkPortal,
  CkPresenceNode,
  normalizeProps,
  usePresence,
  useMachine,
  ZagSpread,
} from "@crosskit-ui/zag-angular";
import { CkButton } from "../button/button.component";

let uid = 0;

/**
 * Angular has no `$slots`, so the optional title and description are inputs
 * rather than conditionally-wrapped projected content — projecting them would
 * emit empty elements and break `aria-labelledby`, which must resolve to a real
 * rendered id.
 *
 * Note there is no `styles:` block: the content is portaled to document.body,
 * outside this component's view encapsulation, so scoped styles would never
 * reach it. All styling comes from the global sheet.
 */
@Component({
  selector: "ck-modal",
  standalone: true,
  imports: [CkPortal, ZagSpread, CkPresenceNode, CkButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ck-portal>
      @if (presence.present()) {
        <div [zagSpread]="api().getBackdropProps()" data-ck="modal"></div>
        <div
          [zagSpread]="api().getPositionerProps()"
          data-ck="modal"
          [attr.data-centered]="attr(centered())"
        >
          <div
            [ckPresenceNode]="presence.setNode"
            [zagSpread]="api().getContentProps()"
            data-ck="modal"
            [attr.data-size]="size()"
            [attr.data-scrollable]="attr(scrollable())"
          >
            @if (title()) {
              <h2 [zagSpread]="api().getTitleProps()">{{ title() }}</h2>
            }
            @if (description()) {
              <p [zagSpread]="api().getDescriptionProps()">{{ description() }}</p>
            }
            <div data-scope="dialog" data-part="body" data-ck="modal"><ng-content /></div>
            <ng-content select="[ckModalFooter]" />
            @if (showCloseButton()) {
              <button
                ckButton
                variant="ghost"
                size="sm"
                icon="close"
                data-close-trigger=""
                aria-label="Close"
                (click)="api().setOpen(false)"
              ></button>
            }
          </div>
        </div>
      }
    </ck-portal>
  `,
})
export class CkModal {
  readonly open = model<boolean | undefined>(undefined); // enables [(open)]
  readonly defaultOpen = input<boolean>();
  readonly size = input<ModalSize>("md");
  readonly title = input<string>();
  readonly description = input<string>();
  readonly role = input<"dialog" | "alertdialog">("dialog");
  readonly modal = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closeOnInteractOutside = input(true, { transform: booleanAttribute });
  readonly showCloseButton = input(true, { transform: booleanAttribute });
  readonly centered = input(true, { transform: booleanAttribute });
  readonly scrollable = input(true, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly instanceId = `ck-modal-${++uid}`;
  protected readonly attr = ckDataAttr;

  // Field initializer => injection context. NOT ngOnInit.
  private readonly service = useMachine(dialog.machine, () => ({
    id: this.id() ?? this.instanceId,
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    role: this.role(),
    modal: this.modal(),
    closeOnEscape: this.closeOnEscape(),
    closeOnInteractOutside: this.closeOnInteractOutside(),
    onOpenChange: (d: { open: boolean }) => this.open.set(d.open),
  }));

  protected readonly api = computed(() => dialog.connect(this.service, normalizeProps));

  /** Exposed so a consumer's own button can carry the machine's trigger props,
   *  which is what lets zag restore focus to it on close. */
  readonly triggerProps = computed(() => this.api().getTriggerProps());

  // Gate on presence, NEVER on api().open, or the exit animation never runs.
  protected readonly presence = usePresence(() => ({ present: this.api().open }));
}

/** The same machine as CkModal; only data-ck, placement and animation differ. */
@Component({
  selector: "ck-drawer",
  standalone: true,
  imports: [CkPortal, ZagSpread, CkPresenceNode, CkButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ck-portal>
      @if (presence.present()) {
        <div [zagSpread]="api().getBackdropProps()" data-ck="drawer"></div>
        <div [zagSpread]="api().getPositionerProps()" data-ck="drawer">
          <div
            [ckPresenceNode]="presence.setNode"
            [zagSpread]="api().getContentProps()"
            data-ck="drawer"
            [attr.data-placement]="placement()"
            [attr.data-size]="size()"
          >
            @if (title()) {
              <h2 [zagSpread]="api().getTitleProps()">{{ title() }}</h2>
            }
            @if (description()) {
              <p [zagSpread]="api().getDescriptionProps()">{{ description() }}</p>
            }
            <div data-scope="dialog" data-part="body" data-ck="drawer"><ng-content /></div>
            <ng-content select="[ckDrawerFooter]" />
            @if (showCloseButton()) {
              <button
                ckButton
                variant="ghost"
                size="sm"
                icon="close"
                data-close-trigger=""
                aria-label="Close"
                (click)="api().setOpen(false)"
              ></button>
            }
          </div>
        </div>
      }
    </ck-portal>
  `,
})
export class CkDrawer {
  readonly open = model<boolean | undefined>(undefined);
  readonly defaultOpen = input<boolean>();
  readonly placement = input<Side>("right");
  readonly size = input<Size>("md");
  readonly title = input<string>();
  readonly description = input<string>();
  readonly role = input<"dialog" | "alertdialog">("dialog");
  readonly modal = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closeOnInteractOutside = input(true, { transform: booleanAttribute });
  readonly showCloseButton = input(true, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly instanceId = `ck-drawer-${++uid}`;

  private readonly service = useMachine(dialog.machine, () => ({
    id: this.id() ?? this.instanceId,
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    role: this.role(),
    modal: this.modal(),
    closeOnEscape: this.closeOnEscape(),
    closeOnInteractOutside: this.closeOnInteractOutside(),
    onOpenChange: (d: { open: boolean }) => this.open.set(d.open),
  }));

  protected readonly api = computed(() => dialog.connect(this.service, normalizeProps));
  readonly triggerProps = computed(() => this.api().getTriggerProps());
  protected readonly presence = usePresence(() => ({ present: this.api().open }));
}

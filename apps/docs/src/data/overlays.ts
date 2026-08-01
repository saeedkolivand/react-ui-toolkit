import type { ComponentDoc } from "./types";

export const overlays: ComponentDoc[] = [
  {
    slug: "modal",
    name: "Modal",
    group: "Overlays",
    scope: "dialog",
    gains: [
      "A focus trap that wraps in both directions and restores focus to the trigger",
      "Escape and outside-press dismissal, each independently switchable",
      "A shared layer stack, so only the topmost overlay answers Escape",
      "Body scroll lock",
      "Everything outside marked inert",
      "SSR safety — v0 called createPortal during render and threw on the server",
    ],
    summary:
      'The overlay template every other one copies, built on the primitives in `@crosskit-ui/core` with no runtime dependency. Rendering is gated on presence, never on `open`, which is what keeps `data-state="closed"` on screen long enough for the exit animation to run.',
    props: [
      { name: "open", type: "boolean", description: "Controlled. v0 called this `isOpen`." },
      { name: "defaultOpen", type: "boolean", description: "Uncontrolled initial state." },
      {
        name: "onOpenChange",
        type: "(d: { open }) => void",
        description: "Reports both directions. v0 had a one-way `onClose`.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl" | "full"',
        default: '"md"',
        description: "Max width.",
      },
      { name: "closeOnEscape", type: "boolean", default: "true", description: "v0: closeOnEsc." },
      {
        name: "closeOnInteractOutside",
        type: "boolean",
        default: "true",
        description: "v0: closeOnBackdropClick.",
      },
      {
        name: "width",
        reactFirst: true,
        type: "number | string",
        description: "Explicit width, overriding `size`. A number is read as px.",
      },
      {
        name: "onOk",
        reactFirst: true,
        type: "() => void | Promise<void>",
        description:
          "The confirm button. Return a promise and it holds the button busy until it settles, so a second press cannot submit twice.",
      },
      {
        name: "onCancel",
        reactFirst: true,
        type: "() => void",
        description:
          "Every route out the user initiated: Cancel, the close button, Escape, and a press on the mask.",
      },
      {
        name: "okText",
        reactFirst: true,
        type: "ReactNode",
        description: "Defaults to the active locale's.",
      },
      {
        name: "cancelText",
        reactFirst: true,
        type: "ReactNode",
        description: "Defaults to the active locale's.",
      },
      {
        name: "okType",
        reactFirst: true,
        type: '"default" | "primary" | "dashed" | "text" | "link"',
        default: '"primary"',
        description: "Visual weight of the confirm button.",
      },
      {
        name: "okDanger",
        reactFirst: true,
        type: "boolean",
        description: "Destructive confirm styling.",
      },
      {
        name: "confirmLoading",
        reactFirst: true,
        type: "boolean",
        description: "Drives the busy state yourself, instead of returning a promise from `onOk`.",
      },
      { name: "title", type: "ReactNode", description: "Heading; wired to aria-labelledby." },
      { name: "description", type: "ReactNode", description: "Wired to aria-describedby." },
      {
        name: "footer",
        reactFirst: true,
        type: "ReactNode | null",
        description:
          "Replaces the default confirm/cancel pair. `null` removes the footer entirely.",
      },
      { name: "centered", type: "boolean", default: "true", description: "Vertical centring." },
      { name: "scrollable", type: "boolean", default: "true", description: "Scroll long content." },
    ],
    parts: [
      { part: "backdrop", description: "The dimmed layer." },
      { part: "positioner", description: "Centres the content; carries data-centered." },
      {
        part: "content",
        description:
          "The dialog itself; carries data-size and data-state, and reads --ck-modal-width when `width` is set.",
      },
      { part: "title / description / body / footer", description: "Content areas." },
    ],
    changes: [
      { from: "isOpen", to: "open" },
      { from: "onClose: () => void", to: "onOpenChange: (d) => void" },
      { from: "closeOnEsc", to: "closeOnEscape" },
      { from: "closeOnBackdropClick", to: "closeOnInteractOutside" },
      {
        from: 'aria-labelledby="modal-title"',
        to: "a generated id that resolves",
        note: "v0's pointed at an element that did not exist.",
      },
    ],
    samples: {
      react: `<Modal open={open} onOpenChange={d => setOpen(d.open)} title="Delete file?">
  This cannot be undone.
</Modal>`,
      vue: `<Modal v-model:open="open" title="Delete file?">This cannot be undone.</Modal>`,
      svelte: `<Modal bind:open title="Delete file?">This cannot be undone.</Modal>`,
      angular: `<ck-modal [(open)]="open" title="Delete file?">
  This cannot be undone.
</ck-modal>`,
    },
  },
  {
    slug: "drawer",
    name: "Drawer",
    group: "Overlays",
    scope: "dialog",
    summary:
      'The same behaviour as Modal — about fifteen lines differ. It is distinguished in CSS by `data-ck="drawer"` plus `data-placement`, since both share `data-scope="dialog"`.',
    props: [
      {
        name: "placement",
        type: '"left" | "right" | "top" | "bottom"',
        default: '"right"',
        description: "Which edge it slides from.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl" | "full"',
        default: '"md"',
        description: "Panel size along its axis.",
      },
      {
        name: "onClose",
        reactFirst: true,
        type: "() => void",
        description: "Escape, a press on the mask, and the close button all arrive here.",
      },
      {
        name: "open, defaultOpen, onOpenChange, role, modal, closeOnEscape, closeOnInteractOutside, showCloseButton, id, className, title, description",
        type: "",
        description:
          "Identical to Modal. Listed rather than implied with an ellipsis: Modal also has centered, scrollable, width and the whole confirm/cancel set, and a Drawer has none of them. `footer` exists on both but differs — Drawer's is a plain slot with no default.",
      },
    ],
    samples: {
      react: `<Drawer open={open} onOpenChange={d => setOpen(d.open)} placement="left" title="Filters">
  …
</Drawer>`,
      vue: `<Drawer v-model:open="open" placement="left" title="Filters">…</Drawer>`,
      svelte: `<Drawer bind:open placement="left" title="Filters">…</Drawer>`,
      angular: `<ck-drawer [(open)]="open" placement="left" title="Filters">…</ck-drawer>`,
    },
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    group: "Overlays",
    scope: "tooltip",
    gains: [
      "Floating UI positioning with collision handling",
      "Open/close delays with a shared group timer",
      "Correct aria-describedby wiring",
    ],
    summary:
      "Deletes the largest file in v0 — three state variables, four refs, three effects, hand-rolled viewport clamping and a manually managed portal container. The trigger wraps your element rather than cloning props onto it.",
    props: [
      {
        name: "title",
        reactFirst: true,
        type: "ReactNode",
        description:
          "The tooltip text. An empty one never opens, so `title={row.note}` is safe without a conditional around it.",
      },
      {
        name: "content",
        reactRemoved: true,
        type: "ReactNode",
        description: "Tooltip body. v2 React: `title`.",
      },
      {
        name: "placement",
        type: "Placement | PlacementAlias",
        default: '"top"',
        description:
          "Accepts the canonical names and all twelve camelCase ones (topLeft, rightBottom, …).",
      },
      {
        name: "trigger",
        reactFirst: true,
        type: '"hover" | "focus" | "click" | Array<…>',
        default: '["hover", "focus"]',
        description:
          "Focus is in the default because a tooltip only a pointer can reach is not a tooltip.",
      },
      {
        name: "mouseEnterDelay",
        reactFirst: true,
        type: "number",
        default: "0.1",
        description: "SECONDS, not milliseconds.",
      },
      {
        name: "mouseLeaveDelay",
        reactFirst: true,
        type: "number",
        default: "0.1",
        description: "SECONDS. Also the window in which moving onto the popup keeps it open.",
      },
      {
        name: "openDelay",
        reactRemoved: true,
        type: "number",
        description: "v0: showDelay. v2 React: mouseEnterDelay.",
      },
      {
        name: "closeDelay",
        reactRemoved: true,
        type: "number",
        description: "v0: hideDelay. v2 React: mouseLeaveDelay.",
      },
      { name: "open", type: "boolean", description: "Controlled. v0: visible." },
      { name: "disabled", type: "boolean", default: "false", description: "Never opens." },
      {
        name: "color",
        reactFirst: true,
        type: "string",
        description: "Any CSS colour. Drives the box and its arrow from one value.",
      },
      {
        name: "overlayClassName",
        reactFirst: true,
        type: "string",
        description: "Class on the popup rather than the trigger.",
      },
      {
        name: "contentClassName",
        reactRemoved: true,
        type: "string",
        description: "Class on the content. v0: overlayClassName. v2 React: overlayClassName.",
      },
    ],
    changes: [
      { from: "visible", to: "open" },
      { from: "showDelay / hideDelay", to: "openDelay / closeDelay" },
      { from: "overlayClassName", to: "contentClassName" },
      {
        from: "contentClassName",
        to: "overlayClassName",
        note: "React only, and back to the name v0 had: the prop names the popup, and `content` is what goes in it.",
      },
      {
        from: "content",
        to: "title",
        note: "React only. Frees `content` for Popover, where a title and a body are different things.",
      },
      {
        from: "cloneElement onto your trigger",
        to: "a wrapper element with display: inline-flex",
        note: "Zag's trigger handlers are pointerenter/pointerleave and focus/blur — none of which bubble — so a box-less wrapper would have worked in React and silently failed everywhere else.",
      },
    ],
    samples: {
      react: `<Tooltip title="Copy to clipboard" placement="top">
  <Button icon="copy" aria-label="Copy" />
</Tooltip>`,
      vue: `<Tooltip content="Copy to clipboard" placement="top">
  <Button icon="copy" aria-label="Copy" />
</Tooltip>`,
      svelte: `<Tooltip content="Copy to clipboard" placement="top">
  <Button icon="copy" aria-label="Copy" />
</Tooltip>`,
      angular: `<ck-tooltip content="Copy to clipboard" placement="top">
  <button ckButton icon="copy" aria-label="Copy"></button>
</ck-tooltip>`,
    },
  },
  {
    slug: "popover",
    name: "Popover",
    group: "Overlays",
    scope: "popover",
    isNew: true,
    gains: [
      "A title and a body, both of which may hold real controls",
      "role=dialog rather than tooltip, so what is inside stays reachable",
      "Hovering the popup keeps it open, so a link in it can be reached",
      "The same twelve placements, collision handling and arrow as Tooltip",
    ],
    summary:
      "The interactive half of Tooltip, and the reason the two are separate components rather than one with a flag. A tooltip DESCRIBES its trigger, so a screen reader flattens its contents into the trigger's description; a popover is a thing the trigger opens, so a button inside it stays a button. New in v2, React first.",
    props: [
      {
        name: "content",
        reactFirst: true,
        type: "ReactNode",
        description: "The body. Unlike a tooltip's, it may contain interactive elements.",
      },
      {
        name: "title",
        reactFirst: true,
        type: "ReactNode",
        description: "An optional heading. The part is omitted entirely when absent.",
      },
      {
        name: "placement",
        reactFirst: true,
        type: "Placement | PlacementAlias",
        default: '"top"',
        description: "The same twelve names Tooltip takes.",
      },
      {
        name: "trigger",
        reactFirst: true,
        type: '"hover" | "focus" | "click" | Array<…>',
        default: '["hover", "click"]',
        description:
          "`click` is in the default because it is the only way a keyboard reaches this one — activating the trigger with Enter or Space dispatches one. A tap toggles it too.",
      },
      {
        name: "open, defaultOpen, onOpenChange",
        reactFirst: true,
        type: "boolean / (d: { open }) => void",
        description: "Controlled or uncontrolled, the same pair every overlay takes.",
      },
      {
        name: "mouseEnterDelay, mouseLeaveDelay",
        reactFirst: true,
        type: "number",
        default: "0.1",
        description:
          "SECONDS. The leave delay is also the window in which moving onto the popup keeps it open.",
      },
      {
        name: "disabled",
        reactFirst: true,
        type: "boolean",
        description: "Never opens, and closes if it already was.",
      },
      {
        name: "arrow",
        reactFirst: true,
        type: "boolean",
        default: "true",
        description: "Hidden automatically when it can no longer reach the anchor.",
      },
      {
        name: "className",
        reactFirst: true,
        type: "string",
        description: "Lands on the trigger wrapper, which is the root rendered in place.",
      },
      {
        name: "overlayClassName",
        reactFirst: true,
        type: "string",
        description: "Lands on the popup instead.",
      },
    ],
    parts: [
      { part: "trigger", description: "The wrapper around your element. A real inline-flex box." },
      { part: "positioner", description: "Portalled to the body and given viewport coordinates." },
      { part: "content", description: "The popup box." },
      { part: "title", description: "Rendered only when a title is given." },
      { part: "body", description: "Wraps `content`." },
      {
        part: "arrow",
        description: "A sibling of the content, so a scrolling box cannot clip it.",
      },
    ],
    samples: {
      react: `<Popover
  title="Delete this record?"
  content={<Button type="primary" size="small">Yes</Button>}
  trigger="click"
>
  <Button>Delete</Button>
</Popover>`,
      vue: "// Vue lands in the next phase.",
      svelte: "// Svelte lands in the next phase.",
      angular: "// Angular lands in the next phase.",
    },
  },
  {
    slug: "menu",
    name: "Menu / Dropdown",
    group: "Overlays",
    scope: "menu",
    gains: [
      "Arrow-key navigation and typeahead",
      "Roving tabindex",
      "aria-haspopup / aria-expanded / aria-activedescendant",
    ],
    summary:
      "Replaces v0's Dropdown + Menu + MenuItem trio with one data-driven component. v0 took a whole element as its trigger, so the common case put a button inside a button; v1 removed the choice by generating the button itself, and React's v2 Dropdown takes the element back and never wraps it — so your own Button stays exactly one button.",
    props: [
      {
        name: "menu",
        reactFirst: true,
        type: "{ items: DropdownMenuEntry[]; onClick?: (i: { key }) => void }",
        description:
          "React's Dropdown takes one object, so the menu can grow props without competing with the trigger's. Dividers are `{ type: 'divider' }`.",
      },
      {
        name: "children",
        reactFirst: true,
        type: "ReactNode",
        description:
          "React's Dropdown takes the trigger ELEMENT and renders it as given — no generated button, so your own Button stays exactly one button.",
      },
      {
        name: "items",
        reactRemoved: true,
        type: "MenuEntry[]",
        description:
          "Items and `{ separator: true }` marks. v2 React: `menu.items`, with `{ type: 'divider' }`.",
      },
      {
        name: "trigger",
        reactRemoved: true,
        type: "ReactNode",
        description:
          "Trigger *content*, not a trigger element. React's Dropdown takes the element as `children`, and its own `trigger` is something else entirely — which gesture opens the menu.",
      },
      {
        name: "triggerVariant",
        reactRemoved: true,
        type: "Variant",
        default: '"secondary"',
        description: "Styles the generated trigger as a Button.",
      },
      {
        name: "onSelect",
        reactRemoved: true,
        type: "(d: { value }) => void",
        description: "Selection callback.",
      },
      {
        name: "trigger",
        reactFirst: true,
        type: '"hover" | "focus" | "click" | Array<…>',
        default: '"hover"',
        description:
          "Which gesture opens it — the SAME name as the row above and a different thing, which is why that one is flagged. Enter, Space and the arrows open it regardless, because that belongs to the role rather than to this prop, and a tap toggles it.",
      },
      {
        name: "placement",
        type: "Placement | PlacementAlias",
        default: '"bottom-start"',
        description: "Menu position.",
      },
    ],
    changes: [
      { from: "Dropdown + Menu + MenuItem", to: "one Menu with items" },
      {
        from: "Menu with a generated trigger",
        to: "Dropdown wrapping your own trigger",
        note: "React only. The generated button solved nested buttons by removing the choice; taking the element back and never wrapping it solves the same thing without it.",
      },
      { from: "MenuItem.value", to: "item.key (React Dropdown)" },
      { from: "{ separator: true }", to: "{ type: 'divider' } (React Dropdown)" },
      { from: "onSelect(d => d.value)", to: "menu.onClick(i => i.key) (React Dropdown)" },
      { from: "MenuItem.key", to: "MenuItem.value" },
      { from: "overlay", to: "items" },
      {
        from: "children as the trigger element",
        to: "trigger as content",
        note: "<Dropdown><Button/></Dropdown> produced invalid nested buttons.",
      },
    ],
    samples: {
      react: `<Dropdown
  menu={{
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { type: "divider" },
      { key: "delete", label: "Delete", danger: true },
    ],
    onClick: i => run(i.key),
  }}
>
  <Button>Actions</Button>
</Dropdown>`,
      vue: `<Menu trigger="Actions" :items="items" @select="d => run(d.value)" />`,
      svelte: `<Menu trigger="Actions" {items} onSelect={d => run(d.value)} />`,
      angular: `<ck-menu trigger="Actions" [items]="items" (select)="run($event.value)" />`,
    },
  },
  {
    slug: "toast",
    name: "Toast",
    group: "Overlays",
    scope: "toast",
    machine: "@zag-js/toast",
    gains: [
      "A queue with overflow — v0 capped at 5 and dropped the rest",
      "Pause on hover and on focus",
      "Swipe to dismiss",
      "alt+T to move focus into the group",
      "Promise-tracking toasts and update-in-place",
    ],
    summary:
      "The toast queue is a plain store with no framework in it, so the toaster is a module-level singleton. The three lines below are identical in React, Vue, Svelte and Angular — no provider, no inject, no DI token in any of them.",
    props: [
      { name: "toaster", type: "Toaster", description: "The store from createToaster()." },
      { name: "hideIcon", type: "boolean", default: "false", description: "Suppress type icons." },
      {
        name: "createToaster(options)",
        type: "{ placement?, max?, duration?, gap?, offsets? }",
        description: "Defaults to bottom-end, max 5, 5s.",
      },
    ],
    changes: [
      { from: "<NotificationProvider>", to: "<Toaster :toaster> at the root" },
      { from: "const { notify } = useNotification()", to: "import { toaster } — no hook" },
      {
        from: "notify({ type, message, description })",
        to: "toaster.success({ title, description })",
      },
    ],
    samples: {
      react: `// once, anywhere
export const toaster = createToaster();

// once, at the app root
<Toaster toaster={toaster} />

// anywhere — no hook, no context
toaster.success({ title: "Saved" });`,
      vue: `export const toaster = createToaster();

<Toaster :toaster="toaster" />

toaster.success({ title: "Saved" });`,
      svelte: `export const toaster = createToaster();

<Toaster {toaster} />

toaster.success({ title: "Saved" });`,
      angular: `export const toaster = createToaster();

<ck-toaster [toaster]="toaster" />

toaster.success({ title: "Saved" });`,
    },
  },
];

import type { ComponentDoc } from "./types";

export const overlays: ComponentDoc[] = [
  {
    slug: "modal",
    name: "Modal",
    group: "Overlays",
    scope: "dialog",
    machine: "@zag-js/dialog",
    gains: [
      "A focus trap that wraps in both directions and restores focus to the trigger",
      "Escape and outside-click dismissal, each independently switchable",
      "Body scroll lock",
      "Content below marked inert",
      "SSR safety — v0 called createPortal during render and threw on the server",
    ],
    summary:
      'The machine template every overlay copies. Rendering is gated on presence, never on `open`, which is what keeps `data-state="closed"` on screen long enough for the exit animation to run.',
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
      { name: "title", type: "ReactNode", description: "Heading; wired to aria-labelledby." },
      { name: "description", type: "ReactNode", description: "Wired to aria-describedby." },
      { name: "footer", type: "ReactNode", description: "Footer area." },
      { name: "centered", type: "boolean", default: "true", description: "Vertical centring." },
      { name: "scrollable", type: "boolean", default: "true", description: "Scroll long content." },
    ],
    parts: [
      { part: "backdrop", description: "The dimmed layer." },
      { part: "positioner", description: "Centres the content; carries data-centered." },
      { part: "content", description: "The dialog itself; carries data-size and data-state." },
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
    machine: "@zag-js/dialog",
    summary:
      'The same machine as Modal — about fifteen lines differ. It is distinguished in CSS by `data-ck="drawer"` plus `data-placement`, since both share `data-scope="dialog"`.',
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
      { name: "…", type: "", description: "Every other prop matches Modal." },
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
    machine: "@zag-js/tooltip",
    gains: [
      "Floating UI positioning with collision handling",
      "Open/close delays with a shared group timer",
      "Correct aria-describedby wiring",
    ],
    summary:
      "Deletes the largest file in v0 — three state variables, four refs, three effects, hand-rolled viewport clamping and a manually managed portal container. The trigger wraps your element rather than cloning props onto it.",
    props: [
      { name: "content", type: "ReactNode", description: "Tooltip body." },
      {
        name: "placement",
        type: "Placement | LegacyPlacement",
        default: '"top"',
        description:
          "Accepts Floating UI names and all twelve of v0's Ant names (topLeft, rightBottom, …).",
      },
      { name: "openDelay", type: "number", description: "v0: showDelay." },
      { name: "closeDelay", type: "number", description: "v0: hideDelay." },
      { name: "open", type: "boolean", description: "Controlled. v0: visible." },
      { name: "disabled", type: "boolean", default: "false", description: "Never opens." },
      {
        name: "contentClassName",
        type: "string",
        description: "Class on the content. v0: overlayClassName.",
      },
    ],
    changes: [
      { from: "visible", to: "open" },
      { from: "showDelay / hideDelay", to: "openDelay / closeDelay" },
      { from: "overlayClassName", to: "contentClassName" },
      {
        from: "cloneElement onto your trigger",
        to: "a wrapper element with display: inline-flex",
        note: "Zag's trigger handlers are pointerenter/pointerleave and focus/blur — none of which bubble — so a box-less wrapper would have worked in React and silently failed everywhere else.",
      },
    ],
    samples: {
      react: `<Tooltip content="Copy to clipboard" placement="top">
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
    slug: "menu",
    name: "Menu",
    group: "Overlays",
    scope: "menu",
    machine: "@zag-js/menu",
    gains: [
      "Arrow-key navigation and typeahead",
      "Roving tabindex",
      "aria-haspopup / aria-expanded / aria-activedescendant",
    ],
    summary:
      "Replaces v0's Dropdown + Menu + MenuItem trio with one data-driven component. It renders its own trigger button — v0 took a whole element, so the common case put a button inside a button.",
    props: [
      { name: "items", type: "MenuEntry[]", description: "Items and `{ separator: true }` marks." },
      {
        name: "trigger",
        type: "ReactNode",
        description: "Trigger *content*, not a trigger element.",
      },
      {
        name: "triggerVariant",
        type: "Variant",
        default: '"secondary"',
        description: "Styles the generated trigger as a Button.",
      },
      { name: "onSelect", type: "(d: { value }) => void", description: "Selection callback." },
      {
        name: "placement",
        type: "Placement | LegacyPlacement",
        default: '"bottom-start"',
        description: "Menu position.",
      },
    ],
    changes: [
      { from: "Dropdown + Menu + MenuItem", to: "one Menu with items" },
      { from: "MenuItem.key", to: "MenuItem.value" },
      { from: "overlay", to: "items" },
      {
        from: "children as the trigger element",
        to: "trigger as content",
        note: "<Dropdown><Button/></Dropdown> produced invalid nested buttons.",
      },
    ],
    samples: {
      react: `<Menu
  trigger="Actions"
  items={[
    { value: "edit", label: "Edit", icon: "edit" },
    { separator: true },
    { value: "delete", label: "Delete", danger: true },
  ]}
  onSelect={d => run(d.value)}
/>`,
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

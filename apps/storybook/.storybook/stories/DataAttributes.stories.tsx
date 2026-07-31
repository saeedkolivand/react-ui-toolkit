import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * The stylesheet's own review surface.
 *
 * Every element here is hand-written HTML with data-* attributes — no CrossKit
 * component is imported. That is the point: @crosskit-ui/styles can be built,
 * reviewed and shipped BEFORE any adapter exists, and a regression in the CSS
 * shows up here without a component to hide behind.
 *
 * It also documents the contract the four adapters must emit. If a component in
 * any framework renders markup that differs from what is written here, that
 * component is wrong — not the stylesheet.
 */
const meta = {
  title: "Data attributes/Reference",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
    <code style={{ fontSize: 12, color: "var(--ck-fg-muted)" }}>{label}</code>
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      {children}
    </div>
  </div>
);

export const Button: Story = {
  render: () => (
    <>
      <Row label='[data-scope="button"][data-part="root"][data-variant=…]'>
        {["primary", "secondary", "outline", "ghost", "success", "error", "warning", "info"].map(
          v => (
            <button key={v} data-scope="button" data-part="root" data-variant={v} data-size="md">
              <span data-part="label">{v}</span>
            </button>
          )
        )}
      </Row>
      <Row label="[data-size]">
        {["sm", "md", "lg"].map(s => (
          <button key={s} data-scope="button" data-part="root" data-variant="primary" data-size={s}>
            <span data-part="label">{s}</span>
          </button>
        ))}
      </Row>
      <Row label="[data-disabled] · [data-loading] · [data-full-width]">
        <button
          data-scope="button"
          data-part="root"
          data-variant="primary"
          data-size="md"
          data-disabled=""
        >
          <span data-part="label">disabled</span>
        </button>
        <button
          data-scope="button"
          data-part="root"
          data-variant="primary"
          data-size="md"
          data-loading=""
        >
          <span data-part="label">loading</span>
        </button>
      </Row>
    </>
  ),
};

export const Badge: Story = {
  render: () => (
    <>
      <Row label='[data-scope="badge"][data-variant=…]'>
        {["primary", "secondary", "success", "warning", "error"].map(v => (
          <span key={v} data-scope="badge" data-part="root" data-variant={v} data-size="md">
            {v}
          </span>
        ))}
      </Row>
      <Row label="[data-outlined] · [data-rounded]">
        <span
          data-scope="badge"
          data-part="root"
          data-variant="primary"
          data-size="md"
          data-outlined=""
        >
          outlined
        </span>
        <span
          data-scope="badge"
          data-part="root"
          data-variant="success"
          data-size="md"
          data-rounded=""
        >
          rounded
        </span>
      </Row>
    </>
  ),
};

export const Spinner: Story = {
  render: () => (
    <Row label='[data-scope="spinner"] > [data-part="indicator"][data-size=…]'>
      {["sm", "md", "lg"].map(s => (
        <span key={s} data-scope="spinner" data-part="root" data-variant="primary" role="status">
          <span data-part="indicator" data-size={s} />
        </span>
      ))}
    </Row>
  ),
};

export const Card: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <div
        data-scope="card"
        data-part="root"
        data-variant="default"
        data-size="md"
        data-bordered=""
        data-full-width=""
      >
        <div data-part="header">
          <strong>Header</strong>
        </div>
        <div data-part="body">Bordered, default variant.</div>
        <div data-part="footer">Footer</div>
      </div>
      <div
        data-scope="card"
        data-part="root"
        data-variant="success"
        data-size="md"
        data-bordered=""
        data-elevated=""
        data-full-width=""
      >
        <div data-part="body">Elevated, success variant.</div>
      </div>
    </div>
  ),
};

export const Divider: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <div data-scope="divider" data-part="root" data-orientation="horizontal" data-align="center">
        <span data-part="line" />
      </div>
      <div data-scope="divider" data-part="root" data-orientation="horizontal" data-align="center">
        <span data-part="line" />
        <span data-part="label">with a label</span>
        <span data-part="line" />
      </div>
      <div
        data-scope="divider"
        data-part="root"
        data-orientation="horizontal"
        data-align="center"
        data-dashed=""
      >
        <span data-part="line" />
        <span data-part="label">dashed</span>
        <span data-part="line" />
      </div>
    </div>
  ),
};

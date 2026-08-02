import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@crosskit-ui/react";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj;

const grid = { display: "grid", gap: 20, maxWidth: 420 } as const;

export const Basics: Story = {
  render: () => (
    <div style={grid}>
      <Textarea label="Notes" placeholder="Tell us more" rows={3} />
      {/* Auto-resize is CSS, not a keystroke handler — so it also grows on
          paste, on a programmatic set, and for an initial value. */}
      <Textarea label="Auto-resizing" autoResize placeholder="Type several lines…" />
      <Textarea label="Invalid" invalid errorMessage="Too short" rows={2} />
    </div>
  ),
};

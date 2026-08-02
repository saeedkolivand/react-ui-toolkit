import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@crosskit-ui/react";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj;

export const SizesAndVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      {(["sm", "md", "lg"] as const).map(s => (
        <Spinner key={s} size={s} />
      ))}
      <Spinner variant="success" />
      <Spinner variant="error" />
    </div>
  ),
};

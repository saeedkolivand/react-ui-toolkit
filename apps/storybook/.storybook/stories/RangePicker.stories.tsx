import type { Meta, StoryObj } from "@storybook/react-vite";
import { RangePicker } from "@crosskit-ui/react";

const meta = {
  title: "Components/RangePicker",
  component: RangePicker,
  parameters: { layout: "padded" },
} satisfies Meta<typeof RangePicker>;

export default meta;
type Story = StoryObj;

/** A fixed month, so a story does not change with the day it is opened. */
const MARCH = new Date(2026, 2, 15);

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <RangePicker />
      <RangePicker defaultValue={[MARCH, new Date(2026, 3, 5)]} />
      <RangePicker defaultValue={[MARCH, new Date(2026, 3, 5)]} size="small" />
      <RangePicker status="error" />
      <RangePicker disabled defaultValue={[MARCH, new Date(2026, 3, 5)]} />
      {/* A minimum stay: only expressible because the predicate is told which
          end is being picked and where the other one is. */}
      <RangePicker
        disabledDate={(date, { picking, start }) =>
          picking === "end" && start !== null && date < new Date(start.getTime() + 2 * 864e5)
        }
      />
    </div>
  ),
};

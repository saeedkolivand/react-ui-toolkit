import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "@crosskit-ui/react";

const meta = {
  title: "Components/TimePicker",
  component: TimePicker,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <TimePicker defaultValue={new Date(2026, 2, 15, 14, 30)} />
      <TimePicker defaultValue={new Date(2026, 2, 15, 14, 30)} showSecond />
      <TimePicker defaultValue={new Date(2026, 2, 15, 14, 30)} minuteStep={15} />
      {/* Forced against the locale, both ways — en-US is twelve-hour and en-GB
          is not, which is why the default is asked of `Intl` rather than keyed
          on the language. */}
      <TimePicker defaultValue={new Date(2026, 2, 15, 14, 30)} use12Hours={false} />
      <TimePicker
        defaultValue={new Date(2026, 2, 15, 12, 0)}
        minTime={new Date(2026, 2, 15, 9, 0)}
        maxTime={new Date(2026, 2, 15, 17, 0)}
      />
      <TimePicker status="error" />
      <TimePicker disabled defaultValue={new Date(2026, 2, 15, 14, 30)} />
    </div>
  ),
};

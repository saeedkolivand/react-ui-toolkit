import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Calendar, DatePicker, Form } from "@crosskit-ui/react";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "start" } as const;

/** A fixed month, so a story does not change with the day it is opened. */
const MARCH = new Date(2026, 2, 15);

export const Basics: Story = {
  render: () => (
    <div style={row}>
      <DatePicker defaultValue={MARCH} />
      <DatePicker placeholder="Pick a day" />
      <DatePicker defaultValue={MARCH} size="small" />
      <DatePicker defaultValue={MARCH} size="large" />
      <DatePicker defaultValue={MARCH} status="error" />
      <DatePicker defaultValue={MARCH} disabled />
      {/* The panel is the only way in when the field cannot be typed into. */}
      <DatePicker defaultValue={MARCH} inputReadOnly />
      <DatePicker defaultValue={MARCH} allowClear={false} showToday={false} />
    </div>
  ),
};

/**
 * Weekends off, and nothing before today.
 *
 * The predicate takes the `Date` a consumer already thinks in, so it needs no
 * conversion at the call site.
 *
 * The `Calendar` alongside is deliberate: it is the same `disabledDate` shape on
 * both components, which is the point of the story.
 */
export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <DatePicker
        defaultValue={MARCH}
        disabledDate={date => date.getDay() === 0 || date.getDay() === 6}
      />
      <Calendar defaultValue={MARCH} disabledDate={date => date < new Date(2026, 2, 10)} />
    </div>
  ),
};

export const InAForm: Story = {
  render: () => (
    <Form style={{ maxInlineSize: 420 }} onFinish={() => {}}>
      <Form.Item name="start" label="Start date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="end"
        label="End date"
        dependencies={["start"]}
        rules={[
          {
            validator: (value, values) => {
              const start = (values as { start?: Date }).start;
              if (!value || !start) return undefined;
              return (value as Date) >= start ? undefined : "The end cannot be before the start";
            },
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Book
      </Button>
    </Form>
  ),
};

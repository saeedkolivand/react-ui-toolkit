import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Calendar, ConfigProvider, DatePicker, Form, enUS } from "@crosskit-ui/react";

const meta = {
  title: "Components/Date",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "start" } as const;

/** A fixed month, so a story does not change with the day it is opened. */
const MARCH = new Date(2026, 2, 15);

export const Pickers: Story = {
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

/**
 * Every name comes from `Intl`, and the calendar is forced to Gregorian.
 *
 * Without that, fa-IR would label a Gregorian grid with Persian-calendar month
 * names — about ten days out, with the header disagreeing with every cell under
 * it.
 */
export const Locales: Story = {
  render: () => (
    <div style={row}>
      {(["en-US", "de-DE", "fa-IR", "hi-IN"] as const).map(tag => (
        <ConfigProvider
          key={tag}
          locale={{ ...enUS, tag }}
          direction={tag === "fa-IR" ? "rtl" : "ltr"}
        >
          <div>
            <p style={{ margin: "0 0 8px", fontFamily: "monospace", fontSize: 12 }}>{tag}</p>
            <Calendar defaultValue={MARCH} />
          </div>
        </ConfigProvider>
      ))}
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

export const Fullscreen: Story = {
  render: () => <Calendar defaultValue={MARCH} fullscreen />,
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Calendar,
  ConfigProvider,
  DatePicker,
  Form,
  RangePicker,
  TimePicker,
  enUS,
} from "@crosskit-ui/react";

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

export const Ranges: Story = {
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

export const Times: Story = {
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

export const Fullscreen: Story = {
  render: () => <Calendar defaultValue={MARCH} fullscreen />,
};

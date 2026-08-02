import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, ConfigProvider, enUS } from "@crosskit-ui/react";

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "start" } as const;

/** A fixed month, so a story does not change with the day it is opened. */
const MARCH = new Date(2026, 2, 15);

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

export const Fullscreen: Story = {
  render: () => <Calendar defaultValue={MARCH} fullscreen />,
};

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import {
  Calendar,
  ConfigProvider,
  DatePicker,
  RangePicker,
  TimePicker,
  enUS,
} from "@crosskit-ui/react";

/** A fixed month, so nothing here depends on the day the suite runs. */
const MARCH = new Date(2026, 2, 15);

function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 32, justifyItems: "start" }}>
      <div id="cal" style={{ inlineSize: 300 }}>
        <Calendar defaultValue={MARCH} />
      </div>

      {/* Keep this ABOVE the extra calendars below. The panel's placement is
          `bottomLeft` and the spec asserts it opens below its field, so
          anything that pushes this down the page far enough makes the
          positioner flip it — a harness layout change reads as a placement
          regression. Twice now.

          `transform` on any ancestor becomes the containing block for a
          `position: fixed` descendant, so a panel that is not portalled to
          `document.body` lands offset by however far this sits from the
          viewport origin. */}
      <div id="transformed" style={{ transform: "translateX(0)", marginInlineStart: 80 }}>
        <DatePicker defaultValue={MARCH} />
      </div>

      {/* Two panels side by side. Which one sits first is the whole RTL claim
          for this component, and a flex row's order is layout. */}
      <div id="range">
        <RangePicker defaultValue={[MARCH, new Date(2026, 3, 5)]} defaultOpen />
      </div>

      {/* A 60-entry minute column is taller than most viewports, so the column
          has to scroll inside a bounded panel — the footer being reachable is
          the claim, and a panel that grows to fit is layout jsdom cannot see. */}
      <div id="time">
        {/* Opened by the spec, not `defaultOpen`. Two open portalled panels on
            one page are both `position: fixed` siblings at the end of the body,
            so whichever comes second covers the other and every `hover()` on
            the one underneath times out. */}
        <TimePicker defaultValue={new Date(2026, 2, 15, 14, 30)} showSecond />
      </div>

      {/* A locale whose short weekday names are NOT all the same width — hi-IN
          has मंगल and शुक्र beside बुध. Every name comes from `Intl`, so their
          widths are not ours to choose, and a table that sizes its own columns
          would give this month seven different ones. */}
      <ConfigProvider locale={{ ...enUS, tag: "hi-IN" }}>
        <div id="uneven" style={{ inlineSize: 300 }}>
          <Calendar defaultValue={MARCH} />
        </div>
      </ConfigProvider>

      {/* Every day blocked, so the hover state of a disabled cell is reachable
          with a real pointer — `:hover` is pointer state rather than an event,
          so it cannot be probed by dispatching one. */}
      <div id="blocked" style={{ inlineSize: 300 }}>
        <Calendar defaultValue={MARCH} disabledDate={() => true} />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);

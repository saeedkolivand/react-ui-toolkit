import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Calendar, ConfigProvider, DatePicker, enUS } from "@crosskit-ui/react";

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

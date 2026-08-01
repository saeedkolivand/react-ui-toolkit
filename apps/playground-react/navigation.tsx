import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Breadcrumb, Segmented, Steps } from "@crosskit-ui/react";

const STEPS = [{ title: "Cart" }, { title: "Pay" }, { title: "Done" }];

function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 32 }}>
      {/* A fixed width, so "did the connector span the gap" and "are the
          markers evenly spaced" are questions with numeric answers. */}
      <div id="steps-row" style={{ inlineSize: 600 }}>
        <Steps items={STEPS} current={1} />
      </div>

      <div id="steps-column" style={{ inlineSize: 600 }}>
        <Steps items={STEPS} current={1} direction="vertical" />
      </div>

      <div id="segmented-block" style={{ inlineSize: 600 }}>
        <Segmented options={["Daily", "Weekly", "Monthly"]} block />
      </div>

      <div id="segmented-plain">
        <Segmented options={["Daily", "Weekly", "Monthly"]} />
      </div>

      <div id="crumbs">
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Settings", href: "/s" },
            { title: "Profile" },
          ]}
        />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);

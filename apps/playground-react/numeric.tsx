import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { InputNumber, Rate, Slider } from "@crosskit-ui/react";

const MARKS = [{ value: 0, label: "0" }, { value: 25 }, { value: 50, label: "50" }, { value: 100 }];

/** The same slider in each of the four orientation-by-direction combinations. */
function Sliders() {
  return (
    <>
      <div id="h-ltr" dir="ltr" style={{ inlineSize: 400 }}>
        <Slider defaultValue={50} marks={MARKS} />
      </div>
      <div id="h-rtl" dir="rtl" style={{ inlineSize: 400 }}>
        <Slider defaultValue={50} marks={MARKS} />
      </div>
      <div id="v-ltr" dir="ltr" style={{ inlineSize: 60 }}>
        <Slider vertical defaultValue={50} marks={MARKS} />
      </div>
      <div id="v-rtl" dir="rtl" style={{ inlineSize: 60 }}>
        <Slider vertical defaultValue={50} marks={MARKS} />
      </div>
    </>
  );
}

function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 48, justifyItems: "stretch" }}>
      <Sliders />
      <div id="in" style={{ inlineSize: 200 }}>
        <InputNumber defaultValue={5} />
      </div>
      <div id="rate-half">
        <Rate defaultValue={2.5} allowHalf />
      </div>
      <div id="rate-full">
        <Rate defaultValue={3} />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);

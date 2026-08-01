import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Button, Form, Input } from "@crosskit-ui/react";

/**
 * Direction is set on `<html>` by the spec, not here — the whole point of the
 * RTL case is which side the label column lands on, and that has to come from
 * the document so every form on the page agrees.
 */
function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 48 }}>
      {/* Deliberately mismatched label lengths. `subgrid` is what makes every
          row share one column width; without it each row sizes its own label
          and the controls step down the page. */}
      <Form id="horizontal" layout="horizontal" style={{ inlineSize: 480 }}>
        <Form.Item name="email" label="Email address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="id" label="ID">
          <Input />
        </Form.Item>
        <Form.Item name="note" label="An unusually long label to widen the column">
          <Input />
        </Form.Item>
        {/* No label. It still has to sit in the control column, or it is the one
            row on the page out of line. */}
        <Form.Item name="bare">
          <Input />
        </Form.Item>
      </Form>

      <Form id="vertical" layout="vertical" style={{ inlineSize: 480 }}>
        <Form.Item name="v1" label="Required" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="v2" label="Optional">
          <Input />
        </Form.Item>
      </Form>

      <Form id="inline" layout="inline">
        <Form.Item name="i1" label="From">
          <Input />
        </Form.Item>
        <Form.Item name="i2" label="To">
          <Input />
        </Form.Item>
        <Button htmlType="submit">Search</Button>
      </Form>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);

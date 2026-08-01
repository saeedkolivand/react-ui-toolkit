import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Descriptions, List, Pagination, Statistic } from "@crosskit-ui/react";

const ROWS = Array.from({ length: 7 }, (_, index) => ({ id: `r${index}`, name: `Row ${index}` }));

function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 32, inlineSize: 900 }}>
      {/* A List that renders a Pagination inside itself. Both have `item` and
          `list` parts, so this is where a descendant selector reaches into a
          component it does not own. */}
      <div id="list-with-pagination">
        <List
          dataSource={ROWS}
          rowKey={row => row.id}
          renderItem={row => <span>{row.name}</span>}
          pagination={{ pageSize: 3 }}
          bordered
        />
      </div>

      <div id="pagination-plain">
        <Pagination total={200} pageSize={10} defaultCurrent={5} />
      </div>

      {/* The one part of Pagination whose layout depends on another
          component's CSS: `Select` defaults to `fullWidth`, and
          `[data-part="size-changer"]` has no rule of its own. jsdom cannot see
          which of the two wins. */}
      <div id="pagination-extras">
        <Pagination total={240} showSizeChanger showQuickJumper />
      </div>

      {/* Three columns, and one item claiming all three. */}
      <div id="descriptions-horizontal">
        <Descriptions
          column={3}
          items={[
            { label: "Name", children: "Ada" },
            { label: "Role", children: "Engineer" },
            { label: "Team", children: "Core" },
            { label: "Bio", children: "Spans the whole row", span: 3 },
          ]}
        />
      </div>

      <div id="descriptions-vertical">
        <Descriptions
          column={3}
          layout="vertical"
          items={[
            { label: "Name", children: "Ada" },
            { label: "Bio", children: "Spans the whole row", span: 3 },
          ]}
        />
      </div>

      <div id="stat">
        <Statistic title="Revenue" value={1234567.5} precision={2} prefix="$" suffix="/mo" />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);

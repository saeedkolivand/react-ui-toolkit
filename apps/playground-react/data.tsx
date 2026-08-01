import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import {
  Breadcrumb,
  Checkbox,
  Descriptions,
  List,
  Pagination,
  Statistic,
} from "@crosskit-ui/react";

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

      {/* `children` is an arbitrary node, so a consumer can put a control in a
          value — and every component with a `label` part is then a descendant
          of `[data-scope="descriptions"]`. This is the leak List had, with a
          wider door: reachable without writing another component. */}
      <div id="descriptions-with-control">
        <Descriptions
          column={1}
          items={[{ label: "Status", children: <Checkbox defaultChecked label="Active" /> }]}
        />
      </div>

      {/* The same two components inside a Descriptions value and outside it.
          Comparing them against each other is what says whether the leak is
          real — an absolute expectation would only say what today renders. */}
      {/* The same `extra` with and without a title beside it. `space-between`
          puts the gap *between* two children; with one it is `flex-start`. */}
      <div id="extra-alone" style={{ inlineSize: 600 }}>
        <Descriptions items={[{ label: "a", children: "b" }]} extra={<span>Edit</span>} />
      </div>
      <div id="extra-both" style={{ inlineSize: 600 }}>
        <Descriptions
          items={[{ label: "a", children: "b" }]}
          title="Profile"
          extra={<span>Edit</span>}
        />
      </div>

      <div id="nested-controls">
        <Descriptions
          column={1}
          items={[
            {
              label: "Trail",
              children: <Breadcrumb items={[{ title: "A", href: "#" }, { title: "B" }]} />,
            },
            { label: "Count", children: <Statistic title="Users" value={42} /> },
          ]}
        />
      </div>
      <div id="loose-controls">
        <Breadcrumb items={[{ title: "A", href: "#" }, { title: "B" }]} />
        <Statistic title="Users" value={42} />
      </div>

      {/* One page and told to hide the bar: the wrapper must not keep its own
          padding once Pagination renders nothing. */}
      <div id="list-single-page">
        <List
          dataSource={ROWS.slice(0, 2)}
          rowKey={row => row.id}
          renderItem={row => <span>{row.name}</span>}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
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

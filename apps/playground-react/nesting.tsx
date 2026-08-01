import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  List,
  Result,
  Skeleton,
  Statistic,
  Steps,
} from "@crosskit-ui/react";

/**
 * One pairing, rendered inside its container and loose beside it.
 *
 * The comparison is the assertion: an absolute expectation only says what
 * today renders, while the pair says whether the container changed anything.
 */
function Pair({
  id,
  container,
  children,
}: {
  id: string;
  container: (c: ReactNode) => ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 8, inlineSize: 600 }}>
      <div id={`${id}-in`}>{container(children)}</div>
      <div id={`${id}-out`}>{children}</div>
    </div>
  );
}

const STEPS = [{ title: "One", description: "First" }, { title: "Two" }];
const ROWS = [
  { id: "a", name: "Row A" },
  { id: "b", name: "Row B" },
];

function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 32 }}>
      <Pair id="card-list" container={c => <Card>{c}</Card>}>
        <List
          header="Head"
          footer="Foot"
          dataSource={ROWS}
          rowKey={r => r.id}
          renderItem={r => r.name}
        />
      </Pair>

      <Pair id="card-desc" container={c => <Card>{c}</Card>}>
        <Descriptions title="Profile" items={[{ label: "Name", children: "Ada" }]} />
      </Pair>

      <Pair
        id="result-stat"
        container={c => (
          <Result status="success" title="Done">
            {c}
          </Result>
        )}
      >
        <Statistic title="Users" value={42} />
      </Pair>

      <Pair id="alert-steps" container={c => <Alert title="Heads up">{c}</Alert>}>
        <Steps items={STEPS} current={0} />
      </Pair>

      <Pair id="skeleton-stat" container={c => <Skeleton.Node>{c}</Skeleton.Node>}>
        <Statistic title="Users" value={42} />
      </Pair>

      <Pair id="empty-list" container={c => <Empty>{c}</Empty>}>
        <List dataSource={ROWS} rowKey={r => r.id} renderItem={r => r.name} footer="Foot" />
      </Pair>

      <Pair id="button-result" container={c => <Button>{c}</Button>}>
        <Result status="info" title="t" />
      </Pair>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);

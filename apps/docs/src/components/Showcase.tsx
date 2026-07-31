// A live island rendering the REAL components from @crosskit-ui/react.
//
// One island is enough for the whole site: because every adapter emits the same
// data-scope/data-part DOM against one stylesheet, what React renders here is
// pixel-identical to what Vue, Svelte and Angular render. Cross-framework
// correctness is proven by the Playwright parity suite, not by shipping four
// copies of this.
import { useState } from "react";
import { Badge, Button, Card, Divider, Icon, Spinner } from "@crosskit-ui/react";

const VARIANTS = ["primary", "secondary", "outline", "ghost", "success", "error"] as const;

export function Showcase() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="stack">
      <div className="row">
        {VARIANTS.map(v => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ))}
      </div>

      <div className="row">
        <Button size="sm" icon="plus">
          Small
        </Button>
        <Button size="md" icon="search">
          Medium
        </Button>
        <Button size="lg" icon="check">
          Large
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1600);
          }}
        >
          {loading ? "Working…" : "Click to load"}
        </Button>
        <Button disabled>Disabled</Button>
      </div>

      <div className="row">
        <Badge>primary</Badge>
        <Badge variant="success" rounded>
          success
        </Badge>
        <Badge variant="warning" outlined>
          warning
        </Badge>
        <Badge variant="error" rounded outlined>
          error
        </Badge>
        <Spinner size="sm" />
        <Spinner size="md" variant="success" />
        <Icon name="heart" size="lg" />
        <Icon name="star" size="lg" />
        <Icon name="settings" size="lg" />
      </div>

      <Divider>and a card</Divider>

      <Card
        elevated
        hoverable
        header={<strong>Card header</strong>}
        footer={<span className="caption">Footer</span>}
      >
        <p style={{ margin: 0 }}>
          Every element here carries <code className="code-inline">data-scope</code> and{" "}
          <code className="code-inline">data-part</code> instead of utility classes — which is why
          one stylesheet can serve four frameworks.
        </p>
      </Card>
    </div>
  );
}

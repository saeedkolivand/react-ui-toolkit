import { useState } from "react";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  Input,
  Progress,
  Radio,
  Select,
  Spinner,
  Switch,
  Tabs,
  Tag,
  Textarea,
  Tooltip,
} from "@/components";

const INSTALL = "npm i @saeedkolivand/react-ui-toolkit";

const COMPONENT_NAMES = [
  "Accordion",
  "Alert",
  "Avatar",
  "Badge",
  "Button",
  "Card",
  "Checkbox",
  "Col",
  "Container",
  "Divider",
  "Drawer",
  "Dropdown",
  "Icon",
  "Input",
  "Modal",
  "Notification",
  "Progress",
  "Radio",
  "Row",
  "Select",
  "Spinner",
  "Switch",
  "Table",
  "Tabs",
  "Tag",
  "Textarea",
  "ThemeToggle",
  "Tooltip",
];

const NAV = [
  { label: "Components", href: "#components" },
  { label: "Storybook", href: "./storybook/" },
  { label: "Docs", href: "https://github.com/saeedkolivand/react-ui-toolkit#readme" },
  { label: "npm", href: "https://www.npmjs.com/package/@saeedkolivand/react-ui-toolkit" },
];

const REPO = "https://github.com/saeedkolivand/react-ui-toolkit";

const InstallButton = () => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(INSTALL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <button className="lp-install" onClick={copy} aria-label={`Copy: ${INSTALL}`}>
      <span>{INSTALL}</span>
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};

export const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [framework, setFramework] = useState("vite");
  const [notify, setNotify] = useState(true);
  const [plan, setPlan] = useState("mit");

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <a className="lp-wordmark" href="#top">
            react-ui-toolkit
          </a>
          <nav className="lp-nav-links">
            {NAV.map(item => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className="lp-burger"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <div className="lp-nav-cta">
            <a className="btn btn-secondary" href={REPO}>
              GitHub
            </a>
            <a className="btn btn-primary" href="#install">
              Get started
            </a>
          </div>
        </div>
      </header>

      <div className={`lp-overlay${menuOpen ? " is-open" : ""}`}>
        {NAV.map(item => (
          <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
      </div>

      {/* ---------- hero: white canvas ---------- */}
      <section className="lp-hero" id="top">
        <div className="lp-container">
          <p className="t-eyebrow">React · TypeScript · Tailwind</p>
          <h1 className="t-display-xl" style={{ marginTop: 24 }}>
            Components you don&rsquo;t have to rebuild.
          </h1>
          <p className="t-body-lg lp-lede">
            28 accessible React components with full type definitions, styled with Tailwind CSS and
            shipped tree-shakeable. Drop them in and get back to the part of the product only you
            can build.
          </p>
          <div className="lp-hero-actions" id="install">
            <InstallButton />
            <a className="btn btn-primary" href="./storybook/">
              Browse Storybook
            </a>
            <a className="btn btn-secondary" href={REPO}>
              View source
            </a>
          </div>
        </div>
      </section>

      {/* ---------- marquee strip: thin black ribbon ---------- */}
      <div className="lp-marquee" aria-hidden="true">
        <div className="lp-marquee-track">
          {[...COMPONENT_NAMES, ...COMPONENT_NAMES].map((name, i) => (
            <span key={`${name}-${i}`}>{name}</span>
          ))}
        </div>
      </div>

      {/* ---------- white feature row ---------- */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <p className="t-eyebrow">Why</p>
            <h2 className="t-display-lg">Built like a library, not a snippet dump.</h2>
          </div>
          <div className="lp-tiles">
            <div className="lp-tile">
              <p className="t-eyebrow">Typed</p>
              <h3 className="t-card-title">Full definitions</h3>
              <p className="t-body-sm">
                Every prop, variant and event is typed and bundled into a single{" "}
                <code>index.d.ts</code>. No <code>@types</code> package to chase.
              </p>
            </div>
            <div className="lp-tile">
              <p className="t-eyebrow">Lean</p>
              <h3 className="t-card-title">Tree-shakeable</h3>
              <p className="t-body-sm">
                ESM and CJS builds with runtime dependencies left external, so importing one Button
                does not pull in the other 27 components.
              </p>
            </div>
            <div className="lp-tile">
              <p className="t-eyebrow">Accessible</p>
              <h3 className="t-card-title">Keyboard first</h3>
              <p className="t-body-sm">
                Focus rings, ARIA attributes and 44px touch targets are part of the components, not
                an exercise left to the consumer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- lime block: form components, live ---------- */}
      <section className="lp-section" style={{ paddingTop: 0 }} id="components">
        <div className="lp-block lp-block-lime">
          <div className="lp-block-inner">
            <p className="t-eyebrow">Forms</p>
            <h2 className="t-headline" style={{ marginTop: 16 }}>
              Every input you were going to write this sprint.
            </h2>
            <p className="t-subhead" style={{ marginTop: 16 }}>
              Labels, error states, disabled states and controlled values — already handled.
            </p>
          </div>
          <div className="lp-block-demo">
            <div className="lp-demo-surface">
              <Input label="Email" placeholder="you@example.com" />
              <Input
                label="With an error"
                error
                errorMessage="That address looks incomplete"
                placeholder="you@"
              />
              <Select
                label="Bundler"
                value={framework}
                onChange={e => setFramework(e.target.value)}
                options={[
                  { value: "vite", label: "Vite" },
                  { value: "next", label: "Next.js" },
                  { value: "rollup", label: "Rollup" },
                ]}
              />
            </div>
            <div className="lp-demo-surface">
              <Textarea label="Release notes" placeholder="What changed?" />
              <Switch
                label="Email me on release"
                checked={notify}
                onChange={() => setNotify(v => !v)}
              />
              <Checkbox label="Ship it on Friday" />
              <Checkbox label="Unavailable option" disabled />
            </div>
            <div className="lp-demo-surface">
              <Radio
                name="license"
                value="mit"
                label="MIT"
                checked={plan === "mit"}
                onChange={e => setPlan(e.target.value)}
              />
              <Radio
                name="license"
                value="apache"
                label="Apache 2.0"
                checked={plan === "apache"}
                onChange={e => setPlan(e.target.value)}
              />
              <Radio name="license" value="custom" label="Custom" disabled />
              <Divider />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button variant="primary" size="sm">
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- navy block: the only inverse surface above the footer ---------- */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-block lp-block-navy">
          <div className="lp-block-inner">
            <p className="t-eyebrow">Feedback</p>
            <h2 className="t-headline" style={{ marginTop: 16 }}>
              Tell people what happened.
            </h2>
            <p className="t-subhead" style={{ marginTop: 16 }}>
              Alerts, badges, progress and spinners that all speak the same visual language.
            </p>
          </div>
          <div className="lp-block-demo">
            <div className="lp-demo-surface">
              <Alert variant="success" title="Published">
                Version 0.1.18 is live on npm.
              </Alert>
              <Alert variant="warning" title="Heads up">
                A peer dependency needs React 18 or newer.
              </Alert>
            </div>
            <div className="lp-demo-surface">
              <Progress value={72} max={100} variant="primary" showValue />
              <Progress value={40} max={100} variant="success" showValue striped animated />
              <Progress indeterminate />
            </div>
            <div className="lp-demo-surface">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Passing</Badge>
                <Badge variant="warning">Beta</Badge>
                <Badge variant="error">Deprecated</Badge>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Spinner size="sm" />
                <Spinner size="md" variant="success" />
                <Avatar initials="SK" />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Tag color="primary">typescript</Tag>
                <Tag color="success" variant="outline">
                  a11y
                </Tag>
                <Tag color="info" closable>
                  closable
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- coral block: composition ---------- */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-block lp-block-coral">
          <div className="lp-block-inner">
            <p className="t-eyebrow">Structure</p>
            <h2 className="t-headline" style={{ marginTop: 16 }}>
              Tabs, accordions and the rest of the plumbing.
            </h2>
            <p className="t-subhead" style={{ marginTop: 16 }}>
              Composed from the same primitives, so overriding one Tailwind class does what you
              expect.
            </p>
          </div>
          <div className="lp-block-demo" style={{ gridTemplateColumns: "1fr" }}>
            <div className="lp-demo-surface">
              <Tabs
                tabs={[
                  {
                    label: "Install",
                    content: (
                      <p className="t-body-sm" style={{ paddingTop: 12 }}>
                        <code>{INSTALL}</code> — then import the stylesheet once, or wrap your app
                        in <code>StylesProvider</code>.
                      </p>
                    ),
                  },
                  {
                    label: "Import",
                    content: (
                      <p className="t-body-sm" style={{ paddingTop: 12 }}>
                        <code>
                          import {"{"} Button {"}"} from &quot;@saeedkolivand/react-ui-toolkit&quot;
                        </code>
                      </p>
                    ),
                  },
                  {
                    label: "Customise",
                    content: (
                      <p className="t-body-sm" style={{ paddingTop: 12 }}>
                        Pass <code>className</code> to any component. It is merged with{" "}
                        <code>tailwind-merge</code>, so your class wins.
                      </p>
                    ),
                  },
                ]}
              />
              <Divider />
              <Accordion
                items={[
                  {
                    title: "Does it work with Next.js?",
                    content:
                      "Yes — there is an SSR-safe StylesProvider and a withStylesSSR HOC for the app and pages routers.",
                  },
                  {
                    title: "Can I use my own Tailwind theme?",
                    content:
                      "The components use standard Tailwind classes, so your theme applies. Any className you pass overrides the default.",
                  },
                  {
                    title: "How big is it?",
                    content:
                      "About 111KB for the full ESM bundle with runtime dependencies external, and it tree-shakes per component.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- component gallery (white canvas) ---------- */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <p className="t-eyebrow">The set</p>
            <h2 className="t-display-lg">28 components, one vocabulary.</h2>
            <p className="t-body">
              Rendered below straight from the package — this page is built with the library it
              documents.
            </p>
          </div>
          <div className="lp-gallery">
            <div className="lp-card">
              <p className="t-caption">Button</p>
              <div className="lp-card-stage">
                <Button variant="primary" size="sm">
                  Primary
                </Button>
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
                <Button variant="outline" size="sm">
                  Outline
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost
                </Button>
              </div>
            </div>
            <div className="lp-card">
              <p className="t-caption">Button · states</p>
              <div className="lp-card-stage">
                <Button variant="primary" size="sm" loading>
                  Loading
                </Button>
                <Button variant="primary" size="sm" disabled>
                  Disabled
                </Button>
                <Button variant="primary" size="sm" icon="check">
                  With icon
                </Button>
              </div>
            </div>
            <div className="lp-card">
              <p className="t-caption">Icon</p>
              <div className="lp-card-stage">
                <Icon name="check" />
                <Icon name="close" />
                <Icon name="chevronDown" />
                <Icon name="search" />
                <Icon name="info" />
              </div>
            </div>
            <div className="lp-card">
              <p className="t-caption">Tooltip</p>
              <div className="lp-card-stage">
                <Tooltip content="Shown on hover" placement="top">
                  <Button variant="outline" size="sm">
                    Hover me
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="lp-card">
              <p className="t-caption">Card</p>
              <div className="lp-card-stage">
                <Card header="Pricing" bordered>
                  <p className="t-body-sm">Free and MIT licensed.</p>
                </Card>
              </div>
            </div>
            <div className="lp-card">
              <p className="t-caption">Tag</p>
              <div className="lp-card-stage">
                <Tag>default</Tag>
                <Tag variant="solid" color="primary">
                  solid
                </Tag>
                <Tag variant="outline" color="warning">
                  outline
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- closing cream block ---------- */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-block lp-block-cream">
          <div className="lp-block-inner">
            <h2 className="t-display-lg">Start with the Button. Stay for the other 27.</h2>
            <p className="t-body-lg" style={{ marginTop: 24 }}>
              MIT licensed, published to npm, and documented in Storybook.
            </p>
            <div className="lp-hero-actions">
              <a className="btn btn-primary" href="./storybook/">
                Browse Storybook
              </a>
              <a className="btn btn-secondary" href={REPO}>
                Read the source
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <h2>react-ui-toolkit</h2>
            <p className="t-body-sm" style={{ marginTop: 16, maxWidth: "28ch" }}>
              A modern React UI toolkit with TypeScript support.
            </p>
          </div>
          <div className="lp-footer-col">
            <h3 className="t-caption">Docs</h3>
            <ul>
              <li>
                <a href="./storybook/">Storybook</a>
              </li>
              <li>
                <a href={`${REPO}/blob/main/docs/usage-guide.md`}>Usage guide</a>
              </li>
              <li>
                <a href={`${REPO}/blob/main/docs/api-reference.md`}>API reference</a>
              </li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h3 className="t-caption">Project</h3>
            <ul>
              <li>
                <a href={REPO}>GitHub</a>
              </li>
              <li>
                <a href={`${REPO}/issues`}>Issues</a>
              </li>
              <li>
                <a href={`${REPO}/blob/main/CHANGELOG.md`}>Changelog</a>
              </li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h3 className="t-caption">Install</h3>
            <ul>
              <li>
                <a href="https://www.npmjs.com/package/@saeedkolivand/react-ui-toolkit">npm</a>
              </li>
              <li>
                <a href={`${REPO}/blob/main/CONTRIBUTING.md`}>Contributing</a>
              </li>
              <li>
                <a href={`${REPO}/blob/main/LICENSE`}>MIT licence</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="lp-footer-legal">
          <p className="t-caption">© {new Date().getFullYear()} Saeed Kolivand · MIT</p>
        </div>
      </footer>
    </div>
  );
};

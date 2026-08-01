import {
  Collapse,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Icon,
  Input,
  Progress,
  Radio,
  RadioGroup,
  Row,
  Select,
  Spinner,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
} from "@crosskit-ui/react";
import { FIXTURE } from "./fixture";

/**
 * Every component in a fixed, deterministic state.
 *
 * The four playgrounds render this same page, and the parity spec screenshots
 * each one and asserts the images are identical between frameworks. Same CSS
 * plus same markup means the same pixels, so any difference is a markup
 * divergence — which is precisely the class of bug ("the Vue adapter forgot
 * data-size") that no unit test would catch.
 *
 * Overlays are deliberately absent: they portal and only exist once opened, so
 * they belong in the behaviour specs rather than in a static screenshot.
 */
export function Parity() {
  return (
    <>
      <section className="parity-section" data-fixture="button">
        <h2>Button</h2>
        {/* The v2 API. The other three playgrounds still render v1 here, which
            is why `parity.spec.ts` lists this section under MIGRATING until they
            catch up. */}
        <div className="parity-row">
          {(["default", "primary", "dashed", "text", "link"] as const).map(type => (
            <Button key={type} type={type}>
              {type}
            </Button>
          ))}
          <Button danger>danger</Button>
        </div>
        <div className="parity-row">
          {(["small", "middle", "large"] as const).map(size => (
            <Button key={size} size={size} icon={<Icon name="check" />}>
              {size}
            </Button>
          ))}
          <Button loading>loading</Button>
          <Button disabled>disabled</Button>
          <Button shape="circle" icon={<Icon name="check" />} aria-label="confirm" />
        </div>
      </section>

      <section className="parity-section" data-fixture="icon">
        <h2>Icon &amp; Spinner</h2>
        <div className="parity-row">
          {FIXTURE.icons.map(name => (
            <Icon key={name} name={name} />
          ))}
          <Spinner />
          <Spinner size="lg" />
        </div>
      </section>

      <section className="parity-section" data-fixture="badge">
        <h2>Badge &amp; Tag</h2>
        <div className="parity-row">
          {FIXTURE.badgeVariants.map(variant => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
        <div className="parity-row">
          {FIXTURE.tagColors.map(color => (
            <Tag key={color} color={color}>
              {color}
            </Tag>
          ))}
        </div>
      </section>

      <section className="parity-section" data-fixture="alert">
        <h2>Alert</h2>
        {FIXTURE.alertVariants.map(variant => (
          <Alert key={variant} variant={variant} title={variant}>
            {FIXTURE.text}
          </Alert>
        ))}
      </section>

      <section className="parity-section" data-fixture="card">
        <h2>Card &amp; Divider</h2>
        <div className="parity-grid">
          <Card variant="default">{FIXTURE.text}</Card>
          <Card variant="primary">{FIXTURE.text}</Card>
        </div>
        <Divider>or</Divider>
      </section>

      <section className="parity-section" data-fixture="field">
        <h2>Input &amp; Textarea</h2>
        <div className="parity-grid">
          <Input label="Email" placeholder={FIXTURE.email} helperText="Never shared." />
          <Input label="Broken" placeholder={FIXTURE.email} invalid errorMessage="Required" />
          <Textarea label="Notes" placeholder={FIXTURE.text} />
        </div>
      </section>

      {/* Its own section, not part of `field`. React's Select diverges from the
          other three while they catch up, and a MIGRATING entry excuses a whole
          SECTION — leaving it beside Input and Textarea stopped checking those
          two in three frameworks, for a change that never touched them. */}
      <section className="parity-section" data-fixture="select">
        <h2>Select</h2>
        <div className="parity-grid">
          <Select label="Country" options={FIXTURE.countries} defaultValue="ng" />
        </div>
      </section>

      <section className="parity-section" data-fixture="toggle">
        <h2>Toggles</h2>
        <div className="parity-row">
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Invalid" invalid />
          <Switch label="Off" />
          <Switch label="On" defaultChecked />
        </div>
        <RadioGroup label="Size">
          {FIXTURE.sizes.map(size => (
            <Radio key={size} value={size} label={size} defaultChecked={size === "md"} />
          ))}
        </RadioGroup>
      </section>

      <section className="parity-section" data-fixture="display">
        <h2>Avatar &amp; Progress</h2>
        <div className="parity-row">
          <Avatar alt="Ada Lovelace" />
          <Avatar alt="Grace Hopper" size="lg" status="online" />
          <Avatar alt="Alan Turing" squared bordered />
        </div>
        <Progress value={FIXTURE.progress} label="Uploading" showValue />
      </section>

      <section className="parity-section" data-fixture="layout">
        <h2>Layout</h2>
        <Row spacing={4}>
          <Col span={8}>
            <Card variant="default">span 8</Card>
          </Col>
          <Col span={4}>
            <Card variant="default">span 4</Card>
          </Col>
        </Row>
      </section>

      <section className="parity-section" data-fixture="tabs">
        <h2>Tabs</h2>
        {/* Mapped here rather than in `fixture.ts`, which is copied byte for
            byte into all four playgrounds and still feeds three v1 adapters. */}
        <Tabs
          items={FIXTURE.tabs.map(tab => ({
            key: tab.id,
            label: tab.label,
            children: FIXTURE.text,
          }))}
          defaultActiveKey={FIXTURE.tabs[0]!.id}
        />
      </section>

      <section className="parity-section" data-fixture="accordion">
        <h2>Accordion</h2>
        <Collapse
          items={FIXTURE.accordion.map(item => ({
            key: item.id,
            label: item.title,
            children: FIXTURE.text,
          }))}
          defaultActiveKey={[FIXTURE.accordion[0]!.id]}
        />
      </section>

      <section className="parity-section" data-fixture="table">
        <h2>Table</h2>
        <Table data={FIXTURE.people} columns={FIXTURE.columns} pageSize={3} />
      </section>
    </>
  );
}

<script lang="ts">
  import {
    Accordion,
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
  } from "@crosskit-ui/svelte";
  import { FIXTURE } from "./fixture";

  // Same page as the other three playgrounds. The parity spec screenshots each
  // and asserts the images match between frameworks; same CSS plus same markup
  // means the same pixels, so a difference is a markup divergence.
  let radioValue = $state<string>("md");
</script>

<section class="parity-section" data-fixture="button">
  <h2>Button</h2>
  <div class="parity-row">
    {#each FIXTURE.buttonVariants as variant (variant)}
      <Button {variant}>{variant}</Button>
    {/each}
  </div>
  <div class="parity-row">
    {#each FIXTURE.sizes as size (size)}
      <Button {size} icon="check">{size}</Button>
    {/each}
    <Button loading>loading</Button>
    <Button disabled>disabled</Button>
  </div>
</section>

<section class="parity-section" data-fixture="icon">
  <h2>Icon &amp; Spinner</h2>
  <div class="parity-row">
    {#each FIXTURE.icons as name (name)}
      <Icon {name} />
    {/each}
    <Spinner />
    <Spinner size="lg" />
  </div>
</section>

<section class="parity-section" data-fixture="badge">
  <h2>Badge &amp; Tag</h2>
  <div class="parity-row">
    {#each FIXTURE.badgeVariants as variant (variant)}
      <Badge {variant}>{variant}</Badge>
    {/each}
  </div>
  <div class="parity-row">
    {#each FIXTURE.tagColors as color (color)}
      <Tag {color}>{color}</Tag>
    {/each}
  </div>
</section>

<section class="parity-section" data-fixture="alert">
  <h2>Alert</h2>
  {#each FIXTURE.alertVariants as variant (variant)}
    <Alert {variant} title={variant}>{FIXTURE.text}</Alert>
  {/each}
</section>

<section class="parity-section" data-fixture="card">
  <h2>Card &amp; Divider</h2>
  <div class="parity-grid">
    <Card variant="elevated">{FIXTURE.text}</Card>
    <Card variant="outline">{FIXTURE.text}</Card>
  </div>
  <Divider label="or" />
</section>

<section class="parity-section" data-fixture="field">
  <h2>Input &amp; Textarea</h2>
  <div class="parity-grid">
    <Input label="Email" placeholder={FIXTURE.email} helperText="Never shared." />
    <Input label="Broken" placeholder={FIXTURE.email} invalid errorMessage="Required" />
    <Textarea label="Notes" placeholder={FIXTURE.text} />
    <Select label="Country" items={FIXTURE.countries} defaultValue="ng" />
  </div>
</section>

<section class="parity-section" data-fixture="toggle">
  <h2>Toggles</h2>
  <div class="parity-row">
    <Checkbox label="Unchecked" />
    <Checkbox label="Checked" checked />
    <Checkbox label="Invalid" invalid />
    <Switch label="Off" />
    <Switch label="On" checked />
  </div>
  <RadioGroup label="Size">
    {#each FIXTURE.sizes as size (size)}
      <Radio value={size} label={size} bind:group={radioValue} />
    {/each}
  </RadioGroup>
</section>

<section class="parity-section" data-fixture="display">
  <h2>Avatar &amp; Progress</h2>
  <div class="parity-row">
    <Avatar alt="Ada Lovelace" />
    <Avatar alt="Grace Hopper" size="lg" status="online" />
    <Avatar alt="Alan Turing" squared bordered />
  </div>
  <Progress value={FIXTURE.progress} label="Uploading" showValue />
</section>

<section class="parity-section" data-fixture="layout">
  <h2>Layout</h2>
  <Row spacing={4}>
    <Col span={8}><Card variant="filled">span 8</Card></Col>
    <Col span={4}><Card variant="filled">span 4</Card></Col>
  </Row>
</section>

<section class="parity-section" data-fixture="tabs">
  <h2>Tabs</h2>
  <Tabs items={FIXTURE.tabs} defaultValue={FIXTURE.tabs[0]!.id}>
    {#snippet panel()}{FIXTURE.text}{/snippet}
  </Tabs>
</section>

<section class="parity-section" data-fixture="accordion">
  <h2>Accordion</h2>
  <Accordion items={FIXTURE.accordion} defaultValue={[FIXTURE.accordion[0]!.id]}>
    {#snippet panel()}{FIXTURE.text}{/snippet}
  </Accordion>
</section>

<section class="parity-section" data-fixture="table">
  <h2>Table</h2>
  <Table data={FIXTURE.people} columns={FIXTURE.columns} pageSize={3} />
</section>

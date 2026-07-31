<script setup lang="ts">
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
} from "@crosskit-ui/vue";
import { FIXTURE } from "./fixture";

// Same page as the other three playgrounds. The parity spec screenshots each
// and asserts the images match between frameworks; same CSS plus same markup
// means the same pixels, so a difference is a markup divergence.
const tabItems = FIXTURE.tabs;
const accordionItems = FIXTURE.accordion;
</script>

<template>
  <section class="parity-section" data-fixture="button">
    <h2>Button</h2>
    <div class="parity-row">
      <Button v-for="variant in FIXTURE.buttonVariants" :key="variant" :variant="variant">
        {{ variant }}
      </Button>
    </div>
    <div class="parity-row">
      <Button v-for="size in FIXTURE.sizes" :key="size" :size="size" icon="check">
        {{ size }}
      </Button>
      <Button loading>loading</Button>
      <Button disabled>disabled</Button>
    </div>
  </section>

  <section class="parity-section" data-fixture="icon">
    <h2>Icon &amp; Spinner</h2>
    <div class="parity-row">
      <Icon v-for="name in FIXTURE.icons" :key="name" :name="name" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  </section>

  <section class="parity-section" data-fixture="badge">
    <h2>Badge &amp; Tag</h2>
    <div class="parity-row">
      <Badge v-for="variant in FIXTURE.badgeVariants" :key="variant" :variant="variant">
        {{ variant }}
      </Badge>
    </div>
    <div class="parity-row">
      <Tag v-for="color in FIXTURE.tagColors" :key="color" :color="color">{{ color }}</Tag>
    </div>
  </section>

  <section class="parity-section" data-fixture="alert">
    <h2>Alert</h2>
    <Alert
      v-for="variant in FIXTURE.alertVariants"
      :key="variant"
      :variant="variant"
      :title="variant"
    >
      {{ FIXTURE.text }}
    </Alert>
  </section>

  <section class="parity-section" data-fixture="card">
    <h2>Card &amp; Divider</h2>
    <div class="parity-grid">
      <Card variant="elevated">{{ FIXTURE.text }}</Card>
      <Card variant="outline">{{ FIXTURE.text }}</Card>
    </div>
    <Divider label="or" />
  </section>

  <section class="parity-section" data-fixture="field">
    <h2>Input &amp; Textarea</h2>
    <div class="parity-grid">
      <Input label="Email" :placeholder="FIXTURE.email" helper-text="Never shared." />
      <Input label="Broken" :placeholder="FIXTURE.email" invalid error-message="Required" />
      <Textarea label="Notes" :placeholder="FIXTURE.text" />
      <Select label="Country" :items="FIXTURE.countries" default-value="ng" />
    </div>
  </section>

  <section class="parity-section" data-fixture="toggle">
    <h2>Toggles</h2>
    <div class="parity-row">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" :model-value="true" />
      <Checkbox label="Invalid" invalid />
      <Switch label="Off" />
      <Switch label="On" :model-value="true" />
    </div>
    <RadioGroup label="Size">
      <Radio
        v-for="size in FIXTURE.sizes"
        :key="size"
        :value="size"
        :label="size"
        model-value="md"
      />
    </RadioGroup>
  </section>

  <section class="parity-section" data-fixture="display">
    <h2>Avatar &amp; Progress</h2>
    <div class="parity-row">
      <Avatar alt="Ada Lovelace" />
      <Avatar alt="Grace Hopper" size="lg" status="online" />
      <Avatar alt="Alan Turing" squared bordered />
    </div>
    <Progress :value="FIXTURE.progress" label="Uploading" show-value />
  </section>

  <section class="parity-section" data-fixture="layout">
    <h2>Layout</h2>
    <Row :spacing="4">
      <Col :span="8"><Card variant="filled">span 8</Card></Col>
      <Col :span="4"><Card variant="filled">span 4</Card></Col>
    </Row>
  </section>

  <section class="parity-section" data-fixture="tabs">
    <h2>Tabs</h2>
    <Tabs :items="tabItems" :default-value="tabItems[0]!.id">
      <template v-for="tab in tabItems" #[tab.id] :key="tab.id">{{ FIXTURE.text }}</template>
    </Tabs>
  </section>

  <section class="parity-section" data-fixture="accordion">
    <h2>Accordion</h2>
    <Accordion :items="accordionItems" :default-value="[accordionItems[0]!.id]">
      <template v-for="item in accordionItems" #[item.id] :key="item.id">{{
        FIXTURE.text
      }}</template>
    </Accordion>
  </section>

  <section class="parity-section" data-fixture="table">
    <h2>Table</h2>
    <Table :data="FIXTURE.people" :columns="FIXTURE.columns" :page-size="3" />
  </section>
</template>

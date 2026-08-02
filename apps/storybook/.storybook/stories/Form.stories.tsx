import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox, Form, Input, InputNumber, Select, Switch } from "@crosskit-ui/react";

const meta = {
  title: "Components/Form",
  component: Form,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj;

export const Layouts: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 48 }}>
      {(["vertical", "horizontal", "inline"] as const).map(layout => (
        <Form key={layout} layout={layout} style={{ maxInlineSize: 520 }}>
          <Form.Item name="email" label="Email address" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="id" label="ID">
            <Input />
          </Form.Item>
          <Button htmlType="submit">{layout}</Button>
        </Form>
      ))}
    </div>
  ),
};

export const Validation: Story = {
  render: () => (
    <Form
      style={{ maxInlineSize: 420 }}
      initialValues={{ name: "", age: 30, plan: "", agreed: false, notify: true }}
      onFinish={() => {}}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, min: 2 }]}
        extra="As it appears on your ID"
      >
        <Input />
      </Form.Item>
      <Form.Item name="age" label="Age" rules={[{ type: "integer", min: 18, max: 120 }]}>
        <InputNumber min={0} max={150} />
      </Form.Item>
      <Form.Item name="plan" label="Plan" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Free", value: "free" },
            { label: "Pro", value: "pro" },
          ]}
        />
      </Form.Item>
      {/* `valuePropName`, because a checkbox reports through `checked` rather
          than `value` — the same default unwrapper handles both. */}
      <Form.Item name="agreed" valuePropName="checked" rules={[{ required: true }]}>
        <Checkbox label="I agree to the terms" />
      </Form.Item>
      <Form.Item name="notify" label="Email me" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Create account
      </Button>
    </Form>
  ),
};

/** A password confirmation is the shortest thing that needs `dependencies`. */
export const Dependencies: Story = {
  render: () => (
    <Form style={{ maxInlineSize: 420 }}>
      <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Confirm password"
        dependencies={["password"]}
        rules={[
          {
            required: true,
            validator: (value, values) =>
              value === (values as { password?: string }).password
                ? undefined
                : "The two passwords do not match",
          },
        ]}
      >
        <Input type="password" />
      </Form.Item>
      <Button htmlType="submit">Save</Button>
    </Form>
  ),
};

export const Lists: Story = {
  render: () => (
    <Form style={{ maxInlineSize: 520 }} initialValues={{ guests: [{ name: "", email: "" }] }}>
      <Form.List name="guests">
        {(fields, { add, remove, move }) => (
          <>
            {fields.map(guest => (
              <div key={guest.key} style={{ display: "flex", gap: 8, alignItems: "start" }}>
                <Form.Item name={[guest.name, "name"]} label="Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name={[guest.name, "email"]}
                  label="Email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input />
                </Form.Item>
                <Button type="text" danger onClick={() => remove(guest.name)}>
                  Remove
                </Button>
                <Button
                  type="text"
                  disabled={guest.name === 0}
                  onClick={() => move(guest.name, guest.name - 1)}
                >
                  Up
                </Button>
              </div>
            ))}
            <Button type="dashed" block onClick={() => add({ name: "", email: "" })}>
              Add guest
            </Button>
          </>
        )}
      </Form.List>
      <Button type="primary" htmlType="submit">
        Invite
      </Button>
    </Form>
  ),
};

import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button/button";
import { Checkbox } from "../toggle/checkbox";
import { Input } from "../input/input";
import { Form } from "./form";
import { useForm } from "./use-form";

const item = (index = 0) =>
  document.querySelectorAll<HTMLElement>('[data-scope="form"][data-part="item"]')[index]!;
const errorOf = (index = 0) =>
  item(index).querySelector<HTMLElement>('[data-scope="form"][data-part="error"]');
const field = (name: string) => screen.getByLabelText(name);

describe("Form", () => {
  it("binds a control's value into the store", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Button htmlType="submit">Save</Button>
      </Form>
    );
    await user.type(field("Email"), "a@b.co");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ email: "a@b.co" }));
  });

  it("associates the label with the control it labels", () => {
    render(
      <Form>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
      </Form>
    );
    // `getByLabelText` resolves through `htmlFor`, so this failing means the
    // generated id never reached the control — which is invisible in the DOM
    // and total for a screen reader.
    expect(field("Email").tagName).toBe("INPUT");
  });

  it("does not validate on every keystroke", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Form.Item name="email" label="Email" rules={[{ required: true, min: 5 }]}>
          <Input />
        </Form.Item>
      </Form>
    );
    await user.type(field("Email"), "a");
    // Blur is the default trigger. Validating as they type tells someone their
    // address is invalid while they are on the first character of it.
    expect(errorOf()).not.toBeInTheDocument();
  });

  it("validates on blur and clears once the value is valid", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
      </Form>
    );
    await user.type(field("Email"), "nope");
    await user.tab();
    await waitFor(() => expect(errorOf()).toHaveTextContent("Email must be a valid email"));

    // The correction clears the message even though the trigger is blur — a
    // stale error under a corrected field reads as the correction not landing.
    await user.type(field("Email"), "@x.co");
    await waitFor(() => expect(errorOf()).not.toBeInTheDocument());
  });

  it("points the control at its error and marks it invalid", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    );
    await user.click(field("Email"));
    await user.tab();
    await waitFor(() => expect(errorOf()).toBeInTheDocument());
    expect(field("Email")).toHaveAttribute("aria-invalid", "true");
    expect(field("Email")).toHaveAttribute("aria-describedby", errorOf()!.id);
  });

  it("reports every failure at once rather than one per attempt", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button htmlType="submit">Save</Button>
      </Form>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onFinishFailed).toHaveBeenCalled());
    expect(onFinish).not.toHaveBeenCalled();
    expect(onFinishFailed.mock.calls[0]![0]).toEqual({
      email: "Email is required",
      name: "Name is required",
    });
  });

  it("keeps the consumer's own handler on the control", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <Form>
        <Form.Item name="email" label="Email">
          <Input onChange={onChange} onBlur={onBlur} />
        </Form.Item>
      </Form>
    );
    await user.type(field("Email"), "x");
    await user.tab();
    // Cloning a child to inject a handler is only safe if the child's own
    // survives. Replacing it is silent: the value still binds, and whatever the
    // consumer wired up simply stops running.
    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it("binds a checkbox through `valuePropName`", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <Form.Item name="agreed" valuePropName="checked">
          <Checkbox label="Agree" />
        </Form.Item>
        <Button htmlType="submit">Save</Button>
      </Form>
    );
    await user.click(screen.getByLabelText("Agree"));
    await user.click(screen.getByRole("button", { name: "Save" }));
    // The same default unwrapper reads `target.checked` here and `target.value`
    // for a text field, because it goes through whichever prop the value comes
    // back in under.
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ agreed: true }));
  });

  it("marks a required field from its rules", () => {
    render(
      <Form>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="note" label="Note">
          <Input />
        </Form.Item>
      </Form>
    );
    expect(item(0)).toHaveAttribute("data-required", "");
    // Presence, never `="false"`: `"false"` matches `[data-required]` in CSS, so
    // an optional field would grow the marker.
    expect(item(1)).not.toHaveAttribute("data-required");
  });

  it("replaces the message with `help` and keeps `extra` alongside", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }]}
          help="Use your work address"
          extra="We never share it"
        >
          <Input />
        </Form.Item>
      </Form>
    );
    await user.click(field("Email"));
    await user.tab();
    await waitFor(() => expect(errorOf()).toHaveTextContent("Use your work address"));
    expect(screen.getByText("We never share it")).toBeInTheDocument();
  });

  it("emits no message box for a help that renders to nothing", () => {
    render(
      <Form>
        <Form.Item name="email" label="Email" extra={false}>
          <Input />
        </Form.Item>
      </Form>
    );
    // `{flag && "…"}` is `false`, which walks straight past a `!= null` check
    // and leaves an empty box holding its gap under every field on the page.
    expect(item().querySelector('[data-scope="form"][data-part="extra"]')).not.toBeInTheDocument();
  });

  it("renders no wrapper under `noStyle` but still binds", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <Form.Item name="email" noStyle>
          <Input aria-label="Email" />
        </Form.Item>
        <Button htmlType="submit">Save</Button>
      </Form>
    );
    expect(document.querySelector('[data-scope="form"][data-part="item"]')).not.toBeInTheDocument();
    await user.type(field("Email"), "hi");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ email: "hi" }));
  });

  it("disables every bound control from the form", () => {
    render(
      <Form disabled>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
      </Form>
    );
    expect(field("Email")).toBeDisabled();
  });

  it("re-validates a dependent field once it has been touched", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Form.Item name="password" label="Password">
          <Input />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm"
          dependencies={["password"]}
          rules={[
            {
              validator: (value, values) =>
                value === (values as { password?: string }).password
                  ? undefined
                  : "Passwords do not match",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
    await user.type(field("Password"), "abc");
    await user.type(field("Confirm"), "abc");
    await user.tab();
    await waitFor(() => expect(errorOf(1)).not.toBeInTheDocument());

    // Changing the field it depends on has to re-run it, or a confirmation that
    // matched when it was typed stays green after the password moves on.
    await user.type(field("Password"), "d");
    await waitFor(() => expect(errorOf(1)).toHaveTextContent("Passwords do not match"));
  });

  it("keeps an untouched dependent quiet", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Form.Item name="password" label="Password">
          <Input />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm"
          dependencies={["password"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
    await user.type(field("Password"), "abc");
    // An error on a field nobody has visited yet.
    expect(errorOf(1)).not.toBeInTheDocument();
  });

  it("resets to the initial values", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [form] = useForm<{ email: string }>();
      return (
        <Form form={form} initialValues={{ email: "start@x.co" }}>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Button onClick={() => form.reset()}>Reset</Button>
        </Form>
      );
    }
    render(<Harness />);
    // Seeded before the first paint, not from an effect — a form that shows
    // empty fields for a frame reads as having lost the values.
    expect(field("Email")).toHaveValue("start@x.co");

    await user.clear(field("Email"));
    await user.type(field("Email"), "other@x.co");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => expect(field("Email")).toHaveValue("start@x.co"));
  });
});

describe("Form.List", () => {
  function Users() {
    return (
      <Form
        initialValues={{ users: [{ email: "a@x.co" }, { email: "b@x.co" }, { email: "c@x.co" }] }}
      >
        <Form.List name="users">
          {(fields, { add, remove, move }) => (
            <>
              {fields.map(entry => (
                <Form.Item
                  key={entry.key}
                  name={[entry.name, "email"]}
                  label={`Email ${entry.name}`}
                >
                  <Input />
                </Form.Item>
              ))}
              <Button onClick={() => add({ email: "" })}>Add</Button>
              <Button onClick={() => remove(0)}>Remove first</Button>
              <Button onClick={() => move(0, 2)}>Move first to last</Button>
            </>
          )}
        </Form.List>
      </Form>
    );
  }

  const inputs = () =>
    Array.from(document.querySelectorAll<HTMLInputElement>('[data-scope="input"] input'));

  it("resolves a row's name against the list's own path", () => {
    render(<Users />);
    expect(inputs().map(input => input.value)).toEqual(["a@x.co", "b@x.co", "c@x.co"]);
  });

  it("adds and removes rows", async () => {
    const user = userEvent.setup();
    render(<Users />);
    await user.click(screen.getByRole("button", { name: "Add" }));
    await waitFor(() => expect(inputs()).toHaveLength(4));
    await user.click(screen.getByRole("button", { name: "Remove first" }));
    await waitFor(() => expect(inputs().map(i => i.value)).toEqual(["b@x.co", "c@x.co", ""]));
  });

  it("moves a row", async () => {
    const user = userEvent.setup();
    render(<Users />);
    await user.click(screen.getByRole("button", { name: "Move first to last" }));
    await waitFor(() => expect(inputs().map(i => i.value)).toEqual(["b@x.co", "c@x.co", "a@x.co"]));
  });

  it("keeps a row's DOM with the row when one above it is removed", async () => {
    const user = userEvent.setup();
    render(<Users />);
    // Stamped outside React, so it identifies the NODE rather than the props
    // React last wrote to it. Row keys are what decide which node survives.
    inputs()[1]!.dataset.stamp = "second";

    await user.click(screen.getByRole("button", { name: "Remove first" }));
    await waitFor(() => expect(inputs()).toHaveLength(2));

    // Keyed by index, React would keep all three nodes in place, rewrite their
    // props and drop the LAST one — so the stamp would still be sitting on the
    // node showing the second row's value, and any caret position, scroll
    // offset or uncontrolled state inside it would have moved to a different
    // row's data. Keyed by identity, the first node goes and the stamp comes
    // with its own row.
    expect(inputs().map(input => input.dataset.stamp)).toEqual(["second", undefined]);
  });
});

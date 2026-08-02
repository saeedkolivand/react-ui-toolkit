import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TreeSelect } from "./tree-select";
import type { TreeNode } from "@crosskit-ui/core";

const TREE: TreeNode[] = [
  {
    key: "docs",
    title: "Docs",
    children: [
      {
        key: "guide",
        title: "Guide",
        children: [
          { key: "intro", title: "Intro" },
          { key: "setup", title: "Setup" },
        ],
      },
      { key: "api", title: "API" },
    ],
  },
  { key: "changelog", title: "Changelog" },
];

const trigger = () => screen.getByRole("combobox");
const panel = () => document.querySelector('[data-scope="tree-select"][data-part="content"]');
const rowNamed = (name: string) => screen.getByRole("treeitem", { name: new RegExp(name) });
const tags = () =>
  Array.from(document.querySelectorAll('[data-scope="tree-select"][data-part="tag"]')).map(
    tag => tag.textContent
  );

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(trigger());
  await waitFor(() => expect(panel()).toBeInTheDocument());
};

describe("TreeSelect", () => {
  it("renders nothing until it is opened", () => {
    render(<TreeSelect treeData={TREE} />);
    expect(panel()).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("says what shape of popup it opens", async () => {
    const user = userEvent.setup();
    render(<TreeSelect treeData={TREE} />);
    // A combobox over a `tree` popup, which is what this is — a control whose
    // value comes from a hierarchical list. Without `aria-haspopup` a screen
    // reader cannot say what is about to appear.
    expect(trigger()).toHaveAttribute("aria-haspopup", "tree");
    await openPanel(user);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });

  it("picks one node and closes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll onChange={onChange} />);
    await openPanel(user);
    await user.click(rowNamed("Intro"));

    // Single-valued, so the value is the key itself rather than a one-element
    // array — the shape the mode implies.
    expect(onChange).toHaveBeenCalledWith("intro", ["Intro"]);
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    expect(trigger()).toHaveTextContent("Intro");
  });

  it("stays open while a multiple select is being filled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll multiple onChange={onChange} />);
    await openPanel(user);
    await user.click(rowNamed("Intro"));
    // Closing would make every extra choice a fresh round trip through the
    // trigger.
    expect(panel()).toBeInTheDocument();
    await user.click(rowNamed("Setup"));
    expect(onChange).toHaveBeenLastCalledWith(["intro", "setup"], ["Intro", "Setup"]);
  });

  it("shows a tag per value, and counts the rest past `maxTagCount`", async () => {
    const user = userEvent.setup();
    render(
      <TreeSelect
        treeData={TREE}
        treeDefaultExpandAll
        multiple
        maxTagCount={2}
        defaultValue={["intro", "setup", "api"]}
      />
    );
    expect(tags()).toEqual(["Intro", "Setup", "+1"]);
    await user.click(trigger());
    await waitFor(() => expect(panel()).toBeInTheDocument());
  });

  it("checks a subtree and reports the leaves", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll treeCheckable onChange={onChange} />);
    await openPanel(user);
    await user.click(rowNamed("Guide").querySelector("input")!);

    // Leaves, not the parent — the same contract `Tree`'s own `onCheck` keeps.
    expect(onChange).toHaveBeenCalledWith(["intro", "setup"], ["Intro", "Setup"]);
    // And checkable is inherently many-valued, so the shape is an array even
    // without `multiple`.
    expect(Array.isArray(onChange.mock.calls[0]![0])).toBe(true);
  });

  it("keys its tags by node, not by label", async () => {
    // Two nodes sharing a title is ordinary — `README` under two folders — and
    // keying on the label makes React see a duplicate and drop a tag.
    const twins: TreeNode[] = [
      { key: "a/readme", title: "README" },
      { key: "b/readme", title: "README" },
    ];
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...args) => errors.push(args));
    try {
      render(<TreeSelect treeData={twins} multiple defaultValue={["a/readme", "b/readme"]} />);
      expect(tags()).toEqual(["README", "README"]);
      expect(errors).toHaveLength(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("does not clear itself when the chosen node is clicked again", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TreeSelect treeData={TREE} treeDefaultExpandAll defaultValue="intro" onChange={onChange} />
    );
    await openPanel(user);
    await user.click(rowNamed("Intro"));

    // `Tree` reads a second click as a deselect. A control that empties itself
    // when you confirm your own choice is a trap, so this closes instead.
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger()).toHaveTextContent("Intro");
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
  });

  it("answers a label click in checkable mode, not just the box", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll treeCheckable onChange={onChange} />);
    await openPanel(user);
    // The row, not the ~14px checkbox — otherwise most of the row does nothing.
    await user.click(rowNamed("Intro").querySelector('[data-part="title"]')!);
    expect(onChange).toHaveBeenCalledWith(["intro"], ["Intro"]);

    await user.click(rowNamed("Intro").querySelector('[data-part="title"]')!);
    // And a second click unticks it, which is what a checkbox does.
    expect(onChange).toHaveBeenLastCalledWith([], []);
  });

  it("makes exactly one claim about what the popup is", async () => {
    const user = userEvent.setup();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll />);
    await openPanel(user);
    // The wrapper was `role="listbox"` holding zero options while the trigger
    // truthfully said `aria-haspopup="tree"` — two statements about one popup
    // that disagreed. The `Tree` inside is the widget.
    expect(panel()).not.toHaveAttribute("role");
    expect(screen.getAllByRole("tree")).toHaveLength(1);
    expect(screen.queryAllByRole("listbox")).toHaveLength(0);
  });

  it("submits through a hidden input per value", () => {
    render(<TreeSelect treeData={TREE} multiple name="pages" defaultValue={["intro", "setup"]} />);
    const hidden = Array.from(
      document.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="pages"]')
    );
    // `name` on a `type="button"` is never submitted. One input per key rather
    // than a joined string, so a multi-valued field arrives as a list instead
    // of as something the server has to split.
    expect(hidden.map(input => input.value)).toEqual(["intro", "setup"]);
    expect(trigger()).not.toHaveAttribute("name");
  });

  it("falls back to the key when a node has no string title", () => {
    const odd: TreeNode[] = [{ key: "lonely" }];
    render(<TreeSelect treeData={odd} defaultValue="lonely" />);
    // Better a key than an empty trigger: a control showing nothing while
    // holding a value looks broken rather than empty.
    expect(trigger()).toHaveTextContent("lonely");
  });

  it("shows the placeholder only while nothing is chosen", async () => {
    const user = userEvent.setup();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll placeholder="Pick a page" />);
    expect(trigger()).toHaveTextContent("Pick a page");
    expect(trigger()).toHaveAttribute("data-empty", "");

    await openPanel(user);
    await user.click(rowNamed("API"));
    await waitFor(() => expect(trigger()).not.toHaveAttribute("data-empty"));
    expect(trigger()).not.toHaveTextContent("Pick a page");
  });

  it("clears without reopening the panel", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TreeSelect treeData={TREE} defaultValue="intro" onChange={onChange} />);
    await user.click(document.querySelector('[data-part="clear"]')!);
    expect(onChange).toHaveBeenCalledWith(null, []);
    // The clear stops its own click reaching the trigger wrapper.
    expect(panel()).not.toBeInTheDocument();
  });

  it("hands the tree the keyboard on ArrowDown", async () => {
    const user = userEvent.setup();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll />);
    trigger().focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(panel()).toBeInTheDocument());
    // Focus does not move on open, so the trigger keeps announcing itself —
    // this is the one key that transfers it, and without it the portalled tree
    // is unreachable by keyboard.
    await waitFor(() => expect(rowNamed("Docs")).toHaveFocus());
  });

  it("gives focus back to the trigger when the panel closes", async () => {
    const user = userEvent.setup();
    render(<TreeSelect treeData={TREE} treeDefaultExpandAll />);
    trigger().focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(rowNamed("Docs")).toHaveFocus());

    await user.keyboard("{Escape}");
    // Otherwise `<body>` holds focus and the next Tab restarts at the top of
    // the page.
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it("does nothing at all when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TreeSelect treeData={TREE} disabled onChange={onChange} />);
    await user.click(trigger());
    expect(panel()).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("follows a controlled value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <TreeSelect treeData={TREE} treeDefaultExpandAll value="intro" onChange={onChange} />
    );
    expect(trigger()).toHaveTextContent("Intro");

    await openPanel(user);
    await user.click(rowNamed("Setup"));
    // Reported, and nothing changes until the consumer says so.
    expect(onChange).toHaveBeenCalledWith("setup", ["Setup"]);
    expect(trigger()).toHaveTextContent("Intro");

    rerender(<TreeSelect treeData={TREE} treeDefaultExpandAll value="setup" onChange={onChange} />);
    expect(trigger()).toHaveTextContent("Setup");
  });
});

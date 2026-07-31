import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./tabs";
import { Accordion } from "../accordion/accordion";

const ITEMS = [
  { id: "one", label: "One", content: "First panel" },
  { id: "two", label: "Two", content: "Second panel" },
  { id: "three", label: "Three", content: "Third panel" },
];

describe("Tabs", () => {
  it("renders a tablist with the first tab selected", async () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("One")
    );
  });

  // v0 set aria-labelledby={`tab-${index}`} while the triggers carried no id at
  // all, so the panel's association never resolved to anything.
  it("resolves each panel's aria-labelledby to its trigger", async () => {
    render(<Tabs items={ITEMS} />);
    const panel = await screen.findByRole("tabpanel");
    const labelledBy = panel.getAttribute("aria-labelledby")!;
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy)).toHaveTextContent("One");
  });

  // Arrow-key navigation is NOT asserted here. zag filters focus candidates by
  // visibility, and jsdom reports zero dimensions for every element, so focus
  // never moves in this environment — the assertion would fail against working
  // code. It belongs in the Playwright parity suite, running in a real browser.
  // What jsdom CAN prove is that the roving-tabindex wiring is present.
  it("wires a roving tabindex across the triggers", async () => {
    render(<Tabs items={ITEMS} />);
    await screen.findByRole("tabpanel");
    const [first, second] = screen.getAllByRole("tab");
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("tabindex", "-1");
  });

  it("selects a tab on click", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} />);
    await screen.findByRole("tabpanel");
    await user.click(screen.getByRole("tab", { name: "Two" }));
    await waitFor(() =>
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Two")
    );
  });

  it("keys tabs by id, not by index", async () => {
    render(<Tabs items={ITEMS} defaultValue="three" />);
    await waitFor(() =>
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Three")
    );
  });
});

const ACC = [
  { id: "a", title: "Section A", content: "Body A" },
  { id: "b", title: "Section B", content: "Body B" },
];

describe("Accordion", () => {
  it("renders triggers and toggles a panel", async () => {
    const user = userEvent.setup();
    render(<Accordion items={ACC} />);
    const trigger = screen.getByRole("button", { name: /Section A/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
  });

  it("keeps one open at a time unless allowMultiple is set", async () => {
    const user = userEvent.setup();
    render(<Accordion items={ACC} />);
    await user.click(screen.getByRole("button", { name: /Section A/ }));
    await user.click(screen.getByRole("button", { name: /Section B/ }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Section A/ })).toHaveAttribute(
        "aria-expanded",
        "false"
      )
    );
  });

  it("allows several open when allowMultiple is set", async () => {
    const user = userEvent.setup();
    render(<Accordion items={ACC} allowMultiple />);
    await user.click(screen.getByRole("button", { name: /Section A/ }));
    await user.click(screen.getByRole("button", { name: /Section B/ }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Section A/ })).toHaveAttribute(
        "aria-expanded",
        "true"
      )
    );
  });
});

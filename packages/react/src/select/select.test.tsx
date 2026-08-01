import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./select";

const OPTIONS = [
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "ke", label: "Kenya", disabled: true },
  { value: "za", label: "South Africa" },
];

const setup = (props: Partial<Parameters<typeof Select>[0]> = {}) => {
  const onChange = vi.fn();
  const result = render(<Select options={OPTIONS} onChange={onChange} {...props} />);
  return { ...result, onChange };
};

const trigger = () => screen.getByRole("combobox");
const listbox = () => screen.queryByRole("listbox");
const option = (name: string) => screen.getByRole("option", { name });
const highlighted = () => document.querySelector("[data-highlighted]")?.textContent;
const openIt = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(trigger());
  await waitFor(() => expect(listbox()).toBeInTheDocument());
};

describe("Select", () => {
  it("shows the placeholder until something is chosen", () => {
    setup({ placeholder: "Pick one" });
    expect(trigger()).toHaveTextContent("Pick one");
    expect(trigger()).toHaveAttribute("data-placeholder-shown", "");
  });

  it("shows the label of the current value", () => {
    setup({ defaultValue: "gh" });
    expect(trigger()).toHaveTextContent("Ghana");
    expect(trigger()).not.toHaveAttribute("data-placeholder-shown");
  });

  it("renders nothing until opened", () => {
    setup();
    expect(listbox()).not.toBeInTheDocument();
  });

  it("chooses on click and reports the value and its option", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await openIt(user);
    await user.click(option("Ghana"));

    // The option, not just the value — a consumer almost always wants the label
    // too, and would otherwise have to look it up again.
    expect(onChange).toHaveBeenCalledWith("gh", { value: "gh", label: "Ghana" });
    await waitFor(() => expect(listbox()).not.toBeInTheDocument());
    expect(trigger()).toHaveTextContent("Ghana");
  });

  it("ignores a click on a disabled option", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await openIt(user);
    await user.click(option("Kenya"));
    expect(onChange).not.toHaveBeenCalled();
    expect(listbox()).toBeInTheDocument();
  });

  // -------------------------------------------------------------------- ARIA

  it("announces itself as a combobox owning a listbox", async () => {
    const user = userEvent.setup();
    setup();
    expect(trigger()).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    await openIt(user);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveAttribute("aria-controls", listbox()!.id);
  });

  it("marks the chosen option selected, and only that one", async () => {
    const user = userEvent.setup();
    setup({ defaultValue: "gh" });
    await openIt(user);
    expect(option("Ghana")).toHaveAttribute("aria-selected", "true");
    expect(option("Nigeria")).toHaveAttribute("aria-selected", "false");
    expect(screen.getAllByRole("option", { selected: true })).toHaveLength(1);
  });

  it("tracks the highlight with aria-activedescendant", async () => {
    const user = userEvent.setup();
    setup();
    await openIt(user);
    await waitFor(() => expect(listbox()).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveAttribute("aria-activedescendant", option("Ghana").id);
  });

  it("names the listbox with the same label as the trigger", async () => {
    const user = userEvent.setup();
    setup({ label: "Country" });
    // A listbox with no accessible name is announced as just "listbox".
    expect(trigger()).toHaveAccessibleName("Country");
    await openIt(user);
    expect(listbox()).toHaveAccessibleName("Country");
  });

  it("describes the trigger with its error rather than its helper", () => {
    setup({ helperText: "Pick a country", errorMessage: "Required" });
    expect(trigger()).toHaveAccessibleDescription("Required");
  });

  // ---------------------------------------------------------------- keyboard

  it("opens on Enter and lands on the current selection", async () => {
    const user = userEvent.setup();
    setup({ defaultValue: "za" });
    trigger().focus();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(listbox()).toBeInTheDocument());
    // Not the top of the list: a long one should not start somewhere the user
    // has to scroll back from.
    expect(highlighted()).toContain("South Africa");
  });

  it("steps over a disabled option", async () => {
    const user = userEvent.setup();
    setup({ defaultValue: "gh" });
    trigger().focus();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(listbox()).toBeInTheDocument());
    await user.keyboard("{ArrowDown}");
    // "Kenya" is disabled and skipped in one press.
    expect(highlighted()).toContain("South Africa");
  });

  it("jumps by typeahead", async () => {
    const user = userEvent.setup();
    setup();
    await openIt(user);
    await user.keyboard("so");
    expect(highlighted()).toContain("South Africa");
  });

  it("chooses the highlighted option on Enter", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await openIt(user);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("gh", { value: "gh", label: "Ghana" });
    await waitFor(() => expect(listbox()).not.toBeInTheDocument());
  });

  it("closes on Escape without choosing", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await openIt(user);
    await user.keyboard("{ArrowDown}{Escape}");
    await waitFor(() => expect(listbox()).not.toBeInTheDocument());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("gives focus back to the trigger when it closes", async () => {
    const user = userEvent.setup();
    setup();
    await openIt(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(listbox()).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
  });

  // ------------------------------------------------------------------- forms

  it("carries the value in a real control a plain submission can read", () => {
    const { container } = setup({ name: "country", defaultValue: "gh" });
    const native = container.querySelector<HTMLSelectElement>('select[name="country"]')!;
    expect(native.value).toBe("gh");
    // Hidden from assistive tech, which has the combobox already, and out of
    // the tab order so it is not a second stop.
    expect(native).toHaveAttribute("aria-hidden", "true");
    expect(native).toHaveAttribute("tabindex", "-1");
  });

  // -------------------------------------------------------------- controlled

  it("obeys a controlled value and does not move on its own", async () => {
    const user = userEvent.setup();
    const { onChange } = setup({ value: "ng" });
    await openIt(user);
    await user.click(option("Ghana"));
    expect(onChange).toHaveBeenCalledWith("gh", { value: "gh", label: "Ghana" });
    expect(trigger()).toHaveTextContent("Nigeria");
  });

  it("stays shut when disabled", async () => {
    const user = userEvent.setup();
    setup({ disabled: true });
    await user.click(trigger());
    expect(listbox()).not.toBeInTheDocument();
  });

  it('does not render a boolean data attribute as "false"', () => {
    setup({ defaultValue: "gh" });
    // "false" MATCHES [data-x] in CSS, so a rendered ="false" silently applies
    // the wrong styles.
    expect(document.body.innerHTML).not.toMatch(/data-[\w-]+="false"/);
  });
});

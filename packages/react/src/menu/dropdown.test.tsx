import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown, type DropdownMenuEntry } from "./dropdown";

const ITEMS: DropdownMenuEntry[] = [
  { key: "edit", label: "Edit" },
  { key: "duplicate", label: "Duplicate" },
  { type: "divider" },
  { key: "archive", label: "Archive", disabled: true },
  { key: "delete", label: "Delete", danger: true },
];

const setup = (props: Partial<Parameters<typeof Dropdown>[0]> = {}) => {
  const onClick = vi.fn();
  const result = render(
    <Dropdown menu={{ items: ITEMS, onClick }} mouseEnterDelay={0} mouseLeaveDelay={0} {...props}>
      <button>Actions</button>
    </Dropdown>
  );
  return { ...result, onClick };
};

const trigger = () => screen.getByRole("button", { name: "Actions" });
const content = () => document.querySelector('[data-scope="menu"][data-part="content"]');
const items = () => [...document.querySelectorAll('[data-scope="menu"][data-part="item"]')];
const highlighted = () => document.querySelector("[data-highlighted]")?.textContent;
const openWithKeyboard = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.tab();
  await user.keyboard("{ArrowDown}");
  await waitFor(() => expect(content()).toBeInTheDocument());
};

describe("Dropdown", () => {
  it("renders the trigger as given, without wrapping it in a second button", () => {
    setup();
    // v0 took a whole element here and put it inside a button of its own, which
    // is invalid HTML and makes the inner one unreachable.
    expect(trigger()).toBeInTheDocument();
    expect(trigger().querySelector("button")).toBeNull();
    expect(trigger().closest("button")).toBe(trigger());
  });

  it("renders nothing until opened", () => {
    setup();
    expect(content()).not.toBeInTheDocument();
  });

  it("renders items and dividers in order", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    expect(items().map(i => i.textContent)).toEqual(["Edit", "Duplicate", "Archive", "Delete"]);
    expect(document.querySelectorAll('[data-part="separator"]')).toHaveLength(1);
  });

  it("marks the danger and disabled items", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    expect(items()[2]).toHaveAttribute("data-disabled", "");
    expect(items()[3]).toHaveAttribute("data-danger", "");
  });

  // ---------------------------------------------------------------- keyboard

  it("opens on Enter and highlights the first item", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(content()).toBeInTheDocument());
    expect(highlighted()).toBe("Edit");
  });

  it("opens on ArrowUp at the last item", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    await user.keyboard("{ArrowUp}");
    await waitFor(() => expect(content()).toBeInTheDocument());
    expect(highlighted()).toBe("Delete");
  });

  it("opens by keyboard even though the trigger is hover-only", async () => {
    const user = userEvent.setup();
    // The default trigger is hover, inherited from the API being mirrored. A
    // menu that only a pointer can open is unusable by keyboard, so Enter and
    // the arrows work regardless — `trigger` governs pointer and focus
    // gestures, not the role's own keys.
    setup({ trigger: "hover" });
    await user.tab();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(content()).toBeInTheDocument());
  });

  it("steps past a disabled item rather than landing on it", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    await user.keyboard("{ArrowDown}");
    expect(highlighted()).toBe("Duplicate");
    // "Archive" is disabled and must be skipped in one press, not selected and
    // then rejected.
    await user.keyboard("{ArrowDown}");
    expect(highlighted()).toBe("Delete");
  });

  it("wraps at the end", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    await user.keyboard("{ArrowUp}");
    await waitFor(() => expect(content()).toBeInTheDocument());
    expect(highlighted()).toBe("Delete");
    await user.keyboard("{ArrowDown}");
    expect(highlighted()).toBe("Edit");
  });

  it("jumps to Home and End", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    await user.keyboard("{End}");
    expect(highlighted()).toBe("Delete");
    await user.keyboard("{Home}");
    expect(highlighted()).toBe("Edit");
  });

  it("jumps by typeahead", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    await user.keyboard("du");
    expect(highlighted()).toBe("Duplicate");
  });

  it("selects the highlighted item on Enter and closes", async () => {
    const user = userEvent.setup();
    const { onClick } = setup();
    await openWithKeyboard(user);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onClick).toHaveBeenCalledWith({ key: "duplicate" });
    await waitFor(() => expect(content()).not.toBeInTheDocument());
  });

  it("closes on Escape without selecting", async () => {
    const user = userEvent.setup();
    const { onClick } = setup();
    await openWithKeyboard(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).not.toBeInTheDocument());
    expect(onClick).not.toHaveBeenCalled();
  });

  it("closes on Tab rather than stepping through the items", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    // A menu is one stop in the tab order, not one stop per item.
    await user.keyboard("{Tab}");
    await waitFor(() => expect(content()).not.toBeInTheDocument());
  });

  // ------------------------------------------------------------------ mouse

  it("selects on click", async () => {
    const user = userEvent.setup();
    const { onClick } = setup();
    await openWithKeyboard(user);
    await user.click(items()[1]!);
    expect(onClick).toHaveBeenCalledWith({ key: "duplicate" });
  });

  it("ignores a click on a disabled item", async () => {
    const user = userEvent.setup();
    const { onClick } = setup();
    await openWithKeyboard(user);
    await user.click(items()[2]!);
    expect(onClick).not.toHaveBeenCalled();
    expect(content()).toBeInTheDocument();
  });

  // ------------------------------------------------------------------- ARIA

  it("announces the trigger as a menu button", async () => {
    const user = userEvent.setup();
    setup();
    // Explicitly "false" rather than absent: absent means "opens nothing",
    // which is a different statement from "opens something, currently closed".
    expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    await openWithKeyboard(user);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveAttribute("aria-controls", content()!.id);
  });

  it("tracks the highlight with aria-activedescendant", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    // Focus stays on the menu box; the highlight is announced through this
    // rather than by moving DOM focus item to item.
    expect(content()).toHaveAttribute("aria-activedescendant", items()[0]!.id);
    await user.keyboard("{ArrowDown}");
    expect(content()).toHaveAttribute("aria-activedescendant", items()[1]!.id);
  });

  it("gives the menu and its items their roles", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    expect(content()).toHaveAttribute("role", "menu");
    expect(items()[0]).toHaveAttribute("role", "menuitem");
    expect(items()[2]).toHaveAttribute("aria-disabled", "true");
  });

  it("moves focus into the menu when it opens", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    await waitFor(() => expect(content()).toHaveFocus());
  });

  it('does not render a boolean data attribute as "false"', async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    expect(document.body.innerHTML).not.toMatch(/data-[\w-]+="false"/);
  });
});

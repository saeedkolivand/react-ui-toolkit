import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
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
/**
 * A touch tap, as a browser dispatches it.
 *
 * `userEvent` has no touch pointer type, so the sequence is built by hand —
 * which is the only way to tell a tap from a mouse click here, and the whole
 * point: the two take different paths through the trigger.
 */
const tap = async (element: Element) => {
  const opts = { pointerType: "touch", bubbles: true, cancelable: true };
  await act(async () => {
    for (const type of ["pointerover", "pointerenter", "pointerdown", "pointerup"]) {
      element.dispatchEvent(new PointerEvent(type, opts));
    }
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
};

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

  it("puts the consumer's className on the trigger wrapper", () => {
    setup({ className: "mine" });
    expect(document.querySelector('[data-scope="menu"][data-part="trigger"]')).toHaveClass("mine");
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

  it("opens on a tap, with the hover default a touch device cannot use", async () => {
    setup();
    // What a tap actually dispatches. `hover` is the default trigger and a
    // touch device has no hover state to enter, so without tap-to-toggle this
    // control cannot be opened at all — and it is the configuration the docs
    // sample and the Storybook story both use.
    await tap(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
  });

  it("closes on a second tap", async () => {
    setup();
    await tap(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    await tap(trigger());
    await waitFor(() => expect(content()).not.toBeInTheDocument());
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

  it("gives focus back to the trigger after Escape", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).not.toBeInTheDocument());
    // Taking focus on open and dropping it on close leaves <body> focused, so
    // the next Tab restarts at the top of the page instead of after the menu.
    expect(trigger()).toHaveFocus();
  });

  it("gives focus back to the trigger after selecting", async () => {
    const user = userEvent.setup();
    setup();
    await openWithKeyboard(user);
    await user.keyboard("{Enter}");
    await waitFor(() => expect(content()).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
  });

  it("does not take focus back when it was closed while focus sat elsewhere", async () => {
    const { rerender } = render(
      <>
        <button>elsewhere</button>
        <Dropdown menu={{ items: ITEMS }} open onOpenChange={() => {}}>
          <button>Actions</button>
        </Dropdown>
      </>
    );
    await waitFor(() => expect(content()).toBeInTheDocument());

    const elsewhere = screen.getByRole("button", { name: "elsewhere" });
    elsewhere.focus();
    // Controlled, closed by the consumer rather than by a press. This is the
    // case the guard is actually for, and the only one that can observe it: on
    // any pointer path the browser assigns focus to what was pressed AFTER the
    // close effect has run, so the restore is overwritten either way — verified
    // in Chromium against both a focusable target and empty space.
    rerender(
      <>
        <button>elsewhere</button>
        <Dropdown menu={{ items: ITEMS }} open={false} onOpenChange={() => {}}>
          <button>Actions</button>
        </Dropdown>
      </>
    );
    await waitFor(() => expect(content()).not.toBeInTheDocument());
    expect(elsewhere).toHaveFocus();
    expect(trigger()).not.toHaveFocus();
  });

  it("does not take focus when a pointer merely crossed the trigger", async () => {
    const user = userEvent.setup();
    render(<input aria-label="typing" />);
    setup();
    const input = screen.getByRole("textbox", { name: "typing" });
    input.focus();
    await user.hover(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    // Hover is the DEFAULT trigger here, so grabbing focus whenever the menu
    // appeared would take the caret out of an adjacent field merely because the
    // pointer crossed the button — and the close would then hand it to the
    // trigger rather than back.
    expect(input).toHaveFocus();
  });

  it("still takes focus on a keyboard open that follows a hover open", async () => {
    const user = userEvent.setup();
    setup();
    // The open reason is recorded where the open happens. The trigger's keydown
    // opens without going through the delay scheduler, so it used to inherit
    // whatever the last POINTER gesture wrote — and after one hover-open the
    // next keyboard open read a stale "hover", declined to take focus, and left
    // the menu keyboard-dead with only Escape working.
    await user.hover(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    await user.unhover(trigger());
    await waitFor(() => expect(content()).not.toBeInTheDocument());

    trigger().focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(content()).toBeInTheDocument());
    await waitFor(() => expect(content()).toHaveFocus());
    // And the keys actually reach it, which is the thing the user notices.
    await user.keyboard("{ArrowDown}");
    expect(highlighted()).toBe("Duplicate");
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

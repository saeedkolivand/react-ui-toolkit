import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigProvider } from "../config/config-provider";
import { enUS } from "../locale/en-US";
import { TimePicker } from "./time-picker";

const at = (hour: number, minute = 0, second = 0) => new Date(2026, 2, 15, hour, minute, second);

const withLocale = (tag: string, node: React.ReactNode) => (
  <ConfigProvider locale={{ ...enUS, tag }}>{node}</ConfigProvider>
);

const input = () => document.querySelector<HTMLInputElement>('[data-part="input"]')!;
const panel = () => document.querySelector('[data-scope="time-picker"][data-part="content"]');
const columnNamed = (name: string) => screen.getByRole("listbox", { name });
const hm = (date: Date) => [date.getHours(), date.getMinutes(), date.getSeconds()];

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(input());
  await waitFor(() => expect(panel()).toBeInTheDocument());
};

describe("TimePicker", () => {
  it("offers hours and minutes, and seconds only when asked", async () => {
    const user = userEvent.setup();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} />));
    await openPanel(user);
    expect(screen.getAllByRole("listbox")).toHaveLength(2);
    expect(within(columnNamed("hour")).getAllByRole("option")).toHaveLength(24);
    expect(within(columnNamed("minute")).getAllByRole("option")).toHaveLength(60);
  });

  it("thins the columns by the step", async () => {
    const user = userEvent.setup();
    render(
      withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} minuteStep={15} showSecond />)
    );
    await openPanel(user);
    expect(within(columnNamed("minute")).getAllByRole("option")).toHaveLength(4);
    expect(screen.getAllByRole("listbox")).toHaveLength(3);
  });

  it("picks an hour and a minute", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} onChange={onChange} />));
    await openPanel(user);
    await user.click(within(columnNamed("hour")).getByRole("option", { name: "09" }));
    expect(hm(onChange.mock.calls[0]![0] as Date)).toEqual([9, 30, 0]);

    await user.click(within(columnNamed("minute")).getByRole("option", { name: "45" }));
    expect(hm(onChange.mock.calls[1]![0] as Date)).toEqual([9, 45, 0]);
  });

  it("keeps the day the value sits on", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} onChange={onChange} />));
    await openPanel(user);
    await user.click(within(columnNamed("hour")).getByRole("option", { name: "09" }));
    const picked = onChange.mock.calls[0]![0] as Date;
    // A picker driving one half of a date-and-time pair must not move the other.
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 2, 15]);
  });

  it("follows the locale's clock convention without being told", async () => {
    const user = userEvent.setup();
    render(withLocale("en-US", <TimePicker defaultValue={at(14, 30)} />));
    await openPanel(user);
    // en-US is twelve-hour and en-GB is not, inside one language — which is why
    // this is asked of `Intl` rather than keyed on the language.
    expect(screen.getAllByRole("listbox")).toHaveLength(3);
    expect(screen.getByRole("listbox", { name: "period" })).toBeInTheDocument();
  });

  it("maps a twelve-hour label back to the hour it means", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-US", <TimePicker defaultValue={at(14, 30)} onChange={onChange} />));
    await openPanel(user);

    // The column carries DISPLAY hours, and the afternoon is carried by the
    // period rather than by the number — so "03" in the afternoon is 15:00.
    //
    // Deliberately not "12": `from12Hour(12, true)` is 12 and writing the label
    // straight in is also 12, so that is the one entry where the correct
    // mapping and the broken one agree. Testing it asserts nothing.
    await user.click(within(columnNamed("hour")).getByRole("option", { name: "03" }));
    expect(hm(onChange.mock.calls[0]![0] as Date)).toEqual([15, 30, 0]);

    await user.click(screen.getByRole("option", { name: "AM" }));
    // And 12 AM is midnight, not noon — the other end of the same exception.
    expect(hm(onChange.mock.calls[1]![0] as Date)).toEqual([3, 30, 0]);
  });

  it("switches the half of the day without changing the hour on the face", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-US", <TimePicker defaultValue={at(9, 15)} onChange={onChange} />));
    await openPanel(user);
    await user.click(screen.getByRole("option", { name: "PM" }));
    expect(hm(onChange.mock.calls[0]![0] as Date)).toEqual([21, 15, 0]);
  });

  it("reads a typed time, with or without a day period", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-US", <TimePicker onChange={onChange} />));
    await user.type(input(), "2:30 PM");
    await user.tab();
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(hm(onChange.mock.calls[0]![0] as Date)).toEqual([14, 30, 0]);
  });

  it("reverts an unreadable entry rather than clearing", async () => {
    const user = userEvent.setup();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} />));
    const before = input().value;
    await user.clear(input());
    await user.type(input(), "half past");
    await user.tab();
    await waitFor(() => expect(input()).toHaveValue(before));
  });

  it("pulls a value into range on commit, and blocks what is outside it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      withLocale(
        "en-GB",
        <TimePicker
          defaultValue={at(12, 0)}
          minTime={at(9, 0)}
          maxTime={at(17, 0)}
          onChange={onChange}
        />
      )
    );
    await openPanel(user);
    const early = within(columnNamed("hour")).getByRole("option", { name: "06" });
    expect(early).toHaveAttribute("aria-disabled", "true");
    await user.click(early);
    expect(onChange).not.toHaveBeenCalled();

    // Typing is the other way in, and it lands on the same clamp.
    await user.clear(input());
    await user.type(input(), "06:00");
    await user.tab();
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(hm(onChange.mock.calls[0]![0] as Date)).toEqual([9, 0, 0]);
  });

  it("marks the chosen entry in each column", async () => {
    const user = userEvent.setup();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} />));
    await openPanel(user);
    expect(within(columnNamed("hour")).getByRole("option", { name: "14" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // `aria-selected` is a real tri-state on an option: absent means "not
    // selectable", which is a different statement from "selectable, not
    // selected". So `"false"` is right here and wrong on a `data-*`.
    expect(within(columnNamed("hour")).getByRole("option", { name: "13" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(within(columnNamed("hour")).getByRole("option", { name: "13" })).not.toHaveAttribute(
      "data-selected"
    );
  });

  it("gives each column one tab stop, not one per option", async () => {
    const user = userEvent.setup();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} showSecond />));
    await openPanel(user);
    const stops = Array.from(document.querySelectorAll<HTMLElement>('[data-part="option"]')).filter(
      option => option.tabIndex === 0
    );
    // Three columns, three stops. Leaving every option tabbable makes this
    // panel 144 stops to walk past, and a keyboard user reaching OK would have
    // to walk all of them.
    expect(stops).toHaveLength(3);
  });

  it("moves the stop inside a column with the arrows, without committing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} onChange={onChange} />));
    input().focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(panel()).toBeInTheDocument());
    await waitFor(() =>
      expect(within(columnNamed("hour")).getByRole("option", { name: "14" })).toHaveFocus()
    );

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(within(columnNamed("hour")).getByRole("option", { name: "16" })).toHaveFocus();
    // Focus moves; the value does not. Committing on every arrow would fire
    // `onChange` for every minute crossed on the way to the one wanted.
    expect(onChange).not.toHaveBeenCalled();
  });

  it("stops at the ends of a column rather than wrapping", async () => {
    const user = userEvent.setup();
    render(withLocale("en-GB", <TimePicker defaultValue={at(0, 30)} />));
    input().focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(within(columnNamed("hour")).getByRole("option", { name: "00" })).toHaveFocus()
    );
    await user.keyboard("{ArrowUp}{ArrowUp}");
    // Arriving at 23:00 by pressing Up past midnight is nobody's intent.
    expect(within(columnNamed("hour")).getByRole("option", { name: "00" })).toHaveFocus();
  });

  it("keeps a tab stop in a column whose value is off the step grid", async () => {
    const user = userEvent.setup();
    // 09:41 against a 15-minute column matches nothing — which the panel's own
    // Now button produces. Every option then gets -1 and Tab walks straight
    // past the column to the footer.
    render(withLocale("en-GB", <TimePicker defaultValue={at(9, 41)} minuteStep={15} showSecond />));
    await openPanel(user);
    for (const name of ["hour", "minute", "second"]) {
      const stops = within(columnNamed(name))
        .getAllByRole("option")
        .filter(option => (option as HTMLElement).tabIndex === 0);
      expect(stops, name).toHaveLength(1);
    }
    // And it lands on the nearest entry at or below, not on the first.
    expect(within(columnNamed("minute")).getByRole("option", { name: "30" })).toHaveAttribute(
      "tabindex",
      "0"
    );
  });

  it("gives the day-period column one stop and the arrows too", async () => {
    const user = userEvent.setup();
    // en-US, because the period column is the DEFAULT there — a test that
    // renders en-GB never sees it, which is how it shipped built by hand with
    // two stops and no arrow handling.
    render(withLocale("en-US", <TimePicker defaultValue={at(9, 15)} />));
    await openPanel(user);
    const period = columnNamed("period");
    const stops = within(period)
      .getAllByRole("option")
      .filter(option => (option as HTMLElement).tabIndex === 0);
    expect(stops).toHaveLength(1);

    within(period).getByRole("option", { name: "AM" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(within(period).getByRole("option", { name: "PM" })).toHaveFocus();
  });

  it("sets the current time from the footer", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-GB", <TimePicker onChange={onChange} />));
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: "Now" }));
    const picked = onChange.mock.calls[0]![0] as Date;
    const now = new Date();
    expect(picked.getHours()).toBe(now.getHours());
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
  });

  it("clears the value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} onChange={onChange} />));
    await user.click(document.querySelector('[data-part="clear"]')!);
    expect(onChange).toHaveBeenCalledWith(null, "");
    expect(input()).toHaveValue("");
    // The clear stops its own click reaching the trigger wrapper.
    expect(panel()).not.toBeInTheDocument();
  });

  it("hands the columns the keyboard on ArrowDown", async () => {
    const user = userEvent.setup();
    render(withLocale("en-GB", <TimePicker defaultValue={at(14, 30)} />));
    input().focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(panel()).toBeInTheDocument());
    // Focus does not move on open, because the field is typed into — so this is
    // the one key that transfers it, and without it the portalled columns are
    // unreachable by keyboard.
    await waitFor(() =>
      expect(within(columnNamed("hour")).getByRole("option", { name: "14" })).toHaveFocus()
    );
  });
});

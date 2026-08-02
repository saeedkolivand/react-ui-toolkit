import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RangePicker } from "./range-picker";

const MARCH = new Date(2026, 2, 15);

const fields = () => ({
  start: document.querySelector<HTMLInputElement>('[data-part="start-input"]')!,
  end: document.querySelector<HTMLInputElement>('[data-part="end-input"]')!,
});
const panel = () => document.querySelector('[data-scope="range-picker"][data-part="content"]');
const dayNamed = (label: string | RegExp) => screen.getAllByRole("button", { name: label })[0]!;
const inRange = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-in-range]")).map(day =>
    day.getAttribute("aria-label")!
  );

const ymd = (date: Date) => [date.getFullYear(), date.getMonth(), date.getDate()];

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(fields().start);
  await waitFor(() => expect(panel()).toBeInTheDocument());
};

describe("RangePicker", () => {
  it("shows two consecutive months, so a range across a boundary needs no paging", async () => {
    const user = userEvent.setup();
    render(<RangePicker defaultValue={[MARCH, null]} />);
    await openPanel(user);
    const titles = Array.from(
      document.querySelectorAll('[data-scope="calendar"][data-part="title"]')
    ).map(el => el.textContent);
    expect(titles).toEqual(["March 2026", "April 2026"]);
  });

  it("picks a range in two clicks and closes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangePicker defaultValue={[MARCH, null]} onChange={onChange} />);
    await openPanel(user);

    await user.click(dayNamed(/March 10, 2026/));
    // The first click is reported as a half-range rather than held back, so a
    // controlled consumer sees it. `null` is what makes "one end chosen" sayable.
    expect(onChange.mock.calls[0]![0]).toEqual([expect.any(Date), null]);

    await user.click(dayNamed(/March 20, 2026/));
    const [dates, strings] = onChange.mock.calls[1]!;
    expect(ymd((dates as [Date, Date])[0])).toEqual([2026, 2, 10]);
    expect(ymd((dates as [Date, Date])[1])).toEqual([2026, 2, 20]);
    expect(strings).toEqual(["Mar 10, 2026", "Mar 20, 2026"]);
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
  });

  it("sorts a range picked backwards", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangePicker defaultValue={[MARCH, null]} onChange={onChange} />);
    await openPanel(user);
    await user.click(dayNamed(/March 20, 2026/));
    await user.click(dayNamed(/March 10, 2026/));

    // Picking backwards is an ordinary gesture; a range that came back with its
    // ends swapped would be nobody's idea of the answer.
    const dates = onChange.mock.calls[1]![0] as [Date, Date];
    expect(ymd(dates[0])).toEqual([2026, 2, 10]);
    expect(ymd(dates[1])).toEqual([2026, 2, 20]);
  });

  it("previews the span under the pointer before the second click", async () => {
    const user = userEvent.setup();
    render(<RangePicker defaultValue={[MARCH, null]} />);
    await openPanel(user);
    await user.click(dayNamed(/March 10, 2026/));
    expect(inRange()).toHaveLength(0);

    await user.hover(dayNamed(/March 14, 2026/));
    // Strictly between: the 11th, 12th and 13th. The ends paint as selected and
    // must not also claim `in-range`, since the two rules paint differently and
    // a day holding both takes whichever comes last in the file.
    await waitFor(() => expect(inRange()).toHaveLength(3));
    expect(inRange()[0]).toMatch(/March 11, 2026/);
  });

  it("previews a backwards hover too", async () => {
    const user = userEvent.setup();
    render(<RangePicker defaultValue={[MARCH, null]} />);
    await openPanel(user);
    await user.click(dayNamed(/March 20, 2026/));
    await user.hover(dayNamed(/March 17, 2026/));
    // `compareDates` on an unsorted pair highlights nothing at all, so the
    // preview has to normalise the same way the commit does.
    await waitFor(() => expect(inRange()).toHaveLength(2));
  });

  it("paints both ends of a committed range and everything between", () => {
    render(
      <RangePicker defaultValue={[new Date(2026, 2, 10), new Date(2026, 2, 13)]} defaultOpen />
    );
    const selected = Array.from(document.querySelectorAll("[data-selected]")).map(day =>
      day.getAttribute("aria-label")
    );
    expect(selected.some(label => label?.includes("March 10"))).toBe(true);
    expect(selected.some(label => label?.includes("March 13"))).toBe(true);
    expect(inRange()).toHaveLength(2);
  });

  it("starts a fresh range each time the panel opens", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangePicker defaultValue={[MARCH, null]} onChange={onChange} />);
    await openPanel(user);
    await user.click(dayNamed(/March 10, 2026/));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(panel()).not.toBeInTheDocument());

    onChange.mockClear();
    // Reopened from the END field, which is where the first click left focus.
    // That is the path the reset exists for: coming back through the START
    // field resets `picking` through its own focus handler, so a test that goes
    // that way passes whether the panel resets or not.
    await user.click(fields().end);
    await waitFor(() => expect(panel()).toBeInTheDocument());
    await user.click(dayNamed(/March 25, 2026/));

    // Resuming mid-pick would write an end for a start the user has forgotten
    // choosing, and silently commit a range they never saw.
    expect(onChange.mock.calls[0]![0]).toEqual([expect.any(Date), null]);
    expect(ymd((onChange.mock.calls[0]![0] as [Date, null])[0])).toEqual([2026, 2, 25]);
  });

  it("tells the predicate which end is being picked", async () => {
    const user = userEvent.setup();
    // Typed, or `vi.fn(() => false)` infers a zero-argument mock and
    // `mock.calls[0][1]` is a type error rather than the assertion below.
    const disabledDate = vi.fn(
      (_date: Date, _info: { picking: "start" | "end"; start: Date | null }) => false
    );
    render(<RangePicker defaultValue={[MARCH, null]} disabledDate={disabledDate} />);
    await openPanel(user);
    // A minimum stay is only expressible if the predicate knows the anchor.
    expect(disabledDate.mock.calls[0]![1]).toEqual({ picking: "start", start: expect.any(Date) });

    await user.click(dayNamed(/March 10, 2026/));
    await waitFor(() => {
      const last = disabledDate.mock.calls.at(-1)![1] as { picking: string };
      expect(last.picking).toBe("end");
    });
  });

  it("reads a typed date into whichever field it was typed in", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangePicker onChange={onChange} />);
    await user.type(fields().start, "3/10/2026");
    await user.tab();
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(ymd((onChange.mock.calls[0]![0] as DateRangeTuple)[0]!)).toEqual([2026, 2, 10]);
  });

  it("reverts an unparseable entry rather than clearing", async () => {
    const user = userEvent.setup();
    render(<RangePicker defaultValue={[MARCH, null]} />);
    await user.clear(fields().start);
    await user.type(fields().start, "not a date");
    await user.tab();
    await waitFor(() => expect(fields().start).toHaveValue("Mar 15, 2026"));
  });

  it("clears both ends", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangePicker defaultValue={[MARCH, new Date(2026, 2, 20)]} onChange={onChange} />);
    await user.click(document.querySelector('[data-part="clear"]')!);
    expect(onChange).toHaveBeenCalledWith(null, ["", ""]);
    expect(fields().start).toHaveValue("");
    expect(fields().end).toHaveValue("");
    // The clear stops its own click reaching the trigger wrapper.
    expect(panel()).not.toBeInTheDocument();
  });

  it("hands the grid the keyboard on ArrowDown", async () => {
    const user = userEvent.setup();
    render(<RangePicker defaultValue={[MARCH, null]} />);
    fields().start.focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(panel()).toBeInTheDocument());
    await waitFor(() => expect(dayNamed(/March 15, 2026/)).toHaveFocus());
  });
});

type DateRangeTuple = [Date | null, Date | null];

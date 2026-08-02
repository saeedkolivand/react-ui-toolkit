import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigProvider } from "../config/config-provider";
import { enUS } from "../locale/en-US";
import { Calendar } from "./calendar";
import { DatePicker } from "./date-picker";

const withLocale = (tag: string, direction: "ltr" | "rtl", node: React.ReactNode) => (
  <ConfigProvider locale={{ ...enUS, tag }} direction={direction}>
    {node}
  </ConfigProvider>
);

const grid = () => screen.getByRole("grid");
const days = () => Array.from(document.querySelectorAll<HTMLElement>('[data-part="day"]'));
const dayNamed = (label: string | RegExp) => screen.getByRole("button", { name: label });
const title = () => document.querySelector('[data-scope="calendar"][data-part="title"]')!;

/** March 2026: a month that starts on a Sunday, so padding shows at both ends. */
const MARCH = new Date(2026, 2, 15);

describe("Calendar", () => {
  it("renders six whole weeks", () => {
    render(<Calendar defaultValue={MARCH} />);
    // Fixed at six rows so the panel does not resize between months — a picker
    // whose footer moves under the pointer is the thing this prevents.
    expect(within(grid()).getAllByRole("row")).toHaveLength(7); // 6 weeks + the header
    expect(days()).toHaveLength(42);
  });

  it("lines the weekday names up with the columns they head", () => {
    render(<Calendar defaultValue={MARCH} />);
    const headers = within(grid()).getAllByRole("columnheader");
    const firstRow = within(grid()).getAllByRole("row")[1]!;
    const firstCell = within(firstRow).getAllByRole("button")[0]!;

    // `getWeekdayNames` rotates by `weekStartsOn` and `getMonthGrid` starts the
    // grid on the same day — if the two ever disagree, every date in the
    // calendar sits under the wrong name and nothing else would notice.
    const name = firstCell.getAttribute("aria-label")!;
    expect(name.startsWith(headers[0]!.getAttribute("abbr")!)).toBe(true);
  });

  it("labels a Gregorian grid with Gregorian month names in every locale", () => {
    render(withLocale("fa-IR", "rtl", <Calendar defaultValue={MARCH} />));
    // fa-IR's own calendar is `persian`, so a bare `Intl.DateTimeFormat` would
    // name this month Esfand — against a grid that is Gregorian, off by about
    // ten days, with the header disagreeing with every cell under it.
    expect(title().textContent).toContain("مارس");
    expect(title().textContent).not.toContain("اسفند");
  });

  it("selects a day and reports the date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar defaultValue={MARCH} onChange={onChange} />);
    await user.click(dayNamed(/Tuesday, March 17, 2026/));
    expect(onChange).toHaveBeenCalledTimes(1);
    const picked = onChange.mock.calls[0]![0] as Date;
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 2, 17]);
  });

  it("moves with the arrows without selecting anything", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar defaultValue={MARCH} onChange={onChange} />);
    await user.click(dayNamed(/March 15, 2026/));
    onChange.mockClear();

    await user.keyboard("{ArrowRight}{ArrowDown}");
    // The cursor and the selection are separate. Committing on every arrow
    // would fire `onChange` six times crossing a week, and a form listening to
    // it would see six values nobody chose.
    expect(onChange).not.toHaveBeenCalled();
    expect(dayNamed(/March 23, 2026/)).toHaveFocus();
  });

  it("turns the page when the cursor leaves the month", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={new Date(2026, 2, 31)} />);
    await user.click(dayNamed(/March 31, 2026/));
    await user.keyboard("{ArrowRight}");
    // Otherwise the focused cell is one nobody can see.
    await waitFor(() => expect(title().textContent).toContain("April"));
  });

  it("pages by month with PageUp and PageDown", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={MARCH} />);
    await user.click(dayNamed(/March 15, 2026/));
    await user.keyboard("{PageUp}");
    await waitFor(() => expect(title().textContent).toContain("February"));
    await user.keyboard("{PageDown}{PageDown}");
    await waitFor(() => expect(title().textContent).toContain("April"));
  });

  it("reverses the horizontal arrows in RTL", async () => {
    const user = userEvent.setup();
    render(withLocale("en-US", "rtl", <Calendar defaultValue={MARCH} />));
    await user.click(dayNamed(/March 15, 2026/));
    // The grid runs right to left, so the key that points at the next cell is
    // the one that points at the previous day.
    await user.keyboard("{ArrowLeft}");
    expect(dayNamed(/March 16, 2026/)).toHaveFocus();
  });

  it("takes the direction from the document, not from a provider", async () => {
    const user = userEvent.setup();
    document.documentElement.dir = "rtl";
    try {
      // No `ConfigProvider` at all — a `dir` on `<html>` is how most consumers
      // set this, and it is what actually decides the column order. Reading the
      // context instead gave a mirrored grid whose ArrowLeft moved to the
      // PREVIOUS day whenever the two disagreed.
      render(<Calendar defaultValue={MARCH} />);
      await user.click(dayNamed(/March 15, 2026/));
      await user.keyboard("{ArrowLeft}");
      expect(dayNamed(/March 16, 2026/)).toHaveFocus();
    } finally {
      document.documentElement.dir = "";
    }
  });

  it("keeps a tab stop in the grid after the header pages", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={MARCH} />);
    await user.click(document.querySelector('[data-part="next-month"]')!);
    await waitFor(() => expect(title().textContent).toContain("April"));

    // The cursor defaults to the selected day, which is now in a month this
    // grid does not render — so without clamping it to what IS rendered, all 42
    // cells are `tabIndex={-1}`: Tab skips the grid entirely and the
    // ArrowDown handover has nothing to find.
    expect(days().filter(day => day.tabIndex === 0)).toHaveLength(1);
  });

  it("steps the header by month and by year", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={MARCH} />);
    await user.click(document.querySelector('[data-part="next-year"]')!);
    await waitFor(() => expect(title().textContent).toContain("2027"));
    await user.click(document.querySelector('[data-part="prev-month"]')!);
    await waitFor(() => expect(title().textContent).toContain("February"));
  });

  it("marks today, the selection and the padding days by presence", () => {
    render(<Calendar defaultValue={MARCH} />);
    const selected = dayNamed(/March 15, 2026/);
    expect(selected).toHaveAttribute("data-selected", "");
    // Presence, never `="false"` — `"false"` matches `[data-selected]` in CSS,
    // so every day in the month would be painted as the chosen one.
    expect(dayNamed(/March 16, 2026/)).not.toHaveAttribute("data-selected");
    expect(days().filter(day => day.hasAttribute("data-outside")).length).toBeGreaterThan(0);
  });

  it("disables the days a predicate rejects, from the pointer and the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Calendar
        defaultValue={MARCH}
        onChange={onChange}
        disabledDate={date => date.getDate() === 17}
      />
    );
    const blocked = dayNamed(/March 17, 2026/);
    expect(blocked).toHaveAttribute("aria-disabled", "true");
    expect(blocked).toHaveAttribute("data-disabled", "");
    // `aria-disabled`, NOT the `disabled` attribute: a disabled button cannot
    // take focus, so the roving tab stop could never land on one — and the
    // arrow that moved the cursor there would leave focus on the previous cell,
    // where the next Enter selects the wrong day.
    expect(blocked).not.toBeDisabled();

    await user.click(dayNamed(/March 16, 2026/));
    onChange.mockClear();
    await user.keyboard("{ArrowRight}");
    expect(blocked).toHaveFocus();

    await user.keyboard("{Enter}");
    // The cursor is allowed onto a disabled day — skipping it would make the
    // days past a long block unreachable — but activating it does nothing, by
    // either route: the key handler returns early and the click handler, which
    // Enter on a real button also fires, is guarded too.
    expect(onChange).not.toHaveBeenCalled();
    await user.click(blocked);
    expect(onChange).not.toHaveBeenCalled();
  });
});

const input = () => document.querySelector<HTMLInputElement>('[data-part="input"]')!;
const panel = () => document.querySelector('[data-scope="date-picker"][data-part="content"]');

describe("DatePicker", () => {
  it("renders nothing until the field is clicked", () => {
    render(<DatePicker />);
    expect(panel()).not.toBeInTheDocument();
  });

  it("opens on click, and a selection fills the field and closes it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker defaultValue={MARCH} onChange={onChange} />);
    await user.click(input());
    await waitFor(() => expect(panel()).toBeInTheDocument());

    await user.click(dayNamed(/March 20, 2026/));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![1]).toBe("Mar 20, 2026");
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    expect(input()).toHaveValue("Mar 20, 2026");
  });

  it("reads a typed date in the order the locale writes one", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(withLocale("de-DE", "ltr", <DatePicker onChange={onChange} />));
    await user.type(input(), "15.3.2026");
    await user.tab();
    // `01/02/2026` is January in the US and February nearly everywhere else, so
    // a picker that reached for `Date.parse` would silently pick one of them.
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const picked = onChange.mock.calls[0]![0] as Date;
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 2, 15]);
  });

  it("reverts an unparseable entry rather than clearing the field", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker defaultValue={MARCH} onChange={onChange} />);
    await user.clear(input());
    await user.type(input(), "not a date");
    await user.tab();
    // Someone who mistyped wants to see what they had, not an empty field.
    await waitFor(() => expect(input()).toHaveValue("Mar 15, 2026"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("refuses a typed date the predicate rejects", async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultValue={MARCH} disabledDate={date => date.getDate() === 17} />);
    await user.clear(input());
    await user.type(input(), "3/17/2026");
    await user.tab();
    // The grid will not offer it, so the field must not accept it either.
    await waitFor(() => expect(input()).toHaveValue("Mar 15, 2026"));
  });

  it("clears the value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker defaultValue={MARCH} onChange={onChange} />);
    await user.click(document.querySelector('[data-part="clear"]')!);
    expect(onChange).toHaveBeenCalledWith(null, "");
    expect(input()).toHaveValue("");
    // The clear stops its own click reaching the trigger wrapper, or it would
    // open the panel on the way out.
    expect(panel()).not.toBeInTheDocument();
  });

  it("hands the grid the keyboard on ArrowDown", async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultValue={MARCH} />);
    input().focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(panel()).toBeInTheDocument());
    // Focus does NOT move on open — the field is typed into — so this is the
    // one key that transfers it, and without it the portalled grid is
    // unreachable by keyboard entirely.
    await waitFor(() => expect(dayNamed(/March 15, 2026/)).toHaveFocus());
  });

  it("announces itself invalid when a form says so, not only on `status`", () => {
    render(<DatePicker aria-invalid />);
    // `Form.Item` binds a child by injecting exactly this. Declaring the prop
    // and not reading it left a picker in a form pointing at its error through
    // `aria-describedby` while never announcing itself invalid — which an
    // `Input` in the same form does.
    expect(input()).toHaveAttribute("aria-invalid", "true");
  });

  it("selects today from the footer", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await user.click(input());
    await waitFor(() => expect(panel()).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Today" }));

    const picked = onChange.mock.calls[0]![0] as Date;
    const now = new Date();
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ]);
  });
});

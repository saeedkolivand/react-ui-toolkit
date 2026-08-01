import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputNumber } from "./input-number";
import { Rate } from "./rate";
import { Slider } from "./slider";

const part = (scope: string, name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="${scope}"] [data-part="${name}"]`)!;
const parts = (scope: string, name: string) =>
  Array.from(
    document.querySelectorAll<HTMLElement>(`[data-scope="${scope}"] [data-part="${name}"]`)
  );

describe("Slider", () => {
  const thumb = () => screen.getByRole("slider");

  it("exposes its range and value", () => {
    render(<Slider min={0} max={200} defaultValue={50} />);
    expect(thumb()).toHaveAttribute("aria-valuemin", "0");
    expect(thumb()).toHaveAttribute("aria-valuemax", "200");
    expect(thumb()).toHaveAttribute("aria-valuenow", "50");
  });

  it("snaps a default that does not sit on a step", () => {
    // The value a consumer passes is not necessarily one the control can
    // represent, and reporting an unreachable number is worse than moving it.
    render(<Slider min={0} max={100} step={25} defaultValue={30} />);
    expect(thumb()).toHaveAttribute("aria-valuenow", "25");
  });

  it("moves by a step on the arrows", async () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={50} step={5} onChange={onChange} />);
    thumb().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(55);
    await userEvent.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenLastCalledWith(50);
  });

  it("jumps to the ends with Home and End", async () => {
    render(<Slider min={10} max={90} defaultValue={50} />);
    thumb().focus();
    await userEvent.keyboard("{End}");
    expect(thumb()).toHaveAttribute("aria-valuenow", "90");
    await userEvent.keyboard("{Home}");
    expect(thumb()).toHaveAttribute("aria-valuenow", "10");
  });

  it("stops at the ends rather than running past them", async () => {
    render(<Slider min={0} max={10} defaultValue={10} />);
    thumb().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(thumb()).toHaveAttribute("aria-valuenow", "10");
  });

  it("leaves a key it does not handle to the page", async () => {
    // `preventDefault` on everything would stop Tab leaving the control and
    // stop the page scrolling on Space.
    render(<Slider defaultValue={50} />);
    thumb().focus();
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    thumb().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("reports the completed value once, not on every move", async () => {
    const onChange = vi.fn();
    const onChangeComplete = vi.fn();
    render(<Slider defaultValue={50} onChange={onChange} onChangeComplete={onChangeComplete} />);
    thumb().focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    // Two moves, two `onChange` — and `onChangeComplete` is the one a caller
    // hangs a network request on, so it must not fire mid-drag.
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChangeComplete).toHaveBeenCalledTimes(2);
    expect(onChangeComplete).toHaveBeenLastCalledWith(52);
  });

  it("stays where a controlled value puts it", async () => {
    const onChange = vi.fn();
    // 20, not the default 0: a controlled value the uncontrolled path would
    // reach anyway proves nothing.
    render(<Slider value={20} onChange={onChange} />);
    thumb().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(21);
    expect(thumb()).toHaveAttribute("aria-valuenow", "20");
  });

  it("puts the fill fraction where CSS can read it", () => {
    render(<Slider min={0} max={200} defaultValue={50} />);
    const root = document.querySelector<HTMLElement>('[data-scope="slider"][data-part="root"]')!;
    expect(root.style.getPropertyValue("--ck-slider-filled")).toBe("0.25");
  });

  it("takes no focus and no keys when disabled", async () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={50} disabled onChange={onChange} />);
    expect(thumb()).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(thumb(), { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("marks each mark that the value has passed", () => {
    render(<Slider defaultValue={50} marks={[{ value: 25 }, { value: 75, label: "3/4" }]} />);
    const marks = parts("slider", "mark");
    expect(marks[0]!.getAttribute("data-active")).toBe("");
    expect(marks[1]!.hasAttribute("data-active")).toBe(false);
    expect(screen.getByText("3/4")).toBeInTheDocument();
  });

  it("has no tooltip unless asked", () => {
    render(<Slider defaultValue={50} />);
    expect(parts("slider", "tooltip")).toHaveLength(0);
  });

  it("renders a tooltip through a formatter", () => {
    render(<Slider defaultValue={50} tooltip={value => `${value}%`} />);
    expect(part("slider", "tooltip")).toHaveTextContent("50%");
  });
});

describe("InputNumber", () => {
  const field = () => screen.getByRole("spinbutton");

  it("starts empty rather than at zero", () => {
    // `null` and `0` are different answers, and a field that pre-fills a zero
    // makes "not answered" impossible to express.
    render(<InputNumber />);
    expect(field()).toHaveValue("");
  });

  it("reports null when the field is cleared", async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={5} onChange={onChange} />);
    await userEvent.clear(field());
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("lets a value be typed through without reformatting mid-keystroke", async () => {
    const onChange = vi.fn();
    render(<InputNumber max={100} onChange={onChange} />);
    await userEvent.type(field(), "50");
    // Clamping on each keystroke turns "5" into the max as soon as someone
    // starts typing "50", and reformatting moves the caret out from under them.
    expect(field()).toHaveValue("50");
    expect(onChange).toHaveBeenLastCalledWith(50);
  });

  it("clamps and snaps on blur, not while typing", async () => {
    const onChange = vi.fn();
    render(<InputNumber max={10} step={1} onChange={onChange} />);
    await userEvent.type(field(), "99");
    expect(onChange).toHaveBeenLastCalledWith(99);
    await userEvent.tab();
    expect(onChange).toHaveBeenLastCalledWith(10);
    expect(field()).toHaveValue("10");
  });

  it("steps on the arrows", async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={5} step={0.5} onChange={onChange} />);
    field().focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenLastCalledWith(5.5);
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(onChange).toHaveBeenLastCalledWith(4.5);
  });

  it("leaves Home and End to the caret", async () => {
    // In a text field those move the caret. Stealing them would make a long
    // number impossible to edit from the front.
    render(<InputNumber defaultValue={5} />);
    field().focus();
    const event = new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true });
    field().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("steps from a sensible place when the field is empty", async () => {
    const onChange = vi.fn();
    render(<InputNumber min={3} onChange={onChange} />);
    field().focus();
    await userEvent.keyboard("{ArrowUp}");
    // Not from zero, which is outside the range — from the nearest value in it.
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("shows the precision the step implies", async () => {
    render(<InputNumber defaultValue={5} step={0.25} />);
    expect(field()).toHaveValue("5.00");
  });

  it("takes an explicit precision over the step's", () => {
    render(<InputNumber defaultValue={5} step={1} precision={2} />);
    expect(field()).toHaveValue("5.00");
  });

  it("disables the control at the end of its range", () => {
    render(<InputNumber value={10} max={10} />);
    expect(part("input-number", "increment")).toBeDisabled();
    expect(part("input-number", "decrement")).not.toBeDisabled();
  });

  it("keeps the spinner buttons out of the tab order", () => {
    // Tab should land on the field once, not three times: the arrows already
    // do what the buttons do.
    render(<InputNumber defaultValue={1} />);
    expect(part("input-number", "increment")).toHaveAttribute("tabindex", "-1");
    expect(part("input-number", "decrement")).toHaveAttribute("tabindex", "-1");
  });

  it("hides the controls when asked", () => {
    render(<InputNumber defaultValue={1} controls={false} />);
    expect(parts("input-number", "controls")).toHaveLength(0);
  });
});

describe("Rate", () => {
  const stars = () => parts("rate", "star");
  const widget = () => screen.getByRole("slider");

  it("renders the requested number of symbols", () => {
    render(<Rate count={7} />);
    expect(stars()).toHaveLength(7);
  });

  it("fills up to the value", () => {
    render(<Rate defaultValue={3} />);
    expect(stars().map(s => s.hasAttribute("data-full"))).toEqual([true, true, true, false, false]);
  });

  it("marks a half symbol as half, not full", () => {
    render(<Rate defaultValue={2.5} allowHalf />);
    const marks = stars().map(s =>
      s.hasAttribute("data-full") ? "full" : s.hasAttribute("data-half") ? "half" : "empty"
    );
    expect(marks).toEqual(["full", "full", "half", "empty", "empty"]);
  });

  it("moves by a whole symbol on the arrows", async () => {
    const onChange = vi.fn();
    render(<Rate defaultValue={2} onChange={onChange} />);
    widget().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it("moves by a half when halves are allowed", async () => {
    const onChange = vi.fn();
    render(<Rate defaultValue={2} allowHalf onChange={onChange} />);
    widget().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(2.5);
  });

  it("does not jump ten symbols on Page", async () => {
    const onChange = vi.fn();
    render(<Rate defaultValue={2} onChange={onChange} />);
    widget().focus();
    await userEvent.keyboard("{PageUp}");
    // A five-symbol rate has nothing for a ten-step jump to do, so Page moves
    // one — which is also what End would do from here otherwise.
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it("clears when the current value is clicked again", async () => {
    const onChange = vi.fn();
    render(<Rate defaultValue={3} onChange={onChange} />);
    await userEvent.click(stars()[2]!);
    // The only way back to zero with a pointer: there is no symbol to the left
    // of the first one.
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("does not clear when clearing is off", async () => {
    const onChange = vi.fn();
    render(<Rate defaultValue={3} allowClear={false} onChange={onChange} />);
    await userEvent.click(stars()[2]!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("previews on hover and restores on leave", async () => {
    const onHoverChange = vi.fn();
    render(<Rate defaultValue={1} onHoverChange={onHoverChange} />);
    fireEvent.mouseMove(stars()[3]!);
    expect(onHoverChange).toHaveBeenLastCalledWith(4);
    expect(stars()[3]!.getAttribute("data-full")).toBe("");

    fireEvent.mouseLeave(widget());
    // Restores the value rather than committing the preview — a pointer that
    // passes over a rate must not change it.
    expect(onHoverChange).toHaveBeenLastCalledWith(undefined);
    expect(stars()[3]!.hasAttribute("data-full")).toBe(false);
    expect(stars()[0]!.getAttribute("data-full")).toBe("");
  });

  it("reads out the label rather than only the number", () => {
    render(<Rate defaultValue={3} tooltips={["Awful", "Poor", "Fair", "Good", "Great"]} />);
    // "3" alone says nothing about what three means.
    expect(widget()).toHaveAttribute("aria-valuetext", "Fair");
  });

  it("takes no focus and no input when disabled", async () => {
    const onChange = vi.fn();
    render(<Rate defaultValue={2} disabled onChange={onChange} />);
    expect(widget()).toHaveAttribute("tabindex", "-1");
    await userEvent.click(stars()[4]!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("stays where a controlled value puts it", async () => {
    const onChange = vi.fn();
    render(<Rate value={4} onChange={onChange} />);
    await userEvent.click(stars()[1]!);
    expect(onChange).toHaveBeenCalledWith(2);
    // Read from the value, not the symbols: the pointer is still sitting on
    // the second symbol after the click, so the *preview* correctly shows two.
    // Asserting the fill here would be asserting the hover, not the control.
    expect(widget()).toHaveAttribute("aria-valuenow", "4");
  });

  it("renders a custom character per position", () => {
    render(<Rate count={3} character={index => <span>{index}</span>} />);
    // Two layers per symbol — a base and a clipped fill — so three symbols is
    // six characters.
    expect(screen.getAllByText("1")).toHaveLength(2);
  });
});

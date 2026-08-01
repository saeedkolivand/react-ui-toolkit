import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigProvider } from "../config/config-provider";
import { enUS } from "../locale/en-US";
import { Descriptions } from "./descriptions";
import { List } from "./list";
import { Pagination } from "./pagination";
import { Statistic } from "./statistic";

const parts = (scope: string, name: string) =>
  Array.from(
    document.querySelectorAll<HTMLElement>(`[data-scope="${scope}"] [data-part="${name}"]`)
  );
const part = (scope: string, name: string) => parts(scope, name)[0];

/**
 * A List's own rows, not everything named `item` beneath it.
 *
 * A List renders a Pagination, and Pagination has an `item` part too — so the
 * loose descendant form counts three page buttons as rows. The stylesheet had
 * the same bug, and this is the selector that found it.
 */
const rows = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-scope="list"][data-part="root"] > [data-part="list"] > [data-part="item"]'
    )
  );

describe("Statistic", () => {
  it("groups a number the way the locale does", () => {
    render(<Statistic value={1234567.5} />);
    expect(part("statistic", "number")).toHaveTextContent("1,234,567.5");
  });

  it("follows the locale rather than a separator prop", () => {
    // `Intl` is why there is no `groupSeparator`/`decimalSeparator` pair: a
    // German reader gets 1.234.567,5 from the same call, which two props can
    // only approximate one locale at a time.
    render(
      <ConfigProvider locale={{ ...enUS, tag: "de-DE" }}>
        <Statistic value={1234567.5} />
      </ConfigProvider>
    );
    expect(part("statistic", "number")).toHaveTextContent("1.234.567,5");
  });

  it("pads and rounds to the requested precision", () => {
    render(<Statistic value={12.3} precision={3} />);
    expect(part("statistic", "number")).toHaveTextContent("12.300");
  });

  it("leaves a string value alone", () => {
    // A string is already formatted by whoever produced it — reformatting it
    // would mean parsing it back out first, and guessing at its locale.
    render(<Statistic value="1.2.3" />);
    expect(part("statistic", "number")).toHaveTextContent("1.2.3");
  });

  it("hands the whole job to a formatter when one is given", () => {
    render(<Statistic value={1234} formatter={value => `~${value}`} />);
    expect(part("statistic", "number")).toHaveTextContent("~1234");
  });

  it("keeps prefix and suffix out of the number", () => {
    render(<Statistic value={99} prefix="$" suffix="/mo" />);
    expect(part("statistic", "prefix")).toHaveTextContent("$");
    expect(part("statistic", "number")).toHaveTextContent("99");
    expect(part("statistic", "suffix")).toHaveTextContent("/mo");
  });

  it("has no affix boxes when there are no affixes", () => {
    render(<Statistic value={99} />);
    expect(parts("statistic", "prefix")).toHaveLength(0);
    expect(parts("statistic", "suffix")).toHaveLength(0);
  });

  it("shows a spinner instead of the value while loading", () => {
    render(<Statistic value={99} loading />);
    expect(parts("statistic", "value")).toHaveLength(0);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

const ITEMS = [
  { label: "Name", children: "Ada" },
  { label: "Role", children: "Engineer" },
  { label: "Bio", children: "Long", span: 3 },
];

describe("Descriptions", () => {
  it("pairs each label with its content in a description list", () => {
    render(<Descriptions items={ITEMS} />);
    const list = part("descriptions", "list")!;
    expect(list.tagName).toBe("DL");
    expect(parts("descriptions", "label")).toHaveLength(3);
    expect(parts("descriptions", "content")).toHaveLength(3);
    expect(parts("descriptions", "label")[0]!.tagName).toBe("DT");
    expect(parts("descriptions", "content")[0]!.tagName).toBe("DD");
  });

  it("counts a horizontal span in grid tracks, label included", () => {
    render(<Descriptions items={ITEMS} column={3} />);
    // One item is two tracks side by side, so an item spanning 3 covers 6 and
    // the content takes the 5 the label leaves. Counting it as 6 would push
    // the row one track wide and misalign every row under it.
    expect(
      parts("descriptions", "content")[2]!.style.getPropertyValue("--ck-descriptions-span")
    ).toBe("5");
    expect(
      parts("descriptions", "label")[2]!.style.getPropertyValue("--ck-descriptions-span")
    ).toBe("");
  });

  it("counts a vertical span in items, because the pair is stacked", () => {
    render(<Descriptions items={ITEMS} column={3} layout="vertical" />);
    // On the pair, not on either half: the wrapper is the grid item in this
    // layout, and the label and value stack inside it.
    expect(parts("descriptions", "pair")[2]!.style.getPropertyValue("--ck-descriptions-span")).toBe(
      "3"
    );
    expect(
      parts("descriptions", "content")[2]!.style.getPropertyValue("--ck-descriptions-span")
    ).toBe("");
  });

  it("leaves the pair wrapper out of the grid in the horizontal layout", () => {
    render(<Descriptions items={ITEMS} column={3} />);
    // `display: contents` in CSS, so no span here — the value carries it, and
    // a span on both would consume the row twice.
    expect(parts("descriptions", "pair")[2]!.style.getPropertyValue("--ck-descriptions-span")).toBe(
      ""
    );
  });

  it("clamps a span wider than the row", () => {
    // Unclamped, the grid adds a column for this one item and every row below
    // it loses its alignment.
    render(<Descriptions items={[{ label: "a", children: "b", span: 99 }]} column={2} />);
    expect(part("descriptions", "content")!.style.getPropertyValue("--ck-descriptions-span")).toBe(
      "3"
    );
  });

  it("puts the column count where the grid can read it", () => {
    render(<Descriptions items={ITEMS} column={4} />);
    expect(part("descriptions", "list")!.style.getPropertyValue("--ck-descriptions-columns")).toBe(
      "4"
    );
  });

  it("adds a colon only where one makes sense", () => {
    const root = () => document.querySelector('[data-scope="descriptions"]')!;
    const { unmount } = render(<Descriptions items={ITEMS} />);
    expect(root().getAttribute("data-colon")).toBe("");
    unmount();

    // A vertical layout puts the label on its own line and a bordered one puts
    // it in its own cell; a trailing colon reads as a typo in both.
    render(<Descriptions items={ITEMS} layout="vertical" />);
    expect(root().hasAttribute("data-colon")).toBe(false);
    unmount();
  });

  it("drops the colon for a bordered layout too", () => {
    render(<Descriptions items={ITEMS} bordered />);
    const root = document.querySelector('[data-scope="descriptions"]')!;
    expect(root.hasAttribute("data-colon")).toBe(false);
    expect(root.getAttribute("data-bordered")).toBe("");
  });

  it("has no header when there is neither a title nor extra", () => {
    render(<Descriptions items={ITEMS} />);
    expect(parts("descriptions", "header")).toHaveLength(0);
  });

  it("renders a header for either one alone", () => {
    render(<Descriptions items={ITEMS} extra={<button type="button">Edit</button>} />);
    expect(parts("descriptions", "header")).toHaveLength(1);
    expect(parts("descriptions", "title")).toHaveLength(0);
  });
});

describe("Pagination", () => {
  const pageButtons = () => parts("pagination", "item").map(button => button.textContent);

  it("derives the page count from items and page size", () => {
    render(<Pagination total={95} pageSize={10} />);
    // `getPageWindow` is core's, shared with Table: first, last, current and
    // one sibling either side. On page one that is 1, 2, gap, 10.
    expect(pageButtons()).toEqual(["1", "2", "10"]);
  });

  it("says which page you are on", () => {
    render(<Pagination total={95} pageSize={10} defaultCurrent={3} />);
    const current = parts("pagination", "item").filter(
      button => button.getAttribute("aria-current") === "page"
    );
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("3");
  });

  it("hides the ellipsis from assistive tech", () => {
    render(<Pagination total={200} pageSize={10} defaultCurrent={5} />);
    // A gap in a sequence, not a control. "Ellipsis" read out between two page
    // numbers is noise, and it is not something you can go to.
    expect(part("pagination", "ellipsis")).toHaveAttribute("aria-hidden", "true");
    expect(part("pagination", "ellipsis")!.tagName).not.toBe("BUTTON");
  });

  it("disables prev on the first page and next on the last", async () => {
    render(<Pagination total={30} pageSize={10} />);
    expect(part("pagination", "prev")).toBeDisabled();
    expect(part("pagination", "next")).not.toBeDisabled();
    await userEvent.click(part("pagination", "next")!);
    await userEvent.click(part("pagination", "next")!);
    expect(part("pagination", "next")).toBeDisabled();
    expect(part("pagination", "prev")).not.toBeDisabled();
  });

  it("reports the page and the size together", async () => {
    const onChange = vi.fn();
    render(<Pagination total={30} pageSize={10} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onChange).toHaveBeenCalledWith(2, 10);
  });

  it("clamps a current page stranded past the end by a smaller total", () => {
    const { rerender } = render(<Pagination total={100} pageSize={10} current={9} />);
    expect(parts("pagination", "item").some(b => b.getAttribute("aria-current") === "page")).toBe(
      true
    );
    // `total` is a prop, so it can shrink without anything calling `go`. An
    // unclamped page renders a window with no page marked current at all.
    rerender(<Pagination total={20} pageSize={10} current={9} />);
    const current = parts("pagination", "item").filter(
      b => b.getAttribute("aria-current") === "page"
    );
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("2");
  });

  it("renders nothing for a single page when asked", () => {
    render(<Pagination total={5} pageSize={10} hideOnSinglePage />);
    expect(document.querySelector('[data-scope="pagination"]')).toBeNull();
  });

  it("still renders a single page by default", () => {
    render(<Pagination total={5} pageSize={10} />);
    expect(document.querySelector('[data-scope="pagination"]')).not.toBeNull();
  });

  it("gives the size changer an accessible name", async () => {
    render(<Pagination total={100} showSizeChanger />);
    // `Select`'s `...rest` feeds `useAnchored` rather than the DOM, so an
    // `aria-label` passed to it vanishes with a clean typecheck. The name comes
    // from its own `label`, hidden visually rather than removed.
    expect(screen.getByRole("combobox")).toHaveAccessibleName(enUS.Pagination.perPage);
  });

  it("shows a page size that is not one of the offered options", () => {
    render(<Pagination total={240} pageSize={25} showSizeChanger />);
    // `Select` resolves its display text by looking the value up in `options`,
    // so a size outside `pageSizeOptions` renders the placeholder while the
    // list pages by 25 — the control disagrees with the thing it controls.
    expect(screen.getByRole("combobox")).toHaveTextContent("25");
  });

  it("slots the current size into the offered ones in order", async () => {
    render(<Pagination total={240} pageSize={25} showSizeChanger />);
    await userEvent.click(screen.getByRole("combobox"));
    const offered = screen.getAllByRole("option").map(option => option.textContent);
    // Appended rather than sorted in, the list would read 10, 20, 50, 100, 25.
    expect(offered.map(label => Number.parseInt(label ?? "", 10))).toEqual([10, 20, 25, 50, 100]);
  });

  it("returns to the first page when the size changes", async () => {
    const onChange = vi.fn();
    render(<Pagination total={240} defaultCurrent={9} showSizeChanger onChange={onChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: /^50 \// }));
    // Page 9 of 24 is page 3 of 5 at the bigger size, and there is no honest
    // way to say which row you were looking at. Landing past the end is worse.
    expect(onChange).toHaveBeenCalledWith(1, 50);
  });

  it("jumps on Enter and clears itself", async () => {
    const onChange = vi.fn();
    render(<Pagination total={200} pageSize={10} showQuickJumper onChange={onChange} />);
    const input = part("pagination", "jumper-input") as HTMLInputElement;
    await userEvent.type(input, "7{Enter}");
    expect(onChange).toHaveBeenCalledWith(7, 10);
    expect(input.value).toBe("");
  });

  it("ignores a jump that is not a number", async () => {
    const onChange = vi.fn();
    render(<Pagination total={200} pageSize={10} showQuickJumper onChange={onChange} />);
    await userEvent.type(part("pagination", "jumper-input")!, "abc{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clamps a jump past the end rather than going nowhere", async () => {
    const onChange = vi.fn();
    render(<Pagination total={30} pageSize={10} showQuickJumper onChange={onChange} />);
    await userEvent.type(part("pagination", "jumper-input")!, "99{Enter}");
    expect(onChange).toHaveBeenCalledWith(3, 10);
  });

  it("reports the range for a total renderer", () => {
    render(
      <Pagination
        total={240}
        pageSize={10}
        defaultCurrent={3}
        showTotal={(total, [from, to]) => `${from}-${to} of ${total}`}
      />
    );
    expect(part("pagination", "total")).toHaveTextContent("21-30 of 240");
  });

  it("reports an empty range for an empty total", () => {
    render(<Pagination total={0} showTotal={(t, [from, to]) => `${from}-${to} of ${t}`} />);
    // Not "1-0 of 0": there is no first row to be on.
    expect(part("pagination", "total")).toHaveTextContent("0-0 of 0");
  });
});

const ROWS = Array.from({ length: 7 }, (_, index) => ({ id: `r${index}`, name: `Row ${index}` }));

describe("List", () => {
  const render7 = (props: Record<string, unknown> = {}) =>
    render(
      <List
        dataSource={ROWS}
        rowKey={row => row.id}
        renderItem={row => <span>{row.name}</span>}
        {...props}
      />
    );

  it("renders every row when there is no pagination", () => {
    render7();
    expect(rows()).toHaveLength(7);
  });

  it("slices to the page rather than making the caller do it", () => {
    render7({ pagination: { pageSize: 3 } });
    expect(rows()).toHaveLength(3);
    expect(screen.getByText("Row 0")).toBeInTheDocument();
    expect(screen.queryByText("Row 3")).not.toBeInTheDocument();
  });

  it("moves the slice with the page", async () => {
    render7({ pagination: { pageSize: 3 } });
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("Row 3")).toBeInTheDocument();
    expect(screen.queryByText("Row 0")).not.toBeInTheDocument();
  });

  it("pages against the whole source, not the visible slice", () => {
    render7({ pagination: { pageSize: 3 } });
    // Passing the sliced length would make the pagination one page long and
    // there would be no way to reach the rest.
    expect(parts("pagination", "item").map(b => b.textContent)).toEqual(["1", "2", "3"]);
  });

  it("keeps a size the user picked through its own size changer", async () => {
    const onChange = vi.fn();
    render7({
      pagination: { pageSize: undefined, defaultPageSize: 3, showSizeChanger: true, onChange },
    });
    expect(rows()).toHaveLength(3);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: /^10 \// }));

    // `pagination` is typed to accept `showSizeChanger`, so offering a control
    // that reports the change and then snaps back is worse than not offering
    // it — List has to keep the size, not only forward it.
    expect(onChange).toHaveBeenCalledWith(1, 10);
    expect(rows()).toHaveLength(7);
  });

  it("clamps a page stranded past the end by a shrinking source", () => {
    const { rerender } = render(
      <List
        dataSource={ROWS}
        rowKey={row => row.id}
        renderItem={row => <span>{row.name}</span>}
        pagination={{ pageSize: 3, current: 3 }}
      />
    );
    expect(rows()).toHaveLength(1);

    // `dataSource` is a prop and can shrink under the page. Pagination clamps
    // on read *for display*, so the bar shows a page it was not given and the
    // list slices an empty range — 0 rows, no `Empty`, and nothing saying why.
    rerender(
      <List
        dataSource={ROWS.slice(0, 2)}
        rowKey={row => row.id}
        renderItem={row => <span>{row.name}</span>}
        pagination={{ pageSize: 3, current: 3 }}
      />
    );
    expect(rows()).toHaveLength(2);
  });

  it("shows an Empty for an empty source", () => {
    render(<List dataSource={[]} renderItem={() => null} />);
    expect(document.querySelector('[data-scope="empty"]')).not.toBeNull();
    expect(parts("list", "list")).toHaveLength(0);
  });

  it("takes an explicit emptyText over the illustration", () => {
    render(<List dataSource={[]} renderItem={() => null} emptyText="Nothing yet" />);
    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
    expect(document.querySelector('[data-scope="empty"]')).toBeNull();
  });

  it("shows nothing at all for emptyText={null}", () => {
    render(<List dataSource={[]} renderItem={() => null} emptyText={null} />);
    expect(document.querySelector('[data-scope="empty"]')).toBeNull();
    expect(parts("list", "empty")).toHaveLength(0);
  });

  it("hides the pagination when there is nothing to page", () => {
    render(<List dataSource={[]} renderItem={() => null} pagination={{ pageSize: 3 }} />);
    expect(document.querySelector('[data-scope="pagination"]')).toBeNull();
  });

  it("shows a spinner rather than an empty state while loading", () => {
    render(<List dataSource={[]} renderItem={() => null} loading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(document.querySelector('[data-scope="empty"]')).toBeNull();
  });

  it("keys rows from rowKey so a reorder moves them", () => {
    const { rerender } = render(
      <List
        dataSource={[ROWS[0]!, ROWS[1]!]}
        rowKey={row => row.id}
        renderItem={row => <input defaultValue={row.name} data-testid={row.id} />}
      />
    );
    const first = screen.getByTestId("r0");
    rerender(
      <List
        dataSource={[ROWS[1]!, ROWS[0]!]}
        rowKey={row => row.id}
        renderItem={row => <input defaultValue={row.name} data-testid={row.id} />}
      />
    );
    expect(screen.getByTestId("r0")).toBe(first);
  });

  it("renders header and footer only when given", () => {
    render7({ header: "Head", footer: "Foot" });
    expect(parts("list", "header")).toHaveLength(1);
    expect(parts("list", "footer")).toHaveLength(1);
  });

  it("has neither when they are not", () => {
    render7();
    expect(parts("list", "header")).toHaveLength(0);
    expect(parts("list", "footer")).toHaveLength(0);
  });

  it("marks its layout flags as presence attributes", () => {
    render7({ bordered: true });
    const root = document.querySelector('[data-scope="list"][data-part="root"]')!;
    expect(root.getAttribute("data-bordered")).toBe("");
    expect(root.getAttribute("data-split")).toBe("");
  });

  it("omits split entirely when off", () => {
    // Not `data-split="false"` — `[data-split]` matches that string, so every
    // list would draw rules whatever the prop said.
    render7({ split: false });
    const root = document.querySelector('[data-scope="list"][data-part="root"]')!;
    expect(root.hasAttribute("data-split")).toBe(false);
    expect(root.hasAttribute("data-bordered")).toBe(false);
  });

  it("renders a row through List.Item and its Meta", () => {
    render(
      <List
        dataSource={[ROWS[0]!]}
        rowKey={row => row.id}
        renderItem={row => (
          <List.Item
            actions={[
              <button key="e" type="button">
                Edit
              </button>,
            ]}
          >
            <List.Item.Meta title={row.name} description="A row" avatar={<span>A</span>} />
          </List.Item>
        )}
      />
    );
    expect(part("list", "meta-title")).toHaveTextContent("Row 0");
    expect(part("list", "meta-description")).toHaveTextContent("A row");
    expect(parts("list", "action")).toHaveLength(1);
  });

  it("has no actions list when a row has no actions", () => {
    render(
      <List
        dataSource={[ROWS[0]!]}
        rowKey={row => row.id}
        renderItem={row => <List.Item>{row.name}</List.Item>}
      />
    );
    expect(parts("list", "actions")).toHaveLength(0);
  });
});

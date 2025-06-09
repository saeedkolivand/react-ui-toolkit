import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";
import { Accordion } from "./Accordion";

describe("Accordion", () => {
  const defaultItems = [
    {
      title: "Section 1",
      content: "Content 1",
    },
    {
      title: "Section 2",
      content: "Content 2",
    },
    {
      title: "Section 3",
      content: "Content 3",
    },
  ];

  it("renders all sections", () => {
    render(<Accordion items={defaultItems} />);

    defaultItems.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("expands and collapses panels on click", async () => {
    render(<Accordion items={defaultItems} />);

    const firstPanel = screen.getByText("Section 1");
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();

    fireEvent.click(firstPanel);
    expect(await screen.findByText("Content 1")).toBeInTheDocument();

    fireEvent.click(firstPanel);
    await waitFor(() => {
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });
  });

  it("allows only one panel to be expanded at a time by default", async () => {
    render(<Accordion items={defaultItems} />);

    const firstPanel = screen.getByText("Section 1");
    const secondPanel = screen.getByText("Section 2");

    fireEvent.click(firstPanel);
    expect(await screen.findByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();

    fireEvent.click(secondPanel);
    await waitFor(() => {
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });
    expect(await screen.findByText("Content 2")).toBeInTheDocument();
  });

  it("allows multiple panels to be expanded when allowMultiple is true", async () => {
    render(<Accordion items={defaultItems} allowMultiple />);

    const firstPanel = screen.getByText("Section 1");
    const secondPanel = screen.getByText("Section 2");

    fireEvent.click(firstPanel);
    fireEvent.click(secondPanel);

    expect(await screen.findByText("Content 1")).toBeInTheDocument();
    expect(await screen.findByText("Content 2")).toBeInTheDocument();
  });

  it("respects defaultExpanded prop for single panel", async () => {
    render(<Accordion items={defaultItems} defaultExpanded={1} />);

    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    expect(await screen.findByText("Content 2")).toBeInTheDocument();
  });

  it("respects defaultExpanded prop for multiple panels", async () => {
    render(<Accordion items={defaultItems} allowMultiple defaultExpanded={[0, 2]} />);

    expect(await screen.findByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    expect(await screen.findByText("Content 3")).toBeInTheDocument();
  });

  it("does not expand disabled panels", async () => {
    const itemsWithDisabled = [
      ...defaultItems.slice(0, 1),
      {
        title: "Disabled Section",
        content: "Disabled Content",
        disabled: true,
      },
      ...defaultItems.slice(2),
    ];

    render(<Accordion items={itemsWithDisabled} />);

    const disabledPanel = screen.getByText("Disabled Section");
    fireEvent.click(disabledPanel);

    await waitFor(() => {
      expect(screen.queryByText("Disabled Content")).not.toBeInTheDocument();
    });
  });

  it("renders rich content in panels", async () => {
    const richItems = [
      {
        title: <div data-testid="rich-title">Rich Title</div>,
        content: <div data-testid="rich-content">Rich Content</div>,
      },
    ];

    render(<Accordion items={richItems} />);

    expect(screen.getByTestId("rich-title")).toBeInTheDocument();

    const richTitle = screen.getByTestId("rich-title");
    fireEvent.click(richTitle);

    expect(await screen.findByTestId("rich-content")).toBeVisible();
  });
});

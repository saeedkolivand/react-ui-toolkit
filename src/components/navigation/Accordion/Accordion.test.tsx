import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  const defaultItems = [
    {
      title: 'Section 1',
      content: 'Content 1',
    },
    {
      title: 'Section 2',
      content: 'Content 2',
    },
    {
      title: 'Section 3',
      content: 'Content 3',
    },
  ];

  it('renders all sections', () => {
    render(<Accordion items={defaultItems} />);

    defaultItems.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it('expands and collapses panels on click', () => {
    render(<Accordion items={defaultItems} />);

    const firstPanel = screen.getByText('Section 1');
    const firstContent = screen.getByText('Content 1');

    expect(firstContent).not.toBeVisible();
    fireEvent.click(firstPanel);
    expect(firstContent).toBeVisible();
    fireEvent.click(firstPanel);
    expect(firstContent).not.toBeVisible();
  });

  it('allows only one panel to be expanded at a time by default', () => {
    render(<Accordion items={defaultItems} />);

    const firstPanel = screen.getByText('Section 1');
    const secondPanel = screen.getByText('Section 2');
    const firstContent = screen.getByText('Content 1');
    const secondContent = screen.getByText('Content 2');

    fireEvent.click(firstPanel);
    expect(firstContent).toBeVisible();
    expect(secondContent).not.toBeVisible();

    fireEvent.click(secondPanel);
    expect(firstContent).not.toBeVisible();
    expect(secondContent).toBeVisible();
  });

  it('allows multiple panels to be expanded when allowMultiple is true', () => {
    render(<Accordion items={defaultItems} allowMultiple />);

    const firstPanel = screen.getByText('Section 1');
    const secondPanel = screen.getByText('Section 2');
    const firstContent = screen.getByText('Content 1');
    const secondContent = screen.getByText('Content 2');

    fireEvent.click(firstPanel);
    fireEvent.click(secondPanel);

    expect(firstContent).toBeVisible();
    expect(secondContent).toBeVisible();
  });

  it('respects defaultExpanded prop for single panel', () => {
    render(<Accordion items={defaultItems} defaultExpanded={1} />);

    const firstContent = screen.getByText('Content 1');
    const secondContent = screen.getByText('Content 2');

    expect(firstContent).not.toBeVisible();
    expect(secondContent).toBeVisible();
  });

  it('respects defaultExpanded prop for multiple panels', () => {
    render(<Accordion items={defaultItems} allowMultiple defaultExpanded={[0, 2]} />);

    const firstContent = screen.getByText('Content 1');
    const secondContent = screen.getByText('Content 2');
    const thirdContent = screen.getByText('Content 3');

    expect(firstContent).toBeVisible();
    expect(secondContent).not.toBeVisible();
    expect(thirdContent).toBeVisible();
  });

  it('does not expand disabled panels', () => {
    const itemsWithDisabled = [
      ...defaultItems.slice(0, 1),
      {
        title: 'Disabled Section',
        content: 'Disabled Content',
        disabled: true,
      },
      ...defaultItems.slice(2),
    ];

    render(<Accordion items={itemsWithDisabled} />);

    const disabledPanel = screen.getByText('Disabled Section');
    const disabledContent = screen.getByText('Disabled Content');

    fireEvent.click(disabledPanel);
    expect(disabledContent).not.toBeVisible();
  });

  it('renders rich content in panels', () => {
    const richItems = [
      {
        title: <div data-testid="rich-title">Rich Title</div>,
        content: <div data-testid="rich-content">Rich Content</div>,
      },
    ];

    render(<Accordion items={richItems} />);

    expect(screen.getByTestId('rich-title')).toBeInTheDocument();

    const richTitle = screen.getByTestId('rich-title');
    fireEvent.click(richTitle);

    expect(screen.getByTestId('rich-content')).toBeVisible();
  });
});

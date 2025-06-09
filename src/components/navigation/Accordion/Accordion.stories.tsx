import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Navigation/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Array of accordion items",
    },
    defaultExpanded: {
      control: "number",
      description: "Index of the item to be open by default",
    },
    allowMultiple: {
      control: "boolean",
      description: "Whether multiple items can be open at once",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const defaultItems = [
  {
    title: "What is React?",
    content:
      "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.",
  },
  {
    title: "What is TypeScript?",
    content:
      "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
  },
  {
    title: "What is Tailwind CSS?",
    content:
      "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const DefaultOpen: Story = {
  args: {
    items: defaultItems,
    defaultExpanded: 0,
  },
};

export const AllowMultiple: Story = {
  args: {
    items: defaultItems,
    allowMultiple: true,
  },
};

export const CustomContent: Story = {
  args: {
    items: [
      {
        title: "Custom Styled Content",
        content: (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Custom Content</h3>
            <p className="text-gray-600">
              This is an example of custom content in an accordion item. You can put any React
              component here.
            </p>
            <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Click me
            </button>
          </div>
        ),
      },
      {
        title: "Another Custom Item",
        content: (
          <div className="p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc list-inside">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
        ),
      },
    ],
  },
};

export const WithDisabledPanel: Story = {
  args: {
    items: [
      ...defaultItems.slice(0, 1),
      {
        title: "Disabled Section",
        content: "This section cannot be expanded because it is disabled.",
        disabled: true,
      },
      ...defaultItems.slice(2),
    ],
  },
};

export const WithRichContent: Story = {
  args: {
    items: [
      {
        title: (
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Rich Title with Icon</span>
          </div>
        ),
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rich Content Example</h3>
            <p>This panel contains formatted content with multiple elements.</p>
            <ul className="list-disc list-inside">
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Action Button
            </button>
          </div>
        ),
      },
      {
        title: "Regular Section",
        content: "This is a regular section for comparison.",
      },
    ],
  },
};

export const WithLongContent: Story = {
  args: {
    items: [
      {
        title: "Long Content Section",
        content: (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <p key={i} className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            ))}
          </div>
        ),
      },
      ...defaultItems.slice(1),
    ],
  },
};

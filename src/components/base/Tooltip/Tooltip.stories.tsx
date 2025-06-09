import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Base/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    componentSubtitle: "Displays informative text when users hover over or click an element",
    docs: {
      description: {
        component:
          "A tooltip component that provides additional information when interacting with an element.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      description: "The position of the tooltip relative to the target",
      table: {
        defaultValue: { summary: "top" },
      },
    },
    width: {
      control: { type: "radio" },
      options: ["auto", 150, 200, 300],
      description: "The width of the tooltip",
      table: {
        defaultValue: { summary: "auto" },
      },
    },
    maxWidth: {
      control: { type: "radio" },
      options: [undefined, 150, 200, 300],
      description: "The maximum width of the tooltip",
    },
    trigger: {
      description: "How the tooltip is activated",
      table: {
        defaultValue: { summary: "hover" },
      },
    },
  },

  render: args => <Tooltip {...args} />,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "This is a simple tooltip",
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover Me</button>,
  },
};

export const WithRichContent: Story = {
  args: {
    content: (
      <div>
        <h3 className="font-bold mb-1">Rich Content Tooltip</h3>
        <p>Tooltips can contain complex content including:</p>
        <ul className="list-disc pl-4 mt-1">
          <li>Formatted text</li>
          <li>Images</li>
          <li>Other components</li>
        </ul>
      </div>
    ),
    maxWidth: 300,
    children: (
      <button className="px-4 py-2 bg-green-500 text-white rounded">Hover for Rich Content</button>
    ),
  },
};

export const ClickTrigger: Story = {
  args: {
    content: "Click again to close this tooltip",
    trigger: "click",
    children: <button className="px-4 py-2 bg-purple-500 text-white rounded">Click Me</button>,
  },
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      <Tooltip content="Top placement" placement="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Top</button>
      </Tooltip>

      <Tooltip content="Right placement" placement="right">
        <button className="px-4 py-2 bg-green-500 text-white rounded">Right</button>
      </Tooltip>

      <Tooltip content="Bottom placement" placement="bottom">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded">Bottom</button>
      </Tooltip>

      <Tooltip content="Left placement" placement="left">
        <button className="px-4 py-2 bg-red-500 text-white rounded">Left</button>
      </Tooltip>
    </div>
  ),
};

export const WidthOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Tooltip content="Auto width tooltip that adjusts to content" width="auto">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Auto Width
          </button>
        </Tooltip>

        <Tooltip content="Fixed width tooltip with a width of 150px" width={150}>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
            Fixed Width (150px)
          </button>
        </Tooltip>
      </div>

      <div className="flex flex-wrap gap-4">
        <Tooltip
          content="This tooltip has a lot of content that would normally wrap, but it's set to auto width so it stays on one line."
          width="auto"
        >
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded">
            Long Auto Width
          </button>
        </Tooltip>

        <Tooltip
          content="This tooltip has a lot of content that will wrap because it has a fixed width of 200px."
          width={200}
        >
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">
            Long Fixed Width
          </button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const InContainers: Story = {
  render: () => (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-4 border rounded mb-4 relative overflow-hidden">
        <h3 className="text-lg font-bold mb-2">Tooltip in a container with overflow</h3>
        <div className="h-32 overflow-auto border p-4">
          <div className="flex items-center justify-center h-full">
            <Tooltip content="This tooltip should appear on top, regardless of the container's overflow">
              <button className="px-4 py-2 bg-purple-500 text-white rounded">Hover Me</button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded mb-4 relative">
        <h3 className="text-lg font-bold mb-2">Tooltip near the edge of the screen</h3>
        <div className="flex justify-between">
          <Tooltip
            content="Left-aligned tooltip that should stay within viewport"
            placement="bottom"
          >
            <button className="px-4 py-2 bg-indigo-500 text-white rounded">Left Edge</button>
          </Tooltip>

          <Tooltip
            content="Right-aligned tooltip that should stay within viewport"
            placement="bottom"
          >
            <button className="px-4 py-2 bg-pink-500 text-white rounded">Right Edge</button>
          </Tooltip>
        </div>
      </div>

      <div className="p-4 border rounded relative">
        <h3 className="text-lg font-bold mb-2">Tooltip in fixed position element</h3>
        <div className="relative h-32 border">
          <div className="absolute inset-0 flex items-center justify-center">
            <Tooltip content="This tooltip should appear correctly even though it's in an absolutely positioned container">
              <button className="px-4 py-2 bg-teal-500 text-white rounded">Hover Me</button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CustomStyling: Story = {
  args: {
    content: "Custom styled tooltip",
    className: "bg-indigo-600 text-yellow-200 font-medium",
    children: <button className="px-4 py-2 bg-indigo-500 text-white rounded">Custom Style</button>,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "@/components";
import { ThemeProvider } from "@/context";

const meta: Meta<typeof ThemeToggle> = {
  title: "Utils/Theme/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    Story => (
      <ThemeProvider>
        <div className="p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => <ThemeToggle />,
};

export const WithCustomPosition: Story = {
  render: () => (
    <div className="fixed top-4 right-4">
      <ThemeToggle />
    </div>
  ),
};

export const WithCustomSize: Story = {
  render: () => (
    <div className="scale-150">
      <ThemeToggle />
    </div>
  ),
};

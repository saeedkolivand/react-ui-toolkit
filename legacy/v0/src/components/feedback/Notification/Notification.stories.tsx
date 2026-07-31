import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components";
import { ThemeProvider } from "@/context";
import { NotificationProvider, useNotification } from "./NotificationProvider";

const meta: Meta<typeof NotificationProvider> = {
  title: "Feedback/Notification",
  component: NotificationProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <ThemeProvider>
        <NotificationProvider>
          <Story />
        </NotificationProvider>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationProvider>;

const NotificationDemo = () => {
  const { success, error, info, warning } = useNotification();

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        onClick={() => success("Success", "This is a success notification")}
        variant="success"
      >
        Success
      </Button>
      <Button onClick={() => error("Error", "This is an error notification")} variant="error">
        Error
      </Button>
      <Button onClick={() => info("Info", "This is an info notification")} variant="info">
        Info
      </Button>
      <Button
        onClick={() => warning("Warning", "This is a warning notification")}
        variant="warning"
      >
        Warning
      </Button>
    </div>
  );
};

export const Default: Story = {
  render: () => <NotificationDemo />,
};

export const BottomRight: Story = {
  decorators: [
    Story => (
      <ThemeProvider>
        <NotificationProvider position="bottom-right">
          <Story />
        </NotificationProvider>
      </ThemeProvider>
    ),
  ],
  render: () => <NotificationDemo />,
};

export const MaxCount: Story = {
  decorators: [
    Story => (
      <ThemeProvider>
        <NotificationProvider maxCount={2}>
          <Story />
        </NotificationProvider>
      </ThemeProvider>
    ),
  ],
  render: () => <NotificationDemo />,
};

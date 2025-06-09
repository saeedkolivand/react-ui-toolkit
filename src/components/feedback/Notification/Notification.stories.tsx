import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationContainer, useNotification } from "./index";
import { Button } from "@/components";
import { ThemeProvider } from "@/context";

const meta: Meta<typeof NotificationContainer> = {
  title: "Feedback/Notification",
  component: NotificationContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationContainer>;

const NotificationDemo = ({
  showNotification,
}: {
  showNotification: ReturnType<typeof useNotification>;
}) => {
  const { success, error, info, warning } = showNotification;

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
  render: () => {
    const notification = useNotification();
    return (
      <>
        <NotificationContainer
          notifications={notification.notifications}
          onRemove={notification.removeNotification}
        />
        <NotificationDemo showNotification={notification} />
      </>
    );
  },
};

export const BottomRight: Story = {
  render: () => {
    const notification = useNotification();
    return (
      <>
        <NotificationContainer
          position="bottom-right"
          notifications={notification.notifications}
          onRemove={notification.removeNotification}
        />
        <NotificationDemo showNotification={notification} />
      </>
    );
  },
};

export const MaxCount: Story = {
  render: () => {
    const notification = useNotification();
    return (
      <>
        <NotificationContainer
          maxCount={2}
          notifications={notification.notifications}
          onRemove={notification.removeNotification}
        />
        <NotificationDemo showNotification={notification} />
      </>
    );
  },
};

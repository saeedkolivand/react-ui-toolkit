import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, IconName } from "./Icon";
import { useCallback, useState } from "react";
import { Container, Row, Col, Input } from "@/components";
import { ThemeProvider } from "@/context";
import {
  NotificationProvider,
  useNotification,
} from "@/components/feedback/Notification/NotificationProvider";

const iconNames: IconName[] = [
  // Navigation
  "chevronLeft",
  "chevronRight",
  "chevronUp",
  "chevronDown",
  "arrowUp",
  "arrowDown",
  "arrowLeft",
  "arrowRight",
  "arrowUpRight",
  "arrowUpLeft",
  "arrowDownRight",
  "arrowDownLeft",
  "menu",
  "close",
  "home",
  "externalLink",
  "globe",
  // Media & Controls
  "play",
  "pause",
  "volumeUp",
  "volumeDown",
  "volumeOff",
  "fastForward",
  "rewind",
  "skipForward",
  "skipBackward",
  // Actions
  "search",
  "plus",
  "minus",
  "edit",
  "trash",
  "download",
  "upload",
  "copy",
  "cut",
  "paste",
  "refresh",
  // Status
  "check",
  "error",
  "warning",
  "info",
  "eye",
  "eyeOff",
  "shield",
  "flag",
  "thumbsUp",
  "thumbsDown",
  // Social
  "github",
  "twitter",
  "linkedin",
  "facebook",
  "instagram",
  "youtube",
  // File & Document
  "file",
  "folder",
  "document",
  "documentText",
  "documentDuplicate",
  // UI Elements
  "user",
  "settings",
  "bell",
  "heart",
  "star",
  "filter",
  "sort",
  "grid",
  "list",
  "bookmark",
  // Communication
  "mail",
  "phone",
  "chat",
  "chatAlt",
  "at",
  // Tools
  "wrench",
  "cog",
  "scissors",
  "pencil",
  // Weather
  "sun",
  "moon",
  "cloud",
  "umbrella",
  // Shopping
  "cart",
  "tag",
  "shoppingBag",
];

const IconGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { success } = useNotification();

  const copyToClipboard = useCallback((name: IconName) => {
    const code = `<Icon name="${name}" />`;
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    success("Copied!", `<Icon name="${name}" />`);
  }, []);

  const filteredIcons = iconNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="full">
      <Col span={12} className="mb-6 mt-2 w-full">
        <Row justify="center" spacing={4} className="flex-wrap">
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            variant="filled"
            size="lg"
            className="w-full max-w-2xl mx-auto block"
          />
        </Row>
      </Col>
      <Row justify="center" spacing={4} className="flex-wrap">
        {filteredIcons.map(name => (
          <Col key={name} span={2} sm={4} md={3} lg={2}>
            <div
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => copyToClipboard(name)}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-2">
                <Icon name={name} size="lg" />
              </div>
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const meta: Meta<typeof Icon> = {
  title: "Base/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
      description: "The name of the built-in icon to use",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "The size of the icon",
    },
    color: {
      control: "color",
      description: "The color of the icon",
    },
  },
  decorators: [
    Story => (
      <ThemeProvider>
        <NotificationProvider position="bottom-right" maxCount={3}>
          <Story />
        </NotificationProvider>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: "menu",
  },
};

export const Small: Story = {
  args: {
    name: "menu",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    name: "menu",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    name: "menu",
    size: "xl",
  },
};

export const Colored: Story = {
  args: {
    name: "menu",
    color: "#FF0000",
  },
};

export const CustomIcon: Story = {
  args: {
    customIcon: <span>Custom Icon</span>,
  },
};

export const AllIcons: Story = {
  render: () => <IconGrid />,
};

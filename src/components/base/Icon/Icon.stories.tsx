import type { Meta, StoryObj } from "@storybook/react";
import { Icon, IconName } from "./Icon";
import { useState } from "react";
import { Container, Row, Col, Input } from "@/components";

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

const meta: Meta<typeof Icon> = {
  title: "Base/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
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

const IconGrid = () => {
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const copyToClipboard = async (name: IconName) => {
    const code = `<Icon name="${name}" />`;
    await navigator.clipboard.writeText(code);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const filteredIcons = iconNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="2xl" className="overflow-hidden">
      <div className="mb-6">
        <Input
          placeholder="Search icons..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          variant="filled"
          size="lg"
        />
      </div>
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
              {copiedIcon === name && <span className="text-xs text-green-600 mt-1">Copied!</span>}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export const AllIcons: Story = {
  render: () => <IconGrid />,
};

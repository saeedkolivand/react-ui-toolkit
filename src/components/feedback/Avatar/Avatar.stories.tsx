import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Feedback/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "The size of the avatar",
    },
    status: {
      control: "select",
      options: ["online", "offline", "away", "busy"],
      description: "The status indicator of the avatar",
    },
    squared: {
      control: "boolean",
      description: "Whether the avatar is squared",
    },
    bordered: {
      control: "boolean",
      description: "Whether to show a border",
    },
    src: {
      control: "text",
      description: "The source URL of the avatar image",
    },
    alt: {
      control: "text",
      description: "Alt text for the avatar image",
    },
    initials: {
      control: "text",
      description: "The initials to display when no image is available",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Using reliable placeholder image URLs
const AVATAR_IMAGES = {
  male1: "https://xsgames.co/randomusers/assets/avatars/male/1.jpg",
  female1: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg",
  male2: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg",
  female2: "https://xsgames.co/randomusers/assets/avatars/female/2.jpg",
};

export const Default: Story = {
  args: {
    src: AVATAR_IMAGES.male1,
    alt: "User Avatar",
  },
};

export const WithInitials: Story = {
  args: {
    initials: "John Doe",
  },
};

export const WithStatus: Story = {
  args: {
    src: AVATAR_IMAGES.female1,
    alt: "User Avatar",
    status: "online",
  },
};

export const Squared: Story = {
  args: {
    src: AVATAR_IMAGES.male2,
    alt: "User Avatar",
    squared: true,
  },
};

export const Bordered: Story = {
  args: {
    src: AVATAR_IMAGES.female2,
    alt: "User Avatar",
    bordered: true,
  },
};

export const ExtraSmall: Story = {
  args: {
    src: AVATAR_IMAGES.male1,
    alt: "User Avatar",
    size: "xs",
  },
};

export const Small: Story = {
  args: {
    src: AVATAR_IMAGES.female1,
    alt: "User Avatar",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    src: AVATAR_IMAGES.male2,
    alt: "User Avatar",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    src: AVATAR_IMAGES.female2,
    alt: "User Avatar",
    size: "xl",
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar src={AVATAR_IMAGES.male1} alt="Online" status="online" />
      <Avatar src={AVATAR_IMAGES.female1} alt="Offline" status="offline" />
      <Avatar src={AVATAR_IMAGES.male2} alt="Away" status="away" />
      <Avatar src={AVATAR_IMAGES.female2} alt="Busy" status="busy" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar src={AVATAR_IMAGES.male1} alt="XS" size="xs" />
      <Avatar src={AVATAR_IMAGES.female1} alt="SM" size="sm" />
      <Avatar src={AVATAR_IMAGES.male2} alt="MD" size="md" />
      <Avatar src={AVATAR_IMAGES.female2} alt="LG" size="lg" />
      <Avatar src={AVATAR_IMAGES.male1} alt="XL" size="xl" />
    </div>
  ),
};

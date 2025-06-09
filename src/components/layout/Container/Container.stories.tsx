import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full", "none"],
      description: "Maximum width of the container",
    },
    padding: {
      control: "boolean",
      description: "Whether to add padding to the container",
    },
    center: {
      control: "boolean",
      description: "Whether the container should be centered",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

const ContentBox = ({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <div
    className={`p-6 rounded-lg text-white ${
      color === "blue"
        ? "bg-blue-500"
        : color === "green"
        ? "bg-green-500"
        : color === "purple"
        ? "bg-purple-500"
        : color === "orange"
        ? "bg-orange-500"
        : color === "pink"
        ? "bg-pink-500"
        : "bg-gray-500"
    }`}
  >
    {children}
  </div>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="py-8">{children}</div>
);

export const Default: Story = {
  args: {
    children: (
      <Section>
        <ContentBox>Default container with max-width lg</ContentBox>
      </Section>
    ),
  },
};

export const Small: Story = {
  args: {
    maxWidth: "sm",
    children: (
      <Section>
        <ContentBox color="blue">Small container (max-width: 640px)</ContentBox>
      </Section>
    ),
  },
};

export const Medium: Story = {
  args: {
    maxWidth: "md",
    children: (
      <Section>
        <ContentBox color="green">Medium container (max-width: 768px)</ContentBox>
      </Section>
    ),
  },
};

export const Large: Story = {
  args: {
    maxWidth: "lg",
    children: (
      <Section>
        <ContentBox color="purple">Large container (max-width: 1024px)</ContentBox>
      </Section>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    maxWidth: "xl",
    children: (
      <Section>
        <ContentBox color="orange">Extra large container (max-width: 1280px)</ContentBox>
      </Section>
    ),
  },
};

export const TwoExtraLarge: Story = {
  args: {
    maxWidth: "2xl",
    children: (
      <Section>
        <ContentBox color="pink">Two extra large container (max-width: 1536px)</ContentBox>
      </Section>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    maxWidth: "full",
    children: (
      <Section>
        <ContentBox color="blue">Full width container</ContentBox>
      </Section>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    padding: false,
    children: (
      <Section>
        <ContentBox color="green">Container without padding</ContentBox>
      </Section>
    ),
  },
};

export const NotCentered: Story = {
  args: {
    center: false,
    children: (
      <Section>
        <ContentBox color="purple">Container not centered</ContentBox>
      </Section>
    ),
  },
};

export const WithNestedContent: Story = {
  render: () => (
    <Container>
      <Section>
        <div className="space-y-6">
          <ContentBox color="blue">First section</ContentBox>
          <ContentBox color="green">Second section</ContentBox>
          <ContentBox color="purple">Third section</ContentBox>
        </div>
      </Section>
    </Container>
  ),
};

export const ResponsiveExample: Story = {
  render: () => (
    <Container maxWidth="lg">
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentBox color="blue">Responsive grid item 1</ContentBox>
          <ContentBox color="green">Responsive grid item 2</ContentBox>
          <ContentBox color="purple">Responsive grid item 3</ContentBox>
        </div>
      </Section>
    </Container>
  ),
};

export const ComplexLayout: Story = {
  render: () => (
    <Container>
      <Section>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentBox color="blue">
              <h2 className="text-xl font-bold mb-4">Header Section</h2>
              <p>This is a header section with some content.</p>
            </ContentBox>
            <ContentBox color="green">
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <p>This is a navigation section with some content.</p>
            </ContentBox>
          </div>
          <ContentBox color="purple">
            <h2 className="text-xl font-bold mb-4">Main Content</h2>
            <p>This is the main content area with some example text.</p>
          </ContentBox>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContentBox color="orange">Footer Item 1</ContentBox>
            <ContentBox color="pink">Footer Item 2</ContentBox>
            <ContentBox color="blue">Footer Item 3</ContentBox>
          </div>
        </div>
      </Section>
    </Container>
  ),
};

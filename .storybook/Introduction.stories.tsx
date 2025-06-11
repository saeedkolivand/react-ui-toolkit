import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Icon, Tag } from "../src";
import bannerImage from "../assets/images/banner.png";

const meta: Meta = {
  title: "Welcome",
  parameters: {
    options: { showPanel: false },
    controls: { hideNoControlsWarning: true },
  },
};

export default meta;
type Story = StoryObj;

export const Introduction: Story = {
  render: () => {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Rainbow gradient background element */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-blue-500/20 blur-3xl opacity-30"></div>

        <div className="relative p-8 max-w-4xl mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
            <img 
              src={bannerImage} 
              alt="React UI Toolkit Banner" 
              className="w-full rounded-lg mb-6" 
            />
            <h1 className="text-5xl text-white font-bold mb-6 bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 bg-clip-text">
              Welcome to React UI Toolkit
            </h1>
            <p className="text-xl text-white mb-8">
              A collection of beautiful, accessible, and customizable React components built with
              TypeScript and Tailwind CSS.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="backdrop-blur-lg bg-gray-800/80 border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Icon name="menu" size="lg" className="text-red-400 mr-2" />
                Getting Started
              </h2>
              <p className="text-white leading-relaxed mb-6">
                Browse through the component library using the sidebar navigation. Each component
                comes with examples, documentation, and interactive controls.
              </p>
            </Card>

            <Card className="backdrop-blur-lg bg-gray-800/80 border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Icon name="globe" size="lg" className="text-yellow-400 mr-2" />
                Features
              </h2>
              <div className="mb-4 flex flex-wrap gap-2">
                <Tag color="success">TypeScript</Tag>
                <Tag color="info">Tailwind CSS</Tag>
                <Tag color="warning">Responsive</Tag>
                <Tag color="error">Accessible</Tag>
                <Tag color="primary">Customizable</Tag>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  },
};

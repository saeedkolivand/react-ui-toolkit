import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Drawer } from "@crosskit-ui/react";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } as const;

export const Placements: Story = {
  render: function DrawerStory() {
    const [placement, setPlacement] = useState<"left" | "right" | "top" | "bottom" | null>(null);
    return (
      <div style={row}>
        {(["left", "right", "top", "bottom"] as const).map(side => (
          <Button key={side} type="default" onClick={() => setPlacement(side)}>
            {side}
          </Button>
        ))}
        <Drawer
          open={placement !== null}
          onOpenChange={details => !details.open && setPlacement(null)}
          placement={placement ?? "right"}
          title={`Drawer — ${placement ?? ""}`}
        >
          The same machine as Modal. About fifteen lines differ.
        </Drawer>
      </div>
    );
  },
};

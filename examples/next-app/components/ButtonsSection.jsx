"use client";

import { Button } from "@saeedkolivand/react-ui-toolkit";
import { useState } from "react";

export default function ButtonsSection() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="space-y-2">
      <Button variant="primary" fullWidth onClick={handleClick}>
        Primary Action {clickCount > 0 ? `(Clicked ${clickCount} times)` : ""}
      </Button>
      <Button variant="outline" fullWidth>
        Secondary Action
      </Button>
    </div>
  );
}

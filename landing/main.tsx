import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/context";
// The library's own stylesheet — the demos on this page are real components.
import "@/styles/index.css";
import "./landing.css";
import { Landing } from "./Landing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Landing />
    </ThemeProvider>
  </StrictMode>
);

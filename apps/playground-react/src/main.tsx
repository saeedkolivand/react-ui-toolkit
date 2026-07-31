import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Parity } from "./Parity";
import "./parity.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Parity />
  </StrictMode>
);

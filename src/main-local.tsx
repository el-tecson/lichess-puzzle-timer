import "@/background/loadDefaults";
import "@/content/loadCustoms";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LocalWebsite from "@/pages/LocalWebsite";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocalWebsite />
  </StrictMode>,
);

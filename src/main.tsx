import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { Toaster } from "@/app/components/ui/sonner";
import { SmoothScrollProvider } from "@/app/components/ui/SmoothScrollProvider";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <TooltipProvider delayDuration={300}>
    <SmoothScrollProvider>
      <App />
      <Toaster position="top-center" />
    </SmoothScrollProvider>
  </TooltipProvider>
);
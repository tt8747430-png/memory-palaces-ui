  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { TooltipProvider } from "@/app/components/ui/tooltip";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <TooltipProvider delayDuration={300}>
      <App />
    </TooltipProvider>
  );
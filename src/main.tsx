import {createRoot} from "react-dom/client";
import {MotionConfig} from "motion/react";
import App from "./app/App.tsx";
import {TooltipProvider} from "@/app/components/ui/tooltip";
import {Toaster} from "@/app/components/ui/sonner";
import {SmoothScrollProvider} from "@/app/components/ui/SmoothScrollProvider";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
    // reducedMotion="user" makes every Motion animation honor the OS
    // "Reduce motion" setting: transforms are skipped, opacity is kept.
    <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={300}>
            <SmoothScrollProvider>
                <App/>
                <Toaster position="top-center"/>
            </SmoothScrollProvider>
        </TooltipProvider>
    </MotionConfig>
);
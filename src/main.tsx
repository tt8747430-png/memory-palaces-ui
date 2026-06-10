import {createRoot} from "react-dom/client";
import {MotionConfig} from "motion/react";
import App from "./app/App.tsx";
import {TooltipProvider} from "@/app/components/ui/tooltip";
import {Toaster} from "@/app/components/ui/sonner";
import {SmoothScrollProvider} from "@/app/components/ui/SmoothScrollProvider";
import "./styles/index.css";

// iOS Safari still honours pinch-zoom even with `user-scalable=no`. Swallow the
// multi-touch gesture events so the installed PWA stays at a fixed scale.
// (Double-tap zoom is already disabled via `touch-action: manipulation`.)
for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(type, (e) => e.preventDefault(), {passive: false});
}

createRoot(document.getElementById("root")!).render(
    // reducedMotion="user" makes every Motion animation honor the OS
    // "Reduce motion" setting: transforms are skipped, opacity is kept.
    <MotionConfig reducedMotion="user">
        <TooltipProvider delay={300}>
            <SmoothScrollProvider>
                <App/>
                <Toaster position="top-center"/>
            </SmoothScrollProvider>
        </TooltipProvider>
    </MotionConfig>
);
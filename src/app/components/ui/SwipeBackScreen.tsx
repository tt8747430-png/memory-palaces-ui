import {type ReactNode} from "react";
import {motion} from "motion/react";
import {useSwipeBack} from "../../hooks/useSwipeBack";
import {cn} from "./utils";

interface SwipeBackScreenProps {
    /** Called when an edge-swipe-back is committed (same as the back button). */
    onBack: () => void;
    /** Turn the gesture off while a nested sheet/dialog owns the screen. */
    enabled?: boolean;
    className?: string;
    children: ReactNode;
}

/**
 * Drop-in root for a full-screen overlay that should support iOS-style
 * edge-swipe-back. Renders a `motion.div` carrying the swipe transform, so a
 * screen's existing root `<div className="h-full …">` can simply become
 * `<SwipeBackScreen onBack={…} className="h-full …">`. The transform resolves to
 * `none` at rest so it never creates a containing block for fixed/portaled
 * descendants. See {@link useSwipeBack} for gesture details.
 */
export function SwipeBackScreen({
    onBack,
    enabled = true,
    className,
    children,
}: SwipeBackScreenProps) {
    const {bind, x} = useSwipeBack(onBack, {enabled});
    return (
        <motion.div
            {...bind()}
            style={{x}}
            transformTemplate={({x}) => (x && x !== "0px" ? `translateX(${x})` : "none")}
            className={cn("touch-pan-y", className)}
        >
            {children}
        </motion.div>
    );
}

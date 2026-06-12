import {forwardRef, type ReactNode} from "react";
import {type HTMLMotionProps, motion} from "motion/react";
import {cn} from "./utils";
import {tapSmall} from "../../utils/motion";

type IconButtonVariant = "glass" | "tint" | "solid" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    /** Icon element (e.g. a lucide icon). */
    children: ReactNode;
    /** Required: this button is icon-only, so it needs an accessible name. */
    "aria-label": string;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
}

const VARIANTS: Record<IconButtonVariant, string> = {
    // Floating white glass on the blue gradient — the app's default back/menu button.
    glass: "bg-white/95 backdrop-blur-md border border-white/40 text-[#091A7A] shadow-card",
    // Pale-blue tinted chip button for inline actions on white surfaces.
    tint: "bg-[#EAF4FF] text-[#091A7A]",
    // Solid navy for the single emphasized action.
    solid: "bg-[#091A7A] text-white shadow-interactive",
    // Translucent white for use over navy/glass headers.
    ghost: "bg-white/20 text-white",
};

const SIZES: Record<IconButtonSize, string> = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-12 h-12",
};

/**
 * Circular, icon-only button. Replaces ~10 hand-rolled
 * `w-11 h-11 rounded-full …` copies, standardizing size, press feedback, and the
 * focus ring. `md`/`lg` clear the 44px touch target; reserve `sm` for dense
 * affordances like a sheet's close button.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({children, variant = "glass", size = "md", className, ...props}, ref) => (
        <motion.button
            ref={ref}
            {...tapSmall}
            className={cn(
                "flex flex-shrink-0 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/50 disabled:opacity-50",
                VARIANTS[variant],
                SIZES[size],
                className,
            )}
            {...props}
        >
            {children}
        </motion.button>
    ),
);

IconButton.displayName = "IconButton";

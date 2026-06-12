import {forwardRef, type ReactNode} from "react";
import {cn} from "./utils";

type GlassTone = "sky" | "card";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    /**
     * `sky` — the saturated blue gradient glass used for hero/stat cards.
     * `card` — the lighter `.bg-card-glass` surface for content panels.
     */
    tone?: GlassTone;
}

// The exact sky-glass treatment that was inlined ~13 times across the progress
// and palace surfaces. Centralized so the blur, border, and navy-tinted shadow
// stay identical everywhere.
const SKY_STYLE: React.CSSProperties = {
    background:
        "linear-gradient(135deg, rgba(173, 200, 255, 0.9) 0%, rgba(173, 200, 255, 0.7) 100%)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    boxShadow: "0 10px 28px rgba(9, 26, 122, 0.14)",
};

/**
 * Frosted glass card. `tone="sky"` carries the daylit blue gradient (hero/stat
 * cards); `tone="card"` is the lighter panel used for content. Either way the
 * navy-tinted shadow and rounded corners match the design system, so callers
 * stop re-deriving the style object.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({children, tone = "sky", className, style, ...props}, ref) => (
        <div
            ref={ref}
            style={tone === "sky" ? {...SKY_STYLE, ...style} : style}
            className={cn(
                "rounded-[20px] border",
                tone === "sky"
                    ? "border-white/30"
                    : "bg-card-glass backdrop-blur-lg border-white/20 shadow-card",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    ),
);

GlassCard.displayName = "GlassCard";

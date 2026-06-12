import {type ReactNode} from "react";
import {cn} from "./utils";

type ChipTone = "info" | "neutral" | "navy" | "amber" | "emerald" | "gold";
type ChipSize = "sm" | "md";

interface ChipProps {
    children: ReactNode;
    tone?: ChipTone;
    size?: ChipSize;
    /** Optional leading icon. */
    icon?: ReactNode;
    className?: string;
}

// All text colors are picked to clear WCAG AA (≥4.5:1) on their own tint, so
// chips stay legible at 11–12px — the bright #3D8FEF on #EAF4FF used elsewhere
// does not, hence the darker blues here.
const TONES: Record<ChipTone, string> = {
    info: "bg-[#EAF4FF] text-[#1E5FBF]",
    neutral: "bg-[#F1F5F9] text-[#475569]",
    navy: "bg-[#EAF4FF] text-[#091A7A]",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    gold: "bg-[#FFF7E0] text-[#8A5A00]",
};

const SIZES: Record<ChipSize, string> = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-[11px] gap-1.5",
};

/**
 * Compact informational pill (time, counts, status). Replaces the repeated
 * `bg-[#EAF4FF] text-[#3D8FEF] rounded-full …` chip markup and standardizes the
 * accessible tone palette used for SRS status and stats.
 */
export function Chip({children, tone = "info", size = "md", icon, className}: ChipProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-semibold leading-none",
                TONES[tone],
                SIZES[size],
                className,
            )}
        >
            {icon}
            {children}
        </span>
    );
}

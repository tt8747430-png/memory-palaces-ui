import {type ReactNode} from "react";
import {motion, type MotionStyle} from "motion/react";
import {ArrowLeft} from "lucide-react";
import {cn} from "./utils";
import {tapSmall} from "../../utils/motion";

interface ScreenHeaderProps {
    title: ReactNode;
    onBack?: () => void;
    /** Right-aligned actions (icon buttons, menus). */
    actions?: ReactNode;
    /**
     * Collapsible-hero screens pass `{opacity, pointerEvents}` from
     * `useCollapsibleHeader` so the bar fades in as the hero recedes.
     */
    style?: MotionStyle;
    /** Fixed to the viewport top (default) or rendered inline in flow. */
    fixed?: boolean;
    className?: string;
}

/**
 * The frosted compact header bar (safe-area spacer + back button + truncating
 * title + optional actions) that was hand-rolled in ~7 screens. Pass `style`
 * from `useCollapsibleHeader` for the parallax-collapse variant, or omit it for
 * a plain static header on sub-screens.
 */
export function ScreenHeader({
                                 title,
                                 onBack,
                                 actions,
                                 style,
                                 fixed = true,
                                 className,
                             }: ScreenHeaderProps) {
    return (
        <motion.div
            style={style}
            className={cn(
                fixed && "fixed top-0 left-0 right-0 z-40",
                "bg-white/85 backdrop-blur-2xl border-b border-[#091A7A]/[0.06] shadow-[0_4px_24px_rgba(9,26,122,0.04)]",
                className,
            )}
        >
            <div className="h-safe-top"/>
            <div className="flex items-center gap-2.5 px-3 py-2">
                {onBack && (
                    <motion.button
                        {...tapSmall}
                        onClick={onBack}
                        aria-label="Go back"
                        className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-[#091A7A] transition-colors hover:bg-[#091A7A]/5 outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/50"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </motion.button>
                )}
                <h2 className="text-[16px] font-bold text-[#091A7A] truncate flex-1 min-w-0">
                    {title}
                </h2>
                {actions && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">{actions}</div>
                )}
            </div>
        </motion.div>
    );
}

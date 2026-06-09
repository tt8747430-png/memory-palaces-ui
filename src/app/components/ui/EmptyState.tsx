import {motion} from "motion/react";
import {type ReactNode} from "react";
import {cn} from "./utils";

interface EmptyStateProps {
    /** A lucide icon (or any node). Falls back to `emoji` when omitted. */
    icon?: ReactNode;
    emoji?: string;
    title: string;
    description: string;
    /** Primary call to action, e.g. a "Create palace" button. */
    action?: ReactNode;
    className?: string;
}

/**
 * First-run / no-content state. An empty list is an onboarding moment: it names
 * what will live here, why it matters, and the one action to get started.
 * Entrance motion is handled by Motion, so it honors reduced-motion globally.
 */
export function EmptyState({
                               icon,
                               emoji,
                               title,
                               description,
                               action,
                               className,
                           }: EmptyStateProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            className={cn(
                "flex flex-col items-center justify-center px-6 py-16 text-center",
                className,
            )}
        >
            <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#EAF4FF] text-[#3D8FEF]">
                {icon ?? (emoji ? <span className="text-3xl">{emoji}</span> : null)}
            </div>
            <h3 className="mb-2 text-base font-semibold text-balance text-[#091A7A]">
                {title}
            </h3>
            <p className="mb-6 max-w-[34ch] text-sm text-pretty text-[#475569]">
                {description}
            </p>
            {action}
        </motion.div>
    );
}

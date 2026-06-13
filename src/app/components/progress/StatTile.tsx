import {type ReactNode} from "react";
import {motion} from "motion/react";
import {easeOutQuart} from "../../utils/motion";

interface StatTileProps {
    icon: ReactNode;
    value: string;
    label: string;
    /** Stagger delay when rendered in a grid. */
    delay?: number;
}

/**
 * The white stat card (icon box + big value + label) shared by the Stats screen
 * and the Profile glance, so the metric tiles look and animate identically
 * wherever they appear.
 */
export function StatTile({icon, value, label, delay = 0}: StatTileProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay, ease: easeOutQuart, duration: 0.35}}
            className="p-4 bg-white rounded-[22px] shadow-card border border-[#091A7A]/[0.04]"
        >
            <div className="w-11 h-11 bg-[#EAF4FF] rounded-[14px] flex items-center justify-center text-[#091A7A] mb-4">
                {icon}
            </div>
            <p className="text-[28px] font-bold text-[#091A7A] tracking-tight mb-1 tabular-nums">
                {value}
            </p>
            <p className="text-[13px] font-medium text-[#091A7A]/65">{label}</p>
        </motion.div>
    );
}

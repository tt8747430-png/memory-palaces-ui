import {motion} from "motion/react";
import {ChevronRight, Flame, Snowflake} from "lucide-react";
import {GlassCard} from "../ui/GlassCard";
import {Chip} from "../ui/Chip";
import {buildDayCells} from "../../utils/streak";
import {springGentle} from "../../utils/motion";

interface TrainingStreakProps {
    streakCount: number;
    /** Longest streak ever reached. */
    longestStreak: number;
    /** Streak freezes in reserve; each forgives one missed day. */
    freezes?: number;
    /** ISO `YYYY-MM-DD` day keys of every day trained. */
    trainingDays: string[];
    /** Open the full Training History sheet. */
    onViewHistory?: () => void;
}

/**
 * The home streak overview. Shows the current and longest streak side by side
 * plus the real last-seven-days row (computed from `trainingDays`, not faked),
 * and opens the Training History sheet on tap.
 */
export function TrainingStreak({
                                   streakCount,
                                   longestStreak,
                                   freezes = 0,
                                   trainingDays,
                                   onViewHistory,
                               }: TrainingStreakProps) {
    const week = buildDayCells(trainingDays, 7);

    return (
        <GlassCard
            tone="card"
            role="button"
            tabIndex={0}
            onClick={onViewHistory}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onViewHistory?.();
                }
            }}
            aria-label="View training history"
            className="p-5 cursor-pointer transition-transform active:scale-[0.99] outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <Flame
                        className="w-5 h-5 text-[#F59E0B]"
                        fill="currentColor"
                        style={{filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))"}}
                    />
                    <span className="text-section-header text-[#091A7A]">Training Streak</span>
                </div>
                <div className="flex items-center gap-2">
                    {freezes > 0 && (
                        <Chip tone="info" icon={<Snowflake className="w-3.5 h-3.5"/>}>
                            {freezes}
                        </Chip>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#091A7A]/40"/>
                </div>
            </div>

            {/* Current + longest, the two numbers that matter */}
            <div className="flex items-stretch gap-3 mb-5">
                <StreakStat
                    label="Current streak"
                    value={streakCount}
                    accent
                />
                <div className="w-px bg-[#091A7A]/10"/>
                <StreakStat label="Longest streak" value={longestStreak}/>
            </div>

            {/* Real last-7-days row */}
            <div className="flex justify-between gap-1">
                {week.map((day, index) => (
                    <div key={day.key} className="flex flex-col items-center gap-2">
                        <span
                            className={`text-[10px] font-semibold ${
                                day.isToday ? "text-[#091A7A]" : "text-[#475569]"
                            }`}
                        >
                            {day.weekdayShort[0]}
                        </span>
                        <motion.div
                            initial={{scale: 0.6, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{delay: 0.12 + index * 0.04, ...springGentle}}
                            className={`w-9 h-9 rounded-[14px] flex items-center justify-center ${
                                day.trained
                                    ? "bg-gradient-to-br from-[#FFC71E] to-[#F59E0B] shadow-interactive"
                                    : day.isToday
                                        ? "bg-white border-2 border-[#ADC8FF]"
                                        : "bg-[#091A7A]/[0.05] border border-white/30"
                            }`}
                        >
                            {day.trained ? (
                                <Flame className="w-4 h-4 text-white" fill="currentColor"/>
                            ) : (
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        day.isToday ? "bg-[#091A7A]/40" : "bg-[#091A7A]/15"
                                    }`}
                                />
                            )}
                        </motion.div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

function StreakStat({
                        label,
                        value,
                        accent = false,
                    }: {
    label: string;
    value: number;
    accent?: boolean;
}) {
    return (
        <div className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5">
                {accent && <Flame className="w-5 h-5 text-[#F59E0B]" fill="currentColor"/>}
                <span className="text-[30px] font-bold text-[#091A7A] leading-none tabular-nums">
                    {value}
                </span>
            </div>
            <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                {label}
            </span>
        </div>
    );
}

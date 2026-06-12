import {type ReactNode} from "react";
import {motion} from "motion/react";
import {
    BookOpen,
    CalendarCheck,
    Flame,
    Layers,
    Target,
    TrendingUp,
    Trophy,
    Zap,
} from "lucide-react";
import {ScreenHeader} from "./ui/ScreenHeader";
import {GlassCard} from "./ui/GlassCard";
import {TrainingCalendar} from "./progress/TrainingCalendar";
import {useProgressState} from "../hooks/useProgressState";
import {countDueLoci} from "../utils/dueCards";
import {buildDayCells, totalTrainingDays} from "../utils/streak";
import {easeOutQuart} from "../utils/motion";

interface StatsScreenProps {
    onBack: () => void;
}

/**
 * The full statistics screen behind "More in Stats". Every figure is derived
 * from real training data (PRODUCT: "show real evidence; never fake progress").
 */
export function StatsScreen({onBack}: StatsScreenProps) {
    const {state} = useProgressState();

    const week = buildDayCells(state.trainingDays, 7);
    const totalDays = totalTrainingDays(state.trainingDays);
    const dueToday = countDueLoci(state.palaces);
    const totalCards = state.palaces.reduce(
        (sum, p) => sum + (p.rooms || []).reduce((s, r) => s + (r.loci?.length || 0), 0),
        0,
    );

    const tiles: {label: string; value: string; icon: ReactNode}[] = [
        {label: "Days trained", value: totalDays.toString(), icon: <CalendarCheck className="w-[22px] h-[22px]"/>},
        {label: "Rooms completed", value: state.totalRoomsCompleted.toString(), icon: <TrendingUp className="w-[22px] h-[22px]"/>},
        {label: "Palaces", value: state.palaces.length.toString(), icon: <BookOpen className="w-[22px] h-[22px]"/>},
        {label: "Cards", value: totalCards.toString(), icon: <Layers className="w-[22px] h-[22px]"/>},
        {label: "Due today", value: dueToday.toString(), icon: <Flame className="w-[22px] h-[22px]"/>},
        {label: "Best quiz", value: `${state.bestQuizAccuracy}%`, icon: <Target className="w-[22px] h-[22px]"/>},
    ];

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF] to-white">
            <ScreenHeader title="Your Stats" onBack={onBack} fixed={false}/>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-2 pb-[120px] space-y-6">
                {/* Streak hero */}
                <GlassCard tone="sky" className="p-6">
                    <div className="flex items-stretch gap-4">
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="flex items-center gap-1.5">
                                <Flame className="w-6 h-6 text-[#F59E0B]" fill="currentColor"/>
                                <span className="text-[34px] font-bold text-[#091A7A] leading-none tabular-nums">
                                    {state.streakCount}
                                </span>
                            </div>
                            <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#33417A]">
                                Current streak
                            </span>
                        </div>
                        <div className="w-px bg-[#091A7A]/15"/>
                        <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-[34px] font-bold text-[#091A7A] leading-none tabular-nums">
                                {state.longestStreak}
                            </span>
                            <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#33417A]">
                                Longest streak
                            </span>
                        </div>
                    </div>

                    {/* Last 7 days */}
                    <div className="mt-5 flex justify-between gap-1">
                        {week.map((day) => (
                            <div key={day.key} className="flex flex-col items-center gap-1.5">
                                <span className="text-[10px] font-semibold text-[#33417A]">
                                    {day.weekdayShort[0]}
                                </span>
                                <div
                                    className={`w-8 h-8 rounded-[12px] flex items-center justify-center ${
                                        day.trained
                                            ? "bg-gradient-to-br from-[#FFC71E] to-[#F59E0B]"
                                            : day.isToday
                                                ? "bg-white/80 border-2 border-white"
                                                : "bg-white/30"
                                    }`}
                                >
                                    {day.trained && (
                                        <Flame className="w-3.5 h-3.5 text-white" fill="currentColor"/>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Level */}
                <div className="flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-card border border-[#091A7A]/[0.05]">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] flex items-center justify-center shadow-[0_6px_16px_rgba(9,26,122,0.22)]">
                        <Trophy className="w-6 h-6 text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-[#091A7A]">Level {state.currentLevel}</p>
                        <p className="text-[13px] font-medium text-[#091A7A]/65 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-[#F59E0B]" fill="currentColor"/>
                            {state.userXP.toLocaleString()} XP earned
                        </p>
                    </div>
                </div>

                {/* Totals grid */}
                <div>
                    <h3 className="text-section-header text-[#091A7A] mb-3 px-1">Your Journey</h3>
                    <div className="grid grid-cols-2 gap-3.5">
                        {tiles.map((tile, index) => (
                            <motion.div
                                key={tile.label}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: index * 0.04, ease: easeOutQuart, duration: 0.35}}
                                className="p-4 bg-white rounded-[22px] shadow-card border border-[#091A7A]/[0.04]"
                            >
                                <div className="w-11 h-11 bg-[#EAF4FF] rounded-[14px] flex items-center justify-center text-[#091A7A] mb-4">
                                    {tile.icon}
                                </div>
                                <p className="text-[28px] font-bold text-[#091A7A] tracking-tight mb-1 tabular-nums">
                                    {tile.value}
                                </p>
                                <p className="text-[13px] font-medium text-[#091A7A]/65">{tile.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Calendar */}
                <div>
                    <h3 className="text-section-header text-[#091A7A] mb-3 px-1">Training Calendar</h3>
                    <TrainingCalendar/>
                </div>
            </div>
        </div>
    );
}

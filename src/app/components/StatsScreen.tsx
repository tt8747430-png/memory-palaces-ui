import {type ReactNode} from "react";
import {
    BookOpen,
    CalendarCheck,
    Flame,
    Layers,
    Snowflake,
    Target,
    TrendingUp,
    Trophy,
    Zap,
} from "lucide-react";
import {ScreenHeader} from "./ui/ScreenHeader";
import {GlassCard} from "./ui/GlassCard";
import {StatTile} from "./progress/StatTile";
import {TrainingCalendar} from "./progress/TrainingCalendar";
import {useProgressState} from "../hooks/useProgressState";
import {computeStats} from "../utils/stats";

interface StatsScreenProps {
    onBack: () => void;
}

/**
 * The full statistics screen and the single canonical home for detailed stats.
 * Every figure comes from {@link computeStats} (PRODUCT: "show real evidence;
 * never fake progress").
 */
export function StatsScreen({onBack}: StatsScreenProps) {
    const {state} = useProgressState();
    const stats = computeStats(state);

    const tiles: {label: string; value: string; icon: ReactNode}[] = [
        {label: "Days trained", value: stats.daysTrained.toString(), icon: <CalendarCheck className="w-[22px] h-[22px]"/>},
        {label: "Rooms completed", value: stats.roomsCompleted.toString(), icon: <TrendingUp className="w-[22px] h-[22px]"/>},
        {label: "Palaces", value: stats.palaces.toString(), icon: <BookOpen className="w-[22px] h-[22px]"/>},
        {label: "Cards", value: stats.totalCards.toString(), icon: <Layers className="w-[22px] h-[22px]"/>},
        {label: "Due today", value: stats.dueToday.toString(), icon: <Flame className="w-[22px] h-[22px]"/>},
        {label: "Best quiz", value: `${stats.bestQuizAccuracy}%`, icon: <Target className="w-[22px] h-[22px]"/>},
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
                                    {stats.currentStreak}
                                </span>
                            </div>
                            <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#33417A]">
                                Current streak
                            </span>
                        </div>
                        <div className="w-px bg-[#091A7A]/15"/>
                        <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-[34px] font-bold text-[#091A7A] leading-none tabular-nums">
                                {stats.longestStreak}
                            </span>
                            <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#33417A]">
                                Longest streak
                            </span>
                        </div>
                    </div>

                    {/* Summary facts — the day-by-day view is the calendar below,
                        so the hero stays a clean headline (no repeated grid). */}
                    <div className="mt-5 flex items-center justify-center gap-2 text-[13px] font-medium text-[#33417A]">
                        <span>
                            <span className="font-bold text-[#091A7A]">{stats.daysTrained}</span> total{" "}
                            {stats.daysTrained === 1 ? "day" : "days"} trained
                        </span>
                        {state.streakFreezes > 0 && (
                            <>
                                <span className="text-[#091A7A]/25">·</span>
                                <span className="inline-flex items-center gap-1">
                                    <Snowflake className="w-3.5 h-3.5 text-[#1E5FBF]"/>
                                    <span className="font-bold text-[#091A7A]">{state.streakFreezes}</span> in
                                    reserve
                                </span>
                            </>
                        )}
                    </div>
                </GlassCard>

                {/* Level */}
                <div className="flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-card border border-[#091A7A]/[0.05]">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] flex items-center justify-center shadow-[0_6px_16px_rgba(9,26,122,0.22)]">
                        <Trophy className="w-6 h-6 text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-[#091A7A]">Level {stats.level}</p>
                        <p className="text-[13px] font-medium text-[#091A7A]/65 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-[#F59E0B]" fill="currentColor"/>
                            {stats.totalXP.toLocaleString()} XP earned
                        </p>
                    </div>
                </div>

                {/* Totals grid */}
                <div>
                    <h3 className="text-section-header text-[#091A7A] mb-3 px-1">Your Journey</h3>
                    <div className="grid grid-cols-2 gap-3.5">
                        {tiles.map((tile, index) => (
                            <StatTile
                                key={tile.label}
                                icon={tile.icon}
                                value={tile.value}
                                label={tile.label}
                                delay={index * 0.04}
                            />
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

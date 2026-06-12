import {motion} from "motion/react";
import {ArrowRight, Flame, Snowflake} from "lucide-react";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {useProgressState} from "../../hooks/useProgressState";
import {buildWeekGrid, dayKey, totalTrainingDays} from "../../utils/streak";
import {tapCard} from "../../utils/motion";

interface StreakHistorySheetProps {
    open: boolean;
    onClose: () => void;
    /** Navigate to the full Stats screen ("More in Stats"). */
    onMoreStats: () => void;
}

const WEEKS = 8;
const COLUMN_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Bottom-sheet streak overview adapted from the reference Training History
 * screen: current + longest streak, a real multi-week training calendar, and a
 * link into the full Stats screen. All figures come straight from the store.
 */
export function StreakHistorySheet({open, onClose, onMoreStats}: StreakHistorySheetProps) {
    const {state} = useProgressState();
    const grid = buildWeekGrid(state.trainingDays, WEEKS);
    const total = totalTrainingDays(state.trainingDays);
    const todayKey = dayKey(new Date());

    return (
        <KeyboardSheet
            open={open}
            onClose={onClose}
            title="Training History"
            footer={
                <motion.button
                    {...tapCard}
                    onClick={onMoreStats}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)]"
                >
                    More in Stats
                    <ArrowRight className="w-[18px] h-[18px]"/>
                </motion.button>
            }
        >
            {/* Current + longest */}
            <div className="grid grid-cols-2 gap-3">
                <SummaryStat
                    label="Current streak"
                    value={state.streakCount}
                    icon={<Flame className="w-5 h-5 text-[#F59E0B]" fill="currentColor"/>}
                />
                <SummaryStat label="Longest streak" value={state.longestStreak}/>
            </div>

            {/* Secondary facts */}
            <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-[#475569]">
                <span>
                    <span className="font-bold text-[#091A7A]">{total}</span> total{" "}
                    {total === 1 ? "day" : "days"} trained
                </span>
                {state.streakFreezes > 0 && (
                    <>
                        <span className="text-[#091A7A]/20">·</span>
                        <span className="inline-flex items-center gap-1">
                            <Snowflake className="w-3.5 h-3.5 text-[#1E5FBF]"/>
                            <span className="font-bold text-[#091A7A]">{state.streakFreezes}</span> in reserve
                        </span>
                    </>
                )}
            </div>

            {/* Multi-week calendar */}
            <div>
                <div className="grid grid-cols-7 gap-1.5 mb-2">
                    {COLUMN_LABELS.map((c, i) => (
                        <span
                            key={i}
                            className="text-center text-[11px] font-semibold text-[#475569]"
                        >
                            {c}
                        </span>
                    ))}
                </div>
                <div className="space-y-1.5">
                    {grid.map((wk, w) => (
                        <div key={w} className="grid grid-cols-7 gap-1.5">
                            {wk.map((day) => (
                                <div
                                    key={day.key}
                                    className="flex items-center justify-center"
                                    aria-label={
                                        day.future
                                            ? undefined
                                            : `${day.key}${day.trained ? " trained" : ""}`
                                    }
                                >
                                    <div
                                        className={`aspect-square w-full max-w-9 rounded-[10px] flex items-center justify-center ${
                                            day.trained
                                                ? "bg-gradient-to-br from-[#FFC71E] to-[#F59E0B]"
                                                : day.future
                                                    ? "bg-[#091A7A]/[0.03]"
                                                    : day.isToday
                                                        ? "bg-white border-2 border-[#ADC8FF]"
                                                        : "bg-[#091A7A]/[0.06]"
                                        }`}
                                    >
                                        {day.trained && (
                                            <Flame className="w-3.5 h-3.5 text-white" fill="currentColor"/>
                                        )}
                                        {!day.trained && day.isToday && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#091A7A]/50"/>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-center text-[12px] text-[#475569]">
                    {todayKey && state.trainingDays.includes(todayKey)
                        ? "Trained today. See you tomorrow."
                        : "Train today to keep the chain alive."}
                </p>
            </div>
        </KeyboardSheet>
    );
}

function SummaryStat({
                         label,
                         value,
                         icon,
                     }: {
    label: string;
    value: number;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-[#F4F8FF] p-4 flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5">
                {icon}
                <span className="text-[32px] font-bold text-[#091A7A] leading-none tabular-nums">
                    {value}
                </span>
            </div>
            <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                {label}
            </span>
        </div>
    );
}

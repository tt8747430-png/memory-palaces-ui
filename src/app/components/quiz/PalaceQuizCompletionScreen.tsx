import {motion, useReducedMotion} from "motion/react";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Flame,
    Home,
    RotateCcw,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Trophy,
} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import {QuizResults} from "./PalaceQuizScreen";
import {useProgressState} from "../../hooks/useProgressState";

interface PalaceQuizCompletionScreenProps {
    results: QuizResults;
    onBack: () => void;
    onRetake: () => void;
    onNextPalace: () => void;
}

interface Performance {
    level: string;
    Icon: LucideIcon;
    note: string;
}

function performanceFor(accuracy: number): Performance {
    if (accuracy >= 90)
        return {level: "Excellent", Icon: Trophy, note: "Near-perfect recall."};
    if (accuracy >= 80)
        return {level: "Great", Icon: Star, note: "Strong, dependable recall."};
    if (accuracy >= 70)
        return {level: "Good", Icon: TrendingUp, note: "Solid. A bit more will lock it in."};
    return {level: "Keep practicing", Icon: Target, note: "Another pass will move the needle."};
}

export function PalaceQuizCompletionScreen({
                                               results,
                                               onBack,
                                               onRetake,
                                               onNextPalace,
                                           }: PalaceQuizCompletionScreenProps) {
    const {state} = useProgressState();
    const reduce = useReducedMotion();
    const palace = state.palaces.find((p) => p.id === results.palaceId);
    const performance = performanceFor(results.accuracy);
    const PerfIcon = performance.Icon;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const stats: {
        Icon: LucideIcon;
        label: string;
        value: string;
        tile: string;
        chip: string;
    }[] = [
        {
            Icon: Target,
            label: "Accuracy",
            value: `${results.accuracy}%`,
            tile: "bg-[#ECFDF5] border-[#10B981]/15",
            chip: "bg-[#D1FAE5] text-[#047857]",
        },
        {
            Icon: Clock,
            label: "Time",
            value: formatTime(results.timeSpent),
            tile: "bg-[#EAF4FF] border-[#3D8FEF]/15",
            chip: "bg-[#D7E9FF] text-[#1E5FBF]",
        },
        {
            Icon: CheckCircle2,
            label: "Correct",
            value: `${results.score}/${results.totalQuestions}`,
            tile: "bg-[#091A7A]/[0.04] border-[#091A7A]/10",
            chip: "bg-[#091A7A]/10 text-[#091A7A]",
        },
        {
            Icon: TrendingUp,
            label: "XP gained",
            value: `+${results.xpGained}`,
            tile: "bg-[#FFF6DC] border-[#FFC71E]/30",
            chip: "bg-[#FBE6AE] text-[#A9791A]",
        },
    ];

    return (
        <div className="h-full bg-gradient-to-br from-[#ADC8FF]/25 via-white to-[#E8F2FF]/40 relative overflow-hidden flex flex-col">
            {/* One soft, navy-tinted ambient field — atmosphere, not confetti. */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-16 w-72 h-72 bg-[#4F8EFF]/10 rounded-full blur-3xl"/>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto px-6 pt-12 pb-8">
                {/* Medal — the rationed celebration: a single spring pop. */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={reduce ? false : {scale: 0, rotate: -120}}
                        animate={{scale: 1, rotate: 0}}
                        transition={{type: "spring", stiffness: 200, damping: 16, delay: 0.15}}
                        className="relative mb-6 inline-flex"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] flex items-center justify-center shadow-[0_16px_36px_rgba(9,26,122,0.30)] ring-4 ring-[#FFC71E]/35">
                            <PerfIcon className="w-11 h-11 text-white" strokeWidth={2}/>
                        </div>
                        <Sparkles className="absolute -top-1.5 -right-1.5 w-6 h-6 text-[#FFC71E] fill-[#FFC71E]/40"/>
                    </motion.div>

                    <motion.div
                        initial={reduce ? false : {opacity: 0, y: 16}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.35}}
                    >
                        <h1 className="text-2xl font-bold text-[#091A7A] mb-2 text-balance">
                            Quiz complete
                        </h1>
                        {palace && (
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-2xl">{palace.icon}</span>
                                <p className="text-[15px] font-medium text-[#091A7A]/70">
                                    {palace.name}
                                </p>
                            </div>
                        )}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#ADC8FF]/40 shadow-[0_4px_14px_rgba(9,26,122,0.06)]">
                            <PerfIcon className="w-4 h-4 text-[#091A7A]"/>
                            <span className="text-sm font-semibold text-[#091A7A]">
                                {performance.level}
                            </span>
                            <span className="text-sm text-[#091A7A]/55">·</span>
                            <span className="text-sm text-[#091A7A]/65">{performance.note}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Performance stats */}
                <motion.div
                    initial={reduce ? false : {opacity: 0, y: 24}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5}}
                    className="bg-white rounded-3xl p-6 shadow-card border border-[#091A7A]/[0.04] mb-5"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-section-header text-[#091A7A]">Your performance</h2>
                        <span className="text-[12px] font-medium text-[#091A7A]/55">
                            Best: {state.bestQuizAccuracy}%
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 mb-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className={`p-4 rounded-2xl border ${stat.tile}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${stat.chip}`}
                                >
                                    <stat.Icon className="w-5 h-5"/>
                                </div>
                                <p className="text-[12px] font-medium text-[#091A7A]/60 mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-[22px] font-bold text-[#091A7A] tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Palace mastery */}
                    <div>
                        <div className="flex justify-between text-[12px] mb-1.5">
                            <span className="font-medium text-[#091A7A]/70">Palace mastery</span>
                            <span className="font-semibold text-[#091A7A]">{palace?.progress ?? 0}%</span>
                        </div>
                        <div className="h-2.5 bg-[#091A7A]/[0.06] rounded-full overflow-hidden">
                            <motion.div
                                initial={{width: 0}}
                                animate={{width: `${palace?.progress ?? 0}%`}}
                                transition={{duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1]}}
                                className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            />
                        </div>
                    </div>

                    {/* Streak — kept as one line; XP already lives in the grid above. */}
                    <div className="mt-5 flex items-center justify-center gap-2 text-[13px] font-medium text-[#091A7A]/70">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-400/40"/>
                        {state.streakCount}-day streak going
                    </div>
                </motion.div>

                {/* Actions */}
                <div className="space-y-3">
                    <motion.button
                        initial={reduce ? false : {opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.74}}
                        whileTap={{scale: 0.98}}
                        onClick={onNextPalace}
                        className="w-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white py-4 rounded-2xl font-semibold shadow-interactive flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                    >
                        <span>Continue learning</span>
                        <ArrowRight className="w-5 h-5"/>
                    </motion.button>

                    <div className="flex gap-3">
                        <motion.button
                            initial={reduce ? false : {opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.82}}
                            whileTap={{scale: 0.98}}
                            onClick={onRetake}
                            className="flex-1 bg-white border border-[#091A7A]/10 text-[#091A7A] py-3 rounded-2xl font-medium shadow-card flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            <RotateCcw className="w-4 h-4"/>
                            <span>Retake</span>
                        </motion.button>

                        <motion.button
                            initial={reduce ? false : {opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.9}}
                            whileTap={{scale: 0.98}}
                            onClick={onBack}
                            className="flex-1 bg-white border border-[#091A7A]/10 text-[#091A7A] py-3 rounded-2xl font-medium shadow-card flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            <Home className="w-4 h-4"/>
                            <span>Home</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}

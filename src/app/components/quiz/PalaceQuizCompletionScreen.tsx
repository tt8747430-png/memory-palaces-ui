import {useEffect, useState} from "react";
import {motion} from "motion/react";
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
import {QuizResults} from "./PalaceQuizScreen";
import {useProgressState} from "../../hooks/useProgressState";

interface PalaceQuizCompletionScreenProps {
    results: QuizResults;
    onBack: () => void;
    onRetake: () => void;
    onNextPalace: () => void;
}

export function PalaceQuizCompletionScreen({
                                               results,
                                               onBack,
                                               onRetake,
                                               onNextPalace,
                                           }: PalaceQuizCompletionScreenProps) {
    const {state} = useProgressState();
    const palace = state.palaces.find(
        (p) => p.id === results.palaceId,
    );
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(
            () => setShowConfetti(false),
            3000,
        );
        return () => clearTimeout(timer);
    }, []);

    const getPerformanceLevel = () => {
        if (results.accuracy >= 90)
            return {
                level: "Excellent",
                color: "emerald",
                emoji: "🏆",
            };
        if (results.accuracy >= 80)
            return {level: "Great", color: "blue", emoji: "⭐"};
        if (results.accuracy >= 70)
            return {level: "Good", color: "orange", emoji: "👍"};
        return {
            level: "Keep Practicing",
            color: "gray",
            emoji: "💪",
        };
    };

    const performance = getPerformanceLevel();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const Confetti = () => (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: -100,
                        x: Math.random() * window.innerWidth,
                        rotate: 0,
                        opacity: 1,
                    }}
                    animate={{
                        y: window.innerHeight + 100,
                        rotate: 360,
                        opacity: 0,
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        delay: Math.random() * 2,
                        ease: "easeOut",
                    }}
                    className={`absolute w-3 h-3 ${
                        i % 4 === 0
                            ? "bg-yellow-400"
                            : i % 4 === 1
                                ? "bg-blue-400"
                                : i % 4 === 2
                                    ? "bg-emerald-400"
                                    : "bg-purple-400"
                    } rounded-full`}
                />
            ))}
        </div>
    );

    return (
        <div
            className="h-full bg-gradient-to-br from-[#ADC8FF]/20 via-white to-[#E8F2FF]/30 relative overflow-hidden flex flex-col">
            {showConfetti && <Confetti/>}

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{duration: 8, repeat: Infinity}}
                    className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-[#091A7A]/10 to-[#4F8EFF]/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col px-6 py-8">
                {/* Trophy Section */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{scale: 0, rotate: -180}}
                        animate={{scale: 1, rotate: 0}}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.3,
                        }}
                        className="mb-6 inline-block"
                    >
                        <div className="relative">
                            <div
                                className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/25">
                                <Trophy className="w-12 h-12 text-white"/>
                            </div>
                            <motion.div
                                animate={{rotate: 360}}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-0"
                            >
                                <Sparkles className="absolute -top-2 left-2 w-4 h-4 text-yellow-400"/>
                                <Sparkles className="absolute top-2 -right-2 w-5 h-5 text-orange-400"/>
                                <Sparkles className="absolute -bottom-2 right-2 w-3 h-3 text-yellow-500"/>
                                <Sparkles className="absolute bottom-2 -left-2 w-4 h-4 text-orange-300"/>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.6}}
                    >
                        <h1 className="text-2xl font-bold text-[#091A7A] mb-2">
                            Quiz Complete! 🎉
                        </h1>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-3xl">{palace?.icon}</span>
                            <p className="text-lg text-gray-600">
                                {palace?.name}
                            </p>
                        </div>
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                                performance.color === "emerald"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : performance.color === "blue"
                                        ? "bg-blue-100 text-blue-700"
                                        : performance.color === "orange"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            <span>{performance.emoji}</span>
                            <span>{performance.level}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Card */}
                <motion.div
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.8}}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/40 mb-6"
                >
                    <h2 className="text-lg font-semibold text-[#091A7A] text-center mb-6">
                        Your Performance
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl mb-2 flex items-center justify-center">
                                <Target className="w-5 h-5 text-emerald-600"/>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                                Accuracy
                            </p>
                            <p className="text-xl font-bold text-[#091A7A]">
                                {results.accuracy}%
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl mb-2 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-blue-600"/>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">Time</p>
                            <p className="text-xl font-bold text-[#091A7A]">
                                {formatTime(results.timeSpent)}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                            <div className="w-10 h-10 bg-green-100 rounded-xl mb-2 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600"/>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                                Correct
                            </p>
                            <p className="text-xl font-bold text-[#091A7A]">
                                {results.score}/{results.totalQuestions}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl mb-2 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600"/>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                                XP Gained
                            </p>
                            <p className="text-xl font-bold text-[#091A7A]">
                                +{results.xpGained}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Palace Mastery</span>
                            <span className="font-medium">
                {palace?.progress}%
              </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{width: 0}}
                                animate={{width: `${palace?.progress}%`}}
                                transition={{duration: 1, delay: 1}}
                                className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Rewards */}
                <motion.div
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 1}}
                    className="bg-gradient-to-r from-[#091A7A]/5 to-[#4F8EFF]/5 backdrop-blur-xl rounded-3xl p-6 border border-[#ADC8FF]/30 mb-6"
                >
                    <h3 className="font-semibold text-[#091A7A] mb-4 text-center">
                        Rewards Earned
                    </h3>

                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <div
                                className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                                <Star className="w-6 h-6 text-yellow-600"/>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">XP</p>
                            <p className="font-bold text-[#091A7A]">
                                +{results.xpGained}
                            </p>
                        </div>

                        <div className="text-center">
                            <div
                                className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                                <Flame className="w-6 h-6 text-orange-600"/>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                                Streak
                            </p>
                            <p className="font-bold text-[#091A7A]">
                                {state.streakCount} days
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                    <motion.button
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 1.2}}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        onClick={onNextPalace}
                        className="w-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
                    >
                        <span>Continue Learning</span>
                        <ArrowRight className="w-5 h-5"/>
                    </motion.button>

                    <div className="flex gap-3">
                        <motion.button
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 1.3}}
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            onClick={onRetake}
                            className="flex-1 bg-white/90 backdrop-blur-xl border border-white/40 text-[#091A7A] py-3 rounded-2xl font-medium shadow-sm flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4"/>
                            <span>Retake</span>
                        </motion.button>

                        <motion.button
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 1.4}}
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            onClick={onBack}
                            className="flex-1 bg-white/90 backdrop-blur-xl border border-white/40 text-[#091A7A] py-3 rounded-2xl font-medium shadow-sm flex items-center justify-center gap-2"
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
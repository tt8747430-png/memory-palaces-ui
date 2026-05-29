import {AnimatePresence, motion} from "motion/react";
import {Brain, CheckCircle, Flame, Star, Trophy, Zap,} from "lucide-react";

export interface ProgressNotificationData {
    type:
        | "xp-gain"
        | "level-up"
        | "streak"
        | "room-complete"
        | "palace-complete"
        | "quiz-complete";
    title: string;
    subtitle?: string;
    xpGain?: number;
}

interface ProgressNotificationProps {
    notification: ProgressNotificationData | null;
    onClose: () => void;
}

export function ProgressNotification({
                                         notification,
                                         onClose,
                                     }: ProgressNotificationProps) {
    const getIcon = () => {
        if (!notification) return null;

        switch (notification.type) {
            case "xp-gain":
                return (
                    <Zap
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                    />
                );
            case "level-up":
                return <Trophy className="w-6 h-6 text-yellow-400"/>;
            case "streak":
                return <Flame className="w-6 h-6 text-orange-400"/>;
            case "room-complete":
                return (
                    <CheckCircle className="w-6 h-6 text-green-400"/>
                );
            case "palace-complete":
                return <Brain className="w-6 h-6 text-purple-400"/>;
            case "quiz-complete":
                return (
                    <Star
                        className="w-6 h-6 text-blue-400"
                        fill="currentColor"
                    />
                );
            default:
                return <Zap className="w-6 h-6 text-blue-400"/>;
        }
    };

    const getColors = () => {
        if (!notification)
            return {bg: "", border: "", shadow: ""};

        switch (notification.type) {
            case "xp-gain":
                return {
                    bg: "from-yellow-500 to-orange-500",
                    border: "border-yellow-400/50",
                    shadow: "shadow-yellow-500/25",
                };
            case "level-up":
                return {
                    bg: "from-yellow-400 to-yellow-600",
                    border: "border-yellow-300/50",
                    shadow: "shadow-yellow-500/30",
                };
            case "streak":
                return {
                    bg: "from-orange-500 to-red-500",
                    border: "border-orange-400/50",
                    shadow: "shadow-orange-500/25",
                };
            case "room-complete":
                return {
                    bg: "from-green-500 to-emerald-500",
                    border: "border-green-400/50",
                    shadow: "shadow-green-500/25",
                };
            case "palace-complete":
                return {
                    bg: "from-purple-500 to-indigo-500",
                    border: "border-purple-400/50",
                    shadow: "shadow-purple-500/25",
                };
            case "quiz-complete":
                return {
                    bg: "from-[#091A7A] to-[#4F8EFF]",
                    border: "border-blue-400/50",
                    shadow: "shadow-blue-500/25",
                };
            default:
                return {
                    bg: "from-blue-500 to-purple-500",
                    border: "border-blue-400/50",
                    shadow: "shadow-blue-500/25",
                };
        }
    };

    const colors = getColors();

    return (
        <AnimatePresence>
            {notification && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Notification Card */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.8, y: 50}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.8, y: 50}}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101]"
                    >
                        <div
                            className={`
              relative p-6 bg-gradient-to-br ${colors.bg}
              rounded-3xl shadow-2xl ${colors.shadow}
              border ${colors.border} backdrop-blur-xl
              min-w-[280px] max-w-[320px]
            `}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-50"/>
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl"/>

                            {/* Content */}
                            <div className="relative z-10 text-center">
                                {/* Icon */}
                                <motion.div
                                    initial={{scale: 0, rotate: -180}}
                                    animate={{scale: 1, rotate: 0}}
                                    transition={{
                                        delay: 0.2,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    className="mb-4 flex justify-center"
                                >
                                    <div
                                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        {getIcon()}
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <motion.h3
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.3}}
                                    className="text-lg font-bold text-white mb-2"
                                >
                                    {notification.title}
                                </motion.h3>

                                {/* Subtitle */}
                                {notification.subtitle && (
                                    <motion.p
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: 0.4}}
                                        className="text-white/90 text-sm mb-4"
                                    >
                                        {notification.subtitle}
                                    </motion.p>
                                )}

                                {/* XP Gain */}
                                {notification.xpGain && (
                                    <motion.div
                                        initial={{opacity: 0, scale: 0.8}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{delay: 0.5, type: "spring"}}
                                        className="flex items-center justify-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm"
                                    >
                                        <Zap
                                            className="w-4 h-4 text-yellow-300"
                                            fill="currentColor"
                                        />
                                        <span className="text-white font-semibold text-sm">
                      +{notification.xpGain} XP
                    </span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
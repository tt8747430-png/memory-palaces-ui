import {motion} from "motion/react";
import {ArrowRight, Plus} from "lucide-react";
import {ProgressIllustration} from "../../imports";
import {useEffect, useState} from "react";

interface PalaceProgressCardProps {
    onStartTraining: () => void;
    currentProgress?: number;
    /** False on first run (no palaces yet): show a "create palace" path. */
    hasPalaces?: boolean;
    onCreatePalace?: () => void;
}

export function PalaceProgressCard({
                                       onStartTraining,
                                       currentProgress = 0,
                                       hasPalaces = true,
                                       onCreatePalace,
                                   }: PalaceProgressCardProps) {
    const [animatedProgress, setAnimatedProgress] =
        useState(currentProgress);
    const [displayProgress, setDisplayProgress] =
        useState(currentProgress);

    useEffect(() => {
        if (currentProgress !== animatedProgress) {
            const duration = 1500;
            const steps = 30;
            const startProgress = animatedProgress;
            const progressDiff = currentProgress - startProgress;
            const increment = progressDiff / steps;

            let currentStep = 0;
            const timer = setInterval(() => {
                currentStep++;
                const newProgress =
                    startProgress + increment * currentStep;
                setDisplayProgress(Math.round(newProgress));

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setDisplayProgress(currentProgress);
                    setAnimatedProgress(currentProgress);
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [currentProgress, animatedProgress]);

    const getProgressMessage = () => {
        if (displayProgress >= 80) {
            return "Almost there. Finish one more room to hit your daily goal.";
        } else if (displayProgress >= 60) {
            return "You're past halfway to your daily goal. Keep going.";
        } else if (displayProgress >= 40) {
            return `You're at ${displayProgress}% of your daily goal. Keep building your palace.`;
        } else {
            return "Start today's session and build your first rooms.";
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
            className="relative"
        >
            <motion.div
                initial={{opacity: 0, scale: 0.85, y: 12}}
                animate={{opacity: 0.95, scale: 1, y: 0}}
                transition={{
                    delay: 0.12,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute -top-6 right-2 opacity-95 z-50 pointer-events-none"
                style={{
                    width: "85px",
                    height: "85px",
                    filter:
                        "drop-shadow(0 8px 20px rgba(9, 26, 122, 0.25))",
                }}
            >
                <ProgressIllustration/>
            </motion.div>

            <div
                className="relative p-6 bg-card-glass backdrop-blur-lg rounded-[20px] shadow-card overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(173, 200, 255, 0.9) 0%, rgba(173, 200, 255, 0.7) 100%)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: `0 12px 28px rgba(9, 26, 122, 0.14)`,
                }}
            >
                <div className="relative z-10 h-full">
                    <motion.h3
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.12, duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                        className="text-section-header text-[#091A7A] mb-2 pr-24"
                    >
                        {hasPalaces ? "Today's training" : "Build your memory palace"}
                    </motion.h3>

                    <motion.p
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.18, duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                        className="text-sm font-medium text-[#33417A] mb-4 pr-16"
                    >
                        {hasPalaces
                            ? getProgressMessage()
                            : "Create a memory palace, then train your recall room by room."}
                    </motion.p>

                    {hasPalaces && (
                        <div className="w-full h-[6px] mb-5">
                            <div className="w-full h-[6px] bg-white/50 backdrop-blur-sm rounded-[3px] relative">
                                <motion.div
                                    initial={{width: 0}}
                                    animate={{width: `${displayProgress}%`}}
                                    transition={{
                                        delay: 0.3,
                                        duration: 1.0,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="h-[6px] bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] rounded-[3px] relative"
                                >
                                    <motion.div
                                        initial={{scale: 0}}
                                        animate={{scale: 1}}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.3,
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                        className="absolute right-[-6px] top-[-3px] w-[12px] h-[12px] bg-white border-2 border-[#091A7A] rounded-full shadow-sm"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {hasPalaces ? (
                        <motion.button
                            whileTap={{scale: 0.97}}
                            onClick={onStartTraining}
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#091A7A] text-white rounded-full px-5 py-3.5 shadow-interactive border-none cursor-pointer text-sm font-medium"
                        >
                            Start training
                            <ArrowRight className="w-5 h-5"/>
                        </motion.button>
                    ) : (
                        <motion.button
                            whileTap={{scale: 0.97}}
                            onClick={onCreatePalace}
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#091A7A] text-white rounded-full px-5 py-3.5 shadow-interactive border-none cursor-pointer text-sm font-medium"
                        >
                            <Plus className="w-5 h-5"/>
                            Create palace
                        </motion.button>
                    )}
                </div>

                <div
                    className="absolute inset-0 pointer-events-none rounded-[20px]"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)",
                    }}
                />
            </div>
        </motion.div>
    );
}
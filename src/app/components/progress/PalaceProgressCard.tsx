import {motion} from "motion/react";
import {ArrowRight} from "lucide-react";
import {ProgressIllustration} from "../../imports";
import {useEffect, useState} from "react";

interface PalaceProgressCardProps {
    onStartTraining: () => void;
    currentProgress?: number;
    totalRoomsCompleted?: number;
}

export function PalaceProgressCard({
                                       onStartTraining,
                                       currentProgress = 40,
                                       totalRoomsCompleted = 0,
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
            return "Almost there! Complete one more room to reach your daily goal.";
        } else if (displayProgress >= 60) {
            return "Great progress! You're more than halfway to your daily target.";
        } else if (displayProgress >= 40) {
            return `Your progress bar is at ${displayProgress}%. Continue building your palace.`;
        } else {
            return `Start your memory journey! Build rooms to reach ${displayProgress}% progress.`;
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2, duration: 0.5}}
            className="relative"
        >
            <motion.div
                initial={{opacity: 0, scale: 0.8, y: 20, rotate: -10}}
                animate={{
                    opacity: 0.95,
                    scale: 1,
                    rotate: 0,
                    y: [0, -12, 0],
                    x: [0, 4, 0],
                    rotateY: [0, 5, 0],
                }}
                transition={{
                    opacity: {delay: 0.6, duration: 0.8},
                    scale: {
                        delay: 0.6,
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                    },
                    rotate: {delay: 0.6, duration: 0.8},
                    y: {
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.2,
                    },
                    x: {
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8,
                    },
                    rotateY: {
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    },
                }}
                className="absolute -top-6 right-2 opacity-95 z-50 pointer-events-none"
                style={{
                    width: "85px",
                    height: "85px",
                    filter:
                        "drop-shadow(0 8px 20px rgba(9, 26, 122, 0.25))",
                    transformStyle: "preserve-3d",
                }}
            >
                <ProgressIllustration/>

                {[
                    "top-3 left-3",
                    "bottom-2 right-3",
                    "top-2 right-2",
                    "top-4 left-1",
                ].map((position, index) => (
                    <motion.div
                        key={index}
                        className={`absolute ${position} ${["w-2 h-2 bg-yellow-400/60", "w-1.5 h-1.5 bg-cyan-400/70", "w-1 h-1 bg-purple-400/50", "w-0.5 h-0.5 bg-pink-400/60"][index]} rounded-full`}
                        animate={{
                            scale: [0, [1.2, 1, 0.8, 1.5][index], 0],
                            opacity: [0, [0.8, 0.9, 0.6, 0.7][index], 0],
                            rotate: index === 0 ? [0, 180, 360] : undefined,
                            x: [0, [6, -5, -3, 4][index], 0],
                            y: [0, [-4, 3, 6, -8][index], 0],
                        }}
                        transition={{
                            duration: [4, 3.5, 5, 6][index],
                            repeat: Infinity,
                            delay: [2.5, 3.8, 5.2, 1.8][index],
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </motion.div>

            <div
                className="relative p-6 bg-card-glass backdrop-blur-lg rounded-[20px] shadow-card overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(173, 200, 255, 0.9) 0%, rgba(173, 200, 255, 0.7) 100%)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: `0 8px 32px rgba(9, 26, 122, 0.3), 0 4px 16px rgba(9, 26, 122, 0.2), 0 2px 8px rgba(9, 26, 122, 0.15)`,
                }}
            >
                <div className="relative z-10 h-full">
                    <motion.h3
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.4}}
                        className="text-section-header text-[#091A7A] mb-2"
                    >
                        Build Your Memory Palace!
                    </motion.h3>

                    <motion.p
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.5}}
                        className="text-subheading text-[#6B7280] mb-4 max-w-[calc(100%-64px)]"
                    >
                        {getProgressMessage()}
                    </motion.p>

                    <div className="w-[calc(100%-64px)] h-[6px] mb-4">
                        <div className="w-full h-[6px] bg-white/50 backdrop-blur-sm rounded-[3px] relative">
                            <motion.div
                                initial={{width: 0}}
                                animate={{width: `${displayProgress}%`}}
                                transition={{
                                    delay: 0.7,
                                    duration: 1.5,
                                    ease: "easeOut",
                                }}
                                className="h-[6px] bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] rounded-[3px] relative"
                            >
                                <motion.div
                                    initial={{scale: 0}}
                                    animate={{scale: 1}}
                                    transition={{
                                        delay: 1.2,
                                        duration: 0.3,
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    className="absolute right-[-6px] top-[-3px] w-[12px] h-[12px] bg-white border-2 border-[#091A7A] rounded-full shadow-sm"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileTap={{scale: 0.9}}
                    onClick={onStartTraining}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-interactive border-none cursor-pointer flex items-center justify-center z-15"
                >
                    <ArrowRight className="w-6 h-6 text-[#091A7A]"/>
                </motion.button>

                <motion.div
                    animate={{scale: [1, 1.1, 1]}}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-4 right-4 w-12 h-12 pointer-events-none rounded-full z-14 bg-[#ADC8FF]/30"
                />

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
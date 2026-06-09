import {motion} from "motion/react";
import {Flame} from "lucide-react";

interface TrainingStreakProps {
    streakCount: number;
}

export function TrainingStreak({
                                   streakCount,
                               }: TrainingStreakProps) {
    const days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ];
    const completedDays = Array.from(
        {length: 7},
        (_, i) => i < streakCount,
    );

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3, duration: 0.5}}
            className="p-6 bg-card-glass backdrop-blur-lg rounded-[20px] border border-white/20 shadow-card"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Flame
                            className="w-6 h-6 text-[#F59E0B] drop-shadow-lg"
                            fill="currentColor"
                            style={{
                                filter:
                                    "drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))",
                            }}
                        />
                    </div>
                    <span className="text-section-header text-[#091A7A]">
            Training Streak
          </span>
                </div>
                <div
                    className="px-3 py-1.5 bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/10 rounded-[50px] border border-[#F59E0B]/20">
          <span className="text-xs font-medium text-[#8A5A00]">
            {streakCount} days
          </span>
                </div>
            </div>

            <div className="flex justify-between gap-1">
                {days.map((day, index) => (
                    <div
                        key={day}
                        className="flex flex-col items-center gap-3"
                    >
            <span className="text-[10px] text-[#475569] font-medium">
              {day}
            </span>
                        <motion.div
                            initial={{scale: 0, y: 8}}
                            animate={{scale: 1, y: 0}}
                            transition={{
                                delay: 0.5 + index * 0.08,
                                type: "spring",
                                stiffness: 300,
                            }}
                            className={`w-9 h-9 rounded-[18px] flex items-center justify-center transition-all duration-200 ${
                                completedDays[index]
                                    ? "bg-gradient-to-br from-[#FFC71E] to-[#F59E0B] shadow-interactive"
                                    : "bg-[#F3F4F6] border border-white/20"
                            }`}
                        >
                            {completedDays[index] ? (
                                <Flame
                                    className="w-4 h-4 text-white drop-shadow-sm"
                                    fill="currentColor"
                                />
                            ) : (
                                <div className="w-2.5 h-2.5 bg-[#9CA3AF] rounded-full"/>
                            )}
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
import { motion } from "motion/react";
import { Star, ChevronRight } from "lucide-react";
import {
  useProgressState,
  Palace,
} from "../../hooks/useProgressState";
import { PalaceCard } from "../cards/PalaceCard";

interface PalacesOverviewProps {
  onPalaceClick: (palaceId: string) => void;
  variant?: "circular" | "cards";
}

export function PalacesOverview({
  onPalaceClick,
  variant = "circular",
}: PalacesOverviewProps) {
  const { state } = useProgressState();
  const palaces = state.palaces;

  const circumference = 2 * Math.PI * 30;

  if (variant === "cards") {
    return (
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-4 px-6">
          <motion.h3
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-semibold text-[#2c2c2c]"
          >
            Popular Palaces
          </motion.h3>
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-semibold text-[#3d8fef] flex items-center gap-1 hover:gap-2 transition-all"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 pb-2">
            {palaces.slice(0, 4).map((palace, index) => (
              <motion.div
                key={palace.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.4,
                }}
                className="flex-shrink-0 w-[220px]"
              >
                <PalaceCard
                  id={palace.id}
                  name={palace.name}
                  description={palace.description}
                  icon={palace.icon}
                  progress={palace.progress}
                  totalRooms={palace.totalRooms}
                  roomsCompleted={palace.roomsCompleted}
                  estimatedTime={`${Math.floor(palace.totalRooms * 8 / 60)}h ${(palace.totalRooms * 8) % 60}min`}
                  difficulty={
                    palace.totalRooms < 5
                      ? "Beginner"
                      : palace.totalRooms < 10
                      ? "Intermediate"
                      : "Advanced"
                  }
                  rating={4.9}
                  variant="default"
                  onClick={() => onPalaceClick(palace.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-6 mb-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -inset-8">
        {[
          { delay: 0.5, duration: 12, x: 15, y: -25 },
          { delay: 2, duration: 9, x: -12, y: -18 },
          { delay: 4, duration: 15, x: 20, y: -30 },
          { delay: 6, duration: 11, x: -8, y: -22 },
        ].map((anim, i) => (
          <motion.div
            key={i}
            className={`absolute ${["top-16 left-4", "top-32 right-8", "bottom-20 left-16", "top-24 right-2"][i]} ${["w-1.5 h-1.5", "w-1 h-1", "w-0.5 h-0.5", "w-2 h-2"][i]} bg-gradient-to-br from-[#ADC8FF]/40 to-[#091A7A]/20 rounded-full blur-sm`}
            animate={{
              y: [0, anim.y, 0],
              x: [0, anim.x, 0],
              scale: [
                [0.4, 0.3, 0.5, 0.2][i],
                [1.2, 0.9, 1.5, 1][i],
                [0.4, 0.3, 0.5, 0.2][i],
              ],
              opacity: [
                [0.2, 0.3, 0.4, 0.2][i],
                [0.7, 0.6, 0.8, 0.5][i],
                [0.2, 0.3, 0.4, 0.2][i],
              ],
              rotate: i === 3 ? [0, 180, 360] : undefined,
            }}
            transition={{
              duration: anim.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: anim.delay,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <motion.h3
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-section-header text-[#091A7A]"
        >
          Your Memory Palaces
        </motion.h3>
        <motion.button
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.98 }}
          className="text-small text-[#6B7280] px-3 py-1 rounded-[50px] transition-all duration-200 hover:bg-white/20"
        >
          View all
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {palaces.map((palace, index) => (
          <motion.div
            key={palace.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7 + index * 0.1,
              duration: 0.5,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPalaceClick(palace.id)}
            className="relative flex-1 cursor-pointer"
          >
            <motion.div
              className="absolute -top-4 right-2 opacity-90 z-50 pointer-events-none text-5xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{
                opacity: 0.9,
                scale: 1,
                y: [0, -8, 0],
                x: [0, 3, 0],
                rotate: [0, 2, -1, 0],
              }}
              transition={{
                opacity: {
                  delay: 0.8 + index * 0.2,
                  duration: 0.8,
                },
                scale: {
                  delay: 0.8 + index * 0.2,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200,
                },
                y: {
                  duration: 6 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1 + index * 0.3,
                },
                x: {
                  duration: 8 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5 + index * 0.4,
                },
                rotate: {
                  duration: 10 + index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.6,
                },
              }}
              style={{
                filter:
                  "drop-shadow(0 6px 20px rgba(9, 26, 122, 0.15))",
              }}
            >
              {palace.icon}

              {[
                {
                  className: "w-1.5 h-1.5 bg-yellow-400/60",
                  pos: "-top-2 -left-2",
                },
                {
                  className: "w-1 h-1 bg-cyan-400/70",
                  pos: "-bottom-1 -right-2",
                },
                {
                  className: "w-0.5 h-0.5 bg-purple-400/50",
                  pos: "top-1 right-1",
                },
              ].map((sparkle, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${sparkle.pos} ${sparkle.className} rounded-full`}
                  animate={{
                    scale: [0, [1, 1.2, 0.8][i], 0],
                    opacity: [0, [0.8, 0.9, 0.6][i], 0],
                    rotate: i === 0 ? [0, 180, 360] : undefined,
                    x: [0, [4, -3, -3][i], 0],
                    y: [0, [-3, 5, 6][i], 0],
                  }}
                  transition={{
                    duration: [3, 2.5, 4][i] + index * 0.5,
                    repeat: Infinity,
                    delay: [2, 3, 4][i] + index * 0.8,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>

            <div
              className="relative p-4 backdrop-blur-lg border rounded-[40px] overflow-hidden group h-[155px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(173, 200, 255, 0.9) 0%, rgba(173, 200, 255, 0.7) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                boxShadow:
                  "0 25px 50px -12px rgba(9, 26, 122, 0.25)",
              }}
            >
              {palace.progress >= 70 && (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 1 + index * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="absolute -top-2 -right-2 z-30 p-1 rounded-full bg-gradient-to-br from-[#facc15] to-[#f97316]"
                >
                  <Star
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                  />
                </motion.div>
              )}

              <div className="h-full flex flex-col items-center justify-center text-center gap-[2px]">
                <motion.div className="relative">
                  <svg
                    viewBox="0 0 80 80"
                    className="size-20"
                    style={{
                      filter:
                        "drop-shadow(0 4px 8px rgba(9, 26, 122, 0.15))",
                    }}
                  >
                    <defs>
                      <linearGradient
                        id={`progressGradient-${palace.id}`}
                        x1="0%"
                        y1="100%"
                        x2="0%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#091a7a" />
                        <stop
                          offset="50%"
                          stopColor="#1a2fb8"
                        />
                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                        />
                      </linearGradient>
                    </defs>

                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    <motion.circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke={`url(#progressGradient-${palace.id})`}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{
                        strokeDashoffset: circumference,
                      }}
                      animate={{
                        strokeDashoffset:
                          circumference -
                          (palace.progress / 100) *
                            circumference,
                      }}
                      transition={{
                        delay: 0.7 + index * 0.1,
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                      transform="rotate(-90 40 40)"
                    />
                  </svg>

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 1 + index * 0.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="absolute inset-0 flex items-center justify-center text-section-header text-[#091A7A]"
                  >
                    {palace.progress}%
                  </motion.div>
                </motion.div>

                <div className="space-y-1">
                  <h4 className="text-subheading text-[#091A7A]">
                    {palace.name}
                  </h4>
                  <p className="text-tiny text-[#525252]">
                    {palace.roomsCompleted}/{palace.totalRooms}{" "}
                    rooms
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none rounded-[40px] bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
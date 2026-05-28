import { motion, AnimatePresence } from "motion/react";
import { Zap, Plus } from "lucide-react";

interface InlineXPNotificationProps {
  show: boolean;
  xpGain: number;
  onComplete?: () => void;
}

export function InlineXPNotification({
  show,
  xpGain,
  onComplete,
}: InlineXPNotificationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, -2, 2, 0],
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm border border-green-400/30"
          >
            {/* Animated Plus Icon */}
            <motion.div
              animate={{ rotate: [0, 180] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
            </motion.div>

            {/* XP Text */}
            <span className="font-bold text-sm">
              {xpGain} XP
            </span>

            {/* Lightning Icon */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                filter: [
                  "brightness(1)",
                  "brightness(1.5)",
                  "brightness(1)",
                ],
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: 1,
              }}
            >
              <Zap
                className="w-4 h-4 text-yellow-300"
                fill="currentColor"
              />
            </motion.div>
          </motion.div>

          {/* Sparkle Effects */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 50],
                y: [0, (Math.random() - 0.5) * 50],
              }}
              transition={{
                duration: 1.2,
                delay: 0.2 + i * 0.08,
                ease: "easeOut",
              }}
              className={`absolute w-2 h-2 rounded-full ${
                i % 4 === 0
                  ? "bg-yellow-300"
                  : i % 4 === 1
                    ? "bg-green-300"
                    : i % 4 === 2
                      ? "bg-white"
                      : "bg-emerald-300"
              }`}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
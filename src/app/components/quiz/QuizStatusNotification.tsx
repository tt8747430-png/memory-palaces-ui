import { motion, AnimatePresence } from "motion/react";
import { Zap, CheckCircle, XCircle } from "lucide-react";

interface QuizStatusNotificationProps {
  show: boolean;
  isCorrect: boolean;
  xpGained: number;
}

export function QuizStatusNotification({
  show,
  isCorrect,
  xpGained,
}: QuizStatusNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`
            flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-lg
            ${
              isCorrect
                ? "bg-emerald-500/90 border-emerald-400/50 text-white"
                : "bg-red-500/90 border-red-400/50 text-white"
            }
          `}
          >
            <div className="flex-shrink-0">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>

            <span className="font-medium text-sm">
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>

            {isCorrect && xpGained > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1"
              >
                <Zap
                  className="w-3 h-3 text-yellow-300"
                  fill="currentColor"
                />
                <span className="text-xs font-medium">
                  +{xpGained}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Zap, BellRing, Plus, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { StatusBar } from "../ui/StatusBar";

interface ProgressHeaderProps {
  profileImage: string;
  userName: string;
  userXP: number;
  recentXPGain?: number;
  showXPAnimation?: boolean;
  onXPAnimationComplete?: () => void;
  levelProgress?: {
    currentLevel: number;
    xpForNextLevel: number;
    xpInCurrentLevel: number;
  };
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  hasNotifications?: boolean;
}

export function ProgressHeader({
  profileImage,
  userName,
  userXP,
  recentXPGain,
  showXPAnimation,
  onXPAnimationComplete,
  levelProgress,
  onNotificationClick,
  onProfileClick,
  hasNotifications = true,
}: ProgressHeaderProps) {
  const [animatedXP, setAnimatedXP] = useState(userXP);
  const [showFloatingXP, setShowFloatingXP] = useState(false);

  useEffect(() => {
    if (showXPAnimation && recentXPGain) {
      setShowFloatingXP(true);

      const startXP = userXP - recentXPGain;
      const duration = 1500;
      const steps = 30;
      const increment = recentXPGain / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const newXP = startXP + increment * currentStep;
        setAnimatedXP(Math.round(newXP));

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedXP(userXP);
          setTimeout(() => {
            setShowFloatingXP(false);
            onXPAnimationComplete?.();
          }, 1000);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedXP(userXP);
    }
  }, [
    userXP,
    recentXPGain,
    showXPAnimation,
    onXPAnimationComplete,
  ]);

  useEffect(() => {
    if (!showXPAnimation) {
      setAnimatedXP(userXP);
    }
  }, [userXP, showXPAnimation]);

  return (
    <div>
      {/* Status Bar */}
      <StatusBar textColor="black" />

      {/* Header Content */}
      <div className="flex items-start justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <motion.button
              onClick={onProfileClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative cursor-pointer"
            >
              <div className="relative">
                <ImageWithFallback
                  src={profileImage}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-card"
                  style={{ objectPosition: "center 20%" }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <Brain
                    className="w-3 h-3 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </motion.button>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-main-heading text-[#091A7A] leading-tight truncate"
              >
                Hi {userName}!
              </motion.h2>
              {levelProgress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] text-white text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 shadow-sm"
                >
                  Lv. {levelProgress.currentLevel}
                </motion.div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-1.5 relative"
            >
              <motion.div
                animate={{
                  rotate: showXPAnimation
                    ? [0, 360]
                    : [0, 12, -12, 0],
                  scale: showXPAnimation ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: showXPAnimation ? 1 : 2.5,
                  repeat: showXPAnimation ? 1 : Infinity,
                  repeatDelay: showXPAnimation ? 0 : 4,
                }}
              >
                <Zap
                  className="w-4 h-4 text-[#F59E0B] drop-shadow-sm"
                  fill="currentColor"
                />
              </motion.div>
              <motion.span
                animate={{
                  scale: showXPAnimation ? [1, 1.1, 1] : 1,
                  color: showXPAnimation
                    ? ["#091A7A", "#10B981", "#091A7A"]
                    : "#091A7A",
                }}
                transition={{
                  duration: showXPAnimation ? 1.5 : 0,
                }}
                className="text-small font-medium truncate"
              >
                {animatedXP.toLocaleString()} XP
              </motion.span>

              <AnimatePresence>
                {showFloatingXP && recentXPGain && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -30, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut",
                    }}
                    className="absolute -top-8 left-12 flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap z-10"
                  >
                    <Plus className="w-3 h-3" />
                    {recentXPGain} XP
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <motion.button
          onClick={onNotificationClick}
          whileTap={{ scale: 0.95 }}
          className="relative w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20 flex-shrink-0"
        >
          <BellRing className="w-5 h-5 text-[#091A7A] stroke-[1.5]" />
          {hasNotifications && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF4444] rounded-full border-2 border-white shadow-sm"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
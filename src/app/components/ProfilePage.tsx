import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  Settings,
  Award,
  Zap,
  Calendar,
  Target,
  Book,
  TrendingUp,
  Trophy,
  Crown,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { useProgressState } from "../hooks/useProgressState";
import { useRef, useState } from "react";

const achievements = [
  {
    id: 1,
    title: "First Palace",
    description: "Created your first memory palace",
    icon: Crown,
    earned: true,
  },
  {
    id: 2,
    title: "Week Warrior",
    description: "7-day learning streak",
    icon: Calendar,
    earned: false,
  },
  {
    id: 3,
    title: "Palace Master",
    description: "Completed a full palace",
    icon: Trophy,
    earned: true,
  },
  {
    id: 4,
    title: "XP Champion",
    description: "Earned 2,000+ XP",
    icon: Zap,
    earned: true,
  },
  {
    id: 5,
    title: "Perfectionist",
    description: "100% accuracy in quiz",
    icon: Target,
    earned: false,
  },
  {
    id: 6,
    title: "Dedicated Learner",
    description: "Completed 10+ rooms",
    icon: Star,
    earned: true,
  },
];

interface ProfilePageProps {
  onOpenSettings: () => void;
}

export function ProfilePage({ onOpenSettings }: ProfilePageProps) {
  const { state } = useProgressState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const [activeTab, setActiveTab] = useState<"statistics" | "achievements">("statistics");

  // Modern Parallax & Overscroll (Pull-to-refresh style)
  const headerOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 120], [1, 0.95]);
  const headerY = useTransform(scrollY, [0, 120], [0, 40]);
  
  // Magic: Negative scrollY (overscroll on iOS/Mac) scales up the profile image
  const imageScale = useTransform(scrollY, [-150, 0], [1.3, 1]);
  const imageY = useTransform(scrollY, [-150, 0], [20, 0]);

  const compactHeaderOpacity = useTransform(scrollY, [80, 120], [0, 1]);
  const gradientOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerPointerEvents = useTransform(headerOpacity, (v) => (v > 0.5 ? "auto" : "none"));

  const levelProgress = {
    currentLevel: state.currentLevel,
    xpForNextLevel: (state.currentLevel + 1) * 250,
    xpInCurrentLevel: state.userXP % 250,
  };

  const levelProgressPercent = (levelProgress.xpInCurrentLevel / levelProgress.xpForNextLevel) * 100;
  const xpForNextLevel = levelProgress.xpForNextLevel - levelProgress.xpInCurrentLevel;

  const stats = [
    { label: "Total XP", value: state.userXP.toLocaleString(), icon: Zap, color: "from-yellow-400 to-yellow-600", shadow: "shadow-yellow-500/20" },
    { label: "Current Streak", value: `${state.streakCount} days`, icon: Calendar, color: "from-orange-400 to-orange-600", shadow: "shadow-orange-500/20" },
    { label: "Palaces", value: state.palaces.length.toString(), icon: Book, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20" },
    { label: "Rooms Complete", value: state.totalRoomsCompleted.toString(), icon: TrendingUp, color: "from-green-400 to-green-600", shadow: "shadow-green-500/20" },
  ];

  return (
    <div ref={scrollRef} className="size-full overflow-y-auto scrollbar-hide relative bg-[#FAFAFC] pb-[140px]">
      
      {/* Sticky Compact Header */}
      <motion.div
        style={{ opacity: compactHeaderOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-black/5"
              style={{ objectPosition: "center 20%" }}
            />
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">Memory Master</h2>
              <p className="text-[11px] font-medium text-gray-500">Lv. {levelProgress.currentLevel}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="w-9 h-9 bg-gray-100/80 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Decorative Background Mesh/Gradient */}
      <motion.div
        style={{ opacity: gradientOpacity }}
        className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-[#ADC8FF]/30 via-[#E2EBFF]/10 to-transparent pointer-events-none"
      />

      {/* Large Header */}
      <motion.div
        style={{ opacity: headerOpacity, scale: headerScale, y: headerY, pointerEvents: headerPointerEvents }}
        className="relative px-6 pt-12 pb-8 will-change-transform"
      >
        <div className="flex items-center justify-end mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="w-11 h-11 bg-white/60 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-sm border border-white/80 text-gray-700 hover:bg-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex flex-col items-center text-center space-y-5">
          <motion.div style={{ scale: imageScale, y: imageY }} className="relative origin-bottom">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#091A7A] to-[#4F8EFF] rounded-[2rem] blur-xl opacity-20 transform scale-90 translate-y-2" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
              alt="Profile"
              className="relative w-[104px] h-[104px] rounded-[2rem] border-[3px] border-white shadow-xl object-cover bg-white"
              style={{ objectPosition: "center 20%" }}
            />
            <div className="absolute -bottom-2.5 -right-2.5 px-3 py-1 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700/50">
              <span className="text-white font-bold text-xs tracking-wide">
                Lv.{levelProgress.currentLevel}
              </span>
            </div>
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Memory Master</h1>
            <p className="text-[15px] text-gray-500 font-medium">Learning enthusiast</p>
          </div>

          <div className="w-full max-w-[280px] space-y-2.5 pt-2">
            <div className="flex justify-between text-[13px] font-medium text-gray-500">
              <span>Level {levelProgress.currentLevel}</span>
              <span>{xpForNextLevel} XP left</span>
            </div>
            <div className="h-3.5 bg-gray-200/60 rounded-full overflow-hidden shadow-inner relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgressPercent}%` }}
                transition={{ type: "spring", bounce: 0.1, duration: 1.2, delay: 0.1 }}
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="px-6 relative z-10">
        {/* Animated Custom Segmented Control */}
        <div className="flex p-1 mb-8 bg-black/5 backdrop-blur-xl rounded-[20px] relative">
          {(["statistics", "achievements"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[14px] font-semibold capitalize z-10 transition-colors ${
                activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
          {/* Active pill background */}
          <div className="absolute inset-1 flex pointer-events-none">
            <div className="flex-1 flex" style={{ justifyContent: activeTab === "statistics" ? "flex-start" : "flex-end" }}>
              <motion.div
                layoutId="profile-tab-indicator"
                className="w-1/2 h-full bg-white rounded-[16px] shadow-sm border border-black/[0.04]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === "statistics" && (
              <motion.div
                key="statistics"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="space-y-6"
              >
                <h3 className="font-bold text-[17px] text-gray-900 px-1">Your Journey</h3>
                <div className="grid grid-cols-2 gap-3.5">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, type: "spring", bounce: 0.4 }}
                      className="p-4 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group"
                    >
                      <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-[14px] flex items-center justify-center mb-4 ${stat.shadow} shadow-lg`}>
                        <stat.icon className="w-[22px] h-[22px] text-white" />
                      </div>
                      <p className="text-[28px] font-bold text-gray-900 tracking-tight mb-1">{stat.value}</p>
                      <p className="text-[13px] font-medium text-gray-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-[17px] text-gray-900">Badges & Awards</h3>
                  <span className="text-[13px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {achievements.filter((a) => a.earned).length}/{achievements.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, type: "spring", bounce: 0 }}
                      className={`p-4 rounded-[24px] border transition-all ${
                        achievement.earned
                          ? "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-gray-100"
                          : "bg-gray-50/50 border-gray-100/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-[18px] flex items-center justify-center ${
                            achievement.earned
                              ? "bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-500/20"
                              : "bg-gray-100"
                          }`}
                        >
                          <achievement.icon className={`w-[26px] h-[26px] ${achievement.earned ? "text-white" : "text-gray-300"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className={`text-[16px] font-bold ${achievement.earned ? "text-gray-900" : "text-gray-400"}`}>
                              {achievement.title}
                            </h4>
                            {achievement.earned && <Award className="w-[18px] h-[18px] text-green-500 fill-green-500/20" />}
                          </div>
                          <p className={`text-[13px] font-medium leading-tight ${achievement.earned ? "text-gray-500" : "text-gray-400"}`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
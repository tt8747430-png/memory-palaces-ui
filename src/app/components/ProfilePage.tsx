import { motion, useScroll, useTransform } from "motion/react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

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

export function ProfilePage({
  onOpenSettings,
}: ProfilePageProps) {
  const { state } = useProgressState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const [activeTab, setActiveTab] = useState("statistics");

  // Parallax and scale transformations based on scroll
  const headerOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 120], [1, 0.9]);
  const headerY = useTransform(scrollY, [0, 120], [0, -40]);
  const headerMaxHeight = useTransform(scrollY, [0, 120], [500, 0]);
  const compactHeaderOpacity = useTransform(scrollY, [80, 120], [0, 1]);
  const gradientOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerPointerEvents = useTransform(headerOpacity, (value) =>
    value > 0.5 ? "auto" : "none"
  );

  const levelProgress = {
    currentLevel: state.currentLevel,
    xpForNextLevel: (state.currentLevel + 1) * 250,
    xpInCurrentLevel: state.userXP % 250,
  };

  const levelProgressPercent =
    (levelProgress.xpInCurrentLevel /
      levelProgress.xpForNextLevel) *
    100;
  const xpForNextLevel =
    levelProgress.xpForNextLevel -
    levelProgress.xpInCurrentLevel;

  const stats = [
    {
      label: "Total XP",
      value: state.userXP.toLocaleString(),
      icon: Zap,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: "Current Streak",
      value: `${state.streakCount} days`,
      icon: Calendar,
      color: "from-orange-400 to-orange-600",
    },
    {
      label: "Palaces",
      value: state.palaces.length.toString(),
      icon: Book,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Rooms Complete",
      value: state.totalRoomsCompleted.toString(),
      icon: TrendingUp,
      color: "from-green-400 to-green-600",
    },
  ];

  return (
    <div className="size-full flex flex-col relative bg-gradient-to-b from-[#ADC8FF]/20 to-white">
      {/* Sticky Compact Header */}
      <motion.div
        style={{ opacity: compactHeaderOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-b border-[#E5E5EA] shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              style={{ objectPosition: "center 20%" }}
            />
            <div>
              <h2 className="text-sm font-bold text-[#091A7A]">Memory Master</h2>
              <p className="text-xs text-[#091A7A]/60">Lv. {levelProgress.currentLevel}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="w-10 h-10 bg-[#F5F5F7] rounded-full flex items-center justify-center"
          >
            <Settings className="w-4 h-4 text-[#091A7A]" />
          </motion.button>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        style={{ maxHeight: headerMaxHeight }}
        className="relative overflow-hidden flex-shrink-0 transition-all"
      >
        <motion.div
          style={{ opacity: gradientOpacity }}
          className="absolute inset-0 bg-gradient-to-br from-[#091A7A]/10 via-[#ADC8FF]/20 to-transparent pointer-events-none"
        />

        <motion.div
          style={{
            opacity: headerOpacity,
            scale: headerScale,
            y: headerY,
            pointerEvents: headerPointerEvents
          }}
          className="relative p-6 will-change-transform"
        >
          <div className="flex items-center justify-end mb-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSettings}
              className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-[20px] flex items-center justify-center shadow-card border border-white/20"
            >
              <Settings className="w-5 h-5 text-[#091A7A]" />
            </motion.button>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                style={{ objectPosition: "center 20%" }}
              />
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-[#091A7A] to-[#1a2b8a] rounded-full shadow-lg">
                <span className="text-white font-bold text-sm">
                  Lv.{levelProgress.currentLevel}
                </span>
              </div>
            </motion.div>

            <div>
              <h1 className="text-2xl font-bold text-[#091A7A]">
                Memory Master
              </h1>
              <p className="text-[#091A7A]/70">
                Learning enthusiast
              </p>
            </div>

            {/* Level Progress */}
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm text-[#091A7A]/70">
                <span>Level {levelProgress.currentLevel}</span>
                <span>{xpForNextLevel} XP to next level</span>
              </div>
              <div className="h-3 bg-white/60 rounded-full overflow-hidden border border-white/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${levelProgressPercent}%`,
                  }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide pb-[140px]">
        <div className="p-6 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/40 backdrop-blur-md rounded-2xl h-auto p-1 border border-white/60">
              <TabsTrigger value="statistics" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-[#091A7A] data-[state=active]:shadow-sm text-[#091A7A]/70">
                Statistics
              </TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-[#091A7A] data-[state=active]:shadow-sm text-[#091A7A]/70">
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statistics" className="mt-0 outline-none">
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-[#091A7A] mb-4">
                    Your Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          duration: 0.4,
                        }}
                        className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card"
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-sm`}
                        >
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-[#091A7A]">
                          {stat.value}
                        </p>
                        <p className="text-xs text-[#091A7A]/70">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0 outline-none">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#091A7A]">
                    Badges & Awards
                  </h3>
                  <span className="text-sm text-[#091A7A]/70">
                    {achievements.filter((a) => a.earned).length}/
                    {achievements.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + index * 0.08,
                        duration: 0.4,
                      }}
                      className={`p-4 rounded-2xl border transition-all ${
                        achievement.earned
                          ? "bg-gradient-to-r from-green-50 to-green-100/50 border-green-200 shadow-sm"
                          : "bg-white/60 border-white/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            achievement.earned
                              ? "bg-gradient-to-br from-green-400 to-green-600 shadow-md"
                              : "bg-gray-200"
                          }`}
                        >
                          <achievement.icon
                            className={`w-6 h-6 ${
                              achievement.earned
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`font-semibold ${
                                achievement.earned
                                  ? "text-green-800"
                                  : "text-[#091A7A]/60"
                              }`}
                            >
                              {achievement.title}
                            </h4>
                            {achievement.earned && (
                              <Award className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              achievement.earned
                                ? "text-green-700"
                                : "text-[#091A7A]/50"
                            }`}
                          >
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
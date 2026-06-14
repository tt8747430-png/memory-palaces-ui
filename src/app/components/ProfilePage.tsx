import {AnimatePresence, motion, useReducedMotion, useTransform} from "motion/react";
import {
    Award,
    BarChart3,
    Book,
    Calendar,
    ChevronRight,
    Crown,
    Flame,
    Settings,
    Star,
    Target,
    TrendingUp,
    Trophy,
    Zap,
} from "lucide-react";
import {Avatar} from "./ui/Avatar";
import {StatTile} from "./progress/StatTile";
import {useProgressState} from "../hooks/useProgressState";
import {useProfile} from "../hooks/useProfile";
import {computeStats} from "../utils/stats";
import {useContainerScroll} from "../hooks/useCollapsibleHeader";
import {useMemo, useState} from "react";

interface ProfilePageProps {
    onOpenSettings: () => void;
    /** Open the full Stats screen ("View full stats"). */
    onOpenStats: () => void;
}

export function ProfilePage({onOpenSettings, onOpenStats}: ProfilePageProps) {
    const {state} = useProgressState();
    const {profile, initials} = useProfile();
    const {ref: scrollRef, scrollY} = useContainerScroll();
    const [activeTab, setActiveTab] = useState<"statistics" | "achievements">("statistics");
    const reduce = useReducedMotion();

    // Parallax: the large header recedes as you scroll, the compact header fades
    // in. Under reduced motion we keep the opacity crossfade but drop the
    // scale/translate transforms (the header just scrolls normally).
    const headerOpacity = useTransform(scrollY, [0, 110], [1, 0]);
    const headerScale = useTransform(scrollY, [0, 110], reduce ? [1, 1] : [1, 0.95]);
    const headerY = useTransform(scrollY, [0, 110], reduce ? [0, 0] : [0, 36]);

    // Overscroll (negative scrollY on iOS/Mac) gently enlarges the avatar.
    const imageScale = useTransform(scrollY, [-150, 0], reduce ? [1, 1] : [1.3, 1]);
    const imageY = useTransform(scrollY, [-150, 0], reduce ? [0, 0] : [20, 0]);

    const compactHeaderOpacity = useTransform(scrollY, [70, 110], [0, 1]);
    const compactHeaderPointer = useTransform(compactHeaderOpacity, (v) => (v > 0.5 ? "auto" : "none"));
    const headerPointerEvents = useTransform(headerOpacity, (v) => (v > 0.5 ? "auto" : "none"));

    const levelProgress = {
        currentLevel: state.currentLevel,
        xpForNextLevel: (state.currentLevel + 1) * 250,
        xpInCurrentLevel: state.userXP % 250,
    };

    const levelProgressPercent = (levelProgress.xpInCurrentLevel / levelProgress.xpForNextLevel) * 100;
    const xpForNextLevel = levelProgress.xpForNextLevel - levelProgress.xpInCurrentLevel;

    // A lean glance — the full breakdown lives on the Stats screen (one home for
    // detailed stats). Sourced from the shared computeStats() so it never drifts.
    const stats = computeStats(state);
    const headlineTiles = [
        {label: "Total XP", value: stats.totalXP.toLocaleString(), icon: <Zap className="w-[22px] h-[22px]"/>},
        {
            label: "Current streak",
            value: `${stats.currentStreak} ${stats.currentStreak === 1 ? "day" : "days"}`,
            icon: <Flame className="w-[22px] h-[22px]"/>,
        },
        {label: "Palaces", value: stats.palaces.toString(), icon: <Book className="w-[22px] h-[22px]"/>},
        {label: "Rooms done", value: stats.roomsCompleted.toString(), icon: <TrendingUp className="w-[22px] h-[22px]"/>},
    ];

    // Achievements reflect real progress where the data supports it, so the page
    // shows honest evidence instead of decorative badges (PRODUCT: "show real evidence").
    const achievements = useMemo(() => {
        const palaceCompleted = state.palaces.some(
            (p) => p.totalRooms > 0 && p.roomsCompleted >= p.totalRooms
        );
        return [
            {
                id: 1,
                title: "First Palace",
                description: "Built your first memory palace",
                icon: Crown,
                earned: state.palaces.length >= 1,
            },
            {
                id: 2,
                title: "Week Warrior",
                description: "Kept a 7-day training streak",
                icon: Calendar,
                earned: state.streakCount >= 7,
            },
            {
                id: 3,
                title: "Palace Master",
                description: "Finished every room in a palace",
                icon: Trophy,
                earned: palaceCompleted,
            },
            {
                id: 4,
                title: "XP Champion",
                description: "Earned 2,000 XP",
                icon: Zap,
                earned: state.userXP >= 2000,
            },
            {
                id: 5,
                title: "Perfectionist",
                description: "Scored 100% on a quiz",
                icon: Target,
                earned: state.bestQuizAccuracy >= 100,
            },
            {
                id: 6,
                title: "Dedicated Learner",
                description: "Completed 10 rooms",
                icon: Star,
                earned: state.totalRoomsCompleted >= 10,
            },
        ];
    }, [
        state.palaces,
        state.streakCount,
        state.userXP,
        state.totalRoomsCompleted,
        state.bestQuizAccuracy,
    ]);

    const earnedCount = achievements.filter((a) => a.earned).length;

    const subtitle =
        state.palaces.length > 0
            ? `${state.palaces.length} ${state.palaces.length === 1 ? "palace" : "palaces"} · ${state.streakCount}-day streak`
            : "Build your first palace to begin";

    return (
        <div ref={scrollRef} className="size-full overflow-y-auto scrollbar-hide relative pb-[112px]">

            {/* Sticky compact header — fades in once the large header scrolls away */}
            <motion.div
                style={{opacity: compactHeaderOpacity, pointerEvents: compactHeaderPointer}}
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-[#091A7A]/[0.06] shadow-[0_4px_24px_rgba(9,26,122,0.04)]"
            >
                <div className="h-safe-top"/>
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={profile.avatar}
                            name={profile.name}
                            initials={initials}
                            className="w-9 h-9 rounded-full border border-[#091A7A]/10"
                            initialsClassName="text-[12px]"
                        />
                        <div>
                            <h2 className="text-[15px] font-semibold text-[#091A7A] leading-tight">{profile.name || "Your name"}</h2>
                            <p className="text-[11px] font-medium text-[#091A7A]/60">Level {levelProgress.currentLevel}</p>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{scale: 0.9}}
                        onClick={onOpenSettings}
                        aria-label="Open settings"
                        className="w-9 h-9 bg-[#EAF4FF] rounded-full flex items-center justify-center text-[#091A7A] hover:bg-[#dcebff] transition-colors"
                    >
                        <Settings className="w-4 h-4"/>
                    </motion.button>
                </div>
            </motion.div>

            {/* Clear the notch before the hero */}
            <div className="h-safe-top"/>

            {/* Large header */}
            <motion.div
                style={{opacity: headerOpacity, scale: headerScale, y: headerY, pointerEvents: headerPointerEvents}}
                className="relative px-6 pt-6 pb-8 will-change-transform origin-top"
            >
                <div className="flex items-center justify-end mb-4">
                    <motion.button
                        whileTap={{scale: 0.9}}
                        onClick={onOpenSettings}
                        aria-label="Open settings"
                        className="w-11 h-11 bg-white/70 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_6px_16px_rgba(9,26,122,0.08)] border border-white/80 text-[#091A7A] hover:bg-white transition-colors"
                    >
                        <Settings className="w-5 h-5"/>
                    </motion.button>
                </div>

                <div className="flex flex-col items-center text-center space-y-5">
                    <motion.div style={{scale: imageScale, y: imageY}} className="relative origin-bottom">
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-[#091A7A] to-[#4F8EFF] rounded-[2rem] blur-xl opacity-25 transform scale-90 translate-y-2"/>
                        <Avatar
                            src={profile.avatar}
                            name={profile.name}
                            initials={initials}
                            className="relative w-[104px] h-[104px] rounded-[2rem] border-[3px] border-white shadow-[0_12px_32px_rgba(9,26,122,0.18)]"
                            initialsClassName="text-[40px]"
                        />
                        <div
                            className="absolute -bottom-2.5 -right-2.5 px-3 py-1 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-xl shadow-[0_6px_16px_rgba(9,26,122,0.30)] border border-white/30">
                            <span className="text-white font-bold text-xs tracking-wide">
                                Lv.{levelProgress.currentLevel}
                            </span>
                        </div>
                    </motion.div>

                    <div className="space-y-1">
                        <h1 className="text-[26px] font-bold text-[#091A7A] tracking-tight">{profile.name || "Your name"}</h1>
                        <p className="text-[14px] text-[#091A7A]/70 font-medium">{subtitle}</p>
                    </div>

                    <div className="w-full max-w-[280px] space-y-2.5 pt-2">
                        <div className="flex justify-between text-[13px] font-semibold text-[#091A7A]/70">
                            <span>Level {levelProgress.currentLevel}</span>
                            <span>{xpForNextLevel} XP to go</span>
                        </div>
                        <div className="h-3.5 bg-[#091A7A]/[0.08] rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{width: 0}}
                                animate={{width: `${levelProgressPercent}%`}}
                                transition={{ease: [0.22, 1, 0.36, 1], duration: 0.9, delay: 0.15}}
                                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="px-6 relative z-10">
                {/* Segmented control */}
                <div className="flex p-1 mb-8 bg-[#091A7A]/[0.06] rounded-[20px] relative">
                    {(["statistics", "achievements"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            aria-pressed={activeTab === tab}
                            className={`flex-1 py-3 text-[14px] font-semibold capitalize z-10 transition-colors ${
                                activeTab === tab ? "text-[#091A7A]" : "text-[#091A7A]/50 hover:text-[#091A7A]/80"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                    <div className="absolute inset-1 flex pointer-events-none">
                        <div className="flex-1 flex"
                             style={{justifyContent: activeTab === "statistics" ? "flex-start" : "flex-end"}}>
                            <motion.div
                                layoutId="profile-tab-indicator"
                                className="w-1/2 h-full bg-white rounded-[16px] shadow-[0_2px_10px_rgba(9,26,122,0.10)]"
                                transition={{type: "spring", bounce: 0.15, duration: 0.45}}
                            />
                        </div>
                    </div>
                </div>

                {/* Tab content */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {activeTab === "statistics" && (
                            <motion.div
                                key="statistics"
                                initial={{opacity: 0, y: 12}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -12}}
                                transition={{ease: [0.22, 1, 0.36, 1], duration: 0.3}}
                                className="space-y-6"
                            >
                                <h3 className="font-bold text-[17px] text-[#091A7A] px-1">Your Journey</h3>
                                <div className="grid grid-cols-2 gap-3.5">
                                    {headlineTiles.map((tile, index) => (
                                        <StatTile
                                            key={tile.label}
                                            icon={tile.icon}
                                            value={tile.value}
                                            label={tile.label}
                                            delay={index * 0.04}
                                        />
                                    ))}
                                </div>

                                <motion.button
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.18, ease: [0.22, 1, 0.36, 1], duration: 0.35}}
                                    whileTap={{scale: 0.98}}
                                    onClick={onOpenStats}
                                    className="w-full flex items-center gap-3.5 p-4 bg-white rounded-[22px] shadow-[0_8px_24px_rgba(9,26,122,0.06)] border border-[#091A7A]/[0.04] text-left transition-colors hover:bg-[#091A7A]/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                                >
                                    <div className="w-11 h-11 bg-[#EAF4FF] rounded-[14px] flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="w-[22px] h-[22px] text-[#091A7A]" strokeWidth={2.2}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[15px] font-bold text-[#091A7A]">View full stats</p>
                                        <p className="text-[13px] font-medium text-[#091A7A]/65">
                                            Streak history, accuracy, and your training calendar
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#091A7A]/40 flex-shrink-0"/>
                                </motion.button>
                            </motion.div>
                        )}

                        {activeTab === "achievements" && (
                            <motion.div
                                key="achievements"
                                initial={{opacity: 0, y: 12}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -12}}
                                transition={{ease: [0.22, 1, 0.36, 1], duration: 0.3}}
                            >
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="font-bold text-[17px] text-[#091A7A]">Badges & Awards</h3>
                                    <span
                                        className="text-[13px] font-bold text-[#091A7A] bg-[#EAF4FF] px-3 py-1 rounded-full">
                                        {earnedCount}/{achievements.length}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {achievements.map((achievement, index) => (
                                        <motion.div
                                            key={achievement.id}
                                            initial={{opacity: 0, y: 8}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{delay: index * 0.035, ease: [0.22, 1, 0.36, 1], duration: 0.3}}
                                            className={`p-4 rounded-[22px] border ${
                                                achievement.earned
                                                    ? "bg-white shadow-[0_8px_24px_rgba(9,26,122,0.06)] border-[#091A7A]/[0.04]"
                                                    : "bg-[#091A7A]/[0.02] border-[#091A7A]/[0.05]"
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-14 h-14 rounded-[18px] flex items-center justify-center flex-shrink-0 ${
                                                        achievement.earned
                                                            ? "bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] shadow-[0_6px_16px_rgba(9,26,122,0.22)]"
                                                            : "bg-[#091A7A]/[0.06]"
                                                    }`}
                                                >
                                                    <achievement.icon
                                                        className={`w-[26px] h-[26px] ${achievement.earned ? "text-white" : "text-[#091A7A]/30"}`}/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <h4 className={`text-[16px] font-bold ${achievement.earned ? "text-[#091A7A]" : "text-[#091A7A]/50"}`}>
                                                            {achievement.title}
                                                        </h4>
                                                        {achievement.earned && <Award
                                                            className="w-[18px] h-[18px] text-[#FFC71E] fill-[#FFC71E]/40 flex-shrink-0"/>}
                                                    </div>
                                                    <p className={`text-[13px] font-medium leading-tight ${achievement.earned ? "text-[#091A7A]/70" : "text-[#091A7A]/45"}`}>
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

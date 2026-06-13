import {motion} from "motion/react";
import {BellRing, Brain, Building2, ChevronRight, Layers, MapPin} from "lucide-react";
import {type Palace} from "../hooks/useProgressState";
import {DynamicBackground} from "./DynamicBackground";
import {AmbientParticles} from "./AmbientParticles";
import {Avatar} from "./ui/Avatar";
import {ProgressHeader} from "./progress/ProgressHeader";
import {PalaceProgressCard} from "./progress/PalaceProgressCard";
import {TrainingStreak} from "./progress/TrainingStreak";
import {UpNextCard} from "./progress/UpNextCard";
import {PalacesOverview} from "./progress/PalacesOverview";
import {useCollapsibleHeader} from "../hooks/useCollapsibleHeader";

interface HomeFeedProps {
    userName: string;
    profileImage: string | null;
    initials: string;
    userXP: number;
    currentLevel: number;
    currentProgress: number;
    streakCount: number;
    longestStreak: number;
    streakFreezes: number;
    /** ISO date strings of every day trained; drives the streak week. */
    trainingDays: string[];
    hasPalaces: boolean;
    /** Active (non-archived) palaces, for the "Up next" suggestions. */
    palaces: Palace[];
    unreadCount: number;
    recentXPGain: number;
    showXPAnimation: boolean;
    onXPAnimationComplete: () => void;
    onNotificationClick: () => void;
    onProfileClick: () => void;
    onStartTraining: () => void;
    onCreatePalace: () => void;
    onPalaceClick: (palaceId: string) => void;
    /** Open a specific room straight into study (from "Up next"). */
    onOpenRoom: (palaceId: string, roomTitle: string) => void;
    /** Jump to the Palaces tab (the home "View all" affordance). */
    onViewAllPalaces: () => void;
    /** Open the full Stats screen from the streak card. */
    onOpenStats: () => void;
    /** Loci due for review across all palaces today. */
    dueCount: number;
    onDailyReview: () => void;
}

/**
 * The authenticated "home" tab. The greeting/XP hero recedes on scroll and a
 * compact bar fades in that keeps the profile + notification bell — the two
 * most-used controls — pinned at the top. Atmosphere and cards below.
 */
export function HomeFeed({
                             userName,
                             profileImage,
                             initials,
                             userXP,
                             currentLevel,
                             currentProgress,
                             streakCount,
                             longestStreak,
                             streakFreezes,
                             trainingDays,
                             hasPalaces,
                             palaces,
                             unreadCount,
                             recentXPGain,
                             showXPAnimation,
                             onXPAnimationComplete,
                             onNotificationClick,
                             onProfileClick,
                             onStartTraining,
                             onCreatePalace,
                             onPalaceClick,
                             onOpenRoom,
                             onViewAllPalaces,
                             onOpenStats,
                             dueCount,
                             onDailyReview,
                         }: HomeFeedProps) {
    const header = useCollapsibleHeader();

    return (
        <div className="size-full relative">
            <DynamicBackground/>
            <AmbientParticles/>

            {/* Compact sticky bar — profile + bell stay reachable when scrolled */}
            <motion.div
                style={{
                    opacity: header.compactOpacity,
                    pointerEvents: header.compactPointerEvents,
                }}
                className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-[#091A7A]/[0.06] shadow-[0_4px_24px_rgba(9,26,122,0.04)]"
            >
                <div className="h-safe-top"/>
                <div className="flex items-center justify-between px-6 py-2.5">
                    <button
                        onClick={onProfileClick}
                        className="flex items-center gap-3 active:scale-[0.98] transition-transform"
                    >
                        <Avatar
                            src={profileImage}
                            name={userName}
                            initials={initials}
                            className="w-9 h-9 rounded-full border border-[#091A7A]/10"
                            initialsClassName="text-[12px]"
                        />
                        <div className="text-left">
                            <h2 className="text-[15px] font-semibold text-[#091A7A] leading-tight">
                                Hi {userName}
                            </h2>
                            <p className="text-[11px] font-medium text-[#091A7A]/60">
                                Level {currentLevel}
                            </p>
                        </div>
                    </button>
                    <button
                        onClick={onNotificationClick}
                        aria-label="Notifications"
                        className="relative w-11 h-11 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#091A7A] active:scale-95 transition-transform"
                    >
                        <BellRing className="w-[18px] h-[18px] stroke-[1.75]"/>
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#EF4444] rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center leading-none">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Scroll container */}
            <div
                ref={header.ref}
                className="size-full overflow-y-auto scrollbar-hide relative z-10 pb-[140px]"
            >
                <motion.div
                    style={{
                        opacity: header.largeOpacity,
                        scale: header.largeScale,
                        y: header.largeY,
                        pointerEvents: header.largePointerEvents,
                    }}
                    className="will-change-transform origin-top"
                >
                    <ProgressHeader
                        profileImage={profileImage}
                        userName={userName}
                        initials={initials}
                        userXP={userXP}
                        recentXPGain={recentXPGain}
                        showXPAnimation={showXPAnimation}
                        onXPAnimationComplete={onXPAnimationComplete}
                        levelProgress={{
                            currentLevel,
                            xpForNextLevel: (currentLevel + 1) * 250,
                            xpInCurrentLevel: userXP % 250,
                        }}
                        streakCount={streakCount}
                        dueCount={dueCount}
                        showStats={hasPalaces}
                        unreadCount={unreadCount}
                        onNotificationClick={onNotificationClick}
                        onProfileClick={onProfileClick}
                    />
                </motion.div>

                <div className="space-y-6 px-6 pt-4">
                    <PalaceProgressCard
                        onStartTraining={onStartTraining}
                        currentProgress={currentProgress}
                        hasPalaces={hasPalaces}
                        onCreatePalace={onCreatePalace}
                    />
                    {dueCount > 0 && (
                        <motion.button
                            initial={{opacity: 0, y: 12}}
                            animate={{opacity: 1, y: 0}}
                            transition={{ease: [0.16, 1, 0.3, 1], duration: 0.35}}
                            whileTap={{scale: 0.98}}
                            onClick={onDailyReview}
                            className="w-full flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card border border-[#091A7A]/[0.05] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] flex items-center justify-center shadow-[0_6px_16px_rgba(9,26,122,0.22)]">
                                    <Layers className="w-6 h-6 text-white"/>
                                </div>
                                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#FFC71E] rounded-full border-2 border-white text-[11px] font-bold text-[#5C4708] flex items-center justify-center leading-none">
                                    {dueCount > 99 ? "99+" : dueCount}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] font-bold text-[#091A7A]">Daily Review</h3>
                                <p className="text-[13px] font-medium text-[#091A7A]/60">
                                    {dueCount} {dueCount === 1 ? "card" : "cards"} due across your palaces
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#091A7A]/40 flex-shrink-0"/>
                        </motion.button>
                    )}
                    {hasPalaces ? (
                        <>
                            <UpNextCard palaces={palaces} onOpenRoom={onOpenRoom}/>
                            <TrainingStreak
                                streakCount={streakCount}
                                longestStreak={longestStreak}
                                freezes={streakFreezes}
                                trainingDays={trainingDays}
                                onViewHistory={onOpenStats}
                            />
                            <PalacesOverview
                                onPalaceClick={onPalaceClick}
                                onCreatePalace={onCreatePalace}
                                onViewAll={onViewAllPalaces}
                            />
                        </>
                    ) : (
                        <FirstRunGuide/>
                    )}
                </div>
            </div>
        </div>
    );
}

const FIRST_RUN_STEPS = [
    {
        icon: Building2,
        title: "Build a palace",
        body: "Pick a place you know by heart — your home, a walk, a route.",
    },
    {
        icon: MapPin,
        title: "Place vivid cues",
        body: "Drop each fact at a spot along the way, the more striking the better.",
    },
    {
        icon: Brain,
        title: "Train your recall",
        body: "Walk the rooms daily. Spaced review brings each one back when it's due.",
    },
];

/**
 * First-run companion to the "Build your memory palace" card: a calm, three-step
 * primer on the method of loci. Shown only before the first palace exists, so the
 * home never displays empty streak grids or fake stats on day one.
 */
function FirstRunGuide() {
    return (
        <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
            className="rounded-[20px] bg-white/80 backdrop-blur-lg border border-white/40 shadow-card p-5"
        >
            <h3 className="text-section-header text-[#091A7A] mb-4">How it works</h3>
            <div className="space-y-4">
                {FIRST_RUN_STEPS.map((step, i) => (
                    <div key={step.title} className="flex items-start gap-3.5">
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-[#091A7A]">
                                <step.icon className="w-5 h-5"/>
                            </div>
                            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#091A7A] text-white text-[11px] font-bold flex items-center justify-center">
                                {i + 1}
                            </span>
                        </div>
                        <div className="min-w-0 pt-0.5">
                            <p className="text-[14px] font-semibold text-[#091A7A]">{step.title}</p>
                            <p className="text-[13px] leading-snug text-[#475569]">{step.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

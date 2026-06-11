import {motion} from "motion/react";
import {BellRing} from "lucide-react";
import {DynamicBackground} from "./DynamicBackground";
import {AmbientParticles} from "./AmbientParticles";
import {ImageWithFallback} from "./ui/ImageWithFallback";
import {ProgressHeader} from "./progress/ProgressHeader";
import {PalaceProgressCard} from "./progress/PalaceProgressCard";
import {TrainingStreak} from "./progress/TrainingStreak";
import {TrainingCalendar} from "./progress/TrainingCalendar";
import {PalacesOverview} from "./progress/PalacesOverview";
import {useCollapsibleHeader} from "../hooks/useCollapsibleHeader";

interface HomeFeedProps {
    userName: string;
    profileImage: string;
    userXP: number;
    currentLevel: number;
    currentProgress: number;
    streakCount: number;
    hasPalaces: boolean;
    unreadCount: number;
    recentXPGain: number;
    showXPAnimation: boolean;
    onXPAnimationComplete: () => void;
    onNotificationClick: () => void;
    onProfileClick: () => void;
    onStartTraining: () => void;
    onCreatePalace: () => void;
    onPalaceClick: (palaceId: string) => void;
}

/**
 * The authenticated "home" tab. The greeting/XP hero recedes on scroll and a
 * compact bar fades in that keeps the profile + notification bell — the two
 * most-used controls — pinned at the top. Atmosphere and cards below.
 */
export function HomeFeed({
                             userName,
                             profileImage,
                             userXP,
                             currentLevel,
                             currentProgress,
                             streakCount,
                             hasPalaces,
                             unreadCount,
                             recentXPGain,
                             showXPAnimation,
                             onXPAnimationComplete,
                             onNotificationClick,
                             onProfileClick,
                             onStartTraining,
                             onCreatePalace,
                             onPalaceClick,
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
                        <ImageWithFallback
                            src={profileImage}
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover border border-[#091A7A]/10"
                            style={{objectPosition: "center 20%"}}
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
                        userXP={userXP}
                        recentXPGain={recentXPGain}
                        showXPAnimation={showXPAnimation}
                        onXPAnimationComplete={onXPAnimationComplete}
                        levelProgress={{
                            currentLevel,
                            xpForNextLevel: (currentLevel + 1) * 250,
                            xpInCurrentLevel: userXP % 250,
                        }}
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
                    <TrainingStreak streakCount={streakCount}/>
                    <TrainingCalendar/>
                    <PalacesOverview
                        onPalaceClick={onPalaceClick}
                        onCreatePalace={onCreatePalace}
                    />
                </div>
            </div>
        </div>
    );
}

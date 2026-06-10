import {DynamicBackground} from "./DynamicBackground";
import {AmbientParticles} from "./AmbientParticles";
import {ProgressHeader} from "./progress/ProgressHeader";
import {PalaceProgressCard} from "./progress/PalaceProgressCard";
import {TrainingStreak} from "./progress/TrainingStreak";
import {TrainingCalendar} from "./progress/TrainingCalendar";
import {PalacesOverview} from "./progress/PalacesOverview";

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
 * The authenticated "home" tab: ambient backdrop, the progress header (with the
 * notification bell), and the stacked training cards. Pure presentation — all
 * state and handlers come from `HomePage`.
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
    return (
        <div className="size-full flex flex-col relative">
            <DynamicBackground/>
            <AmbientParticles/>

            <div className="relative z-10 flex-1 flex flex-col">
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

                <div className="flex-1 overflow-y-auto pb-[128px] scrollbar-hide">
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
        </div>
    );
}

import { useState } from "react";
import { StatusBar } from "./ui/StatusBar";
import { ProgressHeader } from "./progress/ProgressHeader";
import { PalaceProgressCard } from "./progress/PalaceProgressCard";
import { TrainingStreak } from "./progress/TrainingStreak";
import { TrainingCalendar } from "./progress/TrainingCalendar";
import { PalacesOverview } from "./progress/PalacesOverview";
import { ProgressDebugPanel } from "./progress/ProgressDebugPanel";
import { useProgressState } from "../hooks/useProgressState";

export function ProgressPage() {
  const { state, actions } = useProgressState();
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [recentXPGain, setRecentXPGain] = useState(0);
  const [showDebug, setShowDebug] = useState(true);

  const handleStartTraining = () => {
    actions.recordTrainingDay();

    const xpGain = 50;
    setRecentXPGain(xpGain);
    setShowXPAnimation(true);
    actions.addXP(xpGain);
  };

  const handlePalaceClick = (palace: any) => {
    console.log("Palace clicked:", palace);
  };

  const handleNotificationClick = () => {
    actions.clearNotifications();
  };

  const handleXPAnimationComplete = () => {
    setShowXPAnimation(false);
  };

  return (
    <div
      className="size-full flex flex-col relative"
      style={{
        background:
          "linear-gradient(180deg, #ADC8FF 0%, #FFFFFF 100%)",
      }}
    >
      {/* Status Bar */}
      <div className="pt-[21px] flex-shrink-0">
        <StatusBar theme="light" />
      </div>

      {/* Header */}
      <ProgressHeader
        profileImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
        userName="Memory Master"
        userXP={state.userXP}
        recentXPGain={recentXPGain}
        showXPAnimation={showXPAnimation}
        onXPAnimationComplete={handleXPAnimationComplete}
        levelProgress={{
          currentLevel: state.currentLevel,
          xpForNextLevel: (state.currentLevel + 1) * 250,
          xpInCurrentLevel: state.userXP % 250,
        }}
        onNotificationClick={handleNotificationClick}
        hasNotifications={state.hasNotifications}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-[100px]">
        <div className="space-y-6 px-6 pt-4">
          <PalaceProgressCard
            onStartTraining={handleStartTraining}
            currentProgress={state.currentProgress}
            totalRoomsCompleted={state.totalRoomsCompleted}
          />

          <TrainingStreak streakCount={state.streakCount} />

          <TrainingCalendar />

          <PalacesOverview onPalaceClick={handlePalaceClick} />

          {showDebug && <ProgressDebugPanel />}
        </div>
      </div>
    </div>
  );
}
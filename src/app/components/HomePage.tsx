import { useState } from "react";
import { LiquidGlassBottomNav } from "./LiquidGlassBottomNav";
import { SearchPopup } from "./SearchPopup";
import { DynamicBackground } from "./DynamicBackground";
import { AmbientParticles } from "./AmbientParticles";
import { PalacesPage } from "./PalacesPage";
import { ProfilePage } from "./ProfilePage";
import { SettingsScreen } from "./SettingsScreen";
import { ProgressHeader } from "./progress/ProgressHeader";
import { PalaceProgressCard } from "./progress/PalaceProgressCard";
import { TrainingStreak } from "./progress/TrainingStreak";
import { TrainingCalendar } from "./progress/TrainingCalendar";
import { PalacesOverview } from "./progress/PalacesOverview";
import { ProgressDebugPanel } from "./progress/ProgressDebugPanel";
import { PalaceDetailScreen } from "./palace/PalaceDetailScreen";
import { RoomTrainingScreen } from "./palace/RoomTrainingScreen";
import { CreatePalaceScreen } from "./palace/CreatePalaceScreen";
import { EditPalaceScreen } from "./palace/EditPalaceScreen";
import { toast } from "sonner";
import {
  PalaceQuizScreen,
  QuizResults,
} from "./quiz/PalaceQuizScreen";
import { PalaceQuizCompletionScreen } from "./quiz/PalaceQuizCompletionScreen";
import { ProgressNotification } from "./notifications/ProgressNotification";
import { SaveIndicator } from "./notifications/SaveIndicator";
import {
  useProgressState,
  ProgressEvent,
} from "../hooks/useProgressState";
import { useNotifications } from "../hooks/useNotifications";
import { useSaveStatus } from "../hooks/useSaveStatus";

export default function HomePage() {
  const notifications = useNotifications();
  const saveStatus = useSaveStatus();

  const handleProgressEvent = (event: ProgressEvent) => {
    saveStatus.triggerSave();

    switch (event.type) {
      case "xp-gain":
        if (event.data.xpGain) {
          setRecentXPGain(event.data.xpGain);
          setShowXPAnimation(true);
        }
        break;

      case "level-up":
        notifications.showNotification({
          type: "level-up",
          title: "Level Up!",
          subtitle: `You reached level ${event.data.newLevel}`,
          xpGain: event.data.xpGain,
        });
        break;

      case "streak":
        if (
          event.data.streakCount &&
          event.data.streakCount % 7 === 0
        ) {
          notifications.showNotification({
            type: "streak",
            title: "Streak Milestone!",
            subtitle: `${event.data.streakCount} day streak!`,
          });
        }
        break;

      case "room-complete":
        notifications.showNotification({
          type: "room-complete",
          title: "Room Complete!",
          subtitle: event.data.palaceName,
          xpGain: 50,
        });
        break;

      case "palace-complete":
        notifications.showNotification({
          type: "palace-complete",
          title: "Palace Mastered!",
          subtitle: `Completed ${event.data.palaceName}`,
        });
        break;
    }
  };

  const { state, actions } = useProgressState(
    handleProgressEvent,
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [recentXPGain, setRecentXPGain] = useState(0);
  const [showDebug] = useState(true);
  const [selectedPalaceId, setSelectedPalaceId] = useState<
    string | null
  >(null);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState<
    string | null
  >(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] =
    useState<QuizResults | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreatePalace, setShowCreatePalace] = useState(false);
  const [editingPalaceId, setEditingPalaceId] = useState<string | null>(null);


  // Handler functions - declared before conditional returns
  const handleStartTraining = () => {
    actions.recordTrainingDay();
    const xpGain = 50;
    setRecentXPGain(xpGain);
    setShowXPAnimation(true);
    actions.addXP(xpGain);
  };

  const handlePalaceClick = (palaceId: string) => {
    setSelectedPalaceId(palaceId);
  };

  const handleRoomClick = (roomTitle: string) => {
    setSelectedRoomTitle(roomTitle);
  };

  const handleRoomComplete = () => {
    setSelectedRoomTitle(null);
    setSelectedPalaceId(null);
  };

  const handleQuizClick = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (results: QuizResults) => {
    setShowQuiz(false);
    setQuizResults(results);

    // Show quiz completion notification
    notifications.showNotification({
      type: "quiz-complete",
      title: "Quiz Complete!",
      subtitle: `${results.accuracy}% accuracy`,
      xpGain: results.xpGained,
    });
  };

  const handleQuizRetake = () => {
    setQuizResults(null);
    setShowQuiz(true);
  };

  const handleQuizExit = () => {
    setShowQuiz(false);
    setQuizResults(null);
    setSelectedPalaceId(null);
  };

  const handleNotificationClick = () => {
    actions.clearNotifications();
  };

  const handleXPAnimationComplete = () => {
    setShowXPAnimation(false);
  };

  const handleCreatePalaceSuccess = () => {
    setShowCreatePalace(false);
    toast.success("Palace Created!");
  };

  const handleEditPalaceSuccess = () => {
    setEditingPalaceId(null);
    toast.success("Palace Updated!");
  };


  if (editingPalaceId) {
    return (
      <EditPalaceScreen
        palaceId={editingPalaceId}
        onBack={() => setEditingPalaceId(null)}
        onSuccess={handleEditPalaceSuccess}
      />
    );
  }

  if (showCreatePalace) {
    return (
      <CreatePalaceScreen
        onBack={() => setShowCreatePalace(false)}
        onSuccess={handleCreatePalaceSuccess}
      />
    );
  }

  if (selectedRoomTitle) {
    return (
      <RoomTrainingScreen
        onBack={() => setSelectedRoomTitle(null)}
        onComplete={handleRoomComplete}
        roomTitle={selectedRoomTitle}
        palaceTitle={
          state.palaces.find((p) => p.id === selectedPalaceId)
            ?.name || "Memory Palace"
        }
      />
    );
  }

  if (quizResults && selectedPalaceId) {
    return (
      <PalaceQuizCompletionScreen
        results={quizResults}
        onBack={handleQuizExit}
        onRetake={handleQuizRetake}
        onNextPalace={handleQuizExit}
      />
    );
  }

  if (showQuiz && selectedPalaceId) {
    return (
      <PalaceQuizScreen
        palaceId={selectedPalaceId}
        onBack={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    );
  }

  if (selectedPalaceId) {
    return (
      <PalaceDetailScreen
        palaceId={selectedPalaceId}
        onBack={() => setSelectedPalaceId(null)}
        onRoomClick={handleRoomClick}
        onQuizClick={handleQuizClick}
      />
    );
  }

  if (showSettings) {
    return (
      <SettingsScreen onBack={() => setShowSettings(false)} />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "palaces":
        return (
          <PalacesPage
            palaces={state.palaces}
            onSearch={() => setSearchOpen(true)}
            onPalaceClick={handlePalaceClick}
            onCreatePalace={() => setShowCreatePalace(true)}
            onEditPalace={(palaceId) => setEditingPalaceId(palaceId)}
            onDeletePalace={(palaceId) => actions.deletePalace(palaceId)}
          />
        );

      case "profile":
        return (
          <ProfilePage
            onOpenSettings={() => setShowSettings(true)}
          />
        );

      default:
        return (
          <div className="size-full flex flex-col relative">
            <DynamicBackground />
            <AmbientParticles />

            <div className="relative z-10 flex-1 flex flex-col">
              <ProgressHeader
                profileImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                userName="Memory Master"
                userXP={state.userXP}
                recentXPGain={recentXPGain}
                showXPAnimation={showXPAnimation}
                onXPAnimationComplete={
                  handleXPAnimationComplete
                }
                levelProgress={{
                  currentLevel: state.currentLevel,
                  xpForNextLevel:
                    (state.currentLevel + 1) * 250,
                  xpInCurrentLevel: state.userXP % 250,
                }}
                onNotificationClick={handleNotificationClick}
                onProfileClick={() => setActiveTab("profile")}
                hasNotifications={state.hasNotifications}
              />

              <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide">
                <div className="space-y-6 px-6 pt-4">
                  <PalaceProgressCard
                    onStartTraining={handleStartTraining}
                    currentProgress={state.currentProgress}
                    totalRoomsCompleted={
                      state.totalRoomsCompleted
                    }
                  />
                  <TrainingStreak
                    streakCount={state.streakCount}
                  />
                  <TrainingCalendar />
                  <PalacesOverview
                    onPalaceClick={handlePalaceClick}
                  />
                  {showDebug && <ProgressDebugPanel />}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="size-full flex flex-col relative">
      {renderTabContent()}

      <LiquidGlassBottomNav
        activeTab={activeTab as "home" | "palaces" | "profile"}
        onTabChange={setActiveTab}
      />

      <SearchPopup
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        palaces={state.palaces}
        onSelectPalace={handlePalaceClick}
      />

      <ProgressNotification
        notification={notifications.notification}
        onClose={notifications.hideNotification}
      />
      <SaveIndicator
        show={saveStatus.showIndicator}
        status={saveStatus.saveStatus}
      />

    </div>
  );
}
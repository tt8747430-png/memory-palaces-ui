import {useState} from "react";
import {toast} from "sonner";
import {LiquidGlassBottomNav} from "./LiquidGlassBottomNav";
import {SearchPopup} from "./SearchPopup";
import {HomeFeed} from "./HomeFeed";
import {PalacesPage} from "./PalacesPage";
import {ProfilePage} from "./ProfilePage";
import {SettingsScreen} from "./SettingsScreen";
import {ProgressDebugPanel} from "./progress/ProgressDebugPanel";
import {PalaceDetailScreen} from "./palace/PalaceDetailScreen";
import {RoomContentScreen} from "./palace/RoomContentScreen";
import {RoomTrainingScreen} from "./palace/RoomTrainingScreen";
import {CreatePalaceScreen} from "./palace/CreatePalaceScreen";
import {EditPalaceScreen} from "./palace/EditPalaceScreen";
import {PalaceQuizScreen, QuizResults} from "./quiz/PalaceQuizScreen";
import {PalaceQuizCompletionScreen} from "./quiz/PalaceQuizCompletionScreen";
import {ProgressNotification} from "./notifications/ProgressNotification";
import {NotificationsScreen} from "./notifications/NotificationsScreen";
import {SaveIndicator} from "./notifications/SaveIndicator";
import {ProgressEvent, useProgressState} from "../hooks/useProgressState";
import {useNotifications} from "../hooks/useNotifications";
import {useSaveStatus} from "../hooks/useSaveStatus";

type Tab = "home" | "palaces" | "profile";

export default function HomePage() {
    const notifications = useNotifications();
    const saveStatus = useSaveStatus();

    // Transient toast/celebration UI. The persistent notification log is written
    // inside the store actions themselves (see useProgressState), so here we only
    // mirror milestones into the in-the-moment toast queue.
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
                if (event.data.streakCount && event.data.streakCount % 7 === 0) {
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

    const {state, actions} = useProgressState(handleProgressEvent);

    const [activeTab, setActiveTab] = useState<Tab>("home");
    const [searchOpen, setSearchOpen] = useState(false);
    const [showXPAnimation, setShowXPAnimation] = useState(false);
    const [recentXPGain, setRecentXPGain] = useState(0);

    // Full-screen flows, overlaid on top of the tab shell.
    const [selectedPalaceId, setSelectedPalaceId] = useState<string | null>(null);
    const [selectedRoomTitle, setSelectedRoomTitle] = useState<string | null>(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showCreatePalace, setShowCreatePalace] = useState(false);
    const [editingPalaceId, setEditingPalaceId] = useState<string | null>(null);
    const [managingContent, setManagingContent] = useState<{roomId: string} | null>(
        null,
    );

    const unreadCount = state.notifications.filter((n) => !n.read).length;
    // Dev-only: floating debug widget with destructive controls. Gate on DEV so
    // it never ships in production.
    const showDebug = import.meta.env.DEV;

    // --- Handlers -----------------------------------------------------------

    // Jump into the most recently touched palace: straight into its flashcards
    // if it has any, otherwise its detail so the user can build/pick.
    const handleStartTraining = () => {
        const active = state.palaces.filter((p) => !p.archived);
        if (active.length === 0) {
            setShowCreatePalace(true);
            return;
        }
        const recent = [...active].sort(
            (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
        );
        const target =
            recent.find((p) =>
                (p.rooms ?? []).some((r) => (r.loci?.length ?? 0) > 0),
            ) ?? recent[0];
        setSelectedPalaceId(target.id);
        const room = (target.rooms ?? []).find(
            (r) => (r.loci?.length ?? 0) > 0,
        );
        if (room) setSelectedRoomTitle(room.title);
    };

    // Finishing a room returns to the palace detail (keep the palace selected)
    // rather than dropping the user back out to the list.
    const handleRoomComplete = () => {
        setSelectedRoomTitle(null);
    };

    const handleQuizComplete = (results: QuizResults) => {
        setShowQuiz(false);
        setQuizResults(results);
        actions.pushNotification({
            type: "quiz-complete",
            title: "Quiz complete",
            subtitle: `${results.accuracy}% accuracy`,
            xpGain: results.xpGained,
        });
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

    // "Continue learning" keeps the palace open so the user stays in flow.
    const handleQuizContinue = () => {
        setQuizResults(null);
    };

    // "Home" leaves the palace entirely.
    const handleQuizHome = () => {
        setQuizResults(null);
        setShowQuiz(false);
        setSelectedPalaceId(null);
        setActiveTab("home");
    };

    const handleOpenNotifications = () => setShowNotifications(true);

    const handleCloseNotifications = () => {
        actions.markAllNotificationsRead();
        setShowNotifications(false);
    };

    const handleCreatePalaceSuccess = (palaceId: string) => {
        setShowCreatePalace(false);
        setSelectedPalaceId(palaceId);
        toast.success("Palace created. Add a room to start building.");
    };

    const handleEditPalaceSuccess = () => {
        setEditingPalaceId(null);
        toast.success("Changes saved");
    };

    // --- Full-screen flow router -------------------------------------------

    if (showNotifications) {
        return (
            <NotificationsScreen
                notifications={state.notifications}
                onBack={handleCloseNotifications}
                onMarkAllRead={actions.markAllNotificationsRead}
                onRemove={actions.removeNotification}
                onClear={actions.clearNotifications}
            />
        );
    }

    if (editingPalaceId) {
        return (
            <EditPalaceScreen
                palaceId={editingPalaceId}
                onBack={() => setEditingPalaceId(null)}
                onSuccess={handleEditPalaceSuccess}
            />
        );
    }

    if (selectedRoomTitle) {
        return (
            <RoomTrainingScreen
                onBack={() => setSelectedRoomTitle(null)}
                onComplete={handleRoomComplete}
                palaceId={selectedPalaceId ?? undefined}
                roomTitle={selectedRoomTitle}
                palaceTitle={
                    state.palaces.find((p) => p.id === selectedPalaceId)?.name ||
                    "Memory Palace"
                }
            />
        );
    }

    if (quizResults && selectedPalaceId) {
        return (
            <PalaceQuizCompletionScreen
                results={quizResults}
                onBack={handleQuizHome}
                onRetake={handleQuizRetake}
                onNextPalace={handleQuizContinue}
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

    if (managingContent && selectedPalaceId) {
        return (
            <RoomContentScreen
                palaceId={selectedPalaceId}
                roomId={managingContent.roomId}
                onBack={() => setManagingContent(null)}
            />
        );
    }

    if (selectedPalaceId) {
        return (
            <PalaceDetailScreen
                palaceId={selectedPalaceId}
                onBack={() => setSelectedPalaceId(null)}
                onRoomClick={(roomTitle) => setSelectedRoomTitle(roomTitle)}
                onQuizClick={() => setShowQuiz(true)}
                onManageContent={(roomId) => setManagingContent({roomId})}
                onEditPalace={() => setEditingPalaceId(selectedPalaceId)}
            />
        );
    }

    // --- Tab shell ----------------------------------------------------------

    const renderTabContent = () => {
        switch (activeTab) {
            case "palaces":
                return (
                    <PalacesPage
                        palaces={state.palaces}
                        folders={state.folders ?? []}
                        onSearch={() => setSearchOpen(true)}
                        onPalaceClick={(id) => setSelectedPalaceId(id)}
                        onCreatePalace={() => setShowCreatePalace(true)}
                        onDeletePalace={(palaceId) => actions.deletePalace(palaceId)}
                        onToggleFavorite={(palaceId) =>
                            actions.togglePalaceFavorite(palaceId)
                        }
                        onToggleArchive={(palaceId) => {
                            const palace = state.palaces.find((p) => p.id === palaceId);
                            actions.togglePalaceArchived(palaceId);
                            toast.success(
                                palace?.archived ? "Palace restored" : "Palace archived",
                            );
                        }}
                        onSetPalaceFolder={(palaceId, folderId) => {
                            actions.setPalaceFolder(palaceId, folderId);
                            toast.success(
                                folderId ? "Moved to folder" : "Removed from folder",
                            );
                        }}
                        onCreateFolder={(data) => {
                            actions.createFolder(data);
                            toast.success("Folder created");
                        }}
                        onDeleteFolder={(folderId) => {
                            actions.deleteFolder(folderId);
                            toast.success("Folder deleted");
                        }}
                    />
                );

            case "profile":
                return <ProfilePage onOpenSettings={() => setShowSettings(true)}/>;

            default:
                return (
                    <HomeFeed
                        userName="Memory Master"
                        profileImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                        userXP={state.userXP}
                        currentLevel={state.currentLevel}
                        currentProgress={state.currentProgress}
                        streakCount={state.streakCount}
                        hasPalaces={state.palaces.length > 0}
                        unreadCount={unreadCount}
                        recentXPGain={recentXPGain}
                        showXPAnimation={showXPAnimation}
                        onXPAnimationComplete={() => setShowXPAnimation(false)}
                        onNotificationClick={handleOpenNotifications}
                        onProfileClick={() => setActiveTab("profile")}
                        onStartTraining={handleStartTraining}
                        onCreatePalace={() => setShowCreatePalace(true)}
                        onPalaceClick={(id) => setSelectedPalaceId(id)}
                    />
                );
        }
    };

    return (
        <div className="size-full flex flex-col relative">
            {renderTabContent()}

            <LiquidGlassBottomNav
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as Tab)}
            />

            <SearchPopup
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                palaces={state.palaces}
                onSelectPalace={(id) => setSelectedPalaceId(id)}
            />

            <ProgressNotification
                notification={notifications.notification}
                onClose={notifications.hideNotification}
            />
            <SaveIndicator
                show={saveStatus.showIndicator}
                status={saveStatus.saveStatus}
            />

            <SettingsScreen open={showSettings} onOpenChange={setShowSettings}/>

            {showCreatePalace && (
                <CreatePalaceScreen
                    onBack={() => setShowCreatePalace(false)}
                    onSuccess={handleCreatePalaceSuccess}
                />
            )}

            {showDebug && <ProgressDebugPanel/>}
        </div>
    );
}

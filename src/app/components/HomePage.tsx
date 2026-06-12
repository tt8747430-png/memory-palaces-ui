import {useState} from "react";
import {AnimatePresence} from "motion/react";
import {toast} from "sonner";
import {LiquidGlassBottomNav} from "./LiquidGlassBottomNav";
import {SearchPopup} from "./SearchPopup";
import {HomeFeed} from "./HomeFeed";
import {PalacesPage} from "./PalacesPage";
import {ProfilePage} from "./ProfilePage";
import {SettingsScreen} from "./SettingsScreen";
import {ProgressDebugPanel} from "./progress/ProgressDebugPanel";
import {PalaceDetailScreen} from "./palace/PalaceDetailScreen";
import {RoomDetailScreen} from "./palace/RoomDetailScreen";
import {RoomTrainingScreen} from "./palace/RoomTrainingScreen";
import {MatchGameScreen} from "./palace/MatchGameScreen";
import {CreatePalaceScreen} from "./palace/CreatePalaceScreen";
import {EditPalaceScreen} from "./palace/EditPalaceScreen";
import {PalaceQuizScreen, QuizResults} from "./quiz/PalaceQuizScreen";
import {PalaceQuizCompletionScreen} from "./quiz/PalaceQuizCompletionScreen";
import {DailyReviewScreen} from "./DailyReviewScreen";
import {ProgressNotification} from "./notifications/ProgressNotification";
import {NotificationsScreen} from "./notifications/NotificationsScreen";
import {SaveIndicator} from "./notifications/SaveIndicator";
import {ProgressEvent, useProgressState} from "../hooks/useProgressState";
import {useNotifications} from "../hooks/useNotifications";
import {useSaveStatus} from "../hooks/useSaveStatus";
import {usePreferences} from "../hooks/usePreferences";
import {countDueLoci} from "../utils/dueCards";

type Tab = "home" | "palaces" | "profile";

export default function HomePage() {
    const notifications = useNotifications();
    const saveStatus = useSaveStatus();
    const {preferences} = usePreferences();

    // Show an in-app milestone toast, unless the user has turned notifications
    // off in Settings. The persistent bell-screen log is unaffected; this only
    // gates the transient popups.
    const showMilestone = (
        data: Parameters<typeof notifications.showNotification>[0],
    ) => {
        if (preferences.notifications) notifications.showNotification(data);
    };

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
                showMilestone({
                    type: "level-up",
                    title: "Level Up!",
                    subtitle: `You reached level ${event.data.newLevel}`,
                    xpGain: event.data.xpGain,
                });
                break;

            case "streak":
                if (event.data.streakCount && event.data.streakCount % 7 === 0) {
                    showMilestone({
                        type: "streak",
                        title: "Streak Milestone!",
                        subtitle: `${event.data.streakCount} day streak!`,
                    });
                }
                break;

            case "room-complete":
                showMilestone({
                    type: "room-complete",
                    title: "Room Complete!",
                    subtitle: event.data.palaceName,
                    xpGain: 50,
                });
                break;

            case "palace-complete":
                showMilestone({
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
    // A room opens to its detail page; from there it can switch into flashcards
    // or the Match game without leaving the palace.
    const [roomView, setRoomView] = useState<
        {roomTitle: string; mode: "detail" | "flashcards" | "match"} | null
    >(null);
    const [showQuiz, setShowQuiz] = useState(false);
    // When set, the quiz is scoped to a single room rather than the whole palace.
    const [quizRoomTitle, setQuizRoomTitle] = useState<string | null>(null);
    const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showDailyReview, setShowDailyReview] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showCreatePalace, setShowCreatePalace] = useState(false);
    const [editingPalaceId, setEditingPalaceId] = useState<string | null>(null);

    const unreadCount = state.notifications.filter((n) => !n.read).length;
    const dueCount = countDueLoci(state.palaces);
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
        if (room) setRoomView({roomTitle: room.title, mode: "flashcards"});
    };

    // Finishing a room returns to its set page (keep the room open) rather than
    // dropping the user back out to the palace or the list.
    const handleRoomComplete = () => {
        setRoomView((v) => (v ? {...v, mode: "detail"} : null));
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
        showMilestone({
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
        setQuizRoomTitle(null);
        setRoomView(null);
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
                roomTitle={quizRoomTitle ?? undefined}
                onBack={() => setShowQuiz(false)}
                onComplete={handleQuizComplete}
            />
        );
    }

    if (showDailyReview) {
        return (
            <DailyReviewScreen
                onBack={() => setShowDailyReview(false)}
                onComplete={() => setShowDailyReview(false)}
            />
        );
    }

    if (roomView && selectedPalaceId) {
        const palaceTitle =
            state.palaces.find((p) => p.id === selectedPalaceId)?.name || "Memory Palace";
        const backToDetail = () =>
            setRoomView((v) => (v ? {...v, mode: "detail"} : null));

        if (roomView.mode === "flashcards") {
            return (
                <RoomTrainingScreen
                    onBack={backToDetail}
                    onComplete={handleRoomComplete}
                    palaceId={selectedPalaceId}
                    roomTitle={roomView.roomTitle}
                    palaceTitle={palaceTitle}
                />
            );
        }

        if (roomView.mode === "match") {
            return (
                <MatchGameScreen
                    onBack={backToDetail}
                    onComplete={backToDetail}
                    palaceId={selectedPalaceId}
                    roomTitle={roomView.roomTitle}
                    palaceTitle={palaceTitle}
                />
            );
        }

        return (
            <RoomDetailScreen
                palaceId={selectedPalaceId}
                roomTitle={roomView.roomTitle}
                palaceTitle={palaceTitle}
                onBack={() => setRoomView(null)}
                onStudy={() =>
                    setRoomView((v) => (v ? {...v, mode: "flashcards"} : null))
                }
                onMatch={() => setRoomView((v) => (v ? {...v, mode: "match"} : null))}
                onTest={() => {
                    setQuizRoomTitle(roomView.roomTitle);
                    setShowQuiz(true);
                }}
            />
        );
    }

    if (selectedPalaceId) {
        return (
            <PalaceDetailScreen
                palaceId={selectedPalaceId}
                onBack={() => setSelectedPalaceId(null)}
                onRoomClick={(roomTitle) => setRoomView({roomTitle, mode: "detail"})}
                onStudyRoom={(roomTitle) => setRoomView({roomTitle, mode: "flashcards"})}
                onQuizClick={() => {
                    setQuizRoomTitle(null);
                    setShowQuiz(true);
                }}
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
                        streakFreezes={state.streakFreezes}
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
                        dueCount={dueCount}
                        onDailyReview={() => setShowDailyReview(true)}
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

            <AnimatePresence>
                {showCreatePalace && (
                    <CreatePalaceScreen
                        onBack={() => setShowCreatePalace(false)}
                        onSuccess={handleCreatePalaceSuccess}
                    />
                )}
            </AnimatePresence>

            {showDebug && <ProgressDebugPanel/>}
        </div>
    );
}

import {type ReactNode, useMemo, useState} from "react";
import {motion} from "motion/react";
import {toast} from "sonner";
import {
    ArrowLeft,
    BookOpen,
    Brain,
    ChevronRight,
    GraduationCap,
    Layers,
    MoreHorizontal,
    RotateCcw,
    Trash2,
    Zap,
} from "lucide-react";
import {useProgressState} from "../../hooks/useProgressState";
import {srsStatus} from "../../utils/srs";
import {useCollapsibleHeader} from "../../hooks/useCollapsibleHeader";
import {LociPreviewCarousel} from "./LociPreviewCarousel";
import {RoomContentEditor} from "./RoomContentEditor";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface RoomDetailScreenProps {
    palaceId: string;
    roomTitle: string;
    palaceTitle?: string;
    onBack: () => void;
    /** Launch the flashcard swipe deck. */
    onStudy: () => void;
    /** Launch the Match mini-game. */
    onMatch: () => void;
    /** Launch the room-scoped quiz. */
    onTest: () => void;
    /** Launch the verse-study modes (Bible-mode palaces only). */
    onVerses?: () => void;
}

/**
 * One page per room: study at the top (preview + Flashcards / Match / Test),
 * manage right below it (the embedded RoomContentEditor — cards & questions).
 * A collapsible header keeps the room title in reach as the page scrolls.
 */
export function RoomDetailScreen({
                                     palaceId,
                                     roomTitle,
                                     palaceTitle,
                                     onBack,
                                     onStudy,
                                     onMatch,
                                     onTest,
                                     onVerses,
                                 }: RoomDetailScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);
    const room = (palace?.rooms || []).find((r) => r.title === roomTitle);
    const roomId = room?.id;
    const bibleMode = !!palace?.bibleMode;

    const loci = useMemo(() => room?.loci ?? [], [room]);
    const questions = useMemo(() => room?.questions ?? [], [room]);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const header = useCollapsibleHeader({distance: 150});

    const counts = useMemo(() => {
        const c = {new: 0, due: 0, learning: 0, known: 0};
        loci.forEach((l) => {
            c[srsStatus(l.srs)] += 1;
        });
        return c;
    }, [loci]);
    const masteredPct =
        loci.length > 0 ? Math.round((counts.known / loci.length) * 100) : 0;

    if (!palace || !room || !roomId) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#ADC8FF] to-white">
                <p className="text-body text-[#6B7280]">Room not found</p>
            </div>
        );
    }

    return (
        <div
            ref={header.ref}
            className="h-full overflow-y-auto bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white"
        >
            {/* Compact sticky bar — fades in once the hero scrolls away */}
            <motion.div
                style={{
                    opacity: header.compactOpacity,
                    pointerEvents: header.compactPointerEvents,
                }}
                className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-[#091A7A]/[0.06] shadow-[0_4px_24px_rgba(9,26,122,0.04)]"
            >
                <div className="h-safe-top"/>
                <div className="flex items-center gap-2.5 px-3 py-2">
                    <button
                        onClick={onBack}
                        aria-label="Go back"
                        className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-[#091A7A] active:scale-95 transition-transform"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </button>
                    <h2 className="text-[16px] font-bold text-[#091A7A] truncate flex-1 min-w-0">
                        {roomTitle}
                    </h2>
                    <RoomMenu
                        disabled={loci.length === 0}
                        onResetAll={() => {
                            actions.resetLociSrs(palaceId, roomId, loci.map((l) => l.id));
                            toast.success("Room progress reset");
                        }}
                        onMarkAllKnown={() => {
                            actions.markLociKnown(palaceId, roomId, loci.map((l) => l.id));
                            toast.success("Marked all as known");
                        }}
                        onDelete={() => setDeleteOpen(true)}
                    />
                </div>
            </motion.div>

            <div className="h-safe-top"/>

            {/* Hero — recedes on scroll */}
            <motion.div
                style={{
                    opacity: header.largeOpacity,
                    scale: header.largeScale,
                    y: header.largeY,
                    pointerEvents: header.largePointerEvents,
                }}
                className="origin-top px-6 pt-4"
            >
                <div className="flex items-center justify-between">
                    <motion.button
                        whileTap={{scale: 0.92}}
                        onClick={onBack}
                        aria-label="Go back"
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </motion.button>
                    <RoomMenu
                        big
                        disabled={loci.length === 0}
                        onResetAll={() => {
                            actions.resetLociSrs(palaceId, roomId, loci.map((l) => l.id));
                            toast.success("Room progress reset");
                        }}
                        onMarkAllKnown={() => {
                            actions.markLociKnown(palaceId, roomId, loci.map((l) => l.id));
                            toast.success("Marked all as known");
                        }}
                        onDelete={() => setDeleteOpen(true)}
                    />
                </div>

                <div className="mt-3">
                    <h1 className="text-[24px] font-bold text-[#091A7A] leading-tight text-balance">
                        {roomTitle}
                    </h1>
                    <p className="mt-0.5 text-[13px] font-medium text-[#475569]">
                        {palaceTitle ? `${palaceTitle} · ` : ""}
                        {loci.length} {loci.length === 1 ? "card" : "cards"}
                        {questions.length > 0 &&
                            ` · ${questions.length} ${questions.length === 1 ? "question" : "questions"}`}
                    </p>
                </div>

                {loci.length > 0 && (
                    <div className="mt-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-card p-3.5">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#091A7A]">
                                <GraduationCap className="w-4 h-4 text-[#3D8FEF]"/>
                                {counts.known} of {loci.length} mastered
                            </span>
                            <span className="text-[13px] font-bold text-[#091A7A]">{masteredPct}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[#E8EEF7] overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF]"
                                initial={{width: 0}}
                                animate={{width: `${masteredPct}%`}}
                                transition={{duration: 0.7, ease: "easeOut"}}
                            />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Body */}
            <div className="px-6 pt-5 pb-16 space-y-6">
                {/* Preview */}
                <LociPreviewCarousel
                    loci={loci}
                    onOpen={loci.length > 0 ? onStudy : undefined}
                    openLabel="Study flashcards"
                    speakable
                />

                {/* Study modes */}
                <div className="space-y-2.5">
                    {bibleMode && onVerses && (
                        <ModeTile
                            icon={<BookOpen className="w-5 h-5"/>}
                            tint="bg-gradient-to-br from-[#091A7A] to-[#4F8EFF]"
                            label="Memorize verses"
                            sublabel="Blur, Words, Initials & Type"
                            onClick={onVerses}
                            disabled={loci.length === 0}
                        />
                    )}
                    <ModeTile
                        icon={<Layers className="w-5 h-5"/>}
                        tint="bg-[#091A7A]"
                        label="Flashcards"
                        sublabel="Swipe to recall and sort into piles"
                        onClick={onStudy}
                        disabled={loci.length === 0}
                    />
                    <ModeTile
                        icon={<Zap className="w-5 h-5"/>}
                        tint="bg-[#3D8FEF]"
                        label="Match"
                        sublabel="Pair terms against the clock"
                        onClick={onMatch}
                        disabled={loci.length < 2}
                    />
                    <ModeTile
                        icon={<Brain className="w-5 h-5"/>}
                        tint="bg-[#4F8EFF]"
                        label="Test"
                        sublabel={
                            questions.length > 0
                                ? `Quiz this room · ${questions.length} ${questions.length === 1 ? "question" : "questions"}`
                                : "Add questions below to test this room"
                        }
                        onClick={onTest}
                        disabled={questions.length === 0}
                    />
                </div>

                {/* Manage — cards & questions, inline */}
                <div>
                    <h2 className="mb-3 text-section-header text-[#091A7A]">Cards &amp; questions</h2>
                    <RoomContentEditor palaceId={palaceId} roomId={roomId}/>
                </div>
            </div>

            {/* Delete this room */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="sm:max-w-[360px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Trash2 size={26} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#091A7A] text-lg">
                            Delete “{roomTitle}”?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#475569]">
                            This removes the room and its cards and questions. It can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
                        <AlertDialogCancel className="flex-1 py-3.5 h-auto border-none bg-[#EAF4FF] hover:bg-[#dcebff] text-[#091A7A] font-semibold rounded-2xl">
                            Keep room
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                actions.deleteRoom(palaceId, roomId);
                                setDeleteOpen(false);
                                toast.success("Room deleted");
                                onBack();
                            }}
                            className="flex-1 py-3.5 h-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// --- Screen-level menu ------------------------------------------------------

function RoomMenu({
                      onResetAll,
                      onMarkAllKnown,
                      onDelete,
                      disabled,
                      big = false,
                  }: {
    onResetAll: () => void;
    onMarkAllKnown: () => void;
    onDelete: () => void;
    disabled: boolean;
    big?: boolean;
}) {
    const item =
        "rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-[#2C2C2C]";
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <motion.button
                        whileTap={{scale: 0.92}}
                        aria-label="Room actions"
                        className={
                            big
                                ? "w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                                : "w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-[#091A7A] active:scale-95 transition-transform"
                        }
                    >
                        <MoreHorizontal className="w-5 h-5"/>
                    </motion.button>
                }
            />
            <DropdownMenuContent align="end" className="w-[210px] rounded-[16px] p-1.5">
                <DropdownMenuItem
                    onClick={onMarkAllKnown}
                    className={`${item} ${disabled ? "pointer-events-none opacity-40" : ""}`}
                >
                    <GraduationCap size={16} className="text-[#047857]"/>
                    Mark all as known
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onResetAll}
                    className={`${item} ${disabled ? "pointer-events-none opacity-40" : ""}`}
                >
                    <RotateCcw size={16} className="text-[#091A7A]"/>
                    Reset all progress
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-red-600 hover:bg-red-50 focus:bg-red-50"
                >
                    <Trash2 size={16} className="text-red-600"/>
                    Delete room
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// --- Study mode tile --------------------------------------------------------

function ModeTile({
                      icon,
                      tint,
                      label,
                      sublabel,
                      onClick,
                      disabled,
                  }: {
    icon: ReactNode;
    tint: string;
    label: string;
    sublabel: string;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <motion.button
            whileTap={disabled ? undefined : {scale: 0.98}}
            onClick={onClick}
            disabled={disabled}
            className={`flex w-full items-center gap-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 p-3.5 text-left shadow-card transition-opacity ${
                disabled ? "opacity-45" : ""
            }`}
        >
            <span
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white ${tint}`}
            >
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[#091A7A]">{label}</span>
                <span className="block text-[12px] text-[#475569] truncate">{sublabel}</span>
            </span>
            <ChevronRight className="w-5 h-5 flex-shrink-0 text-[#94a3b8]"/>
        </motion.button>
    );
}

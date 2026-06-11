import {useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {
    ArrowLeft,
    ArrowLeftRight,
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    Flag,
    Lightbulb,
    MapPin,
    MoreHorizontal,
    Pencil,
    RotateCcw,
    Shuffle,
    SkipForward,
    Sparkles,
    Zap,
} from "lucide-react";
import {
    type CardOrder,
    type Locus,
    palaceSettings,
    type StudyDirection,
    useProgressState,
} from "../../hooks/useProgressState";
import {type Grade, isDue, nextIntervalLabel} from "../../utils/srs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {RiveAnimation} from "../ui/RiveAnimation";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";

interface RoomTrainingScreenProps {
    onBack: () => void;
    onComplete: () => void;
    palaceId?: string;
    roomTitle?: string;
    palaceTitle?: string;
}

type Mode = "review" | "browse";

const SAMPLE_LOCI: Locus[] = [
    {
        id: "sample-1",
        front: "Zeus",
        back: "King of the gods, god of sky and thunder. Symbol: lightning bolt.",
        hint: "Picture Zeus on a throne of clouds, holding a glowing bolt.",
        tip: "Think of the sky — the highest god rules the highest place.",
    },
    {
        id: "sample-2",
        front: "Poseidon",
        back: "God of the sea, earthquakes, and horses. Symbol: trident.",
        hint: "See Poseidon riding a wave with a golden trident.",
        tip: "Three prongs, three domains: sea, quakes, horses.",
    },
    {
        id: "sample-3",
        front: "Athena",
        back: "Goddess of wisdom, warfare, and crafts. Symbol: owl.",
        hint: "Athena in armour, an owl on her shoulder.",
        tip: "Wise as an owl.",
    },
    {
        id: "sample-4",
        front: "Apollo",
        back: "God of music, poetry, sun, and prophecy. Symbol: lyre.",
        hint: "Apollo playing a golden lyre as the sun rises.",
        tip: "A-pollo plays — music and light.",
    },
];

const GRADES: {
    grade: Grade;
    label: string;
    classes: string;
}[] = [
    {grade: "again", label: "Again", classes: "bg-red-50 text-red-600 border-red-200"},
    {grade: "hard", label: "Hard", classes: "bg-amber-50 text-amber-600 border-amber-200"},
    {grade: "good", label: "Good", classes: "bg-[#EAF4FF] text-[#091A7A] border-[#ADC8FF]"},
    {grade: "easy", label: "Easy", classes: "bg-emerald-50 text-emerald-600 border-emerald-200"},
];

function orderIds(cards: Locus[], order: CardOrder): string[] {
    const ids = cards.map((c) => c.id);
    if (order === "reverse") return [...ids].reverse();
    if (order === "shuffle") {
        const a = [...ids];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    return ids;
}

export function RoomTrainingScreen({
                                       onBack,
                                       onComplete,
                                       palaceId,
                                       roomTitle = "Ancient Greek Gods",
                                       palaceTitle = "Greek Mythology Palace",
                                   }: RoomTrainingScreenProps) {
    const {state, actions} = useProgressState();

    const palace = state.palaces.find((p) => p.id === palaceId);
    const room = (palace?.rooms || []).find((r) => r.title === roomTitle);
    const roomId = room?.id;
    const settings = palaceSettings(palace);

    // Live cards from the store (so SRS grades reflect immediately); fall back
    // to a sample deck when the room has no authored loci yet.
    const usingSample = !room || (room.loci?.length ?? 0) === 0;
    const cards: Locus[] = usingSample ? SAMPLE_LOCI : room!.loci!;
    const byId = useMemo(
        () => new Map(cards.map((c) => [c.id, c])),
        [cards],
    );

    const [mode, setMode] = useState<Mode>("review");
    const [direction, setDirection] = useState<StudyDirection>(settings.studyDirection);
    const [order, setOrder] = useState<CardOrder>(settings.cardOrder);
    const [flipped, setFlipped] = useState(false);
    const [peek, setPeek] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [editing, setEditing] = useState(false);

    // In-study editing only works for real authored loci, not the sample deck.
    const canEditCard = !usingSample && !!roomId && !!palaceId;

    // Review session: a queue of locus ids. New/due cards lead; "Again" requeues.
    const [reviewQueue, setReviewQueue] = useState<string[]>(() => {
        const due = cards.filter((c) => isDue(c.srs));
        return (due.length > 0 ? due : cards).map((c) => c.id);
    });
    const [sessionTotal, setSessionTotal] = useState(() => {
        const due = cards.filter((c) => isDue(c.srs));
        return (due.length > 0 ? due : cards).length;
    });
    const [graded, setGraded] = useState(0);

    // Browse session: an ordered list of ids with a moving pointer.
    const [browseIds, setBrowseIds] = useState<string[]>(() =>
        orderIds(cards, settings.cardOrder),
    );
    const [browsePos, setBrowsePos] = useState(0);

    const currentId =
        mode === "review" ? reviewQueue[0] : browseIds[browsePos];
    const current = currentId ? byId.get(currentId) : undefined;

    const resetCardView = () => {
        setFlipped(false);
        setPeek(false);
    };

    const finish = () => {
        setShowSuccess(true);
        setTimeout(() => {
            actions.recordTrainingDay();
            actions.addXP(100);
            onComplete();
        }, 2400);
    };

    const handleGrade = (grade: Grade) => {
        if (!flipped || !currentId) return;
        if (!usingSample && roomId && palaceId) {
            actions.reviewLocus(palaceId, roomId, currentId, grade);
        }
        const rest = reviewQueue.slice(1);
        // "Again" sends the card to the back of the queue this session.
        const next = grade === "again" ? [...rest, currentId] : rest;
        setReviewQueue(next);
        if (grade !== "again") setGraded((g) => g + 1);
        resetCardView();
        if (next.length === 0) finish();
    };

    const handleBrowseNav = (delta: number) => {
        setBrowsePos((p) => Math.min(browseIds.length - 1, Math.max(0, p + delta)));
        resetCardView();
    };

    // Move past the current card without grading it (review) or just advance (browse).
    const handleSkip = () => {
        if (mode === "review") {
            if (reviewQueue.length <= 1) {
                resetCardView();
                return;
            }
            const [first, ...rest] = reviewQueue;
            setReviewQueue([...rest, first]);
            resetCardView();
        } else if (browsePos < browseIds.length - 1) {
            handleBrowseNav(1);
        }
    };

    const handleFlag = () => {
        if (!canEditCard || !currentId) return;
        actions.toggleLocusFlag(palaceId!, roomId!, currentId);
    };

    const handleSaveEdit = (data: Omit<Locus, "id" | "srs" | "flagged">) => {
        if (canEditCard && currentId) {
            actions.updateLocus(palaceId!, roomId!, currentId, data);
        }
        setEditing(false);
    };

    const restartSession = (nextOrder: CardOrder = order) => {
        if (mode === "review") {
            const due = cards.filter((c) => isDue(c.srs));
            const base = (due.length > 0 ? due : cards).map((c) => c.id);
            setReviewQueue(base);
            setSessionTotal(base.length);
            setGraded(0);
        } else {
            setBrowseIds(orderIds(cards, nextOrder));
            setBrowsePos(0);
        }
        resetCardView();
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        resetCardView();
        if (next === "browse") {
            setBrowseIds(orderIds(cards, order));
            setBrowsePos(0);
        }
    };

    const reviewProgress =
        sessionTotal > 0 ? (graded / sessionTotal) * 100 : 0;
    const browseProgress =
        browseIds.length > 0 ? ((browsePos + 1) / browseIds.length) * 100 : 0;
    const progress = mode === "review" ? reviewProgress : browseProgress;

    // Review queue emptied: show the success overlay (finish() is mid-flight),
    // or a caught-up state with a way back if the session was already done.
    if (!current) {
        return (
            <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col items-center justify-center gap-5 px-6 text-center">
                {showSuccess ? (
                    <SuccessOverlay/>
                ) : (
                    <>
                        <Sparkles className="w-12 h-12 text-[#FFC71E]"/>
                        <div>
                            <h2 className="text-2xl font-bold text-[#091A7A] mb-1">
                                All caught up
                            </h2>
                            <p className="text-[14px] text-[#475569] max-w-[32ch]">
                                Nothing is due right now. Come back later, or browse the cards.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => switchMode("browse")}
                                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#091A7A] border border-[#091A7A]/12"
                            >
                                Browse cards
                            </button>
                            <button
                                onClick={onBack}
                                className="rounded-full bg-[#091A7A] px-5 py-2.5 text-sm font-semibold text-white"
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    const prompt = direction === "front" ? current.front : current.back;
    const answer = direction === "front" ? current.back : current.front;

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <motion.button
                        whileTap={{scale: 0.92}}
                        onClick={onBack}
                        aria-label="Go back"
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </motion.button>

                    <div className="flex-1 mx-4 text-center min-w-0">
                        <h1 className="text-section-header text-[#091A7A] font-semibold line-clamp-1">
                            {roomTitle}
                        </h1>
                        <p className="text-[12px] text-[#475569] line-clamp-1">
                            {palaceTitle}
                        </p>
                    </div>

                    <StudyOptionsMenu
                        mode={mode}
                        direction={direction}
                        order={order}
                        onMode={switchMode}
                        onDirection={(d) => {
                            setDirection(d);
                            resetCardView();
                        }}
                        onOrder={(o) => {
                            setOrder(o);
                            if (mode === "browse") restartSession(o);
                        }}
                        onRestart={() => restartSession()}
                        onFinish={finish}
                    />
                </div>

                {/* Mode + progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#091A7A]">
                            {mode === "review" ? (
                                <Zap className="w-3.5 h-3.5"/>
                            ) : (
                                <BookOpen className="w-3.5 h-3.5"/>
                            )}
                            {mode === "review" ? "Review" : "Browse"}
                        </span>
                        <span className="font-medium text-[#475569]">
                            {mode === "review"
                                ? `${graded} / ${sessionTotal} reviewed`
                                : `${browsePos + 1} / ${browseIds.length}`}
                        </span>
                    </div>
                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            animate={{width: `${progress}%`}}
                            transition={{duration: 0.3}}
                        />
                    </div>
                </div>
            </div>

            {/* In-study tools */}
            <div className="px-6 flex items-center justify-center gap-2">
                <StudyToolButton
                    onClick={handleFlag}
                    disabled={!canEditCard}
                    active={!!current.flagged}
                    icon={
                        <Flag
                            className={`w-4 h-4 ${current.flagged ? "fill-[#FFC71E] text-[#B8860B]" : ""}`}
                        />
                    }
                    label={current.flagged ? "Flagged" : "Flag"}
                />
                <StudyToolButton
                    onClick={() => setEditing(true)}
                    disabled={!canEditCard}
                    icon={<Pencil className="w-4 h-4"/>}
                    label="Edit"
                />
                <StudyToolButton
                    onClick={handleSkip}
                    icon={<SkipForward className="w-4 h-4"/>}
                    label="Skip"
                />
            </div>

            {/* Flip card — fixed height so long text scrolls instead of bloating */}
            <div className="flex-1 px-6 flex flex-col items-center justify-center min-h-0 py-3">
                <div className="w-full max-w-md [perspective:1200px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentId}
                            initial={{opacity: 0, scale: 0.94}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.94}}
                            transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
                            className="h-[clamp(300px,52vh,440px)]"
                        >
                            <motion.div
                                onClick={() => setFlipped((f) => !f)}
                                animate={{rotateY: flipped ? 180 : 0}}
                                transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
                                style={{transformStyle: "preserve-3d"}}
                                className="relative w-full h-full cursor-pointer"
                            >
                                {/* Front face */}
                                <div
                                    style={{backfaceVisibility: "hidden"}}
                                    className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl p-7 shadow-elevated border border-white/60 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4FF] px-2.5 py-1 text-[11px] font-semibold text-[#3D8FEF]">
                                            <MapPin className="w-3 h-3"/>
                                            {direction === "front" ? "Recall" : "Term"}
                                        </span>
                                        {current.flagged && (
                                            <Flag className="w-4 h-4 fill-[#FFC71E] text-[#B8860B]"/>
                                        )}
                                    </div>

                                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center text-center py-2">
                                        <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-[#091A7A] mb-3 text-balance break-words">
                                            {prompt}
                                        </h2>

                                        {current.tip && (
                                            <div className="mt-1 min-h-[44px] flex items-center justify-center">
                                                {peek ? (
                                                    <motion.p
                                                        initial={{opacity: 0, y: 4}}
                                                        animate={{opacity: 1, y: 0}}
                                                        className="text-[13px] text-[#3D6FE0] italic max-w-[36ch]"
                                                    >
                                                        {current.tip}
                                                    </motion.p>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPeek(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7E0] px-3 py-1.5 text-[12px] font-semibold text-[#B8860B] hover:bg-[#FFEFBF] transition-colors"
                                                    >
                                                        <Lightbulb className="w-3.5 h-3.5"/>
                                                        Peek a hint
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-center text-[12px] text-[#94a3b8]">
                                        Tap to flip
                                    </p>
                                </div>

                                {/* Back face */}
                                <div
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}
                                    className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl p-7 shadow-elevated border border-white/60 flex flex-col"
                                >
                                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center text-center">
                                        <p className="text-[clamp(17px,4.5vw,20px)] font-semibold text-[#091A7A] leading-snug text-balance break-words">
                                            {answer}
                                        </p>
                                        {current.hint && (
                                            <div className="mt-5 w-full rounded-2xl bg-[#ADC8FF]/20 p-4 border border-[#ADC8FF]/30 text-left">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <MapPin className="w-4 h-4 text-[#091A7A] flex-shrink-0"/>
                                                    <p className="text-[12px] font-semibold text-[#091A7A]">
                                                        Where to picture it
                                                    </p>
                                                </div>
                                                <p className="text-[13px] text-[#475569] italic leading-relaxed">
                                                    {current.hint}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* In-study card editor */}
            {canEditCard && (
                <InStudyEditor
                    open={editing}
                    locus={current}
                    onClose={() => setEditing(false)}
                    onSave={handleSaveEdit}
                />
            )}

            {/* Footer: grading (review) or navigation (browse) */}
            <div className="px-6 pb-7 pt-2">
                {mode === "review" ? (
                    // Grades only appear once the answer is revealed; before that
                    // the front shows a single "Show answer" action.
                    flipped ? (
                        <motion.div
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.2}}
                        >
                            <p className="text-center text-[12px] font-medium text-[#475569] mb-2.5">
                                How well did you recall it?
                            </p>
                            <div className="grid grid-cols-4 gap-2.5">
                                {GRADES.map(({grade, label, classes}) => (
                                    <motion.button
                                        key={grade}
                                        whileTap={{scale: 0.94}}
                                        onClick={() => handleGrade(grade)}
                                        className={`flex flex-col items-center gap-0.5 rounded-2xl border py-2.5 transition-all ${classes}`}
                                    >
                                        <span className="text-[14px] font-bold">{label}</span>
                                        <span className="text-[10px] font-medium opacity-70">
                                            {nextIntervalLabel(current.srs, grade)}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.button
                            whileTap={{scale: 0.98}}
                            onClick={() => setFlipped(true)}
                            className="w-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white rounded-2xl py-4 shadow-interactive flex items-center justify-center gap-2 font-semibold"
                        >
                            <Eye className="w-5 h-5"/>
                            Show answer
                        </motion.button>
                    )
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-4">
                            <motion.button
                                whileTap={{scale: 0.92}}
                                onClick={() => handleBrowseNav(-1)}
                                disabled={browsePos === 0}
                                aria-label="Previous card"
                                className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-card border ${
                                    browsePos === 0
                                        ? "bg-gray-100 border-gray-200 text-gray-400"
                                        : "bg-white border-white/40 text-[#091A7A]"
                                }`}
                            >
                                <ChevronLeft className="w-6 h-6"/>
                            </motion.button>
                            <span className="text-subheading font-semibold text-[#091A7A] min-w-[64px] text-center">
                                {browsePos + 1} / {browseIds.length}
                            </span>
                            <motion.button
                                whileTap={{scale: 0.92}}
                                onClick={() => handleBrowseNav(1)}
                                disabled={browsePos >= browseIds.length - 1}
                                aria-label="Next card"
                                className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-card border ${
                                    browsePos >= browseIds.length - 1
                                        ? "bg-gray-100 border-gray-200 text-gray-400"
                                        : "bg-white border-white/40 text-[#091A7A]"
                                }`}
                            >
                                <ChevronRight className="w-6 h-6"/>
                            </motion.button>
                        </div>
                        <motion.button
                            whileTap={{scale: 0.98}}
                            onClick={finish}
                            className="w-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white rounded-2xl py-4 shadow-interactive flex items-center justify-center gap-2 font-semibold"
                        >
                            <Check className="w-5 h-5"/>
                            Complete session (+100 XP)
                        </motion.button>
                    </div>
                )}
            </div>

            <AnimatePresence>{showSuccess && <SuccessOverlay/>}</AnimatePresence>
        </div>
    );
}

function SuccessOverlay() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
            <div className="w-56 h-56 mb-6">
                <RiveAnimation
                    src="https://cdn.rive.app/animations/vehicles.riv"
                    className="w-full h-full"
                />
            </div>
            <motion.h2
                initial={{y: 16, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.4}}
                className="text-3xl font-bold text-[#091A7A] mb-2"
            >
                Session complete
            </motion.h2>
            <motion.p
                initial={{y: 16, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.55}}
                className="text-xl text-[#10B981] font-semibold flex items-center gap-2"
            >
                <Sparkles className="w-5 h-5"/>
                +100 XP
            </motion.p>
        </motion.div>
    );
}

// --- Study options menu (replaces the old decorative brain icon) ------------

function StudyOptionsMenu({
                              mode,
                              direction,
                              order,
                              onMode,
                              onDirection,
                              onOrder,
                              onRestart,
                              onFinish,
                          }: {
    mode: Mode;
    direction: StudyDirection;
    order: CardOrder;
    onMode: (m: Mode) => void;
    onDirection: (d: StudyDirection) => void;
    onOrder: (o: CardOrder) => void;
    onRestart: () => void;
    onFinish: () => void;
}) {
    const itemBase =
        "rounded-[10px] px-3 py-2 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-[#2C2C2C]";
    const dot = (active: boolean) =>
        active ? <span className="ml-auto w-2 h-2 rounded-full bg-[#091A7A]"/> : null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <motion.button
                        whileTap={{scale: 0.92}}
                        aria-label="Study options"
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A] outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                    >
                        <MoreHorizontal className="w-5 h-5"/>
                    </motion.button>
                }
            />
            <DropdownMenuContent align="end" className="w-[230px] rounded-[16px] p-1.5">
                <DropdownMenuLabel className="px-3 pt-1.5 text-[11px] uppercase tracking-wider text-[#64748b]">
                    Mode
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onMode("review")} className={itemBase}>
                    <Zap size={16} className="text-[#091A7A]"/>
                    Spaced review
                    {dot(mode === "review")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMode("browse")} className={itemBase}>
                    <BookOpen size={16} className="text-[#091A7A]"/>
                    Browse cards
                    {dot(mode === "browse")}
                </DropdownMenuItem>

                <DropdownMenuSeparator/>
                <DropdownMenuLabel className="px-3 text-[11px] uppercase tracking-wider text-[#64748b]">
                    Direction
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => onDirection(direction === "front" ? "back" : "front")}
                    className={itemBase}
                >
                    <ArrowLeftRight size={16} className="text-[#091A7A]"/>
                    {direction === "front" ? "Front first" : "Back first"}
                </DropdownMenuItem>

                {mode === "browse" && (
                    <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuLabel className="px-3 text-[11px] uppercase tracking-wider text-[#64748b]">
                            Order
                        </DropdownMenuLabel>
                        {(
                            [
                                {value: "inOrder", label: "In order"},
                                {value: "shuffle", label: "Shuffle"},
                                {value: "reverse", label: "Reverse"},
                            ] as {value: CardOrder; label: string}[]
                        ).map((o) => (
                            <DropdownMenuItem
                                key={o.value}
                                onClick={() => onOrder(o.value)}
                                className={itemBase}
                            >
                                <Shuffle size={16} className="text-[#091A7A]"/>
                                {o.label}
                                {dot(order === o.value)}
                            </DropdownMenuItem>
                        ))}
                    </>
                )}

                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={onRestart} className={itemBase}>
                    <RotateCcw size={16} className="text-[#091A7A]"/>
                    Restart session
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFinish} className={itemBase}>
                    <Check size={16} className="text-[#091A7A]"/>
                    Finish &amp; earn XP
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// --- In-study tools ---------------------------------------------------------

function StudyToolButton({
                             icon,
                             label,
                             onClick,
                             disabled,
                             active,
                         }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
}) {
    return (
        <motion.button
            whileTap={{scale: disabled ? 1 : 0.94}}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold border transition-colors ${
                disabled
                    ? "bg-white/40 border-transparent text-[#94a3b8]"
                    : active
                        ? "bg-[#FFF7E0] border-[#FFE08A] text-[#B8860B]"
                        : "bg-white/90 border-white/60 text-[#091A7A]"
            }`}
        >
            {icon}
            {label}
        </motion.button>
    );
}

const studyField =
    "w-full bg-[#F4F8FF] rounded-xl text-[15px] text-[#091A7A] placeholder:text-[#091A7A]/40 outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 focus:bg-white transition-all";

function InStudyEditor({
                           open,
                           locus,
                           onClose,
                           onSave,
                       }: {
    open: boolean;
    locus: Locus;
    onClose: () => void;
    onSave: (data: Omit<Locus, "id" | "srs" | "flagged">) => void;
}) {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [hint, setHint] = useState("");
    const [tip, setTip] = useState("");

    useEffect(() => {
        if (open) {
            setFront(locus.front);
            setBack(locus.back);
            setHint(locus.hint ?? "");
            setTip(locus.tip ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, locus.id]);

    const valid = front.trim().length > 0 && back.trim().length > 0;
    const save = () => {
        if (!valid) return;
        onSave({
            front: front.trim(),
            back: back.trim(),
            ...(hint.trim() ? {hint: hint.trim()} : {}),
            ...(tip.trim() ? {tip: tip.trim()} : {}),
        });
    };

    return (
        <KeyboardSheet
            open={open}
            onClose={onClose}
            title="Edit card"
            footer={
                <button
                    onClick={save}
                    disabled={!valid}
                    className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                        valid
                            ? "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] active:scale-[0.98]"
                            : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                    }`}
                >
                    <Check size={18}/>
                    Save card
                </button>
            }
        >
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Front (what to recall)
                </label>
                <Input
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="e.g., Zeus"
                    enterKeyHint="next"
                    className={`${studyField} px-4 h-12`}
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Back (what it means)
                </label>
                <Textarea
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="King of the gods, god of sky and thunder."
                    rows={3}
                    className={`${studyField} px-4 py-3 resize-none`}
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Place / image cue (optional)
                </label>
                <Textarea
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="Where you picture it."
                    rows={2}
                    className={`${studyField} px-4 py-3 resize-none`}
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Hint / tip (optional)
                </label>
                <Textarea
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    placeholder="A short nudge you can peek at before flipping."
                    rows={2}
                    className={`${studyField} px-4 py-3 resize-none`}
                />
            </div>
        </KeyboardSheet>
    );
}

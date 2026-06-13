import {type ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {
    animate,
    AnimatePresence,
    type HTMLMotionProps,
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "motion/react";
import {useDrag} from "@use-gesture/react";
import {
    ArrowLeft,
    ArrowLeftRight,
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    Flag,
    Layers,
    Lightbulb,
    MapPin,
    MoreHorizontal,
    Pencil,
    RotateCcw,
    Shuffle,
    SkipForward,
    Sparkles,
    Volume2,
    Zap,
} from "lucide-react";
import {
    type CardOrder,
    type Locus,
    palaceSettings,
    type StudyDirection,
    useProgressState,
} from "../../hooks/useProgressState";
import {type Grade, isDue, srsStatus} from "../../utils/srs";
import {cancelSpeech, speak, speechAvailable} from "../../utils/speech";
import {impact, success as successHaptic, tick} from "../../utils/haptics";
import {RiveAnimation} from "../ui/RiveAnimation";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {GradeButtons, GRADE_META} from "../cards/GradeButtons";
import {SrsStatusChip} from "../cards/SrsStatusChip";

interface RoomTrainingScreenProps {
    onBack: () => void;
    onComplete: () => void;
    palaceId?: string;
    roomTitle?: string;
    palaceTitle?: string;
}

type Mode = "review" | "browse";
type SwipeAction = "right" | "left" | "up" | "down";

/** Which subset of a room's loci the session studies. */
type Scope =
    | {kind: "all"}
    | {kind: "due"}
    | {kind: "new"}
    | {kind: "learning"}
    | {kind: "flagged"}
    /** A contiguous batch by position, e.g. cards 1–10 (0-indexed [start, end)). */
    | {kind: "range"; start: number; end: number};

/** Cards per range batch (the "1–10 / 11–20" chunks). */
const BATCH = 10;

/** Filter a deck down to the active scope, preserving the room's card order. */
function applyScope(cards: Locus[], scope: Scope): Locus[] {
    switch (scope.kind) {
        case "due":
            return cards.filter((c) => isDue(c.srs));
        case "new":
            return cards.filter((c) => srsStatus(c.srs) === "new");
        case "learning":
            return cards.filter((c) => srsStatus(c.srs) === "learning");
        case "flagged":
            return cards.filter((c) => c.flagged);
        case "range":
            return cards.slice(scope.start, scope.end);
        default:
            return cards;
    }
}

function scopesEqual(a: Scope, b: Scope): boolean {
    if (a.kind !== b.kind) return false;
    if (a.kind === "range" && b.kind === "range") {
        return a.start === b.start && a.end === b.end;
    }
    return true;
}

function shuffle<T>(input: T[]): T[] {
    const a = [...input];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function orderIds(cards: Locus[], order: CardOrder): string[] {
    const ids = cards.map((c) => c.id);
    if (order === "reverse") return [...ids].reverse();
    if (order === "shuffle") return shuffle(ids);
    return ids;
}

export function RoomTrainingScreen({
                                       onBack,
                                       onComplete,
                                       palaceId,
                                       roomTitle = "Room",
                                       palaceTitle = "Memory Palace",
                                   }: RoomTrainingScreenProps) {
    const {state, actions} = useProgressState();
    const reduce = useReducedMotion();

    const palace = state.palaces.find((p) => p.id === palaceId);
    const room = (palace?.rooms || []).find((r) => r.title === roomTitle);
    const roomId = room?.id;
    const settings = palaceSettings(palace);

    // Live cards from the store, so SRS grades reflect immediately. An empty
    // room shows a dedicated empty state below rather than any sample deck.
    const cards: Locus[] = room?.loci ?? [];
    const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

    const [mode, setMode] = useState<Mode>("review");
    const [scope, setScope] = useState<Scope>({kind: "all"});
    const [direction, setDirection] = useState<StudyDirection>(settings.studyDirection);
    const [order, setOrder] = useState<CardOrder>(settings.cardOrder);
    const [flipped, setFlipped] = useState(false);
    const [peek, setPeek] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [editing, setEditing] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [quickOpen, setQuickOpen] = useState(false);

    // Persisted study preferences (kept in local state for instant response,
    // mirrored to the store so they're remembered next session).
    const [shuffleCards, setShuffleCards] = useState(settings.shuffleCards);
    const [textToSpeech, setTextToSpeech] = useState(settings.textToSpeech);
    const [sortIntoPiles, setSortIntoPiles] = useState(settings.sortIntoPiles);
    const persist = (updates: Parameters<typeof actions.updatePalaceSettings>[1]) => {
        if (palaceId) actions.updatePalaceSettings(palaceId, updates);
    };

    // In-study editing needs a real room target.
    const canEditCard = !!roomId && !!palaceId;

    // The active subset to study. `byId` (above) stays built from ALL cards so
    // lookups never break, while every session derives from `scopedCards`.
    const scopedCards = useMemo(() => applyScope(cards, scope), [cards, scope]);

    // Live counts per filter, for the "Cards to study" chips.
    const scopeCounts = useMemo(
        () => ({
            all: cards.length,
            due: cards.filter((c) => isDue(c.srs)).length,
            new: cards.filter((c) => srsStatus(c.srs) === "new").length,
            learning: cards.filter((c) => srsStatus(c.srs) === "learning").length,
            flagged: cards.filter((c) => c.flagged).length,
        }),
        [cards],
    );

    // Range batches ("1–10", "11–20", …) — only meaningful past one batch.
    const batches = useMemo(() => {
        if (cards.length <= BATCH) return [];
        const out: {start: number; end: number; label: string}[] = [];
        for (let start = 0; start < cards.length; start += BATCH) {
            const end = Math.min(start + BATCH, cards.length);
            out.push({start, end, label: `${start + 1}–${end}`});
        }
        return out;
    }, [cards.length]);

    // Review session: a queue of locus ids. New/due cards lead; "Again" requeues.
    const buildReviewQueue = () => {
        const due = scopedCards.filter((c) => isDue(c.srs));
        const base = (due.length > 0 ? due : scopedCards).map((c) => c.id);
        return shuffleCards ? shuffle(base) : base;
    };
    const [reviewQueue, setReviewQueue] = useState<string[]>(buildReviewQueue);
    const [sessionTotal, setSessionTotal] = useState(() => reviewQueue.length);
    const [graded, setGraded] = useState(0);
    const [piles, setPiles] = useState({learning: 0, known: 0});

    // Browse session: an ordered list of ids with a moving pointer.
    const [browseIds, setBrowseIds] = useState<string[]>(() =>
        orderIds(scopedCards, shuffleCards ? "shuffle" : settings.cardOrder),
    );
    const [browsePos, setBrowsePos] = useState(0);

    const currentId = mode === "review" ? reviewQueue[0] : browseIds[browsePos];
    const current = currentId ? byId.get(currentId) : undefined;
    const nextId = mode === "review" ? reviewQueue[1] : browseIds[browsePos + 1];
    const nextCard = nextId ? byId.get(nextId) : undefined;

    // --- Gesture motion values ---------------------------------------------
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);
    const rotate = useTransform(x, [-260, 0, 260], [-10, 0, 10]);
    const gotItOpacity = useTransform(x, [36, 130], [0, 1]);
    const learningOpacity = useTransform(x, [-130, -36], [1, 0]);
    const flagOpacity = useTransform(y, [-130, -40], [1, 0]);
    const skipOpacity = useTransform(y, [40, 130], [0, 1]);

    const [locked, setLocked] = useState(false);
    const holdTimer = useRef<number | undefined>(undefined);
    const heldRef = useRef(false);

    const resetCardView = () => {
        setFlipped(false);
        setPeek(false);
    };

    const finish = () => {
        cancelSpeech();
        setShowSuccess(true);
        successHaptic();
        setTimeout(() => {
            actions.recordTrainingDay();
            actions.addXP(100);
            onComplete();
        }, 2400);
    };

    // Core grade application (no flip guard — used by buttons and swipes alike).
    const applyGrade = (grade: Grade) => {
        if (!currentId) return;
        if (roomId && palaceId) {
            actions.reviewLocus(palaceId, roomId, currentId, grade);
        }
        const rest = reviewQueue.slice(1);
        const next = grade === "again" ? [...rest, currentId] : rest;
        setReviewQueue(next);
        if (grade !== "again") setGraded((g) => g + 1);
        setPiles((p) =>
            grade === "again" || grade === "hard"
                ? {...p, learning: p.learning + 1}
                : {...p, known: p.known + 1},
        );
        resetCardView();
        if (next.length === 0) finish();
    };

    const handleGrade = (grade: Grade) => {
        if (!flipped) return;
        applyGrade(grade);
    };

    const handleBrowseNav = (delta: number) => {
        setBrowsePos((p) => Math.min(browseIds.length - 1, Math.max(0, p + delta)));
        resetCardView();
    };

    // Move past the current card without grading it (review) or advance (browse).
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

    const speakFace = () => {
        if (!current) return;
        const face = flipped
            ? direction === "front"
                ? current.back
                : current.front
            : direction === "front"
                ? current.front
                : current.back;
        speak(face);
    };

    const handleSaveEdit = (data: Omit<Locus, "id" | "srs" | "flagged">) => {
        if (canEditCard && currentId) {
            actions.updateLocus(palaceId!, roomId!, currentId, data);
        }
        setEditing(false);
    };

    const restartSession = (nextOrder: CardOrder = order) => {
        cancelSpeech();
        if (mode === "review") {
            setReviewQueue(buildReviewQueue());
            setSessionTotal(buildReviewQueue().length);
            setGraded(0);
            setPiles({learning: 0, known: 0});
        } else {
            setBrowseIds(orderIds(scopedCards, shuffleCards ? "shuffle" : nextOrder));
            setBrowsePos(0);
        }
        resetCardView();
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        resetCardView();
        if (next === "browse") {
            setBrowseIds(orderIds(scopedCards, shuffleCards ? "shuffle" : order));
            setBrowsePos(0);
        }
    };

    // Pick a new study scope and rebuild the session from it. Deriving the next
    // deck inline avoids depending on `scopedCards` (which updates next render).
    const handleScope = (next: Scope) => {
        setScope(next);
        cancelSpeech();
        const deck = applyScope(cards, next);
        if (mode === "review") {
            const due = deck.filter((c) => isDue(c.srs));
            const base = (due.length > 0 ? due : deck).map((c) => c.id);
            const queue = shuffleCards ? shuffle(base) : base;
            setReviewQueue(queue);
            setSessionTotal(queue.length);
            setGraded(0);
            setPiles({learning: 0, known: 0});
        } else {
            setBrowseIds(orderIds(deck, shuffleCards ? "shuffle" : order));
            setBrowsePos(0);
        }
        resetCardView();
    };

    // --- Swipe commit -------------------------------------------------------
    const performAction = (action: SwipeAction) => {
        if (mode === "review") {
            if (action === "right") applyGrade("good");
            else if (action === "left") applyGrade("again");
            else if (action === "down") handleSkip();
        } else {
            if (action === "right") handleBrowseNav(-1);
            else if (action === "left") handleBrowseNav(1);
            else if (action === "down") handleSkip();
        }
    };

    const snapBack = () => {
        animate(x, 0, {type: "spring", stiffness: 520, damping: 34});
        animate(y, 0, {type: "spring", stiffness: 520, damping: 34});
    };

    const commit = async (action: SwipeAction) => {
        if (locked || !current) return;
        // Up = flag toggle: a nudge, not a card change.
        if (action === "up") {
            handleFlag();
            tick();
            animate(y, 0, {type: "spring", stiffness: 520, damping: 30});
            animate(x, 0, {type: "spring", stiffness: 520, damping: 30});
            return;
        }
        setLocked(true);
        impact();
        const off = 620;
        const tx = action === "right" ? off : action === "left" ? -off : 0;
        const ty = action === "down" ? off : 0;
        const dur = reduce ? 0 : 0.24;
        await Promise.all([
            animate(x, tx, {duration: dur, ease: [0.4, 0, 1, 1]}).finished,
            ty ? animate(y, ty, {duration: dur, ease: [0.4, 0, 1, 1]}).finished : Promise.resolve(),
        ]);
        performAction(action);
        x.jump(0);
        y.jump(0);
        if (!reduce) {
            scale.jump(0.96);
            animate(scale, 1, {type: "spring", stiffness: 540, damping: 32});
        }
        setLocked(false);
    };

    const clearHold = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = undefined;
        }
    };

    const bind = useDrag(
        ({first, down, movement: [mx, my], velocity: [vx, vy], tap}) => {
            if (locked) return;
            // Press-and-hold (no movement) opens the quick-actions sheet.
            if (first) {
                heldRef.current = false;
                clearHold();
                holdTimer.current = window.setTimeout(() => {
                    heldRef.current = true;
                    impact();
                    setQuickOpen(true);
                }, 480);
            }
            if (tap) {
                clearHold();
                if (heldRef.current) {
                    heldRef.current = false;
                    return; // long-press already handled; don't also flip
                }
                setFlipped((f) => !f);
                return;
            }
            if (Math.abs(mx) > 6 || Math.abs(my) > 6) clearHold();
            if (down) {
                x.set(mx);
                y.set(my);
                return;
            }
            clearHold();
            if (heldRef.current) {
                heldRef.current = false;
                snapBack();
                return;
            }
            const ax = Math.abs(mx);
            const ay = Math.abs(my);
            const fling = Math.max(vx, vy) > 0.5;
            if (ax < 80 && ay < 80 && !fling) {
                snapBack();
                return;
            }
            if (ax >= ay) {
                commit(mx > 0 ? "right" : "left");
            } else if (my < 0) {
                commit("up");
            } else {
                commit("down");
            }
        },
        {filterTaps: true, pointer: {touch: true}},
    );

    // Auto-speak the visible face when enabled.
    useEffect(() => {
        if (!textToSpeech || !current) return;
        speak(direction === "front" ? current.front : current.back);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentId, textToSpeech]);
    useEffect(() => {
        if (!textToSpeech || !current || !flipped) return;
        speak(direction === "front" ? current.back : current.front);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flipped]);
    useEffect(
        () => () => {
            cancelSpeech();
            if (holdTimer.current) clearTimeout(holdTimer.current);
        },
        [],
    );

    // Keyboard shortcuts (desktop / external keyboard).
    useEffect(() => {
        if (optionsOpen || quickOpen || editing) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setFlipped((f) => !f);
            } else if (e.key === "ArrowRight") commit("right");
            else if (e.key === "ArrowLeft") commit("left");
            else if (e.key === "ArrowUp") commit("up");
            else if (e.key === "ArrowDown") commit("down");
            else if (mode === "review" && flipped && ["1", "2", "3", "4"].includes(e.key)) {
                handleGrade(GRADE_META[Number(e.key) - 1].grade);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, flipped, locked, optionsOpen, quickOpen, editing, currentId]);

    const reviewProgress = sessionTotal > 0 ? (graded / sessionTotal) * 100 : 0;
    const browseProgress =
        browseIds.length > 0 ? ((browsePos + 1) / browseIds.length) * 100 : 0;
    const progress = mode === "review" ? reviewProgress : browseProgress;

    // A room with no authored cards yet: a real empty state, not a sample deck.
    if (cards.length === 0) {
        return (
            <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF4FF]">
                    <Layers className="h-8 w-8 text-[#3D8FEF]"/>
                </div>
                <div>
                    <h2 className="mb-1 text-2xl font-bold text-[#091A7A]">No cards yet</h2>
                    <p className="mx-auto max-w-[32ch] text-[14px] text-[#475569]">
                        Add a few cards to "{roomTitle}" and they'll appear here to study.
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="rounded-full bg-[#091A7A] px-6 py-3 text-sm font-semibold text-white shadow-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                >
                    Back to room
                </button>
            </div>
        );
    }

    // Review queue emptied: show the success overlay (finish() is mid-flight),
    // or a caught-up state with a way back if the session was already done.
    if (!current) {
        // An active filter/range matched nothing: don't dead-end — explain and
        // offer a one-tap return to the full deck.
        const emptyScope = scopedCards.length === 0 && scope.kind !== "all";
        return (
            <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col items-center justify-center gap-5 px-6 text-center">
                {showSuccess ? (
                    <SuccessOverlay piles={piles}/>
                ) : (
                    <>
                        <Sparkles className="w-12 h-12 text-[#FFC71E]"/>
                        <div>
                            <h2 className="text-2xl font-bold text-[#091A7A] mb-1">
                                {emptyScope ? "Nothing in this selection" : "All caught up"}
                            </h2>
                            <p className="text-[14px] text-[#475569] max-w-[32ch]">
                                {emptyScope
                                    ? "No cards match the filter you picked. Study the whole room, or change the selection."
                                    : "Nothing is due right now. Come back later, or browse the cards."}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {emptyScope ? (
                                <>
                                    <button
                                        onClick={() => setOptionsOpen(true)}
                                        className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#091A7A] border border-[#091A7A]/12"
                                    >
                                        Change selection
                                    </button>
                                    <button
                                        onClick={() => handleScope({kind: "all"})}
                                        className="rounded-full bg-[#091A7A] px-5 py-2.5 text-sm font-semibold text-white"
                                    >
                                        Study all cards
                                    </button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }

    const prompt = direction === "front" ? current.front : current.back;
    const answer = direction === "front" ? current.back : current.front;
    const showPiles = mode === "review" && sortIntoPiles;
    const canSpeak = speechAvailable();

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
                        <p className="text-[12px] text-[#475569] line-clamp-1">{palaceTitle}</p>
                    </div>

                    <motion.button
                        whileTap={{scale: 0.92}}
                        onClick={() => setOptionsOpen(true)}
                        aria-label="Study options"
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                    >
                        <MoreHorizontal className="w-5 h-5"/>
                    </motion.button>
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

            {/* Pile counters (sort-into-piles mode) */}
            {showPiles ? (
                <div className="px-6 flex items-center justify-between">
                    <PileChip
                        tone="learning"
                        count={piles.learning}
                        label="Still learning"
                    />
                    <p className="text-[11px] font-medium text-[#475569]">Swipe to sort</p>
                    <PileChip tone="known" count={piles.known} label="Known"/>
                </div>
            ) : (
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
                    {canSpeak && (
                        <StudyToolButton
                            onClick={speakFace}
                            icon={<Volume2 className="w-4 h-4"/>}
                            label="Listen"
                        />
                    )}
                    <StudyToolButton
                        onClick={handleSkip}
                        icon={<SkipForward className="w-4 h-4"/>}
                        label="Skip"
                    />
                </div>
            )}

            {/* Swipe deck */}
            <div className="flex-1 px-6 flex flex-col items-center justify-center min-h-0 py-3">
                <div className="relative w-full max-w-md [perspective:1200px]">
                    {/* Peek card behind, for depth */}
                    {nextCard && (
                        <div
                            aria-hidden
                            className="absolute inset-x-2 top-3 h-[clamp(300px,52vh,440px)] -z-0 rounded-3xl bg-white/55 border border-white/50 shadow-card"
                            style={{transform: "translateY(14px) scale(0.95)"}}
                        />
                    )}

                    {/* Directional swipe overlays */}
                    <motion.div
                        style={{opacity: gotItOpacity}}
                        className="pointer-events-none absolute left-5 top-5 z-30 rotate-[-12deg] rounded-xl border-2 border-emerald-500 bg-white/90 px-3 py-1.5 text-[15px] font-extrabold uppercase tracking-wide text-emerald-600"
                    >
                        {mode === "review" ? "Got it" : "Prev"}
                    </motion.div>
                    <motion.div
                        style={{opacity: learningOpacity}}
                        className="pointer-events-none absolute right-5 top-5 z-30 rotate-[12deg] rounded-xl border-2 border-amber-500 bg-white/90 px-3 py-1.5 text-[15px] font-extrabold uppercase tracking-wide text-amber-600"
                    >
                        {mode === "review" ? "Learning" : "Next"}
                    </motion.div>
                    <motion.div
                        style={{opacity: flagOpacity}}
                        className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-xl border-2 border-[#B8860B] bg-white/90 px-3 py-1.5 text-[15px] font-extrabold uppercase tracking-wide text-[#B8860B]"
                    >
                        Flag
                    </motion.div>
                    <motion.div
                        style={{opacity: skipOpacity}}
                        className="pointer-events-none absolute left-1/2 bottom-4 z-30 -translate-x-1/2 rounded-xl border-2 border-slate-400 bg-white/90 px-3 py-1.5 text-[15px] font-extrabold uppercase tracking-wide text-slate-500"
                    >
                        Skip
                    </motion.div>

                    {/* Active card */}
                    <motion.div
                        {...(bind() as unknown as HTMLMotionProps<"div">)}
                        style={{x, y, rotate, scale}}
                        className="relative z-10 touch-none"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={currentId}
                                initial={reduce ? {opacity: 0} : {opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                exit={reduce ? {opacity: 0} : {opacity: 0, scale: 0.95}}
                                transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                                className="h-[clamp(300px,52vh,440px)]"
                            >
                                <motion.div
                                    animate={{rotateY: flipped ? 180 : 0}}
                                    transition={
                                        reduce ? {duration: 0} : {duration: 0.5, ease: [0.16, 1, 0.3, 1]}
                                    }
                                    style={{transformStyle: "preserve-3d"}}
                                    className="relative w-full h-full cursor-pointer select-none"
                                >
                                    {/* Front face */}
                                    <div
                                        style={{backfaceVisibility: "hidden"}}
                                        className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl p-7 shadow-elevated border border-white/60 flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4FF] px-2.5 py-1 text-[11px] font-semibold text-[#1E5FBF]">
                                                    <MapPin className="w-3 h-3"/>
                                                    {direction === "front" ? "Recall" : "Term"}
                                                </span>
                                                {mode === "review" && <SrsStatusChip srs={current.srs}/>}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {canSpeak && (
                                                    <button
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            speak(prompt);
                                                        }}
                                                        aria-label="Read aloud"
                                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F8FF] text-[#091A7A] active:scale-90 transition-transform"
                                                    >
                                                        <Volume2 className="w-3.5 h-3.5"/>
                                                    </button>
                                                )}
                                                {current.flagged && (
                                                    <Flag className="w-4 h-4 fill-[#FFC71E] text-[#B8860B]"/>
                                                )}
                                            </div>
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
                                                            onPointerDown={(e) => e.stopPropagation()}
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
                                            Tap to flip · swipe to sort
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
                    </motion.div>
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

            <StudyOptionsSheet
                open={optionsOpen}
                onClose={() => setOptionsOpen(false)}
                mode={mode}
                scope={scope}
                scopeCounts={scopeCounts}
                batches={batches}
                onScope={handleScope}
                direction={direction}
                order={order}
                shuffleCards={shuffleCards}
                textToSpeech={textToSpeech}
                sortIntoPiles={sortIntoPiles}
                canSpeak={canSpeak}
                onMode={switchMode}
                onDirection={(d) => {
                    setDirection(d);
                    persist({studyDirection: d});
                    resetCardView();
                }}
                onOrder={(o) => {
                    setOrder(o);
                    persist({cardOrder: o});
                    if (mode === "browse") restartSession(o);
                }}
                onShuffleCards={(v) => {
                    setShuffleCards(v);
                    persist({shuffleCards: v});
                }}
                onTextToSpeech={(v) => {
                    setTextToSpeech(v);
                    persist({textToSpeech: v});
                    if (!v) cancelSpeech();
                }}
                onSortIntoPiles={(v) => {
                    setSortIntoPiles(v);
                    persist({sortIntoPiles: v});
                }}
                onRestart={() => restartSession()}
                onFinish={finish}
            />

            <QuickActionsSheet
                open={quickOpen}
                onClose={() => setQuickOpen(false)}
                flagged={!!current.flagged}
                canEdit={canEditCard}
                canSpeak={canSpeak}
                onFlag={handleFlag}
                onEdit={() => setEditing(true)}
                onSpeak={speakFace}
                onSkip={handleSkip}
                onRestart={() => restartSession()}
            />

            {/* Footer: grading (review) or navigation (browse) */}
            <div className="px-6 pb-7 pt-2">
                {mode === "review" ? (
                    showPiles ? (
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                whileTap={{scale: 0.96}}
                                onClick={() => commit("left")}
                                className="flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 py-4 font-semibold text-amber-700"
                            >
                                <RotateCcw className="w-5 h-5"/>
                                Still learning
                            </motion.button>
                            <motion.button
                                whileTap={{scale: 0.96}}
                                onClick={() => commit("right")}
                                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-4 font-semibold text-emerald-700"
                            >
                                <Check className="w-5 h-5"/>
                                Got it
                            </motion.button>
                        </div>
                    ) : flipped ? (
                        <GradeButtons srs={current.srs} onGrade={handleGrade}/>
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

            <AnimatePresence>{showSuccess && <SuccessOverlay piles={piles}/>}</AnimatePresence>
        </div>
    );
}

function PileChip({
                      tone,
                      count,
                      label,
                  }: {
    tone: "learning" | "known";
    count: number;
    label: string;
}) {
    const known = tone === "known";
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                known
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
            }`}
        >
            <span
                className={`flex h-6 min-w-6 px-1 items-center justify-center rounded-full text-[12px] font-bold text-white ${
                    known ? "bg-emerald-500" : "bg-amber-500"
                }`}
            >
                {count}
            </span>
            <span
                className={`text-[12px] font-semibold ${
                    known ? "text-emerald-700" : "text-amber-700"
                }`}
            >
                {label}
            </span>
        </div>
    );
}

function SuccessOverlay({piles}: {piles?: {learning: number; known: number}}) {
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
            {piles && piles.known + piles.learning > 0 && (
                <motion.div
                    initial={{y: 16, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.7}}
                    className="mt-4 flex items-center gap-3"
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-emerald-700">
                        <Check className="w-4 h-4"/>
                        {piles.known} known
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[13px] font-semibold text-amber-700">
                        <RotateCcw className="w-4 h-4"/>
                        {piles.learning} still learning
                    </span>
                </motion.div>
            )}
        </motion.div>
    );
}

// --- Study options sheet ----------------------------------------------------

function SegmentedControl<T extends string>({
                                                value,
                                                options,
                                                onChange,
                                            }: {
    value: T;
    options: {value: T; label: string}[];
    onChange: (value: T) => void;
}) {
    return (
        <div className="flex items-center gap-1 rounded-2xl bg-[#F1F5F9] p-1">
            {options.map((o) => {
                const active = o.value === value;
                return (
                    <button
                        key={o.value}
                        onClick={() => onChange(o.value)}
                        className={`flex-1 rounded-xl px-2 py-2.5 text-[13px] font-semibold transition-colors ${
                            active
                                ? "bg-white text-[#091A7A] shadow-sm"
                                : "text-[#64748b] active:text-[#091A7A]"
                        }`}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

function ToggleRow({
                       icon,
                       label,
                       description,
                       checked,
                       onChange,
                       disabled,
                   }: {
    icon: ReactNode;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl bg-[#F4F8FF] px-4 py-3 text-left transition-transform active:scale-[0.99] ${
                disabled ? "opacity-50" : ""
            }`}
        >
            <span className="flex min-w-0 items-center gap-3">
                <span className="text-[#091A7A]">{icon}</span>
                <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-[#091A7A]">{label}</span>
                    {description && (
                        <span className="mt-0.5 block text-[12px] leading-snug text-[#475569]">
                            {description}
                        </span>
                    )}
                </span>
            </span>
            <span
                className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
                    checked ? "bg-[#091A7A]" : "bg-[#CBD5E1]"
                }`}
            >
                <span
                    className={`absolute top-0.5 block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                />
            </span>
        </button>
    );
}

function SheetSection({title, children}: {title: string; children: ReactNode}) {
    return (
        <div className="space-y-2">
            <p className="px-1 text-[12px] font-bold uppercase tracking-wide text-[#94a3b8]">
                {title}
            </p>
            {children}
        </div>
    );
}

/** A selectable pill for the "Cards to study" scope, with an optional count. */
function ScopeChip({
                       label,
                       count,
                       active,
                       onClick,
                   }: {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            whileTap={{scale: 0.94}}
            onClick={onClick}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40 ${
                active
                    ? "bg-[#091A7A] text-white"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#EAF4FF]"
            }`}
        >
            {label}
            {count !== undefined && (
                <span
                    className={`text-[11px] font-bold ${active ? "text-white/70" : "text-[#94a3b8]"}`}
                >
                    {count}
                </span>
            )}
        </motion.button>
    );
}

function StudyOptionsSheet({
                              open,
                              onClose,
                              mode,
                              scope,
                              scopeCounts,
                              batches,
                              onScope,
                              direction,
                              order,
                              shuffleCards,
                              textToSpeech,
                              sortIntoPiles,
                              canSpeak,
                              onMode,
                              onDirection,
                              onOrder,
                              onShuffleCards,
                              onTextToSpeech,
                              onSortIntoPiles,
                              onRestart,
                              onFinish,
                          }: {
    open: boolean;
    onClose: () => void;
    mode: Mode;
    scope: Scope;
    scopeCounts: {all: number; due: number; new: number; learning: number; flagged: number};
    batches: {start: number; end: number; label: string}[];
    onScope: (s: Scope) => void;
    direction: StudyDirection;
    order: CardOrder;
    shuffleCards: boolean;
    textToSpeech: boolean;
    sortIntoPiles: boolean;
    canSpeak: boolean;
    onMode: (m: Mode) => void;
    onDirection: (d: StudyDirection) => void;
    onOrder: (o: CardOrder) => void;
    onShuffleCards: (v: boolean) => void;
    onTextToSpeech: (v: boolean) => void;
    onSortIntoPiles: (v: boolean) => void;
    onRestart: () => void;
    onFinish: () => void;
}) {
    const filterChips: {scope: Scope; label: string; count: number}[] = [
        {scope: {kind: "all"}, label: "All", count: scopeCounts.all},
        {scope: {kind: "due"}, label: "Due", count: scopeCounts.due},
        {scope: {kind: "new"}, label: "New", count: scopeCounts.new},
        {scope: {kind: "learning"}, label: "Learning", count: scopeCounts.learning},
        {scope: {kind: "flagged"}, label: "Flagged", count: scopeCounts.flagged},
    ];
    return (
        <KeyboardSheet
            open={open}
            onClose={onClose}
            title="Flashcard options"
            footer={
                <div className="flex gap-2.5">
                    <button
                        onClick={() => {
                            onRestart();
                            onClose();
                        }}
                        className="flex-1 py-3.5 rounded-2xl font-semibold bg-[#EAF4FF] text-[#091A7A] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <RotateCcw size={18}/>
                        Restart
                    </button>
                    <button
                        onClick={() => {
                            onFinish();
                            onClose();
                        }}
                        className="flex-1 py-3.5 rounded-2xl font-semibold bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <Check size={18}/>
                        Finish
                    </button>
                </div>
            }
        >
            <SheetSection title="Cards to study">
                <div className="flex flex-wrap gap-2">
                    {filterChips.map(
                        ({scope: s, label, count}) =>
                            // Always offer "All"; hide empty filters to avoid dead chips.
                            (s.kind === "all" || count > 0) && (
                                <ScopeChip
                                    key={s.kind}
                                    label={label}
                                    count={count}
                                    active={scopesEqual(scope, s)}
                                    onClick={() => onScope(s)}
                                />
                            ),
                    )}
                </div>
                {batches.length > 0 && (
                    <div className="pt-1">
                        <p className="mb-1.5 px-1 text-[12px] font-semibold text-[#091A7A]">
                            By range
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {batches.map((b) => (
                                <ScopeChip
                                    key={b.label}
                                    label={b.label}
                                    active={
                                        scope.kind === "range" &&
                                        scope.start === b.start &&
                                        scope.end === b.end
                                    }
                                    onClick={() =>
                                        onScope({kind: "range", start: b.start, end: b.end})
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}
            </SheetSection>

            <SheetSection title="General">
                <ToggleRow
                    icon={<Shuffle size={18}/>}
                    label="Shuffle cards"
                    description="Start each session in a random order."
                    checked={shuffleCards}
                    onChange={onShuffleCards}
                />
                <ToggleRow
                    icon={<Volume2 size={18}/>}
                    label="Text to speech"
                    description={
                        canSpeak
                            ? "Read the visible card face aloud."
                            : "Not supported on this device."
                    }
                    checked={textToSpeech}
                    onChange={onTextToSpeech}
                    disabled={!canSpeak}
                />
            </SheetSection>

            <div className="rounded-2xl bg-[#F4F8FF] p-1.5">
                <ToggleRow
                    icon={<Layers size={18}/>}
                    label="Simple sort (no grades)"
                    description="Rate cards with a fast two-way swipe into Still learning / Known. Turn this off to use full Again / Hard / Good / Easy spaced repetition."
                    checked={sortIntoPiles}
                    onChange={onSortIntoPiles}
                />
            </div>

            <SheetSection title="Card orientation">
                <SegmentedControl
                    value={direction}
                    options={[
                        {value: "front", label: "Term"},
                        {value: "back", label: "Definition"},
                    ]}
                    onChange={onDirection}
                />
            </SheetSection>

            <SheetSection title="Mode">
                <SegmentedControl
                    value={mode}
                    options={[
                        {value: "review", label: "Spaced review"},
                        {value: "browse", label: "Browse"},
                    ]}
                    onChange={onMode}
                />
                {mode === "browse" && (
                    <div className="pt-1">
                        <p className="mb-1.5 flex items-center gap-1.5 px-1 text-[12px] font-semibold text-[#091A7A]">
                            <ArrowLeftRight size={14}/>
                            Card order
                        </p>
                        <SegmentedControl
                            value={order}
                            options={[
                                {value: "inOrder", label: "In order"},
                                {value: "shuffle", label: "Shuffle"},
                                {value: "reverse", label: "Reverse"},
                            ]}
                            onChange={onOrder}
                        />
                    </div>
                )}
                <p className="flex items-center gap-1.5 px-1 pt-1 text-[12px] text-[#64748b]">
                    <BookOpen size={14}/>
                    {mode === "review"
                        ? "Spaced review schedules each card by how well you recall it."
                        : "Browse flips through every card, your way."}
                </p>
            </SheetSection>
        </KeyboardSheet>
    );
}

// --- Press-and-hold quick actions -------------------------------------------

function QuickActionsSheet({
                              open,
                              onClose,
                              flagged,
                              canEdit,
                              canSpeak,
                              onFlag,
                              onEdit,
                              onSpeak,
                              onSkip,
                              onRestart,
                          }: {
    open: boolean;
    onClose: () => void;
    flagged: boolean;
    canEdit: boolean;
    canSpeak: boolean;
    onFlag: () => void;
    onEdit: () => void;
    onSpeak: () => void;
    onSkip: () => void;
    onRestart: () => void;
}) {
    const run = (fn: () => void) => () => {
        fn();
        onClose();
    };
    const row =
        "flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-[#091A7A] bg-[#F4F8FF] active:scale-[0.99] transition-transform";
    return (
        <KeyboardSheet open={open} onClose={onClose} title="Quick actions">
            <div className="space-y-2">
                <button onClick={run(onFlag)} disabled={!canEdit} className={`${row} disabled:opacity-50`}>
                    <Flag
                        size={19}
                        className={flagged ? "fill-[#FFC71E] text-[#B8860B]" : "text-[#091A7A]"}
                    />
                    {flagged ? "Remove flag" : "Flag this card"}
                </button>
                <button onClick={run(onEdit)} disabled={!canEdit} className={`${row} disabled:opacity-50`}>
                    <Pencil size={19}/>
                    Edit card
                </button>
                {canSpeak && (
                    <button onClick={run(onSpeak)} className={row}>
                        <Volume2 size={19}/>
                        Read aloud
                    </button>
                )}
                <button onClick={run(onSkip)} className={row}>
                    <SkipForward size={19}/>
                    Skip for now
                </button>
                <button onClick={run(onRestart)} className={row}>
                    <RotateCcw size={19}/>
                    Restart session
                </button>
            </div>
        </KeyboardSheet>
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
    icon: ReactNode;
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

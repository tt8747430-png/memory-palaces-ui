import {type ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {motion} from "motion/react";
import {toast} from "sonner";
import {
    ArrowLeft,
    Brain,
    Check,
    ChevronRight,
    Copy,
    GraduationCap,
    Layers,
    MoreHorizontal,
    Pencil,
    RotateCcw,
    SkipForward,
    Sparkles,
    Star,
    Trash2,
    Volume2,
    Zap,
} from "lucide-react";
import {type Locus, useProgressState} from "../../hooks/useProgressState";
import {srsStatus, type SrsStatus} from "../../utils/srs";
import {speak, speechAvailable} from "../../utils/speech";
import {impact} from "../../utils/haptics";
import {LociPreviewCarousel} from "./LociPreviewCarousel";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface RoomOverviewScreenProps {
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
    /** Open the content manager (cards & questions). */
    onManage: () => void;
}

const SRS_BADGE: Record<SrsStatus, {label: string; cls: string}> = {
    new: {label: "New", cls: "bg-[#EEF2F7] text-[#64748b]"},
    due: {label: "Due", cls: "bg-[#FEE2E2] text-[#B91C1C]"},
    learning: {label: "Learning", cls: "bg-[#FEF3C7] text-[#B45309]"},
    known: {label: "Known", cls: "bg-[#D1FAE5] text-[#047857]"},
};

type Filter = "all" | "learning" | "known" | "starred";

export function RoomOverviewScreen({
                                       palaceId,
                                       roomTitle,
                                       palaceTitle,
                                       onBack,
                                       onStudy,
                                       onMatch,
                                       onTest,
                                       onManage,
                                   }: RoomOverviewScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);
    const room = (palace?.rooms || []).find((r) => r.title === roomTitle);
    const roomId = room?.id;

    const loci = useMemo(() => room?.loci ?? [], [room]);
    const questions = useMemo(() => room?.questions ?? [], [room]);

    const [filter, setFilter] = useState<Filter>("all");
    const [actionLocus, setActionLocus] = useState<Locus | null>(null);

    const canSpeak = speechAvailable();

    const counts = useMemo(() => {
        const c = {new: 0, due: 0, learning: 0, known: 0};
        loci.forEach((l) => {
            c[srsStatus(l.srs)] += 1;
        });
        return c;
    }, [loci]);
    const masteredPct =
        loci.length > 0 ? Math.round((counts.known / loci.length) * 100) : 0;

    const filtered = useMemo(() => {
        if (filter === "all") return loci;
        if (filter === "known") return loci.filter((l) => srsStatus(l.srs) === "known");
        if (filter === "starred") return loci.filter((l) => l.flagged);
        return loci.filter((l) => srsStatus(l.srs) !== "known");
    }, [loci, filter]);

    if (!palace || !room || !roomId) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#ADC8FF] to-white">
                <p className="text-body text-[#6B7280]">Room not found</p>
            </div>
        );
    }

    const filters: {value: Filter; label: string; count: number}[] = [
        {value: "all", label: "All", count: loci.length},
        {value: "learning", label: "Still learning", count: loci.length - counts.known},
        {value: "known", label: "Known", count: counts.known},
        {value: "starred", label: "Starred", count: loci.filter((l) => l.flagged).length},
    ];

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white">
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
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
                        onManage={onManage}
                        onResetAll={() => {
                            actions.resetLociSrs(palaceId, roomId, loci.map((l) => l.id));
                            toast.success("Room progress reset");
                        }}
                        onMarkAllKnown={() => {
                            actions.markLociKnown(palaceId, roomId, loci.map((l) => l.id));
                            toast.success("Marked all as known");
                        }}
                        disabled={loci.length === 0}
                    />
                </div>

                <div className="mt-3">
                    <h1 className="text-[24px] font-bold text-[#091A7A] leading-tight text-balance">
                        {roomTitle}
                    </h1>
                    <p className="mt-0.5 text-[13px] font-medium text-[#475569]">
                        {palaceTitle ? `${palaceTitle} · ` : ""}
                        {loci.length} {loci.length === 1 ? "card" : "cards"}
                    </p>
                </div>
            </div>

            {/* Preview */}
            <div className="px-6 pt-3">
                <LociPreviewCarousel
                    loci={loci}
                    onOpen={loci.length > 0 ? onStudy : undefined}
                    openLabel="Study flashcards"
                    speakable={canSpeak}
                    onAddFirst={onManage}
                />
            </div>

            {/* Mastery strip */}
            {loci.length > 0 && (
                <div className="px-6 pt-5">
                    <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/60 shadow-card p-4">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#091A7A]">
                                <GraduationCap className="w-4 h-4 text-[#3D8FEF]"/>
                                {counts.known} of {loci.length} mastered
                            </span>
                            <span className="text-[13px] font-bold text-[#091A7A]">{masteredPct}%</span>
                        </div>
                        <div className="mt-2.5 h-2 rounded-full bg-[#E8EEF7] overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF]"
                                initial={{width: 0}}
                                animate={{width: `${masteredPct}%`}}
                                transition={{duration: 0.7, ease: "easeOut"}}
                            />
                        </div>
                        <div className="mt-2.5 flex items-center gap-3 text-[11px] font-medium text-[#475569]">
                            <span className="inline-flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#64748b]"/>
                                {counts.new} new
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#B45309]"/>
                                {counts.learning + counts.due} learning
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#047857]"/>
                                {counts.known} known
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Study modes */}
            <div className="px-6 pt-5 space-y-2.5">
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
                            : "Add questions to test this room"
                    }
                    onClick={onTest}
                    disabled={questions.length === 0}
                />
                <ModeTile
                    icon={<Pencil className="w-5 h-5"/>}
                    tint="bg-[#64748b]"
                    label="Manage cards & questions"
                    sublabel="Add, edit, import, and organize"
                    onClick={onManage}
                />
            </div>

            {/* Terms */}
            <div className="px-6 pt-7 pb-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-section-header text-[#091A7A]">Terms</h2>
                    <span className="text-[12px] font-medium text-[#475569]">
                        {filtered.length} shown
                    </span>
                </div>

                {/* Filter pills */}
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
                    {filters.map((f) => {
                        const active = filter === f.value;
                        return (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                                    active
                                        ? "bg-[#091A7A] text-white"
                                        : "bg-white/80 text-[#091A7A] border border-white/60"
                                }`}
                            >
                                {f.label}
                                <span
                                    className={`text-[11px] ${active ? "text-white/75" : "text-[#3D8FEF]"}`}
                                >
                                    {f.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-3 space-y-2.5">
                    {filtered.length === 0 ? (
                        <div className="rounded-2xl bg-white/70 border border-white/60 px-5 py-8 text-center">
                            <p className="text-[14px] font-medium text-[#475569]">
                                {loci.length === 0
                                    ? "No cards in this room yet."
                                    : "No cards match this filter."}
                            </p>
                        </div>
                    ) : (
                        filtered.map((locus) => (
                            <TermRow
                                key={locus.id}
                                locus={locus}
                                canSpeak={canSpeak}
                                onSpeak={() => speak(locus.front)}
                                onToggleStar={() =>
                                    actions.toggleLocusFlag(palaceId, roomId, locus.id)
                                }
                                onOpenActions={() => setActionLocus(locus)}
                            />
                        ))
                    )}
                </div>
            </div>

            <TermActionsSheet
                locus={actionLocus}
                canSpeak={canSpeak}
                onClose={() => setActionLocus(null)}
                onSpeak={(l) => speak(l.front)}
                onToggleStar={(l) => actions.toggleLocusFlag(palaceId, roomId, l.id)}
                onMarkKnown={(l) => {
                    actions.markLociKnown(palaceId, roomId, [l.id]);
                    toast.success("Marked as known");
                }}
                onReset={(l) => {
                    actions.resetLociSrs(palaceId, roomId, [l.id]);
                    toast.success("Progress reset");
                }}
                onDuplicate={(l) => {
                    actions.duplicateLocus(palaceId, roomId, l.id);
                    toast.success("Card duplicated");
                }}
                onEdit={onManage}
                onDelete={(l) => {
                    actions.deleteLoci(palaceId, roomId, [l.id]);
                    toast.success("Card deleted");
                }}
            />
        </div>
    );
}

// --- Screen-level menu ------------------------------------------------------

function RoomMenu({
                      onManage,
                      onResetAll,
                      onMarkAllKnown,
                      disabled,
                  }: {
    onManage: () => void;
    onResetAll: () => void;
    onMarkAllKnown: () => void;
    disabled: boolean;
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
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                    >
                        <MoreHorizontal className="w-5 h-5"/>
                    </motion.button>
                }
            />
            <DropdownMenuContent align="end" className="w-[210px] rounded-[16px] p-1.5">
                <DropdownMenuItem onClick={onManage} className={item}>
                    <Layers size={16} className="text-[#091A7A]"/>
                    Cards & questions
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onMarkAllKnown}
                    className={`${item} ${disabled ? "pointer-events-none opacity-40" : ""}`}
                >
                    <GraduationCap size={16} className="text-[#047857]"/>
                    Mark all as known
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={onResetAll}
                    className={`${item} ${disabled ? "pointer-events-none opacity-40" : ""}`}
                >
                    <RotateCcw size={16} className="text-[#091A7A]"/>
                    Reset all progress
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

// --- Term row ---------------------------------------------------------------

function TermRow({
                     locus,
                     canSpeak,
                     onSpeak,
                     onToggleStar,
                     onOpenActions,
                 }: {
    locus: Locus;
    canSpeak: boolean;
    onSpeak: () => void;
    onToggleStar: () => void;
    onOpenActions: () => void;
}) {
    const status = srsStatus(locus.srs);
    const badge = SRS_BADGE[status];
    const holdTimer = useRef<number | undefined>(undefined);

    const startHold = () => {
        holdTimer.current = window.setTimeout(() => {
            impact();
            onOpenActions();
        }, 480);
    };
    const clearHold = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = undefined;
        }
    };
    useEffect(() => () => clearHold(), []);

    return (
        <div
            onPointerDown={startHold}
            onPointerUp={clearHold}
            onPointerMove={clearHold}
            onPointerCancel={clearHold}
            className="rounded-2xl bg-white border border-[#091A7A]/[0.05] p-4 shadow-[0_6px_16px_rgba(19,44,74,0.06)]"
        >
            <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold text-[#091A7A] leading-snug">
                            {locus.front}
                        </p>
                        <span
                            className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.cls}`}
                        >
                            {badge.label}
                        </span>
                    </div>
                    <p className="mt-1 text-[14px] leading-relaxed text-[#475569]">{locus.back}</p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1">
                    {canSpeak && (
                        <button
                            onClick={onSpeak}
                            aria-label="Read aloud"
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#091A7A] hover:bg-[#F4F8FF] active:scale-90 transition"
                        >
                            <Volume2 size={17}/>
                        </button>
                    )}
                    <button
                        onClick={onToggleStar}
                        aria-label={locus.flagged ? "Remove star" : "Star this card"}
                        aria-pressed={!!locus.flagged}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#FFF7E0] active:scale-90 transition"
                    >
                        <Star
                            size={17}
                            className={
                                locus.flagged
                                    ? "fill-[#FFC71E] text-[#B8860B]"
                                    : "text-[#94a3b8]"
                            }
                        />
                    </button>
                    <button
                        onClick={onOpenActions}
                        aria-label="More actions"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#091A7A] hover:bg-[#F4F8FF] active:scale-90 transition"
                    >
                        <MoreHorizontal size={17}/>
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Term actions sheet (press-hold / ⋯) ------------------------------------

function TermActionsSheet({
                              locus,
                              canSpeak,
                              onClose,
                              onSpeak,
                              onToggleStar,
                              onMarkKnown,
                              onReset,
                              onDuplicate,
                              onEdit,
                              onDelete,
                          }: {
    locus: Locus | null;
    canSpeak: boolean;
    onClose: () => void;
    onSpeak: (l: Locus) => void;
    onToggleStar: (l: Locus) => void;
    onMarkKnown: (l: Locus) => void;
    onReset: (l: Locus) => void;
    onDuplicate: (l: Locus) => void;
    onEdit: () => void;
    onDelete: (l: Locus) => void;
}) {
    const l = locus;
    const run = (fn: () => void) => () => {
        fn();
        onClose();
    };
    const row =
        "flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-[#091A7A] bg-[#F4F8FF] active:scale-[0.99] transition-transform";
    return (
        <KeyboardSheet open={!!l} onClose={onClose} title={l ? l.front : "Card"}>
            {l && (
                <div className="space-y-2">
                    {canSpeak && (
                        <button onClick={run(() => onSpeak(l))} className={row}>
                            <Volume2 size={19}/>
                            Read aloud
                        </button>
                    )}
                    <button onClick={run(() => onToggleStar(l))} className={row}>
                        <Star
                            size={19}
                            className={l.flagged ? "fill-[#FFC71E] text-[#B8860B]" : ""}
                        />
                        {l.flagged ? "Remove star" : "Star this card"}
                    </button>
                    <button onClick={run(() => onMarkKnown(l))} className={row}>
                        <GraduationCap size={19} className="text-[#047857]"/>
                        Mark as known
                    </button>
                    <button onClick={run(() => onReset(l))} className={row}>
                        <SkipForward size={19}/>
                        Reset progress
                    </button>
                    <button onClick={run(() => onDuplicate(l))} className={row}>
                        <Copy size={19}/>
                        Duplicate
                    </button>
                    <button onClick={run(onEdit)} className={row}>
                        <Pencil size={19}/>
                        Edit in manager
                    </button>
                    <button
                        onClick={run(() => onDelete(l))}
                        className="flex w-full items-center gap-3.5 rounded-2xl bg-red-50 px-4 py-3.5 text-[15px] font-semibold text-red-600 active:scale-[0.99] transition-transform"
                    >
                        <Trash2 size={19}/>
                        Delete card
                    </button>
                </div>
            )}
        </KeyboardSheet>
    );
}

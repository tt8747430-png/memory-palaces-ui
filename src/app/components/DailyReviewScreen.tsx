import {useMemo, useState} from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {ArrowLeft, Check, Eye, Layers, MapPin, Sparkles} from "lucide-react";
import {useProgressState} from "../hooks/useProgressState";
import {type Grade, nextIntervalLabel} from "../utils/srs";
import {getDueLoci} from "../utils/dueCards";
import {impact, success as successHaptic, tick} from "../utils/haptics";
import {playComplete} from "../utils/sound";
import {RiveAnimation} from "./ui/RiveAnimation";

interface DailyReviewScreenProps {
    onBack: () => void;
    onComplete: () => void;
}

const GRADES: {grade: Grade; label: string; classes: string}[] = [
    {grade: "again", label: "Again", classes: "bg-red-50 text-red-600 border-red-200"},
    {grade: "hard", label: "Hard", classes: "bg-amber-50 text-amber-600 border-amber-200"},
    {grade: "good", label: "Good", classes: "bg-[#EAF4FF] text-[#091A7A] border-[#ADC8FF]"},
    {grade: "easy", label: "Easy", classes: "bg-emerald-50 text-emerald-600 border-emerald-200"},
];

/** XP for a finished review: rewards effort, capped so it can't be farmed. */
function earnedXp(reviewed: number): number {
    return Math.min(150, Math.max(20, reviewed * 6));
}

export function DailyReviewScreen({onBack, onComplete}: DailyReviewScreenProps) {
    const {state, actions} = useProgressState();
    const reduce = useReducedMotion();

    // Snapshot the due queue once at mount so the session is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialQueue = useMemo(() => getDueLoci(state.palaces), []);
    const [queue, setQueue] = useState(initialQueue);
    const [flipped, setFlipped] = useState(false);
    const [reviewed, setReviewed] = useState(0);
    const [done, setDone] = useState(false);

    const palaceCount = useMemo(
        () => new Set(initialQueue.map((c) => c.palaceId)).size,
        [initialQueue],
    );

    const current = queue[0];
    const progress =
        reviewed + queue.length === 0
            ? 0
            : Math.round((reviewed / (reviewed + queue.length)) * 100);

    const finish = (count: number) => {
        setDone(true);
        successHaptic();
        playComplete();
        setTimeout(() => {
            actions.recordTrainingDay();
            actions.addXP(earnedXp(count));
            onComplete();
        }, 2200);
    };

    const handleGrade = (grade: Grade) => {
        if (!current) return;
        impact();
        actions.reviewLocus(current.palaceId, current.roomId, current.locus.id, grade);
        const count = reviewed + 1;
        setReviewed(count);
        setFlipped(false);
        // "Again" sends the card to the back of the queue; otherwise it leaves.
        const [first, ...rest] = queue;
        const next = grade === "again" ? [...rest, first] : rest;
        setQueue(next);
        if (next.length === 0) finish(count);
    };

    // Empty state (safety net; Home only surfaces the entry when cards are due).
    if (initialQueue.length === 0) {
        return (
            <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-card">
                    <Check className="h-8 w-8 text-[#10B981]"/>
                </div>
                <div>
                    <h2 className="mb-1 text-2xl font-bold text-[#091A7A]">All caught up</h2>
                    <p className="mx-auto max-w-[34ch] text-[14px] text-[#475569]">
                        Nothing is due for review right now. Come back later, or study a palace to get ahead.
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="rounded-full bg-[#091A7A] px-6 py-3 text-sm font-semibold text-white shadow-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                >
                    Back
                </button>
            </div>
        );
    }

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
                        <h1 className="text-section-header text-[#091A7A] font-semibold">Daily Review</h1>
                        <p className="text-[12px] text-[#475569]">
                            {initialQueue.length} due · {palaceCount}{" "}
                            {palaceCount === 1 ? "palace" : "palaces"}
                        </p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[12px] font-semibold text-[#3D8FEF] shadow-card">
                            <Layers className="w-3.5 h-3.5"/>
                            {queue.length}
                        </span>
                    </div>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                        animate={{width: `${progress}%`}}
                        transition={{duration: 0.3}}
                    />
                </div>
            </div>

            {/* Card */}
            <div className="flex-1 px-6 flex flex-col items-center justify-center min-h-0 py-3">
                <div className="relative w-full max-w-md [perspective:1200px]">
                    {queue.length > 1 && (
                        <div
                            aria-hidden
                            className="absolute inset-x-2 top-3 h-[clamp(300px,52vh,440px)] -z-0 rounded-3xl bg-white/55 border border-white/50 shadow-card"
                            style={{transform: "translateY(14px) scale(0.95)"}}
                        />
                    )}

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={current?.locus.id}
                            initial={reduce ? {opacity: 0} : {opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={reduce ? {opacity: 0} : {opacity: 0, scale: 0.95}}
                            transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                            className="relative z-10 h-[clamp(300px,52vh,440px)]"
                        >
                            <motion.div
                                onClick={() => {
                                    tick();
                                    setFlipped((f) => !f);
                                }}
                                animate={{rotateY: flipped ? 180 : 0}}
                                transition={reduce ? {duration: 0} : {duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
                                style={{transformStyle: "preserve-3d"}}
                                className="relative w-full h-full cursor-pointer select-none"
                            >
                                {/* Front */}
                                <div
                                    style={{backfaceVisibility: "hidden"}}
                                    className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl p-7 shadow-elevated border border-white/60 flex flex-col"
                                >
                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EAF4FF] px-2.5 py-1 text-[11px] font-semibold text-[#3D8FEF]">
                                        <MapPin className="w-3 h-3"/>
                                        {current?.palaceName} · {current?.roomTitle}
                                    </span>
                                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center text-center py-2">
                                        <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-[#091A7A] mb-3 text-balance break-words">
                                            {current?.locus.front}
                                        </h2>
                                        {current?.locus.tip && (
                                            <p className="text-[13px] text-[#475569] max-w-[34ch]">
                                                {current.locus.tip}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-center text-[12px] font-medium text-[#475569]">
                                        Tap to reveal
                                    </p>
                                </div>

                                {/* Back */}
                                <div
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}
                                    className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl p-7 shadow-elevated border border-white/60 flex flex-col"
                                >
                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#091A7A]/[0.06] px-2.5 py-1 text-[11px] font-semibold text-[#091A7A]">
                                        Answer
                                    </span>
                                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center text-center py-2">
                                        <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-[#091A7A] mb-3 text-balance break-words">
                                            {current?.locus.back}
                                        </h2>
                                        {current?.locus.hint && (
                                            <p className="text-[13px] text-[#475569] max-w-[34ch]">
                                                {current.locus.hint}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-7 pt-2">
                {flipped ? (
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
                                        {nextIntervalLabel(current?.locus.srs, grade)}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        whileTap={{scale: 0.98}}
                        onClick={() => {
                            tick();
                            setFlipped(true);
                        }}
                        className="w-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white rounded-2xl py-4 shadow-interactive flex items-center justify-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                    >
                        <Eye className="w-5 h-5"/>
                        Show answer
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {done && (
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
                            Review complete
                        </motion.h2>
                        <motion.p
                            initial={{y: 16, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.55}}
                            className="text-xl text-[#10B981] font-semibold flex items-center gap-2"
                        >
                            <Sparkles className="w-5 h-5"/>
                            +{earnedXp(reviewed)} XP
                        </motion.p>
                        <motion.p
                            initial={{y: 16, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.7}}
                            className="mt-3 text-[13px] font-medium text-[#475569]"
                        >
                            {reviewed} {reviewed === 1 ? "card" : "cards"} reviewed
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

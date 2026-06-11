import {useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {ArrowLeft, Check, RotateCcw, Sparkles, Timer, Zap} from "lucide-react";
import {type Locus, useProgressState} from "../../hooks/useProgressState";
import {impact, success as successHaptic, tick} from "../../utils/haptics";

interface MatchGameScreenProps {
    onBack: () => void;
    onComplete: () => void;
    palaceId?: string;
    roomTitle?: string;
    palaceTitle?: string;
}

type Tile = {
    id: string;
    locusId: string;
    kind: "term" | "def";
    text: string;
};

const MAX_PAIRS = 6;
const XP_REWARD = 60;

function shuffle<T>(input: T[]): T[] {
    const a = [...input];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildTiles(loci: Locus[]): Tile[] {
    const chosen = shuffle(loci).slice(0, Math.min(MAX_PAIRS, loci.length));
    const tiles: Tile[] = [];
    for (const l of chosen) {
        tiles.push({id: `${l.id}-t`, locusId: l.id, kind: "term", text: l.front});
        tiles.push({id: `${l.id}-d`, locusId: l.id, kind: "def", text: l.back});
    }
    return shuffle(tiles);
}

function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
}

export function MatchGameScreen({
                                    onBack,
                                    onComplete,
                                    palaceId,
                                    roomTitle = "this room",
                                    palaceTitle,
                                }: MatchGameScreenProps) {
    const {state, actions} = useProgressState();
    const reduce = useReducedMotion();

    const palace = state.palaces.find((p) => p.id === palaceId);
    const room = (palace?.rooms || []).find((r) => r.title === roomTitle);
    const loci = useMemo(() => room?.loci ?? [], [room]);

    const [tiles, setTiles] = useState<Tile[]>(() => buildTiles(loci));
    const [selected, setSelected] = useState<string[]>([]);
    const [matched, setMatched] = useState<Set<string>>(new Set());
    const [wrong, setWrong] = useState<string[]>([]);
    const [moves, setMoves] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [done, setDone] = useState(false);
    const awarded = useRef(false);

    const tileById = useMemo(() => new Map(tiles.map((t) => [t.id, t])), [tiles]);
    const total = tiles.length;

    // Count-up timer until solved.
    useEffect(() => {
        if (done) return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [done]);

    // Win condition.
    useEffect(() => {
        if (total > 0 && matched.size === total && !done) {
            setDone(true);
            successHaptic();
            if (!awarded.current) {
                awarded.current = true;
                actions.addXP(XP_REWARD);
                actions.recordTrainingDay();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matched, total]);

    const reset = () => {
        setTiles(buildTiles(loci));
        setSelected([]);
        setMatched(new Set());
        setWrong([]);
        setMoves(0);
        setElapsed(0);
        setDone(false);
        awarded.current = false;
    };

    const onTile = (tileId: string) => {
        if (done || wrong.length > 0 || matched.has(tileId)) return;
        if (selected.includes(tileId)) {
            setSelected((s) => s.filter((id) => id !== tileId));
            return;
        }
        const next = [...selected, tileId];
        if (next.length < 2) {
            tick();
            setSelected(next);
            return;
        }
        setMoves((m) => m + 1);
        const a = tileById.get(next[0]);
        const b = tileById.get(next[1]);
        if (a && b && a.locusId === b.locusId && a.kind !== b.kind) {
            impact();
            setMatched((prev) => new Set([...prev, a.id, b.id]));
            setSelected([]);
        } else {
            setWrong(next);
            setSelected(next);
            window.setTimeout(() => {
                setWrong([]);
                setSelected([]);
            }, 640);
        }
    };

    // Not enough material to play.
    if (loci.length < 2) {
        return (
            <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF4FF]">
                    <Zap className="h-8 w-8 text-[#3D8FEF]"/>
                </div>
                <div>
                    <h2 className="mb-1 text-2xl font-bold text-[#091A7A]">Not enough cards</h2>
                    <p className="mx-auto max-w-[34ch] text-[14px] text-[#475569]">
                        Match needs at least two cards. Add a few more loci to this room first.
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="rounded-full bg-[#091A7A] px-6 py-3 text-sm font-semibold text-white shadow-interactive"
                >
                    Back
                </button>
            </div>
        );
    }

    const remaining = (total - matched.size) / 2;

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-3">
                <div className="flex items-center justify-between">
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
                            Match
                        </h1>
                        <p className="text-[12px] text-[#475569] line-clamp-1">
                            {palaceTitle ? `${roomTitle} · ${palaceTitle}` : roomTitle}
                        </p>
                    </div>
                    <motion.button
                        whileTap={{scale: 0.92}}
                        onClick={reset}
                        aria-label="Restart"
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                    >
                        <RotateCcw className="w-5 h-5"/>
                    </motion.button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[13px] font-semibold text-[#091A7A] shadow-card">
                        <Timer className="w-4 h-4 text-[#3D8FEF]"/>
                        {formatTime(elapsed)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[13px] font-semibold text-[#091A7A] shadow-card">
                        <Zap className="w-4 h-4 text-[#3D8FEF]"/>
                        {moves} moves
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[13px] font-semibold text-[#091A7A] shadow-card">
                        {remaining} left
                    </span>
                </div>
            </div>

            <p className="px-6 pb-2 text-center text-[12px] font-medium text-[#475569]">
                Tap a term, then its match
            </p>

            {/* Board */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-6 pb-6">
                <div className="grid grid-cols-2 gap-2.5 auto-rows-fr">
                    <AnimatePresence mode="popLayout">
                        {tiles
                            .filter((t) => !matched.has(t.id))
                            .map((t) => {
                                const isSelected = selected.includes(t.id);
                                const isWrong = wrong.includes(t.id);
                                return (
                                    <motion.button
                                        key={t.id}
                                        layout={!reduce}
                                        initial={false}
                                        exit={
                                            reduce
                                                ? {opacity: 0}
                                                : {opacity: 0, scale: 0.7}
                                        }
                                        transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                                        animate={
                                            isWrong && !reduce
                                                ? {x: [0, -7, 7, -5, 5, 0]}
                                                : {x: 0}
                                        }
                                        onClick={() => onTile(t.id)}
                                        className={`min-h-[92px] rounded-2xl border p-3 text-left flex items-center transition-colors ${
                                            isWrong
                                                ? "border-red-300 bg-red-50"
                                                : isSelected
                                                    ? "border-[#091A7A] bg-[#EAF4FF] ring-2 ring-[#091A7A]/20"
                                                    : "border-white/70 bg-white shadow-card active:bg-[#F4F8FF]"
                                        }`}
                                    >
                                        <span
                                            className={`text-[14px] font-semibold leading-snug break-words ${
                                                t.kind === "term"
                                                    ? "text-[#091A7A]"
                                                    : "text-[#475569] font-medium"
                                            }`}
                                        >
                                            {t.text}
                                        </span>
                                    </motion.button>
                                );
                            })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Completion overlay */}
            <AnimatePresence>
                {done && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center px-8 text-center"
                    >
                        <motion.div
                            initial={reduce ? {opacity: 0} : {scale: 0.6, opacity: 0}}
                            animate={reduce ? {opacity: 1} : {scale: 1, opacity: 1}}
                            transition={{type: "spring", stiffness: 320, damping: 20}}
                            className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] shadow-interactive"
                        >
                            <Check className="h-10 w-10 text-white" strokeWidth={3}/>
                        </motion.div>
                        <h2 className="mb-1 text-3xl font-bold text-[#091A7A]">All matched</h2>
                        <p className="text-[15px] text-[#475569]">
                            {formatTime(elapsed)} · {moves} moves
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-[#10B981]">
                            <Sparkles className="h-5 w-5"/>
                            +{XP_REWARD} XP
                        </p>
                        <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
                            <motion.button
                                whileTap={{scale: 0.97}}
                                onClick={reset}
                                className="w-full rounded-2xl bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] py-3.5 font-semibold text-white shadow-interactive flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="h-5 w-5"/>
                                Play again
                            </motion.button>
                            <motion.button
                                whileTap={{scale: 0.97}}
                                onClick={onComplete}
                                className="w-full rounded-2xl bg-white py-3.5 font-semibold text-[#091A7A] border border-[#091A7A]/12"
                            >
                                Done
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

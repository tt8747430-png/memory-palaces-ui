import {useEffect, useState} from "react";
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
import {ChevronLeft, ChevronRight, Layers, Play, Sparkles, Volume2} from "lucide-react";
import type {Locus, StudyDirection} from "../../hooks/useProgressState";
import {speak, speechAvailable} from "../../utils/speech";
import {tick} from "../../utils/haptics";

interface LociPreviewCarouselProps {
    loci: Locus[];
    /** Which face leads: `front` shows the term, `back` shows the definition. */
    direction?: StudyDirection;
    /** Launch the full study session for this deck. */
    onOpen?: () => void;
    /** Label for the open CTA. */
    openLabel?: string;
    /** Read aloud is offered when true and the browser supports speech. */
    speakable?: boolean;
    /** Empty-state action (e.g. add the first locus). */
    onAddFirst?: () => void;
}

/**
 * A peekable flashcard deck (à la Quizlet's preview): one card at a time, swipe
 * or tap the arrows to move, tap the card to flip term/definition. A faint card
 * peeks behind to read as a stack. Reused on the palace detail and room set
 * pages; the full study screen lives in RoomTrainingScreen.
 */
export function LociPreviewCarousel({
                                        loci,
                                        direction = "front",
                                        onOpen,
                                        openLabel = "Study all cards",
                                        speakable = false,
                                        onAddFirst,
                                    }: LociPreviewCarouselProps) {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-220, 0, 220], [-7, 0, 7]);
    const leftHint = useTransform(x, [-120, -30], [1, 0]);
    const rightHint = useTransform(x, [30, 120], [0, 1]);

    const count = loci.length;

    // Keep the pointer in range if the deck shrinks (e.g. a card was deleted).
    useEffect(() => {
        if (index > count - 1) setIndex(Math.max(0, count - 1));
    }, [count, index]);

    const go = (delta: number) => {
        const next = index + delta;
        if (next < 0 || next > count - 1) {
            animate(x, 0, {type: "spring", stiffness: 500, damping: 36});
            return;
        }
        setFlipped(false);
        setIndex(next);
        tick();
        x.set(0);
    };

    const bind = useDrag(
        ({down, movement: [mx], velocity: [vx], direction: [dx], tap}) => {
            if (tap) {
                setFlipped((f) => !f);
                return;
            }
            if (down) {
                x.set(mx);
                return;
            }
            const fling = vx > 0.45;
            if ((mx < -70 || (fling && dx < 0)) && index < count - 1) {
                go(1);
            } else if ((mx > 70 || (fling && dx > 0)) && index > 0) {
                go(-1);
            } else {
                animate(x, 0, {type: "spring", stiffness: 500, damping: 36});
            }
        },
        {axis: "x", filterTaps: true, pointer: {touch: true}},
    );

    if (count === 0) {
        return (
            <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/60 shadow-card px-6 py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4FF]">
                    <Layers className="h-6 w-6 text-[#3D8FEF]"/>
                </div>
                <h3 className="text-[15px] font-bold text-[#091A7A]">No cards yet</h3>
                <p className="mx-auto mt-1 max-w-[30ch] text-[13px] text-[#475569]">
                    Add loci to this room to build a deck you can preview and study.
                </p>
                {onAddFirst && (
                    <button
                        onClick={onAddFirst}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#091A7A] px-4 py-2.5 text-[13px] font-semibold text-white shadow-interactive active:scale-95 transition-transform"
                    >
                        <Sparkles size={15}/>
                        Add a card
                    </button>
                )}
            </div>
        );
    }

    const current = loci[Math.min(index, count - 1)];
    const term = direction === "front" ? current.front : current.back;
    const def = direction === "front" ? current.back : current.front;
    const showSpeak = speakable && speechAvailable();

    return (
        <div>
            <div className="relative [perspective:1400px]">
                {/* Stacked peek card behind, for depth */}
                {count > 1 && (
                    <div
                        aria-hidden
                        className="absolute inset-x-3 top-2 bottom-0 -z-0 rounded-3xl bg-white/55 border border-white/50 shadow-card"
                        style={{transform: "translateY(10px) scale(0.96)"}}
                    />
                )}

                <motion.div
                    {...(bind() as unknown as HTMLMotionProps<"div">)}
                    style={{x, rotate}}
                    className="relative z-10 touch-pan-y"
                >
                    <div className="relative [perspective:1400px]">
                        {/* Directional move hints */}
                        <motion.div
                            style={{opacity: leftHint}}
                            className="pointer-events-none absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#091A7A] p-2 text-white shadow-lg"
                        >
                            <ChevronLeft size={18}/>
                        </motion.div>
                        <motion.div
                            style={{opacity: rightHint}}
                            className="pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#091A7A] p-2 text-white shadow-lg"
                        >
                            <ChevronRight size={18}/>
                        </motion.div>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={current.id}
                                initial={reduce ? {opacity: 0} : {opacity: 0, scale: 0.96}}
                                animate={reduce ? {opacity: 1} : {opacity: 1, scale: 1}}
                                exit={reduce ? {opacity: 0} : {opacity: 0, scale: 0.96}}
                                transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
                                className="h-[clamp(184px,30vh,236px)]"
                            >
                                <motion.div
                                    animate={{rotateY: flipped ? 180 : 0}}
                                    transition={
                                        reduce
                                            ? {duration: 0}
                                            : {duration: 0.45, ease: [0.16, 1, 0.3, 1]}
                                    }
                                    style={{transformStyle: "preserve-3d"}}
                                    className="relative h-full w-full cursor-pointer select-none"
                                >
                                    {/* Term face */}
                                    <div
                                        style={{backfaceVisibility: "hidden"}}
                                        className="absolute inset-0 flex flex-col rounded-3xl border border-white/60 bg-white/95 p-5 shadow-elevated backdrop-blur-xl"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="rounded-full bg-[#EAF4FF] px-2.5 py-1 text-[11px] font-semibold text-[#3D8FEF]">
                                                {direction === "front" ? "Term" : "Definition"}
                                            </span>
                                            {showSpeak && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        speak(term);
                                                    }}
                                                    aria-label="Read aloud"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F8FF] text-[#091A7A] active:scale-90 transition-transform"
                                                >
                                                    <Volume2 size={16}/>
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-1 items-center justify-center px-2 text-center">
                                            <p className="text-[clamp(19px,5.2vw,26px)] font-bold leading-tight text-[#091A7A] text-balance break-words">
                                                {term}
                                            </p>
                                        </div>
                                        <p className="text-center text-[12px] font-medium text-[#94a3b8]">
                                            Tap to flip
                                        </p>
                                    </div>
                                    {/* Definition face */}
                                    <div
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}
                                        className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/95 p-5 text-center shadow-elevated backdrop-blur-xl"
                                    >
                                        <p className="text-[clamp(15px,4vw,18px)] font-semibold leading-snug text-[#091A7A] text-balance break-words">
                                            {def}
                                        </p>
                                        {current.hint && (
                                            <p className="mt-3 max-w-[34ch] text-[13px] italic leading-relaxed text-[#3D6FE0]">
                                                {current.hint}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center justify-between">
                <button
                    onClick={() => go(-1)}
                    disabled={index === 0}
                    aria-label="Previous card"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white text-[#091A7A] shadow-card disabled:opacity-35 active:scale-90 transition-transform"
                >
                    <ChevronLeft size={20}/>
                </button>

                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[#091A7A]">
                        {index + 1} / {count}
                    </span>
                    <div className="flex items-center gap-1.5">
                        {loci.slice(0, 8).map((l, i) => (
                            <span
                                key={l.id}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === Math.min(index, 7)
                                        ? "w-4 bg-[#091A7A]"
                                        : "w-1.5 bg-[#091A7A]/25"
                                }`}
                            />
                        ))}
                        {count > 8 && (
                            <span className="text-[11px] font-medium text-[#091A7A]/45">
                                +{count - 8}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => go(1)}
                    disabled={index >= count - 1}
                    aria-label="Next card"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white text-[#091A7A] shadow-card disabled:opacity-35 active:scale-90 transition-transform"
                >
                    <ChevronRight size={20}/>
                </button>
            </div>

            {onOpen && (
                <motion.button
                    whileTap={{scale: 0.98}}
                    onClick={onOpen}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] py-3.5 font-semibold text-white shadow-interactive"
                >
                    <Play size={18}/>
                    {openLabel}
                </motion.button>
            )}
        </div>
    );
}
